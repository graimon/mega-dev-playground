// Plan morning-digest, section 1. The contract every part of section 2 builds against.

export type RunStatus = 'ok' | 'retry' | 'fail';

// One line of runs/<night>.jsonl, after parsing at the edge.
export type RunLine = {
  at: string; // ISO 8601 with the log's own offset; never converted to UTC
  job: string;
  status: RunStatus;
  owner: string | null;
  error?: string;
};

// One row per job for the night.
export type DigestRow = {
  job: string;
  owner: string | null; // null renders as "—"
  runs: number; // lines for this job, every status counted
  retries: number; // lines with status "retry"
  fails: number; // lines with status "fail"; any fail marks the row
  lastStatus: RunStatus; // status of the job's latest line
  lastError: string | null; // error of the latest line that had one; null renders as "—"
  firstAt: string; // `at` of the job's first line, offset kept
  lastAt: string; // `at` of the job's latest line, offset kept
};

export type Night = {
  night: string; // YYYY-MM-DD, the file name without .jsonl
  rows: DigestRow[]; // sorted by job
  counts: Record<RunStatus, number>; // parsed lines per status, all jobs; the board shows these
  badLines: number; // lines that did not parse; counted, never thrown
};

// Reads runsDir/<night>.jsonl. Returns null when the file does not exist (the routes answer 404).
// An empty file returns a Night with no rows.
export type ReadNight = (runsDir: string, night: string) => Night | null;
