'use client';

import React from 'react';
import { C, FF } from '@/lib/constants';
import { Badge, LiveDot, Btn } from '@/components/primitives';

export const Sidebar = ({
  page,
  setPage,
  role,
  onLogout,
  jobs,
}: {
  page: string;
  setPage: (p: string) => void;
  role: string | null;
  onLogout: () => void;
  jobs: any[];
}) => {
  const adminNav = [
    {
      g: 'Dashboard',
      items: ['Overview'],
    },
    {
      g: '5-Layer Optimization',
      items: [
        'Upload Model',
        'Prompt Optimization',
        'Smart Routing',
        'Context Compression',
        'Inference Network',
        'Compression Jobs',
      ],
    },
  ];

  const demoNav = [
    {
      g: 'Dashboard',
      items: ['Overview'],
    },
    {
      g: '5-Layer Optimization',
      items: [
        'Upload Model',
        'Prompt Optimization',
        'Smart Routing',
        'Context Compression',
        'Inference Network',
        'Compression Jobs',
      ],
    },
  ];

  const nav = role === 'admin' ? adminNav : demoNav;
  const act = jobs.filter(
    (j: any) => j.status === 'running' || j.status === 'pending'
  ).length;

  return (
    <div
      style={{
        width: 248,
        background: C.sf,
        borderRight: `1px solid ${C.br}`,
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          padding: '16px 14px 13px',
          borderBottom: `1px solid ${C.br}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 6,
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: `linear-gradient(135deg,${C.cy},${C.cyD})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <b style={{ fontSize: 14, color: C.bg }}>C</b>
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: C.gh,
              fontFamily: FF,
            }}
          >
            Compresor<span style={{ color: C.cy }}>AI</span>
          </span>
        </div>
        <div style={{ fontSize: 10, color: C.mu, marginBottom: 6 }}>
          AI Efficiency Operating System
        </div>
        <Badge c={role === 'admin' ? C.am : C.cy}>
          {role === 'admin' ? 'Super Admin' : 'Demo Access'}
        </Badge>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 6px',
        }}
      >
        {nav.map((g) => (
          <div key={g.g} style={{ marginBottom: 12 }}>
            <div
              style={{
                fontSize: 10,
                color: C.mu,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                fontWeight: 700,
                padding: '0 9px',
                marginBottom: 4,
              }}
            >
              {g.g}
            </div>
            {g.items.map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '8px 11px',
                  marginBottom: 2,
                  borderRadius: 7,
                  border: 'none',
                  background: page === p ? C.cy + '18' : 'transparent',
                  color: page === p ? C.cy : C.mL,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: page === p ? 700 : 500,
                  fontFamily: FF,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {p}
                {p === 'Compression Jobs' && act > 0 && (
                  <span
                    style={{
                      background: C.am,
                      color: C.bg,
                      borderRadius: 10,
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '1px 6px',
                    }}
                  >
                    {act}
                  </span>
                )}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div
        style={{
          padding: '10px 6px',
          borderTop: `1px solid ${C.br}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 9px',
            marginBottom: 7,
          }}
        >
          <LiveDot />
          <span style={{ fontSize: 11, color: C.mu }}>All 5 layers active</span>
        </div>
        <Btn v="ghost" onClick={onLogout} sm full>
          Sign Out
        </Btn>
      </div>
    </div>
  );
};
