'use client';

import React from 'react';
import { C, FF } from '@/lib/constants';
import { Badge, Btn, Card, Sec, PBar, Spark, KPI, LiveDot } from '@/components/primitives';
import { ScoreWidget } from '@/components/score-widget';

// ── PAGE: AI EFFICIENCY SCORE ───────────────────────────────────────
export function PageScore() {
  const score = 87;
  const comps = [
    { n: 'Your Infrastructure', s: 87, c: C.cy },
    { n: 'Industry Average', s: 61, c: C.mu },
    { n: 'Top Quartile', s: 79, c: C.gr },
    { n: 'Unoptimized', s: 42, c: C.rd },
  ];
  const imps = [
    { a: 'Apply INT4 quantization to Llama 3 70B', i: '+4 pts', sv: '$420K/mo', l: 'L1 — Model' },
    { a: 'Enable prompt compression on all API calls', i: '+2 pts', sv: '$85K/mo', l: 'L2 — Prompt' },
    { a: 'Route simple queries to Phi-3 Mini', i: '+3 pts', sv: '$310K/mo', l: 'L3 — Routing' },
    { a: 'Enable semantic context summarization', i: '+2 pts', sv: '$240K/mo', l: 'L4 — Context' },
    { a: 'Rebalance EU West cluster (91% util)', i: '+1 pt', sv: '$180K/mo', l: 'L5 — Inference' },
  ];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="Flagship Feature"
        title="AI Efficiency Score™"
        sub="Every AI system gets a score — like a credit score for your AI infrastructure. Compressor AI continuously optimizes every dimension."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
        <ScoreWidget score={score} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card sx={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: C.gh, fontWeight: 700, marginBottom: 12 }}>
              Score vs. Benchmarks
            </div>
            {comps.map((c) => (
              <div key={c.n} style={{ marginBottom: 11 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, color: c.n === 'Your Infrastructure' ? C.gh : C.mu }}>
                    {c.n}
                  </span>
                  <span style={{ fontSize: 12, color: c.c, fontWeight: 700 }}>{c.s}/100</span>
                </div>
                <PBar pct={c.s} color={c.c} h={c.n === 'Your Infrastructure' ? 6 : 4} />
              </div>
            ))}
          </Card>
          <Card sx={{ padding: '16px 20px' }}>
            <div style={{ fontSize: 12, color: C.gh, fontWeight: 700, marginBottom: 4 }}>
              Score Trajectory (12 months)
            </div>
            <div style={{ fontSize: 10, color: C.mu, marginBottom: 10 }}>
              From 42 → 87 (+45 points)
            </div>
            <Spark values={[42, 48, 54, 58, 63, 68, 72, 76, 79, 82, 85, 87]} color={C.cy} h={55} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
              <span style={{ fontSize: 10, color: C.mu }}>Jun 2025: 42</span>
              <span style={{ fontSize: 11, color: C.gr, fontWeight: 700 }}>+45 points</span>
              <span style={{ fontSize: 10, color: C.mu }}>Today: 87</span>
            </div>
          </Card>
        </div>
      </div>
      <Card>
        <div style={{ padding: '12px 18px', borderBottom: `1px solid ${C.br}` }}>
          <div style={{ color: C.gh, fontWeight: 700, fontSize: 13 }}>
            Score Improvement Opportunities
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: C.sfH }}>
              {['Optimization Action', 'Layer', 'Impact', 'Savings'].map((h) => (
                <th key={h} style={{ padding: '9px 12px', textAlign: 'left', fontSize: 10, color: C.mu, textTransform: 'uppercase' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {imps.map((r, i) => (
              <tr key={i} style={{ borderTop: `1px solid ${C.br}` }}>
                <td style={{ padding: '11px 12px', color: C.gh, fontSize: 13 }}>{r.a}</td>
                <td style={{ padding: '9px 10px' }}><Badge c={C.pu}>{r.l}</Badge></td>
                <td style={{ padding: '9px 10px', color: C.gr, fontWeight: 800, fontFamily: FF, fontSize: 14 }}>{r.i}</td>
                <td style={{ padding: '9px 10px', color: C.am, fontWeight: 700 }}>{r.sv}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: '11px 18px', borderTop: `1px solid ${C.br}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: C.mu, fontSize: 11 }}>
            Applying all 5: estimated score <b style={{ color: C.cy }}>99/100</b>
          </div>
          <Btn sm>Apply All →</Btn>
        </div>
      </Card>
    </div>
  );
}

// ── PAGE: OVERVIEW ──────────────────────────────────────────────────
export function PageOverview({
  jobs,
  setPage,
}: {
  jobs: any[];
  setPage: (p: string) => void;
}) {
  const done = jobs.filter((j: any) => j.status === 'completed');
  const sv = done.reduce((a: number, j: any) => a + (j.savings || 0), 0);
  const rec = [...jobs].reverse().slice(0, 5);
  const layers = [
    { n: 'Layer 1', label: 'Model Optimization', desc: 'Quantization · Pruning · Distillation', c: C.cy, sv: '$605K/mo' },
    { n: 'Layer 2', label: 'Prompt Optimization', desc: 'Token reduction · Redundancy removal', c: C.gr, sv: '$155K/mo' },
    { n: 'Layer 3', label: 'Smart Routing', desc: 'Complexity → model size matching', c: C.am, sv: '$405K/mo' },
    { n: 'Layer 4', label: 'Context Compression', desc: 'Semantic memory · History summarization', c: C.pu, sv: '$370K/mo' },
    { n: 'Layer 5', label: 'Inference Network', desc: 'Traffic routing · Load balancing · GPU reclaim', c: C.bl, sv: '$1.14M/mo' },
  ];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
        <Sec
          ey="Executive Overview"
          title="AI Efficiency Operating System"
          sub="One platform optimizing every layer between your AI models and your users."
        />
        <div style={{ background: C.cy + '15', border: `1px solid ${C.cy}30`, borderRadius: 10, padding: '12px 16px', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 9, color: C.cy, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 3 }}>
            Efficiency Score™
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: C.cy, fontFamily: FF, lineHeight: 1 }}>87</div>
          <div style={{ fontSize: 11, color: C.mu, marginTop: 3 }}>+45 pts this year</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        <KPI label="Models Managed" value={47 + jobs.length + ''} sub="Across 6 clusters" color={C.cy} />
        <KPI label="Monthly Savings" value={'$' + (1.8 + sv / 1e6).toFixed(2) + 'M'} sub="vs. baseline" color={C.gr} delta="12% vs last month" />
        <KPI label="GPU Hours Saved" value="124K" sub="This month" color={C.am} />
        <KPI label="Cost Reduction" value="36%" sub="Since deployment" color={C.gr} />
        <KPI label="Active Jobs" value={jobs.filter((j: any) => j.status === 'running').length + ''} sub="Running now" color={C.am} />
      </div>

      <Card sx={{ marginBottom: 16 }}>
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.br}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ color: C.gh, fontWeight: 700, fontSize: 12 }}>
            5-Layer Optimization Engine — Live Status
          </div>
          <Badge c={C.gr} dot>All Layers Active</Badge>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)' }}>
          {layers.map((l, i) => (
            <div key={l.n} style={{ padding: '12px 11px', borderRight: i < 4 ? `1px solid ${C.br}` : 'none', borderTop: `3px solid ${l.c}` }}>
              <div style={{ fontSize: 9, color: l.c, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 3 }}>{l.n}</div>
              <div style={{ color: C.gh, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{l.label}</div>
              <div style={{ color: C.mu, fontSize: 10, lineHeight: 1.6, marginBottom: 6 }}>{l.desc}</div>
              <div style={{ color: l.c, fontWeight: 800, fontFamily: FF, fontSize: 12 }}>{l.sv}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
        <Card>
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.br}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: C.gh, fontWeight: 600, fontSize: 12 }}>Recent Jobs</span>
            <Btn sm v="ghost" onClick={() => setPage('Compression Jobs')}>View All</Btn>
          </div>
          {rec.length === 0 ? (
            <div style={{ padding: '26px', textAlign: 'center', color: C.mu, fontSize: 12 }}>
              No jobs yet.{' '}
              <button onClick={() => setPage('Upload Model')} style={{ color: C.cy, background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF, fontWeight: 600 }}>
                Upload a model →
              </button>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.sfH }}>
                  {['Model', 'Strategy', 'Progress', 'Status', 'Savings'].map((h) => (
                    <th key={h} style={{ padding: '8px 11px', textAlign: 'left', fontSize: 10, color: C.mu, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rec.map((j: any, i: number) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.br}` }}>
                    <td style={{ padding: '10px 11px', color: C.gh, fontWeight: 500, fontSize: 13 }}>{j.modelName}</td>
                    <td style={{ padding: '8px 9px' }}><Badge c={C.pu}>{j.strategy.replace(/_/g, ' ')}</Badge></td>
                    <td style={{ padding: '8px 9px', minWidth: 85 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <div style={{ flex: 1 }}><PBar pct={j.progress} color={j.status === 'completed' ? C.gr : C.cy} /></div>
                        <span style={{ fontSize: 9, color: C.mu }}>{j.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px 9px' }}>
                      <Badge c={j.status === 'completed' ? C.gr : j.status === 'running' ? C.cy : j.status === 'failed' ? C.rd : C.am}>
                        {j.status}
                      </Badge>
                    </td>
                    <td style={{ padding: '8px 9px', color: C.gr, fontWeight: 700, fontSize: 12 }}>
                      {j.status === 'completed' ? '$' + (j.savings / 1000).toFixed(0) + 'K/mo' : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
        <Card sx={{ padding: '18px 20px' }}>
          <div style={{ color: C.gh, fontWeight: 600, fontSize: 13, marginBottom: 13 }}>Platform Health</div>
          {[
            { l: 'Model Optimizer (L1)', c: C.gr },
            { l: 'Prompt Engine (L2)', c: C.gr },
            { l: 'Routing Engine (L3)', c: C.gr },
            { l: 'Context Compressor (L4)', c: C.gr },
            { l: 'Inference Network (L5)', c: C.gr },
            { l: 'Claude AI Layer', c: C.cy },
            { l: 'PostgreSQL', c: C.gr },
            { l: 'Redis Queue', c: C.gr },
          ].map((s) => (
            <div key={s.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: 11, color: C.mL }}>{s.l}</span>
              <Badge c={s.c} dot>Active</Badge>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── PAGE: INFRA SCAN ───────────────────────────────────────────────
export function PageScan() {
  const [phase, setPhase] = React.useState('idle');
  const [pct, setPct] = React.useState(0);
  const [cur, setCur] = React.useState('');
  const [res, setRes] = React.useState<any[] | null>(null);

  const tgts = [
    'Connecting to Kubernetes cluster…',
    'Scanning AI model registry (47 models)…',
    'Analyzing GPU utilization across 5,000 nodes…',
    'Checking storage for duplicate models…',
    'Probing inference servers for response times…',
    'Auditing vector databases…',
    'Mapping training pipeline resource usage…',
    'Calculating cost attribution per model…',
    'Scoring all 5 optimization layers…',
    'Compiling AI Efficiency Score™ report…',
    'Scan complete.',
  ];

  const run = () => {
    setPhase('scanning');
    setPct(0);
    setRes(null);
    let i = 0;
    const step = () => {
      if (i >= tgts.length) {
        setPhase('done');
        setRes([
          { t: 'L1 — Quantization', m: 'Llama 3 70B', cur: '140 GB', opt: '52 GB', sv: '$420K/mo', p: 'critical' },
          { t: 'L5 — GPU Realloc', m: 'Training Cluster A', cur: '5,000 GPUs', opt: '3,300 GPUs', sv: '$640K/mo', p: 'critical' },
          { t: 'L1 — Distillation', m: 'Llama 3 70B → 13B', cur: '70B params', opt: '13B params', sv: '$380K/mo', p: 'high' },
          { t: 'L2 — Prompt Opt', m: 'All API Calls', cur: 'avg 1,000 tokens', opt: 'avg 600 tokens', sv: '$85K/mo', p: 'high' },
          { t: 'L3 — Routing', m: 'Simple Queries', cur: 'GPT-4 class', opt: 'Phi-3 Mini', sv: '$310K/mo', p: 'high' },
          { t: 'L4 — Context', m: 'Chat Histories', cur: '20,000 tokens', opt: '3,000 tokens', sv: '$240K/mo', p: 'high' },
          { t: 'L1 — Pruning', m: 'Falcon 40B', cur: '80 GB', opt: '22 GB', sv: '$185K/mo', p: 'medium' },
        ]);
        return;
      }
      setCur(tgts[i]);
      setPct(Math.round((i / tgts.length) * 100));
      i++;
      setTimeout(step, 570);
    };
    step();
  };

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="Step 2"
        title="AI Infrastructure Scan"
        sub="Compressor AI scans every layer between your AI model and your users — mapping waste across all 5 optimization dimensions."
      />
      {phase === 'idle' && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <div style={{ fontSize: 50, marginBottom: 14 }}>🔍</div>
          <div style={{ color: C.gh, fontSize: 16, fontWeight: 700, marginBottom: 8 }}>
            Full 5-Layer Infrastructure Scan
          </div>
          <div style={{ color: C.mu, fontSize: 13, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
            Scans models, prompts, routing, context, and GPU utilization to identify every savings opportunity.
          </div>
          <Btn onClick={run} sx={{ fontSize: 14, padding: '12px 34px' }}>
            ▶ Run Infrastructure Scan
          </Btn>
        </div>
      )}
      {phase === 'scanning' && (
        <Card sx={{ padding: '28px', textAlign: 'center', maxWidth: 500, margin: '40px auto' }} glow={C.cy}>
          <div style={{ color: C.cy, fontSize: 11, fontWeight: 700, marginBottom: 14 }}>
            SCANNING ALL 5 OPTIMIZATION LAYERS
          </div>
          <PBar pct={pct} h={9} />
          <div style={{ color: C.gh, fontWeight: 700, fontSize: 20, fontFamily: FF, margin: '13px 0 5px' }}>{pct}%</div>
          <div style={{ color: C.mL, fontSize: 12 }}>{cur}</div>
        </Card>
      )}
      {phase === 'done' && res && (
        <>
          <div style={{ background: C.gr + '10', border: `1px solid ${C.gr}30`, borderRadius: 10, padding: '13px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontSize: 9, color: C.gr, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>Scan Complete</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.gh, fontFamily: FF }}>7 Opportunities Found Across All 5 Layers</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, color: C.mu }}>Total Savings</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: C.gr, fontFamily: FF }}>$2.26M<span style={{ fontSize: 12, color: C.mu }}>/mo</span></div>
            </div>
          </div>
          <Card>
            <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.br}` }}>
              <span style={{ color: C.gh, fontWeight: 700, fontSize: 12 }}>Optimization Opportunities — All 5 Layers</span>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: C.sfH }}>
                  {['Layer / Type', 'Model / System', 'Current', 'Optimized', 'Savings', 'Priority'].map((h) => (
                    <th key={h} style={{ padding: '9px 10px', textAlign: 'left', fontSize: 10, color: C.mu, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {res.map((o, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${C.br}` }}>
                    <td style={{ padding: '9px 9px' }}><Badge c={C.pu}>{o.t}</Badge></td>
                    <td style={{ padding: '10px 11px', color: C.gh, fontWeight: 500, fontSize: 13 }}>{o.m}</td>
                    <td style={{ padding: '9px 9px', color: C.mu, fontSize: 11 }}>{o.cur}</td>
                    <td style={{ padding: '9px 9px', color: C.cy, fontWeight: 600, fontSize: 11 }}>{o.opt}</td>
                    <td style={{ padding: '9px 9px', color: C.gr, fontWeight: 700, fontFamily: FF }}>{o.sv}</td>
                    <td style={{ padding: '9px 9px' }}><Badge c={o.p === 'critical' ? C.rd : o.p === 'high' ? C.am : C.gr}>{o.p}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <Btn onClick={run} v="ghost" sm>↺ Re-scan</Btn>
          </div>
        </>
      )}
    </div>
  );
}

// ── PAGE: OPERATIONS ───────────────────────────────────────────────
export function PageOps() {
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 2000);
    return () => clearInterval(id);
  }, []);

  const j = (base: number, r: number) => base + Math.floor(Math.sin(tick * 0.8 + base) * r);

  const nodes = [
    { id: 'ue', l: 'US East — A100×800', u: j(82, 4), m: j(78, 3), s: 'healthy' },
    { id: 'uw', l: 'US West — H100×600', u: j(69, 5), m: j(65, 4), s: 'healthy' },
    { id: 'ew', l: 'EU West — A100×400', u: j(91, 3), m: j(88, 3), s: 'warning' },
    { id: 'ap', l: 'AP Southeast — V100×200', u: j(55, 6), m: j(51, 5), s: 'healthy' },
  ];

  const mdls = [
    { n: 'Llama 3 70B', r: j(1420, 80), la: j(118, 12) },
    { n: 'Mistral 8x7B', r: j(980, 60), la: j(88, 8) },
    { n: 'Llama 3 13B', r: j(2100, 120), la: j(52, 6) },
    { n: 'Gemma 7B', r: j(3200, 150), la: j(38, 4) },
    { n: 'Phi-3 Mini', r: j(4800, 200), la: j(22, 3) },
  ];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 18 }}>
        <Sec ey="Operations" title="Live Infrastructure Monitor" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, background: C.gr + '15', border: `1px solid ${C.gr}30`, borderRadius: 7, padding: '6px 12px' }}>
          <LiveDot />
          <span style={{ color: C.gr, fontSize: 11, fontWeight: 700 }}>Live • Updates every 2s</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        <KPI label="Active GPUs" value={j(4820, 30).toLocaleString()} sub="of 5,000" color={C.cy} />
        <KPI label="Inference Req/s" value={j(11500, 300).toLocaleString()} sub="all models" color={C.am} />
        <KPI label="Avg Latency" value={j(82, 8) + 'ms'} sub="p50" color={C.gr} />
        <KPI label="Memory Usage" value={j(73, 3) + '%'} sub="fleet avg" color={C.pu} />
        <KPI label="Cost / Hour" value={'$' + j(6800, 200).toLocaleString()} sub="burn rate" color={C.rd} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <Card sx={{ padding: '18px 20px' }}>
          <div style={{ color: C.gh, fontWeight: 700, fontSize: 13, marginBottom: 13 }}>GPU Cluster Health</div>
          {nodes.map((n) => (
            <div key={n.id} style={{ marginBottom: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, color: C.gh }}>{n.l}</span>
                <Badge c={n.s === 'warning' ? C.am : C.gr}>{n.s}</Badge>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.mu, marginBottom: 2 }}>GPU UTIL</div>
                  <PBar pct={n.u} color={n.u > 85 ? C.rd : C.cy} h={4} />
                  <div style={{ fontSize: 9, color: C.mu, marginTop: 2 }}>{n.u}%</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: C.mu, marginBottom: 2 }}>MEM</div>
                  <PBar pct={n.m} color={n.m > 85 ? C.rd : C.am} h={4} />
                  <div style={{ fontSize: 9, color: C.mu, marginTop: 2 }}>{n.m}%</div>
                </div>
              </div>
            </div>
          ))}
        </Card>
        <Card sx={{ padding: '18px 20px' }}>
          <div style={{ color: C.gh, fontWeight: 700, fontSize: 13, marginBottom: 13 }}>Model Activity — Live</div>
          {mdls.map((m) => (
            <div key={m.n} style={{ marginBottom: 11 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontSize: 12, color: C.gh }}>{m.n}</span>
                <div style={{ display: 'flex', gap: 7 }}>
                  <span style={{ fontSize: 10, color: C.am }}>{m.r.toLocaleString()} req/s</span>
                  <span style={{ fontSize: 10, color: C.cy }}>{m.la}ms</span>
                </div>
              </div>
              <PBar pct={Math.min((m.r / 5000) * 100, 100)} color={C.gr} h={3} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
