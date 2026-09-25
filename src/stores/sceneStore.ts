import { create } from 'zustand'
import type { SceneId } from '../types/scene'

type SceneState = {
  currentScene: SceneId
  reducedMotion: boolean
  setCurrentScene: (scene: SceneId) => void
  setReducedMotion: (reduced: boolean) => void
}

export const useSceneStore = create<SceneState>((set) => ({
  currentScene: 'welcome',
  reducedMotion: false,
  setCurrentScene: (currentScene) => set({ currentScene }),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}))
