# CHRONICLE — Full Journey V1

A working seven-scene interactive narrative, from Welcome through Goodbye and Restart. All six scroll boundaries now have a V1 implementation. Personal profile fields and destination URLs remain empty by user request; visual decisions marked TBD in the design documents remain reviewable.

## Run

```bash
npm install
npm run dev
```

Verify with `npm run typecheck`, `npm test`, and `npm run build`.

## Journey

| Scene / boundary | Implemented behavior |
| --- | --- |
| 01 Welcome → 02 Composer | Welcome copy scales together beyond the frame; scroll cue fades. Composer reveals in place. Existing restrained Welcome ambience is retained. |
| 02 Composer → 03 Currently | DeepSeek and Grok exert force before the workspace moves. Gemini hops, Claude strolls with a book, GPT quietly observes. The persistent graph slides away with the page. |
| 03 Currently → 04 Profile | DeepSeek switches FALL → PRE_IMPACT → IMPACT → RECOVER → RUN poses. A separate deterministic impulse layer scatters letterforms and text rows, then restores them on reverse. |
| 04 Profile → 05 Space | A masked hole punctures the page. Rings expose depth, text draws inward, and the camera advances through the starfield. |
| 05 Space → 06 Destinations | One continuous 3D point cloud moves gently while future topics give way to destination planets. |
| 06 Destinations → 07 Goodbye | The camera retreats and the space viewport contracts into a hole, revealing the quiet page world. |
| Restart | Goodbye converges beneath a short closing veil, returns to the beginning, removes the scene hash, and focuses CHRONICLE. Graph state survives. |

All scene boundaries use native document scrolling, GSAP ScrollTrigger, and one reversible timeline. No wheel accumulation or per-frame React/Zustand state is used.

## Ownership

| Path | Responsibility |
| --- | --- |
| `src/app/` | Fixed viewport stage, seven persistent scenes, scroll ranges, accessibility and interaction gates, transition lifecycle. |
| `src/scenes/` | Scene content and local animation hooks; no scroll listeners. |
| `src/transitions/` | Character, text, portal, content handoffs, and restart choreography. The existing TransitionFactory contract remains unchanged. |
| `src/features/stack-composer/` | Pure unordered composition engine, graph state, React Flow nodes and controls. |
| `src/features/text-impact/` | Progress-sampled ballistic text impulses, independent of character poses and reversible without numerical integration. |
| `src/features/space/` | One native WebGL canvas and point buffer, seeded stars, camera choreography. One draw call per changed visible frame. |
| `src/components/CharacterCast.tsx` | Registry-driven ensemble and impact pose layers. |
| `src/assets/characters/registry.ts` | Production pose URLs resolved from existing `image/` source assets. |
| `src/data/siteContent.ts` | Currently/Profile content, future topics, destination URLs, and Goodbye labels. |
| `src/stores/` | Low-frequency active scene, reduced motion, and composer readiness. |

Scene 01 has 150svh of scroll distance; scenes 02–06 have 180svh; Goodbye has 100svh. Content remains fixed to the viewport and scenes remain mounted. Non-active scenes are inert and hidden from assistive technology. Composer becomes editable only after Welcome completes, and locks again when the workspace starts moving away or on reverse entry.

Composer recipes are unchanged: Vue + ESP32 → **ESP32 Monitor**, React + TypeScript → **Blueprint Editor**, unknown pairs → **Experimental Concept**. Results are derived, draggable, and non-connectable. Node measurements are retained as presentation metadata so new results become visible; removing an edge still removes its result.

## Content configuration

Edit `src/data/siteContent.ts` to add real profile text or destination URLs. Empty profile values render as an em dash. Empty destination URLs render disabled planets with NOT CONNECTED; no fake URLs or personal claims are supplied. Email can use a `mailto:` URL.

## Accessibility and fallback

- Reduced motion uses fades rather than giant spatial motion, ensemble movement, falling characters, scattering, or camera traversal.
- Restart transfers focus to the Welcome heading; repeated clicks are guarded.
- WebGL unavailable or lost: CSS stars remain visible. Restoring the context recreates the renderer.
- The renderer caps pixel ratio, pauses while hidden, and skips unchanged frames. GSAP context cleanup restores scene transforms and text impulses.
- Desktop and mobile layouts preserve the seven-scene order and readable text.

## Verification

Type checking, 14 unit tests, and production build pass. In-app browser checks cover desktop 1280×800 and mobile 390×844: opening, character push, impact, portal entry, continuous space, disabled destinations, exit, restart, reverse navigation, graph connection/drag/state retention, and resize. Reduced-motion timelines are covered by unit tests; OS media preference and WebGL context loss have not been exercised in the browser.

## Remaining review items

Final palette, typography, precise timing, portal/starfield art direction, and character asset delivery optimization remain design/performance review items. Original PNG poses are large. Vite also reports the existing main bundle size warning. No new dependencies, backend, database, remote Git repository, deployment, push, or merge were introduced.
