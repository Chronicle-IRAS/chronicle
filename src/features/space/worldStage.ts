export type WorldStage = 'black-hole' | 'prelude' | 'composer' | 'currently' | 'profile' | 'goodbye' | 'space'

type StageState = {
  active?: string
  boundary?: string
  direction?: string
  composerVisible: boolean
  currentlyVisible: boolean
}

/** Keep the departing stage until its transition-owned fade has finished. */
export function resolveWorldStage({ active, boundary, direction, composerVisible, currentlyVisible }: StageState): WorldStage {
  if (boundary === 'prelude') return 'black-hole'
  if (boundary === 'welcome') return direction === 'backward' && composerVisible ? 'composer' : 'black-hole'
  if (boundary === 'composer') {
    if (direction === 'backward') return currentlyVisible ? 'currently' : 'composer'
    return composerVisible ? 'composer' : 'currently'
  }
  if (boundary === 'currently') return 'profile'
  switch (active) {
    case 'welcome': return 'black-hole'
    case 'prelude': return 'prelude'
    case 'composer': return 'composer'
    case 'currently': return 'currently'
    case 'profile': return 'profile'
    case 'goodbye': return 'goodbye'
    default: return 'space'
  }
}
