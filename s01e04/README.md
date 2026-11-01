# S01E04 · before i looked

State: solved 2026-11-01, archived.

Challenge page: https://hq.mega.dev/challenges/before-i-looked

## Task

A team handed over its repo `rig`: a small service, its plan, its notes, and a skill. The course
asked for these steps:

1. Create a new public repo from the course template `MEGA-DOT-DEV/rig-handover`.
2. Split `plan.md` into GitHub issues.
3. Let agents build the plan.
4. Send the reviewer a public link to an HTML copy of the digest page.
5. Remove the lane marker from the page after the review.

## Files

| Path | Content |
|---|---|
| `rig-handover/` | the `main` branch of `graimon/s01e04-rig-handover` at the solve, without its 13 commits of history. That repo was deleted on 2026-11-01. |
| `issues.md` | the 8 issues of that repo, with bodies and closing comments, exported with `gh` |

The plan with its issue table is in `rig-handover/docs/plans/done/2026-10-29-morning-digest.md`.

The preview HTML is not in this folder. ADR 0003 of `rig` forbids previews in a repo. The
`gh-pages` branch of this repo serves the preview without the marker at
https://cv.rayware.ninja/mega-dev-playground/s01e04/.

## Result

- 8 issues, all closed. Issue #1 ran alone first, then issues #2 to #6 ran in parallel on 5 workers.
- 23 tests pass.
- The course refused 1 claim, because issue #7 was closed before the reviewer looked. The next claim
  after the clean-up was accepted.
