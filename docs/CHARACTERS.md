# Characters

The five AI characters used in CHRONICLE: narrative role, personality, allowed behavior, and the pose assets they use.

These are this project's own **fan-made / creative interpretation**. They are not official brand definitions of the named products, and nothing here should be presented as an official statement about them.

Status tags: `LOCKED` (decided, do not change unilaterally) · `DIRECTION` (strong intent, reviewable) · `TBD` (not decided — propose, do not invent).

Asset authority:

- `src/assets/characters/registry.ts` (`CharacterId`, `characterAssets`) is the authority for which assets the app may use.
- Staged source art lives under `image/<Model>/`.
- `LOCKED` Repo per-character directories are lowercase and match `CharacterId` (`gpt/`, `claude/`, `gemini/`, `grok/`, `deepseek/`). Staged folders may differ in capitalization; keep repo naming lowercase.

## Role Summary

| Character | Narrative role | Effort | Pose vocabulary |
| --- | --- | --- | --- |
| DeepSeek (`DS`) | Main laborer / action lead | Highest | FALL, PRE_IMPACT, IMPACT, RECOVER, RUN, PUSH, PUSH_HARD, PULL |
| Grok | Second laborer | High | PUSH, PULL |
| Gemini | Active support / atmosphere | Medium | FOLLOW, HOP |
| Claude | Casual participant | Low | FOLLOW, LOOKING_BOOK, WALK_WITH_BOOK |
| GPT | Light support, stable companion | Low, calm | FOLLOW_A/B/C, OBSERVE_A/B/C, SUPPORT_A/B/C |

## DeepSeek

- Abbreviation: `LOCKED` DS (asset prefix `DS_`).
- Role: `LOCKED` primary laborer and action lead — most motion, most effort, strongest comedic effect.
- Responsibilities: `LOCKED` pushes the page (02 → 03), falls and impacts on text (03 → 04), runs.
- Pose semantics: `LOCKED` FALL, PRE_IMPACT, IMPACT, RECOVER, RUN, PUSH, PUSH_HARD, PULL.
- Key pose sequence: `LOCKED` FALL → PRE_IMPACT → IMPACT → RECOVER (used by the 03 → 04 impact beat).
- Used in: `LOCKED` 02 → 03 (main force) and 03 → 04 (sole lead).

## Grok

- Asset prefix: `GROK_`.
- Role: `DIRECTION` second laborer. Seriously pushing, less exaggerated than DeepSeek.
- Poses: `LOCKED` PUSH, PULL are the existing vocabulary; a small set is sufficient.
- Used in: `LOCKED` 02 → 03.

## Gemini

- Asset prefix: `GEMINI_`.
- Role: `DIRECTION` active support / atmosphere. Does not carry primary push force.
- Character: `DIRECTION` lively, playful, bouncing, active; trails the group and lifts the energy.
- Poses: `LOCKED` FOLLOW, HOP.
- Used in: `LOCKED` 02 → 03.

## Claude

- Asset prefix: `CLAUDE_`.
- Role: `DIRECTION` leisurely participant. Holds a book, reads, walks slowly, follows the group.
- Comedy source: `LOCKED` while the others work hard, Claude appears to be merely walking past — "took part, but did not really work".
- Poses: `LOCKED` FOLLOW, LOOKING_BOOK, WALK_WITH_BOOK.
- Used in: `LOCKED` 02 → 03.

## GPT

- Asset prefix: `GPT_`.
- Role: `LOCKED` light support / stable following / quiet observation. Explicitly **not** a primary pusher.
- Character: `LOCKED` quiet, dreamlike, calm, gentle, stable, reliable, companion-like.
- Constraint: `LOCKED` GPT must never strain-push like DeepSeek or Grok; motion stays restrained, steady, and soft.
- Pose groups: `LOCKED` FOLLOW (A/B/C), OBSERVE (A/B/C), SUPPORT (A/B/C).
- Variant choice per beat: `TBD` — which of A/B/C is used where is not decided.
- Used in: `LOCKED` 02 → 03.

## Animation Principles

- `LOCKED` **AI decides what the character looks like. Code decides how the character moves.**
- Art defines: pose, character appearance, major body deformation.
- Code / GSAP defines: translate, rotate, scale, opacity, timeline, scroll synchronization.
- `LOCKED` Do not generate hundreds of animation frames. Ordinary displacement is procedural animation; when a major deformation is needed, switch to a different pose asset.
- `LOCKED` Character images must be normalized to a consistent canvas size, apparent scale, bottom baseline, and viewing direction, so the site can swap poses directly without repositioning hacks.
- `LOCKED` Never redraw a character approximately in CSS and never substitute hand-made SVG stand-ins for production art.
- `LOCKED` Complex poses come from existing pose assets; only simple translate / rotate / scale work is code-driven.
