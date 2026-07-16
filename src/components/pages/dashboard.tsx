'use client';

import React from 'react';
import { C, FF } from '@/lib/constants';
import { Badge, Btn, Card, Sec, PBar, KPI, LiveDot } from '@/components/primitives';

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
    { n: 'Layer 1', label: 'Model Optimization', desc: 'Upload models for quantization, pruning, distillation', c: C.cy, sv: '$605K/mo' },
    { n: 'Layer 2', label: 'Prompt Optimization', desc: 'Token reduction · Redundancy removal', c: C.gr, sv: '$155K/mo' },
    { n: 'Layer 3', label: 'Smart Routing', desc: 'Complexity → model size matching', c: C.am, sv: '$405K/mo' },
    { n: 'Layer 4', label: 'Context Compression', desc: 'Semantic memory · History summarization', c: C.pu, sv: '$370K/mo' },
    { n: 'Layer 5', label: 'Inference Network', desc: 'GPU load balancing · Throughput optimization', c: C.bl, sv: '$1.14M/mo' },
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
          <div style={{ fontSize: 9, color: C.cy, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 3 }}>Efficiency Score</div>
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
          <div style={{ color: C.gh, fontWeight: 700, fontSize: 12 }}>5-Layer Optimization Engine — Live Status</div>
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
              <thead><tr style={{ background: C.sfH }}>{['Model', 'Strategy', 'Progress', 'Status', 'Savings'].map((h) => (
                <th key={h} style={{ padding: '8px 11px', textAlign: 'left', fontSize: 10, color: C.mu, textTransform: 'uppercase' }}>{h}</th>
              ))}</tr></thead>
              <tbody>{rec.map((j: any, i: number) => (
                <tr key={i} style={{ borderTop: `1px solid ${C.br}` }}>
                  <td style={{ padding: '10px 11px', color: C.gh, fontWeight: 500, fontSize: 13 }}>{j.modelName}</td>
                  <td style={{ padding: '8px 9px' }}><Badge c={C.pu}>{j.strategy.replace(/_/g, ' ')}</Badge></td>
                  <td style={{ padding: '8px 9px', minWidth: 85 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ flex: 1 }}><PBar pct={j.progress} color={j.status === 'completed' ? C.gr : C.cy} /></div>
                      <span style={{ fontSize: 9, color: C.mu }}>{j.progress}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '8px 9px' }}><Badge c={j.status === 'completed' ? C.gr : j.status === 'running' ? C.cy : j.status === 'failed' ? C.rd : C.am}>{j.status}</Badge></td>
                  <td style={{ padding: '8px 9px', color: C.gr, fontWeight: 700, fontSize: 12 }}>{j.status === 'completed' ? '$' + (j.savings / 1000).toFixed(0) + 'K/mo' : '—'}</td>
                </tr>
              ))}</tbody>
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
            { l: 'Compresor AI Layer', c: C.cy },
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
