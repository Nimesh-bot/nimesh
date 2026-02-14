'use client'

import { useEffect, useState } from 'react';

export default function MobileBootScreen() {
  const [step, setStep] = useState(0);

  const lines = [
    { text: 'Powering on...',                color: 'text-muted'   },
    { text: 'Checking integrity...',          color: 'text-muted'   },
    { text: '[OK] Bootloader verified',       color: 'text-success' },
    { text: '[OK] Kernel loaded',             color: 'text-success' },
    { text: '[OK] Sensors ready',             color: 'text-success' },
    { text: '[WARN] Unknown device detected', color: 'text-warning' },
    { text: 'Loading user environment...',    color: 'text-primary' },
  ];

  useEffect(() => {
    if (step >= lines.length) return;
    const t = setTimeout(() => setStep(s => s + 1), 320);
    return () => clearTimeout(t);
  }, [step, lines.length]);

  return (
    <div className="w-full h-full bg-bg flex flex-col items-center justify-center gap-8 px-6">
      {/* Brand logo */}
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl"
          style={{ background: 'var(--gradient-logo)', boxShadow: 'var(--shadow-logo)' }}
        >
          📱
        </div>
        <p className="text-primary font-mono text-xs tracking-widest uppercase">NimOS Mobile</p>
      </div>

      {/* Boot log */}
      <div className="w-full bg-bg/60 border border-primary-dim/50 rounded-xl p-4 font-mono text-xs space-y-1 min-h-[140px]">
        {lines.slice(0, step).map((line, i) => (
          <p key={i} className={line.color}>{line.text}</p>
        ))}
        {step < lines.length && (
          <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
        )}
      </div>

      {/* Loading bar */}
      <div className="w-full h-1 bg-card-mid rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(step / lines.length) * 100}%`, boxShadow: '0 0 8px var(--primary-glow-strong)' }}
        />
      </div>
    </div>
  );
}
