import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import type { Night } from '../src/digest/types.js';

// Nights in a temp runs dir. runs/ is read-only and never touched here.
const NORMAL = '2026-10-30';
const EMPTY = '2026-10-31';
const BAD = '2026-11-01';
const MISSING = '2026-01-01';

const GOOD_LINE_A = '{"at":"2026-10-30T23:00:00+01:00","job":"a/one","status":"ok","owner":"rook"}';
const GOOD_LINE_B =
  '{"at":"2026-10-30T23:05:00+01:00","job":"b/two","status":"fail","owner":null,"error":"timeout"}';
const BAD_LINE = 'this line is not json';

let runsDir: string;

function makeApp() {
  return createApp({
    adapter: 'shim',
    installed: '2026-10-29T14:06:00+01:00',
    beatEverySeconds: 60,
    runsDir,
  });
}

beforeAll(() => {
  runsDir = mkdtempSync(join(tmpdir(), 'rig-digest-'));
  writeFileSync(join(runsDir, `${NORMAL}.jsonl`), `${GOOD_LINE_A}\n${GOOD_LINE_B}\n`);
  writeFileSync(join(runsDir, `${EMPTY}.jsonl`), '');
  writeFileSync(join(runsDir, `${BAD}.jsonl`), `${GOOD_LINE_A}\n${BAD_LINE}\n${GOOD_LINE_B}\n`);
});

afterAll(() => {
  rmSync(runsDir, { recursive: true, force: true });
});

describe('digest page', () => {
  it('answers 200 with the night heading and every job name', async () => {
    const res = await makeApp().request(`/digest/${NORMAL}`);
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain(`digest · ${NORMAL}`);
    expect(html).toContain('a/one');
    expect(html).toContain('b/two');
  });

  it('answers 404 for a night with no file', async () => {
    const res = await makeApp().request(`/digest/${MISSING}`);
    expect(res.status).toBe(404);
  });

  it('answers 200 and says nothing ran for an empty file', async () => {
    const res = await makeApp().request(`/digest/${EMPTY}`);
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('nothing ran');
  });

  it('answers 200, lists the good jobs, and says did not parse for a bad line', async () => {
    const res = await makeApp().request(`/digest/${BAD}`);
    const html = await res.text();
    expect(res.status).toBe(200);
    expect(html).toContain('a/one');
    expect(html).toContain('b/two');
    expect(html).toContain('did not parse');
  });
});

describe('digest JSON', () => {
  it('answers 200 with night, rows, counts and badLines', async () => {
    const res = await makeApp().request(`/api/digest/${NORMAL}`);
    const body = (await res.json()) as Night;
    expect(res.status).toBe(200);
    expect(body.night).toBe(NORMAL);
    expect(body.rows.map((row) => row.job)).toEqual(['a/one', 'b/two']);
    expect(body.counts).toEqual({ ok: 1, retry: 0, fail: 1 });
    expect(body.badLines).toBe(0);
  });

  it('answers 404 for a night with no file', async () => {
    const res = await makeApp().request(`/api/digest/${MISSING}`);
    expect(res.status).toBe(404);
  });

  it('returns no rows and zero bad lines for an empty file', async () => {
    const res = await makeApp().request(`/api/digest/${EMPTY}`);
    const body = (await res.json()) as Night;
    expect(res.status).toBe(200);
    expect(body.rows).toEqual([]);
    expect(body.badLines).toBe(0);
  });

  it('counts the bad line and keeps the good rows', async () => {
    const res = await makeApp().request(`/api/digest/${BAD}`);
    const body = (await res.json()) as Night;
    expect(res.status).toBe(200);
    expect(body.badLines).toBe(1);
    expect(body.rows.map((row) => row.job)).toEqual(['a/one', 'b/two']);
  });
});

describe('digest page and JSON agree', () => {
  it('lists the JSON job names in the same order in the HTML', async () => {
    const app = makeApp();
    const body = (await (await app.request(`/api/digest/${NORMAL}`)).json()) as Night;
    const html = await (await app.request(`/digest/${NORMAL}`)).text();

    const positions = body.rows.map((row) => html.indexOf(row.job));
    positions.forEach((position) => expect(position).toBeGreaterThanOrEqual(0));
    expect([...positions].sort((x, y) => x - y)).toEqual(positions);
  });
});
