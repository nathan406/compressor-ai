'use client';

import React, { useState } from 'react';
import { C, FF } from '@/lib/constants';
import { Badge, Btn, Card, Sec, KPI } from '@/components/primitives';

// ── PAGE: INTEGRATIONS ─────────────────────────────────────────────
export function PageIntegrations() {
  const [conn, setConn] = useState([
    'Kubernetes',
    'AWS',
    'Hugging Face',
    'PyTorch',
    'ONNX Runtime',
    'Prometheus',
  ]);

  const groups = [
    {
      cat: 'AI Providers — Universal Gateway',
      items: [
        { n: 'OpenAI', d: 'GPT-4, GPT-4o, o1 — via Universal Gateway', ic: '🟢' },
        { n: 'Anthropic', d: 'Claude 3.5, Claude 4 — via Universal Gateway', ic: '🔵' },
        { n: 'Google Gemini', d: 'Gemini Pro, Ultra — via Universal Gateway', ic: '🟡' },
        { n: 'Mistral', d: 'Mistral 7B, 8x7B — via Universal Gateway', ic: '🟣' },
        { n: 'DeepSeek', d: 'DeepSeek V2, Coder — via Universal Gateway', ic: '⚪' },
      ],
    },
    {
      cat: 'Cloud & Orchestration',
      items: [
        { n: 'AWS', d: 'EC2, S3, EKS, SageMaker', ic: '☁️' },
        { n: 'Kubernetes', d: 'GPU cluster management & autoscaling', ic: '⚙️' },
        { n: 'Ray', d: 'Distributed compute for large-scale optimization', ic: '⚡' },
      ],
    },
    {
      cat: 'Model Registries',
      items: [
        { n: 'Hugging Face', d: 'Model Hub, Inference Endpoints', ic: '🤗' },
        { n: 'MLflow', d: 'Experiment tracking & model registry', ic: '📊' },
      ],
    },
    {
      cat: 'AI Processing Stack',
      items: [
        { n: 'PyTorch', d: 'Neural network compression engine (Layer 1)', ic: '🔥' },
        { n: 'ONNX Runtime', d: 'Optimized inference execution (Layer 1)', ic: '🏃' },
        { n: 'TensorRT', d: 'NVIDIA GPU optimization compiler (Layer 5)', ic: '🚀' },
      ],
    },
    {
      cat: 'Monitoring',
      items: [
        { n: 'Prometheus', d: 'Infrastructure metrics collection', ic: '📡' },
        { n: 'Grafana', d: 'Monitoring dashboards', ic: '📈' },
      ],
    },
  ];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="Step 1 — Connect"
        title="Universal AI Gateway"
        sub="Connect all your AI providers and infrastructure. Compressor AI sits between your application and every model, optimizing all 5 layers automatically."
      />
      <div
        style={{
          background: C.sfH,
          border: `1px solid ${C.br}`,
          borderRadius: 10,
          padding: '12px 18px',
          marginBottom: 20,
          fontSize: 12,
          color: C.mL,
          lineHeight: 1.8,
        }}
      >
        <b style={{ color: C.cy }}>API change required:</b> Change{' '}
        <code style={{ color: C.gr, background: C.bg, padding: '2px 6px', borderRadius: 4 }}>
          openai.chat.completions()
        </code>{' '}
        to{' '}
        <code style={{ color: C.cy, background: C.bg, padding: '2px 6px', borderRadius: 4 }}>
          compressor.chat.completions()
        </code>{' '}
        — no other code changes. All 5 optimization layers activate automatically.
      </div>

      {groups.map((g) => (
        <div key={g.cat} style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 10,
              color: C.mu,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              fontWeight: 700,
              marginBottom: 9,
            }}
          >
            {g.cat}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(250px,1fr))', gap: 9 }}>
            {g.items.map((it) => {
              const isC = conn.includes(it.n);
              return (
                <Card
                  key={it.n}
                  sx={{
                    padding: '13px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 11,
                  }}
                >
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{it.ic}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                      <span style={{ color: C.gh, fontWeight: 700, fontSize: 13 }}>{it.n}</span>
                      {isC && (
                        <Badge c={C.gr} dot>
                          Connected
                        </Badge>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: C.mu }}>{it.d}</div>
                  </div>
                  <Btn
                    sm
                    v={isC ? 'success' : 'ghost'}
                    onClick={() =>
                      setConn((p) =>
                        isC ? p.filter((x) => x !== it.n) : [...p, it.n]
                      )
                    }
                  >
                    {isC ? '✓' : 'Connect'}
                  </Btn>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── PAGE: ENTERPRISE CLIENTS ───────────────────────────────────────
export function PageClients() {
  const clients = [
    { n: 'OpenAI', ind: 'AI Research & Products', m: '340+', g: '12,000+', sv: '$4.2M/mo', c: C.gr, ic: '🟢' },
    { n: 'Anthropic', ind: 'AI Safety & Research', m: '180+', g: '8,000+', sv: '$2.8M/mo', c: C.cy, ic: '🔵' },
    { n: 'Google DeepMind', ind: 'AI Research', m: '420+', g: '15,000+', sv: '$6.1M/mo', c: C.am, ic: '🟡' },
    { n: 'Meta AI', ind: 'Social / AI Research', m: '280+', g: '10,000+', sv: '$3.9M/mo', c: C.bl, ic: '🔷' },
    { n: 'Mistral AI', ind: 'Open-Source LLMs', m: '90+', g: '3,200+', sv: '$1.2M/mo', c: C.pu, ic: '🟣' },
    { n: 'xAI', ind: 'AI Research', m: '120+', g: '5,000+', sv: '$1.8M/mo', c: C.rd, ic: '🔴' },
  ];

  return (
    <div style={{ padding: 26, overflowY: 'auto', flex: 1 }}>
      <Sec
        ey="Enterprise Clients"
        title="Trusted by the World's Top AI Companies"
        sub="Compressor AI is the AI Efficiency Operating System for organizations running AI at massive scale."
      />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
        <KPI label="Enterprise Clients" value={clients.length + ''} sub="Active accounts" color={C.cy} />
        <KPI label="Total GPUs Managed" value="53,200+" sub="Across all clients" color={C.am} />
        <KPI label="Monthly Savings" value="$19.8M" sub="Across all clients" color={C.gr} />
        <KPI label="Models Optimized" value="1,430+" sub="Total portfolio" color={C.cy} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 14, marginBottom: 24 }}>
        {clients.map((cl) => (
          <Card key={cl.n} sx={{ padding: '18px' }} glow={cl.c}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ fontSize: 24 }}>{cl.ic}</div>
                <div>
                  <div style={{ color: C.gh, fontWeight: 800, fontSize: 17, fontFamily: FF }}>{cl.n}</div>
                  <div style={{ fontSize: 11, color: C.mu }}>{cl.ind}</div>
                </div>
              </div>
              <Badge c={cl.c}>Premier</Badge>
            </div>
            <div style={{ height: 1, background: C.br, margin: '10px 0' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 7 }}>
              {[
                { l: 'Models', v: cl.m },
                { l: 'GPUs', v: cl.g },
                { l: 'Savings/mo', v: cl.sv },
              ].map((s) => (
                <div key={s.l}>
                  <div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 2 }}>{s.l}</div>
                  <div
                    style={{
                      color: s.l === 'Savings/mo' ? C.gr : C.gh,
                      fontWeight: 700,
                      fontSize: 13,
                      fontFamily: FF,
                    }}
                  >
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <Card sx={{ padding: '24px', textAlign: 'center' }} glow={C.cy}>
        <h3 style={{ color: C.gh, fontFamily: FF, margin: '0 0 9px', fontSize: 19 }}>
          Ready to optimize your AI infrastructure?
        </h3>
        <p style={{ color: C.mL, fontSize: 13, maxWidth: 480, margin: '0 auto 18px', lineHeight: 1.75 }}>
          Compressor AI automatically reduces the cost of running AI by optimizing models, prompts,
          context windows, GPU utilization, and inference routing — without requiring any code changes.
        </p>
        <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Btn>Request Enterprise Demo</Btn>
          <Btn v="ghost">Calculate Your Savings</Btn>
        </div>
      </Card>
    </div>
  );
}
