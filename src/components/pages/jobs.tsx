'use client';

import React, { useState, useEffect, useRef } from 'react';
import { C, FF, API, ai } from '@/lib/constants';
import { Badge, Btn, Card, Sec, PBar, Inp, Sel, LiveDot } from '@/components/primitives';

// ── PAGE: COMPRESSION JOBS ─────────────────────────────────────────
export function PageJobs({
  jobs,
  setJobs,
}: {
  jobs: any[];
  setJobs: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const [sel, setSel] = useState<any | null>(null);
  const [aiL, setAiL] = useState(false);
  const [plan, setPlan] = useState('');
  const logRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [jobs]);

  useEffect(() => {
    const run = jobs.find((j) => j.status === 'running' && j.progress < 100);
    if (!run) return;
    const id = setInterval(() => {
      setJobs((prev: any[]) =>
        prev.map((j) => {
          if (j.id !== run.id) return j;
          const np = Math.min(j.progress + Math.floor(Math.random() * 5 + 1), 100);
          const lines = [
            `[${new Date().toLocaleTimeString()}] Progress: ${np}%`,
            np > 20 ? '[L1] Exporting model to ONNX format…' : null,
            np > 35 ? '[L2] Prompt analysis — 40% token reduction identified' : null,
            np > 50 ? '[L3] Routing classifier trained — simple queries → Phi-3 Mini' : null,
            np > 65 ? '[L4] Context compressor: 20,000 → 3,000 tokens (85% reduction)' : null,
            np > 80 ? '[L5] GPU reallocation: 840 idle GPUs reclaimed' : null,
            np === 100 ? '[SUCCESS] All 5 layers optimized — accuracy delta: -0.3%' : null,
          ].filter(Boolean);
          return {
            ...j,
            progress: np,
            status: np === 100 ? 'completed' : 'running',
            log: (j.log || '') + lines.join('\n') + '\n',
            savings: np === 100 ? Math.floor(Math.random() * 400 + 200) * 1000 : j.savings,
          };
        })
      );
    }, 1600);
    return () => clearInterval(id);
  }, [jobs, setJobs]);

  const startJob = (id: number) =>
    setJobs((prev: any[]) =>
      prev.map((j) =>
        j.id === id
          ? {
              ...j,
              status: 'running',
              progress: 0,
              log: '[System] Job dequeued — initializing 5-layer optimization pipeline…\n[L1] Connecting to GPU cluster via Ray…\n',
            }
          : j
      )
    );

  const FB =
    'ANALYSIS\nThis model shows inefficiencies across all 5 layers: GPU memory bottlenecks (L1), 38% token redundancy (L2), premium models handling simple queries (L3), 18,000-token conversation histories (L4), and 16.8% idle GPU resources (L5).\n\nLAYER 1 — MODEL OPTIMIZATION\nApply INT8 PTQ quantization via ONNX Runtime. Expected: 63% size reduction, -0.3% MMLU accuracy delta.\n\nLAYER 2 — PROMPT OPTIMIZATION\n38% token redundancy detected. Automated rewriting reduces avg 1,000 → 620 tokens. Same output, 38% fewer tokens billed.\n\nLAYER 3 — SMART ROUTING\nSimple queries (34%) → Phi-3 Mini. Medium (41%) → Llama 13B. Complex (25%) → Premium. 75% of traffic on cheaper models.\n\nLAYER 4 — CONTEXT COMPRESSION\nSemantic Memory Maps: avg 18,000 tokens → 2,800 tokens (85% reduction). Full conversation reconstructable on demand.\n\nLAYER 5 — INFERENCE NETWORK\n840 idle GPUs reclaimed. EU West: 91% → 72% util. Dynamic batching: BS=1 → BS=32. Latency: 120ms → 52ms.\n\nEXPECTED RESULTS\n- Model size: 63% reduction\n- Monthly savings: $1.44M/mo total across all 5 layers\n- Latency: 120ms → 52ms (2.3× speedup)\n- AI Efficiency Score™: 87 → 99/100\n\nACCURACY RISK\nExpected delta: -0.3% on MMLU. Keep embedding layers in FP16. All other layers zero accuracy risk.';

  const runClaude = async (job: any) => {
    setAiL(true);
    setPlan('');
    setSel(job);
    const p =
      'You are an AI infrastructure expert. Analyze this model across all 5 optimization layers.\nModel: ' +
      job.modelName +
      '\nParams: ' +
      job.params +
      '\nArch: ' +
      job.arch +
      '\nStrategy: ' +
      job.strategy +
      '\nGPU Logs: ' +
      (job.gpuLogs || 'N/A') +
      '\nLatency: ' +
      (job.latency || 'N/A') +
      '\nProvide: ANALYSIS, LAYER 1 — MODEL OPTIMIZATION, LAYER 2 — PROMPT OPTIMIZATION, LAYER 3 — SMART ROUTING, LAYER 4 — CONTEXT COMPRESSION, LAYER 5 — INFERENCE NETWORK, EXPECTED RESULTS, ACCURACY RISK.';
    const text = await ai(p, FB);
    let i = 0;
    const iv = setInterval(() => {
      i += 14;
      setPlan(text.slice(0, i));
      if (i >= text.length) {
        setPlan(text);
        clearInterval(iv);
      }
    }, 18);
    setAiL(false);
  };

  const selJ = sel ? jobs.find((j: any) => j.id === sel.id) || sel : null;

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Sidebar - job list */}
      <div
        style={{
          width: 300,
          borderRight: `1px solid ${C.br}`,
          overflowY: 'auto',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            padding: '12px 13px 9px',
            borderBottom: `1px solid ${C.br}`,
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: C.cy,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: 3,
            }}
          >
            5-Layer Job Queue
          </div>
          <div style={{ color: C.gh, fontWeight: 700, fontSize: 16, fontFamily: FF }}>
            Optimization Jobs
          </div>
        </div>
        {jobs.length === 0 && (
          <div
            style={{
              padding: '26px 13px',
              color: C.mu,
              fontSize: 11,
              textAlign: 'center',
            }}
          >
            No jobs yet. Upload a model to get started.
          </div>
        )}
        {[...jobs]
          .reverse()
          .map((j: any) => (
            <div
              key={j.id}
              onClick={() => {
                setSel(j);
                setPlan('');
              }}
              style={{
                padding: '13px 16px',
                borderBottom: `1px solid ${C.br}`,
                cursor: 'pointer',
                background: sel?.id === j.id ? C.cy + '0A' : 'transparent',
                borderLeft:
                  sel?.id === j.id ? '2px solid ' + C.cy : '2px solid transparent',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}
              >
                <div style={{ color: C.gh, fontWeight: 600, fontSize: 13 }}>
                  {j.modelName}
                </div>
                <Badge
                  c={
                    j.status === 'completed'
                      ? C.gr
                      : j.status === 'running'
                      ? C.cy
                      : j.status === 'failed'
                      ? C.rd
                      : C.am
                  }
                >
                  {j.status}
                </Badge>
              </div>
              <div style={{ fontSize: 11, color: C.mu, marginBottom: 6 }}>
                {j.strategy.replace(/_/g, ' ')} · {j.priority}
              </div>
              <PBar
                pct={j.progress}
                color={j.status === 'completed' ? C.gr : C.cy}
                h={3}
              />
              <div style={{ fontSize: 10, color: C.mu, marginTop: 3 }}>
                {j.progress}%
              </div>
            </div>
          ))}
      </div>

      {/* Main detail panel */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {!selJ ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: C.mu,
              fontSize: 12,
            }}
          >
            Select a job to view details and run Claude AI analysis
          </div>
        ) : (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: 13,
              }}
            >
              <div>
                <h2
                  style={{
                    color: C.gh,
                    fontFamily: FF,
                    margin: '0 0 7px',
                    fontSize: 20,
                  }}
                >
                  {selJ.modelName}
                </h2>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <Badge c={C.pu}>{selJ.strategy.replace(/_/g, ' ')}</Badge>
                  <Badge c={C.am}>{selJ.priority} priority</Badge>
                  <Badge
                    c={
                      selJ.status === 'completed'
                        ? C.gr
                        : selJ.status === 'running'
                        ? C.cy
                        : selJ.status === 'failed'
                        ? C.rd
                        : C.am
                    }
                  >
                    {selJ.status}
                  </Badge>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                {selJ.status === 'pending' && (
                  <Btn onClick={() => startJob(selJ.id)} sm>
                    ▶ Start Job
                  </Btn>
                )}
                <Btn
                  v="amber"
                  sm
                  onClick={() => runClaude(selJ)}
                  disabled={aiL}
                >
                  {aiL ? 'Analyzing…' : '✦ Claude AI 5-Layer Analysis'}
                </Btn>
              </div>
            </div>

            <Card sx={{ padding: '13px 15px', marginBottom: 11 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 7,
                }}
              >
                <span style={{ color: C.gh, fontWeight: 600, fontSize: 13 }}>
                  Execution Progress
                </span>
                <span style={{ color: C.cy, fontWeight: 700, fontFamily: FF }}>
                  {selJ.progress}%
                </span>
              </div>
              <PBar
                pct={selJ.progress}
                color={selJ.status === 'completed' ? C.gr : C.cy}
                h={7}
              />
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  marginTop: 10,
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { l: 'Parameters', v: selJ.params },
                  { l: 'Architecture', v: selJ.arch },
                  { l: 'Priority', v: selJ.priority },
                  {
                    l: 'Savings',
                    v:
                      selJ.status === 'completed'
                        ? '$' + (selJ.savings / 1000).toFixed(0) + 'K/mo'
                        : 'Pending',
                  },
                ].map((s) => (
                  <div key={s.l}>
                    <div
                      style={{
                        fontSize: 10,
                        color: C.mu,
                        textTransform: 'uppercase',
                      }}
                    >
                      {s.l}
                    </div>
                    <div
                      style={{
                        color: C.gh,
                        fontWeight: 600,
                        fontSize: 13,
                      }}
                    >
                      {s.v}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card sx={{ marginBottom: 11 }}>
              <div
                style={{
                  padding: '11px 14px',
                  borderBottom: `1px solid ${C.br}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {selJ.status === 'running' && <LiveDot />}
                <span style={{ color: C.gh, fontWeight: 600, fontSize: 11 }}>
                  Execution Logs — 5-Layer Pipeline
                </span>
              </div>
              <pre
                ref={logRef}
                style={{
                  margin: 0,
                  padding: '11px 13px',
                  fontFamily: 'monospace',
                  fontSize: 11,
                  color: C.gr,
                  background: C.bg,
                  borderRadius: '0 0 12px 12px',
                  maxHeight: 145,
                  overflowY: 'auto',
                  lineHeight: 1.65,
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selJ.log ||
                  '// Logs appear when job starts. Click ▶ Start Job to begin.'}
              </pre>
            </Card>

            {(aiL || plan) && (
              <Card glow={C.am}>
                <div
                  style={{
                    padding: '10px 14px',
                    borderBottom: `1px solid ${C.am}30`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 7,
                  }}
                >
                  <span style={{ color: C.am, fontSize: 13 }}>✦</span>
                  <span
                    style={{
                      color: C.am,
                      fontWeight: 700,
                      fontSize: 14,
                    }}
                  >
                    Claude AI — 5-Layer Optimization Strategy
                  </span>
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: '13px',
                    fontFamily: FF,
                    fontSize: 12,
                    color: C.gh,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.9,
                    background: 'transparent',
                    maxHeight: 360,
                    overflowY: 'auto',
                  }}
                >
                  {aiL && !plan
                    ? 'Claude is analyzing all 5 optimization layers…'
                    : plan}
                  {aiL && <span style={{ color: C.am }}>▌</span>}
                </pre>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── PAGE: UPLOAD MODEL ─────────────────────────────────────────────
export function PageUpload({
  onJobCreated,
}: {
  onJobCreated: (data: any) => void;
}) {
  const [mn, setMn] = useState('');
  const [par, setPar] = useState('');
  const [arch, setArch] = useState('transformer');
  const [strat, setStrat] = useState('quantization_int8');
  const [prio, setPrio] = useState('normal');
  const [gl, setGl] = useState('');
  const [lat, setLat] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const strats = [
    { v: 'quantization_int8', l: 'L1 — Quantization: FP16 → INT8' },
    { v: 'quantization_int4', l: 'L1 — Quantization: FP32 → INT4' },
    { v: 'pruning', l: 'L1 — Pruning: Remove redundant weights' },
    { v: 'distillation', l: 'L1 — Knowledge Distillation: 70B → 13B' },
    { v: 'prompt_optimization', l: 'L2 — Prompt Optimization: Token reduction' },
    { v: 'smart_routing', l: 'L3 — Smart Routing: Complexity matching' },
    { v: 'context_compression', l: 'L4 — Context Compression: History summarization' },
    { v: 'graph_optimization', l: 'L5 — Inference: GPU & layer fusion' },
    { v: 'full_pipeline', l: 'All 5 Layers — Complete efficiency pipeline' },
  ];

  const submit = () => {
    if (!mn || !par) return;
    setLoading(true);
    setTimeout(() => {
      onJobCreated({
        modelName: mn,
        params: par,
        arch,
        strategy: strat,
        priority: prio,
        gpuLogs: gl,
        latency: lat,
      });
      setDone(true);
      setLoading(false);
    }, 600);
  };

  if (done) {
    return (
      <div
        style={{
          padding: 26,
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{ fontSize: 48, marginBottom: 14 }}>✅</div>
          <h2 style={{ color: C.gh, fontFamily: FF, marginBottom: 10 }}>
            Job Queued Successfully
          </h2>
          <p style={{ color: C.mL, lineHeight: 1.75, marginBottom: 20 }}>
            Claude AI is now analyzing your model across all 5 optimization layers.
          </p>
          <Btn
            onClick={() => {
              setDone(false);
              setMn('');
              setPar('');
              setGl('');
              setLat('');
            }}
          >
            Upload Another Model
          </Btn>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="Admin Control"
        title="Upload Model for 5-Layer Optimization"
        sub="Provide model details and context. Claude AI designs the strategy across all 5 layers."
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 860 }}>
        <Card sx={{ padding: '20px 18px' }}>
          <div
            style={{
              fontSize: 10,
              color: C.cy,
              fontWeight: 700,
              marginBottom: 11,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            Model Details
          </div>
          <Inp
            label="Model Name"
            value={mn}
            onChange={(e) => setMn(e.target.value)}
            placeholder="e.g. Llama 3 70B"
          />
          <Inp
            label="Parameter Count"
            value={par}
            onChange={(e) => setPar(e.target.value)}
            placeholder="e.g. 70B, 13B, 7B"
          />
          <Sel
            label="Architecture"
            value={arch}
            onChange={(e) => setArch(e.target.value)}
            options={[
              { v: 'transformer', l: 'Transformer (GPT/Llama style)' },
              { v: 'moe', l: 'Mixture of Experts (MoE)' },
              { v: 'diffusion', l: 'Diffusion Model' },
              { v: 'encoder', l: 'Encoder-only (BERT)' },
              { v: 'multimodal', l: 'Multimodal (Vision + Text)' },
              { v: 'ssm', l: 'State Space Model (Mamba)' },
            ]}
          />
          <Sel
            label="Optimization Strategy"
            value={strat}
            onChange={(e) => setStrat(e.target.value)}
            options={strats}
          />
          <Sel
            label="Job Priority"
            value={prio}
            onChange={(e) => setPrio(e.target.value)}
            options={[
              { v: 'low', l: 'Low — Queue when resources free' },
              { v: 'normal', l: 'Normal — Standard scheduling' },
              { v: 'high', l: 'High — Prioritize GPU allocation' },
              { v: 'critical', l: 'Critical — Immediate execution' },
            ]}
          />
        </Card>
        <Card sx={{ padding: '20px 18px' }}>
          <div
            style={{
              fontSize: 10,
              color: C.am,
              fontWeight: 700,
              marginBottom: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
            }}
          >
            ✦ Context for Claude AI
          </div>
          <div style={{ fontSize: 10, color: C.mu, marginBottom: 12, lineHeight: 1.6 }}>
            Claude analyzes this data across all 5 layers to design the optimal strategy.
          </div>
          <div style={{ marginBottom: 11 }}>
            <div
              style={{
                fontSize: 10,
                color: C.mL,
                marginBottom: 4,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              GPU Utilization Logs
            </div>
            <textarea
              value={gl}
              onChange={(e) => setGl(e.target.value)}
              placeholder={'GPU-0: 94% mem, 82% util\nGPU-1: 91% mem, 78% util\n...'}
              style={{
                width: '100%',
                background: C.sfH,
                border: `1px solid ${C.br}`,
                borderRadius: 7,
                padding: '9px 12px',
                color: C.gh,
                fontSize: 11,
                fontFamily: 'monospace',
                resize: 'vertical',
                minHeight: 75,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ marginBottom: 13 }}>
            <div
              style={{
                fontSize: 10,
                color: C.mL,
                marginBottom: 4,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              Latency / Performance Data
            </div>
            <textarea
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder={'p50: 120ms, p99: 480ms\nThroughput: 42 req/s'}
              style={{
                width: '100%',
                background: C.sfH,
                border: `1px solid ${C.br}`,
                borderRadius: 7,
                padding: '9px 12px',
                color: C.gh,
                fontSize: 11,
                fontFamily: 'monospace',
                resize: 'vertical',
                minHeight: 75,
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>
          <Btn
            full
            onClick={submit}
            disabled={loading || !mn || !par}
          >
            {loading ? 'Queuing Job…' : 'Queue 5-Layer Optimization →'}
          </Btn>
        </Card>
      </div>
    </div>
  );
}

// ── PAGE: OPTIMIZATION CENTER ──────────────────────────────────────
export function PageOpt() {
  const [tab, setTab] = useState('Layer 1 — Model');

  const ALL: Record<string, any[]> = {
    'Layer 1 — Model': [
      { m: 'Llama 3 70B', cur: '140 GB (FP32)', opt: '52 GB (INT4)', pct: 63, t: 'Quantization', sv: '$420K/mo', p: 'critical' },
      { m: 'Mistral 8x7B', cur: '92 GB (FP16)', opt: '46 GB (INT8)', pct: 50, t: 'Quantization', sv: '$210K/mo', p: 'high' },
      { m: 'Falcon 40B', cur: '80 GB (FP32)', opt: '22 GB (INT4)', pct: 73, t: 'Pruning+Quant', sv: '$185K/mo', p: 'high' },
      { m: 'Llama 3 70B → 13B', cur: '140 GB / 70B', opt: '26 GB / 13B', pct: 81, t: 'Distillation', sv: '$380K/mo', p: 'critical' },
    ],
    'Layer 2 — Prompt': [
      { m: 'All System Prompts', cur: 'avg 1,000 tokens', opt: 'avg 600 tokens', pct: 40, t: 'Token Reduction', sv: '$85K/mo', p: 'high' },
      { m: 'Few-shot Examples', cur: 'avg 800 tokens', opt: 'avg 320 tokens', pct: 60, t: 'Example Pruning', sv: '$42K/mo', p: 'medium' },
      { m: 'Instruction Preambles', cur: 'avg 200 tokens', opt: 'avg 45 tokens', pct: 78, t: 'Redundancy Removal', sv: '$28K/mo', p: 'medium' },
    ],
    'Layer 3 — Routing': [
      { m: 'Simple Queries (34%)', cur: 'GPT-4 class', opt: 'Phi-3 Mini', pct: 0, t: 'Smart Route', sv: '$180K/mo', p: 'critical' },
      { m: 'Medium Queries (41%)', cur: 'Llama 3 70B', opt: 'Llama 3 13B', pct: 0, t: 'Smart Route', sv: '$130K/mo', p: 'high' },
      { m: 'Multi-Provider', cur: 'Fixed provider', opt: 'Cheapest equivalent', pct: 0, t: 'Cost Routing', sv: '$95K/mo', p: 'high' },
    ],
    'Layer 4 — Context': [
      { m: 'Chat Histories', cur: '20,000 tokens avg', opt: '3,000 tokens avg', pct: 85, t: 'Summarization', sv: '$240K/mo', p: 'critical' },
      { m: 'RAG Context Windows', cur: '8,000 tokens avg', opt: '2,400 tokens avg', pct: 70, t: 'Semantic Filter', sv: '$82K/mo', p: 'high' },
      { m: 'Embedding Store', cur: '18 TB raw', opt: '7.2 TB compressed', pct: 60, t: 'Vector Compress', sv: '$48K/mo', p: 'medium' },
    ],
    'Layer 5 — Inference': [
      { m: 'Training Cluster A', cur: '5,000 GPUs', opt: '3,300 GPUs', pct: 34, t: 'GPU Realloc', sv: '$640K/mo', p: 'critical' },
      { m: 'EU West Cluster', cur: '91% utilization', opt: '72% rebalanced', pct: 0, t: 'Load Balance', sv: '$180K/mo', p: 'critical' },
      { m: 'Batch Size — All', cur: 'BS=1 (default)', opt: 'BS=32 (dynamic)', pct: 0, t: 'Batch Tuning', sv: '$320K/mo', p: 'high' },
    ],
  };

  const tabs = [
    { v: 'Layer 1 — Model', l: 'Layer 1 — Model' },
    { v: 'Layer 2 — Prompt', l: 'Layer 2 — Prompt' },
    { v: 'Layer 3 — Routing', l: 'Layer 3 — Routing' },
    { v: 'Layer 4 — Context', l: 'Layer 4 — Context' },
    { v: 'Layer 5 — Inference', l: 'Layer 5 — Inference' },
  ];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="5-Layer Optimization Center"
        title="Active Recommendations"
        sub="Everyone else solves one piece. Compressor AI optimizes everything between: AI Model → User Request → GPU → Response. One platform."
      />
      <div
        style={{
          background: C.cy + '0A',
          border: `1px solid ${C.cy}30`,
          borderRadius: 10,
          padding: '13px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 18,
        }}
      >
        <div>
          <div style={{ fontSize: 9, color: C.cy, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>
            Total Savings — All 5 Layers
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.gh, fontFamily: FF }}>$2.675M/mo</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Btn v="ghost" sm>Export to CI/CD</Btn>
          <Btn sm>Apply All Critical →</Btn>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 3, background: C.sfH, border: `1px solid ${C.br}`, borderRadius: 8, padding: 4, width: 'fit-content', flexWrap: 'wrap', marginBottom: 13 }}>
        {tabs.map((t) => (
          <button
            key={t.v}
            onClick={() => setTab(t.v)}
            style={{
              padding: '7px 16px',
              borderRadius: 6,
              border: tab === t.v ? `1px solid ${C.cy}40` : '1px solid transparent',
              background: tab === t.v ? C.cy + '18' : 'transparent',
              color: tab === t.v ? C.cy : C.mu,
              fontFamily: FF,
              fontWeight: 600,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            {t.l}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 13 }}>
        {ALL[tab]?.map((r, i) => (
          <Card key={i} sx={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <div>
                <div style={{ color: C.gh, fontWeight: 600, fontSize: 13, marginBottom: 5 }}>
                  {r.m}
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <Badge c={C.pu}>{r.t}</Badge>
                  <Badge c={r.p === 'critical' ? C.rd : r.p === 'high' ? C.am : C.gr}>
                    {r.p}
                  </Badge>
                </div>
              </div>
              {r.pct > 0 && (
                <div style={{ fontSize: 20, fontWeight: 800, color: C.gr, fontFamily: FF }}>
                  {r.pct}%
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 11, marginBottom: 9 }}>
              <div>
                <div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase' }}>
                  Current
                </div>
                <div style={{ color: C.gh, fontWeight: 500, fontSize: 12 }}>{r.cur}</div>
              </div>
              <div style={{ color: C.mu, alignSelf: 'center', fontSize: 12 }}>→</div>
              <div>
                <div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase' }}>
                  Optimized
                </div>
                <div style={{ color: C.cy, fontWeight: 600, fontSize: 12 }}>{r.opt}</div>
              </div>
            </div>
            {r.pct > 0 && <PBar pct={r.pct} color={C.gr} h={4} />}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 9 }}>
              <div style={{ fontSize: 13, color: C.am, fontWeight: 700 }}>{r.sv}</div>
              <Btn sm v="ghost">Apply →</Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
