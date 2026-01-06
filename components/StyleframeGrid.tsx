import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, useMotionValue } from 'framer-motion';
import { Project } from '../types';

interface StyleframeGridProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  onLightboxToggle?: (isOpen: boolean) => void;
}

const ALL_FRAMES = [
  "/frames/NRF_1.png",
  "/frames/NRF_2.png",
  "/frames/NRF_3.png",
  "/frames/1ST_REG_1.png",
  "/frames/1ST_REG_2.png",
  "/frames/1ST_REG_3.png",
  "/frames/ELIGOVISION_1.png",
  "/frames/ELIGOVISION_3.png",
  "/frames/ELIGOVISION_2.png",
  "/frames/AMUR_1.png",
  "/frames/AMUR_2.png",
  "/frames/AMUR_3.png",
  "/frames/AMUR_4.png",
  "/frames/photo1.png",
  "/frames/photo1.png",
  "/frames/photo1.png",
];

const getThumb = (url: string) => {
  if (url.includes('picsum.photos')) {
    return url.replace('1000/1000', '500/500');
  }
  return url;
};

const AnimatedEye = () => {
  return (
    <div className="relative w-20 h-16 md:w-28 md:h-24 flex items-center justify-center pointer-events-none drop-shadow-xl">
      <svg 
        viewBox="0 0 120 100" 
        className="w-full h-full overflow-visible"
      >
        <motion.path
          d="M10 50 Q60 5 110 50 Q60 95 10 50 Z"
          fill="none"
          stroke="white" 
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{ scaleY: [1, 1, 0.1, 1] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.9, 0.95, 1],
            ease: "easeInOut"
          }}
        />
        <motion.circle
            cx="60"
            cy="50"
            r="16"
            fill="white"
            animate={{ scaleY: [1, 1, 0.1, 1] }}
            transition={{
            duration: 6,
            repeat: Infinity,
            times: [0, 0.9, 0.95, 1],
            ease: "easeInOut"
            }}
        />
      </svg>
    </div>
  );
};

// --- Isolated Lightbox Component ---
interface LightboxProps {
  src: string;
  index: number;
  total: number;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, index, total, onClose, onNext, onPrev }) => {
  const [loading, setLoading] = useState(true);

  // Reset loading when image source changes
  useEffect(() => {
    setLoading(true);
  }, [src]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.stopPropagation();
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  // Use createPortal to move the modal to document.body, avoiding z-index stacking issues
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-sm flex items-center justify-center cursor-auto" 
      onClick={(e) => {
        // Close on background click
        e.stopPropagation();
        onClose();
      }}
    >
        {/* Close Button */}
        <button 
            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[250] p-2 focus:outline-none cursor-pointer" 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
        >
            <svg className="w-8 h-8 md:w-10 md:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Prev Button */}
        <button 
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-[250] focus:outline-none hidden md:block cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
        >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
        </button>

        {/* Next Button */}
        <button 
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-4 z-[250] focus:outline-none hidden md:block cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onNext(); }}
        >
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Mobile Arrows */}
        <div className="absolute bottom-16 md:bottom-12 flex gap-12 md:hidden z-[250] left-1/2 -translate-x-1/2">
            <button onClick={(e) => { e.stopPropagation(); onPrev(); }} className="text-white/50 hover:text-white p-2 cursor-pointer"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg></button>
            <button onClick={(e) => { e.stopPropagation(); onNext(); }} className="text-white/50 hover:text-white p-2 cursor-pointer"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg></button>
        </div>

        {/* Main Content Area */}
        <div 
            className="relative w-full h-full flex items-center justify-center p-4 md:p-16 pointer-events-none"
        >
            {/* Loading Spinner */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
              </div>
            )}

            {/* Image */}
            <motion.img 
              key={src} // Key change triggers animation
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              src={src} 
              alt="" 
              className="relative z-10 max-w-full max-h-[70vh] md:max-h-[80vh] object-contain shadow-2xl pointer-events-auto select-none"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = Math.abs(offset.x) * velocity.x;
                if (swipe < -100) onNext();
                else if (swipe > 100) onPrev();
              }}
              onLoad={() => setLoading(false)}
            />

            {/* Counter */}
            <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 font-mono text-white/60 text-sm md:text-base tracking-[0.2em] uppercase pointer-events-auto whitespace-nowrap z-[210]">
                {String(index + 1).padStart(2, '0')}/{total}
            </div>
        </div>
    </div>,
    document.body
  );
};

export const StyleframeGrid: React.FC<StyleframeGridProps> = ({ projects, onProjectSelect, onLightboxToggle }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Preload images once
  useEffect(() => {
    ALL_FRAMES.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Global Scroll Lock Management - moved to parent for reliability
  const isLightboxOpen = lightboxIndex !== null;
  
  useEffect(() => {
    if (isLightboxOpen) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      // Disable scroll snap to prevent conflicts when re-enabling scroll
      document.documentElement.style.scrollSnapType = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.scrollSnapType = '';
    }

    return () => {
      // Ensure we clean up if component unmounts
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.documentElement.style.scrollSnapType = '';
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    if (onLightboxToggle) onLightboxToggle(isLightboxOpen);
  }, [isLightboxOpen, onLightboxToggle]);

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! + 1) % ALL_FRAMES.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prev) => (prev! - 1 + ALL_FRAMES.length) % ALL_FRAMES.length);
    }
  };

  const gridLayout = [
    { type: 'IMG', col: 'md:col-start-1 md:row-start-1 md:col-span-2 md:row-span-2', srcIdx: 0 },
    { type: 'EMPTY', col: 'md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-1' },
    { type: 'IMG', col: 'md:col-start-5 md:row-start-1 md:col-span-1 md:row-span-1', srcIdx: 1 },
    { type: 'IMG', col: 'md:col-start-4 md:row-start-2 md:col-span-1 md:row-span-1', srcIdx: 2 },
    { type: 'IMG', col: 'md:col-start-2 md:row-start-3 md:col-span-1 md:row-span-1', srcIdx: 3 },
    { type: 'IMG', col: 'md:col-start-3 md:row-start-3 md:col-span-2 md:row-span-2', srcIdx: 4 },
    { type: 'EMPTY', col: 'md:col-start-5 md:row-start-3 md:col-span-1 md:row-span-1' },
    { type: 'IMG', col: 'md:col-start-1 md:row-start-4 md:col-span-1 md:row-span-1', srcIdx: 5 },
    { type: 'EMPTY', col: 'md:col-start-1 md:row-start-5 md:col-span-1 md:row-span-1' },
    { type: 'IMG', col: 'md:col-start-2 md:row-start-5 md:col-span-2 md:row-span-2', srcIdx: 6 },
    { type: 'IMG', col: 'md:col-start-5 md:row-start-5 md:col-span-1 md:row-span-1', srcIdx: 7 },
    { type: 'IMG', col: 'md:col-start-4 md:row-start-6 md:col-span-1 md:row-span-1', srcIdx: 8 },
    { type: 'IMG', col: 'md:col-start-1 md:row-start-7 md:col-span-1 md:row-span-1', srcIdx: 9 },
    { type: 'IMG', col: 'md:col-start-3 md:row-start-7 md:col-span-1 md:row-span-1', srcIdx: 10 },
    { type: 'IMG', col: 'md:col-start-4 md:row-start-7 md:col-span-2 md:row-span-2', srcIdx: 11 },
    { type: 'IMG', col: 'md:col-start-2 md:row-start-8 md:col-span-1 md:row-span-1', srcIdx: 12 },
  ];

  return (
    <div 
      className={`w-full flex flex-col relative bg-red-600 ${isHoveringImage && !isMobile ? 'cursor-none' : ''}`}
      onMouseMove={handleMouseMove}
    >
      
      {/* Custom Animated Snappy Eye Cursor */}
      {!isMobile && (
        <motion.div
          className="fixed top-0 left-0 z-[150] pointer-events-none"
          style={{
            x: mouseX,
            y: mouseY,
            translateX: '-50%',
            translateY: '-50%',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: isHoveringImage && lightboxIndex === null ? 1 : 0,
            scale: isHoveringImage && lightboxIndex === null ? 1 : 0
          }}
          transition={{ duration: 0.1, ease: "linear" }}
        >
          <AnimatedEye />
        </motion.div>
      )}

      {/* Foreground Grid Layer */}
      <div className="relative z-10 w-full py-12 md:py-24">
        {isMobile ? (
          <div className="grid grid-cols-2 gap-0 px-8">
            {ALL_FRAMES.slice(0, 16).map((src, idx) => (
              <div 
                key={idx} 
                className="aspect-square relative overflow-hidden bg-black/10 cursor-pointer block" 
                onClick={() => setLightboxIndex(idx)}
              >
                 <img 
                    src={getThumb(src)} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover" 
                 />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-0 w-full px-16">
            {gridLayout.map((item, idx) => {
              if (item.type === 'EMPTY') {
                return <div key={`empty-${idx}`} className={`${item.col} aspect-square`}></div>;
              }
              return (
                <div 
                  key={`img-${idx}`} 
                  className={`${item.col} aspect-square relative bg-black/10 overflow-hidden group`} 
                  onMouseEnter={() => setIsHoveringImage(true)}
                  onMouseLeave={() => setIsHoveringImage(false)}
                  onClick={() => {
                    setLightboxIndex(item.srcIdx!);
                    setIsHoveringImage(false);
                  }}
                >
                  <img 
                    src={getThumb(ALL_FRAMES[item.srcIdx!])} 
                    alt="" 
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" 
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox via Isolated Component - No AnimatePresence to prevent exit bugs */}
      {lightboxIndex !== null && (
        <Lightbox 
          src={ALL_FRAMES[lightboxIndex]}
          index={lightboxIndex}
          total={ALL_FRAMES.length}
          onClose={() => setLightboxIndex(null)}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}
    </div>
  );
};