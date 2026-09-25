# Project Agent Rules

Shared rules for every agent working in this repository (Codex / GPT-5.6 Sol, OMP / DeepSeek, other models).
Role-specific permissions live in `docs/` — see [Agent-Specific Rules](#agent-specific-rules).

## Project Overview

- CHRONICLE (`chronicle-skeleton`): a high-interaction personal website built with React + TypeScript, Vite, Tailwind CSS, Zustand, GSAP (+ ScrollTrigger), and `@xyflow/react`. `package.json` and the lockfile are the authority for exact versions.
- The site is one scroll journey: seven scenes (`src/scenes/scene-01-welcome` … `scene-07-goodbye`) with one scroll-scrubbed transition per boundary (`src/transitions/*`).
- The current stage and phase scope are recorded in `README.md`. Never assume which optional libraries are installed — inspect `package.json` and the lockfile. Deferred technologies (3D / R3F, physics, smooth scroll, motion libraries) must not be introduced unless the current task or the project phase explicitly permits them.
- Module ownership (also in `README.md`): `src/app/` scene order, DOM ownership, ScrollTrigger wiring; `src/scenes/` content; `src/transitions/` one animation per boundary; `src/features/stack-composer/` engine + store + React Flow components; `src/stores/` low-frequency state; `src/hooks/`; `src/assets/characters/`; `src/styles/`.

## Architecture Ownership

- Never break existing architecture without an explicit task. Understand the current design (SceneDirector, the transition factory contract, the composition engine) before modifying near it.
- Large refactors happen only when the task asks for them.
- Never widen scope for convenience: no opportunistic optimization, renaming, formatting, or "while I'm here" cleanup.
- Architectural decisions belong to the architect role and the user, not to whoever happens to be editing a file.

## Technology Constraints

- Extend the existing stack. Adding an overlapping library is forbidden without explicit approval:
  - Animation: GSAP + ScrollTrigger. Do not add Framer Motion, Motion, Anime.js, or Lenis.
  - State: Zustand. Do not add Redux, MobX, or Jotai.
  - Graph editing: `@xyflow/react`. Do not replace the composer's graph library.
  - 3D: never add a second renderer. If a WebGL layer already exists, it is the only renderer — inspect `package.json` / `src/` rather than assuming.
- A new dependency requires, before any install: (1) why the existing tech cannot do it, (2) what problem it solves, (3) its cost and the zero-dependency alternative. Then wait for approval.
- No path aliases are configured — imports stay relative. `strict`, `noUnusedLocals`, and `noUnusedParameters` are enabled; keep code compiling under them.

## State & Animation Rules

- Never put per-frame animation values (x, y, rotation, scale, opacity, scroll progress, shader uniforms) into React state or Zustand.
- The established pattern is `src/app/SceneDirector.tsx`: per-frame values live in GSAP timelines, a `useRef` map, and DOM custom properties (`--scene-progress`, `--transition-progress`) plus `data-active` / `data-transitioning`. Follow it.
- Zustand holds low-frequency shared state only: `sceneStore` (currentScene, reducedMotion) and `composerStore` (graph data, result positions).
- Prefer progress-driven GSAP + ScrollTrigger animation that plays forward and backward via `scrub`. Never hand-roll wheel-delta accumulation to drive scenes.
- Respect `prefers-reduced-motion`: transition factories receive `reducedMotion` in `TransitionElements` and must simplify. `sceneStore.reducedMotion` mirrors the media query.
- Never make React re-render per frame.

## Scene Boundaries

- Scenes render content and do not listen to scrolling. Scroll and ScrollTrigger wiring belongs to `src/app/`.
- A scene must not query or mutate another scene's DOM, and must not communicate through implicit globals.
- The cross-module contract is: `sceneRegistry` order, the `[data-scene-id]` / `[data-scene-content]` attributes, and the transition factories. Renaming or reordering those is an architecture change, not a styling change.
- One scene directory = one exported `XxxScene` component (`WelcomeScene` … `GoodbyeScene`), mounted once by the director and kept mounted for the whole journey.
- Scene ↔ transition coupling goes through `TransitionFactory` in `src/transitions/types.ts`: `({ from, to, reducedMotion }) => gsap.timeline`. One folder per boundary, one `index.ts` entry file.
- Keep transition animation decoupled from scene business logic.

## Stack Composer Rules

- Pipeline: UI (`components/`) → Composition Engine (`engine/`) → recipe data. `engine/composition.ts` stays pure — type-only imports, no React, no Zustand, no React Flow runtime imports.
- Connection semantics are an unordered set of technologies. The key is `normalizeComposition` (dedupe + sort + join `+`), so `vue+esp32` === `esp32+vue`. Never introduce a direction-dependent key.
- Result nodes are derived, never stored: `deriveResultNodes(techNodes, edges, resultPositions)`. Node types are `'tech' | 'project' | 'concept'`; results are draggable, non-connectable, and disappear when their edge is deleted.
- Recipe and kind decisions live in the engine's `recipes` map. Do not scatter them through JSX, `onConnect`, or `useEffect`.
- Derivation stays in the `useMemo` in `StackComposer.tsx`; positions of results stay in `resultPositions` in the store.

## Asset Rules

- Character art is production art. Never redraw a character roughly in CSS, never substitute hand-made SVG stand-ins, never invent a parallel naming scheme.
- Register assets in `src/assets/characters/registry.ts` (`CharacterId` + `characterAssets`); per-character directories are lowercase (`gpt/`, `claude/`, `gemini/`, `grok/`, `deepseek/`).
- File naming: `{CHARACTER}_{ACTION}.png` or `{CHARACTER}_{ACTION}_{VARIANT}.png` with uppercase variant `A|B|C` (e.g. `GPT_OBSERVE_B.png`, `DS_PUSH_HARD.png`).
- Never hardcode asset paths inside components — resolve them through the registry / asset map.
- Translating, rotating, or scaling a character is code work (GSAP). Complex poses come from existing pose assets.

## 3D Rules

- If a WebGL layer exists (inspect the repo — do not assume): one canvas for the whole site. Do not create a canvas per scene.
- Build repeated geometry with `Points`, `InstancedMesh`, and `BufferGeometry`. Never one React component per star or particle.

## Code Quality

- Strict TypeScript. No `any`, `as any`, `@ts-ignore`, or `@ts-nocheck` — if one is truly unavoidable, explain why.
- Prefer explicit types, discriminated unions, pure functions, small modules, and the existing feature-based structure. Do not over-abstract.
- Match the existing style: 2-space indent, single quotes, no semicolons, `import type` for type-only imports.
- Naming: components PascalCase (`StackComposer.tsx`), scene directories `scene-0N-name/`, transition directories kebab-case containing only `index.ts`, other modules camelCase (`composerStore.ts`).

## Testing

- Verify every change with the scripts `package.json` actually defines — inspect it first (`typecheck`, `test`, `build` as of writing). Never claim a check passed that you did not run, and do not add tooling such as a linter.
- Before choosing a test strategy, inspect the current test setup and `package.json`. Do not add test infrastructure (jsdom, testing-library, vitest environment config) unless the task explicitly allows that dependency and config change.
- Test the behavior the task changes. Never report success while typecheck, tests, or build fail.

## Git Safety

Shared safety principles — these apply to every agent, whatever its role:

- Never assume repository history or working-tree state. Before Git-related work, inspect `git status`, `git branch --show-current`, and `git log` / `git diff` when relevant.
- Always assume there may be uncommitted work from the user or another agent. Never overwrite, delete, clean, revert, or "tidy" unknown changes.
- If the task starts with unexpected or potentially conflicting local changes: stop, report, and wait for the user's decision. Do not auto-stash, auto-commit, reset, or clean.
- Destructive operations are forbidden without explicit authorization: `git reset --hard`, `git clean`, force push, forced checkout that overwrites work, deleting unknown branches, rewriting or rebasing shared history.
- `node_modules/`, `dist/`, `.vite/`, `*.tsbuildinfo` are derived or ignored: never edit them by hand and never treat them as source.

Role permissions:

- **Codex / main engineering agent**: when the user's current task explicitly authorizes a normal Git workflow, it may create feature branches, `git switch`, non-destructive `git checkout`, `git add`, and `git commit`. By default it still may not `push`, merge into the main branch, force push, run destructive resets/cleans, or rewrite history unless the user explicitly authorizes that too.
- **Any agent** authorized to run a Git workflow for formal module development must read `docs/GIT_WORKFLOW.md` first — it defines branch, commit, verification, and finish conventions.
- **OMP / DeepSeek**: Git stays read-only per `docs/OMP_RULES.md`. `docs/GIT_WORKFLOW.md` grants no permission, and Codex being allowed to write Git history does not extend to OMP.
- The final history decisions — merging, squashing, pushing, discarding a branch — belong to the user, not to any agent.

## Documentation

- Update `README.md` (and the relevant file in `docs/`) when a change affects architecture, module ownership, scripts, public API, or the current phase / deferred list.
- Do not produce low-value documents for small edits.

## Design Context

- For design, interaction, scene, transition, or character work, read the relevant document first: `docs/DESIGN_VISION.md`, `docs/SCENES.md`, `docs/TRANSITIONS.md`, `docs/CHARACTERS.md`, `docs/VISUAL_DIRECTION.md`.
- Those documents are the product / design source of truth. Do not reinterpret unresolved decisions (tagged `DIRECTION` or `TBD`) as implementation requirements.

## Agent-Specific Rules

- **OMP / DeepSeek**: read `docs/OMP_RULES.md` before starting any work. It defines their scope and permission limits (scoped implementation agent, not architect).
- **Everyone else** (Codex / GPT-5.6 Sol, other high-capability models): `docs/OMP_RULES.md` does not constrain you. Its restrictions are not default restrictions for your own work unless the user explicitly says so.
- Do not copy OMP's scoped restrictions into this file, and do not copy this file's public rules in a way that silently changes another role's authority.
- The user is the final decision maker. When rules conflict, the user resolves it — never unilaterally.
