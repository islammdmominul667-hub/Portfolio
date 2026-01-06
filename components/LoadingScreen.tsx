
import React, { useState, useEffect, useRef } from 'react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Nonlinear progress simulation
        let increment = 0;
        if (prev < 30) increment = Math.random() * 2 + 1.5;
        else if (prev < 70) increment = Math.random() * 1 + 0.5;
        else if (prev < 90) increment = Math.random() * 0.5 + 0.2;
        else increment = Math.random() * 2 + 1;

        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 50);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = ''; // Unlock scroll on unmount
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onComplete, 800); 
      }, 500);

      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  const displayProgress = Math.floor(progress).toString().padStart(2, '0');

  return (
    <div 
      style={{ zIndex: 99999 }} 
      className={`
        fixed inset-0 bg-red-600 flex items-center justify-center 
        transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
        ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}
      `}
    >
      <div className="relative w-[85vw] h-[75vh] border-[3px] border-white overflow-hidden shadow-2xl bg-red-600">
        
        {/* Layer 1: Background Text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-[14vw] md:text-[10vw] font-black leading-none text-white select-none tracking-tighter">
            {displayProgress}%
          </div>
        </div>

        {/* Layer 2: Foreground Mask */}
        <div 
          className="absolute inset-y-0 left-0 bg-white overflow-hidden z-10"
          style={{ 
            width: `${progress}%`,
            transition: 'width 50ms linear'
          }}
        >
          <div className="relative w-[85vw] h-full flex items-center justify-center">
             <div className="font-mono text-[14vw] md:text-[10vw] font-black leading-none text-red-600 select-none tracking-tighter">
              {displayProgress}%
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
