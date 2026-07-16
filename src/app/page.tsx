'use client';

import React, { useState, useEffect, useRef } from 'react';
import { C, FF, API } from '@/lib/constants';
import { Landing } from '@/components/landing';
import { Login } from '@/components/login';
import { Sidebar } from '@/components/sidebar';
import { Badge, LiveDot } from '@/components/primitives';
import { PageOverview } from '@/components/pages/dashboard';
import { PageJobs, PageUpload } from '@/components/pages/jobs';
import { PagePromptOptimizer, PageSmartRouting, PageContextCompression, PageInferenceNet } from '@/components/pages/layers';

export default function App() {
  const [screen, setScreen] = useState('landing');
  const [role, setRole] = useState<string | null>(null);
  const [page, setPage] = useState('Overview');
  const [jobs, setJobs] = useState<any[]>([]);
  const jid = useRef(0);

  useEffect(() => {
    fetch(API + '/api/jobs')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d) && d.length) {
          setJobs(d);
          jid.current = Math.max(...d.map((j: any) => j.id || 0), 0);
        }
      })
      .catch(() => {});
  }, []);

  const newJob = (data: any) => {
    const id = ++jid.current;
    const pn = parseFloat(data.params) || 70;
    const j = {
      id,
      ...data,
      originalSize: Math.round(pn * 2),
      status: 'pending',
      progress: 0,
      log: '',
      savings: 0,
    };
    setJobs((p) => [...p, j]);
    setPage('Compression Jobs');
    fetch(API + '/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(j),
    }).catch(() => {});
  };

  const ADMIN: Record<string, React.ReactNode> = {
    Overview: <PageOverview jobs={jobs} setPage={setPage} />,
    'Upload Model': <PageUpload onJobCreated={newJob} />,
    'Prompt Optimization': <PagePromptOptimizer onJobCreated={newJob} />,
    'Smart Routing': <PageSmartRouting onJobCreated={newJob} />,
    'Context Compression': <PageContextCompression onJobCreated={newJob} />,
    'Inference Network': <PageInferenceNet onJobCreated={newJob} />,
    'Compression Jobs': <PageJobs jobs={jobs} setJobs={setJobs} />,
  };

  const DEMO: Record<string, React.ReactNode> = {
    Overview: <PageOverview jobs={jobs} setPage={setPage} />,
    'Upload Model': <PageUpload onJobCreated={newJob} />,
    'Prompt Optimization': <PagePromptOptimizer onJobCreated={newJob} />,
    'Smart Routing': <PageSmartRouting onJobCreated={newJob} />,
    'Context Compression': <PageContextCompression onJobCreated={newJob} />,
    'Inference Network': <PageInferenceNet onJobCreated={newJob} />,
    'Compression Jobs': <PageJobs jobs={jobs} setJobs={setJobs} />,
  };

  return (
    <div style={{ background: C.bg, minHeight: '100vh', fontFamily: FF, color: C.gh }}>
      {screen === 'landing' && <Landing onEnter={() => setScreen('login')} />}
      {screen === 'login' && (
        <Login
          onLogin={(r) => {
            setRole(r);
            setScreen('app');
            setPage('Overview');
          }}
        />
      )}

      {screen === 'app' && (
        <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
          <Sidebar
            page={page}
            setPage={setPage}
            role={role}
            onLogout={() => {
              setScreen('landing');
              setRole(null);
              setJobs([]);
            }}
            jobs={jobs}
          />
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: 60,
                borderBottom: `1px solid ${C.br}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 26px',
                flexShrink: 0,
                background: C.sf,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <span style={{ color: C.gh, fontWeight: 700, fontSize: 15 }}>
                  {page}
                </span>
                {role === 'demo' && <Badge c={C.mu}>Read Only</Badge>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <LiveDot />
                  <span style={{ fontSize: 11, color: C.mu }}>5 layers active</span>
                </div>
                <div
                  style={{
                    background: C.cy + '15',
                    border: `1px solid ${C.cy}30`,
                    borderRadius: 8,
                    padding: '3px 11px',
                    fontSize: 11,
                    color: C.cy,
                    fontWeight: 700,
                  }}
                >
                  Score™ 87/100
                </div>
                <Badge c={role === 'admin' ? C.am : C.cy}>
                  {role === 'admin' ? 'Super Admin' : 'Enterprise Demo'}
                </Badge>
              </div>
            </div>
            <div
              style={{
                flex: 1,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: C.bg,
              }}
            >
              {role === 'admin'
                ? ADMIN[page] || (
                    <div style={{ padding: 28, color: C.mu }}>
                      Select a page from the sidebar.
                    </div>
                  )
                : DEMO[page] || (
                    <div style={{ padding: 28, color: C.mu }}>
                      Select a page from the sidebar.
                    </div>
                  )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
