/**
 * In-memory fallback database — activates when DATABASE_URL is not set.
 * Pre-seeded with demo accounts. Every Prisma-like query route works
 * out of the box with zero external services.
 *
 * This is NOT persistent — data resets on cold start. That's fine for
 * a demo / Netlify free-tier deployment.
 */

import bcrypt from "bcryptjs";

// ─── Types (subset of Prisma's generated types) ──────────────────
interface UserRow {
  id: string;
  email: string;
  password: string;
  role: string;
  company: string;
  createdAt: Date;
}

interface JobRow {
  id: number;
  userId: string;
  modelName: string;
  params: string;
  arch: string;
  strategy: string;
  priority: string;
  gpuLogs: string;
  latency: string;
  originalSize: number;
  outputSize: number;
  modelInputPath: string;
  modelOutputPath: string;
  status: string;
  progress: number;
  log: string;
  savings: number;
  createdAt: Date;
  updatedAt: Date;
  result?: JobResultRow | null;
}

interface JobResultRow {
  id: number;
  jobId: number;
  originalSizeGB: number;
  compressedSizeGB: number;
  compressionRatio: number;
  accuracyDelta: number;
  latencyBefore: number;
  latencyAfter: number;
  speedupFactor: number;
  monthlySavings: number;
  technique: string;
  benchmark: string;
  notes: string;
}

interface PromptLogRow {
  id: number;
  userId: string;
  originalPrompt: string;
  optimizedPrompt: string;
  originalTokens: number;
  optimizedTokens: number;
  savedTokens: number;
  reductionPct: number;
  savedDollars: number;
  createdAt: Date;
}

interface RoutingLogRow {
  id: number;
  userId: string;
  prompt: string;
  complexity: number;
  routedTo: string;
  provider: string;
  originalModel: string;
  originalCost: number;
  actualCost: number;
  savedDollars: number;
  latencyMs: number;
  createdAt: Date;
}

interface ContextLogRow {
  id: number;
  userId: string;
  originalTokens: number;
  compressedTokens: number;
  savedTokens: number;
  reductionPct: number;
  savedDollars: number;
  turnCount: number;
  createdAt: Date;
}

interface EfficiencyScoreRow {
  id: number;
  userId: string;
  costEfficiency: number;
  tokenEfficiency: number;
  latencyScore: number;
  contextEfficiency: number;
  gpuEfficiency: number;
  infrastructure: number;
  overall: number;
  calculatedAt: Date;
}

interface SystemCompressionRow {
  id: number;
  userId: string;
  url: string;
  hostname: string;
  status: string;
  errorMessage: string;
  originalTokens: number;
  optimizedTokens: number;
  savedTokens: number;
  reductionPct: number;
  savedDollars: number;
  source: string;
  sourcePreview: string;
  optimizedPreview: string;
  estimatedMonthlySpend: number;
  totalMonthlySavings: number;
  layersJson: string;
  createdAt: Date;
}

interface AgriModelRow {
  id: number;
  userId: string;
  jobId: number;
  cropType: string;
  connectivity: string;
  ramRequiredGB: number;
  status: string;
  deployedAt: Date;
}

interface CropDiagnosisRow {
  id: number;
  userId: string;
  agriModelId: number | null;
  cropHint: string;
  crop: string;
  possibleIssue: string;
  confidence: number;
  lowConfidence: boolean;
  possibleCauses: string;
  recommendation: string;
  source: string;
  createdAt: Date;
}

interface AgentSessionRow {
  id: number;
  userId: string;
  industry: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AgentMessageRow {
  id: number;
  sessionId: number;
  role: string;
  content: string;
  toolCalls: string;
  source: string;
  createdAt: Date;
}

// ─── Storage ─────────────────────────────────────────────────────
let _nextJobId = 1;
let _nextResultId = 1;
let _nextPromptLogId = 1;
let _nextRoutingLogId = 1;
let _nextContextLogId = 1;
let _nextScoreId = 1;
let _nextSysCompId = 1;
let _nextAgriModelId = 1;
let _nextDiagId = 1;
let _nextSessionId = 1;
let _nextMessageId = 1;

const users: UserRow[] = [];
const jobs: JobRow[] = [];
const jobResults: JobResultRow[] = [];
const promptLogs: PromptLogRow[] = [];
const routingLogs: RoutingLogRow[] = [];
const contextLogs: ContextLogRow[] = [];
const efficiencyScores: EfficiencyScoreRow[] = [];
const systemCompressions: SystemCompressionRow[] = [];
const agriModels: AgriModelRow[] = [];
const cropDiagnoses: CropDiagnosisRow[] = [];
const agentSessions: AgentSessionRow[] = [];
const agentMessages: AgentMessageRow[] = [];

// ─── Seed demo accounts ─────────────────────────────────────────
const DEMO_PASSWORD_HASH = bcrypt.hashSync("admin123", 12);
const DEMO2_PASSWORD_HASH = bcrypt.hashSync("demo123", 12);

users.push(
  { id: "admin-seed-001", email: "admin@compressor.ai", password: DEMO_PASSWORD_HASH, role: "admin", company: "Compressor AI", createdAt: new Date("2024-01-01") },
  { id: "demo-seed-001",  email: "demo@enterprise.ai",  password: DEMO2_PASSWORD_HASH, role: "demo",  company: "Enterprise Demo Corp", createdAt: new Date("2024-01-01") },
);

// ─── Helpers ─────────────────────────────────────────────────────
function pick<T>(arr: T[], where: (row: T) => boolean): T | undefined {
  return arr.find(where);
}
function pickMany<T>(arr: T[], where: (row: T) => boolean): T[] {
  return arr.filter(where);
}

// Simple order-by for Date fields
function orderByDate<T>(arr: T[], dateField: keyof T, dir: "asc" | "desc"): T[] {
  return [...arr].sort((a, b) => {
    const da = (a[dateField] as Date).getTime();
    const db = (b[dateField] as Date).getTime();
    return dir === "asc" ? da - db : db - da;
  });
}

// ─── Table adapters ──────────────────────────────────────────────

/** User table */
const userTable = {
  async findUnique(args: { where: { id?: string; email?: string }; select?: Record<string, boolean> }) {
    let row: UserRow | undefined;
    if (args.where.id) row = pick(users, (u) => u.id === args.where.id);
    else if (args.where.email) row = pick(users, (u) => u.email === args.where.email);
    if (!row) return null;
    if (args.select) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(args.select)) {
        if (v) out[k] = (row as unknown as Record<string, unknown>)[k];
      }
      return out;
    }
    return row;
  },
  async count() { return users.length; },
  async create(args: { data: Omit<UserRow, "id" | "createdAt"> }) {
    const row: UserRow = { ...args.data, id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, createdAt: new Date() };
    users.push(row);
    return row;
  },
};

/** Job table */
const jobTable = {
  async findMany(args?: { where?: Record<string, unknown>; include?: { result?: boolean }; orderBy?: { createdAt?: "asc" | "desc" } }) {
    let rows = args?.where?.userId ? pickMany(jobs, (j) => j.userId === args.where!.userId) : [...jobs];
    if (args?.where?.status) rows = rows.filter((j) => j.status === args.where!.status);
    rows = orderByDate(rows, "createdAt", args?.orderBy?.createdAt ?? "asc");
    if (args?.include?.result) {
      rows = rows.map((j) => ({ ...j, result: jobResults.find((r) => r.jobId === j.id) ?? null }));
    }
    return rows;
  },
  async findFirst(args: { where: Record<string, unknown>; include?: { result?: boolean } }) {
    let row = pick(jobs, (j) => {
      if (args.where.id !== undefined && j.id !== Number(args.where.id)) return false;
      if (args.where.userId !== undefined && j.userId !== args.where.userId) return false;
      if (args.where.status !== undefined && j.status !== args.where.status) return false;
      return true;
    });
    if (!row) return null;
    if (args.include?.result) row = { ...row, result: jobResults.find((r) => r.jobId === row!.id) ?? null };
    return row;
  },
  async findUnique(args: { where: { id: number }; include?: { result?: boolean } }) {
    let row = pick(jobs, (j) => j.id === args.where.id);
    if (!row) return null;
    if (args.include?.result) row = { ...row, result: jobResults.find((r) => r.jobId === row!.id) ?? null };
    return row;
  },
  async create(args: { data: Omit<JobRow, "id" | "createdAt" | "updatedAt" | "result">; include?: { result?: boolean } }) {
    const row: JobRow = { ...args.data, id: _nextJobId++, createdAt: new Date(), updatedAt: new Date(), result: null };
    jobs.push(row);
    return args.include?.result ? { ...row, result: null } : row;
  },
  async update(args: { where: { id: number }; data: Record<string, unknown>; include?: { result?: boolean } }) {
    const row = pick(jobs, (j) => j.id === args.where.id)!;
    Object.assign(row, args.data, { updatedAt: new Date() });
    if (args.include?.result) row.result = jobResults.find((r) => r.jobId === row.id) ?? null;
    return row;
  },
  async delete(args: { where: { id: number } }) {
    const idx = jobs.findIndex((j) => j.id === args.where.id);
    if (idx >= 0) jobs.splice(idx, 1);
    // Also remove result
    const ri = jobResults.findIndex((r) => r.jobId === args.where.id);
    if (ri >= 0) jobResults.splice(ri, 1);
    return { id: args.where.id };
  },
};

/** JobResult table */
const jobResultTable = {
  async upsert(args: { where: { jobId: number }; create: Omit<JobResultRow, "id">; update: Record<string, unknown> }) {
    let existing = pick(jobResults, (r) => r.jobId === args.where.jobId);
    if (existing) {
      Object.assign(existing, args.update);
      return existing;
    }
    const row: JobResultRow = { ...args.create, id: _nextResultId++, jobId: args.where.jobId };
    jobResults.push(row);
    return row;
  },
};

/** PromptLog table */
const promptLogTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { createdAt?: "asc" | "desc" } }) {
    let rows = args?.where?.userId ? pickMany(promptLogs, (l) => l.userId === args.where!.userId) : [...promptLogs];
    if (args?.where?.createdAt) rows = rows.filter((l) => l.createdAt >= (args.where!.createdAt as any).gte);
    return orderByDate(rows, "createdAt", args?.orderBy?.createdAt ?? "desc");
  },
  async create(args: { data: Omit<PromptLogRow, "id" | "createdAt"> }) {
    const row: PromptLogRow = { ...args.data, id: _nextPromptLogId++, createdAt: new Date() };
    promptLogs.push(row);
    return row;
  },
};

/** RoutingLog table */
const routingLogTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { createdAt?: "asc" | "desc" } }) {
    let rows = args?.where?.userId ? pickMany(routingLogs, (l) => l.userId === args.where!.userId) : [...routingLogs];
    if (args?.where?.createdAt) rows = rows.filter((l) => l.createdAt >= (args.where!.createdAt as any).gte);
    return orderByDate(rows, "createdAt", args?.orderBy?.createdAt ?? "desc");
  },
  async create(args: { data: Omit<RoutingLogRow, "id" | "createdAt"> }) {
    const row: RoutingLogRow = { ...args.data, id: _nextRoutingLogId++, createdAt: new Date() };
    routingLogs.push(row);
    return row;
  },
};

/** ContextLog table */
const contextLogTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { createdAt?: "asc" | "desc" } }) {
    let rows = args?.where?.userId ? pickMany(contextLogs, (l) => l.userId === args.where!.userId) : [...contextLogs];
    if (args?.where?.createdAt) rows = rows.filter((l) => l.createdAt >= (args.where!.createdAt as any).gte);
    return orderByDate(rows, "createdAt", args?.orderBy?.createdAt ?? "desc");
  },
  async create(args: { data: Omit<ContextLogRow, "id" | "createdAt"> }) {
    const row: ContextLogRow = { ...args.data, id: _nextContextLogId++, createdAt: new Date() };
    contextLogs.push(row);
    return row;
  },
};

/** EfficiencyScore table */
const efficiencyScoreTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { calculatedAt?: "asc" | "desc" }; take?: number; select?: Record<string, boolean> }) {
    let rows = args?.where?.userId ? pickMany(efficiencyScores, (s) => s.userId === args.where!.userId) : [...efficiencyScores];
    rows = orderByDate(rows, "calculatedAt", args?.orderBy?.calculatedAt ?? "desc");
    if (args?.take) rows = rows.slice(0, args.take);
    if (args?.select) {
      rows = rows.map((r) => {
        const out: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(args.select!)) {
          if (v) out[k] = (r as unknown as Record<string, unknown>)[k];
        }
        return out as unknown as EfficiencyScoreRow;
      });
    }
    return rows;
  },
  async create(args: { data: Omit<EfficiencyScoreRow, "id" | "calculatedAt"> }) {
    const row: EfficiencyScoreRow = { ...args.data, id: _nextScoreId++, calculatedAt: new Date() };
    efficiencyScores.push(row);
    return row;
  },
};

/** SystemCompression table */
const systemCompressionTable = {
  async create(args: { data: Omit<SystemCompressionRow, "id" | "createdAt"> }) {
    const row: SystemCompressionRow = { ...args.data, id: _nextSysCompId++, createdAt: new Date() };
    systemCompressions.push(row);
    return row;
  },
};

/** AgriModel table */
const agriModelTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { deployedAt?: "asc" | "desc" }; include?: Record<string, boolean> }) {
    let rows = args?.where?.userId ? pickMany(agriModels, (m) => m.userId === args.where!.userId) : [...agriModels];
    rows = orderByDate(rows, "deployedAt", args?.orderBy?.deployedAt ?? "desc");
    if (args?.include?.job) {
      rows = rows.map((m) => ({
        ...m,
        job: { ...pick(jobs, (j) => j.id === m.jobId), result: jobResults.find((r) => r.jobId === m.jobId) ?? null },
      }));
    }
    return rows;
  },
  async findFirst(args: { where: Record<string, unknown>; include?: Record<string, boolean> }) {
    let row = pick(agriModels, (m) => {
      if (args.where.userId !== undefined && m.userId !== args.where.userId) return false;
      if (args.where.id !== undefined && m.id !== Number(args.where.id)) return false;
      return true;
    });
    if (!row) return null;
    if (args.include?.job) {
      const job = pick(jobs, (j) => j.id === row!.jobId);
      const result = jobResults.find((r) => r.jobId === row!.jobId) ?? null;
      row = { ...row, job: job ? { ...job, result } : null } as AgriModelRow & { job: JobRow };
    }
    return row;
  },
  async upsert(args: { where: { jobId: number }; create: Omit<AgriModelRow, "id" | "deployedAt">; update: Record<string, unknown>; include?: Record<string, boolean> }) {
    let existing = pick(agriModels, (m) => m.jobId === args.where.jobId && m.userId === args.create.userId);
    if (existing) {
      Object.assign(existing, args.update);
      return existing;
    }
    const row: AgriModelRow = { ...args.create, id: _nextAgriModelId++, deployedAt: new Date() };
    agriModels.push(row);
    return row;
  },
};

/** CropDiagnosis table */
const cropDiagnosisTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { createdAt?: "asc" | "desc" }; take?: number }) {
    let rows = args?.where?.userId ? pickMany(cropDiagnoses, (d) => d.userId === args.where!.userId) : [...cropDiagnoses];
    if (args?.where?.agriModelId !== undefined) rows = rows.filter((d) => d.agriModelId === args.where!.agriModelId);
    rows = orderByDate(rows, "createdAt", args?.orderBy?.createdAt ?? "desc");
    if (args?.take) rows = rows.slice(0, args.take);
    return rows;
  },
  async create(args: { data: Omit<CropDiagnosisRow, "id" | "createdAt"> }) {
    const row: CropDiagnosisRow = { ...args.data, id: _nextDiagId++, createdAt: new Date() };
    cropDiagnoses.push(row);
    return row;
  },
};

/** AgentSession table */
const agentSessionTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { updatedAt?: "asc" | "desc" }; take?: number }) {
    let rows = args?.where?.userId ? pickMany(agentSessions, (s) => s.userId === args.where!.userId) : [...agentSessions];
    if (args?.where?.industry) rows = rows.filter((s) => s.industry === args.where!.industry);
    rows = orderByDate(rows, "updatedAt", args?.orderBy?.updatedAt ?? "desc");
    if (args?.take) rows = rows.slice(0, args.take);
    return rows;
  },
  async findFirst(args: { where: Record<string, unknown>; include?: { messages?: boolean } }) {
    let row = pick(agentSessions, (s) => {
      if (args.where.id !== undefined && s.id !== Number(args.where.id)) return false;
      if (args.where.userId !== undefined && s.userId !== args.where.userId) return false;
      if (args.where.industry !== undefined && s.industry !== args.where.industry) return false;
      return true;
    });
    if (!row) return null;
    if (args.include?.messages) {
      const msgs = pickMany(agentMessages, (m) => m.sessionId === row!.id);
      (row as AgentSessionRow & { messages: AgentMessageRow[] }).messages = orderByDate(msgs, "createdAt", "asc");
    }
    return row;
  },
  async create(args: { data: Omit<AgentSessionRow, "id" | "createdAt" | "updatedAt"> }) {
    const now = new Date();
    const row: AgentSessionRow = { ...args.data, id: _nextSessionId++, createdAt: now, updatedAt: now };
    agentSessions.push(row);
    return row;
  },
  async update(args: { where: { id: number }; data: Record<string, unknown> }) {
    const row = pick(agentSessions, (s) => s.id === args.where.id)!;
    Object.assign(row, args.data, { updatedAt: new Date() });
    return row;
  },
};

/** AgentMessage table */
const agentMessageTable = {
  async findMany(args?: { where?: Record<string, unknown>; orderBy?: { createdAt?: "asc" | "desc" } }) {
    let rows = args?.where?.sessionId ? pickMany(agentMessages, (m) => m.sessionId === args.where!.sessionId) : [...agentMessages];
    return orderByDate(rows, "createdAt", args?.orderBy?.createdAt ?? "asc");
  },
  async create(args: { data: Omit<AgentMessageRow, "id" | "createdAt"> }) {
    const row: AgentMessageRow = { ...args.data, id: _nextMessageId++, createdAt: new Date() };
    agentMessages.push(row);
    return row;
  },
};

// ─── Mock Prisma Client ─────────────────────────────────────────
export const mockPrisma = {
  user: userTable,
  job: jobTable,
  jobResult: jobResultTable,
  promptLog: promptLogTable,
  routingLog: routingLogTable,
  contextLog: contextLogTable,
  efficiencyScore: efficiencyScoreTable,
  systemCompression: systemCompressionTable,
  agriModel: agriModelTable,
  cropDiagnosis: cropDiagnosisTable,
  agentSession: agentSessionTable,
  agentMessage: agentMessageTable,
  $disconnect: async () => {},
};
