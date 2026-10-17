import * as THREE from 'three'
import type { SpaceCamera } from './field'

export function createThreeStage(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
  // Modern Three requires WebGL 2. Native passes and CSS art still work without it.
  if (!('texImage3D' in gl)) return null
  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      context: gl,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    })
  } catch {
    return null
  }
  renderer.autoClear = false

  // --- Scene 1: Chapter Sculpture Stage (Scenes 03 Currently & 04 Profile) ---
  const sculptureScene = new THREE.Scene()
  const sculptureCam = new THREE.PerspectiveCamera(42, 1, 0.1, 50)
  sculptureCam.position.set(0, 0, 5.2)

  const rootGroup = new THREE.Group()
  sculptureScene.add(rootGroup)

  const crimsonMat = new THREE.LineBasicMaterial({ color: 0xf40c3f, transparent: true, opacity: 0.78 })
  const goldMat = new THREE.LineBasicMaterial({ color: 0xf2c97d, transparent: true, opacity: 0.58 })
  const ivoryMat = new THREE.LineBasicMaterial({ color: 0xfdfaf5, transparent: true, opacity: 0.42 })

  const polyGeometries = [
    new THREE.IcosahedronGeometry(1.38, 1),
    new THREE.OctahedronGeometry(1.46, 1),
    new THREE.TorusKnotGeometry(0.88, 0.24, 56, 8, 2, 3),
    new THREE.DodecahedronGeometry(1.38, 0),
  ]
  const polyWireframes = polyGeometries.map((geo, index) => {
    const edges = new THREE.EdgesGeometry(geo)
    const lines = new THREE.LineSegments(edges, index % 2 === 0 ? crimsonMat : goldMat)
    lines.visible = index === 0
    rootGroup.add(lines)
    return lines
  })

  // Dual orthogonal gyroscope rings
  const ringGeoA = new THREE.EdgesGeometry(new THREE.TorusGeometry(1.82, 0.015, 6, 48))
  const ringGeoB = new THREE.EdgesGeometry(new THREE.TorusGeometry(2.08, 0.012, 6, 48))
  const gyroRingA = new THREE.LineSegments(ringGeoA, goldMat)
  const gyroRingB = new THREE.LineSegments(ringGeoB, ivoryMat)
  gyroRingA.rotation.x = Math.PI * 0.35
  gyroRingB.rotation.y = Math.PI * 0.4
  rootGroup.add(gyroRingA, gyroRingB)

  // InstancedMesh of 36 orbiting tetrahedral shards
  const shardCount = 36
  const shardGeo = new THREE.TetrahedronGeometry(0.11, 0)
  const shardMat = new THREE.MeshBasicMaterial({
    color: 0xf40c3f,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
  })
  const shardInstanced = new THREE.InstancedMesh(shardGeo, shardMat, shardCount)
  const dummy = new THREE.Object3D()
  const shardSeeds = Array.from({ length: shardCount }, (_, i) => {
    const phi = Math.acos(1 - (2 * (i + 0.5)) / shardCount)
    const theta = Math.PI * (1 + Math.sqrt(5)) * i
    return {
      nx: Math.sin(phi) * Math.cos(theta),
      ny: Math.sin(phi) * Math.sin(theta),
      nz: Math.cos(phi),
      radius: 1.45 + (i % 5) * 0.14,
      speed: 0.4 + (i % 7) * 0.12,
    }
  })
  rootGroup.add(shardInstanced)

  // BufferGeometry Points halo around sculpture
  const dustCount = 96
  const dustPositions = new Float32Array(dustCount * 3)
  for (let i = 0; i < dustCount; i++) {
    const r = 1.6 + (i % 9) * 0.12
    const a = i * 2.39996
    const b = (i / dustCount - 0.5) * Math.PI
    dustPositions[i * 3] = Math.cos(a) * Math.cos(b) * r
    dustPositions[i * 3 + 1] = Math.sin(b) * r
    dustPositions[i * 3 + 2] = Math.sin(a) * Math.cos(b) * r
  }
  const dustGeo = new THREE.BufferGeometry()
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3))
  const dustMat = new THREE.PointsMaterial({ color: 0xf2c97d, size: 0.045, transparent: true, opacity: 0.7 })
  const dustPoints = new THREE.Points(dustGeo, dustMat)
  rootGroup.add(dustPoints)

  let currentExpand = 0

  // --- Scene 2: Deep Space 3D Corridor (Scenes 04 Portal -> 05 Space -> 06 Destinations) ---
  const spaceScene = new THREE.Scene()
  const spaceCam = new THREE.PerspectiveCamera(60, 1, 1, 2000)

  const crystalCount = 32
  const crystalGeo = new THREE.OctahedronGeometry(14, 0)
  const crystalMat = new THREE.MeshBasicMaterial({
    color: 0xf40c3f,
    wireframe: true,
    transparent: true,
    opacity: 0.36,
  })
  const crystalInstanced = new THREE.InstancedMesh(crystalGeo, crystalMat, crystalCount)
  const crystalSeeds = Array.from({ length: crystalCount }, (_, i) => {
    const angle = i * 2.39996
    const radius = 140 + (i % 7) * 65
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.72,
      z: (i * 50) % 1600,
      scale: 0.65 + (i % 4) * 0.32,
      spin: 0.3 + (i % 5) * 0.18,
    }
  })
  spaceScene.add(crystalInstanced)

  // Sacred geometry astrolabe gates along the warp corridor
  const gateGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(120, 1))
  const gateMat = new THREE.LineBasicMaterial({ color: 0xf2c97d, transparent: true, opacity: 0.16 })
  const gates = [0, 1, 2].map((i) => {
    const gate = new THREE.LineSegments(gateGeo, gateMat)
    gate.position.z = -350 - i * 480
    spaceScene.add(gate)
    return { mesh: gate, baseZ: i * 533 }
  })

  const drawSculpture = (
    elapsed: number,
    formIndex: number,
    angleDeg: number,
    exploded: boolean,
    px: number,
    py: number,
  ) => {
    renderer.resetState()
    renderer.setViewport(0, 0, canvas.width, canvas.height)
    sculptureCam.aspect = canvas.width / Math.max(1, canvas.height)
    sculptureCam.updateProjectionMatrix()

    const targetExpand = exploded ? 1 : 0
    currentExpand += (targetExpand - currentExpand) * 0.12

    polyWireframes.forEach((mesh, idx) => {
      mesh.visible = idx === formIndex % polyWireframes.length
      if (mesh.visible) {
        mesh.scale.setScalar(1 + currentExpand * 0.28)
      }
    })

    const rad = (angleDeg * Math.PI) / 180
    rootGroup.rotation.z = rad * 0.5
    rootGroup.rotation.y = elapsed * 0.35 + ((px - 50) / 50) * 0.45
    rootGroup.rotation.x = Math.sin(elapsed * 0.25) * 0.22 + ((py - 50) / 50) * -0.35

    gyroRingA.rotation.z = elapsed * 0.42
    gyroRingB.rotation.x = -elapsed * 0.31
    gyroRingA.scale.setScalar(1 + currentExpand * 0.22)
    gyroRingB.scale.setScalar(1 + currentExpand * 0.3)

    for (let i = 0; i < shardCount; i++) {
      const s = shardSeeds[i]
      const orbitAngle = elapsed * s.speed + i
      const r = s.radius * (1 + currentExpand * 0.65)
      dummy.position.set(
        s.nx * r + Math.cos(orbitAngle) * 0.12,
        s.ny * r + Math.sin(orbitAngle) * 0.12,
        s.nz * r,
      )
      dummy.rotation.set(orbitAngle, orbitAngle * 0.7, i)
      const sc = 0.8 + currentExpand * 0.65
      dummy.scale.set(sc, sc, sc)
      dummy.updateMatrix()
      shardInstanced.setMatrixAt(i, dummy.matrix)
    }
    shardInstanced.instanceMatrix.needsUpdate = true
    dustPoints.rotation.y = -elapsed * 0.18

    renderer.clearDepth()
    renderer.render(sculptureScene, sculptureCam)
  }

  const drawSpace = (elapsed: number, camera: SpaceCamera, aspect: number) => {
    renderer.resetState()
    renderer.setViewport(0, 0, canvas.width, canvas.height)
    spaceCam.aspect = aspect
    spaceCam.updateProjectionMatrix()

    const flight = (elapsed * 48) % 1600
    const drift = camera.turn + Math.sin(elapsed * 0.12) * 0.045
    spaceCam.rotation.z = -drift

    for (let i = 0; i < crystalCount; i++) {
      const c = crystalSeeds[i]
      const depth = ((c.z - camera.depth - flight + 4800) % 1600) + 80
      dummy.position.set(c.x - camera.pan, c.y, -depth)
      dummy.rotation.set(elapsed * c.spin + i, elapsed * c.spin * 0.8, 0)
      const warpStretch = 1 + camera.warp * 3.5
      dummy.scale.set(c.scale, c.scale, c.scale * warpStretch)
      dummy.updateMatrix()
      crystalInstanced.setMatrixAt(i, dummy.matrix)
    }
    crystalInstanced.instanceMatrix.needsUpdate = true

    gates.forEach(({ mesh, baseZ }, i) => {
      const depth = ((baseZ - camera.depth - flight + 4800) % 1600) + 120
      mesh.position.set(-camera.pan * 0.5, 0, -depth)
      mesh.rotation.z = elapsed * (i % 2 === 0 ? 0.18 : -0.15)
      mesh.rotation.x = Math.sin(elapsed * 0.2 + i) * 0.25
    })

    renderer.clearDepth()
    renderer.render(spaceScene, spaceCam)
  }

  const dispose = () => {
    polyGeometries.forEach((g) => g.dispose())
    polyWireframes.forEach((w) => w.geometry.dispose())
    ringGeoA.dispose()
    ringGeoB.dispose()
    shardGeo.dispose()
    shardMat.dispose()
    dustGeo.dispose()
    dustMat.dispose()
    crystalGeo.dispose()
    crystalMat.dispose()
    gateGeo.dispose()
    gateMat.dispose()
    renderer.dispose()
  }

  return { drawSculpture, drawSpace, dispose, resetState: () => renderer.resetState() }
}
