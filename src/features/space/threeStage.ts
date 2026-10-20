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
      powerPreference: 'high-performance',
    })
  } catch {
    return null
  }
  renderer.autoClear = false

  const dummy = new THREE.Object3D()
  const crimsonMat = new THREE.LineBasicMaterial({ color: 0xf40c3f, transparent: true, opacity: 0.78 })
  const goldMat = new THREE.LineBasicMaterial({ color: 0xf2c97d, transparent: true, opacity: 0.58 })
  const ivoryMat = new THREE.LineBasicMaterial({ color: 0xfdfaf5, transparent: true, opacity: 0.42 })
  const espressoMat = new THREE.LineBasicMaterial({ color: 0x160000, transparent: true, opacity: 0.28 })
  const softCrimsonMat = new THREE.LineBasicMaterial({ color: 0xf40c3f, transparent: true, opacity: 0.34 })

  // ============================================================================
  // 0. Scene 00 (Prelude): 3D Architectural Armillary Sphere & Geodesic Beads
  // ============================================================================
  const preludeScene = new THREE.Scene()
  const preludeCam = new THREE.PerspectiveCamera(42, 1, 0.1, 50)
  preludeCam.position.set(0, 0, 5.6)

  const preludeGroup = new THREE.Group()
  preludeScene.add(preludeGroup)

  const preludeOuterGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.55, 1))
  const preludeInnerGeo = new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1.02, 0))
  const preludeRingGeoA = new THREE.EdgesGeometry(new THREE.TorusGeometry(1.92, 0.012, 6, 48))
  const preludeRingGeoB = new THREE.EdgesGeometry(new THREE.TorusGeometry(2.15, 0.01, 6, 48))

  const preludeOuter = new THREE.LineSegments(preludeOuterGeo, espressoMat)
  const preludeInner = new THREE.LineSegments(preludeInnerGeo, softCrimsonMat)
  const preludeRingA = new THREE.LineSegments(preludeRingGeoA, espressoMat)
  const preludeRingB = new THREE.LineSegments(preludeRingGeoB, softCrimsonMat)
  preludeRingA.rotation.x = Math.PI * 0.38
  preludeRingB.rotation.y = Math.PI * 0.32
  preludeGroup.add(preludeOuter, preludeInner, preludeRingA, preludeRingB)

  const preludeShardCount = 24
  const preludeShardGeo = new THREE.IcosahedronGeometry(0.075, 1)
  const preludeShardMat = new THREE.MeshBasicMaterial({
    color: 0x160000,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  })
  const preludeShards = new THREE.InstancedMesh(preludeShardGeo, preludeShardMat, preludeShardCount)
  preludeGroup.add(preludeShards)

  // ============================================================================
  // 1. Scene 01 (Pure Three.js 3D Black Hole):
  //    - 3D Gravitationally Lensed Einstein Halo & Photon Ring Billboard
  //    - 3D Event Horizon Singularity Sphere with Fresnel Hawking Limb
  //    - Dual 3D Warped & Sculpted Relativistic Accretion Disk Meshes
  //    - 1,600 GPU-Driven Circular Gaussian Accretion Vortex Particles
  //    - 36 InstancedMesh Relativistic Light-Ribbons & 3D Gimballed Astrolabe
  // ============================================================================
  const holeScene = new THREE.Scene()
  const holeCam = new THREE.PerspectiveCamera(54, 1, 0.1, 60)

  const holeRoot = new THREE.Group()
  holeScene.add(holeRoot)

  // 1A. 3D Gravitationally Lensed Einstein Ring & Double-Arched Halo (Camera-Facing 3D Plane)
  const einsteinGeo = new THREE.PlaneGeometry(8.6, 8.6, 1, 1)
  const einsteinMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSpin: { value: 0 },
      uLoading: { value: 0 },
      uTilt: { value: new THREE.Vector2(0, 0) },
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
      uniform float uSpin;
      uniform float uLoading;
      uniform vec2 uTilt;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = m * p * 2.02 + vec2(13.7, 29.3);
          a *= 0.5;
        }
        return v;
      }
      mat2 rot2(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }
      vec3 blackbody(float t) {
        t = clamp(t, 0.0, 1.4);
        vec3 c0 = vec3(0.18, 0.01, 0.06);
        vec3 c1 = vec3(0.96, 0.05, 0.25);
        vec3 c2 = vec3(0.99, 0.72, 0.34);
        vec3 c3 = vec3(1.0, 0.98, 0.92);
        vec3 col = mix(c0, c1, smoothstep(0.0, 0.36, t));
        col = mix(col, c2, smoothstep(0.3, 0.75, t));
        col = mix(col, c3, smoothstep(0.68, 1.15, t));
        return col;
      }

      void main() {
        // Slight roll matching the 3D accretion plane inclination
        vec2 p = rot2(-0.18 + uTilt.x * 0.08) * vUv * 4.3;
        float r = length(p);
        if (r > 4.25) discard;

        // Mask out interior of the 3D event horizon (r < 0.96)
        float horizonMask = smoothstep(0.92, 0.98, r);

        // 1. Razor-sharp primary & secondary Einstein Photon Rings at r = 0.98 and r = 1.08
        float angle = atan(p.y, p.x);
        float doppler = clamp(1.18 - (p.x / max(r, 0.5)) * 0.48, 0.42, 1.95);
        float caustic = 0.78 + 0.22 * sin(angle * 7.0 - uTime * 3.4 - uSpin * 2.0);
        float photonRing = exp(-pow((r - 0.99) / 0.032, 2.0)) * 1.95 * doppler * caustic;
        float subRing = exp(-pow((r - 1.09) / 0.085, 2.0)) * 0.72 * doppler;

        // 2. Gravitationally Lensed Upper & Lower Einstein Arches (back of disk bent over top & bottom of shadow)
        // Elliptical distortion compresses horizontal axis so arches hug the top & bottom poles of the horizon
        vec2 archP = vec2(p.x * 0.92, abs(p.y) * 1.08 + 0.06);
        float archR = length(archP);
        float archMask = smoothstep(0.96, 1.12, archR) * (1.0 - smoothstep(1.45, 2.35, archR));
        float polarWeight = smoothstep(0.15, 0.85, abs(p.y) / max(r, 0.001));
        vec2 spiralCoord = rot2(uTime * 1.65 + uSpin - archR * 2.4) * p;
        float archNoise = fbm(spiralCoord * 2.4);
        float archRings = 0.55 + 0.45 * sin(archR * 32.0 - uTime * 2.2 + archNoise * 5.0);
        float archIntensity = archMask * polarWeight * (0.45 + 0.75 * archNoise * archRings) * doppler * 0.92;

        // 3. Soft relativistic corona & outer vignette
        float corona = exp(-max(r - 0.96, 0.0) * 1.35) * 0.28 * (0.8 + 0.2 * archNoise);
        float outerFade = 1.0 - smoothstep(3.1, 4.25, r);

        float totalHeat = photonRing * 0.95 + subRing * 0.75 + archIntensity * 0.82 + corona * 0.45;
        vec3 col = blackbody(totalHeat) * (photonRing + subRing + archIntensity + corona) * horizonMask * outerFade;
        col *= 1.0 + uLoading * 0.35;

        float alpha = clamp((photonRing + subRing + archIntensity * 0.85 + corona * 0.6) * outerFade * horizonMask, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  })
  const einsteinHaloMesh = new THREE.Mesh(einsteinGeo, einsteinMat)
  einsteinHaloMesh.renderOrder = 0
  holeRoot.add(einsteinHaloMesh)

  // 1B. 3D Event Horizon Singularity Sphere (Opaque Abyssal Core + Fresnel Photon Sheath)
  const horizonGeo = new THREE.SphereGeometry(0.95, 64, 64)
  const horizonMat = new THREE.ShaderMaterial({
    transparent: false,
    depthWrite: true,
    depthTest: true,
    uniforms: {
      uTime: { value: 0 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPos = viewMatrix * worldPos;
        vViewDir = normalize(-mvPos.xyz);
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      varying vec3 vWorldPos;
      uniform float uTime;
      void main() {
        float ndotv = clamp(dot(vNormal, vViewDir), 0.0, 1.0);
        // Grazing limb photon sheath on the 3D sphere edge
        float rim = pow(1.0 - ndotv, 6.5);
        float doppler = clamp(1.15 - vWorldPos.x * 0.45, 0.45, 1.85);
        vec3 rimColor = mix(vec3(0.96, 0.06, 0.25), vec3(1.0, 0.95, 0.82), clamp(rim * doppler, 0.0, 1.0));
        // Deep abyssal black interior (#020003) with razor-thin incandescent limb
        vec3 col = mix(vec3(0.008, 0.002, 0.006), rimColor * 1.45 * doppler, rim * 0.88);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  })
  const horizonSphere = new THREE.Mesh(horizonGeo, horizonMat)
  horizonSphere.renderOrder = 1
  holeRoot.add(horizonSphere)

  // 1C. 3D Sculpted & Warped Relativistic Accretion Disk (Primary + Tilted Secondary Sub-Disk)
  const diskGeo = new THREE.RingGeometry(1.06, 4.15, 160, 64)
  diskGeo.rotateX(-Math.PI * 0.5)
  const diskMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSpin: { value: 0 },
      uLoading: { value: 0 },
    },
    vertexShader: `
      varying vec3 vLocalPos;
      uniform float uTime;
      uniform float uSpin;
      void main() {
        vec3 pos = position;
        float r = length(pos.xz);
        float angle = atan(pos.z, pos.x);
        // 3D spiral magneto-rotational vertical wave displacement
        float spiralWave = sin(r * 9.5 - uTime * 3.2 - angle * 2.0 - uSpin) * 0.045 * smoothstep(1.1, 2.2, r);
        // Rear half of disk bends upward in 3D space (gravitational lensing warp)
        float rearWarp = smoothstep(-0.1, -1.8, pos.z) * pow(max(0.0, 3.6 - r), 1.45) * 0.24;
        pos.y += spiralWave + rearWarp;
        vLocalPos = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vLocalPos;
      uniform float uTime;
      uniform float uSpin;
      uniform float uLoading;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(
          mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
          mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
          f.y
        );
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        mat2 m = mat2(0.8, -0.6, 0.6, 0.8);
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p = m * p * 2.03 + vec2(19.1, 37.3);
          a *= 0.5;
        }
        return v;
      }
      mat2 rot2(float a) {
        float c = cos(a), s = sin(a);
        return mat2(c, -s, s, c);
      }
      vec3 plasmaPalette(float t) {
        t = clamp(t, 0.0, 1.4);
        vec3 c0 = vec3(0.22, 0.01, 0.07);
        vec3 c1 = vec3(0.96, 0.05, 0.24);
        vec3 c2 = vec3(0.99, 0.72, 0.32);
        vec3 c3 = vec3(1.0, 0.98, 0.93);
        vec3 col = mix(c0, c1, smoothstep(0.0, 0.35, t));
        col = mix(col, c2, smoothstep(0.3, 0.74, t));
        col = mix(col, c3, smoothstep(0.66, 1.15, t));
        return col;
      }

      void main() {
        float r = length(vLocalPos.xz);
        float innerMask = smoothstep(1.06, 1.32, r);
        float outerMask = 1.0 - smoothstep(2.95, 4.15, r);
        float radialEnvelope = innerMask * outerMask;
        if (radialEnvelope <= 0.001) discard;

        // Seam-free Cartesian Keplerian differential spiral turbulence
        float omega = uTime * 2.45 / pow(max(r, 1.05), 1.45) + uSpin;
        vec2 sp1 = rot2(omega - r * 2.45) * vLocalPos.xz;
        vec2 sp2 = rot2(omega * 1.38 - r * 4.1) * vLocalPos.xz;
        float n1 = fbm(sp1 * 2.7);
        float n2 = fbm(sp2 * 6.0 + vec2(n1 * 1.9));
        float filaments = smoothstep(0.2, 0.88, n1 * 0.62 + n2 * 0.38);
        float concentric = 0.52 + 0.48 * sin(r * 44.0 - uTime * 2.4 + n1 * 6.2);
        float density = mix(filaments, filaments * concentric, 0.55);

        // Relativistic Doppler beaming: approaching left side (-X) is fiercely bright white-gold
        float doppler = pow(clamp(1.08 - vLocalPos.x * 0.28, 0.38, 2.05), 1.75);
        float temp = exp(-max(r - 1.15, 0.0) * 0.62) * (0.68 + 0.62 * density) * clamp(doppler * 0.82, 0.45, 1.7);

        vec3 col = plasmaPalette(temp) * (0.35 + density * 1.55) * radialEnvelope * doppler;
        col *= 1.0 + uLoading * 0.45;
        float alpha = clamp(radialEnvelope * (0.28 + density * 0.72) * clamp(doppler * 0.85, 0.4, 1.2), 0.0, 0.96);
        gl_FragColor = vec4(col, alpha);
      }
    `,
  })
  const accretionDiskMesh = new THREE.Mesh(diskGeo, diskMat)
  accretionDiskMesh.renderOrder = 2

  // Tilted secondary inner plasma sub-disk for volumetric 3D cross-flow
  const subDiskMesh = new THREE.Mesh(diskGeo, diskMat)
  subDiskMesh.rotation.set(0.11, 0, -0.09)
  subDiskMesh.scale.setScalar(0.84)
  subDiskMesh.renderOrder = 2

  const diskTiltGroup = new THREE.Group()
  diskTiltGroup.add(accretionDiskMesh, subDiskMesh)
  holeRoot.add(diskTiltGroup)

  // 1D. 1,600 GPU-Animated 3D Relativistic Vortex Particles (Smooth Circular Gaussian Embers)
  const emberCount = 1600
  const emberOrbitAttr = new Float32Array(emberCount * 4) // (radius, baseAngle, yOffset, size)
  const emberColorAttr = new Float32Array(emberCount * 3)
  const dummyPosAttr = new Float32Array(emberCount * 3)
  for (let i = 0; i < emberCount; i++) {
    const u = i / emberCount
    const radius = 1.08 + Math.pow(u, 1.38) * 3.25
    const baseAngle = i * 2.3999632
    const yOffset = ((i % 19) - 9) * 0.016 * (0.35 + u * 1.45)
    const size = (1.2 + (i % 7) * 0.42) * (1.35 - u * 0.55)
    emberOrbitAttr[i * 4] = radius
    emberOrbitAttr[i * 4 + 1] = baseAngle
    emberOrbitAttr[i * 4 + 2] = yOffset
    emberOrbitAttr[i * 4 + 3] = size

    const heat = Math.exp(-Math.max(radius - 1.12, 0) * 0.65)
    emberColorAttr[i * 3] = 0.96 + 0.04 * heat
    emberColorAttr[i * 3 + 1] = 0.08 + 0.88 * Math.pow(heat, 0.82)
    emberColorAttr[i * 3 + 2] = 0.24 + 0.7 * Math.pow(heat, 1.5)
  }
  const jetGeo = new THREE.BufferGeometry()
  jetGeo.setAttribute('position', new THREE.BufferAttribute(dummyPosAttr, 3))
  jetGeo.setAttribute('aOrbit', new THREE.BufferAttribute(emberOrbitAttr, 4))
  jetGeo.setAttribute('aColor', new THREE.BufferAttribute(emberColorAttr, 3))
  const jetMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    depthTest: true,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSpin: { value: 0 },
      uPixelRatio: { value: 1.5 },
    },
    vertexShader: `
      attribute vec4 aOrbit;
      attribute vec3 aColor;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      uniform float uSpin;
      uniform float uPixelRatio;
      void main() {
        float radius = aOrbit.x;
        float baseAngle = aOrbit.y;
        float yOffset = aOrbit.z;
        float size = aOrbit.w;

        // Keplerian differential angular velocity on the GPU
        float kepler = 2.45 / pow(max(radius, 1.05), 1.45);
        float angle = baseAngle - uTime * kepler - uSpin;
        float r = radius * (1.0 + 0.025 * sin(uTime * 1.3 + baseAngle));
        vec3 pos = vec3(
          cos(angle) * r,
          yOffset * cos(angle * 2.0 + uTime * 0.9),
          sin(angle) * r
        );
        // Rear particles lift slightly with gravitational lensing
        pos.y += smoothstep(-0.1, -1.6, pos.z) * max(0.0, 3.2 - r) * 0.16;

        float doppler = clamp(1.15 - pos.x * 0.26, 0.4, 1.9);
        vColor = aColor * doppler;
        vAlpha = smoothstep(4.3, 2.8, r) * clamp(doppler * 0.85, 0.45, 1.0);

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = clamp(size * uPixelRatio * (18.0 / max(-mvPosition.z, 1.0)), 1.5, 22.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      varying vec3 vColor;
      varying float vAlpha;
      void main() {
        // Silky-smooth circular Gaussian star-ember (zero square pixels)
        vec2 q = (gl_PointCoord - 0.5) * 2.0;
        float d2 = dot(q, q);
        if (d2 > 1.0) discard;
        float glow = exp(-d2 * 4.2);
        float core = exp(-d2 * 16.0);
        vec3 col = mix(vColor, vec3(1.0, 0.99, 0.95), core * 0.75);
        gl_FragColor = vec4(col, glow * vAlpha * 0.88);
      }
    `,
  })
  const jetPoints = new THREE.Points(jetGeo, jetMat)
  jetPoints.renderOrder = 3
  diskTiltGroup.add(jetPoints)

  // 1E. 36 InstancedMesh Relativistic Light-Ribbons racing along inner photon orbits
  const holeShardCount = 36
  const holeShardGeo = new THREE.SphereGeometry(0.028, 10, 10)
  const holeShardMat = new THREE.MeshBasicMaterial({
    color: 0xfff7e4,
    transparent: true,
    opacity: 0.72,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
  const holeShards = new THREE.InstancedMesh(holeShardGeo, holeShardMat, holeShardCount)
  holeShards.renderOrder = 3
  const holeShardSeeds = Array.from({ length: holeShardCount }, (_, i) => {
    const t = i / holeShardCount
    const radius = 1.14 + Math.pow(t, 1.25) * 2.45
    const baseAngle = i * 2.39996
    const yOffset = ((i % 7) - 3) * 0.016 * (radius / 2.6)
    const scale = 0.68 + (i % 5) * 0.18
    return { radius, baseAngle, yOffset, scale }
  })
  diskTiltGroup.add(holeShards)

  // 1F. 3D Gimballed Celestial Astrolabe Rings framing the outer perimeter
  const diskRingInnerGeo = new THREE.EdgesGeometry(new THREE.TorusGeometry(3.65, 0.006, 6, 96))
  const diskRingOuterGeo = new THREE.EdgesGeometry(new THREE.TorusGeometry(4.02, 0.005, 6, 96))
  const diskRingMat = new THREE.LineBasicMaterial({ color: 0xf2c97d, transparent: true, opacity: 0.24 })
  const diskRingOuterMat = new THREE.LineBasicMaterial({ color: 0xf40c3f, transparent: true, opacity: 0.18 })
  const diskRingInner = new THREE.LineSegments(diskRingInnerGeo, diskRingMat)
  const diskRingOuter = new THREE.LineSegments(diskRingOuterGeo, diskRingOuterMat)
  diskRingInner.rotation.x = Math.PI * 0.5
  diskRingOuter.rotation.x = Math.PI * 0.42
  diskRingOuter.rotation.y = 0.22
  diskRingInner.renderOrder = 3
  diskRingOuter.renderOrder = 3
  diskTiltGroup.add(diskRingInner, diskRingOuter)

  // ============================================================================
  // 2. Scene 02 (Stack Composer): 3D Cybernetic Lattice & Rounded Geodesic Nodes
  // ============================================================================
  const composerScene = new THREE.Scene()
  const composerCam = new THREE.PerspectiveCamera(50, 1, 0.1, 60)
  composerCam.position.set(0, 0, 7.2)

  const composerGroup = new THREE.Group()
  composerScene.add(composerGroup)

  const composerKnotGeo = new THREE.EdgesGeometry(new THREE.TorusKnotGeometry(1.25, 0.26, 64, 10, 2, 3))
  const composerShellGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(2.35, 2))
  const composerKnotMat = new THREE.LineBasicMaterial({ color: 0xf40c3f, transparent: true, opacity: 0.2 })
  const composerShellMat = new THREE.LineBasicMaterial({ color: 0xf2c97d, transparent: true, opacity: 0.14 })
  const composerKnot = new THREE.LineSegments(composerKnotGeo, composerKnotMat)
  const composerShell = new THREE.LineSegments(composerShellGeo, composerShellMat)
  composerGroup.add(composerKnot, composerShell)

  const composerNodeCount = 28
  const composerNodeGeo = new THREE.IcosahedronGeometry(0.11, 2)
  const composerNodeMat = new THREE.MeshBasicMaterial({
    color: 0xf2c97d,
    wireframe: true,
    transparent: true,
    opacity: 0.34,
  })
  const composerNodes = new THREE.InstancedMesh(composerNodeGeo, composerNodeMat, composerNodeCount)
  composerGroup.add(composerNodes)

  // ============================================================================
  // 3. Scenes 03 & 04 (Currently & Profile): Chapter Sculpture Stage
  // ============================================================================
  const sculptureScene = new THREE.Scene()
  const sculptureCam = new THREE.PerspectiveCamera(42, 1, 0.1, 50)
  sculptureCam.position.set(0, 0, 5.2)

  const rootGroup = new THREE.Group()
  sculptureScene.add(rootGroup)

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

  const ringGeoA = new THREE.EdgesGeometry(new THREE.TorusGeometry(1.82, 0.015, 6, 48))
  const ringGeoB = new THREE.EdgesGeometry(new THREE.TorusGeometry(2.08, 0.012, 6, 48))
  const gyroRingA = new THREE.LineSegments(ringGeoA, goldMat)
  const gyroRingB = new THREE.LineSegments(ringGeoB, ivoryMat)
  gyroRingA.rotation.x = Math.PI * 0.35
  gyroRingB.rotation.y = Math.PI * 0.4
  rootGroup.add(gyroRingA, gyroRingB)

  const shardCount = 36
  const shardGeo = new THREE.TetrahedronGeometry(0.11, 0)
  const shardMat = new THREE.MeshBasicMaterial({
    color: 0xf40c3f,
    wireframe: true,
    transparent: true,
    opacity: 0.72,
  })
  const shardInstanced = new THREE.InstancedMesh(shardGeo, shardMat, shardCount)
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

  // ============================================================================
  // 4. Scenes 05 & 06 (Space & Destinations): 3D Corridor + Celestial Orrery
  // ============================================================================
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

  const gateGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(120, 1))
  const gateMat = new THREE.LineBasicMaterial({ color: 0xf2c97d, transparent: true, opacity: 0.16 })
  const gates = [0, 1, 2].map((i) => {
    const gate = new THREE.LineSegments(gateGeo, gateMat)
    gate.position.z = -350 - i * 480
    spaceScene.add(gate)
    return { mesh: gate, baseZ: i * 533 }
  })

  const orreryGroup = new THREE.Group()
  orreryGroup.position.set(0, 0, -420)
  const planetCoreGeo = new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(64, 1))
  const planetRingGeo = new THREE.EdgesGeometry(new THREE.TorusGeometry(108, 1.2, 6, 64))
  const planetCoreMat = new THREE.LineBasicMaterial({ color: 0xf40c3f, transparent: true, opacity: 0.28 })
  const planetRingMat = new THREE.LineBasicMaterial({ color: 0xf2c97d, transparent: true, opacity: 0.24 })
  const planetCore = new THREE.LineSegments(planetCoreGeo, planetCoreMat)
  const planetRing = new THREE.LineSegments(planetRingGeo, planetRingMat)
  planetRing.rotation.x = Math.PI * 0.36
  orreryGroup.add(planetCore, planetRing)
  spaceScene.add(orreryGroup)

  // ============================================================================
  // 5. Scene 07 (Goodbye): 3D Origami Fleet & Geodesic Compass
  // ============================================================================
  const goodbyeScene = new THREE.Scene()
  const goodbyeCam = new THREE.PerspectiveCamera(45, 1, 0.1, 50)
  goodbyeCam.position.set(0, 0, 6.5)

  const goodbyeGroup = new THREE.Group()
  goodbyeScene.add(goodbyeGroup)

  const compassGeo = new THREE.EdgesGeometry(new THREE.DodecahedronGeometry(1.65, 0))
  const compassRingGeo = new THREE.EdgesGeometry(new THREE.TorusGeometry(2.25, 0.012, 6, 64))
  const compassMesh = new THREE.LineSegments(compassGeo, espressoMat)
  const compassRing = new THREE.LineSegments(compassRingGeo, softCrimsonMat)
  compassRing.rotation.x = Math.PI * 0.42
  goodbyeGroup.add(compassMesh, compassRing)

  const planeCount = 18
  const planeGeo = new THREE.ConeGeometry(0.14, 0.46, 3)
  planeGeo.rotateX(Math.PI * 0.5)
  const planeMat = new THREE.MeshBasicMaterial({
    color: 0xf40c3f,
    wireframe: true,
    transparent: true,
    opacity: 0.45,
  })
  const planeInstanced = new THREE.InstancedMesh(planeGeo, planeMat, planeCount)
  goodbyeGroup.add(planeInstanced)

  // ============================================================================
  // Render Passes
  // ============================================================================
  const drawPrelude = (elapsed: number, px: number, py: number) => {
    renderer.resetState()
    renderer.setViewport(0, 0, canvas.width, canvas.height)
    preludeCam.aspect = canvas.width / Math.max(1, canvas.height)
    preludeCam.updateProjectionMatrix()

    preludeGroup.rotation.y = elapsed * 0.22 + ((px - 50) / 50) * 0.38
    preludeGroup.rotation.x = Math.sin(elapsed * 0.18) * 0.16 + ((py - 50) / 50) * -0.28
    preludeInner.rotation.y = -elapsed * 0.45
    preludeInner.rotation.z = elapsed * 0.28
    preludeRingA.rotation.z = elapsed * 0.32
    preludeRingB.rotation.x = -elapsed * 0.26

    for (let i = 0; i < preludeShardCount; i++) {
      const a = i * 2.39996 + elapsed * (0.25 + (i % 5) * 0.06)
      const r = 1.75 + (i % 6) * 0.22
      const y = Math.sin(elapsed * 0.6 + i) * 0.85
      dummy.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
      dummy.rotation.set(a, elapsed * 0.5 + i, 0)
      const s = 0.75 + (i % 3) * 0.25
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      preludeShards.setMatrixAt(i, dummy.matrix)
    }
    preludeShards.instanceMatrix.needsUpdate = true

    renderer.clearDepth()
    renderer.render(preludeScene, preludeCam)
  }

  const drawBlackHole = (elapsed: number, loading: number, spin: number, px: number, py: number) => {
    renderer.resetState()
    renderer.setViewport(0, 0, canvas.width, canvas.height)
    holeCam.aspect = canvas.width / Math.max(1, canvas.height)
    holeCam.updateProjectionMatrix()

    const tiltX = (px - 50) / 50
    const tiltY = (py - 50) / 50

    // 3D Camera orbits and responds to pointer parallax
    const camX = Math.sin(elapsed * 0.18) * 0.55 + tiltX * 0.65
    const camY = 1.18 + Math.sin(elapsed * 0.22) * 0.16 + tiltY * -0.42
    const camZ = 6.85 + Math.cos(elapsed * 0.15) * 0.15 - loading * 0.85
    holeCam.position.set(camX, camY, camZ)
    holeCam.lookAt(0, 0, 0)

    // Bank the 3D accretion disk plane for the iconic Gargantua diagonal silhouette
    diskTiltGroup.rotation.z = 0.19 + Math.sin(elapsed * 0.2) * 0.04 + tiltX * 0.06
    diskTiltGroup.rotation.x = tiltY * 0.08

    // Keep the gravitational lensing Einstein arch billboard facing the 3D camera
    einsteinHaloMesh.quaternion.copy(holeCam.quaternion)
    einsteinMat.uniforms.uTime.value = elapsed
    einsteinMat.uniforms.uSpin.value = spin
    einsteinMat.uniforms.uLoading.value = loading
    einsteinMat.uniforms.uTilt.value.set(tiltX, tiltY)

    horizonMat.uniforms.uTime.value = elapsed

    diskMat.uniforms.uTime.value = elapsed
    diskMat.uniforms.uSpin.value = spin
    diskMat.uniforms.uLoading.value = loading

    jetMat.uniforms.uTime.value = elapsed
    jetMat.uniforms.uSpin.value = spin
    jetMat.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio || 1, 1.75)

    // Outer 3D astrolabe rings precess with black hole spin
    diskRingInner.rotation.z = elapsed * 0.42 + spin * 0.65
    diskRingOuter.rotation.z = -elapsed * 0.28 - spin * 0.35

    // Update 36 InstancedMesh relativistic light-ribbons racing along inner photon orbits
    for (let i = 0; i < holeShardCount; i++) {
      const seed = holeShardSeeds[i]
      const kepler = 2.45 / Math.pow(seed.radius, 1.45)
      const angle = seed.baseAngle - elapsed * kepler - spin
      const radialBreath = seed.radius * (1 - loading * 0.08 + Math.sin(elapsed * 1.1 + i) * 0.02)
      const x = Math.cos(angle) * radialBreath
      const z = Math.sin(angle) * radialBreath
      const y = seed.yOffset * Math.cos(angle * 2.0 + elapsed)
      dummy.position.set(x, y, z)
      dummy.rotation.set(0, -angle, 0)
      const boost = 2.4 + (4.0 - seed.radius) * 0.72 + loading * 0.9
      dummy.scale.set(seed.scale * 0.28, seed.scale * 0.18, seed.scale * boost)
      dummy.updateMatrix()
      holeShards.setMatrixAt(i, dummy.matrix)
    }
    holeShards.instanceMatrix.needsUpdate = true

    renderer.clearDepth()
    renderer.render(holeScene, holeCam)
  }

  const drawComposer = (elapsed: number, nodeCount: number, px: number, py: number) => {
    renderer.resetState()
    renderer.setViewport(0, 0, canvas.width, canvas.height)
    composerCam.aspect = canvas.width / Math.max(1, canvas.height)
    composerCam.updateProjectionMatrix()

    const activity = 1 + Math.min(nodeCount, 12) * 0.045
    composerGroup.rotation.y = elapsed * 0.16 + ((px - 50) / 50) * 0.32
    composerGroup.rotation.x = Math.cos(elapsed * 0.14) * 0.15 + ((py - 50) / 50) * -0.24
    composerKnot.rotation.z = elapsed * 0.24
    composerKnot.scale.setScalar(activity)
    composerShell.rotation.y = -elapsed * 0.12

    for (let i = 0; i < composerNodeCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / composerNodeCount)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i + elapsed * 0.18
      const r = (2.6 + (i % 5) * 0.38) * activity
      dummy.position.set(
        Math.sin(phi) * Math.cos(theta) * r,
        Math.sin(phi) * Math.sin(theta) * r * 0.72,
        Math.cos(phi) * r,
      )
      dummy.rotation.set(elapsed * 0.4 + i, theta, 0)
      const s = i < nodeCount * 3 ? 1.25 : 0.75
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      composerNodes.setMatrixAt(i, dummy.matrix)
    }
    composerNodes.instanceMatrix.needsUpdate = true

    renderer.clearDepth()
    renderer.render(composerScene, composerCam)
  }

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

  const drawSpace = (elapsed: number, camera: SpaceCamera, aspect: number, selectedOrbit = -1) => {
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

    const orreryScale = selectedOrbit >= 0 ? 1.28 + selectedOrbit * 0.08 : 1
    orreryGroup.position.set(-camera.pan * 0.35, 18, -380)
    orreryGroup.scale.setScalar(orreryScale)
    planetCore.rotation.y = elapsed * 0.28 + (selectedOrbit >= 0 ? selectedOrbit * 0.6 : 0)
    planetCore.rotation.x = elapsed * 0.15
    planetRing.rotation.z = -elapsed * 0.35

    renderer.clearDepth()
    renderer.render(spaceScene, spaceCam)
  }

  const drawGoodbye = (elapsed: number, px: number, py: number) => {
    renderer.resetState()
    renderer.setViewport(0, 0, canvas.width, canvas.height)
    goodbyeCam.aspect = canvas.width / Math.max(1, canvas.height)
    goodbyeCam.updateProjectionMatrix()

    goodbyeGroup.rotation.y = ((px - 50) / 50) * 0.28
    goodbyeGroup.rotation.x = ((py - 50) / 50) * -0.22
    compassMesh.rotation.y = elapsed * 0.18
    compassMesh.rotation.x = Math.sin(elapsed * 0.22) * 0.2
    compassRing.rotation.z = -elapsed * 0.24

    for (let i = 0; i < planeCount; i++) {
      const t = elapsed * 0.38 + (i * Math.PI * 2) / planeCount
      const x = Math.cos(t) * 2.85
      const y = Math.sin(t * 2) * 1.15 + Math.cos(elapsed * 0.5 + i) * 0.25
      const z = Math.sin(t) * 1.65
      const dx = -Math.sin(t) * 2.85
      const dy = Math.cos(t * 2) * 2.3
      const dz = Math.cos(t) * 1.65
      dummy.position.set(x, y, z)
      dummy.lookAt(x + dx, y + dy, z + dz)
      const s = 0.72 + (i % 4) * 0.18
      dummy.scale.setScalar(s)
      dummy.updateMatrix()
      planeInstanced.setMatrixAt(i, dummy.matrix)
    }
    planeInstanced.instanceMatrix.needsUpdate = true

    renderer.clearDepth()
    renderer.render(goodbyeScene, goodbyeCam)
  }

  const dispose = () => {
    crimsonMat.dispose()
    goldMat.dispose()
    ivoryMat.dispose()
    espressoMat.dispose()
    softCrimsonMat.dispose()

    preludeOuterGeo.dispose()
    preludeInnerGeo.dispose()
    preludeRingGeoA.dispose()
    preludeRingGeoB.dispose()
    preludeShardGeo.dispose()
    preludeShardMat.dispose()

    einsteinGeo.dispose()
    einsteinMat.dispose()
    horizonGeo.dispose()
    horizonMat.dispose()
    diskGeo.dispose()
    diskMat.dispose()
    diskRingInnerGeo.dispose()
    diskRingOuterGeo.dispose()
    diskRingMat.dispose()
    diskRingOuterMat.dispose()
    holeShardGeo.dispose()
    holeShardMat.dispose()
    jetGeo.dispose()
    jetMat.dispose()

    composerKnotGeo.dispose()
    composerShellGeo.dispose()
    composerKnotMat.dispose()
    composerShellMat.dispose()
    composerNodeGeo.dispose()
    composerNodeMat.dispose()

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
    planetCoreGeo.dispose()
    planetRingGeo.dispose()
    planetCoreMat.dispose()
    planetRingMat.dispose()

    compassGeo.dispose()
    compassRingGeo.dispose()
    planeGeo.dispose()
    planeMat.dispose()

    renderer.dispose()
  }

  return {
    drawPrelude,
    drawBlackHole,
    drawComposer,
    drawSculpture,
    drawSpace,
    drawGoodbye,
    dispose,
    resetState: () => renderer.resetState(),
  }
}
