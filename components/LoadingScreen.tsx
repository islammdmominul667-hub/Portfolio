
import React, { useState, useEffect, useRef } from 'react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasStarted = useRef(false);
  const lastProgress = useRef(0);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    const totalDuration = 6000; 
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const timeRatio = Math.min(1, elapsed / totalDuration);
      
      const ease = (t: number) => {
        if (t < 0.2) return t * 0.4;
        if (t < 0.6) return 0.08 + (t - 0.2) * 1.8;
        if (t < 0.9) return 0.8 + (t - 0.6) * 0.6;
        return 0.98 + (t - 0.9) * 0.2;
      };

      let nextProgress = ease(timeRatio) * 100;
      
      if (nextProgress < lastProgress.current) {
        nextProgress = lastProgress.current + (Math.random() * 0.1);
      }
      
      const finalVal = timeRatio >= 1 ? 100 : Math.min(99.9, nextProgress);
      lastProgress.current = finalVal;
      setProgress(finalVal);

      if (timeRatio >= 1) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
          setIsExiting(true);
          setTimeout(onComplete, 500);
        }, 300);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  const displayProgress = Math.floor(progress).toString().padStart(2, '0');

  return (
    <div className={`fixed inset-0 z-[300] bg-red-600 flex items-center justify-center transition-all duration-1000 ease-in-out ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      
      <div className="relative w-[85vw] h-[75vh] border-[3px] border-white overflow-hidden shadow-2xl">
        
        {/* Background Layer (Static) */}
        <div className="absolute inset-0 bg-red-600 flex items-center justify-center overflow-hidden">
          <div className="font-mono text-[14vw] md:text-[10vw] font-black leading-none text-white select-none tracking-tighter">
            {displayProgress}%
          </div>
        </div>

        {/* Foreground Layer (Filling) */}
        <div 
          className="absolute inset-y-0 left-0 bg-white overflow-hidden transition-all duration-200 ease-out z-10"
          style={{ width: `${progress}%` }}
        >
          <div className="relative w-[85vw] h-full flex items-center justify-center overflow-hidden">
            <div className="font-mono text-[14vw] md:text-[10vw] font-black leading-none text-red-600 select-none tracking-tighter">
              {displayProgress}%
            </div>
          </div>
        </div>

      </div>

      <style>{`
        body {
          overflow: hidden !important;
        }
      `}</style>
    </div>
  );
};
