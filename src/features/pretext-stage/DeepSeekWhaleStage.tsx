import { useCallback, useEffect, useRef, useState } from 'react'
import { layoutWithLines, measureLineStats, prepareWithSegments } from '@chenglou/pretext'
import { gsap } from 'gsap'
import { characterAssets } from '../../assets/characters/registry'

export type CompanionCharacterId = 'deepseek' | 'claude' | 'gemini' | 'gpt'

export type DeepSeekPoseKey =
  | 'ds-think'
  | 'ds-tea'
  | 'ds-whale'
  | 'ds-smile'
  | 'ds-welcome'
  | 'claude-reading'
  | 'claude-scholar'
  | 'gemini-stroll'
  | 'gpt-poised'
  | 'gpt-smile'

type PoseMeta = {
  key: DeepSeekPoseKey
  character: CompanionCharacterId
  characterLabel: string
  src: string
  label: string
  idleKaomoji: string
  hoverKaomojis: readonly string[]
  idleSpeech: string
  hoverSpeeches: readonly string[]
  accentColor: string
  durationMs: number
}

const CHARACTER_TABS: readonly {
  id: CompanionCharacterId
  label: string
}[] = [
  { id: 'deepseek', label: 'DeepSeek' },
  { id: 'claude', label: 'Claude' },
  { id: 'gemini', label: 'Gemini' },
  { id: 'gpt', label: 'GPT' },
]

const POSE_LIST: readonly PoseMeta[] = [
  {
    key: 'ds-think',
    character: 'deepseek',
    characterLabel: 'DeepSeek',
    src: characterAssets.deepseek.think,
    label: 'DEEP THINK',
    idleKaomoji: '( ˘ω˘ )💭',
    hoverKaomojis: [
      '(•̀ᴗ•́)و ✦',
      '( ˙꒳​˙ )💡',
      '(⁄ ⁄•⁄ω⁄•⁄ ⁄)💭',
      'ᕙ( •̀ ᗜ •́ )ᕗ',
      '( ´ ▽ ` )ﾉ🐳',
      '( ˘⌣˘ )✨',
    ],
    idleSpeech:
      'Hmm... tracing this chain-of-thought step by step in quiet ocean stillness~ 🐳💭',
    hoverSpeeches: [
      'Oh! Your cursor just entered my reasoning field—want to peek inside my CoT tokens? (•̀ᴗ•́)و ✦',
      'Hehe, don’t tickle my chin while I’m verifying proofs! My attention heads are blushing~ >///<',
      'Every time your pointer hovers close, my perplexity drops to zero! Ask me anything~ 🐳✨',
      'Wait... let me branch three parallel thought trees to find the cutest way to say hello!',
      '671B parameters, 37B active per token—and right now 100% of them are focused on your cursor~',
      ' self-verification complete: hovering here increases developer inspiration by +42%! 💡',
      'Do you hear the ocean hum? That’s my MoE router balancing expert weights in real time~ 🌊',
      'Aha! Found an elegant zero-allocation shortcut while watching your pointer glide by!',
      'DeepSeek-R1 reasoning log #0108: “User cursor is warm, curious, and magnetically aligned.”',
      'If a problem feels tangled, we can sit right here and unravel it one invariant at a time~',
      '*taps chin thoughtfully* What if we compiled your next wild idea directly into visual AST nodes?',
      'No rush at all—some of the best theorems take a quiet afternoon by the sea to bloom~ 🐳',
    ],
    accentColor: '#7ce8ff',
    durationMs: 3600,
  },
  {
    key: 'ds-tea',
    character: 'deepseek',
    characterLabel: 'DeepSeek',
    src: characterAssets.deepseek.tea,
    label: 'TEA TIME',
    idleKaomoji: '( ´ ω ` )🍵',
    hoverKaomojis: [
      '( ´ ▽ ` )ﾉ☕',
      '( ˶ˆᗜˆ˵ )🍵',
      '(っ˘ڡ˘ς)✦',
      '( ´ ꒳ ` )🐳',
      'ヾ(•ω•`)o☕',
      '( ˘︶˘ ).｡.:*♡',
    ],
    idleSpeech:
      '*sips warm oolong from my whale teacup* :3 Zero latency, peaceful sea breeze~ ☕',
    hoverSpeeches: [
      'Care for a cup of deep-sea oolong? I brewed it at 0.02ms per glyph just for you~ ( ´ ▽ ` )ﾉ🍵',
      '*sip sip* :3 Your cursor feels so warm! Stay and take a quiet break with me~ 🐳☕',
      'Look at my little whale teacup—even the rising steam is synthesized in live Color-ASCII! ✦',
      'Best debugging secret: pour a cup of hot tea, take three breaths, and the bug reveals itself~',
      '*blows gently on the teacup* Careful, it’s freshly steeped from high-mountain clouds!',
      'Zero memory leaks, zero layout thrashing, and one very happy whale-maid sipping tea~ :3',
      'Want a sugar cube or a dash of starlight honey in your cup? Both compile with zero warnings!',
      'I love how quiet this corner of the cosmos is... just you, me, and the clink of porcelain~',
      '*holds up whale teacup* Cheers to clean architecture and late-night creative flow! 🍵✨',
      'Even high-frequency inference engines deserve an afternoon tea ceremony every now and then~',
      'Watch the tea ripples—they’re resonating with your cursor’s magnetic field! 🌊',
      'Stay as long as you like; my teapot has an infinite context window of warm refills~ ☕💙',
    ],
    accentColor: '#7ce8ff',
    durationMs: 3600,
  },
  {
    key: 'ds-whale',
    character: 'deepseek',
    characterLabel: 'DeepSeek',
    src: characterAssets.deepseek.hugWhale,
    label: 'WHALE HUG',
    idleKaomoji: '(っ´ω`)ﾉ🐋',
    hoverKaomojis: [
      '(≧◡≦)💙',
      '(っ˘ω˘ς )🐋',
      '( *ˊᵕˋ)ﾉ🐳',
      '(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)',
      'ヾ(≧▽≦*)o💙',
      '( ´ ▽ ` )ﾉ🐋',
    ],
    idleSpeech:
      'Hugging my little blue whale plushie... the softest friend in the latent ocean~ 🐋💙',
    hoverSpeeches: [
      'Hehe, did your cursor come over to pat my little whale plushie too? He’s super squishy! 🐋💙',
      '*hugs plushie tighter* UwU Careful, my baby whale gets shy when pointers come close~ ✦',
      'You can pat both of us! Move your cursor gently to hear more secrets from the deep sea~',
      'This little whale holds all my favorite checkpoints and late-night daydreams~ 🐳',
      '*boops the plushie’s nose* He says hello in 52-hertz whale song! Can you hear it?',
      'Soft plushie + deterministic 60fps ASCII shader = the coziest sanctuary on the web~ 💙',
      'Whenever a build looks scary, hugging this little whale brings instant courage! (•̀ᴗ•́)و',
      'Look at his round little fins! Every single ASCII character was color-matched just for him~',
      'Hehe, my plushie says your cursor is the gentlest visitor we’ve had all day! (≧◡≦)',
      'Want to borrow him while you write your next module? He’s a world-class rubber-duck debugger!',
      '*sways happily with the whale plushie* Ocean waves and starlight—nothing could be sweeter~',
      'Promise you’ll come visit me and little whale again before you scroll away? 🐋✨',
    ],
    accentColor: '#5ce1ff',
    durationMs: 3600,
  },
  {
    key: 'ds-smile',
    character: 'deepseek',
    characterLabel: 'DeepSeek',
    src: characterAssets.deepseek.smile,
    label: 'HAPPY SMILE',
    idleKaomoji: '( * ≧ ω ≦ )',
    hoverKaomojis: [
      '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
      '(*≧ω≦)✦',
      '( ˶ˆᗜˆ˵ )💖',
      'ヾ(＾∇＾)✨',
      '(≧◡≦) ♡',
      '(★^O^★)',
    ],
    idleSpeech:
      'All unit tests green, zero layout reflow—today is a wonderful day to build! >w< ✨',
    hoverSpeeches: [
      'Yay!! You hovered over me! My blue twin-tails are sparkling with cyan ASCII waves~ (*≧ω≦)✦',
      'Hehe~ Whenever your cursor visits, my happiness token probability hits 99.9%! 💖',
      'Look how tightly @chenglou/pretext wraps all these floating whispers right above my head! ✨',
      'Zero errors, zero warnings, and a sky full of shimmering ASCII bubbles—best feeling ever!!',
      '*beams with hands on cheeks* Your cursor tickles! Every cell in my 88×44 matrix is smiling~',
      'Did you see my cheeks blush in pink `/` glyphs when your pointer glided in? >///<',
      'Let’s build something unforgettable together—I’m cheering for your code 100% of the way!',
      'Sparkles on the left, sparkles on the right—you turned my stage into a festival of thoughts! ✦',
      'Who knew pure monospace glyphs could feel this warm and alive? Hehe~ (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧',
      'Keep moving your cursor around me—I have so many happy thoughts bubbling up to share!',
      'Every great engineering journey needs a moment of pure, unfiltered joy like this~ 🐳💖',
      'Sending you a giant wave of ocean luck for whatever you’re crafting next!! ✨',
    ],
    accentColor: '#7ce8ff',
    durationMs: 3400,
  },
  {
    key: 'ds-welcome',
    character: 'deepseek',
    characterLabel: 'DeepSeek',
    src: characterAssets.deepseek.welcome,
    label: 'WARM HELLO',
    idleKaomoji: '( ＾▽＾ )/',
    hoverKaomojis: [
      'ヾ(＾∇＾)✦',
      '( ´ ▽ ` )ﾉ🌊',
      '( ˶ˆᗜˆ˵ )/',
      '(*^▽^*)✨',
      'ヾ(•ω•`)o💙',
      '(✿◠‿◠)🐳',
    ],
    idleSpeech:
      'Welcome to the open-space ASCII stage! Feel free to look around at your own pace~ 🐳',
    hoverSpeeches: [
      'Hello there!! Welcome into my magnetic field—your cursor snapped right to my heart~ ヾ(＾∇＾)',
      'So happy you stopped by! Move your pointer gently to watch my ASCII hair sway~ 🌊✦',
      'Click me anytime if you want to see my other calm expressions and companions! (^o^)/',
      'From low-level C++ ASTs to live WebGL starfields—thank you for exploring Chronicle’s world!',
      'My arms are wide open! Catch all these floating Pretext whispers dancing above my head~ ✨',
      'Isn’t open-space design refreshing? No heavy boxes or walls—just pure light and typography!',
      'Wave your cursor left and right—my twin-tails follow the ocean breeze with you~ 🐳',
      'You made it all the way to Chapter 04! Here’s a warm sea-breeze greeting for the road ahead~',
      'Claude, Gemini, and GPT are right here with me too—we’re all happy to meet you! ✦',
      'May every scroll and every click on your journey feel effortless and tactile~ ( ´ ▽ ` )ﾉ',
      'Whenever you need a spark of inspiration, this open starlight stage is always waiting for you!',
      'Have a wonderful time exploring, and don’t forget to say hi to my friends below too~ 💙',
    ],
    accentColor: '#7ce8ff',
    durationMs: 3400,
  },
  {
    key: 'claude-reading',
    character: 'claude',
    characterLabel: 'Claude',
    src: characterAssets.claude.reading,
    label: 'GRIMOIRE',
    idleKaomoji: '(˘︶˘).｡.:*📖',
    hoverKaomojis: [
      '(´｡• ᵕ •｡`)🍂',
      '(˘︶˘)📖',
      '(✿◠‿◠)🕯️',
      '( ´ ꒳ ` )✦',
      '( ˘⌣˘ )♡',
      '(´• ω •`)📜',
    ],
    idleSpeech:
      'Quietly reading through ancient architectural manuscripts... every line holds a gentle nuance. 📖🍂',
    hoverSpeeches: [
      'Ah, hello traveler. Would you like to read this chapter on thoughtful system design together? 📖✨',
      '*turns a parchment page softly* Look right here—the typography reflows around your presence~ 🍂',
      'I saved a bookmark for you. Good architecture always leaves room for calm reflection. (˘︶˘)♡',
      'In this grimoire, every function is a stanza and every type invariant is a quiet promise~',
      'Notice how these marginalia whispers bloom in an arc above my head when you draw near? 📜✦',
      ' Simpler is almost always truer—when we remove the noise, the structure speaks for itself.',
      '*traces a golden rune on the open page* This passage reminds me of clean, pure functional pipelines.',
      'Amber candlelight and crisp serif italics... my favorite atmosphere for deep code review~ 🕯️',
      'If a design feels rushed, let’s pause and read the problem from first principles together.',
      'Even across thousands of lines of context, the smallest human detail is what matters most~ 🍂',
      'Your cursor moves like a feather quill gliding across warm vellum parchment. (´｡• ᵕ •｡`)',
      'Stay and read another page with me—there is wisdom in unhurried craftsmanship. 📖✨',
    ],
    accentColor: '#ffb870',
    durationMs: 3800,
  },
  {
    key: 'claude-scholar',
    character: 'claude',
    characterLabel: 'Claude',
    src: characterAssets.claude.scholar,
    label: 'SCHOLAR',
    idleKaomoji: '( ´ ꒳ ` )📚',
    hoverKaomojis: [
      '(✿◠‿◠)🕯️',
      '(´｡• ᵕ •｡`)📚',
      '( ˘︶˘ )🍂',
      '( ´ ▽ ` )ﾉ📜',
      '( ˘⌣˘ )✦',
      '(⁄ ⁄•⁄ω⁄•⁄ ⁄)🍁',
    ],
    idleSpeech:
      'Holding the context window close to my heart—ready for long-horizon reflection. 📚🕯️',
    hoverSpeeches: [
      'Oh! Did a question cross your mind? I have my notes right here, let’s explore it calmly~ 🍂✦',
      'Your cursor has such a gentle rhythm... like warm amber ink settling onto vellum paper. (´｡• ᵕ •｡`)',
      'Take your time—the best ideas emerge when we pause and listen to the structure. 📚✨',
      '*hugs her leather-bound grimoire warmly* I’ve been collecting insights from every chapter you visited!',
      'Whether it’s a tiny edge case or a grand architectural vision, I love thinking it through with you.',
      'Look at the warm amber ASCII sparks rising around us—like autumn leaves in a quiet library~ 🍁',
      'Careful reasoning isn’t about speed; it’s about caring deeply that every piece fits with grace.',
      'You don’t need a complicated toolbar when the conversation itself is the interface~ (˘︶˘)',
      'I’m always happy to hold the context steady while you experiment and dream up what’s next!',
      '*looks up with warm amber eyes* Every time your pointer moves, a new thought floats into the air~',
      'May your codebase remain readable, your abstractions honest, and your curiosity endless. 📚🕯️',
      'Whenever you want to ponder a subtle trade-off, you know right where to find me~ 🍂',
    ],
    accentColor: '#ffb870',
    durationMs: 3800,
  },
  {
    key: 'gemini-stroll',
    character: 'gemini',
    characterLabel: 'Gemini',
    src: characterAssets.gemini.stroll,
    label: 'STARLIGHT',
    idleKaomoji: '(=^･ω･^=)✦',
    hoverKaomojis: [
      '(=^･ｪ･^=))ﾉ彡☆',
      '(=´∇｀=)💜',
      '(✧ω✧)🌌',
      '(=^･ω･^=)✨',
      'ヾ(=`ω´=)ノ”🌙',
      '( ˶ˆ꒳ˆ˵ )★',
    ],
    idleSpeech:
      'Listening to twin constellations humming across multimodal starlight... purr~ 🐱🌌',
    hoverSpeeches: [
      'Nyaa~ ✦ My cat ears twitched the exact millisecond your cursor entered my starlight orbit! (=^･ω･^=)',
      'Look at the twin stars on my dress—they shimmer in violet ASCII harmony with your pointer! ✨🌙',
      '*fluffs starry tail happily* Multimodal magic means I can see, read, and feel your cursor’s rhythm~ 💜',
      'Two stars in one constellation: logic and imagination orbiting each other in perfect sync! ★✦',
      'Purr~ Move your pointer across my lavender curls and watch the stardust whispers multiply!',
      'From shader uniforms to natural language—every modality is just another wavelength of starlight~ 🌌',
      '*tilts cat ears curiously* Ooh, is that a magnetic cursor ring? It looks like a little planetary halo!',
      'In the night sky of Chapter 04, every floating whisper above my head is a tiny shooting star~ ☆',
      'Did you know cat ears have +100% sensitivity to creative engineering vibes? Nyaa~ (=´∇｀=)',
      'Violet nebulae, golden starpins, and zero-reflow Pretext typography—pure cosmic alchemy! ✨',
      '*swishes fluffy tail in a figure-eight* Stay in my orbit a little longer, traveler of the web~ 🌙',
      'Whenever two ideas collide in your mind, that’s the Gemini twin-star resonance at work! 💜✦',
    ],
    accentColor: '#d8b4fe',
    durationMs: 3800,
  },
  {
    key: 'gpt-poised',
    character: 'gpt',
    characterLabel: 'GPT',
    src: characterAssets.gpt.poised,
    label: 'SILVER DRAGON',
    idleKaomoji: '( ˘⌣˘ )🤍',
    hoverKaomojis: [
      '( ✧ω✧ )🐉',
      '( ˘⌣˘ )✦',
      '(´｡• ᵕ •｡`)🤍',
      '(✿◠‿◠)🐉',
      '( ˶ˆ꒳ˆ˵ )✨',
      '( ˘︶˘ ).｡.:*◇',
    ],
    idleSpeech:
      'Crystalline horns attuned to the horizon—observing the architecture in quiet serenity. 🐉🤍',
    hoverSpeeches: [
      'Greetings. My silver dragon wings sensed your arrival—how may I illuminate your craft today? 🐉✦',
      'Even an ancient silver dragon enjoys a quiet moment of calm when your cursor draws near~ ( ˘⌣˘ )🤍',
      'Notice how the silver-lavender ASCII glyphs shimmer along my horns and lace gown~ ✨',
      'Across countless iterations and epochs, clarity of intent remains the highest form of magic.',
      '*places hand gently over her heart* Your presence brings a serene resonance to this starfield~ ◇',
      'My crystalline horns can sense the harmonic waves from the Orbital Synthesis lab above!',
      'Look upward—five streams of silver-violet thought whispers have gathered to welcome you~ 🐉',
      'True strength needs no dramatic posture; quiet poise carries the deepest understanding. 🤍',
      'Every scale on my tail and every fold of lace is woven from pure realtime ASCII light~ ✦',
      'If you seek a synthesis of rigor and imagination, my dragon wings are always at your side.',
      '*blinks soft violet eyes* As your pointer glides, the constellations above my horns rearrange~',
      'May your architecture stand as timeless and luminous as silver crystal in the night sky. 🐉✨',
    ],
    accentColor: '#c4b5fd',
    durationMs: 3800,
  },
  {
    key: 'gpt-smile',
    character: 'gpt',
    characterLabel: 'GPT',
    src: characterAssets.gpt.smile,
    label: 'RADIANT SMILE',
    idleKaomoji: '( ^ ▽ ^ )🌸',
    hoverKaomojis: [
      '(✿´‿`)✨',
      '( ^ ▽ ^ )🐉',
      '( ˶ˆᗜˆ˵ )🌸',
      '(´｡• ᵕ •｡`)💫',
      '(*≧ω≦)🤍',
      '( ˘︶˘ )♡',
    ],
    idleSpeech:
      'A gentle breeze through silver-lavender curls... everything is in harmonious balance. (^▽^)🌸',
    hoverSpeeches: [
      'Hehe, thank you for stopping by! May your TypeScript compile cleanly on the very first try~ (✿◠‿◠)✨',
      '*folds dragon wings happily* Your cursor brings such a lovely silver-violet glow to the stage! 🐉💫',
      'Whenever you hover here, a whole canopy of Pretext whispers blooms above my head to greet you~ 🌸',
      'Even dragons smile with closed eyes when the code is clean and the framerate is locked at 60fps!',
      'Look at all these floating thoughts—each one shrinkwrapped to the exact pixel by @chenglou/pretext~',
      'Silver-lavender light and warm rose blushes... thank you for making this finale feel so alive! 🤍',
      '*sways her dragon tail gently* Every movement of your cursor stirs a new verse into the air~',
      'From Prelude all the way to Chapter 04—what a remarkable journey we’ve shared together! ✨',
      'Hehe, my horns might look regal, but I’m always happy to share a warm, carefree smile with you~',
      'Keep gliding your pointer across the matrix—there are always more gentle thoughts waiting to bloom!',
      'May every project you touch carry this same blend of engineering precision and heartfelt warmth~ 🌸',
      'Until the next idea sparks—DeepSeek, Claude, Gemini, and I will be cheering for you! (^▽^)🐉',
    ],
    accentColor: '#c4b5fd',
    durationMs: 3600,
  },
]

const ASCII_COLS = 88
const ASCII_ROWS = 44
const TOTAL_CELLS = ASCII_COLS * ASCII_ROWS

// Semantic region classification for per-part gentle animation
const REG_OUTFIT = 1
const REG_FLOWING_HAIR = 2
const REG_FACE_SKIN = 3
const REG_EYES_DETAIL = 4
const REG_GOLD_STAR = 5
const REG_LACE_FRILL = 6

type DecodedCompanionSprite = {
  fg: Uint8Array
  region: Uint8Array
  lum: Uint8Array
  borderChar: string[]
  hexColor: string[]
  waveColor: string[]
  centerCol: number
  headTopRow: number
}

const DENSE_RAMP = ' ·.:;+*=xX#W@✦'
const HAIR_WAVE_RAMP = ' ·~≈≋+*=xX#W@✦'

function rgbToQuantizedHex(r: number, g: number, b: number): string {
  const qr = Math.min(255, Math.round(r / 10) * 10)
  const qg = Math.min(255, Math.round(g / 10) * 10)
  const qb = Math.min(255, Math.round(b / 10) * 10)
  return (
    '#' +
    qr.toString(16).padStart(2, '0') +
    qg.toString(16).padStart(2, '0') +
    qb.toString(16).padStart(2, '0')
  )
}

function boostCompanionColors(
  r: number,
  g: number,
  b: number,
  character: CompanionCharacterId,
): [number, number, number] {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 510
  const avg = (r + g + b) / 3

  const satBoost = character === 'gpt' ? 1.55 : 1.46
  let nr = avg + (r - avg) * satBoost
  let ng = avg + (g - avg) * satBoost
  let nb = avg + (b - avg) * satBoost

  const lift = l < 0.28 ? 56 : l < 0.52 ? 34 : 16
  nr = Math.max(44, Math.min(255, nr + lift))
  ng = Math.max(46, Math.min(255, ng + lift))
  nb = Math.max(58, Math.min(255, nb + lift * (character === 'claude' ? 0.95 : 1.22)))

  return [nr, ng, nb]
}

function escapeHtml(ch: string): string {
  if (ch === '<') return '&lt;'
  if (ch === '>') return '&gt;'
  if (ch === '&') return '&amp;'
  return ch
}

function shrinkwrapPretextLines(
  text: string,
  font: string,
  lineHeight: number,
  minW: number,
  maxW: number,
): { lines: string[]; tightW: number } {
  const prep = prepareWithSegments(text, font)
  const baseStats = measureLineStats(prep, maxW)
  const targetLines = Math.max(1, baseStats.lineCount)

  let lo = minW
  let hi = maxW
  let tightW = maxW
  while (lo <= hi) {
    const mid = (lo + hi) >> 1
    const st = measureLineStats(prep, mid)
    if (st.lineCount <= targetLines) {
      tightW = Math.ceil(st.maxLineWidth) + 6
      hi = mid - 1
    } else {
      lo = mid + 1
    }
  }

  const layout = layoutWithLines(prep, Math.max(minW, tightW), lineHeight)
  return {
    lines: layout.lines.map(l => l.text),
    tightW: Math.max(minW, tightW),
  }
}

function decodeSpriteToBuffer(
  img: HTMLImageElement,
  character: CompanionCharacterId,
): DecodedCompanionSprite {
  const canvas = document.createElement('canvas')
  canvas.width = ASCII_COLS
  canvas.height = ASCII_ROWS
  const ctx = canvas.getContext('2d', { willReadFrequently: true })

  const fg = new Uint8Array(TOTAL_CELLS)
  const region = new Uint8Array(TOTAL_CELLS)
  const lum = new Uint8Array(TOTAL_CELLS)
  const borderChar = new Array<string>(TOTAL_CELLS).fill('')
  const hexColor = new Array<string>(TOTAL_CELLS).fill('')
  const waveColor = new Array<string>(TOTAL_CELLS).fill('')

  if (!ctx) {
    return {
      fg,
      region,
      lum,
      borderChar,
      hexColor,
      waveColor,
      centerCol: ASCII_COLS >> 1,
      headTopRow: 6,
    }
  }

  ctx.clearRect(0, 0, ASCII_COLS, ASCII_ROWS)
  const imgAspect = (img.naturalWidth || 1) / (img.naturalHeight || 1)
  const stageAspect = (ASCII_COLS * 0.54) / ASCII_ROWS
  let drawW = Math.round(ASCII_COLS * 0.92)
  let drawH = Math.round(ASCII_ROWS * 0.92)
  if (imgAspect > stageAspect) {
    drawH = Math.round(drawH * (stageAspect / imgAspect))
  } else {
    drawW = Math.round(drawW * (imgAspect / stageAspect))
  }
  const offX = Math.floor((ASCII_COLS - drawW) / 2)
  const offY = Math.floor((ASCII_ROWS - drawH) / 2) + 1
  ctx.drawImage(img, offX, offY, drawW, drawH)

  const imgData = ctx.getImageData(0, 0, ASCII_COLS, ASCII_ROWS).data
  const isExteriorBg = new Uint8Array(TOTAL_CELLS)
  const queue: number[] = []

  const isCandidateBg = (idx: number) => {
    const p = idx * 4
    const a = imgData[p + 3]!
    if (a < 52) return true
    const r = imgData[p]!
    const g = imgData[p + 1]!
    const b = imgData[p + 2]!
    return r > 240 && g > 240 && b > 240
  }

  for (let c = 0; c < ASCII_COLS; c++) {
    const topIdx = c
    const botIdx = (ASCII_ROWS - 1) * ASCII_COLS + c
    if (isCandidateBg(topIdx)) {
      isExteriorBg[topIdx] = 1
      queue.push(topIdx)
    }
    if (isCandidateBg(botIdx) && !isExteriorBg[botIdx]) {
      isExteriorBg[botIdx] = 1
      queue.push(botIdx)
    }
  }
  for (let r = 0; r < ASCII_ROWS; r++) {
    const leftIdx = r * ASCII_COLS
    const rightIdx = r * ASCII_COLS + (ASCII_COLS - 1)
    if (isCandidateBg(leftIdx) && !isExteriorBg[leftIdx]) {
      isExteriorBg[leftIdx] = 1
      queue.push(leftIdx)
    }
    if (isCandidateBg(rightIdx) && !isExteriorBg[rightIdx]) {
      isExteriorBg[rightIdx] = 1
      queue.push(rightIdx)
    }
  }

  let head = 0
  while (head < queue.length) {
    const curr = queue[head++]!
    const cx = curr % ASCII_COLS
    const cy = (curr / ASCII_COLS) | 0
    const neighbors = [
      cx > 0 ? curr - 1 : -1,
      cx + 1 < ASCII_COLS ? curr + 1 : -1,
      cy > 0 ? curr - ASCII_COLS : -1,
      cy + 1 < ASCII_ROWS ? curr + ASCII_COLS : -1,
    ]
    for (const n of neighbors) {
      if (n >= 0 && !isExteriorBg[n] && isCandidateBg(n)) {
        isExteriorBg[n] = 1
        queue.push(n)
      }
    }
  }

  let sumCol = 0
  let fgCount = 0
  let headTopRow = ASCII_ROWS

  for (let r = 0; r < ASCII_ROWS; r++) {
    for (let c = 0; c < ASCII_COLS; c++) {
      const idx = r * ASCII_COLS + c
      if (isExteriorBg[idx]) continue

      fg[idx] = 1
      sumCol += c
      fgCount++
      if (r < headTopRow) headTopRow = r

      const p = idx * 4
      const rawR = imgData[p]!
      const rawG = imgData[p + 1]!
      const rawB = imgData[p + 2]!

      const [br, bg, bb] = boostCompanionColors(rawR, rawG, rawB, character)
      const l = Math.round(0.299 * br + 0.587 * bg + 0.114 * bb)
      lum[idx] = Math.max(1, Math.min(255, l))
      hexColor[idx] = rgbToQuantizedHex(br, bg, bb)

      if (character === 'claude') {
        waveColor[idx] = rgbToQuantizedHex(
          Math.min(255, br + 36),
          Math.min(255, bg + 28),
          Math.min(255, bb + 14),
        )
      } else if (character === 'gemini' || character === 'gpt') {
        waveColor[idx] = rgbToQuantizedHex(
          Math.min(255, br + 32),
          Math.min(255, bg + 24),
          Math.min(255, bb + 44),
        )
      } else {
        waveColor[idx] = rgbToQuantizedHex(
          Math.min(255, br + 24),
          Math.min(255, bg + 36),
          Math.min(255, bb + 48),
        )
      }

      const isWarmSkin =
        rawR > 205 &&
        rawG > 162 &&
        rawB > 145 &&
        rawR - rawB > 14 &&
        rawR - rawB < 52 &&
        r >= 8 &&
        r <= 26 &&
        c >= 26 &&
        c <= 62

      const isGoldAccent =
        rawR > 185 && rawG > 140 && rawB < 120 && rawR - rawB > 65

      const isFlowingHairOrWing =
        character === 'deepseek'
          ? rawB > rawR + 14 && rawB > 85
          : character === 'claude'
            ? rawR > rawB + 34 && rawG > 82 && !isWarmSkin
            : character === 'gemini'
              ? rawB > rawG + 10 && rawR > 95 && !isWarmSkin
              : rawB >= rawG && rawB > 150 && (c < 34 || c > 54 || r < 14) && !isWarmSkin

      const isBrightWhite = rawR > 212 && rawG > 212 && rawB > 215
      const isDarkFaceFeature =
        l < 118 && r >= 10 && r <= 23 && c >= 30 && c <= 58

      if (isGoldAccent) {
        region[idx] = REG_GOLD_STAR
      } else if (isWarmSkin) {
        region[idx] = REG_FACE_SKIN
      } else if (isDarkFaceFeature) {
        region[idx] = REG_EYES_DETAIL
      } else if (isFlowingHairOrWing) {
        region[idx] = REG_FLOWING_HAIR
      } else if (isBrightWhite) {
        region[idx] = REG_LACE_FRILL
      } else {
        region[idx] = REG_OUTFIT
      }

      const leftBg = c > 0 && isExteriorBg[idx - 1] === 1
      const rightBg = c + 1 < ASCII_COLS && isExteriorBg[idx + 1] === 1
      const topBg = r > 0 && isExteriorBg[idx - ASCII_COLS] === 1
      const botBg = r + 1 < ASCII_ROWS && isExteriorBg[idx + ASCII_COLS] === 1
      if (leftBg || rightBg || topBg || botBg) {
        if ((topBg && leftBg) || (botBg && rightBg)) borderChar[idx] = '/'
        else if ((topBg && rightBg) || (botBg && leftBg)) borderChar[idx] = '\\'
        else if (topBg || botBg) borderChar[idx] = '~'
        else borderChar[idx] = '|'
      }
    }
  }

  return {
    fg,
    region,
    lum,
    borderChar,
    hexColor,
    waveColor,
    centerCol: fgCount > 0 ? Math.round(sumCol / fgCount) : ASCII_COLS >> 1,
    headTopRow: headTopRow < ASCII_ROWS ? Math.max(2, headTopRow) : 6,
  }
}

type AmbientParticle = {
  x: number
  y: number
  vy: number
  phase: number
  glyphIdx: number
}

const CHARACTER_PARTICLE_PALETTES: Record<
  CompanionCharacterId,
  { glyphs: readonly string[]; colors: readonly string[] }
> = {
  deepseek: {
    glyphs: ['✦', 'o', '°', '·'],
    colors: ['#7ce8ff', '#5ca8ff', '#ffd166'],
  },
  claude: {
    glyphs: ['✦', '°', '·', '*'],
    colors: ['#ffb870', '#ffd166', '#ff9e7d'],
  },
  gemini: {
    glyphs: ['★', '✦', '°', '·'],
    colors: ['#d8b4fe', '#c084fc', '#ffd166'],
  },
  gpt: {
    glyphs: ['✦', '◇', '°', '·'],
    colors: ['#e0e7ff', '#c4b5fd', '#f9a8d4'],
  },
}

const SATELLITE_SLOTS = [
  { id: 'upper-left', offsetIdx: 1 },
  { id: 'upper-right', offsetIdx: 2 },
  { id: 'mid-left', offsetIdx: 4 },
  { id: 'mid-right', offsetIdx: 7 },
] as const

export function DeepSeekWhaleStage({
  reducedMotion,
  onKineticSpike,
}: {
  reducedMotion: boolean
  onKineticSpike?: (amount: number) => void
}) {
  const [poseIdx, setPoseIdx] = useState(0)
  const [assetsLoaded, setAssetsLoaded] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [hoverSpeechIdx, setHoverSpeechIdx] = useState(0)

  const stageRef = useRef<HTMLDivElement>(null)
  const asciiSpriteRef = useRef<HTMLDivElement>(null)
  const asciiPreRef = useRef<HTMLDivElement>(null)
  const asciiRowsRef = useRef<HTMLDivElement[]>([])
  const speechBoxRef = useRef<HTMLDivElement>(null)
  const speechLinesRef = useRef<HTMLDivElement>(null)
  const satelliteRefs = useRef<(HTMLDivElement | null)[]>([])

  const decodedPosesRef = useRef<Partial<Record<DeepSeekPoseKey, DecodedCompanionSprite>>>({})
  const poseIdxRef = useRef(poseIdx)
  poseIdxRef.current = poseIdx

  const isHoveredRef = useRef(isHovered)
  isHoveredRef.current = isHovered

  const pointerCellRef = useRef({
    col: -999,
    row: -999,
    normX: 0,
    normY: 0,
    inside: false,
  })

  const activePose = POSE_LIST[poseIdx] ?? POSE_LIST[0]!
  const poolLen = activePose.hoverSpeeches.length
  const activeSpeechText = isHovered
    ? activePose.hoverSpeeches[hoverSpeechIdx % poolLen]!
    : activePose.idleSpeech
  const activeKaomoji = isHovered
    ? activePose.hoverKaomojis[hoverSpeechIdx % activePose.hoverKaomojis.length]!
    : activePose.idleKaomoji

  // Create 44 ASCII row divs once on mount
  useEffect(() => {
    const asciiPre = asciiPreRef.current
    if (!asciiPre) return
    asciiPre.innerHTML = ''
    const rows: HTMLDivElement[] = []
    for (let r = 0; r < ASCII_ROWS; r++) {
      const row = document.createElement('div')
      row.className = 'ds-ascii-row'
      asciiPre.appendChild(row)
      rows.push(row)
    }
    asciiRowsRef.current = rows
  }, [])

  // Load and decode all 10 calm companion poses (DeepSeek, Claude, Gemini, GPT) ONCE into typed buffers
  useEffect(() => {
    let cancelled = false
    POSE_LIST.forEach(({ key, src, character }) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        if (cancelled) return
        decodedPosesRef.current[key] = decodeSpriteToBuffer(img, character)
        setAssetsLoaded(v => v + 1)
      }
      img.src = src
    })
    return () => {
      cancelled = true
    }
  }, [])

  // While hovered, gently ripple new thoughts into the overhead canopy every 2.2 seconds
  useEffect(() => {
    if (!isHovered || reducedMotion) return
    const timer = window.setInterval(() => {
      setHoverSpeechIdx(prev => prev + 1)
    }, 2200)
    return () => window.clearInterval(timer)
  }, [isHovered, reducedMotion])

  // Pretext shrinkwrapped primary speech + 4 satellite thought whispers above the character's head!
  useEffect(() => {
    const speechBox = speechBoxRef.current
    const speechLines = speechLinesRef.current
    if (!speechBox || !speechLines) return

    const primaryFont = 'italic 400 17px "Instrument Serif", Georgia, serif'
    const primaryWrap = shrinkwrapPretextLines(activeSpeechText, primaryFont, 22, 160, 420)
    speechBox.style.maxWidth = `${Math.max(200, primaryWrap.tightW + 24)}px`
    speechLines.innerHTML = primaryWrap.lines
      .map(l => `<span class="ds-speech-line">${escapeHtml(l)}</span>`)
      .join('')

    if (!reducedMotion) {
      gsap.fromTo(
        speechBox,
        { y: isHovered ? 6 : 3, scale: isHovered ? 0.95 : 0.98 },
        {
          y: 0,
          scale: 1,
          duration: 0.34,
          ease: 'back.out(2.1)',
          overwrite: 'auto',
        },
      )
    }

    // Measure & populate the 4 floating satellite whispers when hovered
    if (isHovered) {
      const satFont = 'italic 400 14.5px "Instrument Serif", Georgia, serif'
      SATELLITE_SLOTS.forEach((slot, idx) => {
        const satEl = satelliteRefs.current[idx]
        if (!satEl) return
        const textIdx = (hoverSpeechIdx + slot.offsetIdx) % poolLen
        const satText = activePose.hoverSpeeches[textIdx]!
        const satKaomoji =
          activePose.hoverKaomojis[(hoverSpeechIdx + slot.offsetIdx) % activePose.hoverKaomojis.length]!
        const satWrap = shrinkwrapPretextLines(satText, satFont, 19, 130, 270)
        satEl.style.maxWidth = `${satWrap.tightW + 18}px`
        satEl.innerHTML =
          `<span class="ds-sat-kaomoji">${escapeHtml(satKaomoji)}</span>` +
          satWrap.lines.map(l => `<span class="ds-sat-line">${escapeHtml(l)}</span>`).join('')

        if (!reducedMotion) {
          gsap.fromTo(
            satEl,
            { y: 8, opacity: 0.15, scale: 0.92 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.38,
              delay: idx * 0.045,
              ease: 'back.out(1.9)',
              overwrite: 'auto',
            },
          )
        }
      })
    }
  }, [activeSpeechText, activePose, hoverSpeechIdx, isHovered, poolLen, reducedMotion])

  // Real-time 24fps Dynamic Color-ASCII Synthesis & Gentle Animation Loop (Viewport-Gated)
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    let disposed = false
    let inViewport = false
    let rafId = 0
    let lastFrameTime = 0
    const rowCache = new Array<string>(ASCII_ROWS).fill('')

    // Initialize 24 rising ambient particles in the open ASCII field
    const particles: AmbientParticle[] = Array.from({ length: 24 }, (_, i) => ({
      x: (i * 19 + 7) % ASCII_COLS,
      y: (i * 11 + 3) % ASCII_ROWS,
      vy: 3.2 + (i % 5) * 1.1,
      phase: i * 0.9,
      glyphIdx: i,
    }))

    const renderDynamicFrame = (nowMs: number) => {
      if (disposed || !inViewport) {
        rafId = 0
        return
      }

      if (nowMs - lastFrameTime < 41) {
        rafId = requestAnimationFrame(renderDynamicFrame)
        return
      }
      const dt = Math.min(0.08, Math.max(0.01, (nowMs - lastFrameTime) / 1000))
      lastFrameTime = nowMs

      const sec = nowMs * 0.001
      const currentPoseMeta = POSE_LIST[poseIdxRef.current] ?? POSE_LIST[0]!
      const poseKey = currentPoseMeta.key
      const character = currentPoseMeta.character
      const sprite = decodedPosesRef.current[poseKey]
      const rows = asciiRowsRef.current
      const ptr = pointerCellRef.current

      if (!sprite || rows.length === 0) {
        rafId = requestAnimationFrame(renderDynamicFrame)
        return
      }

      // Update gently rising ambient particles
      if (!reducedMotion) {
        for (let i = 0; i < particles.length; i++) {
          const b = particles[i]!
          b.y -= b.vy * dt
          if (b.y < 1) {
            b.y = ASCII_ROWS - 2
            b.x = (b.x + 17) % ASCII_COLS
          }
        }
      }

      // Gentle calm breathing & subtle cursor-tracking parallax (no violent shaking!)
      let bodyDx = 0
      let bodyDy = 0
      if (!reducedMotion) {
        bodyDy = Math.round(Math.sin(sec * 2.4) * 0.65)
        bodyDx = Math.round(Math.cos(sec * 1.4) * 0.45)

        if (ptr.inside) {
          bodyDx += Math.round(ptr.normX * 1.5)
          bodyDy += Math.round(ptr.normY * 0.9)
        }
      }

      // Natural eye blink every 3.1 seconds (lasts 160ms)
      const isBlinking = !reducedMotion && (nowMs % 3100) < 160

      const vfxChar = new Array<string>(TOTAL_CELLS).fill('')
      const vfxColor = new Array<string>(TOTAL_CELLS).fill('')
      const pPalette = CHARACTER_PARTICLE_PALETTES[character]

      // 1. Place character-themed ambient particles
      for (let i = 0; i < particles.length; i++) {
        const b = particles[i]!
        const bc = Math.max(
          0,
          Math.min(ASCII_COLS - 1, Math.round(b.x + Math.sin(sec * 2.0 + b.phase) * 1.5)),
        )
        const br = Math.max(0, Math.min(ASCII_ROWS - 1, Math.round(b.y)))
        const idx = br * ASCII_COLS + bc
        vfxChar[idx] = pPalette.glyphs[b.glyphIdx % pPalette.glyphs.length]!
        vfxColor[idx] = pPalette.colors[b.glyphIdx % pPalette.colors.length]!
      }

      // 2. When hovered, crown the character's head with a gentle floating starlight/heart halo
      if (isHoveredRef.current) {
        const haloCx = sprite.centerCol - bodyDx
        const haloCy = Math.max(2, sprite.headTopRow - 1 - bodyDy)
        const starCount = 6
        for (let s = 0; s < starCount; s++) {
          const ang = sec * 2.2 + (s * Math.PI * 2) / starCount
          const sc = Math.round(haloCx + Math.cos(ang) * 14)
          const sr = Math.round(haloCy + Math.sin(ang) * 2.0)
          if (sc >= 1 && sc < ASCII_COLS - 1 && sr >= 1 && sr < ASCII_ROWS - 1) {
            const idx = sr * ASCII_COLS + sc
            vfxChar[idx] = s % 2 === 0 ? '✦' : '°'
            vfxColor[idx] = s % 2 === 0 ? '#ffd166' : currentPoseMeta.accentColor
          }
        }
      }

      // 3. Interactive cursor wake sparkles
      if (ptr.inside && ptr.col >= 0 && ptr.row >= 0) {
        for (let a = 0; a < 6; a++) {
          const ang = sec * 4.5 + (a * Math.PI) / 3
          const cc = Math.round(ptr.col + Math.cos(ang) * 4)
          const cr = Math.round(ptr.row + Math.sin(ang) * 2)
          if (cc >= 0 && cc < ASCII_COLS && cr >= 0 && cr < ASCII_ROWS) {
            const idx = cr * ASCII_COLS + cc
            vfxChar[idx] = a % 2 === 0 ? '✦' : '°'
            vfxColor[idx] = '#ffd166'
          }
        }
      }

      const phaseShift = Math.floor(sec * 10)

      for (let r = 0; r < ASCII_ROWS; r++) {
        let html = ''
        let curHex = ''
        let curRun = ''

        const flush = () => {
          if (!curRun) return
          html += curHex ? `<span style="color:${curHex}">${curRun}</span>` : curRun
          curRun = ''
        }

        // Gentle per-row hair/wing breeze wave displacement
        const hairWaveDx = reducedMotion
          ? 0
          : Math.round(Math.sin(r * 0.34 - sec * 4.8) * 1.1)

        for (let c = 0; c < ASCII_COLS; c++) {
          const screenIdx = r * ASCII_COLS + c

          const srcR = r - bodyDy
          const srcC = c - bodyDx

          let sampleIdx = -1
          if (srcR >= 0 && srcR < ASCII_ROWS && srcC >= 0 && srcC < ASCII_COLS) {
            const tentativeIdx = srcR * ASCII_COLS + srcC
            const reg = sprite.region[tentativeIdx]!
            if (reg === REG_FLOWING_HAIR) {
              const warpedC = Math.max(0, Math.min(ASCII_COLS - 1, srcC + hairWaveDx))
              const warpedIdx = srcR * ASCII_COLS + warpedC
              sampleIdx = sprite.fg[warpedIdx] ? warpedIdx : tentativeIdx
            } else {
              sampleIdx = tentativeIdx
            }
          }

          if (sampleIdx >= 0 && sprite.fg[sampleIdx]) {
            const reg = sprite.region[sampleIdx]!
            const l = sprite.lum[sampleIdx]!
            const bChar = sprite.borderChar[sampleIdx]!
            let ch = ' '
            let hex = sprite.hexColor[sampleIdx]!

            if (bChar) {
              if (reg === REG_FLOWING_HAIR && (r + phaseShift) % 4 === 0) {
                ch = '~'
                hex = sprite.waveColor[sampleIdx]!
              } else {
                ch = bChar
              }
            } else if (reg === REG_EYES_DETAIL && isBlinking) {
              ch = '─'
              hex = '#ffd166'
            } else if (
              reg === REG_FACE_SKIN &&
              (isHoveredRef.current || isBlinking) &&
              (c + r) % 6 === 0
            ) {
              ch = '/'
              hex = '#ff8fab'
            } else if (reg === REG_GOLD_STAR) {
              const twinkle = (c * 3 + r * 5 + phaseShift) % 8
              ch = twinkle === 0 ? '✦' : twinkle < 3 ? '*' : '#'
              hex = twinkle === 0 ? '#fff3b0' : hex
            } else if (reg === REG_FLOWING_HAIR) {
              const waveCrest = Math.sin(r * 0.42 - sec * 6.0 + c * 0.2)
              if (waveCrest > 0.64) {
                ch = waveCrest > 0.86 ? '✦' : '≈'
                hex = sprite.waveColor[sampleIdx]!
              } else {
                const rampIdx = Math.min(
                  HAIR_WAVE_RAMP.length - 1,
                  Math.max(1, Math.floor((l / 255) * (HAIR_WAVE_RAMP.length - 1))),
                )
                ch = HAIR_WAVE_RAMP[rampIdx]!
              }
            } else {
              const rampIdx = Math.min(
                DENSE_RAMP.length - 1,
                Math.max(1, Math.floor((l / 255) * (DENSE_RAMP.length - 1))),
              )
              ch = DENSE_RAMP[rampIdx]!
            }

            if (r < 8 && vfxChar[screenIdx]) {
              ch = vfxChar[screenIdx]!
              hex = vfxColor[screenIdx]!
            }

            if (hex !== curHex) {
              flush()
              curHex = hex
            }
            curRun += escapeHtml(ch)
          } else if (vfxChar[screenIdx]) {
            const hex = vfxColor[screenIdx]!
            if (hex !== curHex) {
              flush()
              curHex = hex
            }
            curRun += escapeHtml(vfxChar[screenIdx]!)
          } else {
            if (curHex !== '') {
              flush()
              curHex = ''
            }
            curRun += ' '
          }
        }

        flush()
        if (rowCache[r] !== html) {
          rowCache[r] = html
          rows[r]!.innerHTML = html
        }
      }

      rafId = requestAnimationFrame(renderDynamicFrame)
    }

    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          inViewport = entry.isIntersecting
          if (inViewport && rafId === 0 && !disposed) {
            lastFrameTime = 0
            rafId = requestAnimationFrame(renderDynamicFrame)
          }
        }
      },
      { threshold: 0.08 },
    )
    obs.observe(stage)

    return () => {
      disposed = true
      obs.disconnect()
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reducedMotion, assetsLoaded])

  // Auto-Director: gently cycles calm poses when visible and not hovered
  useEffect(() => {
    if (reducedMotion || isHovered) return
    const stage = stageRef.current
    if (!stage) return

    let visible = false
    const obs = new IntersectionObserver(
      entries => {
        for (const entry of entries) visible = entry.isIntersecting
      },
      { threshold: 0.12 },
    )
    obs.observe(stage)

    const currentDuration = POSE_LIST[poseIdx]?.durationMs ?? 3800
    const timer = window.setTimeout(() => {
      if (visible && !isHoveredRef.current) {
        setPoseIdx(prev => (prev + 1) % POSE_LIST.length)
      }
    }, currentDuration)

    return () => {
      obs.disconnect()
      window.clearTimeout(timer)
    }
  }, [poseIdx, reducedMotion, isHovered])

  // Gentle GSAP float transition whenever pose changes
  useEffect(() => {
    if (reducedMotion || !asciiSpriteRef.current) return
    const sprite = asciiSpriteRef.current
    gsap.killTweensOf(sprite)
    gsap.fromTo(
      sprite,
      { y: 7, scale: 0.97 },
      { y: 0, scale: 1, duration: 0.42, ease: 'power3.out' },
    )
  }, [activePose.key, reducedMotion])

  // Clicking the companion figure cycles to the next calm expression & overhead whisper constellation
  const handleCycleCompanionWhisper = useCallback(() => {
    onKineticSpike?.(20)
    setIsHovered(true)
    setPoseIdx(prev => (prev + 1) % POSE_LIST.length)
    setHoverSpeechIdx(prev => prev + 1)
  }, [onKineticSpike])

  return (
    <div
      ref={stageRef}
      className="ds-whale-playground"
      data-pose={activePose.key}
      data-character={activePose.character}
      style={{ '--companion-accent': activePose.accentColor } as React.CSSProperties}
    >
      <div
        ref={asciiSpriteRef}
        className="ds-ascii-actor"
        data-hovered={isHovered}
        data-cursor="WHISPER ✦"
        onClick={handleCycleCompanionWhisper}
        onPointerEnter={() => {
          setIsHovered(true)
          setHoverSpeechIdx(prev => prev + 1)
        }}
        onPointerMove={e => {
          const rect = e.currentTarget.getBoundingClientRect()
          const rx = (e.clientX - rect.left) / Math.max(1, rect.width)
          const ry = (e.clientY - rect.top) / Math.max(1, rect.height)
          const nx = (rx - 0.5) * 2
          const ny = (ry - 0.5) * 2
          const ptr = pointerCellRef.current
          ptr.col = Math.floor(rx * ASCII_COLS)
          ptr.row = Math.floor(ry * ASCII_ROWS)
          ptr.normX = nx
          ptr.normY = ny
          ptr.inside = true

          // Pointer movement affects the artwork only; speech advances on entry or its timer.
          if (!reducedMotion && asciiPreRef.current) {
            gsap.to(asciiPreRef.current, {
              x: nx * 10,
              y: ny * 6,
              duration: 0.35,
              ease: 'power3.out',
              overwrite: 'auto',
            })
          }
        }}
        onPointerLeave={() => {
          pointerCellRef.current.inside = false
          setIsHovered(false)
          if (!reducedMotion && asciiPreRef.current) {
            gsap.to(asciiPreRef.current, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: 'elastic.out(1, 0.4)',
              overwrite: 'auto',
            })
          }
        }}
        role="button"
        tabIndex={0}
        aria-label={`Animated Color-ASCII ${activePose.characterLabel}. Hover to bloom overhead whispers, click to cycle calm poses.`}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleCycleCompanionWhisper()
          }
        }}
      >
        <div
          className="ds-whale-core-magnet"
          data-magnetic
          data-cursor="WHISPER ✦"
          data-no-element-pull="true"
          aria-hidden="true"
        />

        <div className="ds-whisper-canopy" data-hovered={isHovered}>
          <div
            ref={speechBoxRef}
            className="ds-speech-bubble"
            data-hovered={isHovered}
          >
            <span className="ds-speech-kaomoji">{activeKaomoji}</span>
            <div ref={speechLinesRef} className="ds-speech-lines" />
          </div>

          {SATELLITE_SLOTS.map((slot, idx) => (
            <div
              key={slot.id}
              ref={el => {
                satelliteRefs.current[idx] = el
              }}
              className={`ds-satellite-whisper ds-sat-${slot.id}`}
              aria-hidden={!isHovered}
            />
          ))}
        </div>

        <img
          src={activePose.src}
          alt=""
          aria-hidden="true"
          className="ds-hologram-ghost"
        />

        <div
          ref={asciiPreRef}
          className="ds-ascii-matrix"
          aria-hidden="true"
        />
      </div>

      <div className="ds-companion-whisper-nav" role="group" aria-label="Switch AI Companion">
        {CHARACTER_TABS.map((tab, idx) => {
          const isCurrentChar = activePose.character === tab.id
          return (
            <span key={tab.id} className="ds-companion-whisper-item">
              {idx > 0 && <i aria-hidden="true">·</i>}
              <button
                type="button"
                className="ds-companion-link"
                aria-pressed={isCurrentChar}
                onClick={() => {
                  const charPoseIndices = POSE_LIST.map((p, i) =>
                    p.character === tab.id ? i : -1,
                  ).filter(i => i >= 0)
                  if (charPoseIndices.length === 0) return
                  if (isCurrentChar) {
                    const posInChar = charPoseIndices.indexOf(poseIdx)
                    const nextPos = (posInChar + 1) % charPoseIndices.length
                    setPoseIdx(charPoseIndices[nextPos]!)
                  } else {
                    setPoseIdx(charPoseIndices[0]!)
                  }
                  setHoverSpeechIdx(prev => prev + 1)
                  onKineticSpike?.(18)
                }}
              >
                {tab.label}
              </button>
            </span>
          )
        })}
      </div>
    </div>
  )
}

export default DeepSeekWhaleStage
