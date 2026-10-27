import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DodecahedronGeometry,
  DynamicDrawUsage,
  EdgesGeometry,
  Group,
  IcosahedronGeometry,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  NormalBlending,
  Object3D,
  OctahedronGeometry,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  TorusGeometry,
  TorusKnotGeometry,
  Vector3,
} from 'three'
import type { WebGLRenderer } from 'three'

export type CosmosFieldMode = 'attract' | 'repel' | 'vortex'

export type CosmosStageState = {
  elapsed: number
  dt: number
  alpha: number
  scrollProgress: number
  scrollVelocity: number
  pointerNdcX: number
  pointerNdcY: number
  pointerActive: boolean
  mode: CosmosFieldMode
  theme: 'dark' | 'light'
  overdrive?: boolean
}

export function createCosmosStage(renderer: WebGLRenderer) {
  const scene = new Scene()
  const camera = new PerspectiveCamera(50, 1, 0.1, 80)
  camera.position.set(0, 0.4, 8.2)

  const dummy = new Object3D()
  const cursorWorld = new Vector3(0, 0, 0)
  const unprojectVec = new Vector3()
  const rayDir = new Vector3()

  // Materials (dynamically adapted for Dark / Light theme & scroll alpha)
  const primaryMat = new LineBasicMaterial({
    color: 0xf04132,
    transparent: true,
    opacity: 0,
  })
  const secondaryMat = new LineBasicMaterial({
    color: 0xffa07a,
    transparent: true,
    opacity: 0,
  })
  const subtleGridMat = new LineBasicMaterial({
    color: 0xf2ece4,
    transparent: true,
    opacity: 0,
  })
  const tetherMat = new LineBasicMaterial({
    color: 0xff6958,
    transparent: true,
    opacity: 0,
  })
  const shockwaveMat = new LineBasicMaterial({
    color: 0xff7b68,
    transparent: true,
    opacity: 0,
  })

  // ============================================================================
  // 1. 3D Deformable Spacetime Wave Lattice (BufferGeometry LineSegments)
  // ============================================================================
  const gridCols = 22
  const gridRows = 14
  const gridWidth = 15.5
  const gridHeight = 9.6
  const gridSegmentCount = (gridCols - 1) * gridRows + gridCols * (gridRows - 1)
  const gridPositions = new Float32Array(gridSegmentCount * 2 * 3)
  const gridGeo = new BufferGeometry()
  const gridPosAttr = new BufferAttribute(gridPositions, 3)
  gridPosAttr.setUsage(DynamicDrawUsage)
  gridGeo.setAttribute('position', gridPosAttr)
  const gridMesh = new LineSegments(gridGeo, subtleGridMat)
  gridMesh.position.z = -1.6
  scene.add(gridMesh)

  const vertexGrid = new Float32Array(gridCols * gridRows * 3)
  const computeGridVertex = (
    col: number,
    row: number,
    elapsed: number,
    cx: number,
    cy: number,
    mode: CosmosFieldMode,
    shockX: number,
    shockY: number,
    shockR: number,
    shockActive: boolean,
  ) => {
    const u = col / (gridCols - 1) - 0.5
    const v = row / (gridRows - 1) - 0.5
    let x = u * gridWidth
    let y = v * gridHeight
    let z =
      Math.sin(u * 5.2 + elapsed * 0.85) * 0.22 +
      Math.cos(v * 4.6 - elapsed * 0.72) * 0.22

    const dx = cx - x
    const dy = cy - y
    const dist = Math.hypot(dx, dy)
    if (dist < 3.8) {
      const falloff = Math.pow(1 - dist / 3.8, 2)
      if (mode === 'attract') {
        x += dx * falloff * 0.34
        y += dy * falloff * 0.34
        z -= falloff * 1.15
      } else if (mode === 'repel') {
        x -= (dx / Math.max(0.1, dist)) * falloff * 0.65
        y -= (dy / Math.max(0.1, dist)) * falloff * 0.65
        z += falloff * 1.25
      } else {
        const swirl = falloff * 0.85
        x += -dy * swirl * 0.45
        y += dx * swirl * 0.45
        z += Math.sin(dist * 4 - elapsed * 5) * falloff * 0.75
      }
    }

    if (shockActive) {
      const sdx = x - shockX
      const sdy = y - shockY
      const sdist = Math.hypot(sdx, sdy)
      const band = Math.abs(sdist - shockR)
      if (band < 0.85) {
        const wave = (1 - band / 0.85) * Math.max(0, 1 - shockR / 6.5)
        z += wave * 1.1
        if (sdist > 0.05) {
          x += (sdx / sdist) * wave * 0.28
          y += (sdy / sdist) * wave * 0.28
        }
      }
    }

    const idx = (row * gridCols + col) * 3
    vertexGrid[idx] = x
    vertexGrid[idx + 1] = y
    vertexGrid[idx + 2] = z
  }

  // ============================================================================
  // 2. 3D Gimballed Celestial Astrolabe, Relativistic Plasma Halo & Sacred Polyhedra
  // ============================================================================
  const armillaryGroup = new Group()
  scene.add(armillaryGroup)

  const plasmaGeo = new PlaneGeometry(7.6, 7.6, 1, 1)
  const plasmaMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uAlpha: { value: 0 },
      uEnergy: { value: 0 },
      uColorCore: { value: new Color(0xf04132) },
      uColorRim: { value: new Color(0xffb48a) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = (uv - 0.5) * 2.0;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec2 vUv;
      uniform float uTime;
      uniform float uAlpha;
      uniform float uEnergy;
      uniform vec3 uColorCore;
      uniform vec3 uColorRim;

      void main() {
        float r = length(vUv);
        if (r > 1.0) discard;
        float angle = atan(vUv.y, vUv.x);
        float swirl = sin(angle * 5.0 - uTime * 2.4 + r * 9.0) * 0.5 + 0.5;
        float photonRing = exp(-pow((r - 0.44) * (9.5 - uEnergy * 2.5), 2.0));
        float outerHalo = exp(-pow((r - 0.56) * 4.2, 2.0)) * (0.4 + 0.6 * swirl);
        float coreGlow = exp(-r * 3.8) * (0.18 + uEnergy * 0.25);
        float doppler = 0.72 + 0.28 * cos(angle - uTime * 0.8);
        float intensity = (photonRing * 1.15 + outerHalo * 0.55 + coreGlow) * doppler * (1.0 - smoothstep(0.75, 1.0, r));
        vec3 col = mix(uColorCore, uColorRim, clamp(photonRing + swirl * 0.35, 0.0, 1.0));
        gl_FragColor = vec4(col, intensity * uAlpha * (0.34 + uEnergy * 0.38));
      }
    `,
  })
  const plasmaMesh = new Mesh(plasmaGeo, plasmaMat)
  armillaryGroup.add(plasmaMesh)

  const polyGeos = [
    new EdgesGeometry(new IcosahedronGeometry(1.52, 1)),
    new EdgesGeometry(new TorusKnotGeometry(1.02, 0.24, 68, 10, 2, 3)),
    new EdgesGeometry(new OctahedronGeometry(1.62, 1)),
    new EdgesGeometry(new DodecahedronGeometry(1.48, 0)),
  ]
  const polyMats = polyGeos.map(
    (_, idx) =>
      new LineBasicMaterial({
        color: idx % 2 === 0 ? 0xf04132 : 0xffa07a,
        transparent: true,
        opacity: 0,
      }),
  )
  const polyMeshes = polyGeos.map((geo, idx) => {
    const mesh = new LineSegments(geo, polyMats[idx])
    armillaryGroup.add(mesh)
    return mesh
  })

  const ringGeoA = new EdgesGeometry(new TorusGeometry(2.15, 0.014, 6, 64))
  const ringGeoB = new EdgesGeometry(new TorusGeometry(2.52, 0.012, 6, 72))
  const ringGeoC = new EdgesGeometry(new TorusGeometry(2.92, 0.01, 6, 80))

  const gimbalRingA = new LineSegments(ringGeoA, primaryMat)
  const gimbalRingB = new LineSegments(ringGeoB, secondaryMat)
  const gimbalRingC = new LineSegments(ringGeoC, subtleGridMat)
  gimbalRingA.rotation.x = Math.PI * 0.36
  gimbalRingB.rotation.y = Math.PI * 0.42
  gimbalRingC.rotation.x = -Math.PI * 0.28
  armillaryGroup.add(gimbalRingA, gimbalRingB, gimbalRingC)

  // ============================================================================
  // 3. 72 Interactive 3D Crystal Shards (InstancedMesh with 3D Forcefield Physics)
  // ============================================================================
  const shardCount = 72
  const shardGeo = new OctahedronGeometry(0.11, 0)
  const shardMat = new MeshBasicMaterial({
    color: 0xf04132,
    wireframe: true,
    transparent: true,
    opacity: 0,
  })
  const shardInstanced = new InstancedMesh(shardGeo, shardMat, shardCount)
  scene.add(shardInstanced)

  const shards = Array.from({ length: shardCount }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / shardCount)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    const radius = 2.6 + (i % 7) * 0.52
    const hx = Math.sin(phi) * Math.cos(theta) * radius * 1.45
    const hy = Math.sin(phi) * Math.sin(theta) * radius * 0.95
    const hz = Math.cos(phi) * radius * 0.65
    return {
      hx,
      hy,
      hz,
      x: hx,
      y: hy,
      z: hz,
      vx: 0,
      vy: 0,
      vz: 0,
      scale: 0.65 + (i % 5) * 0.22,
      speed: 0.35 + (i % 6) * 0.14,
      phase: i * 0.87,
    }
  })

  // ============================================================================
  // 4. 3D Cursor Gyroscope Target & Live 3D Constellation Tethers
  // ============================================================================
  const cursorGeo = new EdgesGeometry(new OctahedronGeometry(0.18, 0))
  const cursorMesh = new LineSegments(cursorGeo, tetherMat)
  scene.add(cursorMesh)

  const tetherCount = 6
  const tetherPositions = new Float32Array(tetherCount * 2 * 3)
  const tetherGeo = new BufferGeometry()
  const tetherAttr = new BufferAttribute(tetherPositions, 3)
  tetherAttr.setUsage(DynamicDrawUsage)
  tetherGeo.setAttribute('position', tetherAttr)
  const tetherLines = new LineSegments(tetherGeo, tetherMat)
  scene.add(tetherLines)

  // ============================================================================
  // 5. 3D Expanding Shockwave Torus on Click / Pulse
  // ============================================================================
  const shockGeo = new EdgesGeometry(new TorusGeometry(1, 0.015, 6, 64))
  const shockMesh = new LineSegments(shockGeo, shockwaveMat)
  shockMesh.visible = false
  scene.add(shockMesh)

  const shockState = {
    active: false,
    x: 0,
    y: 0,
    z: 0,
    r: 0.1,
  }

  // ============================================================================
  // 6. 720 GPU 3D Starfield & Accretion Dust Particles (THREE.Points + Shader)
  // ============================================================================
  const dustCount = 720
  const dustPositions = new Float32Array(dustCount * 3)
  const dustSeeds = new Float32Array(dustCount * 2)
  for (let i = 0; i < dustCount; i++) {
    const a = i * 2.39996
    const r = 1.4 + Math.pow((i + 0.5) / dustCount, 0.85) * 9.5
    dustPositions[i * 3] = Math.cos(a) * r * 1.45
    dustPositions[i * 3 + 1] = ((i % 29) / 28 - 0.5) * 10.5
    dustPositions[i * 3 + 2] = Math.sin(a) * r * 0.75 - 1.2
    dustSeeds[i * 2] = 0.5 + (i % 7) * 0.24
    dustSeeds[i * 2 + 1] = (i * 0.618033) % 1
  }
  const dustGeo = new BufferGeometry()
  dustGeo.setAttribute('position', new BufferAttribute(dustPositions, 3))
  dustGeo.setAttribute('aSeed', new BufferAttribute(dustSeeds, 2))

  const dustMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: {
      uTime: { value: 0 },
      uAlpha: { value: 0 },
      uColorA: { value: new Color(0xf04132) },
      uColorB: { value: new Color(0xffd7c2) },
      uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.5) },
    },
    vertexShader: `
      attribute vec2 aSeed;
      uniform float uTime;
      uniform float uPixelRatio;
      varying float vTwinkle;
      varying float vMix;
      void main() {
        vMix = aSeed.y;
        vTwinkle = 0.55 + 0.45 * sin(uTime * (1.4 + aSeed.x) + aSeed.y * 18.0);
        vec3 p = position;
        p.y += sin(uTime * 0.35 + aSeed.y * 12.0) * 0.25;
        vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp((15.0 * aSeed.x * uPixelRatio) / max(1.0, -mvPosition.z), 1.5, 6.5);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uAlpha;
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      varying float vTwinkle;
      varying float vMix;
      void main() {
        float d = length(gl_PointCoord - 0.5) * 2.0;
        if (d > 1.0) discard;
        float glow = pow(1.0 - d, 2.2);
        vec3 col = mix(uColorA, uColorB, vMix);
        gl_FragColor = vec4(col, glow * vTwinkle * uAlpha * 0.72);
      }
    `,
  })
  const dustPoints = new Points(dustGeo, dustMat)
  scene.add(dustPoints)

  let currentTheme: 'dark' | 'light' = 'dark'
  const applyThemeColors = (theme: 'dark' | 'light') => {
    if (theme === currentTheme) return
    currentTheme = theme
    if (theme === 'light') {
      primaryMat.color.setHex(0xd63525)
      secondaryMat.color.setHex(0x8c3b2b)
      subtleGridMat.color.setHex(0x281e1a)
      tetherMat.color.setHex(0xd63525)
      shockwaveMat.color.setHex(0xd63525)
      shardMat.color.setHex(0xc43020)
      polyMats[0].color.setHex(0xd63525)
      polyMats[1].color.setHex(0x3a2a24)
      polyMats[2].color.setHex(0xd63525)
      polyMats[3].color.setHex(0x3a2a24)
      dustMat.uniforms.uColorA.value.setHex(0xd63525)
      dustMat.uniforms.uColorB.value.setHex(0x3a2a24)
      plasmaMat.blending = NormalBlending
      plasmaMat.uniforms.uColorCore.value.setHex(0xd63525)
      plasmaMat.uniforms.uColorRim.value.setHex(0x6e2a1e)
    } else {
      primaryMat.color.setHex(0xf04132)
      secondaryMat.color.setHex(0xffa07a)
      subtleGridMat.color.setHex(0xf2ece4)
      tetherMat.color.setHex(0xff6958)
      shockwaveMat.color.setHex(0xff7b68)
      shardMat.color.setHex(0xf04132)
      polyMats[0].color.setHex(0xf04132)
      polyMats[1].color.setHex(0xffa07a)
      polyMats[2].color.setHex(0xf04132)
      polyMats[3].color.setHex(0xffa07a)
      dustMat.uniforms.uColorA.value.setHex(0xf04132)
      dustMat.uniforms.uColorB.value.setHex(0xffd7c2)
      plasmaMat.blending = AdditiveBlending
      plasmaMat.uniforms.uColorCore.value.setHex(0xf04132)
      plasmaMat.uniforms.uColorRim.value.setHex(0xffb48a)
    }
  }

  const triggerPulse = (ndcX = 0, ndcY = 0) => {
    unprojectVec.set(ndcX, ndcY, 0.5).unproject(camera)
    rayDir.copy(unprojectVec).sub(camera.position).normalize()
    const distToPlane = -camera.position.z / (rayDir.z || -0.001)
    const hitX = camera.position.x + rayDir.x * distToPlane
    const hitY = camera.position.y + rayDir.y * distToPlane

    shockState.active = true
    shockState.x = Math.max(-6, Math.min(6, hitX))
    shockState.y = Math.max(-4, Math.min(4, hitY))
    shockState.z = 0
    shockState.r = 0.15
    shockMesh.visible = true
  }

  let closestDistancePx = 0
  let overdriveLevel = 0

  const render = (state: CosmosStageState, width: number, height: number) => {
    const {
      elapsed,
      dt,
      alpha,
      scrollProgress,
      scrollVelocity,
      pointerNdcX,
      pointerNdcY,
      pointerActive,
      mode,
      theme,
      overdrive = false,
    } = state

    if (alpha <= 0.005) return closestDistancePx

    applyThemeColors(theme)

    const targetOverdrive = overdrive ? 1 : Math.min(0.85, Math.abs(scrollVelocity) * 0.025)
    overdriveLevel += (targetOverdrive - overdriveLevel) * (1 - Math.exp(-dt * 10))

    camera.fov = 50 + overdriveLevel * 16
    camera.aspect = width / Math.max(1, height)
    camera.updateProjectionMatrix()

    // Smoothly orbit 3D camera with scroll progress & pointer parallax
    const camX = Math.sin(scrollProgress * Math.PI * 1.5) * 0.85 + pointerNdcX * 0.55
    const camY = Math.cos(scrollProgress * Math.PI) * 0.35 + pointerNdcY * 0.42
    const camZ = 8.1 - Math.sin(scrollProgress * Math.PI) * 0.75 - overdriveLevel * 1.1
    camera.position.set(camX, camY, camZ)
    camera.lookAt(0, 0, 0)

    // Unproject 2D pointer into z = 0 world plane
    unprojectVec.set(pointerNdcX, pointerNdcY, 0.5).unproject(camera)
    rayDir.copy(unprojectVec).sub(camera.position).normalize()
    const tPlane = -camera.position.z / (rayDir.z || -0.001)
    cursorWorld.set(
      camera.position.x + rayDir.x * tPlane,
      camera.position.y + rayDir.y * tPlane,
      0,
    )

    // Update 3D Shockwave Torus
    if (shockState.active) {
      shockState.r += dt * 7.8
      const progress = shockState.r / 6.5
      if (progress >= 1) {
        shockState.active = false
        shockMesh.visible = false
      } else {
        shockMesh.position.set(shockState.x, shockState.y, shockState.z)
        shockMesh.scale.setScalar(shockState.r)
        shockMesh.rotation.z = elapsed * 2.5
        shockwaveMat.opacity = (1 - progress) * 0.72 * alpha
      }
    }

    // Update material opacities
    const isLight = theme === 'light'
    primaryMat.opacity = (isLight ? 0.24 : 0.26) * alpha
    secondaryMat.opacity = (isLight ? 0.16 : 0.18) * alpha
    subtleGridMat.opacity = (isLight ? 0.085 : 0.065) * alpha
    tetherMat.opacity = (pointerActive ? (isLight ? 0.36 : 0.44) : 0) * alpha
    shardMat.opacity = (isLight ? 0.38 : 0.46) * alpha
    dustMat.uniforms.uTime.value = elapsed
    dustMat.uniforms.uAlpha.value = alpha

    // 1. Update 3D Deformable Spacetime Grid
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        computeGridVertex(
          c,
          r,
          elapsed,
          cursorWorld.x,
          cursorWorld.y,
          mode,
          shockState.x,
          shockState.y,
          shockState.r,
          shockState.active,
        )
      }
    }
    let ptr = 0
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols - 1; c++) {
        const a = (r * gridCols + c) * 3
        const b = (r * gridCols + c + 1) * 3
        gridPositions[ptr++] = vertexGrid[a]
        gridPositions[ptr++] = vertexGrid[a + 1]
        gridPositions[ptr++] = vertexGrid[a + 2]
        gridPositions[ptr++] = vertexGrid[b]
        gridPositions[ptr++] = vertexGrid[b + 1]
        gridPositions[ptr++] = vertexGrid[b + 2]
      }
    }
    for (let c = 0; c < gridCols; c++) {
      for (let r = 0; r < gridRows - 1; r++) {
        const a = (r * gridCols + c) * 3
        const b = ((r + 1) * gridCols + c) * 3
        gridPositions[ptr++] = vertexGrid[a]
        gridPositions[ptr++] = vertexGrid[a + 1]
        gridPositions[ptr++] = vertexGrid[a + 2]
        gridPositions[ptr++] = vertexGrid[b]
        gridPositions[ptr++] = vertexGrid[b + 1]
        gridPositions[ptr++] = vertexGrid[b + 2]
      }
    }
    gridPosAttr.needsUpdate = true

    // 2. Update 3D Gimballed Celestial Astrolabe & Morphing Sacred Polyhedra
    const stageFloat = scrollProgress * 3.0 // 0 -> 3 across chapters 01..04
    const armX = Math.sin(scrollProgress * Math.PI * 2) * 1.65 + pointerNdcX * 0.35
    const armY = Math.cos(scrollProgress * Math.PI * 1.5) * 0.45 + pointerNdcY * 0.25
    armillaryGroup.position.set(armX, armY, -0.35)
    armillaryGroup.rotation.y = elapsed * 0.22 + scrollProgress * Math.PI * 1.4 + pointerNdcX * 0.38
    armillaryGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.24 - pointerNdcY * 0.32

    const spinBoost = 1 + Math.min(2.5, Math.abs(scrollVelocity) * 0.04) + overdriveLevel * 2.2
    gimbalRingA.rotation.z += dt * 0.38 * spinBoost
    gimbalRingB.rotation.x -= dt * 0.31 * spinBoost
    gimbalRingC.rotation.y += dt * 0.24 * spinBoost

    plasmaMesh.quaternion.copy(camera.quaternion)
    plasmaMat.uniforms.uTime.value = elapsed
    plasmaMat.uniforms.uAlpha.value = alpha
    plasmaMat.uniforms.uEnergy.value = overdriveLevel

    polyMeshes.forEach((mesh, idx) => {
      const dist = Math.abs(stageFloat - idx)
      const weight = Math.max(0, 1 - dist * 0.95)
      mesh.visible = weight > 0.02
      if (mesh.visible) {
        const s = 0.65 + weight * 0.42 + overdriveLevel * 0.18
        mesh.scale.setScalar(s)
        mesh.rotation.y = -elapsed * (0.28 + overdriveLevel * 0.55) + idx
        mesh.rotation.z = elapsed * 0.16
        polyMats[idx].opacity = weight * (isLight ? 0.34 : 0.44) * alpha
      }
    })

    // 3. Update 72 Interactive 3D Crystal Shards (InstancedMesh) & Find Closest to Cursor
    const nearest: { dist: number; x: number; y: number; z: number }[] = []

    for (let i = 0; i < shardCount; i++) {
      const s = shards[i]
      const orbitA = elapsed * s.speed * 0.32 + s.phase
      const homeX = s.hx * Math.cos(orbitA * 0.3) - s.hz * Math.sin(orbitA * 0.3)
      const homeY = s.hy + Math.sin(elapsed * 0.7 + s.phase) * 0.32
      const homeZ = s.hz * Math.cos(orbitA * 0.3) + s.hx * Math.sin(orbitA * 0.3)

      const dx = cursorWorld.x - s.x
      const dy = cursorWorld.y - s.y
      const dz = cursorWorld.z - s.z
      const dist = Math.hypot(dx, dy, dz)

      if (pointerActive && dist > 0.08 && dist < 3.4) {
        const force = (1 - dist / 3.4) * 15 * dt
        if (mode === 'attract') {
          s.vx += (dx / dist) * force * 0.75 + (-dy / dist) * force * 0.35
          s.vy += (dy / dist) * force * 0.75 + (dx / dist) * force * 0.35
          s.vz += (dz / dist) * force * 0.5
        } else if (mode === 'repel') {
          s.vx -= (dx / dist) * force * 1.45
          s.vy -= (dy / dist) * force * 1.45
          s.vz -= (dz / dist) * force * 0.85
        } else {
          // 3D Vortex helix
          s.vx += (-dy / dist) * force * 1.35 + (dx / dist) * force * 0.28
          s.vy += (dx / dist) * force * 1.35 + (dy / dist) * force * 0.28
          s.vz += Math.sin(elapsed * 4 + i) * force * 0.45
        }
      }

      if (shockState.active) {
        const sdx = s.x - shockState.x
        const sdy = s.y - shockState.y
        const sdist = Math.hypot(sdx, sdy)
        if (sdist > 0.05 && Math.abs(sdist - shockState.r) < 0.9) {
          const impulse = (1 - Math.abs(sdist - shockState.r) / 0.9) * 26 * dt
          s.vx += (sdx / sdist) * impulse
          s.vy += (sdy / sdist) * impulse
          s.vz += (Math.sin(i) * 0.5) * impulse
        }
      }

      const damping = Math.exp(-dt * 3.8)
      s.vx = (s.vx + (homeX - s.x) * 8.5 * dt) * damping
      s.vy = (s.vy + (homeY - s.y) * 8.5 * dt) * damping
      s.vz = (s.vz + (homeZ - s.z) * 8.5 * dt) * damping
      s.x += s.vx * dt
      s.y += s.vy * dt
      s.z += s.vz * dt

      const speedBoost = 1 + Math.hypot(s.vx, s.vy, s.vz) * 0.25
      const warpZ = 1 + overdriveLevel * 3.2
      dummy.position.set(s.x, s.y, s.z)
      dummy.rotation.set(elapsed * s.speed + i, elapsed * s.speed * 0.8, orbitA)
      const baseScale = s.scale * Math.min(1.8, speedBoost)
      dummy.scale.set(baseScale, baseScale, baseScale * warpZ)
      dummy.updateMatrix()
      shardInstanced.setMatrixAt(i, dummy.matrix)

      nearest.push({ dist, x: s.x, y: s.y, z: s.z })
    }
    shardInstanced.instanceMatrix.needsUpdate = true

    // 4. Update 3D Cursor Target & 6 Closest 3D Constellation Tethers
    cursorMesh.visible = pointerActive
    if (pointerActive) {
      cursorMesh.position.copy(cursorWorld)
      cursorMesh.rotation.x = elapsed * 1.4
      cursorMesh.rotation.y = -elapsed * 1.8
    }

    nearest.sort((a, b) => a.dist - b.dist)
    closestDistancePx = nearest[0] ? Math.round(nearest[0].dist * 68) : 0

    for (let i = 0; i < tetherCount; i++) {
      const item = nearest[i]
      const base = i * 6
      if (pointerActive && item && item.dist < 3.6) {
        tetherPositions[base] = cursorWorld.x
        tetherPositions[base + 1] = cursorWorld.y
        tetherPositions[base + 2] = cursorWorld.z
        tetherPositions[base + 3] = item.x
        tetherPositions[base + 4] = item.y
        tetherPositions[base + 5] = item.z
      } else {
        tetherPositions[base] = 0
        tetherPositions[base + 1] = 0
        tetherPositions[base + 2] = 0
        tetherPositions[base + 3] = 0
        tetherPositions[base + 4] = 0
        tetherPositions[base + 5] = 0
      }
    }
    tetherAttr.needsUpdate = true

    // 5. Rotate 3D Starfield Dust
    dustPoints.rotation.y = elapsed * 0.045 + scrollProgress * 0.65
    dustPoints.rotation.x = pointerNdcY * 0.12

    renderer.clearDepth()
    renderer.render(scene, camera)
    return closestDistancePx
  }

  const dispose = () => {
    gridGeo.dispose()
    plasmaGeo.dispose()
    plasmaMat.dispose()
    polyGeos.forEach(g => g.dispose())
    polyMats.forEach(m => m.dispose())
    ringGeoA.dispose()
    ringGeoB.dispose()
    ringGeoC.dispose()
    shardGeo.dispose()
    shardMat.dispose()
    cursorGeo.dispose()
    tetherGeo.dispose()
    shockGeo.dispose()
    dustGeo.dispose()
    dustMat.dispose()
    primaryMat.dispose()
    secondaryMat.dispose()
    subtleGridMat.dispose()
    tetherMat.dispose()
    shockwaveMat.dispose()
  }

  return {
    render,
    triggerPulse,
    dispose,
  }
}
