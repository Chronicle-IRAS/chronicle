import { create } from 'zustand'
import type { SceneId } from '../types/scene'

type SceneState = {
  currentScene: SceneId
  reducedMotion: boolean
  composerReady: boolean
  setCurrentScene: (scene: SceneId) => void
  setReducedMotion: (reduced: boolean) => void
  setComposerReady: (ready: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: 'welcome',
  reducedMotion: false,
  composerReady: false,
  setCurrentScene: (currentScene) => set({ currentScene }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setComposerReady: (composerReady) => set({ composerReady }),
}))
