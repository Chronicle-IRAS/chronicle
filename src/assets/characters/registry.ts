import dsPush from '../../../image/deepseek/DS_PUSH.png'
import dsHard from '../../../image/deepseek/DS_PUSH_HARD.png'
import dsPull from '../../../image/deepseek/DS_PULL.png'
import dsFall from '../../../image/deepseek/DS_FALL.png'
import dsPre from '../../../image/deepseek/DS_PRE_IMPACT.png'
import dsImpact from '../../../image/deepseek/DS_IMPACT.png'
import dsRecover from '../../../image/deepseek/DS_RECOVER.png'
import dsRun from '../../../image/deepseek/DS_RUN.png'
import grokPush from '../../../image/Grok/GROK_PUSH.png'
import grokPull from '../../../image/Grok/GROK_PULL.png'
import geminiHop from '../../../image/Gemini/GEMINI_HOP.png'
import claudeWalk from '../../../image/Claude/CLAUDE_WALK_WITH_BOOK.png'
import gptObserve from '../../../image/GPT/GPT_OBSERVE_A.png'

export type CharacterId = 'deepseek' | 'grok' | 'gemini' | 'claude' | 'gpt'

export const characterAssets = {
  deepseek: { push: dsPush, hard: dsHard, pull: dsPull, fall: dsFall, preImpact: dsPre, impact: dsImpact, recover: dsRecover, run: dsRun },
  grok: { push: grokPush, pull: grokPull },
  gemini: { hop: geminiHop },
  claude: { follow: claudeWalk },
  gpt: { observe: gptObserve },
} satisfies Record<CharacterId, Record<string, string>>
