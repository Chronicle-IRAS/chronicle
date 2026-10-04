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
| 01 Welcome → 02 Composer | Welcome text fades without scaling; the eclipse grows into an expanding iris that reveals the fixed Composer canvas. Welcome now has a large sculptural eclipse and luminous mint orbits, a drifting light field, pointer parallax and staggered letter entrances. |
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

Scenes 03 and 04 use a shared ChapterExplorer: select a topic to update its description and indexed orbital sculpture, and rotate the sculpture with a keyboard-accessible range input. Unwritten personal fields remain marked as such. Scene 05 lets visitors connect future-topic stars in their chosen order and clear the route. Scene 06 lets visitors select planets, inspect descriptions, and pause their ambient orbit motion; external links appear only when configured.

Scene 07 is a paper-airplane ending. Visitors can launch the plane on a returning flight, open the full farewell letter, or fold the open letter before flying. The reading surface retains the user-requested @chenglou/pretext layout around a moving circular opening. Flight timelines stop when the scene becomes inactive; reduced motion keeps a brief opacity response. The existing Restart loop remains available. Modules live in `src/features/chapter-explorer/` and `src/features/paper-flight/`; interaction styles live in `src/styles/interactions.css`.

Narrow screens start with a two-column, three-row graph to keep node labels readable. This layout is chosen only when the store initializes; later resizing or scene transitions preserve edited node positions.

Edit `src/data/siteContent.ts` to add real profile text or destination URLs. Empty profile values render as an em dash. All planets can be selected to inspect their purpose. Empty destination URLs show an honest unconfigured-address state, with no outbound link; no fake URLs or personal claims are supplied. Email can use a `mailto:` URL.

## Accessibility and fallback

- Reduced motion uses fades rather than giant spatial motion, ensemble movement, falling characters, scattering, or camera traversal.
- Restart transfers focus to the Welcome heading; repeated clicks are guarded.
- WebGL unavailable or lost: CSS stars remain visible. Restoring the context recreates the renderer.
- The renderer caps pixel ratio, pauses while hidden, and limits ambient animation to 30fps. Reduced motion skips unchanged frames. GSAP context cleanup restores scene transforms and text impulses.
- Desktop and mobile layouts preserve the seven-scene order and readable text.

## Verification

Type checking, 22 unit tests, and production build pass. In-app browser checks cover desktop 1280×800 and mobile 390×844: opening, character push, impact, portal entry, continuous space, disabled destinations, exit, restart, reverse navigation, graph connection/drag/state retention, and resize. Reduced-motion timelines are covered by unit tests; OS media preference and WebGL context loss have not been exercised in the browser.

Latest visual verification: desktop 1440×900 and mobile 390×844 checks cover chapter selection and orbital controls, ordered star connections and reset, planet details and orbit pause, and the paper ending. Opening the full Pretext letter, folding it, completing a flight, and returning to the repeat-flight state were verified. The eclipse entrance and reverse are also covered by transition unit tests. Touch hardware and OS reduced-motion settings were not exercised.

## Remaining review items

Final palette, typography, precise timing, portal/starfield art direction, and character asset delivery optimization remain design/performance review items. Original PNG poses are large. Vite also reports the existing main bundle size warning. Pretext is the sole dependency added for the user-requested outro; no backend, database, remote Git repository, deployment, push, or merge was introduced.

### Black-hole entrance and composition workbench
Welcome uses a ray-marched 3D accretion disk with horizon occlusion and curved rays. The existing SpaceWorld WebGL context renders both the black hole and later starfield; its canvas moves between the Welcome host and space layer. CSS remains the fallback. The 4.8-second entrance reveals orbiting LOADING typography while the hole rotates and expands. The composition workbench supports selecting two technologies, connecting them through the existing engine, and removing individual connections. It follows the same interaction gate as the fixed graph.

### Editorial design pass
Shared typography and interactive feedback live in `src/styles/editorial.css`. Scenes 03/04 use kinetic CSS wire sculptures with selectable forms, a rotation control and freeze/resume. Their headings are now In Motion and Behind the Build, while scene IDs and transition contracts remain unchanged. `JourneySignature` reads the active scene to show a non-interactive seven-part position marker. Composer results reveal as they are generated; star targets, destination labels and the paper ending have consistent hover responses. No personal content was invented. Desktop and 390×844 checks verified chapter selection, freeze state, slider input and legible layout; the reference sites' animated behavior could not be inspected because browser loading timed out.

### Typographic playground ending

Scene 07 replaces the paper airplane with an interactive Canvas2D glyph field inspired by the Pretext Playground interaction direction. Pretext `prepareWithSegments` and `layoutWithLines` determine the real letter layout; spring dynamics animate the same glyphs between a living bloom, readable letter physics, and a perspective tunnel. Pointer movement repels letters, holding attracts them, and RELEASE LETTERS emits a radial impulse. Mode changes retain particle positions; PAUSE freezes the current frame. Full letter reading and RESTART remain available. The field stops when Scene 07 is inactive and provides still compositions for reduced motion. No additional WebGL renderer or dependency is introduced.

### Prelude / ink revision

The journey now opens with loading → Scene 0.5 (`prelude`) → Scene 01. The original seven chapter numbers stay unchanged. Loading, prelude and goodbye share paper, forest ink and rust typography. `InkRibbons` uses cached Pretext layout with Canvas2D motion; no extra WebGL context is created. The prelude entry spirals its ink inward and opens a paper mask onto the existing welcome black hole. The independently choreographed return closes that opening, releases the ink and settles the copy. Both routes use the director's input lock. Restart now returns to the prelude. Composer readiness is located by scene ID rather than a numeric index.

The goodbye letter uses an editorial, three-paragraph reading layout with Pretext line wrapping, a scrollable reading column and subtle ink hover. The interactive LIVING LETTER mode uses the original letter once rather than repeating paragraphs. Personal information remains unchanged.
