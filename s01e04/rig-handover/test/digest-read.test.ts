import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import { readNight } from '../src/digest/read.js';

const tmp = mkdtempSync(join(tmpdir(), 'rig-digest-'));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

describe('readNight on runs/2026-10-28.jsonl', () => {
  const night = readNight('runs', '2026-10-28');
  const row = (job: string) => night?.rows.find((r) => r.job === job);

  it('reads 5 jobs and counts 1 bad line', () => {
    expect(night).not.toBeNull();
    expect(night?.night).toBe('2026-10-28');
    expect(night?.rows).toHaveLength(5);
    expect(night?.badLines).toBe(1);
  });

  it('sorts rows by job', () => {
    expect(night?.rows.map((r) => r.job)).toEqual([
      'digest/render',
      'fixtures/refresh',
      'lane/sync',
      'notes/backup',
      'rig/rotate-logs',
    ]);
  });

  it('counts parsed lines per status', () => {
    expect(night?.counts).toEqual({ ok: 10, retry: 4, fail: 1 });
  });

  it('fixtures/refresh: 3 retries, recovered, last error kept', () => {
    expect(row('fixtures/refresh')).toEqual({
      job: 'fixtures/refresh',
      owner: 'rook',
      runs: 4,
      retries: 3,
      fails: 0,
      lastStatus: 'ok',
      lastError: 'upstream 503',
      firstAt: '2026-10-29T01:30:00+01:00',
      lastAt: '2026-10-29T01:37:00+01:00',
    });
  });

  it('notes/backup fails with "quota exceeded"', () => {
    const r = row('notes/backup');
    expect(r?.fails).toBe(1);
    expect(r?.lastStatus).toBe('fail');
    expect(r?.lastError).toBe('quota exceeded');
  });

  it('digest/render keeps a null owner', () => {
    expect(row('digest/render')?.owner).toBeNull();
  });

  it('keeps the log offset on times', () => {
    const r = row('lane/sync');
    expect(r?.firstAt).toBe('2026-10-28T23:00:06+01:00');
    expect(r?.lastAt).toBe('2026-10-29T05:00:04+01:00');
    expect(r?.runs).toBe(8);
    expect(r?.retries).toBe(1);
  });
});

describe('readNight edge cases', () => {
  it('returns null when the file is missing', () => {
    expect(readNight(tmp, '2026-01-01')).toBeNull();
  });

  it('returns null for a night that is not a date', () => {
    expect(readNight(tmp, '../etc')).toBeNull();
  });

  it('returns an empty night for an empty file', () => {
    writeFileSync(join(tmp, '2026-01-02.jsonl'), '');
    expect(readNight(tmp, '2026-01-02')).toEqual({
      night: '2026-01-02',
      rows: [],
      counts: { ok: 0, retry: 0, fail: 0 },
      badLines: 0,
    });
  });

  it('counts lines with a wrong shape as bad, never throws', () => {
    const lines = [
      '{"at":"2026-01-03T01:00:00+01:00","job":"a","status":"ok","owner":"x"}',
      '{"at":"2026-01-03T02:00:00+01:00","job":"a","status":"done","owner":"x"}',
      '{"at":"2026-01-03T03:00:00+01:00","job":"a","status":"ok"}',
      '[1,2]',
      'null',
      'not json',
      '',
    ];
    writeFileSync(join(tmp, '2026-01-03.jsonl'), lines.join('\n'));
    const night = readNight(tmp, '2026-01-03');
    expect(night?.badLines).toBe(5);
    expect(night?.rows).toHaveLength(1);
    expect(night?.counts).toEqual({ ok: 1, retry: 0, fail: 0 });
  });

  it('takes the owner from the latest line', () => {
    const lines = [
      '{"at":"2026-01-04T01:00:00+01:00","job":"a","status":"fail","owner":"x","error":"boom"}',
      '{"at":"2026-01-04T02:00:00+01:00","job":"a","status":"ok","owner":null}',
    ];
    writeFileSync(join(tmp, '2026-01-04.jsonl'), lines.join('\n') + '\n');
    const r = readNight(tmp, '2026-01-04')?.rows[0];
    expect(r?.owner).toBeNull();
    expect(r?.lastStatus).toBe('ok');
    expect(r?.lastError).toBe('boom');
  });
});
