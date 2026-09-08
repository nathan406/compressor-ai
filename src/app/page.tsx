export default function Page() {
  const endpoints = [
    ["POST",   "/api/auth/login",           "Authenticate — returns JWT token"],
    ["POST",   "/api/auth/register",         "Create new user account"],
    ["GET",    "/api/auth/me",               "Current user profile"],
    ["GET",    "/api/jobs",                  "List all optimization jobs"],
    ["POST",   "/api/jobs",                  "Create a new optimization job"],
    ["GET",    "/api/jobs/[id]",             "Fetch one job by ID"],
    ["PATCH",  "/api/jobs/[id]",             "Update job status / progress / log"],
    ["DELETE", "/api/jobs/[id]",             "Delete a job"],
    ["GET",    "/api/jobs/[id]/stream",      "SSE real-time log stream"],
    ["POST",   "/api/jobs/upload",           "Get presigned R2 upload URL"],
    ["POST",   "/api/optimize/prompt",       "Layer 2 — Prompt optimization"],
    ["POST",   "/api/optimize/route",        "Layer 3 — Smart model routing"],
    ["POST",   "/api/optimize/context",      "Layer 4 — Context compression"],
    ["GET",    "/api/optimize/score",        "AI Efficiency Score™"],
    ["POST",   "/api/optimize/scan",         "Full infrastructure scan"],
    ["GET",    "/api/analytics",             "Aggregated savings dashboard"],
    ["GET",    "/api/analytics/savings",     "Savings by day (30-day series)"],
    ["GET",    "/api/analytics/models",      "Per-model cost breakdown"],
    ["POST",   "/api/claude",                "Claude AI proxy"],
    ["POST",   "/api/agripulse/deploy",      "Deploy an optimized job to AgriPulse"],
    ["GET",    "/api/agripulse/models",      "List deployed AgriPulse models + benchmarks"],
    ["POST",   "/api/agripulse/diagnose",    "Crop Health AI — diagnose a crop photo"],
    ["GET",    "/api/agripulse/diagnoses",   "Crop diagnosis history"],
    ["GET",    "/api/agripulse/demo",        "World Bank demo mode — full pipeline state"],
    ["GET",    "/api/agents",                "List all 9 industry AI Agents"],
    ["GET",    "/api/agents/sessions",       "List all agent sessions (any industry)"],
    ["POST",   "/api/agents/[industry]/sessions",         "Start a new session with an agent"],
    ["GET",    "/api/agents/[industry]/sessions",         "List sessions with an agent"],
    ["GET",    "/api/agents/[industry]/sessions/[id]",    "Fetch a session transcript"],
    ["POST",   "/api/agents/[industry]/sessions/[id]/message", "Send a message — runs the agent's tool-use loop"],
    ["GET",    "/api/health",                "Service health check"],
  ];

  const colors: Record<string, string> = {
    GET: "#00E5FF", POST: "#00E396", PATCH: "#FFB800", DELETE: "#FF4560",
  };

  return (
    <main style={{ fontFamily: "monospace", padding: "2rem", background: "#06080F", color: "#00E5FF", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "1.4rem", marginBottom: "0.25rem" }}>Compressor AI — API Server</h1>
      <p style={{ color: "#6B7A99", marginBottom: "2rem", fontSize: "0.9rem" }}>
        AI Efficiency Operating System · Next.js Serverless Backend v3.0 · Netlify
      </p>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr style={{ color: "#6B7A99", fontSize: "0.75rem", textTransform: "uppercase" }}>
            <th style={{ textAlign: "left", padding: "0.4rem 1.2rem 0.4rem 0" }}>Method</th>
            <th style={{ textAlign: "left", padding: "0.4rem 1.2rem 0.4rem 0" }}>Path</th>
            <th style={{ textAlign: "left", padding: "0.4rem 0" }}>Description</th>
          </tr>
        </thead>
        <tbody>
          {endpoints.map(([method, path, desc]) => (
            <tr key={path + method} style={{ borderTop: "1px solid #1C2A40" }}>
              <td style={{ padding: "0.5rem 1.2rem 0.5rem 0", color: colors[method] ?? "#E8EDF5", fontWeight: "bold", fontSize: "0.85rem" }}>
                {method}
              </td>
              <td style={{ padding: "0.5rem 1.2rem 0.5rem 0", color: "#00E5FF", fontSize: "0.85rem" }}>
                {path}
              </td>
              <td style={{ padding: "0.5rem 0", color: "#9BAAC0", fontSize: "0.85rem" }}>
                {desc}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: "2.5rem", padding: "1rem 1.25rem", background: "#0D1324", border: "1px solid #1C2A40", borderRadius: "8px" }}>
        <p style={{ color: "#9BAAC0", fontSize: "0.85rem", margin: 0 }}>
          Health check: <a href="/api/health" style={{ color: "#00E5FF" }}>/api/health</a>
          &nbsp;·&nbsp;
          All routes require <code style={{ color: "#FFB800" }}>Authorization: Bearer &lt;token&gt;</code> except login, register, and health.
        </p>
      </div>
    </main>
  );
}
