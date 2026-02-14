'use client'

import { JSX, ReactElement, useState, useRef, useCallback } from 'react';
import ProfileScreen from './AppScreens/ProfileScreen/ProfileScreen';
import SkillsScreen from './AppScreens/SkillsScreen/SkillsScreen';
import CareerScreen from './AppScreens/CareerScreen/CareerScreen';
import HobbiesScreen from './AppScreens/HobbiesScreen/HobbiesScreen';

interface ApplicationWindowProps {
  appId: string;
  title: string;
  icon: ReactElement;
  onClose: () => void;
  isMobile?: boolean;
}

function getAppContent(appId: string, isMobile: boolean): JSX.Element {
  switch (appId) {
    case 'career':   return <CareerScreen />;
    case 'skills':   return <SkillsScreen isMobile={isMobile} />;
    case 'hobbies':  return <HobbiesScreen isMobile={isMobile} />;
    case 'personal': return <ProfileScreen />;
    default: return (
      <div className="flex items-center justify-center h-full text-subtle">
        <p>No content available for this application.</p>
      </div>
    );
  }
}

// Staggered spawn positions so windows don't overlap exactly
const SPAWN: Record<string, { x: number; y: number }> = {
  personal: { x: 40, y: 30 },
  career: { x: 72, y: 56 },
  skills: { x: 136, y: 108 },
  hobbies: { x: 104, y: 82 },
};

const WIN_W = 560;
const WIN_H = 460;

export default function ApplicationWindow({ appId, title, icon, onClose, isMobile = false }: ApplicationWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);
  const [pos, setPos] = useState(SPAWN[appId] ?? { x: 60, y: 40 });

  // Stores drag start info — kept in a ref so pointermove never re-renders
  const drag = useRef<{ ox: number; oy: number; px: number; py: number } | null>(null);

  const titleBarHeight = isMobile ? 48 : 40;

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (isMaximized || isMobile) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { ox: e.clientX, oy: e.clientY, px: pos.x, py: pos.y };
  }, [isMaximized, isMobile, pos]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    setPos({
      x: Math.max(0, drag.current.px + e.clientX - drag.current.ox),
      y: Math.max(0, drag.current.py + e.clientY - drag.current.oy),
    });
  }, []);

  const handlePointerUp = useCallback(() => {
    drag.current = null;
  }, []);

  return (
    <div
      className={`absolute bg-card border-2 border-border overflow-hidden z-100 ${isMaximized || isMobile ? 'inset-0 rounded-none' : 'rounded-lg'
        }`}
      style={
        isMaximized || isMobile
          ? { boxShadow: 'var(--shadow-window)' }
          : { left: pos.x, top: pos.y, width: WIN_W, height: WIN_H, boxShadow: 'var(--shadow-window)' }
      }
    >
      {/* Title bar — drag handle */}
      <div
        className={`px-3 flex items-center justify-between select-none ${!isMaximized && !isMobile ? 'cursor-grab active:cursor-grabbing' : ''
          }`}
        style={{ height: titleBarHeight, background: 'var(--surface)' }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="flex items-center gap-2 pointer-events-none">
          <span className={isMobile ? 'text-2xl' : 'text-sm'}>{icon}</span>
          <span className={`text-white font-semibold ${isMobile ? 'text-base' : 'text-sm'}`}>{title}</span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {!isMobile && (
            <button
              className="w-6 h-6 bg-warning hover:brightness-110 rounded flex items-center justify-center text-xs font-bold"
              onPointerDown={e => e.stopPropagation()}
              onClick={() => setIsMaximized(v => !v)}
              title={isMaximized ? 'Restore' : 'Maximize'}
            >
              {isMaximized ? '◱' : '□'}
            </button>
          )}
          <button
            className={`bg-danger hover:bg-danger/80 active:bg-danger rounded flex items-center justify-center font-bold text-white ${isMobile ? 'w-9 h-9 text-base' : 'w-6 h-6 text-xs'
              }`}
            onPointerDown={e => e.stopPropagation()}
            onClick={onClose}
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content — no padding; each screen manages its own */}
      <div
        className="bg-card-mid overflow-hidden"
        style={{ height: `calc(100% - ${titleBarHeight}px)` }}
      >
        <div className="h-full font-mono text-body text-sm">
          {getAppContent(appId, isMobile)}
        </div>
      </div>
    </div>
  );
}
