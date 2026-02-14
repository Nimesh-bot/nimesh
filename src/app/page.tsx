'use client'

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LandingScreen from '@/components/LandingScreen';

const Scene = dynamic(() => import('@/components/Scene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <p className="text-white">...</p>
    </div>
  ),
});

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  if (showLanding) {
    return <LandingScreen onComplete={() => setShowLanding(false)} />;
  }

  return <Scene />;
}
