import { chronicleAssets } from './chronicle/assets'
import dsPush from '../../../image/deepseek/DS_PUSH.png'
import dsHard from '../../../image/deepseek/DS_PUSH_HARD.png'
import dsPull from '../../../image/deepseek/DS_PULL.png'
import dsFall from '../../../image/deepseek/DS_FALL.png'
import dsPre from '../../../image/deepseek/DS_PRE_IMPACT.png'
import dsImpact from '../../../image/deepseek/DS_IMPACT.png'
import dsRecover from '../../../image/deepseek/DS_RECOVER.png'
import dsRun from '../../../image/deepseek/DS_RUN.png'
import dsTea from '../../../image/deepseek/11a943b7-a2d3-498a-9a97-19b3a4e05a96.png'
import dsHugWhale from '../../../image/deepseek/3a852128-132d-4081-b408-5579283fdfcf.png'
import dsThink from '../../../image/deepseek/928e1e53-99d6-420f-867c-e0958537e0a6.png'
import dsSmile from '../../../image/deepseek/c5ceb88b-0dc0-4a6d-b873-017d8a4193c5.png'
import dsWelcome from '../../../image/deepseek/c5d61eca-e351-4477-8721-247a62ecbbe9.png'
import grokPush from '../../../image/Grok/GROK_PUSH.png'
import grokPull from '../../../image/Grok/GROK_PULL.png'
import geminiHop from '../../../image/Gemini/GEMINI_HOP.png'
import geminiStroll from '../../../image/Gemini/GEMINI_FOLLOW.png'
import claudeWalk from '../../../image/Claude/CLAUDE_WALK_WITH_BOOK.png'
import claudeReading from '../../../image/Claude/CLAUDE_LOOKING_BOOK.png'
import gptObserve from '../../../image/GPT/GPT_OBSERVE_A.png'
import gptPoised from '../../../image/GPT/GPT_FOLLOW_B.png'
import gptSmile from '../../../image/GPT/GPT_FOLLOW_C.png'

export type CharacterId = 'deepseek' | 'grok' | 'gemini' | 'claude' | 'gpt' | 'chronicle'

export const characterAssets = {
  chronicle: chronicleAssets,
  deepseek: {
    push: dsPush,
    hard: dsHard,
    pull: dsPull,
    fall: dsFall,
    preImpact: dsPre,
    impact: dsImpact,
    recover: dsRecover,
    run: dsRun,
    tea: dsTea,
    hugWhale: dsHugWhale,
    think: dsThink,
    smile: dsSmile,
    welcome: dsWelcome,
  },
  grok: { push: grokPush, pull: grokPull },
  gemini: { hop: geminiHop, stroll: geminiStroll },
  claude: { follow: claudeWalk, reading: claudeReading, scholar: claudeWalk },
  gpt: { observe: gptObserve, poised: gptPoised, smile: gptSmile },
} satisfies Record<CharacterId, Record<string, string>>
