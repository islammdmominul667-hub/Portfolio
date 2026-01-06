
import React, { useState, useEffect, useRef } from 'react';

export const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    // We use a simple setInterval to guarantee state updates occur.
    // This is more robust than requestAnimationFrame for this specific "fake loader" use case
    // as it doesn't depend on the browser's refresh rate logic which can sometimes stall in specific dev environments.
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }

        // Nonlinear progress simulation:
        // 0-30%: Fast
        // 30-70%: Moderate
        // 70-90%: Slow (simulating "heavy lifting")
        // 90-100%: Fast finish
        let increment = 0;
        if (prev < 30) increment = Math.random() * 2 + 1.5;
        else if (prev < 70) increment = Math.random() * 1 + 0.5;
        else if (prev < 90) increment = Math.random() * 0.5 + 0.2;
        else increment = Math.random() * 2 + 1;

        const next = prev + increment;
        return next > 100 ? 100 : next;
      });
    }, 50); // Update roughly every 50ms (20fps logic update)

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Trigger completion logic only once when we hit 100%
    if (progress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;
      
      const exitTimer = setTimeout(() => {
        setIsExiting(true);
        // Wait for the exit transition (opacity/scale) to finish before unmounting
        setTimeout(onComplete, 800); 
      }, 500); // Small pause at 100% before flying out

      return () => clearTimeout(exitTimer);
    }
  }, [progress, onComplete]);

  // Format purely for display: 00, 01, ... 100
  const displayProgress = Math.floor(progress).toString().padStart(2, '0');

  return (
    <div 
      className={`
        fixed inset-0 z-[9999] bg-red-600 flex items-center justify-center 
        transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]
        ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}
      `}
    >
      {/* Force body lock while loading component is mounted */}
      <style>{`body { overflow: hidden !important; }`}</style>
      
      <div className="relative w-[85vw] h-[75vh] border-[3px] border-white overflow-hidden shadow-2xl bg-red-600">
        
        {/* Layer 1: Background Text (White on Red) */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="font-mono text-[14vw] md:text-[10vw] font-black leading-none text-white select-none tracking-tighter">
            {displayProgress}%
          </div>
        </div>

        {/* Layer 2: Foreground Mask (Red on White) 
            The width animates to reveal the inverted text color.
        */}
        <div 
          className="absolute inset-y-0 left-0 bg-white overflow-hidden z-10"
          style={{ 
            width: `${progress}%`,
            transition: 'width 50ms linear' // Smooth out the interval steps slightly
          }}
        >
          {/* 
             Inner container is fixed to full width so the text stays 
             perfectly aligned with the background layer 
          */}
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
