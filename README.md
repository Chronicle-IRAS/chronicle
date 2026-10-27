# CHRONICLE — One Page

A red-and-black personal website rebuilt as a naturally scrolling page. The current entry is `src/app/OnePage.tsx`; the old eight-scene journey is retained as inactive source, not mounted or imported by the application entry.

## Run and verify

- `npm install`
- `npm run dev`
- `npm run typecheck`
- `npm test`
- `npm run build`

## Current experience

- Optical-chamber hero: oversized editorial typography beside an orbital red/black portrait. The original generated artwork becomes a circularly masked WebGL triangle field with three switchable shader passes (`棱镜折光`, `晶格切面`, `星璇引力`). Pointer motion leaves refraction trails; hold/release or use the button to scatter/reassemble the figure. Native scrolling deconstructs the portrait and introduces the next chapter.
- Selected open-source projects with category filters, real repository links, and interactive concept studies: switch three blueprint routing topologies, adjust a simulated device signal, and send an idea through a local edge-relay demonstration. These are not live hardware or AI integrations.
- A visible, lazy-loaded hydro-magnetic liquid droplet laboratory. Spheres naturally emerge with concentric water ripples when scrolled into view, deform along drag velocity, and form a viscous metaball capillary bridge when approaching another sphere. Fusion occurs in-place at the collision site rather than a fixed center; fused composite spheres remain draggable to combine with additional spheres. Left-clicking a fused sphere that resolves to a verified project opens its repository; right-clicking any composite sphere randomly ejects one constituent technology sphere back into the field.
- An interactive poker-fan blueprint deck and rotating interest selector synchronized with expandable descriptions, a pointer-responsive elastic connection thread, a right-side chapter telemetry rail, GitHub links and native anchor navigation.
- Responsive desktop/mobile layouts, visible keyboard focus, a skip link, and reduced-motion support. No scroll locks or scene-boundary playback.

UI interactions use short CSS transitions. GSAP handles section reveals, scroll-linked portrait choreography, the dual-track typography strip, magnetic buttons and perspective project-cover feedback; per-frame values remain outside React and Zustand. Fusion pointer positions, ripple pools and animation timelines live in refs, with React updates only for discrete selection, fusion, ejection and discovery events.

## Ownership

| Path | Responsibility |
| --- | --- |
| `src/app/OnePage.tsx` | Current page composition, project presentation, navigation and local interaction state |
| `src/features/hero-portrait/` | Single active WebGL renderer, optical aperture and fragment shaders, scoped cover styling, pointer/scroll lifecycle and static-image fallback |
| `src/styles/one-page.css` | Red/black architectural visual system and responsive page layouts |
| `src/features/stack-composer/components/FusionLab.tsx` | Hydro-magnetic droplet fusion interaction, in-place merging, right-click tech ejection and discovery UI |
| `src/styles/fusion-lab.css` | Dark crimson/obsidian liquid sphere field, metaball bridge, ripples and experiment panel |
| `src/features/stack-composer/engine/` | Pure unordered recipe resolution, in-place fusion coordinates and random tech ejection |
| `src/features/stack-composer/store/` | Inactive legacy graph data compatibility; local types, no graph-renderer dependency |
| `src/app/SceneDirector.tsx`, `src/scenes/`, `src/transitions/` | Inactive previous journey implementation |
