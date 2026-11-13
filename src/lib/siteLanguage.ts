export type SiteLanguage = 'en' | 'zh-CN'

const chinese: Record<string, string> = {
  'Skip to content': '跳到正文',
  'CHRONICLE — A PERSONAL UNIVERSE': 'CHRONICLE — 我的个人宇宙',
  'Ideas': '让想法', 'take': '逐渐', 'shape.': '成形。',
  'Between code and imagination,': '在代码与想象之间，',
  'giving every idea a tangible form.': '让每一个念头，有形可见。',
  'DEVELOPER · BUILDER · EXPLORER': '开发者 · 创造者 · 探索者',
  'Explore my work': '探索我的作品', 'Or, create a possibility': '或者，创造一种可能',
  'NOTHING STARTS WHOLE.': '没有什么生来完整。', 'EVERYTHING STARTS SOMEWHERE.': '每一种可能，都有起点。',
  'EVERYTHING BEGINS WITH': '一切始于', 'a fragment.': '一个碎片。',
  'Assembling fragments into new worlds.': '把碎片，拼成新的世界。',
  'FIG. 01 — THE CURIOUS MIND': '图 01 — 好奇之心', 'A STUDY IN': '关于', 'INFINITE POSSIBILITY.': '无限可能的探索。',
  'MOVE CLOSER. LOOK DEEPER.': '靠近一点，看得更深。',
  'Move to refract · Hold to scatter · Release to restore': '移动折光 · 按住解构 · 松开重组',
  'Reassemble': '重组画面', 'Shatter': '解构画面', 'Dim starlight': '收起星光', 'Ignite starlight': '点亮星光',
  'A MOMENT, IN STILLNESS': '片刻静谧', 'EVERY FRAGMENT HAS A STORY': '每个碎片都有故事',
  'PRISM': '棱镜', 'LATTICE': '晶格', 'VORTEX': '漩涡', 'ATTRACT': '吸引', 'REPEL': '排斥',
  'LIGHT': '浅色', 'DARK': '深色', '[CONNECT]': '[联系]',
  'SYS.ORIGIN': '首页', 'DIR.WORK': '作品', 'LAB.ORBIT': '实验', 'DIM.NOTES': '关于', 'END.SIGNAL': '联系',
  'Work': '作品', 'Play': '实验', 'About': '关于', 'Contact': '联系',
  'build things': '创造事物', 'break patterns': '打破惯例', 'stay curious': '保持好奇', 'explore worlds': '探索世界',
  '01 // SELECTED OBSESSIONS': '01 // 精选作品', 'FROM SPARK TO TANGIBLE CRAFT': '从灵感到作品',
  'Selected': '精选', 'obsessions.': '热爱之作。', 'ALL': '全部', 'TOOLS': '工具', 'HARDWARE': '硬件',
  '// OPEN_SOURCE': '// 开源项目', '[EXPLORE ↗]': '[探索项目 ↗]',
  'Structure becomes possibility.': '让结构，成为可能。',
  'A bridge to the physical world.': '连接物理世界的桥梁。',
  'An open connection to intelligence.': '通向智能的开放连接。',
  'Making complex architecture visible. A visual node-graph editor and C++17 / Qt 6 code synthesis engine.': '让复杂架构清晰可见。基于 C++17 / Qt 6 的可视化节点编辑器与代码生成引擎。',
  'Real-time dialogue between silicon and the browser. Live ESP32 sensor telemetry streamed into a reactive Vue interface.': '让芯片与浏览器实时对话，将 ESP32 传感器数据传递到 Vue 响应式界面。',
  'A lightweight edge bridge for intelligence. Open-source PaLM API relay running on Netlify Edge Functions.': '为智能搭建轻量桥梁，运行在 Netlify Edge Functions 上的开源 PaLM API 代理。',
  '02 // ORBITAL SYNTHESIS': '02 // 组合实验室', 'HARMONIC RESONANCE · IN-PLACE FUSION': '波纹共振 · 原地融合',
  'A little': '一点', 'chemistry.': '化学反应。',
  'Sweep across the field to excite': '移动鼠标激起', 'harmonic waves': '共振波纹',
  '; drag orbital cores together to': '；拖动技术球靠近，即可', 'synthesize in place': '原地合成',
  'and keep combining. When a composite core matches a verified project,': '并继续融合。组合匹配真实项目时，',
  'left-click': '左键点击', 'to open its repository, or': '可打开仓库，或用', 'right-click': '右键点击',
  'to eject a constituent technology.': '随机弹出其中一项技术。',
  'Calibrating orbital synthesis cores…': '正在准备技术合成球…',
  '03 // DIMENSIONS & NOTES': '03 // 兴趣与笔记', 'STAY CURIOUS, KEEP BUILDING': '保持好奇，继续创造',
  'More than': '不止', 'one thing.': '一种可能。',
  'Rather than a fixed label, I prefer to introduce myself through what I am currently building—working at the intersection of low-level developer tools, autonomous AI agents, and expressive hardware interfaces.': '比起固定的标签，我更愿意用正在做的事介绍自己：在开发工具、AI Agent 和软硬件界面之间，寻找值得继续探索的连接。',
  '> CURRENT_FOCUS': '> 最近在做', 'Qt Blueprint Generator & Interactive Shaders': 'Qt 蓝图生成器与交互着色器',
  'Exploring visual compilation pipelines and agentic engineering workflows.': '探索可视化编译流程与智能体工程工作流。',
  'Developer tools': '开发工具', 'AI & agents': 'AI 与智能体', 'Web & hardware': '网页与硬件',
  'Visual Architecture & Compilation': '可视化架构与编译', 'Context Orchestration & Reasoning': '上下文编排与推理',
  'Creative Shaders & Physical Computing': '创意着色器与物理计算',
  'Turning intricate systems into tactile instruments.': '把复杂系统，变成顺手的工具。',
  'Connecting context, toolchains, and autonomous decisions.': '连接上下文、工具链与自主决策。',
  'Ideas on screen that reach out and touch the physical world.': '让屏幕里的想法，触及真实世界。',
  'Starting from Qt 6 and C++, exploring visual node blueprints, AST inspection, and low-friction engineering workflows. Great tools disappear into the craft so you can focus entirely on what you are creating.': '从 Qt 6 与 C++ 出发，探索可视化节点蓝图、AST 检查与顺畅的开发流程。好的工具融入创作，让人专注于要创造的东西。',
  'Investigating how AI agents perceive workspace context, invoke deterministic tools, and decompose abstract ideas into verifiable engineering steps—an ongoing, living experiment.': '探索 AI 智能体如何理解工作区上下文、调用确定性工具，并把抽象想法拆解成可验证的工程步骤。这是一场持续进行的实验。',
  'Bridging digital interfaces with physical devices through WebGL shaders, GSAP motion systems, Vue, and ESP32 telemetry—searching for new chemistry between light, physics, and silicon.': '通过 WebGL、GSAP、Vue 与 ESP32 连接数字界面和物理设备，在光影、物理与芯片之间寻找新的化学反应。',
  '04 // UNTIL THE NEXT IDEA': '04 // 直到下一个想法', 'STAY IN TOUCH': '保持联系',
  'Let’s make': '一起创造', 'something matter.': '值得留下的东西。',
  'Explore the open-source repositories on GitHub, or connect to build what comes next.': '欢迎在 GitHub 查看我的开源项目，或一起探索下一个可能。',
  'SOURCE_CODE ↗': '本站源码 ↗', 'CYCLE_START ↑': '回到顶部 ↑',
  'INPUT': '输入', 'Source': '起点', 'TRANSFORM': '转换', 'OUTPUT': '输出',
  'MOVE CURSOR TO BEND WIRES': '移动鼠标，弯曲连线', 'SWITCH ROUTE (': '切换路径（',
  'SIGNAL GAIN': '信号增益', 'SIGNAL //': '信号 //',
  'ONE CONNECTION CAN START SOMETHING // PLUCK THE CHORD': '一次连接，开启新的可能 // 拨动弦线',
  '[SKIP // ENTER NOW ↗]': '[跳过 // 立即进入 ↗]',
  'Measuring glyph segments via @chenglou/pretext…': '正在准备交互排版…',
  'Synthesizing DeepSeek Whale-Maid Color-ASCII matrix…': '正在准备彩色字符角色…',
  'SYNTHESIZE PAIR ↗': '融合所选技术 ↗', 'RESET FIELD ↺': '重置实验场 ↺',
  'OPEN REPO ↗': '打开项目 ↗', 'L-CLICK REPO · R-CLICK EJECT': '左键打开 · 右键弹出', 'DRAG MORE · R-CLICK EJECT': '继续融合 · 右键弹出',
  'SWEEP TO EXCITE HARMONIC WAVES · DRAG CORES TO SYNTHESIZE IN PLACE · LEFT-CLICK REPO · RIGHT-CLICK EJECT': '移动激起波纹 · 拖动原地融合 · 左键打开项目 · 右键弹出技术',
  'ORBITAL FIELD RESET · SWEEP OR DRAG CORES TO EXCITE HARMONIC SYNTHESIS': '实验场已重置 · 移动或拖动技术球，开始新的组合',
  'Ideas take shape.': '让想法逐渐成形。', 'Filter projects': '筛选作品', 'Rotate to next dimension': '切换到下一个兴趣方向',
  'Shader rendering mode': '画面渲染模式', 'Primary navigation': '主导航', 'Chapter progress navigation': '章节导航',
  'Enter a prompt idea': '输入一个想法', 'Send to edge relay demo': '发送到本地代理演示',
  'EDGE STANDBY': '连接待命', 'Human': '人类', 'Idea': '想法', 'Code': '代码',
  'TYPE A SPARK TO IGNITE THE ORBIT': '写下灵感，点亮连接',
  'Interactive orbital core synthesis field': '可拖动融合的技术球实验场',
  'Discovered open-source repositories': '已发现的开源项目',
}

Object.assign(chinese, {
  'Connect': '联系', 'Blog': '博客', 'Source': '源码', 'Source code': '本站源码', 'Back to top': '回到顶部',
  'All': '全部', 'Tools': '工具', 'Hardware': '硬件', 'Reset': '重置', 'Split': '拆分',
  'Resume': '简历', 'Email': '邮箱', 'NOT YET LINKED': '尚未开放',
  'CHRONICLE — A personal universe': 'CHRONICLE — 我的个人宇宙',
  'Developer · Builder · Explorer': '开发者 · 创造者 · 探索者',
  'Nothing starts whole.': '没有什么生来完整。', 'Everything starts somewhere.': '每一种可能，都有起点。',
  'Everything begins with': '一切始于', 'From spark to tangible craft': '从灵感到作品',
  'Stay curious, keep building': '保持好奇，继续创造', 'Dimensions & notes': '兴趣与笔记',
  'Selected obsessions': '精选作品', 'A little chemistry': '组合实验室', 'More than one thing': '不止一种可能',
  'Spin the orbit, then tap two technologies to': '转动轨道，点击两项技术，即可',
  'synthesize them at the core': '在核心融合',
  '. When a composite matches a verified project, it opens into its repository. Otherwise, it’s': '。组合匹配真实项目时，可以打开项目仓库；否则，它将成为',
  'a new possibility': '一种新的可能', 'A new possibility': '一种新的可能',
  'Drag to spin the orbit · tap two drops to fuse them.': '拖动旋转轨道 · 点击两个水滴进行融合。',
  'In-place fusion': '原地融合', 'Current focus': '最近在做', 'Public repositories': '公开仓库',
  'Focus': '关注', 'Building': '创造', 'Exploring': '探索', 'Learning': '学习', 'Beyond': '更多', 'Connected': '连接',
  'Until the next idea': '直到下一个想法', 'Stay in touch': '保持联系',
  'Every ending leaves room for another beginning.': '每一次结束，都为新的开始留出空间。',
  'Until the next idea.': '直到下一个想法。', 'Keep making room for wonder.': '始终为好奇留出空间。',
  '打开菜单': '打开菜单', '关闭菜单': '关闭菜单', '切换到浅色': '切换到浅色', '切换到深色': '切换到深色',
})
const english: Record<string, string> = Object.fromEntries(Object.entries(chinese).map(([en, zh]) => [zh, en]))
Object.assign(english, {
  '在代码与想象之间，': 'Between code and imagination,', '让每一个念头，有形可见。': 'giving every idea a tangible form.',
  '打开菜单': 'Open menu', '关闭菜单': 'Close menu', '切换到浅色': 'Switch to light theme', '切换到深色': 'Switch to dark theme',
  '切换深浅色': 'Toggle color theme', '回到顶部': 'Back to top', 'CHRONICLE，回到顶部': 'CHRONICLE, back to top',
  '移动端导航': 'Mobile navigation',
})

export function readLanguage(storage?: Pick<Storage, 'getItem'>): SiteLanguage {
  try { return storage?.getItem('chronicle-language') === 'zh-CN' ? 'zh-CN' : 'en' } catch { return 'en' }
}

export function translate(source: string, language: SiteLanguage): string {
  const key = source.replace(/\s+/g, ' ').trim()
  const text = (language === 'zh-CN' ? chinese : english)[key]
  if (text) return source.replace(/\S[\s\S]*\S|\S/, text)
  if (language === 'en') return source
  return source
    .replace(/\. Open its repository\.$/, '。可打开项目仓库。')
    .replace(/A new possibility\./, '一种新的可能。')
    .replace(/^(.*) pulled to the core — pick another drop to fuse\.$/, '$1 已移至核心，请选择另一项技术融合。')
    .replace(/^Split back into (.*) and (.*)\.$/, '已拆分为 $1 和 $2。')
    .replace('Selection cleared.', '已清除选择。')
    .replace('Orbit reset. Tap two drops to fuse them.', '轨道已重置，点击两个水滴进行融合。')
}

export function localize(source: string): string {
  return translate(source, document.documentElement.lang === 'zh-CN' ? 'zh-CN' : 'en')
}

/** Translate once before animation modules cache text; switching rebuilds their caches. */
export function initSiteLanguage(): number | undefined {
  let storage: Storage | undefined
  try { storage = localStorage } catch { /* private browsing */ }
  const requested = new URL(location.href).searchParams.get('lang')
  const language = requested === 'en' || requested === 'zh-CN' ? requested : readLanguage(storage)
  document.documentElement.lang = language
  document.querySelectorAll('[lang]').forEach(el => el.setAttribute('lang', language))
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
  while (walker.nextNode()) {
    const node = walker.currentNode
    if (node.parentElement?.closest('script, style, svg, code, pre, .nav small, .menu em')) continue
    if (node.textContent?.trim()) node.textContent = translate(node.textContent, language)
  }
  document.querySelectorAll('[aria-label], [title], [placeholder]').forEach(el => {
    for (const attribute of ['aria-label', 'title', 'placeholder']) {
      const value = el.getAttribute(attribute)
      if (value) el.setAttribute(attribute, translate(value, language))
    }
  })
  const button = document.querySelector<HTMLButtonElement>('.site-language')
  if (button) {
    button.textContent = language === 'en' ? '中文' : 'EN'
    button.setAttribute('aria-label', language === 'en' ? 'Switch to Chinese' : '切换为英文')
    button.addEventListener('click', () => {
      const next = language === 'en' ? 'zh-CN' : 'en'
      try { storage?.setItem('chronicle-language', next) } catch { /* URL remains available */ }
      try { sessionStorage.setItem('chronicle-language-scroll', String(scrollY)) } catch { /* optional */ }
      const url = new URL(location.href)
      url.searchParams.set('lang', next)
      location.assign(url)
    })
  }
  try {
    const saved = sessionStorage.getItem('chronicle-language-scroll')
    sessionStorage.removeItem('chronicle-language-scroll')
    if (saved !== null && Number.isFinite(Number(saved))) return Number(saved)
  } catch { /* optional restoration */ }
  return undefined
}
