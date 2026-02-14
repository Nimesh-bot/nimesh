'use client'

import { useEffect, useState } from 'react';
import BootScreen from './BootScreen';
import MobileBootScreen from './MobileBootScreen';
import Desktop from './Desktop';
import MobileScreen from './MobileScreen';

interface ComputerScreenProps {
  onExit: () => void;
  isMobile?: boolean;
  onAppOpened?: (appId: string) => void;
}

export default function ComputerScreen({ onExit, isMobile = false, onAppOpened }: ComputerScreenProps) {
  const [currentScreen, setCurrentScreen] = useState<'boot' | 'desktop'>('boot');
  const [openApps, setOpenApps] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        onExit();
      }
    };

    if (document.pointerLockElement) {
      document.exitPointerLock();
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScreen('desktop');
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenApp = (appId: string) => {
    if (!openApps.includes(appId)) setOpenApps(prev => [...prev, appId]);
    onAppOpened?.(appId);
  };

  const handleCloseApp = (appId: string) => {
    setOpenApps(prev => prev.filter(id => id !== appId));
  };

  const handleBack = () => {
    setOpenApps(prev => prev.slice(0, -1));
  };

  const handleHome = () => {
    setOpenApps([]);
  };

  const canGoBack = currentScreen === 'desktop' && openApps.length > 0;
  const canGoHome = currentScreen === 'desktop';

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex flex-col bg-bg z-50 cursor-none">
        <div className="flex-1 overflow-hidden relative">
          {currentScreen === 'boot'
            ? <MobileBootScreen />
            : <MobileScreen
              openApps={openApps}
              onOpenApp={handleOpenApp}
              onCloseApp={handleCloseApp}
            />
          }
        </div>

        <div
          className="flex items-center justify-around border-t border-white/10"
          style={{ height: 52, background: 'var(--bg)' }}
        >
          <button
            onClick={handleBack}
            disabled={!canGoBack}
            className="flex items-center justify-center w-12 h-12 active:scale-90 transition-transform disabled:opacity-25"
            title="Back"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="var(--icon-color)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            onClick={handleHome}
            disabled={!canGoHome}
            className="flex items-center justify-center w-12 h-12 active:scale-90 transition-transform disabled:opacity-25"
            title="Home"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="var(--icon-color)" strokeWidth="2" />
            </svg>
          </button>

          <button
            onClick={onExit}
            className="flex items-center justify-center w-12 h-12 active:scale-90 transition-transform"
            title="Lock"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="11" width="14" height="10" rx="2" stroke="var(--icon-color)" strokeWidth="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="var(--icon-color)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[var(--bg)] shadow-xl shadow-[var(--shadow-glow)] backdrop-blur-md z-50 cursor-none">
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-body font-mono bg-bg/25 px-4 py-3 rounded-lg border border-body/50">
        <span className="text-muted">Press</span>{' '}
        <kbd className="bg-slate-300/20 border border-white px-3 py-1 rounded font-bold">Backspace</kbd>{' '}
        <span className="text-muted">to exit</span>
      </div>

      <div
        className="relative border-4 border-border overflow-hidden cursor-none w-[80vw] h-[70vh] rounded-lg"
      >
        {currentScreen === 'boot'
          ? <BootScreen />
          : <Desktop onExit={onExit} isMobile={false} onAppOpened={onAppOpened} />
        }
      </div>
    </div>
  );
}
