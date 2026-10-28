# S01E03 · what it shows (archived)

**Archived.** The MEGA.dev course accepted this Challenge on 2026-10-28. Nothing in this folder
changes after that date. Issue #3 stays open as a record. Nobody works on issue #3.

The support desk merged 412 reports into ticket #4471 and marked it known. The reports show three
problems, each with its own ticket in this repo:

| Ticket | Problem | Reports | State |
|---|---|---|---|
| [#1](https://github.com/graimon/mega-dev-playground/issues/1) | `parser`: the shared parser reads day-first dates month first | 374 | closed, fixed |
| [#2](https://github.com/graimon/mega-dev-playground/issues/2) | `hint`: the `booking-v3` form hint says `MM/DD/YYYY`, the form reads day first | 33 | closed, won't fix |
| [#3](https://github.com/graimon/mega-dev-playground/issues/3) | `one-day`: dates move by one day, probably a time zone conversion | 5 | open |

Engineering closed #4471 on 2026-10-05. That closure gave no verdict for `one-day`, so #3 stays open.

## Files

Paths are relative to this folder.

| Path | What it is |
|---|---|
| `support-kb/` | The kb export of 2026-10-04, with the new page and its logic |
| `support-kb/src/routes/kb/incidents/4471-problems/+page.svx` | The new page, signed with the course ticket |
| `support-kb/src/lib/kb/problems.ts`, `support-kb/src/lib/kb/ProblemTable.svelte` | The logic and the table that the page uses |
| `rendered/kb/incidents/4471-problems.html`, `.png` | The page as the desk sees it: prerendered HTML and a screenshot |
| `build-setup/` | The SvelteKit and mdsvex files that built `rendered/` |

The course checked the kb at the repo root. The kb moved into this folder after the course
accepted the Challenge.

## Build again

1. Copy `package.json`, `svelte.config.js` and `vite.config.js` from `build-setup/` to `support-kb/`.
2. Copy `app.html` to `support-kb/src/`, and `+layout.js` to `support-kb/src/routes/`.
3. In `support-kb/`, run `npm install` and `npm run build`. The site appears in `support-kb/build/`.
