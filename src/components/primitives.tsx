'use client';

import React from 'react';
import { C, FF } from '@/lib/constants';

// ── Badge ────────────────────────────────────────────────────────────
export const Badge = ({
  c = C.cy,
  dot,
  children,
}: {
  c?: string;
  dot?: boolean;
  children: React.ReactNode;
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
      padding: '3px 10px',
      borderRadius: 5,
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.09em',
      textTransform: 'uppercase',
      background: c + '18',
      color: c,
      border: `1px solid ${c}35`,
    }}
  >
    {dot && (
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: '50%',
          background: c,
          display: 'inline-block',
        }}
      />
    )}
    {children}
  </span>
);

// ── Btn ──────────────────────────────────────────────────────────────
const btnVariants: Record<string, React.CSSProperties> = {
  primary: { background: C.cy, color: C.bg },
  ghost: { background: 'transparent', color: C.gh, border: `1px solid ${C.br}` },
  success: { background: C.gr + '20', color: C.gr, border: `1px solid ${C.gr}40` },
  amber: { background: C.am + '20', color: C.am, border: `1px solid ${C.am}40` },
  danger: { background: C.rd + '20', color: C.rd, border: `1px solid ${C.rd}40` },
};

export const Btn = ({
  children,
  onClick,
  v = 'primary',
  sm,
  disabled,
  full,
  sx = {},
}: {
  children: React.ReactNode;
  onClick?: () => void;
  v?: string;
  sm?: boolean;
  disabled?: boolean;
  full?: boolean;
  sx?: React.CSSProperties;
}) => {
  const base: React.CSSProperties = {
    fontFamily: FF,
    fontWeight: 700,
    borderRadius: 7,
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: 'none',
    transition: 'all .15s',
    opacity: disabled ? 0.45 : 1,
    fontSize: sm ? 13 : 15,
    padding: sm ? '8px 18px' : '12px 28px',
    width: full ? '100%' : 'auto',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  };
  return (
    <button
      onClick={!disabled ? onClick : undefined}
      style={{ ...base, ...(btnVariants[v] || btnVariants.ghost), ...sx }}
    >
      {children}
    </button>
  );
};

// ── Card ─────────────────────────────────────────────────────────────
export const Card = ({
  children,
  sx = {},
  glow,
  onClick,
}: {
  children: React.ReactNode;
  sx?: React.CSSProperties;
  glow?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    style={{
      background: C.sf,
      border: `1px solid ${glow ? glow + '50' : C.br}`,
      borderRadius: 12,
      ...(glow ? { boxShadow: `0 0 24px ${glow}12` } : {}),
      ...(onClick ? { cursor: 'pointer' } : {}),
      ...sx,
    }}
  >
    {children}
  </div>
);

// ── Inp ──────────────────────────────────────────────────────────────
export const Inp = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled,
}: {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <div
        style={{
          fontSize: 11,
          color: C.mL,
          marginBottom: 6,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </div>
    )}
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      style={{
        width: '100%',
        background: C.sfH,
        border: `1px solid ${C.br}`,
        borderRadius: 7,
        padding: '10px 13px',
        color: C.gh,
        fontSize: 14,
        fontFamily: FF,
        outline: 'none',
        boxSizing: 'border-box',
        opacity: disabled ? 0.5 : 1,
      }}
    />
  </div>
);

// ── Sel ──────────────────────────────────────────────────────────────
export const Sel = ({
  label,
  value,
  onChange,
  options,
}: {
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { v: string; l: string }[];
}) => (
  <div style={{ marginBottom: 14 }}>
    {label && (
      <div
        style={{
          fontSize: 11,
          color: C.mL,
          marginBottom: 6,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
        }}
      >
        {label}
      </div>
    )}
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        background: C.sfH,
        border: `1px solid ${C.br}`,
        borderRadius: 7,
        padding: '10px 13px',
        color: C.gh,
        fontSize: 14,
        fontFamily: FF,
        outline: 'none',
      }}
    >
      {options.map((o) => (
        <option key={o.v} value={o.v}>
          {o.l}
        </option>
      ))}
    </select>
  </div>
);

// ── KPI ──────────────────────────────────────────────────────────────
export const KPI = ({
  label,
  value,
  sub,
  color = C.cy,
  delta,
  mini,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  delta?: string;
  mini?: boolean;
}) => (
  <div
    style={{
      background: C.sf,
      border: `1px solid ${C.br}`,
      borderTop: `2px solid ${color}`,
      borderRadius: 8,
      padding: mini ? '14px 16px' : '20px 22px',
      flex: 1,
      minWidth: mini ? 110 : 140,
    }}
  >
    <div
      style={{
        fontSize: 10,
        color: C.mu,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 5,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: mini ? 20 : 28,
        fontWeight: 800,
        color: C.gh,
        fontFamily: FF,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: C.mL, marginTop: 4 }}>{sub}</div>
    )}
    {delta && (
      <div style={{ fontSize: 11, color: C.gr, marginTop: 3 }}>
        ↑ {delta}
      </div>
    )}
  </div>
);

// ── PBar ─────────────────────────────────────────────────────────────
export const PBar = ({
  pct,
  color = C.cy,
  h = 6,
}: {
  pct: number;
  color?: string;
  h?: number;
}) => (
  <div
    style={{
      background: C.sfH,
      borderRadius: 4,
      height: h,
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        width: `${Math.min(pct, 100)}%`,
        background: color,
        height: '100%',
        borderRadius: 4,
        transition: 'width .5s ease',
      }}
    />
  </div>
);

// ── Spark ────────────────────────────────────────────────────────────
export const Spark = ({
  values,
  color,
  h = 70,
}: {
  values: number[];
  color: string;
  h?: number;
}) => {
  const mx = Math.max(...values);
  const mn = Math.min(...values);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: h }}>
      {values.map((v, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            background: color,
            height: `${((v - mn) / (mx - mn || 1)) * 85 + 15}%`,
            borderRadius: '2px 2px 0 0',
            opacity: 0.35 + 0.65 * (i / values.length),
          }}
        />
      ))}
    </div>
  );
};

// ── LiveDot ──────────────────────────────────────────────────────────
export const LiveDot = ({ c = C.gr }: { c?: string }) => (
  <span
    style={{
      display: 'inline-block',
      width: 8,
      height: 8,
      borderRadius: '50%',
      background: c,
      animation: 'pulse 1.6s infinite',
    }}
  />
);

// ── Tabs ─────────────────────────────────────────────────────────────
export const Tabs = ({
  tabs,
  active,
  set,
}: {
  tabs: string[];
  active: string;
  set: (t: string) => void;
}) => (
  <div
    style={{
      display: 'flex',
      gap: 3,
      background: C.sfH,
      border: `1px solid ${C.br}`,
      borderRadius: 8,
      padding: 4,
      width: 'fit-content',
      flexWrap: 'wrap',
    }}
  >
    {tabs.map((t) => (
      <button
        key={t}
        onClick={() => set(t)}
        style={{
          padding: '7px 16px',
          borderRadius: 6,
          border: active === t ? `1px solid ${C.cy}40` : '1px solid transparent',
          background: active === t ? C.cy + '18' : 'transparent',
          color: active === t ? C.cy : C.mu,
          fontFamily: FF,
          fontWeight: 600,
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {t}
      </button>
    ))}
  </div>
);

// ── Sec ──────────────────────────────────────────────────────────────
export const Sec = ({
  ey,
  title,
  sub,
  center,
}: {
  ey?: string;
  title: string;
  sub?: string;
  center?: boolean;
}) => (
  <div
    style={{
      marginBottom: 24,
      ...(center ? { textAlign: 'center' as const } : {}),
    }}
  >
    {ey && (
      <div
        style={{
          fontSize: 11,
          color: C.cy,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          fontWeight: 700,
          marginBottom: 7,
        }}
      >
        {ey}
      </div>
    )}
    <h2
      style={{
        fontSize: 'clamp(18px,2.4vw,32px)',
        fontWeight: 800,
        color: C.gh,
        margin: '0 0 8px',
        lineHeight: 1.15,
        fontFamily: FF,
      }}
    >
      {title}
    </h2>
    {sub && (
      <p
        style={{
          color: C.mL,
          fontSize: 14,
          maxWidth: 560,
          margin: center ? '0 auto' : 0,
          lineHeight: 1.8,
        }}
      >
        {sub}
      </p>
    )}
  </div>
);
