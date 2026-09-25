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
}

export const sceneRegistry: readonly SceneDefinition[] = [
  { id: 'welcome', Component: WelcomeScene, transitionToNext: welcomeToComposer },
  { id: 'composer', Component: ComposerScene, transitionToNext: aiPush },
  { id: 'currently', Component: CurrentlyScene, transitionToNext: dsImpact },
  { id: 'profile', Component: ProfileScene, transitionToNext: portalEnter },
  { id: 'space', Component: SpaceScene, transitionToNext: spaceTransition },
  { id: 'destinations', Component: DestinationsScene, transitionToNext: portalExit },
  { id: 'goodbye', Component: GoodbyeScene },
]
