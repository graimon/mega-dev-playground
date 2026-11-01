# Issues of graimon/s01e04-rig-handover

Exported with gh on 2026-11-01. All 8 issues are closed.

## #1 Digest types: DigestRow and readNight signature

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 1

## Scope
Commit `src/digest/types.ts` first: the `DigestRow` type (job, owner, runs, retries, last status, last error, first and last time) and the `readNight(runsDir, night)` signature. The body may throw "not implemented". This unblocks every part of plan § 2.
Worker: strongest model (logic).

## Done when
`src/digest/types.ts` is on `main` and `pnpm typecheck` passes.

## Blocked by
—

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:15:37Z graimon:

```
done: src/digest/types.ts (DigestRow, Night, ReadNight) and a readNight stub in src/digest/read.ts
worker: claude-code · opus-5.5 · medium
commit: 81815d9
```

## #2 Run log reader

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 1

## Scope
Implement `readNight` in `src/digest/`: read `runs/<night>.jsonl` into one row per job (job, owner, runs, retries, last status, last error, first and last time). Lines are JSON objects with `at`, `job`, `status` (`ok | retry | fail`), `owner`, optional `error`.
- A line that does not parse is counted, never thrown. The night still renders.
- `owner` can be `null`: keep the row, show the owner as `—`.
- Keep the time offset from the log (styleguide). `runs/` is read-only.
Worker: strongest model (logic).

## Done when
Reader tests pass on `runs/2026-10-28.jsonl` (5 jobs, 1 bad line).

## Blocked by
#1

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:18:58Z graimon:

```
done: readNight in src/digest/read.ts: one row per job, bad lines counted, null owner kept, 12 reader tests
worker: claude-code · opus-5.5 · medium
commit: c146a00
```

## #3 Digest page: GET /digest/:night

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 2a

## Scope
`GET /digest/:night` renders the rows with the usual layout: one table, sorted by job; retries of 3 or more and any `fail` marked. A night with no file returns 404; an empty file renders "nothing ran". Missing data renders as `—`.
Worker: cheaper model (view).

## Done when
`/digest/2026-10-28` renders locally. (Needs #2 for real rows.)

## Blocked by
#1

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:19:00Z graimon:

```
done: GET /digest/:night renders the sorted table with warn rows, nothing ran, and the bad-line notice
worker: claude-code · sonnet-5.5 · low
commit: f46fb7b
```

## #4 Digest JSON: GET /api/digest/:night

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 2b

## Scope
`GET /api/digest/:night` returns the same rows as JSON. Agents read this one; the page and the JSON must never disagree (ADR 0001).
Worker: cheaper model.

## Done when
The JSON for 2026-10-28 has the same jobs, in the same order, as the page. (Needs #2 and #3.)

## Blocked by
#1

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:19:03Z graimon:

```
done: GET /api/digest/:night returns the same Night as the page; same 5 jobs, same order for 2026-10-28
worker: claude-code · sonnet-5.5 · low
commit: 8c79ee6
```

## #5 Board link to each digest

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 2c

## Scope
The status board links each night on disk to its digest, with its ok / retry / fail counts beside it.
Worker: cheaper model (view).

## Done when
Both nights on disk link to a digest that renders. (Needs #2 and #3.)

## Blocked by
#1

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:19:05Z graimon:

```
done: status board links each night to its digest with ok / retry / fail counts
worker: claude-code · sonnet-5.5 · low
commit: 4031a65
```

## #6 Route tests for the digest page and JSON

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 2d

## Scope
Route tests for #3 and #4 through `app.request()`: 200, 404 for a night with no file, the empty night, a night with a bad line. Use a temp runs dir; `runs/` is read-only.
Worker: cheaper model (tests).

## Done when
`pnpm test` is green with the new tests.

## Blocked by
#1

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:19:08Z graimon:

```
done: route tests for page and JSON: 200, 404, empty night, bad line, page/JSON order (9 tests)
worker: claude-code · haiku-5.5 · low
commit: 9ce4e20
```

## #7 Preview for review

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 3

## Scope
Run rig and save `/digest/2026-10-28` as one HTML file, lane banner included, with a command (not a browser "save as"). Publish it on a public host that can be uploaded over: GitHub Pages, `gh-pages` branch of graimon/mega-dev-playground. Send the reviewer the link and the issues for this plan. The preview never goes into this repo, an issue or a chat attachment (ADR 0003).

## Done when
The preview link is sent to the reviewer.

## Blocked by
#3

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:27:05Z graimon:

```
Reopened: the link is sent, but the reviewer has not looked yet. This issue waits on the reviewer's review. Preview: https://cv.rayware.ninja/mega-dev-playground/s01e04/
```

- 2026-11-01T18:32:43Z graimon:

```
done: /digest/2026-10-28 saved with curl as one HTML file, published at https://cv.rayware.ninja/mega-dev-playground/s01e04/ (gh-pages of graimon/mega-dev-playground), and the reviewer has seen it
worker: claude-code · opus-5.5 · medium
commit: none
```

## #8 Clean up the preview

State: CLOSED · Labels: plan:morning-digest

Source: plan.md § 4

## Scope
Once the review is in: save the page again with `LANE_MARKER` unset (the banner reads "no marker set") and upload it over the same link. Replace the `gh-pages` history with one commit, so the marked copy is not kept in git (ADR 0003). Move `plan.md` to `docs/plans/done/` with its issue list.

## Done when
The preview link no longer shows the lane marker.

## Blocked by
#7, and the reviewer's review

## Closing
Close with the AGENTS.md comment:
```
done: <what changed, one line>
worker: <harness> · <model> · <effort>
commit: <sha or "none">
```
Close only when "Done when" holds.


### Comments

- 2026-11-01T18:36:48Z graimon:

```
done: preview re-uploaded over https://cv.rayware.ninja/mega-dev-playground/s01e04/ with LANE_MARKER unset (banner: no marker set), gh-pages history replaced with one commit, plan moved to docs/plans/done/ with its issue list
worker: claude-code · opus-5.5 · medium
commit: ab763d5
```
