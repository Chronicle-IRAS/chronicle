import type { ComponentType } from 'react'
import { WelcomeScene } from '../scenes/scene-01-welcome/WelcomeScene'
import { ComposerScene } from '../scenes/scene-02-composer/ComposerScene'
import { CurrentlyScene } from '../scenes/scene-03-currently/CurrentlyScene'
import { ProfileScene } from '../scenes/scene-04-profile/ProfileScene'
import { SpaceScene } from '../scenes/scene-05-space/SpaceScene'
import { DestinationsScene } from '../scenes/scene-06-destinations/DestinationsScene'
import { GoodbyeScene } from '../scenes/scene-07-goodbye/GoodbyeScene'
import { aiPull, aiPush } from '../transitions/ai-push'
import { dsImpact, profileReturn } from '../transitions/ds-impact'
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
  transitionBack?: TransitionFactory
  returnSeconds?: number
  scrollScreens: number
  holdFraction: number
  transitionSeconds: number
}

export const sceneRegistry: readonly SceneDefinition[] = [
  { id: 'welcome', Component: WelcomeScene, transitionToNext: welcomeToComposer, scrollScreens: 1.5, holdFraction: 0.12, transitionSeconds: 3.1 },
  { id: 'composer', Component: ComposerScene, transitionToNext: aiPush, transitionBack: aiPull, scrollScreens: 2, holdFraction: 0.25, transitionSeconds: 3.6 },
  { id: 'currently', Component: CurrentlyScene, transitionToNext: dsImpact, transitionBack: profileReturn, returnSeconds: 1.8, scrollScreens: 1.5, holdFraction: 0.2, transitionSeconds: 5.6 },
  { id: 'profile', Component: ProfileScene, transitionToNext: portalEnter, scrollScreens: 1.5, holdFraction: 0.2, transitionSeconds: 1.25 },
  { id: 'space', Component: SpaceScene, transitionToNext: spaceTransition, scrollScreens: 1.5, holdFraction: 0.2, transitionSeconds: 2.4 },
  { id: 'destinations', Component: DestinationsScene, transitionToNext: portalExit, scrollScreens: 1.5, holdFraction: 0.2, transitionSeconds: 1.25 },
  { id: 'goodbye', Component: GoodbyeScene, scrollScreens: 1, holdFraction: 0, transitionSeconds: 0 },
]
