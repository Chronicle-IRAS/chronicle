# Scenes

The seven scenes of CHRONICLE, in fixed order. This file records design intent, not implementation detail.

Status tags: `LOCKED` (decided, do not change unilaterally) · `DIRECTION` (strong intent, reviewable) · `TBD` (not decided — propose, do not invent).

Scene map (stable identifiers):

| # | Scene id | Theme |
| --- | --- | --- |
| 01 | `welcome` | Welcome |
| 02 | `composer` | Stack Composer |
| 03 | `currently` | Currently |
| 04 | `profile` | Profile / More about me |
| 05 | `space` | What's Next / Space |
| 06 | `destinations` | Destinations |
| 07 | `goodbye` | Goodbye |

---

## Scene 01 — WELCOME

- Purpose: `LOCKED` entry point of the site.
- Content: `DIRECTION` the name CHRONICLE, the line "Developer · Builder · Explorer", and a "SCROLL TO ENTER" cue. The current Skeleton wording is placeholder, not final copy.
- Character: `LOCKED` full-screen, quiet, restrained, heavy negative space; not a conventional navbar-led page.
- Background: `DIRECTION` a faint blueprint / node grid that also foreshadows Scene 02.
- Ambient motion allowed: `DIRECTION` very light pointer response, faint parallax, unobtrusive environment motion. Nothing competing with the entry text.
- Color: `TBD` — do not fix final colors from the current placeholder styling.
- Boundary to Scene 02: see `docs/TRANSITIONS.md` (01 → 02).

## Scene 02 — STACK COMPOSER

- Purpose: `LOCKED` a primary interactive scene; the place where project information is expressed.
- Core component: `LOCKED` a React Flow canvas.
- Visual hierarchy: `LOCKED` Scene 02 is **node-first**, not text-first. The graph itself is the visual center: technology nodes and their relationships must dominate the viewport. The scene should feel like entering a working interactive canvas, not landing on another content section.
- Text role: `LOCKED` text is allowed only as secondary UI / context — a small scene label, a concise instruction, lightweight status / control text — and must stay visually subordinate to the nodes. Large hero-style headings, explanatory copy, or centered textual introductions must not compete with the graph. Exact position, font size, typography, and control layout remain `TBD`.
- Technology nodes: `LOCKED` the vocabulary is React, Vue, TypeScript, Node.js, ESP32, AI. `DIRECTION` this set may grow.
- Interaction: `LOCKED` drag technology nodes; connect two technology nodes.
- Connection semantics: `LOCKED` a connection means composition, not direction — "Vue + ESP32", not "Vue → ESP32". The composition key must be order-independent, so `['vue','esp32']` and `['esp32','vue']` yield the same composition.
- Results: `LOCKED` a composition may produce a **Project** result (a real, existing project) or a **Concept** result (a what-if / experimental concept the user has not actually built). Real projects and concepts must remain clearly distinguishable.
- Result behavior: `LOCKED` result nodes are draggable, not connectable, and derived from the current composition. Result nodes never take part in a further composition.
- Removal: `LOCKED` if the composition is broken, the derived result disappears automatically.
- Known recipes: `DIRECTION`, extensible. `vue + esp32` → ESP32 Monitor; `react + typescript` → Blueprint Editor; any unknown combination → Experimental Concept.
- Implementation note: node types in the current implementation are `tech`, `project`, and `concept`; the design terms ProjectNode / ConceptNode refer to the two result kinds. Composition rules stay pure and direction-independent.
- Open: `TBD` the full recipe list, node styling, result presentation design.
- Boundary to Scene 03: see `docs/TRANSITIONS.md` (02 → 03).

## Scene 03 — CURRENTLY

- Purpose: `LOCKED` a deliberate deceleration after the high-interaction scene.
- Tone: `LOCKED` quiet, simple, text-led, giving the visitor a rhythm break.
- Content direction: `DIRECTION` who I am, what I'm building, what I'm exploring, what I'm learning.
- Content status: `TBD` the current Skeleton copy is placeholder.
- Visual chapter: `DIRECTION` Scene 03 and Scene 04 belong to the same visual chapter and should share a language.
- Boundary to Scene 04: see `docs/TRANSITIONS.md` (03 → 04).

## Scene 04 — PROFILE / MORE ABOUT ME

- Purpose: `LOCKED` add a deeper layer of personal information, continuing Scene 03's visual language.
- Content direction: `DIRECTION` open source, background, focus, role, tools, interests.
- Content status: `TBD` — specific content is not locked.
- Explicitly not: `LOCKED` no project cards, no timeline, and no repeat of the Scene 02 project display.
- Portal: `LOCKED` a depression / hole / portal progressively appears in this scene and is what connects to Scene 05.
- Open: `TBD` exact portal appearance (see `docs/VISUAL_DIRECTION.md`).
- Boundary to Scene 05: see `docs/TRANSITIONS.md` (04 → 05).

## Scene 05 — WHAT'S NEXT / SPACE

- Purpose: `LOCKED` the first time the site enters 3D space, after the visitor passes through the portal; a starfield.
- Theme: `DIRECTION` "WHAT'S NEXT" — future directions of exploration.
- Candidate topics: `DIRECTION` AI agents, developer tools, full stack, open source, embedded systems, visual programming. `TBD` the final set.
- Not: `LOCKED` not a contact page. The portal traversal before it must have narrative meaning.
- Spatial continuity: `DIRECTION` Scenes 05 and 06 share one continuous space.
- Boundary to Scene 06: see `docs/TRANSITIONS.md` (05 → 06).

## Scene 06 — DESTINATIONS

- Purpose: `LOCKED` still inside the space / starfield; give the visitor deeper external destinations.
- Candidate destinations: `DIRECTION` blog, GitHub, resume, email, source. Final links: `TBD`.
- Presentation: `LOCKED` not a conventional button list — stars, planets, destinations, points in space.
- Transition in: `DIRECTION` no hard cut from Scene 05; the space should gradually shift from "future directions" to "reachable destinations".
- Boundary to Scene 07: see `docs/TRANSITIONS.md` (06 → 07).

## Scene 07 — GOODBYE

- Purpose: `LOCKED` return to the 2D page world; a pure outro.
- Primary element: `LOCKED` GOODBYE.
- Possible contents: `DIRECTION` friends, friends' websites, blogroll, special thanks, other outbound links.
- Closing action: `LOCKED` RESTART. It is part of the narrative loop, not a plain back-to-top, and returns to Scene 01.
- Open: `TBD` the closing animation (e.g. text gathering / convergence).
- Boundary to Scene 01: see `docs/TRANSITIONS.md` (07 → 01).
