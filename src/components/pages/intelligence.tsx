'use client';

import React, { useState } from 'react';
import { C, FF, API, ai } from '@/lib/constants';
import { Badge, Btn, Card, Sec, PBar, Spark, KPI } from '@/components/primitives';

// ── PAGE: COST INTELLIGENCE ────────────────────────────────────────
export function PageCost() {
  const [tab, setTab] = useState('Overview');

  const bkd = [
    { l: 'GPU Compute', v: 2900000, pct: 58, c: C.cy },
    { l: 'Inference Serving', v: 1200000, pct: 24, c: C.am },
    { l: 'Storage (S3)', v: 400000, pct: 8, c: C.gr },
    { l: 'Training Runs', v: 350000, pct: 7, c: C.rd },
    { l: 'Networking', v: 150000, pct: 3, c: C.pu },
  ];

  const mdls = [
    { n: 'Llama 3 70B', r: '2.4M/mo', g: '$1.08M', tot: '$1.12M' },
    { n: 'Mistral 8x7B', r: '1.8M/mo', g: '$680K', tot: '$720K' },
    { n: 'Llama 3 13B', r: '4.2M/mo', g: '$490K', tot: '$540K' },
    { n: 'Gemma 7B', r: '6.1M/mo', g: '$390K', tot: '$430K' },
    { n: 'Phi-3 Mini', r: '9.4M/mo', g: '$180K', tot: '$210K' },
  ];

  const tabs = ['Overview', 'Per Model', 'Projections'];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="Cost Intelligence Engine"
        title="AI Infrastructure Economics"
        sub="Charge for savings. Every dollar saved across all 5 layers is tracked, attributed, and reported in real time."
      />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <KPI label="Total Monthly Spend" value="$5.0M" sub="Current baseline" color={C.rd} />
        <KPI label="Optimized Projection" value="$3.2M" sub="After all 5 layers" color={C.gr} />
        <KPI label="Savings Opportunity" value="$1.8M" sub="Per month" color={C.cy} />
        <KPI label="Annual Savings" value="$21.6M" sub="Annualized" color={C.am} />
        <KPI label="Payback Period" value="2.4mo" sub="Platform ROI" color={C.gr} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 9, marginBottom: 18 }}>
        {[
          { t: 'Startup', p: '$299/mo', c: C.mu },
          { t: 'Growth', p: '$2,500/mo', c: C.cy },
          { t: 'Business', p: '$10K/mo', c: C.gr },
          { t: 'Enterprise', p: '$50K–$500K/mo', c: C.am },
        ].map((pr) => (
          <Card key={pr.t} sx={{ padding: '12px', borderTop: `3px solid ${pr.c}` }}>
            <div style={{ fontSize: 9, color: pr.c, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{pr.t}</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: C.gh, fontFamily: FF }}>{pr.p}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 3, background: C.sfH, border: `1px solid ${C.br}`, borderRadius: 8, padding: 4, width: 'fit-content', flexWrap: 'wrap', marginBottom: 13 }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '7px 16px',
              borderRadius: 6,
              border: tab === t ? `1px solid ${C.cy}40` : '1px solid transparent',
              background: tab === t ? C.cy + '18' : 'transparent',
              color: tab === t ? C.cy : C.mu,
              fontFamily: FF,
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ marginTop: 13 }}>
        {tab === 'Overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
            <Card sx={{ padding: '20px 22px' }}>
              <div style={{ color: C.gh, fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
                Spend by Category
              </div>
              {bkd.map((b) => (
                <div key={b.l} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: C.mL }}>{b.l}</span>
                    <span style={{ fontSize: 12, color: b.c, fontWeight: 700 }}>
                      ${(b.v / 1e6).toFixed(1)}M — {b.pct}%
                    </span>
                  </div>
                  <PBar pct={b.pct} color={b.c} h={5} />
                </div>
              ))}
            </Card>
            <Card sx={{ padding: '20px 22px' }}>
              <div style={{ color: C.gh, fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
                Savings by Layer
              </div>
              {[
                { l: 'Layer 1 — Model', s: 605000, c: C.cy },
                { l: 'Layer 2 — Prompt', s: 155000, c: C.gr },
                { l: 'Layer 3 — Routing', s: 405000, c: C.am },
                { l: 'Layer 4 — Context', s: 370000, c: C.pu },
                { l: 'Layer 5 — Inference', s: 1140000, c: C.bl },
              ].map((r) => (
                <div key={r.l} style={{ marginBottom: 11 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: C.mL }}>{r.l}</span>
                    <span style={{ fontSize: 12, color: r.c, fontWeight: 700 }}>
                      ${(r.s / 1000).toFixed(0)}K/mo
                    </span>
                  </div>
                  <PBar pct={(r.s / 1140000) * 100} color={r.c} h={4} />
                </div>
              ))}
              <div style={{ marginTop: 11, padding: '9px 12px', background: C.gr + '12', border: `1px solid ${C.gr}30`, borderRadius: 8 }}>
                <div style={{ fontSize: 9, color: C.gr, fontWeight: 700 }}>TOTAL — ALL 5 LAYERS</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.gh, fontFamily: FF }}>
                  $2.675M/mo saved
                </div>
              </div>
            </Card>
          </div>
        )}
        {tab === 'Per Model' && (
          <Card>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.sfH }}>
                  {['Model', 'Requests/mo', 'GPU Cost', 'Total Cost'].map((h) => (
                    <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 10, color: C.mu, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mdls.map((m, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.br}` }}>
                    <td style={{ padding: '11px 12px', color: C.gh, fontWeight: 600, fontSize: 13 }}>{m.n}</td>
                    <td style={{ padding: '11px 12px', color: C.mL, fontFamily: 'monospace', fontSize: 12 }}>{m.r}</td>
                    <td style={{ padding: '11px 12px', color: C.cy, fontWeight: 600, fontSize: 12 }}>{m.g}</td>
                    <td style={{ padding: '11px 12px', color: C.am, fontWeight: 800, fontFamily: FF, fontSize: 14 }}>{m.tot}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
        {tab === 'Projections' && (
          <Card sx={{ padding: '20px' }}>
            <div style={{ color: C.gh, fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
              12-Month Cost Trajectory ($M/month)
            </div>
            <Spark values={[5.0, 4.8, 4.6, 4.3, 4.1, 3.9, 3.7, 3.5, 3.4, 3.3, 3.2, 3.1]} color={C.rd} h={90} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
              <span style={{ fontSize: 10, color: C.mu }}>Jun 2025: $5.0M</span>
              <span style={{ fontSize: 12, color: C.gr, fontWeight: 700 }}>Projected: $3.1M/mo by Jun 2026</span>
              <span style={{ fontSize: 10, color: C.mu }}>Today: $3.2M</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── PAGE: ANALYTICS ────────────────────────────────────────────────
export function PageAnalytics() {
  const mdls = [
    { n: 'Llama 3 70B', b: 140, a: 52, sp: '2.4×', ac: '-0.3%' },
    { n: 'Mistral 8x7B', b: 92, a: 46, sp: '1.9×', ac: '-0.2%' },
    { n: 'Llama 3 13B', b: 26, a: 9.5, sp: '2.2×', ac: '-0.1%' },
    { n: 'Gemma 7B', b: 14, a: 5.2, sp: '2.6×', ac: '-0.4%' },
    { n: 'Phi-3 Mini', b: 7.6, a: 2.8, sp: '3.1×', ac: '-0.2%' },
  ];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec ey="Performance Analytics" title="5-Layer Optimization Results" />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <KPI label="Avg Compression (L1)" value="61%" sub="Across all models" color={C.cy} />
        <KPI label="Token Reduction (L2)" value="38%" sub="Prompt optimization" color={C.gr} />
        <KPI label="Traffic Rerouted (L3)" value="75%" sub="Smart routing" color={C.am} />
        <KPI label="Context Savings (L4)" value="85%" sub="History compression" color={C.pu} />
        <KPI label="GPU Fleet ↓ (L5)" value="34%" sub="5,000→3,300" color={C.bl} />
        <KPI label="Inference Speedup" value="2.1×" sub="All layers combined" color={C.gr} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13, marginBottom: 13 }}>
        <Card sx={{ padding: '18px 20px' }}>
          <div style={{ color: C.gh, fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
            Monthly Infrastructure Cost ($M)
          </div>
          <Spark values={[5.0, 4.8, 4.6, 4.3, 4.1, 3.9, 3.7, 3.5, 3.4, 3.3, 3.2, 3.1]} color={C.rd} h={65} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
            <span style={{ fontSize: 10, color: C.mu }}>12 months ago</span>
            <span style={{ color: C.gr, fontWeight: 800, fontFamily: FF, fontSize: 14 }}>$3.2M/mo today</span>
            <span style={{ fontSize: 10, color: C.mu }}>Today</span>
          </div>
        </Card>
        <Card sx={{ padding: '18px 20px' }}>
          <div style={{ color: C.gh, fontWeight: 600, fontSize: 13, marginBottom: 12 }}>
            AI Efficiency Score™
          </div>
          <Spark values={[42, 48, 54, 58, 63, 68, 72, 76, 79, 82, 85, 87]} color={C.cy} h={65} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
            <span style={{ fontSize: 10, color: C.mu }}>12 months ago: 42</span>
            <span style={{ color: C.cy, fontWeight: 800, fontFamily: FF, fontSize: 14 }}>87/100 today</span>
            <span style={{ fontSize: 10, color: C.mu }}>+45 pts</span>
          </div>
        </Card>
      </div>
      <Card>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.br}` }}>
          <span style={{ color: C.gh, fontWeight: 700, fontSize: 12 }}>Model Compression Results (Layer 1)</span>
        </div>
        <div style={{ padding: '14px' }}>
          {mdls.map((m, i) => (
            <div key={i} style={{ marginBottom: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: C.gh, fontWeight: 500, fontSize: 13 }}>{m.n}</span>
                <div style={{ display: 'flex', gap: 5 }}>
                  <span style={{ fontSize: 10, color: C.mu }}>{m.b}→{m.a} GB</span>
                  <Badge c={C.gr}>{((1 - m.a / m.b) * 100).toFixed(0)}% smaller</Badge>
                  <Badge c={C.am}>{m.sp} faster</Badge>
                  <Badge c={C.cy}>Acc {m.ac}</Badge>
                </div>
              </div>
              <div style={{ position: 'relative', height: 5 }}>
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', background: C.rd + '35', borderRadius: 3, height: 5 }} />
                <div style={{ position: 'absolute', top: 0, left: 0, width: `${(m.a / m.b) * 100}%`, background: C.gr, borderRadius: 3, height: 5 }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ── PAGE: REPORTS ──────────────────────────────────────────────────
export function PageReports({ jobs }: { jobs: any[] }) {
  const [rt, setRt] = useState('executive');
  const [gen, setGen] = useState(false);
  const [rep, setRep] = useState('');

  const FB: Record<string, string> = {
    executive: `EXECUTIVE SUMMARY — COMPRESSOR AI\nAI Efficiency Operating System | June 2026\n\nPOSITIONING\nCompressor AI is not a model compression company.\nWe are the AI Efficiency Operating System.\n\nStripe handles payments.\nCloudflare handles internet traffic.\nCompressor AI handles AI efficiency.\n\n5-LAYER PLATFORM PERFORMANCE\nLayer 1 — Model Optimization:   $605K/mo saved (63% avg model reduction)\nLayer 2 — Prompt Optimization:  $155K/mo saved (38% token reduction)\nLayer 3 — Smart Routing:        $405K/mo saved (75% traffic rerouted)\nLayer 4 — Context Compression:  $370K/mo saved (85% context reduction)\nLayer 5 — Inference Network:    $1.14M/mo saved (GPU fleet: 5,000→3,300)\nTOTAL:                          $2.675M/mo saved\n\nAI EFFICIENCY SCORE: 87/100 (+45 points in 12 months)\n\nFINANCIAL IMPACT\nPrevious monthly spend:  $5.0M\nCurrent monthly spend:   $3.2M\nMonthly savings:         $1.8M\nAnnual savings:          $21.6M\nPayback period:          2.4 months\n5-year NPV:              $94M+\n\nCOMPETITIVE MOAT\nEvery request processed builds our Optimization Intelligence Network — proprietary data on which models, prompts, routes, and GPU configurations deliver maximum efficiency. This data moat is much harder to copy than compression algorithms alone.\n\nYC PITCH\n"Compressor AI is the Cloudflare of AI. We sit between AI applications and model providers, automatically reducing inference costs, compressing context, optimizing prompts, routing requests to the most efficient models, and lowering GPU consumption without requiring changes to customer code."`,
    technical: `TECHNICAL REPORT — 5-LAYER ARCHITECTURE\nEngineering Briefing | June 2026\n\nUNIVERSAL API GATEWAY\nApplication → Compressor AI → (OpenAI | Anthropic | Gemini | Mistral | Llama | DeepSeek)\nCode change: compressor.chat.completions() — nothing else changes.\n\nLAYER 1 — MODEL OPTIMIZATION\n• Llama 3 70B: INT8 PTQ → 140GB→52GB (-63%), MMLU delta -0.3%\n• Mistral 8x7B: INT8 → 92GB→46GB (-50%)\n• Phi-3 Mini: INT4 GPTQ → 7.6GB→2.8GB (-63%)\n• Distillation: 70B→13B→3B→500M (edge-ready)\n\nLAYER 2 — PROMPT OPTIMIZATION\n• Detects: repeated phrases, redundant instructions, excessive context\n• Result: avg 1,000 tokens → 620 tokens. 38% fewer tokens billed.\n\nLAYER 3 — SMART ROUTING\n• Simple (34%)→Phi-3 Mini | Medium (41%)→Llama 13B | Complex (25%)→Premium\n• Multi-provider: auto-selects cheapest equivalent provider\n\nLAYER 4 — CONTEXT COMPRESSION\n• Semantic Memory Maps: stores intent, facts, decisions — not verbatim messages\n• 20,000 token histories → 3,000 tokens (85% reduction)\n\nLAYER 5 — INFERENCE NETWORK\n• 840 idle GPUs reclaimed from 5,000-node fleet\n• EU West: 91%→72% utilization via load rebalancing\n• Dynamic batching: BS=1→BS=32, throughput 42→89 req/s\n• p50: 120ms→52ms | p99: 480ms→195ms\n\nSTACK: Python + FastAPI + gRPC | PostgreSQL + ClickHouse + Redis | Kubernetes + Docker + Terraform | AWS + Azure + GCP | Anthropic Claude + PyTorch + ONNX Runtime + TensorRT + Ray`,
    financial: `FINANCIAL IMPACT REPORT\nCFO / Investor Briefing | June 2026\n\nROI SUMMARY — ALL 5 LAYERS\n─────────────────────────────────────────\nLayer 1 — Model Optimization   $605K/mo\nLayer 2 — Prompt Optimization  $155K/mo\nLayer 3 — Smart Routing        $405K/mo\nLayer 4 — Context Compression  $370K/mo\nLayer 5 — Inference Network    $1.14M/mo\n─────────────────────────────────────────\nTOTAL SAVINGS                  $2.675M/mo\nANNUAL                         $32.1M/yr\nPlatform Cost                  <$500K/yr\nNet Annual Benefit             >$31.6M\nROI                            63× first year\nPayback Period                 2.4 months\n5-year NPV (8% discount)       $94M+\n\nBUSINESS MODEL\nStartup ($299/mo) → Growth ($2,500/mo) → Business ($10K/mo) → Enterprise ($50K–$500K/mo) → Hyperscale (revenue share)\nHyperscale example: Save $10M/mo → charge 15% = $1.5M/mo from one customer.\n\nPROPRIETARY MOAT\nOptimization Intelligence Network — every request teaches the system:\n• Which models perform best for which task types\n• Which prompts are wasteful at scale\n• Which routes minimize cost without quality loss\nThis compounds over time — significantly harder to copy than algorithms alone.`,
  };

  const gen2 = async () => {
    setGen(true);
    setRep('');
    const ps: Record<string, string> = {
      executive:
        'Generate a CEO/board executive summary for Compressor AI — the AI Efficiency Operating System. Stripe=Payments, Cloudflare=Internet, CompressorAI=AI Efficiency. Include 5-layer savings ($2.675M/mo total: L1 $605K, L2 $155K, L3 $405K, L4 $370K, L5 $1.14M), AI Efficiency Score 87/100, financial impact ($5M→$3.2M/mo, $21.6M/yr savings, 2.4mo payback), competitive moat (Optimization Intelligence Network), and YC pitch.',
      technical:
        'Generate a technical engineering report for Compressor AI\'s 5-layer platform. L1: Model compression (INT8/INT4/pruning/distillation, 63% avg reduction). L2: Prompt optimization (38% token reduction). L3: Smart routing (complexity classifier, 75% traffic rerouted). L4: Context compression (Semantic Memory Maps, 85% reduction). L5: Inference network (840 GPUs reclaimed, batching, load balancing). Include tech stack.',
      financial:
        'Generate a CFO/investor financial report for Compressor AI. Include 5-layer ROI breakdown ($2.675M/mo total), business model tiers, 63x ROI, $94M 5-year NPV, and why the Optimization Intelligence Network creates a durable moat that OpenAI cannot easily copy.',
    };
    const text = await ai(ps[rt], FB[rt]);
    let i = 0;
    const iv = setInterval(() => {
      i += 18;
      setRep(text.slice(0, i));
      if (i >= text.length) {
        setRep(text);
        clearInterval(iv);
      }
    }, 15);
    setGen(false);
  };

  const reportTypes = [
    ['executive', 'CEO / Board Report'],
    ['technical', 'Engineering Report'],
    ['financial', 'CFO / Investor Report'],
  ] as const;

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="AI-Generated Reports"
        title="Reports Center"
        sub="Claude AI generates personalized reports from your live 5-layer infrastructure data, efficiency scores, and savings."
      />

      <div style={{ display: 'flex', gap: 7, marginBottom: 15, flexWrap: 'wrap' }}>
        {reportTypes.map(([v, l]) => (
          <button
            key={v}
            onClick={() => {
              setRt(v);
              setRep('');
            }}
            style={{
              padding: '8px 14px',
              borderRadius: 8,
              border: `1px solid ${rt === v ? C.cy : C.br}`,
              background: rt === v ? C.cy + '15' : 'transparent',
              color: rt === v ? C.cy : C.mL,
              fontFamily: FF,
              fontWeight: 700,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <Btn onClick={gen2} disabled={gen}>
          {gen ? 'Claude is writing…' : '✦ Generate with Claude AI'}
        </Btn>
        {rep && <Btn v="ghost">⬇ Export PDF</Btn>}
      </div>

      {(gen || rep) ? (
        <Card glow={C.pu} sx={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12, paddingBottom: 11, borderBottom: `1px solid ${C.pu}30` }}>
            <span style={{ color: C.pu, fontSize: 13 }}>✦</span>
            <span style={{ color: C.pu, fontWeight: 700, fontSize: 14 }}>
              Claude AI — {rt === 'executive' ? 'Executive Summary' : rt === 'technical' ? 'Engineering Report' : 'Financial Report'}
            </span>
          </div>
          <pre style={{ margin: 0, fontFamily: FF, fontSize: 12, color: C.gh, whiteSpace: 'pre-wrap', lineHeight: 1.9, background: 'transparent', maxHeight: 480, overflowY: 'auto' }}>
            {gen && !rep ? 'Claude is analyzing your 5-layer infrastructure data…' : rep}
            {gen && <span style={{ color: C.pu }}>▌</span>}
          </pre>
        </Card>
      ) : (
        <Card sx={{ padding: '38px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 13 }}>📊</div>
          <div style={{ color: C.gh, fontWeight: 700, marginBottom: 7, fontSize: 15 }}>
            Select a report type and generate
          </div>
          <div style={{ color: C.mu, fontSize: 13, maxWidth: 380, margin: '0 auto' }}>
            Claude AI writes fully personalized reports using your live 5-layer metrics, AI Efficiency Score™, and savings data.
          </div>
        </Card>
      )}
    </div>
  );
}
