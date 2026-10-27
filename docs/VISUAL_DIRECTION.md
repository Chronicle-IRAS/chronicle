# Visual Direction — One Page

Current user-approved scope: a complete redesign; old scene layouts and cinematic boundaries are no longer constraints. Red/black theme, no terminal aesthetic, more intentional design and useful interactive content.

## Visual system

- Charcoal `#101010`, warm white `#eeeae5`, red `#f04437`, muted warm-gray text, thin low-contrast separators.
- Syne for English display type, Instrument Serif for expressive accents, Noto Sans SC for Chinese reading text; system fallbacks are required.
- Full-height dark portrait cover, left-aligned serif title, red/black low-poly human silhouette with star rings, asymmetric conceptual project covers, light playground section and solid-red closing section.
- Natural document flow, sticky compact navigation and responsive layouts. The mobile version stacks content without removing the interactions.

## Motion

Apply Emil Kowalski's design-engineering principles: short, interruptible control feedback; 160–220ms UI transitions; restrained GSAP section reveals; transform/opacity animation; no per-frame React state. Portrait hover uses a bounded local radius and settles when the pointer leaves. Reduced motion disables fragment movement. A pressed-state button provides illumination feedback for touch and keyboard users. The original static artwork remains visible without a GPU context. Hover transformations only apply to fine pointers.

## Content and accessibility

Use real project URLs and explicitly identify unknown technology pairings as concepts. Controls expose selected/expanded states, offer keyboard focus indicators, and remain usable on touch screens. The fusion lab is lazy loaded and visible in the page. Its result panel is separate from the ball field. Selecting two balls and pressing the fusion button is the keyboard/touch alternative to dragging.

## Cinematic interaction pass — October 27

The user requested substantially stronger interactions, referencing [Shader](https://www.shader.se/), [Son Daven](https://sondaven.com/en), [Units](https://units.gr/en/homepage/) and [Shelby](https://shelby.ashfall.studio/). Shader and Shelby were inspected visually, Son Daven loaded but its screenshot capture was inconsistent; Units remained behind site verification. These are interaction references, not sources of copied code or assets.

The active hero now uses original generated artwork plus a single WebGL fragment field, superseding the earlier coarse SVG portrait. It features pointer refraction trails, hold-to-scatter/release-to-reassemble, button alternatives, and a native-scroll deconstruction sequence. Project artworks respond with restrained perspective tilt. Original concept artwork remains unchanged. Reduced motion uses a short, static composition with illumination controls, and WebGL failure falls back to the same artwork.

## Tactile content pass

Dark orbital experiment field inside the warm playground section; red polished spheres, magnetic proximity bridge, converging fusion and a central result sphere. Desktop uses an ellipse and mobile a spacious two-column field. Motion runs only during interaction. Project covers now have usable controls and clearly disclose simulation. The closing SVG line elastically follows the pointer without interfering with native scrolling. Reduced motion removes spring and travel effects.

## Hero optical chamber — current cover

The user authorized a substantial redesign of the homepage only. The new cover pairs oversized staggered “Ideas / take / shape.” typography and Chinese introductory copy with the original portrait inside a glowing circular optical chamber. An outlined orbital frame responds to shatter and illumination; the existing GPU mesh opens beyond its aperture when held or scrolled. Shader controls and direct work/lab links are visible. The mobile composition places the portrait above a two-line title, with compact navigation labels. The portrait scroll range begins at the actual top of its section, so the resting portrait stays assembled. Reduced motion and the clipped original-image fallback remain supported. Other chapters, the synthesis lab and companion dialogue behavior are unchanged by this cover pass.
