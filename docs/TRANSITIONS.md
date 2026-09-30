# Transitions

The six scene boundaries of CHRONICLE plus the restart loop, described as intent.

This file says **what should happen**, not how it is currently implemented. Do not bind these descriptions to function names or module internals; the implementation lives in `src/transitions/` and may be replaced module by module.

Status tags: `LOCKED` (decided, do not change unilaterally) · `DIRECTION` (strong intent, reviewable) · `TBD` (not decided — propose, do not invent).

Cross-cutting requirements:

- `LOCKED` By the latest user request, every boundary triggers on scrolling, then plays its complete animation automatically with input temporarily locked. Reverse crossings also play fully to completion. Stopping or reversing wheel/touch/key input must not stop an animation halfway.
- `LOCKED` 07 → 01 is an explicit Restart action rather than a scroll-driven boundary. It follows its own closing-animation contract.
- `LOCKED` A boundary must not destroy scene state — in particular the Scene 02 graph must survive a push-out and a return.
- `LOCKED` Reduced-motion preferences must be respected by every boundary.

## Current implementation — Full Journey V1

All six boundaries run on a fixed viewport stage. The transition factory contract is preserved; the registry can provide a separate return factory for a boundary. Scroll thresholds are now 18svh for Welcome, 50svh for Composer, and 30svh for scenes 03–06, independently of animation duration.

- Ensemble and impact poses use the existing production PNGs through the character registry. Push holds for a friction beat; roles have separate motion tracks.
- Impact text uses a separate deterministic ballistic sampler, responding at the impact point. No physics or text-layout dependency has been added; the same progress restores all pieces on reverse.
- Portal entry uses a page mask and nested depth rings to expose the shared star world. Native WebGL point projection supplies 3D camera travel; exit shrinks the same world back into a hole.
- Space continuation retains one seeded point cloud, canvas, and camera ref across both space scenes. It does not create a new renderer at scene boundaries.
- Restart gathers the outro beneath a closing veil, returns to Welcome, and restores keyboard focus without clearing graph state.
- Reduced motion bypasses spatial travel, character action, and scattering in favor of fades. Personal information and destination URLs remain empty by user request.

---

## 01 → 02 — THROUGH THE ECLIPSE (Welcome → Stack Composer)

- Latest user direction replaces the former typography zoom with a sphere-led traversal.
- Welcome typography keeps its original scale and fades early alongside the scroll cue.
- The eclipse grows toward the viewer; an expanding circular iris reveals the fixed Composer canvas behind it.
- The background and incoming canvas overlap, then the Composer heading settles in. Duration: 3.1 seconds.
- Return reverses the iris and restores the sphere and original typography; input stays locked until completion.
- Reduced motion uses a fully open iris, a stationary sphere, and short fades.

## 02 → 03 — AI ENSEMBLE PUSH (Stack Composer → Currently)

- Concept: `LOCKED` the main comedic beat. Five characters push the Scene 02 page away.
- Casting: `LOCKED`
  - DeepSeek — primary laborer. Most effort; carries the bulk of the visual push.
  - Grok — second laborer. Genuinely pushing, less exaggerated than DeepSeek.
  - Gemini — active support / atmosphere. Hopping, bouncing, trailing, energizing the group; not a primary pusher.
  - Claude — casual participant. Holds a book, reads, walks slowly, trails the group. Present without really putting in work.
  - GPT — light support. Calm, stable, quiet, reliable, companion-like; supports, follows, observes. Never straining like DeepSeek or Grok.
- Ensemble rule: `LOCKED` this must read as group comedy, not five identical sprites performing the same motion.
- Timing and contact: `LOCKED` by user request, Composer has an extended editing interval with the ensemble fully hidden. The push begins at the left edge of the full-screen board; characters follow that edge instead of standing inside the canvas.
- Return: `LOCKED` Scene 03 → Scene 02 uses a separately choreographed pull with DS_PULL and GROK_PULL assets, facing the returning board, repeated exertion and distinct support motions. Composer is editable only after the pull finishes.
- Physics feel: `DIRECTION` when scrolling starts, the characters visibly exert force first and Scene 02 does not move immediately — a beat of static friction / inertia — then the page is pushed away.
- Reversal: `LOCKED` scrolling up restores the previous state as naturally as possible, and the Scene 02 React Flow state is still present on return.
- Character detail: see `docs/CHARACTERS.md`.

## 03 → 04 — DEEPSEEK IMPACT (Currently → Profile)

- Return: `LOCKED` Scene 04 → Scene 03 does not reverse the fall or impact. Profile copy gently fades upward while the settled Currently copy floats into view against the continuous background. The impact actor stays hidden; the director restores the forward timeline's starting state after arrival.

- Reveal: `LOCKED` by the latest user request, the chapter background remains continuous after the impact. Profile's label, heading, and rows float slowly upward in sequence; the page itself stays fixed.

- Casting: `LOCKED` DeepSeek is the sole lead again.
- Pacing: `LOCKED` by user request, the falling approach and descent have an extended scroll interval. Pre-impact, impact, recovery, and run-off stay synchronized with text impulses after the longer descent.
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

- Playback: `LOCKED` by user request, crossing the scroll threshold launches a short, automatic traversal. Scrolling, touch scrolling, and scroll keys cannot pause or reverse it halfway. Completion advances to Scene 05; returning plays the full reverse traversal.

- Concept: `LOCKED` the 2D world → 3D world transition; the key portal crossing.
- Beats: `DIRECTION`
  - a depression / hole / portal appears in the Scene 04 page,
  - it must not read as a black circle simply scaling up — the page itself should read as punctured,
  - the page deforms near the hole, text may be pulled toward the center, and depth is visible,
  - starfield / particles begin to appear inside,
  - once triggered, the hole expands and the viewpoint enters automatically,
  - a tunnel / depth traversal,
  - Scene 05 is fully reached.
- Open: `TBD` exact portal appearance (see `docs/VISUAL_DIRECTION.md`).

## 05 → 06 — SPACE CONTINUATION (Space → Destinations)

- Camera: `LOCKED` by the latest user request, travel forward through the shared starfield. Future copy grows past the camera; stars stretch into radial trails while accelerating; planets approach from depth as the camera slows. The same star world remains visible throughout.

- Concept: `LOCKED` Scene 05 and Scene 06 belong to one space world, so no strong transition is wanted here.
- Beats: `DIRECTION`
  - the star layout gradually changes,
  - destinations in space become clearer,
  - "future concepts" gradually become "external destinations",
  - spatial continuity is preserved throughout.

## 06 → 07 — PORTAL EXIT (Destinations → Goodbye)

- Playback: `LOCKED` by user request, the exit automatically completes after its scroll threshold. Input unlocks on arrival at Goodbye. Returning completes the reverse crossing before releasing control.

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

## Character choreography revision

The user authorized freely redesigning both AI sequences. Composer now makes a first short movement, settles back slightly, then accelerates away with the cast attached to its edge. DeepSeek and Grok compress and lean into the push; Gemini uses two distinct hops; Claude and GPT have quieter, offset secondary motion. Returning retains actual pulling poses, backward effort and a longer deceleration. The ensemble crossing takes 3.6 seconds.

DeepSeek's 5.6-second scene combines an airborne sway, accelerating descent, contact squash, a small rebound, recovery, a backward wind-up and a running exit. A growing contact shadow, short falling trails and radial dust connect the sprite to the scene. Reduced motion uses the existing fade alternative. Graph state and automatic input locking remain in the director.
