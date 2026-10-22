import { expect, it } from 'vitest'
import threeStage from './threeStage.ts?raw'
import blackHole from './blackHole.ts?raw'

it('keeps smoothstep edges ordered across GPU drivers', () => {
  // Reversed edges are undefined in GLSL, even if a desktop driver accepts them.
  const calls = [...`${threeStage}\n${blackHole}`.matchAll(/smoothstep\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)/g)]
  expect(calls.length).toBeGreaterThan(20)
  for (const [call, low, high] of calls) expect(Number(low), call).toBeLessThan(Number(high))
})
