'use client';

import React, { useState } from 'react';
import { C, FF, API } from '@/lib/constants';
import { Card, Inp, Btn } from '@/components/primitives';
import { Topo } from '@/components/canvas';

export const Login = ({ onLogin }: { onLogin: (role: string) => void }) => {
  const [role, setRole] = useState('admin');
  const [email, setEmail] = useState('admin@compressor.ai');
  const [pass, setPass] = useState('admin123');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const CR: Record<string, { email: string; pass: string }> = {
    admin: { email: 'admin@compressor.ai', pass: 'admin123' },
    demo: { email: 'demo@enterprise.ai', pass: 'demo123' },
  };

  const sw = (r: string) => {
    setRole(r);
    setEmail(CR[r].email);
    setPass(CR[r].pass);
    setErr('');
  };

  const go = async () => {
    setErr('');
    setLoading(true);
    try {
      const r = await fetch(API + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      if (r.ok) {
        const d = await r.json();
        setTimeout(() => onLogin(d.role), 500);
        return;
      }
      if (r.status === 401) {
        setLoading(false);
        setErr('Invalid credentials.');
        return;
      }
      throw 0;
    } catch {
      const c = CR[role];
      if (email === c.email && pass === c.pass) {
        setTimeout(() => onLogin(role), 700);
      } else {
        setLoading(false);
        setErr('Invalid credentials.');
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: C.bg,
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Topo />
      <div style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: 410 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 6,
            }}
          >
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: `linear-gradient(135deg,${C.cy},${C.cyD})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <b style={{ fontSize: 17, color: C.bg }}>C</b>
            </div>
            <span
              style={{ fontSize: 21, fontWeight: 800, color: C.gh, fontFamily: FF }}
            >
              Compressor<span style={{ color: C.cy }}>AI</span>
            </span>
          </div>
          <div style={{ color: C.mL, fontSize: 13 }}>
            AI Efficiency Operating System
          </div>
        </div>

        <Card sx={{ padding: '26px 24px' }}>
          <div
            style={{
              display: 'flex',
              gap: 4,
              marginBottom: 18,
              background: C.sfH,
              borderRadius: 8,
              padding: 4,
            }}
          >
            {[
              ['admin', 'Super Admin'],
              ['demo', 'Enterprise Demo'],
            ].map(([r, l]) => (
              <button
                key={r}
                onClick={() => sw(r)}
                style={{
                  flex: 1,
                  padding: '8px 0',
                  borderRadius: 7,
                  border:
                    role === r
                      ? `1px solid ${C.cy}40`
                      : '1px solid transparent',
                  background: role === r ? C.cy + '18' : 'transparent',
                  color: role === r ? C.cy : C.mu,
                  fontWeight: 700,
                  fontSize: 12,
                  cursor: 'pointer',
                  fontFamily: FF,
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <Inp
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@company.ai"
          />
          <Inp
            label="Password"
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="••••••••"
          />

          {err && (
            <div
              style={{
                color: C.rd,
                fontSize: 12,
                marginBottom: 12,
                padding: '8px 12px',
                background: C.rd + '12',
                borderRadius: 6,
              }}
            >
              {err}
            </div>
          )}

          <Btn full onClick={go} disabled={loading} sx={{ marginTop: 4 }}>
            {loading ? 'Authenticating…' : 'Sign In →'}
          </Btn>

          <div
            style={{
              marginTop: 14,
              padding: '10px 12px',
              background: C.sfH,
              borderRadius: 8,
              fontSize: 12,
              color: C.mu,
              lineHeight: 1.7,
            }}
          >
            <b style={{ color: C.mL }}>Admin:</b> admin@compressor.ai / admin123
            <br />
            <b style={{ color: C.mL }}>Demo:</b> demo@enterprise.ai / demo123
          </div>
        </Card>
      </div>
    </div>
  );
};
