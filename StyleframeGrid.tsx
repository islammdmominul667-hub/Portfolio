import React, { useState, useCallback, useEffect } from 'react';
import { Project } from '../types';

interface StyleframeGridProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  onLightboxToggle?: (isOpen: boolean) => void;
}

// Helper to generate a consistent "code" for display
const getProjectCode = (id: number) => `[PRJ_${String(id).padStart(2, '0')}]`;

export const StyleframeGrid: React.FC<StyleframeGridProps> = ({ projects, onProjectSelect, onLightboxToggle }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Frame list
  const allFrames = [
    "https://picsum.photos/id/10/800/800", 
    "https://picsum.photos/id/14/800/800", 
    "https://picsum.photos/id/19/800/800", 
    "https://picsum.photos/id/26/800/800",
    "https://picsum.photos/id/28/800/800",
    "https://picsum.photos/id/35/800/800",
    "https://picsum.photos/id/42/800/800",
    "https://picsum.photos/id/48/800/800",
    "https://picsum.photos/id/58/800/800",
    "https://picsum.photos/id/69/800/800",
    "https://picsum.photos/id/76/800/800",
    "https://picsum.photos/id/88/800/800",
    "https://picsum.photos/id/95/800/800",
    "https://picsum.photos/id/106/800/800",
    "https://picsum.photos/id/111/800/800",
    "https://picsum.photos/id/117/800/800",
    "https://picsum.photos/id/129/800/800",
    "https://picsum.photos/id/133/800/800",
    "https://picsum.photos/id/137/800/800",
    "https://picsum.photos/id/142/800/800",
    "https://picsum.photos/id/152/800/800",
    "https://picsum.photos/id/158/800/800",
    "https://picsum.photos/id/163/800/800",
    "https://picsum.photos/id/175/800/800",
    "https://picsum.photos/id/184/800/800",
    "https://picsum.photos/id/192/800/800",
    "https://picsum.photos/id/200/800/800",
    "https://picsum.photos/id/203/800/800",
    "https://picsum.photos/id/216/800/800",
    "https://picsum.photos/id/220/800/800",
    "https://picsum.photos/id/237/800/800",
  ];

  // Manual Layout Configuration for the 5-column grid
  // Grid Width: 5 Columns.
  // Each Project spans 2 rows (a "Band").
  
  const gridLayout = [
    // --- PROJECT 1: 1 Large, 2 Small, Name. (Diagonal Smalls) ---
    // [ Large ] [ Large ] [ Name  ] [ Empty ] [ Small ]
    // [ Large ] [ Large ] [ Empty ] [ Small ] [ Empty ]
    { type: 'IMG', size: 'MED', col: 'col-start-1', row: 'row-start-1', srcIdx: 0 },
    { type: 'INFO', size: 'SM', col: 'col-start-3', row: 'row-start-1', projectIdx: 0 },
    { type: 'IMG', size: 'SM', col: 'col-start-5', row: 'row-start-1', srcIdx: 1 },
    { type: 'IMG', size: 'SM', col: 'col-start-4', row: 'row-start-2', srcIdx: 2 },

    // --- PROJECT 2: 2 Small, 1 Large, Name. (Diagonal Smalls) ---
    // [ Empty ] [ Small ] [ Large ] [ Large ] [ Name  ]
    // [ Small ] [ Empty ] [ Large ] [ Large ] [ Empty ]
    { type: 'IMG', size: 'SM', col: 'col-start-2', row: 'row-start-3', srcIdx: 3 },
    { type: 'IMG', size: 'MED', col: 'col-start-3', row: 'row-start-3', srcIdx: 4 },
    { type: 'INFO', size: 'SM', col: 'col-start-5', row: 'row-start-3', projectIdx: 1 },
    { type: 'IMG', size: 'SM', col: 'col-start-1', row: 'row-start-4', srcIdx: 5 },

    // --- PROJECT 3: 2 Small, 1 Large, Name. (Diagonal Smalls) ---
    // [ Name  ] [ Large ] [ Large ] [ Empty ] [ Small ]
    // [ Empty ] [ Large ] [ Large ] [ Small ] [ Empty ]
    { type: 'INFO', size: 'SM', col: 'col-start-1', row: 'row-start-5', projectIdx: 2 },
    { type: 'IMG', size: 'MED', col: 'col-start-2', row: 'row-start-5', srcIdx: 6 },
    { type: 'IMG', size: 'SM', col: 'col-start-5', row: 'row-start-5', srcIdx: 7 },
    { type: 'IMG', size: 'SM', col: 'col-start-4', row: 'row-start-6', srcIdx: 8 },

    // --- PROJECT 4: 1 Large, 3 Small. (Plus Name). (Diagonal Pattern) ---
    // [ Small ] [ Empty ] [ Small ] [ Large ] [ Large ]
    // [ Empty ] [ Small ] [ Name  ] [ Large ] [ Large ]
    { type: 'IMG', size: 'SM', col: 'col-start-1', row: 'row-start-7', srcIdx: 9 },
    { type: 'IMG', size: 'SM', col: 'col-start-3', row: 'row-start-7', srcIdx: 10 },
    { type: 'IMG', size: 'MED', col: 'col-start-4', row: 'row-start-7', srcIdx: 11 },
    { type: 'IMG', size: 'SM', col: 'col-start-2', row: 'row-start-8', srcIdx: 12 },
    { type: 'INFO', size: 'SM', col: 'col-start-3', row: 'row-start-8', projectIdx: 3 },

    // --- PROJECT 5: 3 Small, 1 Large. (Plus Name). (Diagonal Pattern) ---
    // [ Large ] [ Large ] [ Name  ] [ Small ] [ Empty ]
    // [ Large ] [ Large ] [ Small ] [ Empty ] [ Small ]
    { type: 'IMG', size: 'MED', col: 'col-start-1', row: 'row-start-9', srcIdx: 13 },
    { type: 'INFO', size: 'SM', col: 'col-start-3', row: 'row-start-9', projectIdx: 4 },
    { type: 'IMG', size: 'SM', col: 'col-start-4', row: 'row-start-9', srcIdx: 14 },
    { type: 'IMG', size: 'SM', col: 'col-start-3', row: 'row-start-10', srcIdx: 15 },
    { type: 'IMG', size: 'SM', col: 'col-start-5', row: 'row-start-10', srcIdx: 16 },
  ];

  // Logic to notify parent (App.tsx) when lightbox state changes
  useEffect(() => {
    if (onLightboxToggle) {
      onLightboxToggle(lightboxIndex !== null);
    }
  }, [lightboxIndex, onLightboxToggle]);

  // Lightbox Navigation Logic
  const handleLightboxNext = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % allFrames.length));
  }, [allFrames.length]);

  const handleLightboxPrev = useCallback(() => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + allFrames.length) % allFrames.length));
  }, [allFrames.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') handleLightboxNext();
      if (e.key === 'ArrowLeft') handleLightboxPrev();
      if (e.key === 'Escape') setLightboxIndex(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleLightboxNext, handleLightboxPrev]);

  return (
    <div className="w-full flex flex-col px-4 md:px-16 relative z-10 pb-32">
      
      {/* 
          THE LONG MOSAIC GRID 
          - Mobile: 2 Columns (Auto Flow)
          - Desktop: 5 Columns (Strict Placement)
      */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 w-full auto-rows-[minmax(0,_1fr)]">
        
        {gridLayout.map((item, idx) => {
          // Construct Tailwind classes for layout
          const desktopClasses = `md:${item.col} md:${item.row} md:col-span-${item.size === 'MED' ? '2' : '1'} md:row-span-${item.size === 'MED' ? '2' : '1'}`;
          const mobileClasses = `col-span-${item.size === 'MED' ? '2' : '1'} aspect-square`;
          
          if (item.type === 'INFO') {
            const project = projects[item.projectIdx! % projects.length];
            return (
              <div 
                key={`info-${idx}`}
                className={`${mobileClasses} ${desktopClasses} flex flex-col justify-between p-3 border border-white bg-transparent`}
              >
                 <div className="font-mono text-[9px] md:text-[10px] text-white font-bold tracking-widest">
                    {getProjectCode(project.id)}
                 </div>
                 <h3 className="text-xs md:text-sm font-bold uppercase leading-tight text-white break-words">
                    {project.title}
                 </h3>
              </div>
            );
          }

          return (
            <div 
              key={`img-${idx}`} 
              className={`${mobileClasses} ${desktopClasses} relative cursor-pointer bg-black/5 hover:brightness-110 transition-all`}
              onClick={() => setLightboxIndex(item.srcIdx!)}
            >
              <img 
                src={allFrames[item.srcIdx!]} 
                alt="Styleframe"
                className="w-full h-full object-cover"
              />
            </div>
          );
        })}
        
      </div>

      {/* Lightbox Modal (Minimalist) */}
      {lightboxIndex !== null && (
        <div 
          // Updated background to be lighter (bg-black/60) and transparent/blurred
          className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex flex-col items-center justify-center animate-fade-in select-none"
          onClick={() => setLightboxIndex(null)}
        >
            {/* Close Button - Top Right Fixed */}
            <button 
                className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors z-[120] p-4 group"
                onClick={(e) => {
                    e.stopPropagation();
                    setLightboxIndex(null);
                }}
                aria-label="Close"
            >
                <svg className="w-10 h-10 md:w-12 md:h-12 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>

            {/* Left Arrow Button */}
            <button 
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[120] p-4 group"
                onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxPrev();
                }}
                aria-label="Previous"
            >
                <svg className="w-10 h-10 md:w-16 md:h-16 transform group-hover:-translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            {/* Right Arrow Button */}
            <button 
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-[120] p-4 group"
                onClick={(e) => {
                    e.stopPropagation();
                    handleLightboxNext();
                }}
                aria-label="Next"
            >
                <svg className="w-10 h-10 md:w-16 md:h-16 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" />
                </svg>
            </button>

            {/* Image Container */}
            <div 
                className="relative w-[90vw] h-[80vh] flex items-center justify-center pointer-events-none"
            >
                <img 
                    src={allFrames[lightboxIndex]} 
                    alt={`Styleframe ${lightboxIndex}`}
                    className="max-w-full max-h-full object-contain pointer-events-auto shadow-2xl"
                    onClick={(e) => e.stopPropagation()} // Clicking the image does not close modal
                />
            </div>
            
            {/* Image Counter */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-mono text-sm tracking-widest pointer-events-none bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                {String(lightboxIndex + 1).padStart(2, '0')} / {allFrames.length}
            </div>
        </div>
      )}
    </div>
  );
};