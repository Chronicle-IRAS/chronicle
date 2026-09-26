import type { ComponentType } from 'react'
import { WelcomeScene } from '../scenes/scene-01-welcome/WelcomeScene'
import { ComposerScene } from '../scenes/scene-02-composer/ComposerScene'
import { CurrentlyScene } from '../scenes/scene-03-currently/CurrentlyScene'
import { ProfileScene } from '../scenes/scene-04-profile/ProfileScene'
import { SpaceScene } from '../scenes/scene-05-space/SpaceScene'
import { DestinationsScene } from '../scenes/scene-06-destinations/DestinationsScene'
import { GoodbyeScene } from '../scenes/scene-07-goodbye/GoodbyeScene'
import { aiPush } from '../transitions/ai-push'
import { dsImpact } from '../transitions/ds-impact'
import { portalEnter } from '../transitions/portal-enter'
import { portalExit } from '../transitions/portal-exit'
import { spaceTransition } from '../transitions/space-transition'
import type { TransitionFactory } from '../transitions/types'
import { welcomeToComposer } from '../transitions/welcome-to-composer'
import type { SceneId } from '../types/scene'

type SceneDefinition = {
  id: SceneId
  Component: ComponentType
  transitionToNext?: TransitionFactory
  scrollScreens: number
  holdFraction: number
}

export const sceneRegistry: readonly SceneDefinition[] = [
  { id: 'welcome', Component: WelcomeScene, transitionToNext: welcomeToComposer, scrollScreens: 2, holdFraction: 0.15 },
  { id: 'composer', Component: ComposerScene, transitionToNext: aiPush, scrollScreens: 5, holdFraction: 0.65 },
  { id: 'currently', Component: CurrentlyScene, transitionToNext: dsImpact, scrollScreens: 3, holdFraction: 0.45 },
  { id: 'profile', Component: ProfileScene, transitionToNext: portalEnter, scrollScreens: 3, holdFraction: 0.45 },
  { id: 'space', Component: SpaceScene, transitionToNext: spaceTransition, scrollScreens: 3, holdFraction: 0.5 },
  { id: 'destinations', Component: DestinationsScene, transitionToNext: portalExit, scrollScreens: 3, holdFraction: 0.5 },
  { id: 'goodbye', Component: GoodbyeScene, scrollScreens: 1, holdFraction: 0 },
]
