import { useEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { createStarField } from './field'
import type { SpaceCamera } from './field'
import { createBlackHolePass } from './blackHole'
import { createRenderBudget } from './renderBudget'
import { createThreeStage } from './threeStage'
import { resolveWorldStage } from './worldStage'

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
  gl_FragColor = vec4(mix(vec3(0.96, 0.05, 0.25), vec3(1.0, 0.91, 0.76), vTint), light);
}`

export function SpaceWorld({ camera, reducedMotion }: { camera: SpaceCamera; reducedMotion: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const home = canvas.parentElement!
    const mainRoot = home.closest('main')
    const hole = mainRoot?.querySelector<HTMLElement>('[data-enter-grid-orb]')
    const prelude = mainRoot?.querySelector('[data-scene-id="prelude"]')
    const composer = mainRoot?.querySelector('[data-scene-id="composer"]')
    const currently = mainRoot?.querySelector('[data-scene-id="currently"]')
    const profile = mainRoot?.querySelector('[data-scene-id="profile"]')
    const destinations = mainRoot?.querySelector('[data-scene-id="destinations"]')
    const goodbye = mainRoot?.querySelector('[data-scene-id="goodbye"]')
    const preludeStage = prelude?.querySelector<HTMLElement>('[data-prelude-stage]')
    const composerStage = composer?.querySelector<HTMLElement>('[data-composer-stage]')
    const currentlyStage = currently?.querySelector<HTMLElement>('[data-sculpture-stage]')
    const profileStage = profile?.querySelector<HTMLElement>('[data-sculpture-stage]')
    const goodbyeStage = goodbye?.querySelector<HTMLElement>('[data-goodbye-stage]')
    const destinationContent = destinations?.querySelector<HTMLElement>('[data-selected-orbit]')
    const loadingLabel = hole?.querySelector<HTMLElement | SVGElement>('[data-enter-grid-loading]')
    let dispose = () => {}
    const initialize = () => {
      dispose()
      const attributes: WebGLContextAttributes = { alpha: true, depth: true, antialias: false, powerPreference: 'low-power' }
      const gl = canvas.getContext('webgl2', attributes) ?? canvas.getContext('webgl', attributes)
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
      const blackHole = createBlackHolePass(gl)
      const threeStage = createThreeStage(gl, canvas)
      const budget = createRenderBudget(window.innerWidth < 700 ? 448 : 640)
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
      const hostSizes = new WeakMap<Element, { width: number; height: number }>()
      const hostObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          hostSizes.set(entry.target, { width: entry.contentRect.width, height: entry.contentRect.height })
        }
        dirty = true
      })
      for (const host of [hole, preludeStage, composerStage, currentlyStage, profileStage, goodbyeStage]) {
        if (host) hostObserver.observe(host)
      }
      const resize = () => {
        gl.useProgram(program)
        const dpr = Math.min(window.devicePixelRatio, 1.75)
        canvas.width = Math.round(window.innerWidth * dpr)
        canvas.height = Math.round(window.innerHeight * dpr)
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.uniform1f(aspect, canvas.width / canvas.height)
        gl.uniform1f(ratio, dpr)
        dirty = true
      }
      const syncHostSize = (host: HTMLElement, fallbackSize: number) => {
        const size = hostSizes.get(host)
        const dpr = Math.min(window.devicePixelRatio || 1, 1.75)
        const targetW = Math.max(1, Math.round((size?.width || fallbackSize) * dpr))
        const targetH = Math.max(1, Math.round((size?.height || fallbackSize) * dpr))
        if (canvas.width !== targetW || canvas.height !== targetH) {
          canvas.width = targetW
          canvas.height = targetH
        }
      }
      let lastDepth = NaN
      let lastTurn = NaN
      let lastPan = NaN
      let lastWarp = NaN
      let lastFrame = -1
      let sampleStart = performance.now(), previousTick = sampleStart, frameSum = 0, frameCount = 0, frameMax = 0, drawCount = 0
      const draw = (elapsed: number) => {
        if (import.meta.env.DEV) {
          const now = performance.now(), interval = now - previousTick
          previousTick = now
          if (!document.hidden && interval < 250) { frameSum += interval; frameCount++; frameMax = Math.max(frameMax, interval) }
          if (now - sampleStart > 1500) {
            canvas.dataset.frameMs = (frameSum / Math.max(1, frameCount)).toFixed(1)
            canvas.dataset.frameMaxMs = frameMax.toFixed(1)
            canvas.dataset.renderFps = (drawCount * 1000 / (now - sampleStart)).toFixed(1)
            sampleStart = now; frameSum = 0; frameCount = 0; frameMax = 0; drawCount = 0
          }
        }
        if (document.hidden || gl.isContextLost()) { budget.reset(); return }
        // GSAP already writes these inline. Computed-style reads would flush the
        // transition's pending styles across the entire scene tree every frame.
        const px = Number(mainRoot?.style.getPropertyValue('--ambient-x') || 50)
        const py = Number(mainRoot?.style.getPropertyValue('--ambient-y') || 50)

        const stage = resolveWorldStage({
          active: mainRoot?.querySelector<HTMLElement>('[data-scene-id][data-active="true"]')?.dataset.sceneId,
          boundary: mainRoot?.dataset.transitionFrom,
          direction: mainRoot?.dataset.transitionDirection,
          composerVisible: Number(composerStage?.style.opacity || 1) > .001,
          currentlyVisible: Number(currentlyStage?.style.opacity || 1) > .001,
        })
        const inHole = !!hole && stage === 'black-hole'
        if (inHole && (threeStage || blackHole.valid)) {
          if (canvas.parentElement !== hole) { hole.appendChild(canvas); dirty = true; budget.reset() }
          if ((reducedMotion && !dirty) || (!dirty && elapsed - lastFrame < 1 / 60)) return
          lastFrame = elapsed - Math.max(0, (elapsed - lastFrame) % (1 / 60))
          dirty = false
          const loadingProgress = Number(loadingLabel?.style.opacity || 0)
          const holeSpin = reducedMotion ? 0 : Number(hole.style.getPropertyValue('--hole-spin') || 0)
          if (threeStage) {
            syncHostSize(hole, 760)
            gl.colorMask(true, true, true, true)
            gl.clearColor(0, 0, 0, 0)
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
            threeStage.drawBlackHole(reducedMotion ? 0 : elapsed, loadingProgress, holeSpin, px, py)
          } else {
            if (!reducedMotion) budget.sample(performance.now())
            const resolution = budget.resolution
            if (canvas.width !== resolution || canvas.height !== resolution) canvas.width = canvas.height = resolution
            gl.viewport(0, 0, canvas.width, canvas.height)
            blackHole.draw(reducedMotion ? 0 : elapsed, loadingProgress, holeSpin)
          }
          drawCount++
          return
        }

        // Scene 00 (Prelude): 3D Architectural Armillary Sphere before threshold transition
        const preludeActive = stage === 'prelude'
        if (preludeActive && preludeStage && threeStage && camera.visible === 0) {
          if (canvas.parentElement !== preludeStage) { preludeStage.appendChild(canvas); dirty = true }
          if (!dirty && elapsed - lastFrame < 1 / 60) return
          syncHostSize(preludeStage, 260)
          lastFrame = elapsed - Math.max(0, (elapsed - lastFrame) % (1 / 60))
          dirty = false
          gl.colorMask(true, true, true, true)
          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          threeStage.drawPrelude(reducedMotion ? 0 : elapsed, px, py)
          drawCount++
          return
        }

        // Scene 02 (Stack Composer): 3D Cybernetic Lattice behind the React Flow graph
        const composerActive = stage === 'composer'
        if (composerActive && composerStage && threeStage && camera.visible === 0) {
          if (canvas.parentElement !== composerStage) { composerStage.appendChild(canvas); dirty = true }
          if (!dirty && elapsed - lastFrame < 1 / 60) return
          syncHostSize(composerStage, 640)
          lastFrame = elapsed - Math.max(0, (elapsed - lastFrame) % (1 / 60))
          dirty = false
          const nodeCount = composer?.querySelectorAll('.react-flow__node').length ?? 0
          gl.colorMask(true, true, true, true)
          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          threeStage.drawComposer(reducedMotion ? 0 : elapsed, nodeCount, px, py)
          drawCount++
          return
        }

        // Scenes 03 & 04 (Currently & Profile): Three.js Sculpture Stage when space portal is closed
        const sculptureHost = threeStage && camera.visible === 0
          ? (stage === 'profile' ? profileStage : stage === 'currently' ? currentlyStage : null)
          : null

        if (sculptureHost && threeStage) {
          if (canvas.parentElement !== sculptureHost) {
            sculptureHost.appendChild(canvas)
            dirty = true
          }
          if (!dirty && elapsed - lastFrame < 1 / 60) return
          syncHostSize(sculptureHost, 300)
          lastFrame = elapsed - Math.max(0, (elapsed - lastFrame) % (1 / 60))
          dirty = false
          const sculpture = sculptureHost.closest<HTMLElement>('.chapter-sculpture')
          const playing = sculpture?.getAttribute('data-playing') !== 'false'
          const exploded = sculpture?.getAttribute('data-exploded') === 'true'
          const form = Number(sculpture?.getAttribute('data-form')) || 0
          const isProfile = sculptureHost === profileStage
          const formIndex = (isProfile ? form : form % 3) % 4
          const angle = parseFloat(sculpture?.style.getPropertyValue('--instrument-angle') || '20') || 20
          gl.colorMask(true, true, true, true)
          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          threeStage.drawSculpture(reducedMotion || !playing ? 0 : elapsed, formIndex, angle, exploded, px, py)
          drawCount++
          return
        }

        // Scene 07 (Goodbye): 3D Origami Fleet & Geodesic Compass behind typographic playground
        const goodbyeActive = stage === 'goodbye'
        if (goodbyeActive && goodbyeStage && threeStage && camera.visible === 0) {
          if (canvas.parentElement !== goodbyeStage) { goodbyeStage.appendChild(canvas); dirty = true }
          if (!dirty && elapsed - lastFrame < 1 / 60) return
          syncHostSize(goodbyeStage, 640)
          lastFrame = elapsed - Math.max(0, (elapsed - lastFrame) % (1 / 60))
          dirty = false
          gl.colorMask(true, true, true, true)
          gl.clearColor(0, 0, 0, 0)
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
          threeStage.drawGoodbye(reducedMotion ? 0 : elapsed, px, py)
          drawCount++
          return
        }

        if (canvas.parentElement !== home) { home.appendChild(canvas); gl.useProgram(program); resize() }
        if (gl.isContextLost() || document.hidden || camera.visible === 0) return
        if (reducedMotion && !dirty && lastDepth === camera.depth && lastTurn === camera.turn && lastPan === camera.pan && lastWarp === camera.warp) return
        if (!dirty && elapsed - lastFrame < 1 / 60) return
        lastFrame = elapsed - Math.max(0, (elapsed - lastFrame) % (1 / 60))
        lastDepth = camera.depth; lastTurn = camera.turn; lastPan = camera.pan; lastWarp = camera.warp; dirty = false
        const aspectVal = canvas.width / Math.max(1, canvas.height)
        const dpr = Math.min(window.devicePixelRatio, 1.75)
        // Three caches GL bindings; restore the native pass before sharing the canvas.
        threeStage?.resetState()
        gl.viewport(0, 0, canvas.width, canvas.height)
        gl.colorMask(true, true, true, true)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
        gl.disable(gl.DEPTH_TEST)
        gl.disable(gl.CULL_FACE)
        gl.useProgram(program)
        gl.enable(gl.BLEND)
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE)
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.enableVertexAttribArray(position)
        gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 20, 0)
        gl.enableVertexAttribArray(style)
        gl.vertexAttribPointer(style, 2, gl.FLOAT, false, 20, 12)
        gl.uniform1f(aspect, aspectVal)
        gl.uniform1f(ratio, dpr)
        gl.uniform1f(depth, camera.depth)
        gl.uniform1f(turn, camera.turn)
        gl.uniform1f(pan, camera.pan)
        gl.uniform1f(warp, camera.warp)
        gl.uniform1f(time, reducedMotion ? 0 : elapsed)
        gl.drawArrays(gl.POINTS, 0, count)
        const selectedOrbit = Number(destinationContent?.getAttribute('data-selected-orbit') ?? -1)
        threeStage?.drawSpace(reducedMotion ? 0 : elapsed, camera, aspectVal, selectedOrbit)
        drawCount++
      }
      resize()
      window.addEventListener('resize', resize)
      gsap.ticker.add(draw)
      dispose = () => { gsap.ticker.remove(draw); window.removeEventListener('resize', resize); hostObserver.disconnect(); home.appendChild(canvas); blackHole.dispose(); threeStage?.dispose(); release() }
    }
    const lost = (event: Event) => { event.preventDefault(); canvas.dataset.renderer = 'fallback' }
    canvas.addEventListener('webglcontextlost', lost)
    canvas.addEventListener('webglcontextrestored', initialize)
    initialize()
    return () => { dispose(); canvas.removeEventListener('webglcontextlost', lost); canvas.removeEventListener('webglcontextrestored', initialize) }
  }, [camera, reducedMotion])
  return <div className="space-world" data-space-world aria-hidden="true"><div className="space-nebula" /><div className="stars" /><canvas ref={canvasRef} /><div className="space-meteors"><i /><i /><i /></div></div>
}
