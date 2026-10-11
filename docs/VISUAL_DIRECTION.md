# Visual Direction

Visual intent for CHRONICLE, split into what is decided and what is still open.

Status tags: `LOCKED` (decided, do not change unilaterally) · `DIRECTION` (strong intent, reviewable) · `TBD` (not decided — propose, do not invent).

The current Skeleton styling is a placeholder. It is not the final visual language.

## Locked / Strong Direction

Avoid (`LOCKED` — not the intended look):

- generic SaaS layout,
- bento dashboard composition,
- a portfolio card wall,
- masses of rounded cards,
- the same section layout repeated scene after scene,
- an obvious AI-generated template feel.

Target (`DIRECTION`):

- a clear scene rhythm — each scene has a distinct register while the whole stays coherent,
- cinematic feeling,
- spatial layering and depth,
- transitions treated as the visual core,
- information hierarchy kept intact; never sacrifice readability for showmanship.

Per-scene register (`DIRECTION`):

- Scene 01 — quiet, restrained, negative space.
- Scene 02 — node-first and canvas-led. Visual hierarchy (`LOCKED`): (1) nodes / edges / compositions, (2) canvas / spatial structure / interaction feedback, (3) minimal supporting text / UI chrome.
  - Forbidden (`LOCKED`): a large centered Scene 02 hero title, a large subtitle, a paragraph-led introduction, text occupying the visual center, or a SaaS-like "hero + app preview" composition.
  - Allowed, but never the visual focus (`LOCKED`): a small "STACK COMPOSER" label, one short interaction hint, restrained peripheral UI. Exact position, font size, typography, and control layout remain `TBD`.
- Scene 03 / 04 — relatively quiet, text-led.
- Scene 05 / 06 — 3D, space, depth.
- Scene 07 — quiet ending.

Whole-site rhythm (`LOCKED` as the intended shape):

```text
quiet → interactive → quiet → impact → portal → expansive → return → quiet ending
```

## Open / Not Locked

The following must not be fixed by an agent. Each needs a later design review:

- `TBD` final color palette
- `TBD` final typography and fonts
- `TBD` exact gradients
- `TBD` exact glow intensity
- `TBD` exact layout spacing scale
- `TBD` final Scene 03 copy
- `TBD` final Scene 04 copy
- `TBD` final Scene 05 concepts
- `TBD` final Scene 06 links
- `TBD` final Goodbye copy
- `TBD` mobile / responsive adaptation
- `TBD` exact portal appearance
- `TBD` exact starfield art direction

## Implementation Principles

### Global expression refinement

The current user-authorized refinement keeps the existing scene layouts and their narrative roles. Loading, Prelude and Goodbye share fine paper texture and rust-colored interaction accents. Currently and Profile share a deep blue surface, muted contour ribbons, and grounded sculptural details. Composer remains node-led, with light travelling along real connections; Space/Destinations retain the single star world with route drawing and clearer planet selection. Utility buttons use small magnetic offsets and transient click echoes. Decorative layers pause off-scene, and reduced motion disables added spatial feedback. Personal content and unconfigured destinations remain as supplied.

- `LOCKED` Never break readability for the sake of a complex effect.
- `LOCKED` A "technological feel" does not default to neon everywhere, excessive glow, a cyberpunk HUD, heavy scanlines, heavy glitch, or meaningless glass cards. None of these are confirmed directions.
- `LOCKED` If an agent has no design basis for a visual decision, do not invent a visual language. Propose options and wait for user / design review.
- `LOCKED` Placeholder styling copied from the Skeleton must never be treated as the final design.
- `DIRECTION` Visual work should be replaceable module by module, so a scene's look can change without destabilizing the scene director, the transitions, or the composition rules.
