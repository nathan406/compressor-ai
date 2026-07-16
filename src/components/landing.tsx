'use client';

import React, { useState } from 'react';
import { C, FF } from '@/lib/constants';
import { Badge, Btn, Card, Sec, Spark } from '@/components/primitives';
import { Topo } from '@/components/canvas';

export const Landing = ({ onEnter }: { onEnter: () => void }) => {
  const [gpus, setGpus] = useState(5000);
  const [cost, setCost] = useState(5000000);

  const layers = [
    {
      n: 'Layer 1',
      t: 'Model Optimization',
      d: 'Quantization · Pruning · Distillation',
      sv: '63% avg reduction',
      c: C.cy,
    },
    {
      n: 'Layer 2',
      t: 'Prompt Optimization',
      d: 'Remove redundant tokens automatically',
      sv: '38% fewer tokens',
      c: C.gr,
    },
    {
      n: 'Layer 3',
      t: 'Smart Model Routing',
      d: 'Match request complexity to model size',
      sv: '75% traffic rerouted',
      c: C.am,
    },
    {
      n: 'Layer 4',
      t: 'Context Compression',
      d: 'Summarize + compress conversation history',
      sv: '85% context savings',
      c: C.pu,
    },
    {
      n: 'Layer 5',
      t: 'Inference Network',
      d: 'Route traffic · Balance loads · Reclaim GPU',
      sv: '34% GPU fleet saved',
      c: C.bl,
    },
  ];

  const comps = [
    { n: 'NVIDIA', f: 'Hardware optimization' },
    { n: 'TensorRT', f: 'Model acceleration' },
    { n: 'vLLM', f: 'Faster inference' },
    { n: 'ONNX', f: 'Model deployment' },
    { n: 'Baseten', f: 'Deployment' },
    { n: 'Together AI', f: 'Inference' },
    { n: 'Fireworks AI', f: 'Inference' },
  ];

  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      {/* Nav */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: C.bg + 'EC',
          backdropFilter: 'blur(14px)',
          borderBottom: `1px solid ${C.br}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          height: 66,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: `linear-gradient(135deg,${C.cy},${C.cyD})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <b style={{ fontSize: 16, color: C.bg }}>C</b>
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, color: C.gh, fontFamily: FF }}>
            Compresor<span style={{ color: C.cy }}>AI</span>
          </span>
          <Badge c={C.am}>Enterprise</Badge>
        </div>
        <div style={{ display: 'flex', gap: 9 }}>
          <Btn v="ghost" sm onClick={onEnter}>
            Sign In
          </Btn>
          <Btn sm onClick={onEnter}>
            Get Started →
          </Btn>
        </div>
      </nav>

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '80px 36px 60px',
        }}
      >
        <Topo />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse 70% 55% at 50% 42%,${C.cy}08 0%,transparent 70%)`,
          }}
        />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 780 }}>
          <div style={{ marginBottom: 13 }}>
            <Badge c={C.cy}>AI Efficiency Operating System</Badge>
          </div>
          <h1
            style={{
              fontSize: 'clamp(30px,5vw,62px)',
              fontWeight: 800,
              color: C.gh,
              lineHeight: 1.06,
              letterSpacing: '-0.025em',
              margin: '0 0 18px',
              fontFamily: FF,
            }}
          >
            The AI Efficiency
            <br />
            <span style={{ color: C.cy }}>Operating System</span>
          </h1>
          <p
            style={{
              color: C.mL,
              fontSize: 'clamp(13px,1.5vw,17px)',
              lineHeight: 1.75,
              maxWidth: 580,
              margin: '0 auto 16px',
            }}
          >
            Compresor AI is the intelligence layer between AI applications and
            compute infrastructure — automatically reducing costs across every
            layer of your AI stack without requiring any code changes.
          </p>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 18,
              marginBottom: 28,
              flexWrap: 'wrap',
            }}
          >
            {[
              ['Stripe handles', 'Payments'],
              ['Cloudflare handles', 'Internet Traffic'],
              ['Compresor AI handles', 'AI Efficiency'],
            ].map(([a, b], i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: C.mu }}>{a}</div>
                <div
                  style={{
                    fontSize: 13,
                    color: i === 2 ? C.cy : C.gh,
                    fontWeight: 700,
                  }}
                >
                  {b}
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Btn onClick={onEnter} sx={{ fontSize: 14, padding: '12px 28px' }}>
              Open Platform →
            </Btn>
            <Btn v="ghost" onClick={onEnter} sx={{ fontSize: 14, padding: '12px 28px' }}>
              Watch Demo
            </Btn>
          </div>
          <div
            style={{
              marginTop: 22,
              display: 'flex',
              gap: 14,
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {['OpenAI', 'Anthropic', 'Google DeepMind', 'Meta AI', 'Mistral AI', 'xAI'].map(
              (c) => (
                <span key={c} style={{ fontSize: 10, color: C.mu }}>
                  {c}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section style={{ padding: '60px 36px', background: C.sf, borderTop: `1px solid ${C.br}` }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <Sec ey="The Problem" title="Everyone solves one piece." center />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 32, alignItems: 'center' }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  color: C.mu,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                Existing Competitors
              </div>
              {comps.map((c) => (
                <div
                  key={c.n}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderBottom: `1px solid ${C.br}`,
                  }}
                >
                  <span style={{ color: C.gh, fontWeight: 600, fontSize: 13 }}>{c.n}</span>
                  <span style={{ color: C.mu, fontSize: 12 }}>{c.f}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: 'center', padding: '18px' }}>
              <div style={{ fontSize: 32, color: C.br, fontFamily: FF }}>vs</div>
            </div>
            <div
              style={{
                background: C.cy + '0A',
                border: `1px solid ${C.cy}30`,
                borderRadius: 12,
                padding: '22px',
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: C.cy,
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  marginBottom: 12,
                  fontWeight: 700,
                }}
              >
                Compresor AI
              </div>
              <div style={{ color: C.gh, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>
                Solves everything between:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 16, flexWrap: 'wrap' }}>
                {['AI Model', 'User Request', 'GPU', 'Response'].map((s, i, a) => (
                  <span key={s} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ color: C.cy, fontWeight: 700, fontSize: 12 }}>{s}</span>
                    {i < a.length - 1 && <span style={{ color: C.mu, fontSize: 11 }}>→</span>}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: 11, color: C.gr, fontWeight: 700, marginBottom: 8 }}>
                One platform. All 5 layers.
              </div>
              {layers.map((l) => (
                <div
                  key={l.n}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '4px 0',
                    borderBottom: `1px solid ${C.br}`,
                  }}
                >
                  <span style={{ color: C.mL, fontSize: 11 }}>
                    {l.n}: {l.t}
                  </span>
                  <span style={{ color: C.gr, fontSize: 10, fontWeight: 700 }}>{l.sv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section
        style={{
          background: C.sfH,
          borderTop: `1px solid ${C.br}`,
          borderBottom: `1px solid ${C.br}`,
          padding: '20px 36px',
        }}
      >
        <div
          style={{
            maxWidth: 980,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: 18,
          }}
        >
          {[
            ['63%', 'Model Reduction (L1)'],
            ['38%', 'Prompt Savings (L2)'],
            ['75%', 'Traffic Rerouted (L3)'],
            ['85%', 'Context Compressed (L4)'],
            ['34%', 'GPU Fleet Reclaimed (L5)'],
            ['2.1×', 'Inference Speedup'],
          ].map(([n, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 30, fontWeight: 800, color: C.cy, fontFamily: FF }}>{n}</div>
              <div
                style={{
                  fontSize: 10,
                  color: C.mu,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginTop: 4,
                }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5-Layer Platform */}
      <section style={{ padding: '60px 36px' }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <Sec
            ey="The 5-Layer Platform"
            title="Optimizing everything between the model and the user"
            center
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(270px,1fr))', gap: 14 }}>
            {layers.map((l, i) => (
              <Card key={i} sx={{ padding: '22px 20px', borderTop: `3px solid ${l.c}` }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: 9,
                  }}
                >
                  <Badge c={l.c}>{l.n}</Badge>
                </div>
                <div style={{ color: C.gh, fontWeight: 700, fontSize: 15, marginBottom: 6 }}>
                  {l.t}
                </div>
                <div style={{ color: C.mL, fontSize: 13, lineHeight: 1.8, marginBottom: 10 }}>
                  {l.d}
                </div>
                <div style={{ color: l.c, fontWeight: 800, fontFamily: FF, fontSize: 13 }}>
                  {l.sv}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Efficiency Score section */}
      <section style={{ padding: '60px 36px', background: C.sf }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <Sec
            ey="Flagship Feature"
            title="AI Efficiency Score™"
            sub="Every AI system gets a score. Like a credit score for AI infrastructure. Companies continuously improve their score using Compresor AI."
            center
          />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 9, marginTop: 24 }}>
            {[
              'Cost Efficiency',
              'Token Efficiency',
              'Latency Score',
              'Context Efficiency',
              'GPU Efficiency',
              'Infrastructure',
            ].map((d, i) => (
              <Card key={d} sx={{ padding: '12px 9px', textAlign: 'center' }}>
                <div style={{ fontSize: 9, color: C.mu, marginBottom: 5 }}>{d}</div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                    color: [C.cy, C.gr, C.am, C.pu, C.bl, C.cy][i],
                    fontFamily: FF,
                  }}
                >
                  {[85, 91, 82, 88, 84, 89][i]}
                </div>
              </Card>
            ))}
          </div>
          <div
            style={{
              marginTop: 20,
              display: 'inline-block',
              background: C.cy + '12',
              border: `2px solid ${C.cy}40`,
              borderRadius: 14,
              padding: '16px 32px',
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: C.cy,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                marginBottom: 4,
              }}
            >
              Overall AI Efficiency Score™
            </div>
            <div style={{ fontSize: 52, fontWeight: 900, color: C.cy, fontFamily: FF, lineHeight: 1 }}>
              87<span style={{ fontSize: 16, color: C.mu }}>/100</span>
            </div>
            <div style={{ fontSize: 12, color: C.gr, marginTop: 4 }}>
              Grade: A • +45 points in 12 months
            </div>
          </div>
        </div>
      </section>

      {/* Calculator */}
      <section style={{ padding: '60px 36px' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <Sec ey="Interactive Calculator" title="Estimate Your Infrastructure Savings" center />
          <Card sx={{ padding: '24px' }}>
            <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginBottom: 20 }}>
              {[
                {
                  label: 'Number of GPUs',
                  min: 100,
                  max: 20000,
                  step: 100,
                  value: gpus,
                  set: setGpus,
                  c: C.cy,
                  fmt: (v: number) => v.toLocaleString() + ' GPUs',
                },
                {
                  label: 'Monthly Inference Cost',
                  min: 100000,
                  max: 20000000,
                  step: 50000,
                  value: cost,
                  set: setCost,
                  c: C.am,
                  fmt: (v: number) => '$' + (v / 1e6).toFixed(1) + 'M',
                },
              ].map((s) => (
                <div key={s.label} style={{ flex: 1, minWidth: 180 }}>
                  <label
                    style={{
                      display: 'block',
                      color: C.mL,
                      fontSize: 10,
                      marginBottom: 6,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {s.label}
                  </label>
                  <input
                    type="range"
                    min={s.min}
                    max={s.max}
                    step={s.step}
                    value={s.value}
                    onChange={(e) => s.set(+e.target.value)}
                    style={{ width: '100%', accentColor: s.c }}
                  />
                  <div
                    style={{
                      color: C.gh,
                      fontSize: 18,
                      fontWeight: 800,
                      fontFamily: FF,
                      marginTop: 4,
                    }}
                  >
                    {s.fmt(s.value)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
              {[
                { l: 'GPUs Reclaimed', v: Math.round(gpus * 0.34).toLocaleString(), c: C.cy },
                { l: 'Monthly Savings', v: '$' + (cost * 0.36 / 1e6).toFixed(2) + 'M', c: C.gr },
                { l: 'Annual Savings', v: '$' + (cost * 0.36 * 12 / 1e6).toFixed(1) + 'M', c: C.am },
              ].map((k) => (
                <div
                  key={k.l}
                  style={{
                    flex: 1,
                    minWidth: 120,
                    background: C.sfH,
                    borderRadius: 8,
                    padding: '11px 13px',
                    border: `1px solid ${k.c}25`,
                  }}
                >
                  <div style={{ fontSize: 10, color: C.mu, textTransform: 'uppercase', marginBottom: 3 }}>
                    {k.l}
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 800, color: k.c, fontFamily: FF }}>{k.v}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '50px 36px', background: C.sf, borderTop: `1px solid ${C.br}` }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <Sec ey="Business Model" title="Charge for savings, not tools" center />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>
            {[
              { t: 'Startup', p: '$299/mo', d: 'Up to 10 models · Layer 1 compression', c: C.mu },
              { t: 'Growth', p: '$2,500/mo', d: 'Up to 100 models · Layers 1–3', c: C.cy },
              { t: 'Business', p: '$10K/mo', d: 'Unlimited · All 5 layers · CI/CD', c: C.gr },
              { t: 'Hyperscale', p: 'Revenue Share', d: 'Save $10M → charge 15% = $1.5M/mo', c: C.am },
            ].map((pr) => (
              <Card key={pr.t} sx={{ padding: '18px 16px', borderTop: `3px solid ${pr.c}`, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: pr.c, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                  {pr.t}
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: C.gh, fontFamily: FF, marginBottom: 8 }}>
                  {pr.p}
                </div>
                <div style={{ fontSize: 11, color: C.mu, lineHeight: 1.6 }}>{pr.d}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 36px', textAlign: 'center' }}>
        <h2 style={{ color: C.gh, fontSize: 28, fontWeight: 800, margin: '0 0 12px', fontFamily: FF }}>
          Ready to optimize your AI infrastructure?
        </h2>
        <p style={{ color: C.mL, maxWidth: 500, margin: '0 auto 24px', lineHeight: 1.8, fontSize: 14 }}>
          Compresor AI is building the intelligence layer that sits between AI applications and
          compute infrastructure, automatically reducing AI costs, improving performance, and
          optimizing every stage of inference.
        </p>
        <div style={{ display: 'flex', gap: 9, justifyContent: 'center' }}>
          <Btn onClick={onEnter} sx={{ fontSize: 14, padding: '12px 28px' }}>
            Open Platform →
          </Btn>
          <Btn v="ghost" onClick={onEnter} sx={{ fontSize: 14, padding: '12px 28px' }}>
            Sign In
          </Btn>
        </div>
      </section>
    </div>
  );
};
