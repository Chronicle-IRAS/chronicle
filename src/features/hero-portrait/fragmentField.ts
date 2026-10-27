import { BufferGeometry, Float32BufferAttribute } from 'three'

export function createFragmentGeometry(columns: number, rows: number) {
  const positions: number[] = []
  const uvs: number[] = []
  const centers: number[] = []
  const seeds: number[] = []
  const barycentrics: number[] = []

  const random = (n: number) => {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453
    return v - Math.floor(v)
  }

  const point = (x: number, y: number): [number, number] => [
    x / columns + (x > 0 && x < columns ? (random(x + y * 101) - 0.5) * 0.65 / columns : 0),
    y / rows + (y > 0 && y < rows ? (random(x * 53 + y) - 0.5) * 0.65 / rows : 0),
  ]

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < columns; x++) {
      const a = point(x, y)
      const b = point(x + 1, y)
      const c = point(x, y + 1)
      const d = point(x + 1, y + 1)

      for (const triangle of [[a, b, c], [b, d, c]]) {
        const cx = triangle.reduce((sum, p) => sum + p[0], 0) / 3
        const cy = triangle.reduce((sum, p) => sum + p[1], 0) / 3
        const seed = x + y * columns + (triangle[0] === b ? 817 : 0)
        const s0 = random(seed)
        const s1 = random(seed + 231)
        const s2 = random(seed + 971)

        triangle.forEach(([u, v], vertexIndex) => {
          positions.push(u * 2 - 1, v * 2 - 1, 0)
          uvs.push(u, v)
          centers.push(cx * 2 - 1, cy * 2 - 1)
          seeds.push(s0, s1, s2)
          barycentrics.push(
            vertexIndex === 0 ? 1 : 0,
            vertexIndex === 1 ? 1 : 0,
            vertexIndex === 2 ? 1 : 0,
          )
        })
      }
    }
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new Float32BufferAttribute(uvs, 2))
  geometry.setAttribute('aCenter', new Float32BufferAttribute(centers, 2))
  geometry.setAttribute('aSeed', new Float32BufferAttribute(seeds, 3))
  geometry.setAttribute('aBarycentric', new Float32BufferAttribute(barycentrics, 3))
  return geometry
}

export const portraitVertex = `
attribute vec2 aCenter;
attribute vec3 aSeed;
attribute vec3 aBarycentric;
uniform vec2 uCover;
uniform float uOffset;
uniform vec2 uPointer;
uniform float uHover;
uniform float uBurst;
uniform float uScroll;
uniform float uTime;
uniform float uAspect;
uniform float uLattice;
uniform float uVortex;
varying vec2 vUv;
varying vec2 vScreen;
varying float vEdge;
varying float vDissolve;
varying vec3 vBarycentric;
varying vec3 vSeed;

void main() {
  vUv = uv;
  vBarycentric = aBarycentric;
  vSeed = aSeed;

  vec2 center = aCenter * uCover + vec2(uOffset, 0.0);
  vec2 local = (position.xy - aCenter) * uCover;
  vec2 delta = (center - uPointer) * vec2(uAspect, 1.0);
  float distanceToPointer = length(delta);
  float influence = exp(-distanceToPointer * distanceToPointer * 6.8) * uHover;
  float ripple = sin(distanceToPointer * 18.0 - uTime * 4.2) * exp(-distanceToPointer * 3.8) * uHover;

  float progress = max(uBurst, uScroll * 0.95);
  float swirlStrength = uVortex * 0.55 + progress * 0.45;

  vec2 focal = vec2(0.18, 0.06);
  vec2 toFocal = center - focal;
  float focalDist = length(toFocal) + 0.001;
  vec2 radial = toFocal / focalDist;
  vec2 tangent = vec2(-radial.y, radial.x);

  float angle = (aSeed.x - 0.5) * progress * 6.28318
    + influence * (aSeed.y - 0.5) * 0.85
    + uVortex * (0.35 + aSeed.z * 0.65) * sin(uTime * 0.9 + focalDist * 3.0);
  mat2 rotation = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));

  float facetScale = 1.0 - progress * 0.26 - uLattice * 0.06 * (0.5 + 0.5 * sin(uTime * 1.6 + aSeed.x * 12.0));
  local = rotation * local * facetScale;

  vec2 orbit = vec2(
    sin(aSeed.x * 6.28318 + progress * 2.6 + uTime * 0.45),
    cos(aSeed.y * 6.28318 + progress * 2.6 + uTime * 0.45)
  );

  vec2 displacement = (radial * (0.24 + aSeed.z * 0.92) + tangent * swirlStrength * 0.42 + orbit * 0.32) * progress;
  displacement += tangent * uVortex * 0.065 * sin(uTime * 1.1 + focalDist * 6.0 + aSeed.x * 6.28);
  displacement += (delta / vec2(uAspect, 1.0)) * (influence * 0.17 + ripple * 0.025);
  displacement.y += sin(uTime * 1.25 + aSeed.z * 18.0) * (progress * 0.028 + uVortex * 0.008);

  vec2 p = center + local + displacement;
  p *= 1.0 + uScroll * 0.16;
  p.x += (uPointer.x - center.x) * uHover * 0.01;
  p.y += (uPointer.y - center.y) * uHover * 0.006;

  vScreen = p;
  vEdge = clamp(influence * 0.65 + progress * 0.45 + uLattice * 0.55 + abs(ripple) * 0.35, 0.0, 1.0);
  vDissolve = progress;
  gl_Position = vec4(p, aSeed.z * 0.01, 1.0);
}
`

export const portraitFragment = `
precision highp float;
uniform sampler2D uTexture;
uniform vec3 uTrail[8];
uniform float uAspect;
uniform vec3 uPortal;
uniform float uTime;
uniform float uScroll;
uniform float uLight;
uniform float uLattice;
uniform float uVortex;
varying vec2 vUv;
varying vec2 vScreen;
varying float vEdge;
varying float vDissolve;
varying vec3 vBarycentric;
varying vec3 vSeed;

void main() {
  vec2 distortion = vec2(0.0);
  float trailEnergy = 0.0;

  for (int i = 0; i < 8; i++) {
    vec2 delta = (vScreen - uTrail[i].xy) * vec2(uAspect, 1.0);
    float d = length(delta);
    float mask = exp(-d * d * 16.5) * uTrail[i].z;
    vec2 swirl = vec2(-delta.y, delta.x) * uVortex * 0.45;
    distortion += (delta + swirl) * mask * 0.016;
    trailEnergy += mask * 0.155;
  }

  vec2 st = clamp(vUv + distortion, vec2(0.001), vec2(0.999));
  vec3 color = texture2D(uTexture, st).rgb;

  float shift = (trailEnergy + vEdge * 0.65) * 0.0042;
  vec2 shiftDir = normalize(distortion + vec2(0.0001, 0.0001));
  color.r = texture2D(uTexture, clamp(st + shiftDir * shift, vec2(0.001), vec2(0.999))).r;
  color.b = texture2D(uTexture, clamp(st - shiftDir * shift, vec2(0.001), vec2(0.999))).b;

  float luminance = dot(color, vec3(0.299, 0.587, 0.114));
  float redness = max(0.0, color.r - max(color.g, color.b));
  float visibility = smoothstep(0.016, 0.075, luminance + redness * 0.5);

  float minBary = min(min(vBarycentric.x, vBarycentric.y), vBarycentric.z);
  float wireMask = (1.0 - smoothstep(0.004, 0.055, minBary)) * visibility;
  float wireStrength = wireMask * clamp(vEdge * 0.85 + uLattice * 0.75 + trailEnergy * 1.4, 0.0, 1.0);

  float starlight = sin(uTime * 2.4 + vSeed.x * 25.0 + vSeed.y * 19.0) * 0.5 + 0.5;
  float emberBoost = (uLight * 0.42 + uVortex * 0.18) * (0.65 + 0.35 * starlight);

  color *= 1.0 + trailEnergy * 0.92 + emberBoost;
  vec3 shardTint = mix(vec3(0.94, 0.25, 0.19), vec3(1.0, 0.82, 0.68), clamp(trailEnergy + uLight * 0.4, 0.0, 1.0));
  color += shardTint * (vEdge * 0.28 * visibility + wireStrength * 0.62);

  float scrollFade = 1.0 - smoothstep(0.54, 0.96, uScroll);
  float alpha = mix(1.0, visibility, vDissolve) * (1.0 - vDissolve * 0.14) * scrollFade;
  // Circular optical chamber opens into the existing full-screen fragment transition.
  vec2 portalDelta = (vScreen - uPortal.xy) * vec2(uAspect, 1.0);
  float portalDistance = length(portalDelta);
  float portalMask = 1.0 - smoothstep(uPortal.z - 0.035, uPortal.z, portalDistance);
  float aperture = mix(portalMask, 1.0, smoothstep(0.05, 0.85, vDissolve));
  float rim = exp(-abs(portalDistance - (uPortal.z - 0.02)) * 115.0);
  color += vec3(0.8, 0.11, 0.055) * rim * (1.0 - vDissolve) * 0.6;
  gl_FragColor = vec4(color, alpha * aperture);
}
`
