/** A ray-marched volume: tilted disk emission, horizon occlusion and bent view rays. */
export function createBlackHolePass(gl: WebGLRenderingContext) {
  const program = gl.createProgram()!
  const shaders: WebGLShader[] = []
  const sources = [
    'attribute vec2 p; varying vec2 uv; void main(){uv=p;gl_Position=vec4(p,0.,1.);}',
    `precision mediump float;
    varying vec2 uv; uniform float time;
    void main(){
      vec3 ro=vec3(sin(time*.09)*2.,2.2+sin(time*.13)*.45,7.5);
      vec3 forward=normalize(-ro), right=normalize(cross(forward,vec3(0.,1.,0.))), up=cross(right,forward);
      vec3 rd=normalize(forward+uv.x*right*.72+uv.y*up*.72);
      float roll=sin(time*.12)*.12; mat2 rot=mat2(cos(roll),-sin(roll),sin(roll),cos(roll));
      rd.xy=rot*rd.xy;
      vec3 pos=ro, col=vec3(0.); float trans=1.;
      for(int i=0;i<110;i++){
        float r=length(pos);
        if(r<.88){trans=0.;break;}
        float stepSize=clamp(r*.055,.045,.3);
        rd=normalize(rd-normalize(pos)*(.075/(r*r))*stepSize);
        pos+=rd*stepSize;
        float radial=length(pos.xz);
        float disk=exp(-abs(pos.y)*30.)*smoothstep(1.15,1.5,radial)*(1.-smoothstep(3.2,4.1,radial));
        float angle=atan(pos.z,pos.x);
        float flow=.65+.35*sin(radial*38.+angle*5.-time*2.8);
        float filaments=.75+.25*sin(radial*81.-angle*9.+time*1.3);
        vec3 heat=mix(vec3(1.,.22,.025),vec3(1.,.92,.64),exp(-(radial-1.3)*.65));
        col+=trans*disk*heat*flow*filaments*stepSize*3.5;
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
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW)
  const position=gl.getAttribLocation(program,'p'), time=gl.getUniformLocation(program,'time')
  return {
    valid: !!gl.getProgramParameter(program,gl.LINK_STATUS),
    draw(elapsed:number){gl.useProgram(program);gl.disable(gl.BLEND);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);gl.uniform1f(time,elapsed);gl.drawArrays(gl.TRIANGLES,0,6)},
    dispose(){gl.deleteBuffer(buffer);gl.deleteProgram(program);shaders.forEach(shader=>gl.deleteShader(shader))}
  }
}
