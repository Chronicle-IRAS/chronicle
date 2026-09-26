import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { createStarField } from './field'
import type { SpaceCamera } from './field'

const vertex = `
attribute vec3 aPosition;
attribute vec2 aStyle;
uniform float uDepth;
uniform float uTurn;
uniform float uPan;
uniform float uWarp;
uniform float uAspect;
uniform float uPixelRatio;
uniform float uTime;
varying float vLight;
varying float vTint;
varying float vStretch;
varying vec2 vAxis;
void main() {
  float flight = mod(uTime * 48.0, 1600.0);
  float depth = mod(aPosition.z - uDepth - flight + 4800.0, 1600.0) + 80.0;
  float drift = uTurn + sin(uTime * 0.12) * 0.045;
  float c = cos(drift); float s = sin(drift);
  vec2 sway = vec2(sin(uTime * 0.18) * 22.0, cos(uTime * 0.13) * 16.0 - 16.0);
  vec2 p = mat2(c, -s, s, c) * (aPosition.xy - vec2(uPan, 0.0) + sway);
  vec2 projected = vec2(p.x / depth / uAspect, p.y / depth);
  gl_Position = vec4(projected, 0.0, 1.0);
  vAxis = normalize(vec2(projected.x * uAspect, -projected.y) + vec2(0.0001));
  vStretch = 1.0 + uWarp * 7.0 * (1.0 - depth / 1680.0);
  gl_PointSize = clamp(600.0 * aStyle.x / depth, 1.0, 6.0) * vStretch * uPixelRatio;
  vLight = smoothstep(80.0, 160.0, depth) * (0.45 + 0.55 * (1.0 - depth / 1680.0));
  vLight *= 0.72 + 0.28 * sin(uTime * 1.4 + aPosition.z * 0.03);
  vTint = aStyle.y;
}`
const fragment = `
precision mediump float;
varying float vLight;
varying float vTint;
varying float vStretch;
varying vec2 vAxis;
void main() {
  vec2 q = gl_PointCoord - vec2(0.5);
  float d = length(vec2(dot(q, vAxis), dot(q, vec2(-vAxis.y, vAxis.x)) * vStretch));
  float light = (1.0 - smoothstep(0.0, 0.5, d)) * vLight;
  gl_FragColor = vec4(mix(vec3(0.65, 0.76, 1.0), vec3(1.0, 0.91, 0.76), vTint), light);
}`

export function SpaceWorld({ camera, reducedMotion }: { camera: SpaceCamera; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let dispose = () => {}
    const initialize = () => {
      dispose()
      const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'low-power' })
      if (!gl) { canvas.dataset.renderer = 'fallback'; return }
      const shaders: WebGLShader[] = []
      const program = gl.createProgram()
      const buffer = gl.createBuffer()
      if (!program || !buffer) return
      const compile = (type: number, source: string) => {
        const shader = gl.createShader(type)
        if (!shader) return false
        shaders.push(shader)
        gl.shaderSource(shader, source)
        gl.compileShader(shader)
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) return false
        gl.attachShader(program, shader)
        return true
      }
      const release = () => { gl.deleteBuffer(buffer); gl.deleteProgram(program); shaders.forEach((shader) => gl.deleteShader(shader)) }
      if (!compile(gl.VERTEX_SHADER, vertex) || !compile(gl.FRAGMENT_SHADER, fragment)) { release(); canvas.dataset.renderer = 'fallback'; return }
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { release(); canvas.dataset.renderer = 'fallback'; return }
      canvas.dataset.renderer = 'webgl'
      gl.useProgram(program)
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
      const count = window.innerWidth < 700 ? 1300 : 2400
      gl.bufferData(gl.ARRAY_BUFFER, createStarField(count), gl.STATIC_DRAW)
      const position = gl.getAttribLocation(program, 'aPosition')
      const style = gl.getAttribLocation(program, 'aStyle')
      gl.enableVertexAttribArray(position)
      gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 20, 0)
      gl.enableVertexAttribArray(style)
      gl.vertexAttribPointer(style, 2, gl.FLOAT, false, 20, 12)
      gl.enable(gl.BLEND)
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
      const depth = gl.getUniformLocation(program, 'uDepth')
      const turn = gl.getUniformLocation(program, 'uTurn')
      const pan = gl.getUniformLocation(program, 'uPan')
      const warp = gl.getUniformLocation(program, 'uWarp')
      const aspect = gl.getUniformLocation(program, 'uAspect')
      const ratio = gl.getUniformLocation(program, 'uPixelRatio')
      const time = gl.getUniformLocation(program, 'uTime')
      let dirty = true
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio, 1.75)
        canvas.width = Math.round(window.innerWidth * dpr)
        canvas.height = Math.round(window.innerHeight * dpr)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform1f(aspect, canvas.width / canvas.height)
        gl.uniform1f(ratio, dpr)
        dirty = true
      }
      let lastDepth = NaN
      let lastTurn = NaN
      let lastPan = NaN
      let lastWarp = NaN
      let lastFrame = -1
      const draw = (elapsed: number) => {
        if (gl.isContextLost() || document.hidden || camera.visible === 0) return
        if (reducedMotion && !dirty && lastDepth === camera.depth && lastTurn === camera.turn && lastPan === camera.pan && lastWarp === camera.warp) return
        if (!dirty && elapsed - lastFrame < 1 / 30) return
        lastFrame = elapsed
        lastDepth = camera.depth; lastTurn = camera.turn; lastPan = camera.pan; lastWarp = camera.warp; dirty = false
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(depth, camera.depth)
        gl.uniform1f(turn, camera.turn)
        gl.uniform1f(pan, camera.pan)
        gl.uniform1f(warp, camera.warp)
        gl.uniform1f(time, reducedMotion ? 0 : elapsed)
        gl.drawArrays(gl.POINTS, 0, count)
      }
      resize()
      window.addEventListener('resize', resize)
      gsap.ticker.add(draw)
      dispose = () => { gsap.ticker.remove(draw); window.removeEventListener('resize', resize); release() }
    }
    const lost = (event: Event) => { event.preventDefault(); canvas.dataset.renderer = 'fallback' }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', initialize)
    initialize()
    return () => { dispose(); canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', initialize) }
  }, [camera, reducedMotion])
  return <div className="space-world" data-space-world aria-hidden="true"><div className="space-nebula" /><div className="stars" /><canvas ref={canvasRef} /><div className="space-meteors"><i /><i /><i /></div></div>
}
