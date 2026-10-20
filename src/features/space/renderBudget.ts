/** Sustained frame pressure lowers resolution, never animation speed or duration. */
export function createRenderBudget(ceiling: number) {
  let resolution = ceiling, last = 0, elapsed = 0, frames = 0, stalledFrames = 0
  return {
    get resolution() { return resolution },
    reset() { last = 0; elapsed = 0; frames = 0; stalledFrames = 0 },
    sample(now: number) {
      const delta = last ? now - last : 0
      last = now
      if (delta <= 0) { elapsed = 0; frames = 0; stalledFrames = 0; return }
      if (delta > 200) {
        elapsed = 0; frames = 0
        // One pause may be unrelated work; repeated stalls are real render pressure.
        if (++stalledFrames >= 2) {
          resolution = Math.max(320, Math.floor(resolution * .8 / 16) * 16)
          stalledFrames = 0
        }
        return
      }
      stalledFrames = 0
      elapsed += delta; frames++
      if (elapsed < 1200) return
      if (elapsed / frames > 23) resolution = Math.max(320, Math.floor(resolution * .8 / 16) * 16)
      // Hysteresis avoids resolution flicker when the machine is near its limit.
      else if (elapsed / frames < 17 && elapsed > 4000) resolution = Math.min(ceiling, resolution + 32)
      else if (elapsed / frames < 17) return
      elapsed = 0; frames = 0
    },
  }
}
