export type CharacterId = 'deepseek' | 'grok' | 'gemini' | 'claude' | 'gpt'

// Asset paths are registered here as character work lands in later phases.
export const characterAssets: Record<CharacterId, { push?: string }> = {
  deepseek: {},
  grok: {},
  gemini: {},
  claude: {},
  gpt: {},
}
