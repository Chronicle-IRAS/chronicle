import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { createStarField } from './field'
import type { SpaceCamera } from './field'

const vertex = `
attribute vec3 aPosition;
attribute vec2 aStyle;
uniform float uDepth;
uniform float uTurn;
uniform float uAspect;
uniform float uPixelRatio;
varying float vLight;
varying float vTint;
void main() {
  float depth = mod(aPosition.z - uDepth + 3200.0, 1600.0) + 80.0;
  float c = cos(uTurn); float s = sin(uTurn);
  vec2 p = mat2(c, -s, s, c) * aPosition.xy;
  gl_Position = vec4(p.x / depth / uAspect, p.y / depth, 0.0, 1.0);
  gl_PointSize = clamp(480.0 * aStyle.x / depth, 1.0, 4.5) * uPixelRatio;
  vLight = smoothstep(80.0, 160.0, depth) * (0.45 + 0.55 * (1.0 - depth / 1680.0));
  vTint = aStyle.y;
}`
const fragment = `
precision mediump float;
varying float vLight;
varying float vTint;
void main() {
  float d = length(gl_PointCoord - vec2(0.5));
  float light = (1.0 - smoothstep(0.0, 0.5, d)) * vLight;
  gl_FragColor = vec4(mix(vec3(0.65, 0.76, 1.0), vec3(1.0, 0.91, 0.76), vTint), light);
}`

export function SpaceWorld({ camera }: { camera: SpaceCamera }) {
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
      const aspect = gl.getUniformLocation(program, 'uAspect')
      const ratio = gl.getUniformLocation(program, 'uPixelRatio')
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
      const draw = () => {
        if (gl.isContextLost() || document.hidden || camera.visible === 0) return
        if (!dirty && lastDepth === camera.depth && lastTurn === camera.turn) return
        lastDepth = camera.depth; lastTurn = camera.turn; dirty = false
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)
        gl.uniform1f(depth, camera.depth)
        gl.uniform1f(turn, camera.turn)
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
  }, [camera])
  return <div className="space-world" data-space-world aria-hidden="true"><div className="space-nebula" /><div className="stars" /><canvas ref={canvasRef} /></div>
}
