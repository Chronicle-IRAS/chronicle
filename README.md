# CHRONICLE — Full Journey V1

A working eight-scene interactive narrative, from Prelude (0.5) through Welcome, Composer, and Goodbye to Restart. All seven scroll boundaries and the Restart loop are implemented. Profile copy and the GitHub/Source destinations are configured; Blog, Resume, and Email intentionally remain unlinked. Visual decisions marked TBD in the design documents remain reviewable.

## Run

```bash
npm install
npm run dev
```

Verify with `npm run typecheck`, `npm test`, and `npm run build`.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` builds the site and publishes `dist/` with GitHub Actions. `vite.config.ts` sets `base: './'`, so the same build works at the domain root and under a project subpath; no repository name is hardcoded.

1. Push the repository to GitHub.
2. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push to `main`, or run **Deploy to GitHub Pages** manually (`workflow_dispatch`).

The site is served at `https://<owner>.github.io/<repository>/`; this repository deploys to **https://chronicle-iras.github.io/chronicle/**.

## Journey

| Scene / boundary | Implemented behavior |
| --- | --- |
| 0.5 Prelude → 01 Welcome | Pretext ink spirals inward along elliptical capture curves; the invitation converges and paper dissolves to reveal Welcome's complete WebGL accretion disk (scaling from 0.82 to 1). A dedicated 3.3s return timeline restores paper from the perimeter, releases background ribbons, and re-typesets the invitation heading. |
| 01 Welcome → 02 Composer | Welcome text fades without scaling; differential disk rotation accelerates before an expanding circular iris reveals the fixed Composer canvas. Welcome features a ray-marched 3D black hole, luminous mint orbits, drifting light field, pointer parallax, and staggered letter entrances (4.8s). |
| 02 Composer → 03 Currently | After an extended editing interval, DeepSeek and Grok push at the left edge of the full-screen board. Gemini hops, Claude strolls with a book, GPT observes. The ensemble follows the moving edge; graph state persists. |
| 03 Currently → 04 Profile | DeepSeek has an extended visible descent, followed by impact, recovery and a run-off. The background stays fixed while Profile copy slowly floats up in sequence. |
| 04 Profile → 05 Space | A scroll threshold launches a complete 1.25s portal traversal. Input is locked until the camera reaches Space, then the scroll position advances to Scene 05. |
| 05 Space → 06 Destinations | Forward space traversal: future copy passes the camera, stars stretch radially during acceleration, open space fills the frame, then planets approach from depth as the camera decelerates. |
| 06 Destinations → 07 Goodbye | An automatic 1.25s retreat closes the portal and lands at Goodbye. Both portal crossings also complete automatically when returning. |
| Restart | Goodbye converges beneath a short closing veil (~1.6s), resets scroll to Prelude (Scene 0.5) at the top, clears chapter hash, and restores keyboard focus. Graph state survives. |

Every boundary uses a native scroll threshold, GSAP ScrollTrigger, and a forward timeline plus an optional dedicated return timeline. Once triggered, playback runs to completion independently of scroll input. Durations live in `sceneRegistry.ts`: Prelude 5.2s (return 3.3s), Welcome 4.8s, ensemble push/pull 3.6s, DeepSeek impact and floating Profile 5.6s (return 1.8s), portal entry/exit 1.25s each, and space traversal 2.4s. Reduced motion uses 0.35s simplified boundaries. Main content is temporarily inert; wheel, touch scroll and scroll keys are blocked. On arrival the document moves to the destination's reading/editing interval and input returns. Return playback finishes fully too. Scene 03 to 02 uses DS_PULL / GROK_PULL artwork with repeated exertion and accompanying hops. Scene 04 to 03 uses a separate 1.8s text return: Profile fades while settled Currently copy floats into place, without replaying the impact. Restart uses the same input lock and a roughly 1.6s closing veil, returning to Prelude (Scene 0.5). Cleanup kills active playback and restores input and overflow. No wheel accumulation or per-frame React/Zustand state is used.

The first visit in each tab session opens with a skippable Loading sequence that warms fonts and the two primary character poses. It completes after resource readiness and a short minimum presentation, with a six-second timeout fallback. Journey input is locked while the overlay is visible. Reduced motion shortens the sequence. Welcome letters enter after the overlay closes; Restart retains its own existing transition.

On touch devices, `MobileJourneyNav` provides previous/next chapter controls through the same director-owned boundaries. The graph background accepts vertical swipes while nodes retain drag gestures; long chapter copy and the letter scroll independently. `src/styles/mobile.css` reserves safe-area space for navigation, the composer shelf, and short-screen controls. Toolbar-only height changes leave the chapter and its scroll position intact; rotation or actual section-size changes still refresh the layout. WebGL drawing-buffer sizes change only inside the next draw, with no intermediate window-sized clear, and the mobile eclipse zoom is capped at 3x to avoid oversized masked surfaces. Shader smoothstep edges use defined ascending bounds across GPU drivers.

## Ownership

| Path | Responsibility |
| --- | --- |
| `src/app/` | Fixed viewport stage, eight persistent scenes (0.5 Prelude + 01–07), scroll ranges, accessibility and interaction gates, transition lifecycle. |
| `src/scenes/` | Scene content and local animation hooks; no scroll listeners. |
| `src/transitions/` | Character, text, portal, content handoffs, and restart choreography. The existing TransitionFactory contract remains unchanged. |
| `src/features/stack-composer/` | Pure unordered composition engine, graph state, React Flow nodes and controls. |
| `src/features/text-impact/` | Progress-sampled ballistic text impulses, independent of character poses and reversible without numerical integration. |
| `src/features/space/` | One shared canvas/context for native stars, the ray-marched black hole, and the Three.js chapter/space stages. WebGL 2 is preferred; WebGL 1 retains native effects, and CSS art remains available without WebGL. |
| `src/components/CharacterCast.tsx` | Registry-driven ensemble and impact pose layers. |
| `src/assets/characters/registry.ts` | Production pose URLs resolved from existing `image/` source assets. |
| `src/data/siteContent.ts` | Currently/Profile content, future topics, destination URLs, and Goodbye labels. |
| `src/stores/` | Low-frequency active scene, reduced motion, and composer readiness. |

Scene timing lives in `src/app/sceneRegistry.ts`: Prelude, Welcome, and scenes 03–06 have 150svh, Composer 200svh, and Goodbye 100svh, totaling 12 viewport heights (1200svh). Prelude triggers after 22.5svh (15% holdFraction); Welcome triggers after 18svh (12%); Composer reserves 50svh (25%) for editing with the cast hidden; scenes 03–06 trigger after 30svh (20%). Scroll distance is independent of playback duration, so the shorter wheel journey preserves the longer animation pacing. Content remains fixed and scenes remain mounted. Non-active scenes are inert and hidden from assistive technology. Composer becomes editable after Welcome completes, and locks when its outgoing transition starts.

Composer recipes point to verified public repositories from **Chronicle-IRAS**: Vue + ESP32 → **ESP32 Monitor**, C++ + Qt → **Qt Blueprint Generator**, TypeScript + AI → **PaLM Netlify Proxy**. Each real result opens its repository in a new tab; unknown pairs remain **A new possibility**, without an invented project link. Recipes and URLs live in `src/features/stack-composer/engine/composition.ts`. Results are derived, draggable, and non-connectable; removing an edge removes its result. Soft gradient capsules, breathing halos, and curved connections style the board. A full-size project shortcut in the collapsed workbench keeps links accessible on small screens.

The blueprint fills the entire viewport and shares Welcome's background and grid. User wheel/pinch/double-click zoom, background panning, automatic drag panning, and viewport controls are disabled. Only nodes and edges are editable. Initial fitting and resizing adapt the layout to the display; adding a result does not refit or move the viewport. Wheel scrolling continues the journey. Node ornaments rotate, sweep, pulse, and charge independently of node geometry and connection handles.

Scenes 03 and 04 share the same deep blue background, mint accents, typography, and text-row treatment. Each scene has visible moving haze, orbital points, expanding waves, drifting particles, crossing light trails, and a pointer-responsive light field. Headings breathe with light; text rows have moving accents; composer nodes and edges pulse without moving the fixed viewport. Space continuously travels through the seeded starfield using shader time, even when scrolling stops, with independent twinkling, lateral drift, meteors, nebula motion, floating planets and moving rings. Inactive scene effects pause, and all added motion becomes static with reduced-motion preferences.

## Content configuration

Scenes 03 and 04 use a shared ChapterExplorer: select a topic to update its description and indexed orbital sculpture, and rotate the sculpture with a keyboard-accessible range input. Unwritten personal fields remain marked as such. Scene 05 lets visitors connect future-topic stars in their chosen order and clear the route. Scene 06 lets visitors select planets, inspect descriptions, and pause their ambient orbit motion; external links appear only when configured.

Scene 07 is an interactive typographic playground (WordBloom) using @chenglou/pretext. A Canvas2D glyph field animates letter particles between three modes: Word Bloom (orbital spherical bloom), Living Letter (spring dynamics on readable letter positions), and Infinity (perspective tunnel). Visitors can move to repel letters, hold to attract them, trigger radial impulses with RELEASE LETTERS, or pause the animation. Visitors can also open the full farewell letter in an overlay dialog (FlowLetter) with responsive Pretext line wrapping and toggleable margin contouring. The field pauses when Scene 07 is inactive and provides a still composition for reduced motion. Modules live in `src/features/word-bloom/` and `src/features/goodbye-letter/`; interaction styles live in `src/styles/interactions.css` and `src/styles/expression.css`.

Narrow screens start with a two-column, three-row graph to keep node labels readable. This layout is chosen only when the store initializes; later resizing or scene transitions preserve edited node positions.

Edit `src/data/siteContent.ts` to add real profile text or destination URLs. Empty profile values render as an em dash. All planets can be selected to inspect their purpose. Empty destination URLs show an honest unconfigured-address state, with no outbound link; no fake URLs or personal claims are supplied. Email can use a `mailto:` URL.

## Accessibility and fallback

- Reduced motion uses fades rather than giant spatial motion, ensemble movement, falling characters, scattering, or camera traversal.
- Restart transfers focus to the Prelude heading; repeated clicks are guarded.
- WebGL unavailable or lost: CSS stars remain visible. Restoring the context recreates the renderer.
- The renderer caps pixel ratio (max 1.75), pauses while hidden, and caps ambient animation to 60fps with cadence remainder preserved. A dynamic render budget automatically adjusts black-hole resolution (320px–640px) under sustained frame pressure. Reduced motion skips unchanged frames. GSAP context cleanup restores scene transforms and text impulses.
- Desktop and mobile layouts preserve the eight-scene narrative order and readable text.

## Verification

Verification scripts cover type checking, 61 unit tests, and the production build. Chrome mobile emulation at 320×568 and 390×844 covers the complete journey, reverse boundaries, graph composition/state retention, readable letter scrolling, and restart. Resize checks include portrait/landscape changes and toolbar-only height events; the latter no longer reset the black-hole buffer or scroll position. Emulated reduced motion covers all seven boundaries and restart. Physical Android/iOS hardware and WebGL context loss have not been exercised.

Entry now always begins at Prelude (Scene 0.5). The entry bootstrap disables automatic scroll restoration, clears any chapter fragment while retaining query parameters and history state, and resets scroll to the top. `mountJourneyAtEntry` mounts the app after load and two animation frames, resetting scroll once more after embedded-browser restoration has settled. This applies to first visits and reloads; the first-visit loader still runs once per tab session.

Latest visual verification: desktop 1440×900 and mobile 390×844 checks cover chapter selection and orbital controls, ordered star connections and reset, planet details and orbit pause, and the WordBloom typographic playground. Testing covered switching between Word Bloom, Living Letter, and Infinity modes, pointer attraction/repulsion, RELEASE LETTERS impulse bursts, opening the FlowLetter modal with Pretext line geometry and contour toggle, and the Restart loop returning to Prelude. The eclipse entrance, ink spirals, and reversible boundaries are also covered by unit tests. Touch hardware and OS reduced-motion settings were not exercised.

## Remaining review items

Final palette, typography, precise timing, portal/starfield art direction, and character asset delivery optimization remain design/performance review items. Original PNG poses are large (~31MB total in assets). Vite also reports the main bundle size warning (>500 kB). Pretext is the sole dependency added for the user-requested typographic outro; no backend, database, remote Git repository, push, or merge was introduced. GitHub Pages deployment is configured through `.github/workflows/deploy.yml` and the relative `base` in `vite.config.ts`.

## Feature architecture and implementation notes

### Prelude and ink handoff
The journey opens with loading → Scene 0.5 (`prelude`) → Scene 01. The original chapter numbering 01–07 is preserved. Loading, prelude and goodbye share paper texture, forest ink, and rust typography. `InkRibbons` uses cached Pretext layout with Canvas2D glyph motion; no extra WebGL context is created. The prelude entry spirals its ink inward and dissolves the paper plane onto Welcome's real WebGL black hole (scaling 0.82 to 1). The independently choreographed return restores that paper, releases the ink outward, and re-typesets the invitation heading. Both routes use the director's input lock. Restart returns to Prelude.

### Black-hole entrance and composition workbench
Welcome uses a ray-marched 3D accretion disk with horizon occlusion and curved rays. The existing SpaceWorld WebGL context renders both the black hole and later starfield; its canvas moves between the Welcome host and space layer, with CSS star fallback. The 4.8-second entrance accelerates disk-space spin before expanding into Composer, revealing orbiting LOADING typography sampled in disk-space. The composition workbench supports selecting technologies, connecting them through the pure engine, and removing individual connections. It follows the same interaction gate as the fixed graph.

### Editorial design pass

The global expression pass extends the existing scene designs through `src/styles/expression.css`: quieter atmosphere layers, shared flowing contour light for Currently/Profile, live signals on Composer edges, constellation route reveals, settled selected planets, and consistent printed paper texture for loading/Prelude/Goodbye. `InteractionFeedback` provides delegated magnetic button feedback and transient click rings. It uses event-driven GSAP tweens, caps rings at four, cleans up on scene changes, and disables spatial feedback for reduced motion. No animation state is written to React or Zustand per frame.
Shared typography and interactive feedback live in `src/styles/editorial.css`. Scenes 03/04 use kinetic CSS wire sculptures with selectable forms, a rotation control and freeze/resume. Their headings are now In Motion and Behind the Build, while scene IDs and transition contracts remain unchanged. `JourneySignature` reads the active scene to show a non-interactive seven-part position marker. Composer results reveal as they are generated; star targets, destination labels and Goodbye controls have consistent hover responses. No personal content was invented. Desktop and 390×844 checks verified chapter selection, freeze state, slider input and legible layout; the reference sites' animated behavior could not be inspected because browser loading timed out.

### Typographic playground ending

Scene 07 features an interactive Canvas2D glyph field (WordBloom) powered by Pretext layout. Pretext `prepareWithSegments` and `layoutWithLines` determine the real letter layout; spring dynamics animate glyphs between three modes: Word Bloom (orbital bloom), Living Letter (spring dynamics on readable text), and Infinity (perspective tunnel). Pointer movement repels letters, holding attracts them, and RELEASE LETTERS emits a radial impulse. Mode changes retain particle positions; PAUSE freezes the current frame. Full letter reading is available via an overlay modal (`FlowLetter`) using responsive line wrapping and toggleable margin contouring. The field stops when Scene 07 is inactive and provides still compositions for reduced motion. No additional WebGL renderer or dependency is introduced.






