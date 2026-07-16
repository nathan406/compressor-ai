/**
 * lib/db.ts
 * ─────────────────────────────────────────────────────────────────
 * Lightweight JSON file store for development.
 *
 * No native modules, no WASM — just reads/writes a JSON file.
 * Swap this file for `import { Pool } from "pg"` when you're
 * ready to connect PostgreSQL.
 *
 * Schema: one table → jobs[]
 */

import fs from "fs";
import path from "path";

const DB_PATH =
  process.env.DB_PATH ||
  path.join(process.cwd(), "compresor.db.json");

// ── Types ─────────────────────────────────────────────────────────

export type JobRow = {
  id: number;
  modelName: string;
  params: string;
  arch: string;
  strategy: string;
  priority: string;
  gpuLogs: string;
  latency: string;
  originalSize: number;
  status: string;
  progress: number;
  log: string;
  savings: number;
  createdAt: number;
};

type Store = {
  jobs: JobRow[];
  nextId: number;
};

// ── Persistence ───────────────────────────────────────────────────

let _store: Store | null = null;

function load(): Store {
  if (!_store) {
    try {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      const parsed: Store = JSON.parse(raw);
      parsed.nextId =
        Math.max(0, ...parsed.jobs.map((j) => j.id)) + 1;
      _store = parsed;
    } catch {
      _store = { jobs: [], nextId: 1 };
      persist();
    }
  }
  return _store!;
}

function persist() {
  if (_store) {
    fs.writeFileSync(DB_PATH, JSON.stringify(_store, null, 2));
  }
}

// ── Public API (mirrors the pattern used by routes) ───────────────

/** Get the store (for compatibility with the old getDb() pattern) */
export function getDb(): Store {
  return load();
}

/** Return all jobs ordered oldest-first */
export function getAllJobs(): JobRow[] {
  return [...load().jobs].sort((a, b) => a.createdAt - b.createdAt);
}

/** Return one job by id, or undefined */
export function getJobById(id: number): JobRow | undefined {
  return load().jobs.find((j) => j.id === id);
}

/** Create a new job from partial data. Returns the full saved row. */
export function createJob(data: Partial<JobRow>): JobRow {
  const store = load();
  const now = Date.now() / 1000;
  const job: JobRow = {
    id: data.id ?? store.nextId,
    modelName: data.modelName ?? "Unknown Model",
    params: data.params ?? "",
    arch: data.arch ?? "transformer",
    strategy: data.strategy ?? "quantization_int8",
    priority: data.priority ?? "normal",
    gpuLogs: data.gpuLogs ?? "",
    latency: data.latency ?? "",
    originalSize: data.originalSize ?? 0,
    status: data.status ?? "pending",
    progress: data.progress ?? 0,
    log: data.log ?? "",
    savings: data.savings ?? 0,
    createdAt: data.createdAt ?? now,
  };

  // If client supplied an explicit id that already exists, return it
  const existing = store.jobs.find((j) => j.id === job.id);
  if (existing) return existing;

  store.jobs.push(job);
  store.nextId = Math.max(store.nextId, job.id + 1);
  persist();
  return job;
}

/** Update allowed fields on a job. Returns the updated row. */
export function updateJob(
  id: number,
  fields: Partial<Pick<JobRow, "status" | "progress" | "log" | "savings">>,
): JobRow | undefined {
  const store = load();
  const job = store.jobs.find((j) => j.id === id);
  if (!job) return undefined;

  Object.assign(job, fields);
  persist();
  return job;
}

/** Delete a job. Returns the id that was deleted, or undefined if not found. */
export function deleteJob(id: number): number | undefined {
  const store = load();
  const idx = store.jobs.findIndex((j) => j.id === id);
  if (idx === -1) return undefined;
  store.jobs.splice(idx, 1);
  persist();
  return id;
}

/** Return the number of jobs (for health check) */
export function getJobCount(): number {
  return load().jobs.length;
}
