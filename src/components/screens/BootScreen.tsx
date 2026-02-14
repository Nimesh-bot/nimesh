'use client'

import { useEffect, useState } from 'react';

export default function BootScreen() {
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const screen = document.getElementById('boot-screen');
      if (!screen) return;

      const rect = screen.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setCursorPosition({ x: clampedX, y: clampedY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      id="boot-screen"
      className="relative w-full h-full overflow-hidden"
      style={{ background: 'var(--gradient-boot)' }}
    >
      {/* Scanline effect */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--scanline)' }}
      />

      {/* Screen content */}
      <div className="relative z-10 p-8 h-full flex flex-col">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-primary/30">
          <h1 className="text-2xl font-bold text-primary font-mono">
            SYSTEM BOOT
          </h1>
        </div>

        <div className="flex-1 bg-bg/50 rounded p-4 font-mono text-success overflow-auto">
          <div className="space-y-2">
            <p className="text-primary">&gt; Initializing system...</p>
            <p className="text-muted">BIOS v2.4.1</p>
            <p className="text-muted">Loading kernel modules...</p>

            <div className="mt-4 space-y-1">
              <p className="text-success">[OK] CPU initialized</p>
              <p className="text-success">[OK] Memory check passed: 16GB</p>
              <p className="text-success">[OK] Storage devices mounted</p>
              <p className="text-success">[OK] Network interface ready</p>
              <p className="text-success">[OK] Graphics driver loaded</p>
              <p className="text-warning animate-pulse">[WAIT] Loading user profile...</p>
            </div>

            <div className="mt-6">
              <p className="text-primary">&gt; Access Level: ??¿?</p>
              <p className="text-subtle mt-2">// Loading desktop environment...</p>
            </div>
          </div>
        </div>

        {/* Custom cursor */}
        <div
          className="absolute w-4 h-4 bg-primary pointer-events-none mix-blend-screen z-[200]"
          style={{
            left: `${cursorPosition.x}%`,
            top: `${cursorPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            clipPath: 'polygon(0 0, 0 100%, 30% 70%, 50% 100%, 60% 90%, 40% 60%, 100% 50%)',
            filter: 'drop-shadow(0 0 4px var(--primary-glow-strong))'
          }}
        />
      </div>

      {/* Screen glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--glow-radial)' }}
      />
    </div>
  );
}
