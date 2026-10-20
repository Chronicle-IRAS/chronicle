/**
 * Gargantua-inspired relativistic black hole:
 * - Analytical closest-approach (minR) Einstein photon ring & secondary lensed sub-ring (zero step banding)
 * - Seam-free Cartesian spiral FBM accretion disk with double-arched gravitational lensing (upper + lower halo)
 * - Relativistic Doppler beaming (incandescent white-gold approaching side -> solar crimson-amber receding side)
 */
export function createBlackHolePass(gl: WebGLRenderingContext) {
  const program = gl.createProgram()!
  const shaders: WebGLShader[] = []
  const sources = [
    'attribute vec2 p; varying vec2 uv; void main(){uv=p;gl_Position=vec4(p,0.,1.);}',
    `precision highp float;
    varying vec2 uv; uniform float time; uniform float loading; uniform float spin;
    uniform sampler2D lettering;

    float hash(vec2 p){
      return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);
    }
    float noise(vec2 p){
      vec2 i=floor(p), f=fract(p);
      f=f*f*(3.-2.*f);
      return mix(
        mix(hash(i),hash(i+vec2(1.,0.)),f.x),
        mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),
        f.y
      );
    }
    float fbm(vec2 p){
      float v=0., a=.5;
      mat2 m=mat2(.8,-.6,.6,.8);
      for(int i=0;i<4;i++){
        v+=a*noise(p);
        p=m*p*2.03+vec2(17.1,31.7);
        a*=.5;
      }
      return v;
    }
    mat2 rot2(float a){
      float c=cos(a), s=sin(a);
      return mat2(c,-s,s,c);
    }

    // Blackbody-inspired relativistic plasma palette:
    // t=0: deep burgundy-crimson -> t=0.45: fiery crimson-orange -> t=0.75: molten gold -> t=1.0: blinding ivory-white
    vec3 plasmaColor(float t){
      t=clamp(t,0.,1.35);
      vec3 c0=vec3(.18,.01,.05);
      vec3 c1=vec3(.96,.06,.24);
      vec3 c2=vec3(.99,.68,.28);
      vec3 c3=vec3(1.,.98,.92);
      vec3 col=mix(c0,c1,smoothstep(0.,.38,t));
      col=mix(col,c2,smoothstep(.32,.76,t));
      col=mix(col,c3,smoothstep(.68,1.15,t));
      return col;
    }

    void main(){
      // Low grazing elevation (~8.8 deg) produces the iconic Gargantua double-arched Einstein lensing
      vec3 ro=vec3(sin(time*.16)*.72, 1.16+sin(time*.21)*.18, 7.45+cos(time*.14)*.15);
      vec3 forward=normalize(-ro), right=normalize(cross(forward,vec3(0.,1.,0.))), up=cross(right,forward);
      float roll=.18+sin(time*.19)*.045;
      vec2 screen=rot2(roll)*uv;
      vec3 rd=normalize(forward+screen.x*right*.72+screen.y*up*.72);

      vec3 pos=ro, col=vec3(0.);
      float trans=1., minR=100.;
      bool captured=false;

      for(int i=0;i<185;i++){
        float r=length(pos);
        minR=min(minR,r);
        if(r<.90){
          captured=true;
          break;
        }
        float stepSize=clamp(r*.024,.022,.14);
        // Relativistic geodesic deflection (stronger near the photon sphere r ~ 1.05)
        float bend=1.02/(r*r+.015);
        rd=normalize(rd-normalize(pos)*bend*stepSize);
        vec3 previous=pos;
        pos+=rd*stepSize;

        // Subtle volumetric corona around the equatorial plane
        float radial=length(pos.xz);
        if(abs(pos.y)<.32 && radial>1.15 && radial<4.5){
          float vertical=exp(-abs(pos.y)*16.);
          float radialMask=smoothstep(1.15,1.48,radial)*(1.-smoothstep(3.3,4.5,radial));
          float kepler=time*1.9/pow(max(radial,1.1),1.4)+spin;
          vec2 spiralPos=rot2(kepler-radial*2.1)*pos.xz;
          float turb=fbm(spiralPos*2.6);
          float doppler=clamp(1.-pos.x*.28,.38,1.95);
          float heat=exp(-(radial-1.22)*.58)*(0.65+0.55*turb)*doppler;
          vec3 emission=plasmaColor(heat)*vertical*radialMask*doppler;
          col+=trans*emission*stepSize*.85;
          trans*=exp(-vertical*radialMask*stepSize*.42);
        }

        // Exact analytical equatorial plane intersection (renders both front disk AND bent upper/lower Einstein arches)
        if(previous.y*pos.y<=0.){
          vec3 surface=mix(previous,pos,previous.y/(previous.y-pos.y));
          float sr=length(surface.xz);
          if(sr>1.16 && sr<4.45){
            // Seam-free Cartesian spiral coordinates (zero atan seam, zero trig pinching)
            float omega=time*2.35/pow(max(sr,1.08),1.45)+spin;
            vec2 sp1=rot2(omega-sr*2.35)*surface.xz;
            vec2 sp2=rot2(omega*1.35-sr*3.8)*surface.xz;
            float n1=fbm(sp1*2.8);
            float n2=fbm(sp2*6.2+vec2(n1*1.8));
            float rings=.5+.5*sin(sr*46.-time*1.8+n1*6.5);
            float streaks=smoothstep(.22,.86,n1*.62+n2*.38);
            float filaments=mix(streaks,streaks*rings,.48);

            // Relativistic beaming (approaching left side is fiercely bright & blue/white-hot)
            float doppler=pow(clamp(1.-surface.x*.25,.35,2.05),1.85);
            float innerRim=smoothstep(1.16,1.42,sr)*(1.-smoothstep(3.15,4.45,sr));
            float temp=exp(-max(sr-1.24,0.)*.62)*(.75+.55*filaments)*clamp(doppler*.78,.45,1.65);
            float density=(.28+filaments*1.45)*innerRim;

            col+=trans*plasmaColor(temp)*density*doppler*1.42;
            trans*=.28;

            float sa=atan(surface.z,surface.x);
            float ringV=(sr-2.38)/.55;
            if(loading>.001 && ringV>0. && ringV<1.){
              float ink=texture2D(lettering,vec2(fract((sa-spin)/6.283185-time*.035),ringV)).r;
              col+=trans*ink*vec3(1.,.97,.88)*loading*2.8;
            }
          }
        }
        if(r>12.5) break;
      }

      // Analytical closest-approach Einstein Photon Ring (100% smooth, zero ray-step banding)
      if(!captured){
        float dopplerRim=clamp(1.12-screen.x*.42,.45,1.85);
        float primaryRing=exp(-pow((minR-.935)/.026,2.))*1.85*dopplerRim;
        float secondaryHalo=exp(-pow((minR-1.02)/.095,2.))*.62*dopplerRim;
        float outerGlow=exp(-max(minR-.92,0.)*1.65)*.22;
        col+=plasmaColor(.95)*primaryRing + plasmaColor(.68)*secondaryHalo + vec3(.96,.08,.28)*outerGlow;
      } else {
        // Subtle gravitationally lensed rim glow right at the horizon boundary
        float edgeGlow=exp(-pow((minR-.90)/.018,2.))*.35;
        col+=plasmaColor(.85)*edgeGlow;
      }

      // Subtle background ambient blend so the orb never cuts a harsh black box against the scene
      float vignette=smoothstep(1.38,.35,length(uv));
      vec3 bg=vec3(.025,.010,.018)*(1.- (captured ? 1. : 0.))*vignette;
      col+=bg*.35;

      // Filmic exponential tone-mapping with warm highlight desaturation
      col=1.-exp(-col*1.28);
      col=pow(max(col,vec3(0.)),vec3(.94));
      gl_FragColor=vec4(col,1.);
    }`
  ]
  for (let i=0;i<2;i++) {
    const shader=gl.createShader(i===0?gl.VERTEX_SHADER:gl.FRAGMENT_SHADER)!
    shaders.push(shader); gl.shaderSource(shader,sources[i]); gl.compileShader(shader); gl.attachShader(program,shader)
  }
  gl.linkProgram(program)
  const buffer=gl.createBuffer()!
  const label=document.createElement('canvas'); label.width=2048; label.height=128
  const ctx=label.getContext('2d')!
  ctx.fillStyle='#000'; ctx.fillRect(0,0,2048,128)
  ctx.fillStyle='#fff'; ctx.font='600 74px monospace'; ctx.textBaseline='middle'; ctx.textAlign='center'
  for(let i=0;i<4;i++) ctx.fillText('LOADING',256+i*512,64)
  const texture=gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D,texture)
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,label)
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
  const position=gl.getAttribLocation(program,'p'), time=gl.getUniformLocation(program,'time')
  const loading=gl.getUniformLocation(program,'loading')
  const spin=gl.getUniformLocation(program,'spin')
  return {
    valid: !!gl.getProgramParameter(program,gl.LINK_STATUS),
    draw(elapsed:number, progress:number, rotation:number){gl.useProgram(program);gl.disable(gl.BLEND);gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.colorMask(true,true,true,true);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,texture);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);gl.uniform1f(time,elapsed);gl.uniform1f(loading,progress);gl.uniform1f(spin,rotation);gl.drawArrays(gl.TRIANGLES,0,6)},
    dispose(){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(shader=>gl.deleteShader(shader))}
  }
}
