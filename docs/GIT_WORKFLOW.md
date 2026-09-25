# Git Workflow

Git workflow source of truth for CHRONICLE module development.

This document describes **how to use Git once an agent has already been authorized to write Git history**. It grants no permission by itself. Permissions come from the user's current task, `AGENTS.md`, and the agent-specific rules in `docs/OMP_RULES.md` — where OMP / DeepSeek stay read-only on Git even after reading this file.

Branch names below are naming examples, not existing branches. If the repository later establishes its own branch convention, follow the repository.

## Goals

- Git here is not only backup. It is used for module isolation, animation experimentation, visual experimentation, easy rollback, implementation comparison, and a stable architecture history.
- CHRONICLE contains complex GSAP transitions, character choreography, text physics, a portal, 3D space, and ongoing visual experimentation. "The new version is worse than a few commits ago" is an expected outcome, so history must stay clear, small-stepped, understandable, and revertible.
- History is documentation: a later agent should be able to locate the state an earlier version described, instead of re-implementing it from memory.

## Starting a Task

Before a Git-managed task begins, inspect:

```bash
git status
git branch --show-current
git log --oneline --decorate -n 20
# when relevant:
git diff
```

Confirm the current branch, working-tree state, baseline commit, whether there is uncommitted work, and whether another agent has changes in flight.

If the working tree is unexpectedly dirty: do not auto-stash, auto-commit, reset, clean, or overwrite. Report to the user first.

## Feature Branches

- Do not develop a formal module directly on the main branch by default. Create a feature branch per reasonably independent module.
- Naming examples:
  - `feat/scene-01-enter-grid`
  - `feat/scene-02-composer`
  - `feat/transition-ai-push`
  - `feat/deepseek-impact`
  - `feat/portal-space`
  - `feat/space-destinations`
  - `feat/goodbye-restart`
- Use feature branches for formal modules, complex interaction, high-risk changes, visual experiments, and architecture changes.
- Do not force a feature branch for a trivial single-line documentation fix.

## Commit Strategy

Each commit should have a single understandable purpose, be easy to review, be easy to revert, and contain no unrelated formatting, unrelated refactors, or accidental files.

- Do not produce one giant commit for a whole module, and do not fabricate a dozen meaningless micro-commits.
- A normal formal module is usually **2–5 meaningful commits**. Actual work decides the number.
- Conventional Commits style: `feat(scope):`, `fix(scope):`, `refactor(scope):`, `test(scope):`, `docs(scope):`, `perf(scope):`.
- Examples:
  - `feat(transition): implement enter-grid scroll choreography`
  - `fix(transition): stabilize reverse scrolling`
  - `feat(scene-01): add reduced-motion enter-grid fallback`
  - `test(transition): cover enter-grid lifecycle`
- Forbidden messages: `update`, `changes`, `stuff`, `fix`, `misc`, `wip` — anything a reviewer cannot understand.

Do not commit a deliberately broken state:

- Before a formal commit, confirm the code touched by that commit type-checks, has no obvious runtime error, and that the behavior it claims basically holds.
- Not every small commit must be a finished product, but keep states buildable, understandable, and non-broken on the main paths.
- Temporary experiments may live in the working tree; once the direction is confirmed, organize them into meaningful commits.

## Experimental Visual Work

- Visual and animation experiments are the main reason this history exists. Example attempts for one beat: (A) simple grid scale, (B) grid alignment + crossfade, (C) perspective + depth interpolation.
- Do not pile the leftovers of A, B, and C into the final implementation. Once a direction is chosen, delete the discarded implementation.
- Do not keep commented-out code, `oldVersion`, `test2`, `backup`, or other dead implementations. Git history is the backup.
- If experiments differ radically, a separate feature or experimental branch is acceptable, but avoid branch explosion.

## Rollback Philosophy

- Every visual or motion change should be easy to revert.
- Commits describe behavior changes; do not pack multiple independent design experiments into one commit.
- Do not squash valuable experiment history casually, and do not rewrite history without a reason.
- When the user says an earlier version was better, find that state through Git history rather than re-implementing it from memory.

## Verification Before Commit

- Run the minimum sufficient verification for the change — typecheck, targeted test, build, browser verification — based on `package.json` and on what the current task requires.
- Never claim a check passed that was not actually run.

## Safety Rules

Forbidden by default for every agent:

- `git reset --hard`
- `git clean`
- `git checkout -- .`
- `git restore .` — or anything else that would overwrite unknown work
- force push
- any other command that can destroy uncommitted work

When undoing your own recent edits, first assess whether the command could affect the user's or another agent's work. Never use a destructive command for convenience. Before any Git write, confirm branch, remote, and working-tree state.

## Finishing a Task

- Default after a formal feature task: stay on the feature branch with the commits intact. Do not merge and do not push.
- Wait for user review. The user may continue editing, merge, squash-merge, discard the branch, return to an earlier commit, or compare implementations.
- The agent never makes the final history decision for the user.

## Merge / Push Policy

- Push: default is no push. Push only when the user explicitly asks, and before pushing confirm remote, branch, working tree, and commit history. No force push unless the user explicitly understands the risk and requests it.
- Merge: never merge a feature branch into main/master automatically. Stop at the feature branch and let the user choose normal merge, squash merge, or rebase merge after review.

## Example Branches

Illustrative shape only — Codex / the main engineering agent is the primary Git-managed developer in this project, and these branches may not exist yet. Check with `git branch --all` instead of assuming.

```text
main
  │
  ├── feat/scene-01-enter-grid
  │      ├── commit A
  │      ├── commit B
  │      └── commit C
  │
  ├── feat/scene-02-composer
  │
  ├── feat/transition-ai-push
  │
  ├── feat/deepseek-impact
  │
  └── feat/portal-space
```
