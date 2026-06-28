'use client';

import { useEffect, useRef } from 'react';
import { C } from '@/lib/constants';

export function Topo({ op = 0.6 }: { op?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    let fr: number;

    cv.width = cv.offsetWidth;
    cv.height = cv.offsetHeight;
    const W = cv.width;
    const H = cv.height;

    const T = [
      { c: '#00E5FF' },
      { c: '#FFB800' },
      { c: '#00E396' },
      { c: '#A78BFA' },
      { c: '#6B7A99' },
    ];

    const N = Array.from({ length: 22 }, (_, i) => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 3 + 2,
      t: T[i % T.length],
      p: Math.random() * Math.PI * 2,
    }));

    const draw = () => {
      ctx!.clearRect(0, 0, W, H);

      for (let i = 0; i < N.length; i++) {
        for (let j = i + 1; j < N.length; j++) {
          const dx = N[i].x - N[j].x;
          const dy = N[i].y - N[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 170) {
            ctx!.beginPath();
            ctx!.moveTo(N[i].x, N[i].y);
            ctx!.lineTo(N[j].x, N[j].y);
            ctx!.strokeStyle = `rgba(0,229,255,${0.065 * (1 - d / 170)})`;
            ctx!.lineWidth = 0.7;
            ctx!.stroke();
          }
        }
      }

      N.forEach((n) => {
        n.p += 0.022;
        const g = Math.sin(n.p) * 0.5 + 0.5;
        const gr = ctx!.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 5);
        gr.addColorStop(0, n.t.c + '26');
        gr.addColorStop(1, 'transparent');
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r * 5, 0, Math.PI * 2);
        ctx!.fillStyle = gr;
        ctx!.fill();

        ctx!.beginPath();
        ctx!.arc(n.x, n.y, n.r + g * 0.8, 0, Math.PI * 2);
        ctx!.fillStyle = n.t.c;
        ctx!.shadowColor = n.t.c;
        ctx!.shadowBlur = 9 + g * 5;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });

      fr = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(fr);
  }, []);

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: op,
      }}
    />
  );
}
