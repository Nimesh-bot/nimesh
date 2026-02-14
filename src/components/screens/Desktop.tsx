'use client'

import { useState, useEffect, ReactElement } from 'react';

import ApplicationWindow from './ApplicationWindow';
import { MenuIcon } from '../../../public/icons/MenuIcon';
import { CareerIcon } from '../../../public/icons/CareerIcon';
import { HobbyIcon } from '../../../public/icons/HobbyIcon';
import { PersonalIcon } from '../../../public/icons/PersonalIcon';
import { SkillsIcon } from '../../../public/icons/SkillsIcon';

import { icons } from '@/app/icons';

import React from 'react';
import Image from 'next/image';

interface Application {
  id: string;
  name: string;
  icon: ReactElement;
  executable: string;
}

const applications: Application[] = [
  { id: 'personal', name: 'Personal Info', icon: <PersonalIcon size={45} color='var(--body)' />, executable: 'personal-information.exe' },
  { id: 'career', name: 'Career History', icon: <CareerIcon size={45} color='var(--body)' />, executable: 'career-history.exe' },
  { id: 'skills', name: 'Skills', icon: <SkillsIcon size={45} color='var(--body)' />, executable: 'skills.exe' },
  { id: 'hobbies', name: 'Hobbies', icon: <HobbyIcon size={45} color='var(--body)' />, executable: 'hobbies.exe' },
];

interface DesktopProps {
  onExit?: () => void;
  isMobile?: boolean;
  onAppOpened?: (appId: string) => void;
}

export default function Desktop({ onExit, isMobile = false, onAppOpened }: DesktopProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [openApps, setOpenApps] = useState<string[]>([]);
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      const screen = document.getElementById('desktop-screen');
      if (!screen) return;
      const rect = screen.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setCursorPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  const handleOpenApp = (appId: string) => {
    if (!openApps.includes(appId)) setOpenApps([...openApps, appId]);
    setSelectedApp(appId);
    onAppOpened?.(appId);
  };

  const handleCloseApp = (appId: string) => setOpenApps(openApps.filter(id => id !== appId));

  const handleShutdown = () => onExit?.();

  return (
    <div
      id="desktop-screen"
      className="relative w-full h-full overflow-hidden"
      style={{ background: 'var(--gradient-desktop)' }}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'var(--desktop-radial)' }}
      />

      <div className={`relative z-10 p-4 grid gap-4 auto-rows-min ${isMobile ? 'grid-cols-2' : 'grid-cols-4 p-8 gap-6'}`}>
        {applications.map((app) => (
          <button
            key={app.id}
            className={`flex flex-col items-center gap-2 p-4 rounded-lg transition-all active:bg-white/20 hover:bg-white/10 ${selectedApp === app.id ? 'bg-white/20 ring-2 ring-primary' : ''}`}
            onClick={() => handleOpenApp(app.id)}
            onDoubleClick={() => !isMobile && handleOpenApp(app.id)}
          >
            <div className={`drop-shadow-lg ${isMobile ? 'text-5xl' : 'text-6xl'}`}>
              {app.icon}
            </div>
            <div className="text-center">
              <div className={`text-white font-semibold drop-shadow-md ${isMobile ? 'text-base' : 'text-sm'}`}>
                {app.name}
              </div>
              {!isMobile && (
                <div className="text-primary text-xs font-mono opacity-80">
                  {app.executable}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className={`absolute bottom-0 left-0 right-0 bg-card/90 backdrop-blur-md border-t border-border/50 flex items-center justify-between px-4 z-[50] ${isMobile ? 'h-16' : 'h-14'}`}>
        <div className="flex items-center gap-3 relative">
          <button
            onClick={() => setShowStartMenu(!showStartMenu)}
            className={`rounded hover:brightness-110 transition-all hover:bg-[var(--secondary)]/60 ${isMobile ? 'px-5 py-3 text-xl' : 'mx-2 px-2 py-1 text-lg'}`}
          >
            <MenuIcon size={28} color='var(--body)' />
          </button>

          {showStartMenu && (
            <div className={`absolute bottom-full left-0 mb-2 bg-card/95 backdrop-blur-md border border-border rounded-lg shadow-2xl overflow-hidden ${isMobile ? 'w-56' : 'w-64'}`}>
              <div className="border-b border-border">
                <div className="px-4 py-2 bg-card-mid/50 text-xs font-mono text-muted uppercase tracking-wider">
                  Hack Into
                </div>
                <a href={process.env.GITHUB_PROFILE} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors active:bg-primary/20">
                  <Image src={icons.github} alt="GitHub" width={24} height={24} />
                  <span className="text-white font-medium">GitHub</span>
                </a>
                <a href={process.env.LINKEDIN_PROFILE} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors active:bg-primary/20">
                  <Image src={icons.linkedin} alt="LinkedIn" width={24} height={24} />
                  <span className="text-white font-medium">LinkedIn</span>
                </a>
              </div>
              <div>
                <div className="px-4 py-2 bg-card-mid/50 text-xs font-mono text-muted uppercase tracking-wider">
                  System
                </div>
                <button onClick={handleShutdown}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-danger/20 transition-colors active:bg-danger/30">
                  <Image src={icons.shutdown} alt="Shutdown" width={24} height={24} />
                  <span className="text-white font-medium">Shutdown</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white text-sm">
            <span className="text-success">●</span>
            {!isMobile && <span>Online</span>}
          </div>
          <div className={`text-white font-mono bg-bg/30 px-3 py-1 rounded ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {time}
          </div>
        </div>
      </div>

      {/* Open application windows */}
      {openApps.map((appId) => {
        const app = applications.find(a => a.id === appId);
        if (!app) return null;

        const resizedIcon = React.cloneElement(app.icon, {
          size: 21
        } as any)

        return (
          <ApplicationWindow
            key={appId}
            appId={appId}
            title={app.name}
            icon={resizedIcon}
            onClose={() => handleCloseApp(appId)}
            isMobile={isMobile}
          />
        );
      })}

      {!isMobile && (
        <div
          className="absolute w-4 h-4 bg-white pointer-events-none mix-blend-difference z-200"
          style={{
            left: `${cursorPosition.x}%`,
            top: `${cursorPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            clipPath: 'polygon(0 0, 0 100%, 30% 70%, 50% 100%, 60% 90%, 40% 60%, 100% 50%)',
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--scanline-white)' }}
      />
    </div>
  );
}
