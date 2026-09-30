/** A ray-marched volume: tilted disk emission, horizon occlusion and bent view rays. */
export function createBlackHolePass(gl: WebGLRenderingContext) {
  const program = gl.createProgram()!
  const shaders: WebGLShader[] = []
  const sources = [
    'attribute vec2 p; varying vec2 uv; void main(){uv=p;gl_Position=vec4(p,0.,1.);}',
    `precision mediump float;
    varying vec2 uv; uniform float time; uniform float loading;
    uniform sampler2D lettering;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
    void main(){
      vec3 ro=vec3(sin(time*.035)*.5,1.8,7.5);
      vec3 forward=normalize(-ro), right=normalize(cross(forward,vec3(0.,1.,0.))), up=cross(right,forward);
      vec3 rd=normalize(forward+uv.x*right*.72+uv.y*up*.72);
      float roll=.13; mat2 rot=mat2(cos(roll),-sin(roll),sin(roll),cos(roll));
      rd.xy=rot*rd.xy;
      vec3 pos=ro, col=vec3(0.); float trans=1.;
      for(int i=0;i<180;i++){
        float r=length(pos);
        if(r<.88){trans=0.;break;}
        float stepSize=clamp(r*.025,.025,.15);
        rd=normalize(rd-normalize(pos)*(.65/(r*r))*stepSize);
        vec3 previous=pos;
        pos+=rd*stepSize;
        float radial=length(pos.xz);
        float disk=exp(-abs(pos.y)*18.)*smoothstep(1.25,1.65,radial)*(1.-smoothstep(3.1,4.3,radial));
        float angle=atan(pos.z,pos.x);
        float turbulence=noise(vec2(radial*9.,angle*7.-time*.5))+ .5*noise(vec2(radial*23.,angle*13.-time*.8));
        float flow=.55+.45*turbulence;
        float filaments=.83+.17*sin(radial*62.+turbulence*4.);
        float doppler=clamp(1.-pos.x*.18,.45,1.8);
        vec3 heat=mix(vec3(.95,.33,.07),vec3(1.,.88,.64),exp(-(radial-1.3)*.55));
        col+=trans*disk*heat*flow*filaments*doppler*stepSize*3.;
        if(previous.y*pos.y<0.) {
          vec3 surface=mix(previous,pos,previous.y/(previous.y-pos.y));
          float ringV=(length(surface.xz)-2.45)/.55;
          if(ringV>0. && ringV<1.) {
            float ink=texture2D(lettering,vec2(fract(atan(surface.z,surface.x)/6.283185-time*.035),ringV)).r;
            col+=trans*ink*vec3(1.,.97,.84)*loading*2.5;
          }
        }
        trans*=exp(-disk*stepSize*.55);
        col+=vec3(1.,.56,.18)*exp(-abs(r-1.03)*35.)*.018;
        if(length(pos)>12.)break;
      }
      col=1.-exp(-col*1.5);
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
  return {
    valid: !!gl.getProgramParameter(program,gl.LINK_STATUS),
    draw(elapsed:number, progress:number){gl.useProgram(program);gl.disable(gl.BLEND);gl.bindTexture(gl.TEXTURE_2D,texture);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);gl.uniform1f(time,elapsed);gl.uniform1f(loading,progress);gl.drawArrays(gl.TRIANGLES,0,6)},
    dispose(){gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(shader=>gl.deleteShader(shader))}
  }
}
