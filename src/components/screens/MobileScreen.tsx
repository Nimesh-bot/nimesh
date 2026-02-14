'use client'

import { useState, useEffect, ReactElement } from 'react';
import Image from 'next/image';

import ApplicationWindow from './ApplicationWindow';
import { HobbyIcon } from '../../../public/icons/HobbyIcon';
import { PersonalIcon } from '../../../public/icons/PersonalIcon';
import { CareerIcon } from '../../../public/icons/CareerIcon';
import { SkillsIcon } from '../../../public/icons/SkillsIcon';
import { icons } from '@/app/icons';


interface Application {
  id: string;
  name: string;
  icon: ReactElement;
}

interface Actions {
  id: string;
  name: string;
  icon: ReactElement;
  onClick: () => void;
}

const applications: Application[] = [
  { id: 'personal', name: 'Personal Info', icon: <PersonalIcon size={45} color='var(--body)' /> },
  { id: 'career', name: 'Career History', icon: <CareerIcon size={45} color='var(--body)' /> },
  { id: 'skills', name: 'Skills', icon: <SkillsIcon size={45} color='var(--body)' /> },
  { id: 'hobbies', name: 'Hobbies', icon: <HobbyIcon size={45} color='var(--body)' /> },
];

const actions: Actions[] = [
  { 
    id: 'linkedIn', 
    name: 'LinkedIn', 
    icon: <Image src={icons.linkedin} alt="LinkedIn" width={24} height={24} className='brightness-0 invert-100' />, 
    onClick: () => window.open(process.env.LINKEDIN_PROFILE, '_blank')
  },
  { 
    id: 'github', 
    name: 'GitHub', 
    icon: <Image src={icons.github} alt="GitHub" width={24} height={24} className='brightness-0 invert-100' />, 
    onClick: () => window.open(process.env.GITHUB_PROFILE, '_blank')
  },
];

interface MobileScreenProps {
  openApps: string[];
  onOpenApp: (appId: string) => void;
  onCloseApp: (appId: string) => void;
}

export default function MobileScreen({ openApps, onOpenApp, onCloseApp }: MobileScreenProps) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [date, setDate] = useState(new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-full h-full overflow-hidden select-none"
      style={{ background: 'var(--gradient-bg)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-72 h-72 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, var(--secondary-dim), transparent)' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-56 h-56 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, var(--primary-dim), transparent)' }} />
      </div>

      <div className="relative z-10 flex items-center justify-between px-5 pt-3 pb-1">
        <span className="text-white text-xs font-semibold">{time}</span>
        <div className="flex items-center gap-1.5">
          <span className="text-success text-xs">●</span>
          <span className="text-white text-xs">●●●●</span>
          <span className="text-white text-xs">🔋</span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center pt-6 pb-4">
        <p className="text-white/40 text-xs font-mono tracking-widest uppercase mb-1">{date}</p>
        <p className="text-white font-bold tracking-tight" style={{ fontSize: '3.5rem', lineHeight: 1 }}>{time}</p>
      </div>

      <div className="relative z-10 px-4 grid grid-cols-3 gap-4 mt-4">
        {applications.map((app) => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{
                background: 'var(--glass-md)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border-hi)',
                boxShadow: 'var(--shadow-icon)',
              }}
            >
              {app.icon}
            </div>
            <span className="text-white text-xs font-medium drop-shadow">{app.name}</span>
          </button>
        ))}

        {actions.map((action) => (
          <button
            key={action.id}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{
                background: 'var(--glass-md)',
                backdropFilter: 'blur(10px)',
                border: '1px solid var(--glass-border-hi)',
                boxShadow: 'var(--shadow-icon)',
              }}
            >
              {action.icon}
            </div>
            <span className="text-white text-xs font-medium drop-shadow">{action.name}</span>
          </button>
        ))} 
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'var(--scanline-white)' }}
      />

      {openApps.map((appId) => {
        const app = applications.find(a => a.id === appId);
        if (!app) return null;
        return (
          <ApplicationWindow
            key={appId}
            appId={appId}
            title={app.name}
            icon={app.icon}
            onClose={() => onCloseApp(appId)}
            isMobile
          />
        );
      })}
    </div>
  );
}
