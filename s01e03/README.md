# S01E03 · what it shows

The support desk merged 412 reports into ticket #4471 and marked it known. The reports show three
problems, each with its own ticket in this repo:

| Ticket | Problem | Reports | State |
|---|---|---|---|
| [#1](https://github.com/graimon/mega-dev-playground/issues/1) | `parser`: the shared parser reads day-first dates month first | 374 | closed, fixed |
| [#2](https://github.com/graimon/mega-dev-playground/issues/2) | `hint`: the `booking-v3` form hint says `MM/DD/YYYY`, the form reads day first | 33 | closed, won't fix |
| [#3](https://github.com/graimon/mega-dev-playground/issues/3) | `one-day`: dates move by one day, probably a time zone conversion | 5 | open |

Engineering closed #4471 on 2026-10-05. That closure gave no verdict for `one-day`, so #3 stays open.

## Files

The kb lives at the repo root, in the layout of the export. Paths are relative to the repo root.

| Path | What it is |
|---|---|
| `README.md`, `src/` | The kb export of 2026-10-04, with the new page and its logic |
| `src/routes/kb/incidents/4471-problems/+page.svx` | The new page, signed |
| `src/lib/kb/problems.ts`, `src/lib/kb/ProblemTable.svelte` | The logic and the table that the page uses |
| `rendered/kb/incidents/4471-problems.html`, `.png` | The page as the desk sees it: prerendered HTML and a screenshot |
| `s01e03/build-setup/` | The SvelteKit and mdsvex files that built `rendered/` |

To build again: copy `package.json`, `svelte.config.js` and `vite.config.js` from
`s01e03/build-setup/` to the repo root. Copy `app.html` to `src/` and `+layout.js` to
`src/routes/`. Then run `npm install` and `npm run build`.
