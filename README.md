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
| 01 Welcome → 02 Composer | Welcome copy scales together beyond the frame; scroll cue fades. Composer reveals in place. Welcome now has a large sculptural eclipse and luminous mint orbits, a drifting light field, pointer parallax and staggered letter entrances. |
| 02 Composer → 03 Currently | After an extended editing interval, DeepSeek and Grok push at the left edge of the full-screen board. Gemini hops, Claude strolls with a book, GPT observes. The ensemble follows the moving edge; graph state persists. |
| 03 Currently → 04 Profile | DeepSeek has an extended visible descent, followed by impact, recovery and a run-off. The background stays fixed while Profile copy slowly floats up in sequence. |
| 04 Profile → 05 Space | A scroll threshold launches a complete 1.25s portal traversal. Input is locked until the camera reaches Space, then the scroll position advances to Scene 05. |
| 05 Space → 06 Destinations | Forward space traversal: future copy passes the camera, stars stretch radially during acceleration, open space fills the frame, then planets approach from depth as the camera decelerates. |
| 06 Destinations → 07 Goodbye | An automatic 1.25s retreat closes the portal and lands at Goodbye. Both portal crossings also complete automatically when returning. |
| Restart | Goodbye converges beneath a short closing veil, returns to the beginning, removes the scene hash, and focuses CHRONICLE. Graph state survives. |

Every boundary uses a native scroll threshold, GSAP ScrollTrigger, and a forward timeline plus an optional dedicated return timeline. Once triggered, playback runs to completion independently of scroll input. Durations live in `sceneRegistry.ts`: Welcome 3.1s, ensemble push/pull 3.6s, DeepSeek impact and floating Profile 5.6s, portal entry/exit 1.25s each, and space traversal 2.4s. Reduced motion uses 0.35s simplified boundaries. Main content is temporarily inert; wheel, touch scroll and scroll keys are blocked. On arrival the document moves to the destination's reading/editing interval and input returns. Return playback finishes fully too. Scene 03 to 02 uses DS_PULL / GROK_PULL artwork with repeated exertion and accompanying hops. Scene 04 to 03 uses a separate 1.8s text return: Profile fades while settled Currently copy floats into place, without replaying the impact. Restart uses the same input lock and a roughly 1.6s closing veil. Cleanup kills active playback and restores input and overflow. No wheel accumulation or per-frame React/Zustand state is used.

The first visit in each tab session opens with a skippable Loading sequence that warms fonts and the two primary character poses. It completes after resource readiness and a short minimum presentation, with a six-second timeout fallback. Journey input is locked while the overlay is visible. Reduced motion shortens the sequence. Welcome letters enter after the overlay closes; Restart retains its own existing transition.

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

Scene timing lives in `src/app/sceneRegistry.ts`: Welcome and scenes 03–06 have 150svh, Composer 200svh, and Goodbye 100svh, totaling 10.5 viewport heights. Welcome triggers after 18svh; Composer reserves 50svh for editing with the cast hidden; scenes 03–06 trigger after 30svh. Scroll distance is independent of playback duration, so the shorter wheel journey preserves the longer animation pacing. Content remains fixed and scenes remain mounted. Non-active scenes are inert and hidden from assistive technology. Composer becomes editable after Welcome completes, and locks when its outgoing transition starts.

Composer recipes are unchanged: Vue + ESP32 → **ESP32 Monitor**, React + TypeScript → **Blueprint Editor**, unknown pairs → **Experimental Concept**. Results are derived, draggable, and non-connectable. Node measurements are retained as presentation metadata so new results become visible; removing an edge still removes its result.

The blueprint fills the entire viewport and shares Welcome's background and grid. User wheel/pinch/double-click zoom, background panning, automatic drag panning, and viewport controls are disabled. Only nodes and edges are editable. Initial fitting and resizing adapt the layout to the display; adding a result does not refit or move the viewport. Wheel scrolling continues the journey. Node ornaments rotate, sweep, pulse, and charge independently of node geometry and connection handles.

Scenes 03 and 04 share the same deep blue background, mint accents, typography, and text-row treatment. Each scene has visible moving haze, orbital points, expanding waves, drifting particles, crossing light trails, and a pointer-responsive light field. Headings breathe with light; text rows have moving accents; composer nodes and edges pulse without moving the fixed viewport. Space continuously travels through the seeded starfield using shader time, even when scrolling stops, with independent twinkling, lateral drift, meteors, nebula motion, floating planets and moving rings. Inactive scene effects pause, and all added motion becomes static with reduced-motion preferences.

## Content configuration

Scene 07 is a full-viewport typographic field with a slim heading and footer. Its font size adapts to the available area, and its larger moving opening follows pointer movement across the page, including touch pointers. Scene 07 uses the user-requested `@chenglou/pretext` 0.0.9 dependency for a flowing farewell letter. The paragraph is compiled with the library's rich-inline helper, so upper-case tokens (`CHRONICLE`) become inline stamps with their own weight, tracking and chrome width, and collapsed boundary spaces return as fragment gaps. Text is prepared once per font/resize; cached measurements route each DOM line around both sides of a large central circular opening at up to 30fps. The chosen size is the largest one whose every line still fits with the margin sampled across its travel, and lines whose gaps stay inside a river-free band are justified to the margin. The opening travels horizontally and vertically, pulses in size, and follows mouse movement across both axes. The margin is drawn as an engraved dial (ring lettering, tick ring, satellite), the page carries hairlines on the Pretext line bands, ink deepens toward the margin, the fullscreen layout uses uniform text sizing, and the letter writes itself in when the scene becomes active. Inactive scenes stop ticking; reduced motion renders a static layout. The complete original paragraph stays accessible, and Restart retains its existing journey and graph-state behavior. Farewell copy lives in `siteContent.goodbye`.

Narrow screens start with a two-column, three-row graph to keep node labels readable. This layout is chosen only when the store initializes; later resizing or scene transitions preserve edited node positions.

Edit `src/data/siteContent.ts` to add real profile text or destination URLs. Empty profile values render as an em dash. Empty destination URLs render disabled planets with NOT CONNECTED; no fake URLs or personal claims are supplied. Email can use a `mailto:` URL.

## Accessibility and fallback

- Reduced motion uses fades rather than giant spatial motion, ensemble movement, falling characters, scattering, or camera traversal.
- Restart transfers focus to the Welcome heading; repeated clicks are guarded.
- WebGL unavailable or lost: CSS stars remain visible. Restoring the context recreates the renderer.
- The renderer caps pixel ratio, pauses while hidden, and limits ambient animation to 30fps. Reduced motion skips unchanged frames. GSAP context cleanup restores scene transforms and text impulses.
- Desktop and mobile layouts preserve the seven-scene order and readable text.

## Verification

Type checking, 22 unit tests, and production build pass. In-app browser checks cover desktop 1280×800 and mobile 390×844: opening, character push, impact, portal entry, continuous space, disabled destinations, exit, restart, reverse navigation, graph connection/drag/state retention, and resize. Reduced-motion timelines are covered by unit tests; OS media preference and WebGL context loss have not been exercised in the browser.

Latest visual verification: the full-screen Pretext letter was checked in the in-app browser at desktop size and 390×844, with complete text and the Restart control visible. The revised Welcome and its scroll-triggered Composer handoff render successfully; the canvas reaches full opacity and input unlocks at the endpoint. No console warnings or errors were reported. Resizing the viewport can change the active scene because scene scroll distances are viewport-relative; animation quality under live resizing remains a review item. Touch hardware and OS reduced-motion settings were not exercised.

## Remaining review items

Final palette, typography, precise timing, portal/starfield art direction, and character asset delivery optimization remain design/performance review items. Original PNG poses are large. Vite also reports the existing main bundle size warning. Pretext is the sole dependency added for the user-requested outro; no backend, database, remote Git repository, deployment, push, or merge was introduced.
