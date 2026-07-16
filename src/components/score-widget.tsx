'use client';

import { C, FF } from '@/lib/constants';
import { Card, PBar } from '@/components/primitives';
import { IconLightbulb } from '@/components/icons';

export const ScoreWidget = ({ score = 87 }: { score?: number }) => {
  const dims = [
    { l: 'Cost Efficiency', s: score - 2, c: C.cy },
    { l: 'Token Efficiency', s: score + 4, c: C.gr },
    { l: 'Latency Score', s: score - 5, c: C.am },
    { l: 'Context Efficiency', s: score + 1, c: C.pu },
    { l: 'GPU Efficiency', s: score - 3, c: C.bl },
    { l: 'Infrastructure', s: score + 2, c: C.cy },
  ];

  const grade =
    score >= 90 ? 'A+' : score >= 85 ? 'A' : score >= 80 ? 'A-' : 'B+';

  return (
    <Card sx={{ padding: 22 }} glow={C.cy}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 10,
              color: C.cy,
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: 4,
            }}
          >
            AI Efficiency Score™
          </div>
          <div style={{ fontSize: 11, color: C.mu }}>
            Infrastructure intelligence rating
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              fontSize: 44,
              fontWeight: 900,
              color: C.cy,
              fontFamily: FF,
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div style={{ fontSize: 17, fontWeight: 800, color: C.gh }}>{grade}</div>
          <div style={{ fontSize: 10, color: C.mu }}>/100</div>
        </div>
      </div>

      {dims.map((d) => (
        <div key={d.l} style={{ marginBottom: 8 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 3,
            }}
          >
            <span style={{ fontSize: 11, color: C.mL }}>{d.l}</span>
            <span style={{ fontSize: 11, color: d.c, fontWeight: 700 }}>
              {Math.min(d.s, 100)}/100
            </span>
          </div>
          <PBar pct={Math.min(d.s, 100)} color={d.c} h={4} />
        </div>
      ))}

      <div
        style={{
          marginTop: 12,
          padding: '9px 12px',
          background: C.sfH,
          borderRadius: 8,
          fontSize: 11,
          color: C.mL,
        }}
      >
        <IconLightbulb size={14} color={C.am} />{' '}
        <b style={{ color: C.am }}>14 optimization opportunities</b> —
        potential +8 score points
      </div>
    </Card>
  );
};
