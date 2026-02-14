'use client';

import { useEffect, useRef } from 'react';

interface JoystickProps {
  outputRef: React.RefObject<{ x: number; z: number }>;
  onActiveChange?: (active: boolean) => void;
}

const RADIUS = 60;

export default function Joystick({ outputRef, onActiveChange }: JoystickProps) {
  const baseRef = useRef<HTMLDivElement>(null);
  const knobRef = useRef<HTMLDivElement>(null);
  const touchIdRef = useRef<number | null>(null);

  useEffect(() => {
    const base = baseRef.current;
    const knob = knobRef.current;
    if (!base || !knob) return;

    const getBaseCenter = () => {
      const rect = base.getBoundingClientRect();
      return { cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 };
    };

    const onTouchStart = (e: TouchEvent) => {
      if (touchIdRef.current !== null) return;
      const touch = e.changedTouches[0];
      touchIdRef.current = touch.identifier;
      onActiveChange?.(true);
      e.preventDefault();
    };

    const onTouchMove = (e: TouchEvent) => {
      if (touchIdRef.current === null) return;
      let touch: Touch | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touch = e.changedTouches[i];
          break;
        }
      }
      if (!touch) return;

      const { cx, cy } = getBaseCenter();
      const dx = touch.clientX - cx;
      const dy = touch.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const clampedDist = Math.min(dist, RADIUS);
      const angle = Math.atan2(dy, dx);

      const kx = Math.cos(angle) * clampedDist;
      const ky = Math.sin(angle) * clampedDist;

      knob.style.transform = `translate(calc(-50% + ${kx}px), calc(-50% + ${ky}px))`;

      // Normalize output: x = left/right, z = forward/backward (inverted Y)
      outputRef.current = {
        x: (kx / RADIUS),
        z: -(ky / RADIUS),
      };

      e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          knob.style.transform = 'translate(-50%, -50%)';
          outputRef.current = { x: 0, z: 0 };
          onActiveChange?.(false);
          break;
        }
      }
    };

    base.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    window.addEventListener('touchcancel', onTouchEnd);

    return () => {
      base.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);
    };
  }, [outputRef, onActiveChange]);

  return (
    <div
      ref={baseRef}
      className="absolute bottom-28 left-8 z-40"
      style={{
        width: RADIUS * 2,
        height: RADIUS * 2,
        borderRadius: '50%',
        background: 'var(--glass-sm)',
        border: '2px solid var(--glass-light)',
        boxShadow: '0 0 20px var(--primary-glow-sm)',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {/* Knob */}
      <div
        ref={knobRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 44,
          height: 44,
          borderRadius: '50%',
          background: 'var(--glass-heavy)',
          border: '2px solid var(--primary-border)',
          boxShadow: 'var(--shadow-knob)',
          pointerEvents: 'none',
          transition: 'box-shadow 0.1s',
        }}
      />
    </div>
  );
}
