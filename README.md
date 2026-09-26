# CHRONICLE — Skeleton MVP + Enter the Grid V1

This project has a working seven-scene Skeleton MVP and the V1 production pass of **Enter the Grid** (Welcome → Stack Composer). The other scene boundaries remain placeholders. The final visual direction, character animation, 3D portal, and real destination URLs are future work.

## Run

```bash
npm install
npm run dev
```

Check the project with `npm run typecheck`, `npm test`, and `npm run build`.

## Structure and ownership

| Path | Responsibility |
| --- | --- |
| `src/app/` | Scene order, DOM ownership, ScrollTrigger registration, active scene and progress, transition wiring. `App.tsx` only composes the director. |
| `src/scenes/` | Content for each of the seven scenes. Scenes do not listen to scrolling. |
| `src/transitions/` | One replaceable, scroll-scrubbed animation per scene boundary, plus restart navigation. |
| `src/features/stack-composer/engine/` | Pure, direction-independent composition rules and result derivation. |
| `src/features/stack-composer/store/` | Zustand state for node positions, edges, and result positions. |
| `src/features/stack-composer/components/` | React Flow canvas and three node types. |
| `src/stores/` | Low-frequency current-scene and reduced-motion state. |
| `src/hooks/` | `prefers-reduced-motion` subscription. |
| `src/assets/characters/` | Character asset registry and future asset slots. |
| `src/styles/` | Global styling and placeholder scene treatments. |

The seven scene components stay mounted during navigation. Composer nodes and edges are also held in Zustand, so returning to Scene 02 retains the graph. Result nodes are derived from current edges; deleting an edge removes its result. Result nodes are draggable and have no connection handles.

## Current behavior

- Native scrolling moves forward and backward through Welcome, Stack Composer, Currently, Profile, Space, Destinations, and Goodbye.
- The Scene Director registers one ScrollTrigger per scene and a separate scrubbed transition per boundary. Animation progress stays in GSAP and a DOM progress property; only low-frequency active-scene and interaction-readiness changes are written to Zustand.
- Composer interaction stays locked until the Welcome transition reaches its end. The director updates the low-frequency `sceneStore.composerReady` flag only when crossing that boundary. The canvas also requires Scene 02 to be active; inert content and React Flow interaction options block pointer, zoom, keyboard, selection, and graph edits while locked. Reverse navigation locks it again without clearing graph state.
- Welcome has a faint breathing light wash and three pulsing grid points. These decorative layers fade with its background and stay still under reduced-motion preferences.
- Enter the Grid gives Welcome 150svh of scroll distance. Only SCROLL TO ENTER fades early; CHRONICLE and its subtitle scale together beyond the viewport. The Welcome background stays fixed and fades during the handoff. The Composer workspace reaches the viewport before its late reveal, so it appears in place as the typography recedes, with a slight focus and scale effect. It releases into normal scrolling at Scene 02's own boundary. The grid changes only slightly to connect the two scenes visually. Scene 02 uses a small peripheral label and hint with a nearly full-viewport React Flow canvas. ScrollTrigger scrubs one timeline in both directions, with a fade-based reduced-motion path. The `data-enter-grid-*` attributes are local animation hooks; the director and `TransitionFactory` contract are unchanged.
- Connect technology nodes in the composer. Vue + ESP32 makes **ESP32 Monitor**; React + TypeScript makes **Blueprint Editor**; other pairs make **Experimental Concept**. Direction does not affect the composition key.
- Select an edge and press Delete or Backspace to remove it and its result. Dragging nodes and results changes their positions.
- Restart scrolls back to Scene 01. Reduced-motion preference simplifies transition movement and disables smooth restart.

## Deferred

Character art and the five-character push, physics text, 3D/shader portals, final starfield/planet UI, real profile content, destination URLs, and final responsive art direction remain outside this Skeleton MVP. No backend, database, Three.js, R3F, Matter.js, Pretext, Lenis, or Framer Motion is included.

## Suggested next development order

1. Define final content and visual system for each scene, including real destination URLs.
2. Review Enter the Grid V1 in context, then tune timing, scale, text placement, grid subtlety, and node spacing in a separate V2 pass.
3. Replace the remaining transition placeholders one module at a time, starting with AI Push.
4. Add character assets and final Currently/Profile content.
5. Implement the portal and space visuals in their isolated modules, then complete accessibility and device testing.
