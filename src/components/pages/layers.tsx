'use client';

import React, { useState, useEffect } from 'react';
import { C, FF } from '@/lib/constants';
import { Badge, Btn, Card, Sec, PBar } from '@/components/primitives';
import { IconCheck, IconEdit, IconShuffle, IconCompress, IconNetwork, IconBrain } from '@/components/icons';

// ── PAGE: PROMPT OPTIMIZATION (L2) ─────────────────────────────────
export function PagePromptOptimizer({ onJobCreated }: { onJobCreated: (data: any) => void }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const est = (t: string) => Math.ceil(t.split(/\s+/).filter(Boolean).length * 1.3);
  const saved = Math.round(est(prompt) * 0.38);

  const submit = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onJobCreated({ modelName: 'Prompt Optimization', strategy: 'prompt_optimization', params: prompt.slice(0, 100), priority: 'normal', arch: 'prompt' });
      setDone(true); setLoading(false);
    }, 600);
  };

  if (done) return (
    <div style={{ padding: 26, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 460 }}>
        <IconCheck size={48} color={C.gr} />
        <h2 style={{ color: C.gh, fontFamily: FF, marginBottom: 10 }}>Prompt Optimized</h2>
        <p style={{ color: C.mL, lineHeight: 1.75, marginBottom: 20 }}>Your prompt has been queued for Layer 2 optimization. Check Compression Jobs for progress.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Original Tokens</div><div style={{ fontSize: 22, fontWeight: 800, color: C.rd, fontFamily: FF }}>{est(prompt).toLocaleString()}</div></Card>
          <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Optimized Tokens</div><div style={{ fontSize: 22, fontWeight: 800, color: C.gr, fontFamily: FF }}>{(est(prompt) - saved).toLocaleString()}</div></Card>
          <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Tokens Saved</div><div style={{ fontSize: 22, fontWeight: 800, color: C.cy, fontFamily: FF }}>{saved.toLocaleString()}</div></Card>
          <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Reduction</div><div style={{ fontSize: 22, fontWeight: 800, color: C.am, fontFamily: FF }}>38%</div></Card>
        </div>
        <Btn onClick={() => { setDone(false); setPrompt(''); }}>Optimize Another</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec ey="Layer 2" title="Prompt Optimization Engine" sub="Paste a prompt. Compresor AI rewrites it to be concise while preserving meaning." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 980 }}>
        <Card sx={{ padding: '20px 18px' }}>
          <div style={{ fontSize: 10, color: C.cy, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <IconEdit size={12} color={C.cy} /> Input Prompt
          </div>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder={'Please carefully analyze the following information and provide a very detailed response…'}
            style={{ width: '100%', background: C.sfH, border: `1px solid ${C.br}`, borderRadius: 7, padding: '12px 14px', color: C.gh, fontSize: 13, fontFamily: FF, resize: 'vertical', minHeight: 180, outline: 'none', boxSizing: 'border-box', lineHeight: 1.7 }}
          />
          <div style={{ fontSize: 11, color: C.mu, marginTop: 6, marginBottom: 12 }}>{prompt ? `~${est(prompt)} estimated tokens` : ''}</div>
          <Btn full onClick={submit} disabled={loading || !prompt.trim()}>{loading ? 'Optimizing…' : 'Optimize Prompt →'}</Btn>
        </Card>
        <Card sx={{ padding: '20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: C.mu }}>
            <IconBrain size={40} color={C.cy} />
            <div style={{ fontSize: 13, marginTop: 12 }}>Paste a prompt and click Optimize</div>
            <div style={{ fontSize: 11, marginTop: 8, color: C.mL }}>Results appear in Compression Jobs</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── PAGE: SMART ROUTING (L3) ──────────────────────────────────────
export function PageSmartRouting({ onJobCreated }: { onJobCreated: (data: any) => void }) {
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const score = (text: string) => {
    const words = text.split(/\s+/).filter(Boolean).length;
    const hasCode = /```|function |class |def |import |SELECT |FROM /i.test(text);
    const hasDeep = /analyz|compar|evaluat|critic|summariz|explain|research/i.test(text);
    const hasMulti = (text.match(/\?/g) || []).length > 2;
    let s = Math.min(words / 400, 0.5);
    if (hasCode) s += 0.25;
    if (hasDeep) s += 0.15;
    if (hasMulti) s += 0.10;
    return Math.min(s, 1.0);
  };

  const decide = (c: number) => {
    if (c <= 0.33) return { model: 'Phi-3 Mini', provider: 'Groq', cost: '$0.00008/1K', reason: 'Simple task' };
    if (c <= 0.66) return { model: 'Llama 3 13B', provider: 'Together', cost: '$0.0003/1K', reason: 'Moderate complexity' };
    return { model: 'Claude Sonnet 4', provider: 'Anthropic', cost: '$0.003/1K', reason: 'High complexity' };
  };

  const c = task.trim() ? score(task) : 0;
  const r = decide(c);
  const savings = Math.round(((0.005 - parseFloat(r.cost.replace('$', '').replace('/1K', ''))) / 0.005) * 100);

  const submit = () => {
    if (!task.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onJobCreated({ modelName: 'Smart Routing', strategy: 'smart_routing', params: task.slice(0, 100), priority: 'normal', arch: 'routing' });
      setDone(true); setLoading(false);
    }, 600);
  };

  if (done) return (
    <div style={{ padding: 26, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <IconCheck size={48} color={C.gr} />
        <h2 style={{ color: C.gh, fontFamily: FF, marginBottom: 10 }}>Request Routed</h2>
        <p style={{ color: C.mL, lineHeight: 1.75, marginBottom: 20 }}>Your request was routed to the optimal model. Check Compression Jobs for progress.</p>
        <Card sx={{ padding: '18px', marginBottom: 16 }} glow={C.cy}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>Routed To</div><div style={{ color: C.cy, fontWeight: 700, fontSize: 16, fontFamily: FF }}>{r.model}</div></div>
            <div><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>Provider</div><div style={{ color: C.gh, fontWeight: 600, fontSize: 16, fontFamily: FF }}>{r.provider}</div></div>
            <div><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>Cost</div><div style={{ color: C.gr, fontWeight: 700, fontSize: 16, fontFamily: FF }}>{r.cost}</div></div>
            <div><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>Savings vs GPT-4</div><div style={{ color: C.am, fontWeight: 700, fontSize: 16, fontFamily: FF }}>{savings}%</div></div>
          </div>
          <div style={{ marginTop: 12, padding: '9px 12px', background: C.sfH, borderRadius: 7, fontSize: 11, color: C.mL }}>Decision: {r.reason}</div>
        </Card>
        <Btn onClick={() => { setDone(false); setTask(''); }}>Route Another</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec ey="Layer 3" title="Smart Model Routing Engine" sub="Submit a task. The system analyzes complexity and routes to the most cost-effective model." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 980 }}>
        <Card sx={{ padding: '20px 18px' }}>
          <div style={{ fontSize: 10, color: C.cy, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <IconShuffle size={12} color={C.cy} /> Task Description
          </div>
          <textarea value={task} onChange={(e) => setTask(e.target.value)}
            placeholder={'Write a Python function to calculate fibonacci numbers…'}
            style={{ width: '100%', background: C.sfH, border: `1px solid ${C.br}`, borderRadius: 7, padding: '12px 14px', color: C.gh, fontSize: 13, fontFamily: FF, resize: 'vertical', minHeight: 120, outline: 'none', boxSizing: 'border-box', lineHeight: 1.7 }}
          />
          <div style={{ fontSize: 11, color: C.mu, marginTop: 6, marginBottom: 12 }}>Complexity: {(c * 100).toFixed(0)}/100</div>
          <Btn full onClick={submit} disabled={loading || !task.trim()}>{loading ? 'Routing…' : 'Route Request →'}</Btn>
        </Card>
        <Card sx={{ padding: '20px 18px' }}>
          <div style={{ fontSize: 10, color: C.cy, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Routing Preview</div>
          {task.trim() ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>Model</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.cy, fontFamily: FF }}>{r.model}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>Provider</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.gh }}>{r.provider}</div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>Why</div>
                <div style={{ fontSize: 12, color: C.mL }}>{r.reason}</div>
              </div>
              <div style={{ background: C.sfH, borderRadius: 7, padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: C.mu }}>GPT-4 cost</span>
                  <span style={{ fontSize: 10, color: C.rd, fontWeight: 700 }}>$0.005/1K tokens</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: C.mu }}>{r.model} cost</span>
                  <span style={{ fontSize: 10, color: C.gr, fontWeight: 700 }}>{r.cost}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${C.br}`, paddingTop: 4 }}>
                  <span style={{ fontSize: 10, color: C.mu, fontWeight: 700 }}>Savings</span>
                  <span style={{ fontSize: 11, color: C.am, fontWeight: 800 }}>{savings}% per 1K tokens</span>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', color: C.mu, padding: '20px 0' }}>
              <IconBrain size={32} color={C.mu} />
              <div style={{ fontSize: 12, marginTop: 8 }}>Enter a task below to preview routing</div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ── PAGE: CONTEXT COMPRESSION (L4) ────────────────────────────────
export function PageContextCompression({ onJobCreated }: { onJobCreated: (data: any) => void }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [showComp, setShowComp] = useState(false);

  const est = (t: string) => Math.ceil(t.split(/\s+/).filter(Boolean).length * 1.3);
  const orig = est(text);
  const comp = Math.round(orig * 0.15);

  const getCompressed = (t: string) => {
    const lines = t.split('\n').filter(Boolean);
    if (lines.length < 3) return '[Compressed] Key points extracted.';
    return lines.slice(0, Math.max(1, Math.round(lines.length * 0.2))).join('\n') + `\n\n[... ${lines.length - Math.max(1, Math.round(lines.length * 0.2))} more items compressed]`;
  };

  const submit = () => {
    if (!text.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onJobCreated({ modelName: 'Context Compression', strategy: 'context_compression', params: text.slice(0, 100), priority: 'normal', arch: 'context' });
      setDone(true); setLoading(false);
    }, 600);
  };

  if (done) return (
    <div style={{ padding: 26, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', overflowY: 'auto' }}>
      <div style={{ textAlign: 'center', maxWidth: 560 }}>
        <IconCheck size={48} color={C.gr} />
        <h2 style={{ color: C.gh, fontFamily: FF, marginBottom: 10 }}>Context Compressed</h2>
        <p style={{ color: C.mL, lineHeight: 1.75, marginBottom: 20 }}>Queued for Layer 4 compression. Check Compression Jobs for progress.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 16 }}>
          <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Original</div><div style={{ fontSize: 22, fontWeight: 800, color: C.rd, fontFamily: FF }}>{orig.toLocaleString()}</div></Card>
          <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Compressed</div><div style={{ fontSize: 22, fontWeight: 800, color: C.gr, fontFamily: FF }}>{comp.toLocaleString()}</div></Card>
          <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Reduction</div><div style={{ fontSize: 22, fontWeight: 800, color: C.cy, fontFamily: FF }}>85%</div></Card>
        </div>
        <Card sx={{ padding: '14px', marginBottom: 16, textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: C.gh, fontWeight: 600 }}>{showComp ? 'Compressed Output' : 'Original'}</span>
            <Btn sm v="ghost" onClick={() => setShowComp(!showComp)}>{showComp ? 'Show Original' : 'Show Compressed'}</Btn>
          </div>
          <pre style={{ margin: 0, background: C.bg, border: `1px solid ${C.br}`, borderRadius: 7, padding: '10px', fontSize: 11, color: C.gh, maxHeight: 150, overflowY: 'auto', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {showComp ? getCompressed(text) : text}
          </pre>
        </Card>
        <Btn onClick={() => { setDone(false); setText(''); setShowComp(false); }}>Compress Another</Btn>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec ey="Layer 4" title="Context Compression Engine" sub="Paste a long conversation or document. Compresor AI compresses it while preserving key information." />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 980 }}>
        <Card sx={{ padding: '20px 18px' }}>
          <div style={{ fontSize: 10, color: C.cy, fontWeight: 700, marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            <IconCompress size={12} color={C.cy} /> Conversation / Document
          </div>
          <textarea value={text} onChange={(e) => setText(e.target.value)}
            placeholder={'User: Can you help me with...\nAssistant: Sure, let me...'}
            style={{ width: '100%', background: C.sfH, border: `1px solid ${C.br}`, borderRadius: 7, padding: '12px 14px', color: C.gh, fontSize: 13, fontFamily: FF, resize: 'vertical', minHeight: 180, outline: 'none', boxSizing: 'border-box', lineHeight: 1.7 }}
          />
          <div style={{ fontSize: 11, color: C.mu, marginTop: 6, marginBottom: 12 }}>{text ? `~${orig.toLocaleString()} tokens → ~${comp.toLocaleString()} (85% reduction)` : ''}</div>
          <Btn full onClick={submit} disabled={loading || !text.trim()}>{loading ? 'Compressing…' : 'Compress Context →'}</Btn>
        </Card>
        <Card sx={{ padding: '20px 18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: C.mu }}>
            <IconCompress size={40} color={C.pu} />
            <div style={{ fontSize: 13, marginTop: 12 }}>Paste a conversation on the left</div>
            <div style={{ fontSize: 11, marginTop: 8, color: C.mL }}>Typical compression: 85% token reduction</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── PAGE: INFERENCE NETWORK (L5) ──────────────────────────────────
export function PageInferenceNet({ onJobCreated }: { onJobCreated: (data: any) => void }) {
  const [phase, setPhase] = useState<'idle' | 'rebalancing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (phase !== 'rebalancing') return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          setPhase('done');
          onJobCreated({ modelName: 'Inference Network', strategy: 'inference_rebalance', params: 'GPU Rebalance', priority: 'high', arch: 'inference' });
          return 100;
        }
        return Math.min(p + Math.floor(Math.random() * 6 + 3), 100);
      });
    }, 300);
    return () => clearInterval(id);
  }, [phase, onJobCreated]);

  const j = (base: number, r: number) => base + Math.floor(Math.sin(tick * 0.8 + base) * r);

  const beforeNodes = [
    { id: 'ue', l: 'US East', u: 82, m: 78, s: 'healthy' as const },
    { id: 'uw', l: 'US West', u: 69, m: 65, s: 'healthy' as const },
    { id: 'ew', l: 'EU West', u: 91, m: 88, s: 'warning' as const },
    { id: 'ap', l: 'AP Southeast', u: 55, m: 51, s: 'healthy' as const },
  ];
  const afterNodes = [
    { id: 'ue', l: 'US East', u: 74, m: 70, s: 'healthy' as const },
    { id: 'uw', l: 'US West', u: 72, m: 68, s: 'healthy' as const },
    { id: 'ew', l: 'EU West', u: 72, m: 68, s: 'healthy' as const },
    { id: 'ap', l: 'AP Southeast', u: 68, m: 64, s: 'healthy' as const },
  ];

  const nodes = phase === 'done' ? afterNodes : beforeNodes.map(n => ({ ...n, u: j(n.u, phase === 'rebalancing' ? 8 : 2), m: j(n.m, 2) }));
  const avgBefore = (beforeNodes.reduce((a, n) => a + n.u, 0) / beforeNodes.length).toFixed(0);
  const avgAfter = (afterNodes.reduce((a, n) => a + n.u, 0) / afterNodes.length).toFixed(0);

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec ey="Layer 5" title="Inference Network" sub="Monitor GPU utilization across regions and simulate load rebalancing to optimize cost and throughput." />

      {phase === 'idle' && (
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <IconNetwork size={48} color={C.cy} />
          <div style={{ color: C.gh, fontSize: 16, fontWeight: 700, marginTop: 12, marginBottom: 24 }}>Simulate load rebalancing across GPU clusters.</div>
          <Btn onClick={() => setPhase('rebalancing')} sx={{ fontSize: 14, padding: '12px 34px' }}>Simulate Rebalance →</Btn>
        </div>
      )}

      {(phase === 'rebalancing' || phase === 'done') && (
        <>
          {phase === 'rebalancing' && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 11, color: C.cy, fontWeight: 700 }}>Rebalancing GPU Load</span>
                <span style={{ fontSize: 11, color: C.cy, fontWeight: 700 }}>{progress}%</span>
              </div>
              <PBar pct={progress} color={C.cy} h={6} />
            </div>
          )}

          {phase === 'done' && (
            <div style={{ background: C.gr + '10', border: `1px solid ${C.gr}30`, borderRadius: 10, padding: '13px 18px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ fontSize: 9, color: C.gr, textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 3 }}>Rebalance Complete</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: C.gh, fontFamily: FF }}>Load Redistributed</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: C.mu }}>Avg Utilization</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.gr, fontFamily: FF }}>{avgBefore}% → {avgAfter}%</div>
              </div>
            </div>
          )}

          <Card sx={{ padding: '18px 20px' }}>
            <div style={{ color: C.gh, fontWeight: 700, fontSize: 13, marginBottom: 13 }}>GPU Cluster {phase === 'done' ? '(After Rebalance)' : '(Live)'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {nodes.map((n) => (
                <div key={n.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: C.gh }}>{n.l}</span>
                    <Badge c={n.s === 'warning' ? C.am : C.gr}>{n.s}</Badge>
                  </div>
                  <div style={{ fontSize: 10, color: C.mu, marginBottom: 2 }}>GPU UTIL</div>
                  <PBar pct={n.u} color={n.u > 85 ? C.rd : C.cy} h={4} />
                  <div style={{ fontSize: 9, color: C.mu, marginTop: 2 }}>{n.u}%</div>
                </div>
              ))}
            </div>
          </Card>

          {phase === 'done' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginTop: 14 }}>
                <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Total GPUs</div><div style={{ fontSize: 20, fontWeight: 800, color: C.gh, fontFamily: FF }}>5,000</div></Card>
                <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Latency</div><div style={{ fontSize: 20, fontWeight: 800, color: C.cy, fontFamily: FF }}>120ms → 82ms</div></Card>
                <Card sx={{ padding: '14px' }}><div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>Throughput</div><div style={{ fontSize: 20, fontWeight: 800, color: C.am, fontFamily: FF }}>42 → 89 req/s</div></Card>
              </div>
              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <Btn onClick={() => setPhase('idle')} v="ghost" sm>Run Again</Btn>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
