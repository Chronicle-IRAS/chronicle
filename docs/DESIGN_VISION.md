# Design Vision

Product-level intent for CHRONICLE. This is design context for agents, not marketing copy.

Status tags used in this document and in `docs/SCENES.md`, `docs/TRANSITIONS.md`, `docs/CHARACTERS.md`, `docs/VISUAL_DIRECTION.md`:

- `LOCKED` — decided. Do not change unilaterally.
- `DIRECTION` — strong current intent, reviewable in a later design pass.
- `TBD` — not decided. Do not invent an answer; propose options and wait.

## Product Identity

- `LOCKED` CHRONICLE is a scroll-driven interactive narrative about one person's work, tools, and interests.
- `LOCKED` It is composed of 7 scenes joined by 6 scene boundaries plus a restart loop.
- `LOCKED` It is not a conventional portfolio. There is no Hero / Projects / Skills / About / Contact stack.
- `DIRECTION` It reads closer to an interactive web experience / digital narrative than to a resume website.
- `DIRECTION` Character: technical, playful, experimental, cinematic.

## Experience Goals

- `LOCKED` The visitor's primary input is scroll.
- `LOCKED` Scrolling down advances the narrative. Scrolling up should restore the previous state naturally.
- `LOCKED` A scene is the content unit. The transition itself is part of the experience, not a page swap.
- `LOCKED` The arc closes into a loop: Welcome → … → Goodbye → Restart → Welcome.
- `LOCKED` High-complexity motion is driven by scroll progress (scrubbed), not by manually accumulated wheel deltas.
- `DIRECTION` Keywords: immersive, scroll-driven, reversible, scene-based, transition-heavy, interactive, cinematic, playful, technical, experimental.

## Interaction Philosophy

- `LOCKED` Scroll is the spine. Other interactions are punctuation: React Flow drag/connect (Scene 02), hover, destination interaction (Scene 06), Restart (Scene 07).
- `LOCKED` Transitions are narrative language, not decoration. The intended narrative beats are:
  - the CHRONICLE title scales beyond the viewport and becomes the primary push-through transition into the Stack Composer, while the persistent grid maintains spatial continuity between the two scenes,
  - a character ensemble pushes the composer page away,
  - DeepSeek falls and scatters the text,
  - a hole opens in the page and leads into space,
  - the camera pulls back out of that hole,
  - Goodbye closes the loop.
- `LOCKED` Reversibility: every scroll-driven transition must also play backwards without visual breakage.
- `LOCKED` Interactive state must survive navigation: Scene 02's React Flow graph remains intact after being pushed away and returned to.
- `DIRECTION` Motion stays progress-driven and readable in both directions.

## Narrative Structure

| Scene | Theme | Function |
| --- | --- | --- |
| 01 | Welcome | Quiet entry; grid foreshadows Scene 02 |
| 02 | Stack Composer | Main interactive scene; where project information is expressed |
| 03 | Currently | Deliberate deceleration; text-led |
| 04 | Profile | Deeper personal context; a hole/portal appears |
| 05 | Space / What's Next | First 3D space; future directions |
| 06 | Destinations | Same continuous space; external destinations |
| 07 | Goodbye | Back to 2D; outro and Restart |

- `LOCKED` Seven scenes in this order. Scene numbers 01–07 are stable identifiers.
- `DIRECTION` Scene 03 + 04 share one visual chapter. Scene 05 + 06 share one continuous space.
- `LOCKED` Project information is concentrated in Scene 02 rather than spread across scenes.

## What This Site Is Not

- `LOCKED` Not a resume or portfolio wall: no card grid of projects, no timeline, no repeated portfolio sections.
- `LOCKED` Not a marketing landing page and not a SaaS template.
- `LOCKED` Scene 06 is not a plain contact page — the portal traversal must carry narrative meaning.
- `DIRECTION` Avoid bento dashboards, uniform section layouts, heavy rounded-card styling, and an obvious "AI template" feel.
- `DIRECTION` Avoid defaulting to neon-everywhere, excessive glow, cyberpunk HUD, scanlines, glitch, or meaningless glass cards. These are not confirmed design directions.

## Locked Decisions

- `LOCKED` Seven scenes, six boundaries, one restart loop.
- `LOCKED` Scroll-driven, reversible, scrubbed transitions.
- `LOCKED` Scene 02 semantics: connecting technologies means composition (unordered set), and results are either real projects or experimental concepts.
- `LOCKED` Character art is production art: art defines pose and appearance, code defines motion.
- `LOCKED` Unresolved design is never an implementation requirement (see `AGENTS.md`, `docs/OMP_RULES.md`).

## Still Open

- `TBD` Final visual language: palette, typography, fonts, gradients, glow budget, spacing scale.
- `TBD` Final copy for Scenes 01, 03, 04, 05, 06, 07 — the Skeleton text is placeholder.
- `TBD` Final composition recipe list beyond the two known examples.
- `TBD` Portal appearance, starfield art direction, and the text-physics approach.
- `TBD` Restart closing animation.
- `TBD` Responsive / mobile adaptation strategy.
- `TBD` Which GPT pose variant is used for which beat.

While a decision is `DIRECTION` or `TBD`, implement only what the current task explicitly asks for.
