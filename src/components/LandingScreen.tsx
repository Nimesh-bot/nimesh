'use client'

import { useIsMobile } from '@/hooks/useIsMobile';
import { useState, useEffect } from 'react';

interface LandingScreenProps {
  onComplete: () => void;
}

const messages = [
  "You open your eyes",
  "its a dark room",
  "gather information and get out"
];

export default function LandingScreen({ onComplete }: LandingScreenProps) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < messages.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [step]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center cursor-pointer z-50"
      style={{
        background: 'radial-gradient(circle, rgba(20,20,20,1) 0%, rgba(0,0,0,1) 70%)',
      }}
      onClick={handleNext}
    >
      <div
        key={step}
        className="text-center"
        style={{
          animation: 'fadeInText 1.5s ease-in forwards',
          opacity: 0,
        }}
      >
        <style>{`
          @keyframes fadeInText {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
        <h1
          className="text-6xl font-bold tracking-wider"
          style={{
            background: 'linear-gradient(to bottom, #ffffff 0%, #888888 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 40px rgba(255,255,255,0.3)',
          }}
        >
          {messages[step]}
        </h1>
        <p className="mt-8 text-sm text-gray-500 opacity-70 animate-pulse">
          Click or press Enter to continue
        </p>
        <p className="fixed top-0 right-4 mt-8 text-sm text-gray-500" onClick={handleSkip}>
          Click to Skip
        </p>
      </div>
    </div>
  );
}
