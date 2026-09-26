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
| 02 Composer → 03 Currently | After an extended editing interval, DeepSeek and Grok push at the left edge of the full-screen board. Gemini hops, Claude strolls with a book, GPT observes. The ensemble follows the moving edge; graph state persists. |
| 03 Currently → 04 Profile | DeepSeek's impact scatters letterforms and text rows. The shared chapter background stays fixed while Profile copy slowly floats up in sequence. |
| 04 Profile → 05 Space | A scroll threshold launches a complete 0.95s portal traversal. Input is locked until the camera reaches Space, then the scroll position advances to Scene 05. |
| 05 Space → 06 Destinations | The shared camera advances, pans sideways, and turns. Future copy recedes while destination planets approach in the same star world. |
| 06 Destinations → 07 Goodbye | An automatic 0.95s retreat closes the portal and lands at Goodbye. Both portal crossings also complete automatically when returning. |
| Restart | Goodbye converges beneath a short closing veil, returns to the beginning, removes the scene hash, and focuses CHRONICLE. Graph state survives. |

All boundaries use native scrolling, GSAP ScrollTrigger, and one reversible timeline. Four boundaries remain scrubbed. Portal entry and exit use scroll thresholds to launch time-driven playback (0.95s, or a 0.28s reduced-motion fade), temporarily lock scroll/pointer input, then position the document at the destination. Cleanup kills an active traversal and restores input and overflow. No wheel accumulation or per-frame React/Zustand state is used.

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

Scene timing lives in `src/app/sceneRegistry.ts`: Welcome has 200svh, Composer 500svh, scenes 03–06 300svh each, and Goodbye 100svh. The journey totals 20 viewport heights. Each scene has a dedicated hold before its outgoing transition: Composer reserves the first 65% (325svh) for editing with all push characters hidden. Content remains fixed and scenes remain mounted. Non-active scenes are inert and hidden from assistive technology. Composer becomes editable after Welcome completes, and locks when its outgoing transition starts.

Composer recipes are unchanged: Vue + ESP32 → **ESP32 Monitor**, React + TypeScript → **Blueprint Editor**, unknown pairs → **Experimental Concept**. Results are derived, draggable, and non-connectable. Node measurements are retained as presentation metadata so new results become visible; removing an edge still removes its result.

The blueprint fills the entire viewport and shares Welcome's background and grid. User wheel/pinch/double-click zoom, background panning, automatic drag panning, and viewport controls are disabled. Only nodes and edges are editable. Initial fitting and resizing adapt the layout to the display; adding a result does not refit or move the viewport. Wheel scrolling continues the journey. Node ornaments rotate, sweep, pulse, and charge independently of node geometry and connection handles.

Scenes 03 and 04 share the same deep blue background, mint accents, typography, and text-row treatment. Each scene has visible moving haze, orbital points, expanding waves, drifting particles, crossing light trails, and a pointer-responsive light field. Headings breathe with light; text rows have moving accents; composer nodes and edges pulse without moving the fixed viewport. Space continuously travels through the seeded starfield using shader time, even when scrolling stops, with independent twinkling, lateral drift, meteors, nebula motion, floating planets and moving rings. Inactive scene effects pause, and all added motion becomes static with reduced-motion preferences.

## Content configuration

Narrow screens start with a two-column, three-row graph to keep node labels readable. This layout is chosen only when the store initializes; later resizing or scene transitions preserve edited node positions.

Edit `src/data/siteContent.ts` to add real profile text or destination URLs. Empty profile values render as an em dash. Empty destination URLs render disabled planets with NOT CONNECTED; no fake URLs or personal claims are supplied. Email can use a `mailto:` URL.

## Accessibility and fallback

- Reduced motion uses fades rather than giant spatial motion, ensemble movement, falling characters, scattering, or camera traversal.
- Restart transfers focus to the Welcome heading; repeated clicks are guarded.
- WebGL unavailable or lost: CSS stars remain visible. Restoring the context recreates the renderer.
- The renderer caps pixel ratio, pauses while hidden, and limits ambient animation to 30fps. Reduced motion skips unchanged frames. GSAP context cleanup restores scene transforms and text impulses.
- Desktop and mobile layouts preserve the seven-scene order and readable text.

## Verification

Type checking, 17 unit tests, and production build pass. In-app browser checks cover desktop 1280×800 and mobile 390×844: opening, character push, impact, portal entry, continuous space, disabled destinations, exit, restart, reverse navigation, graph connection/drag/state retention, and resize. Reduced-motion timelines are covered by unit tests; OS media preference and WebGL context loss have not been exercised in the browser.

## Remaining review items

Final palette, typography, precise timing, portal/starfield art direction, and character asset delivery optimization remain design/performance review items. Original PNG poses are large. Vite also reports the existing main bundle size warning. No new dependencies, backend, database, remote Git repository, deployment, push, or merge were introduced.
