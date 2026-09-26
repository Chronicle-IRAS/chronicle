# Transitions

The six scene boundaries of CHRONICLE plus the restart loop, described as intent.

This file says **what should happen**, not how it is currently implemented. Do not bind these descriptions to function names or module internals; the implementation lives in `src/transitions/` and may be replaced module by module.

Status tags: `LOCKED` (decided, do not change unilaterally) · `DIRECTION` (strong intent, reviewable) · `TBD` (not decided — propose, do not invent).

Cross-cutting requirements:

- `LOCKED` All scene-to-scene boundaries from 01 → 02 through 06 → 07 are scroll-driven, scrubbed, and reversible.
- `LOCKED` 07 → 01 is an explicit Restart action rather than a scroll-driven boundary. It follows its own closing-animation contract.
- `LOCKED` A boundary must not destroy scene state — in particular the Scene 02 graph must survive a push-out and a return.
- `LOCKED` Reduced-motion preferences must be respected by every boundary.

## Current implementation — Full Journey V1

All six boundaries now run on a fixed viewport stage. The original transition factory contract is preserved. This is a reviewable implementation of the direction below, not a decision that locks remaining TBD visuals.

- Ensemble and impact poses use the existing production PNGs through the character registry. Push holds for a friction beat; roles have separate motion tracks.
- Impact text uses a separate deterministic ballistic sampler, responding at the impact point. No physics or text-layout dependency has been added; the same progress restores all pieces on reverse.
- Portal entry uses a page mask and nested depth rings to expose the shared star world. Native WebGL point projection supplies 3D camera travel; exit shrinks the same world back into a hole.
- Space continuation retains one seeded point cloud, canvas, and camera ref across both space scenes. It does not create a new renderer at scene boundaries.
- Restart gathers the outro beneath a closing veil, returns to Welcome, and restores keyboard focus without clearing graph state.
- Reduced motion bypasses spatial travel, character action, and scattering in favor of fades. Personal information and destination URLs remain empty by user request.

---

## 01 → 02 — ENTER THE GRID (Welcome → Stack Composer)

- Concept: `LOCKED` "enter the grid".
- Primary transition object: `LOCKED` the CHRONICLE title, not the grid. The move is a typography push-through: the title itself carries the visitor into the next space. The grid maintains spatial continuity between the two scenes.
- Choreography: `LOCKED` (exact easing, scale amount, timing, font, and positioning remain `TBD`)
  - the scene begins as the complete Welcome state,
  - only `SCROLL TO ENTER` fades early,
  - CHRONICLE and `Developer · Builder · Explorer` remain together as one typography group,
  - as scroll progresses, the entire typography group scales continuously toward the viewer; this is not a subtle scale but a large push-through,
  - the Welcome background stays fixed in the viewport and blends away during the handoff; it must not slide with the document,
  - the title grows until it exceeds the viewport, its letterforms are cropped by the frame edges, and the visitor finally sees a huge letterform fragment instead of the whole word,
  - the Stack Composer canvas is already aligned with the viewport when it becomes visible behind the receding oversized title; it reveals in place rather than sliding upward into the frame,
  - the title passes beyond the frame and Stack Composer fully owns the screen.
- No blank frame: `LOCKED` the title must not disappear into an empty frame followed by a cut to Scene 02. The intended overlap is an oversized CHRONICLE in the foreground while Scene 02 becomes visible behind it.
- Grid role: `LOCKED` the faint blueprint / node grid from Scene 01 persists as a **spatial continuity** device, never as the transition actor. During the transition it may subtly scale, slightly change spacing, become a little clearer, and blend toward the Scene 02 canvas grid; in Scene 02 the React Flow canvas / grid becomes the real workspace. The visitor should feel that Welcome and Stack Composer belong to one grid world, while the visual advance comes from the CHRONICLE typography scaling.
- Rhythm (design intent, no fixed percentages): early — the scroll cue fades; middle — CHRONICLE and its subtitle enlarge together and the grid continuity strengthens; late — the typography exceeds the viewport, Scene 02 becomes visible behind it, oversized letterforms move beyond the frame, Stack Composer takes over.
- Reverse: `LOCKED` scrolling up plays the same process backwards — Stack Composer → the huge letterforms return into the viewport → CHRONICLE and its subtitle scale back down → the scroll cue returns → the complete Welcome state.
- Requirements: `LOCKED` scroll-driven, scrubbed, reversible.
- Avoid: `LOCKED` the grid becoming an exaggerated main zoom effect; a simple Scene 01 fade-out / Scene 02 fade-in; hard cuts; a black frame in between; a flashy sci-fi tunnel; heavy motion blur; exaggerated glow; cyberpunk treatment. The transition stays quiet, restrained, cinematic, and spatial.

## 02 → 03 — AI ENSEMBLE PUSH (Stack Composer → Currently)

- Concept: `LOCKED` the main comedic beat. Five characters push the Scene 02 page away.
- Casting: `LOCKED`
  - DeepSeek — primary laborer. Most effort; carries the bulk of the visual push.
  - Grok — second laborer. Genuinely pushing, less exaggerated than DeepSeek.
  - Gemini — active support / atmosphere. Hopping, bouncing, trailing, energizing the group; not a primary pusher.
  - Claude — casual participant. Holds a book, reads, walks slowly, trails the group. Present without really putting in work.
  - GPT — light support. Calm, stable, quiet, reliable, companion-like; supports, follows, observes. Never straining like DeepSeek or Grok.
- Ensemble rule: `LOCKED` this must read as group comedy, not five identical sprites performing the same motion.
- Physics feel: `DIRECTION` when scrolling starts, the characters visibly exert force first and Scene 02 does not move immediately — a beat of static friction / inertia — then the page is pushed away.
- Reversal: `LOCKED` scrolling up restores the previous state as naturally as possible, and the Scene 02 React Flow state is still present on return.
- Character detail: see `docs/CHARACTERS.md`.

## 03 → 04 — DEEPSEEK IMPACT (Currently → Profile)

- Casting: `LOCKED` DeepSeek is the sole lead again.
- Beats: `DIRECTION`
  1. a faint premonition,
  2. DeepSeek falls in from the top of the page, using fall / pre-impact poses,
  3. impact into the text region,
  4. the text receives the impact; the screen may shake slightly,
  5. the text scatters / falls,
  6. DeepSeek recovers,
  7. DeepSeek runs off to the right,
  8. Scene 04's text appears and reorganizes.
- Decoupling: `LOCKED` character animation and text physics must stay decoupled. The character's impact emits an impulse / event; the text physics system responds. The character system must never control individual glyphs.
- Text physics: `TBD` (candidate direction: a text-physics layer such as Pretext + Canvas 2D + custom physics). Any such system is a dependency decision — see `AGENTS.md` Technology Constraints.
- Character detail: see `docs/CHARACTERS.md`.

## 04 → 05 — PORTAL ENTER (Profile → Space)

- Concept: `LOCKED` the 2D world → 3D world transition; the key portal crossing.
- Beats: `DIRECTION`
  - a depression / hole / portal appears in the Scene 04 page,
  - it must not read as a black circle simply scaling up — the page itself should read as punctured,
  - the page deforms near the hole, text may be pulled toward the center, and depth is visible,
  - starfield / particles begin to appear inside,
  - continuing to scroll enlarges the hole and moves the viewpoint in,
  - a tunnel / depth traversal,
  - Scene 05 is fully reached.
- Open: `TBD` exact portal appearance (see `docs/VISUAL_DIRECTION.md`).

## 05 → 06 — SPACE CONTINUATION (Space → Destinations)

- Concept: `LOCKED` Scene 05 and Scene 06 belong to one space world, so no strong transition is wanted here.
- Beats: `DIRECTION`
  - the star layout gradually changes,
  - destinations in space become clearer,
  - "future concepts" gradually become "external destinations",
  - spatial continuity is preserved throughout.

## 06 → 07 — PORTAL EXIT (Destinations → Goodbye)

- Concept: `LOCKED` the visual mirror of 04 → 05, and the 3D world → 2D world transition.
- Beats: `DIRECTION`
  - instead of continuing forward, the camera pulls back,
  - the starfield recedes,
  - it becomes apparent that the whole 3D space was inside the portal / hole,
  - the portal shrinks,
  - the visitor is back in the 2D page world, in Scene 07.

## 07 → 01 — RESTART (Goodbye → Welcome)

- Trigger: `LOCKED` the RESTART action in Scene 07.
- Concept: `LOCKED` a closing animation completes the loop and returns to WELCOME. It must not be a hard instantaneous jump.
- Current state: `DIRECTION` the Skeleton implementation is a simple return to the top; the final closing animation is `TBD`.
