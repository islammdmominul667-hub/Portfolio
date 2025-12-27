
import React, { useState, useCallback, useEffect } from 'react';
import { Project } from '../types';

interface StyleframeGridProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  onLightboxToggle?: (isOpen: boolean) => void;
}

const getProjectCode = (id: number) => `[PRJ_${String(id).padStart(2, '0')}]`;

/**
 * ИНСТРУКЦИЯ ДЛЯ ЯНДЕКС.ДИСКА:
 * 1. Скопируйте публичную ссылку (https://disk.yandex.ru/i/...)
 * 2. Добавьте префикс: https://getfile.dokpub.com/yandex/get/
 * Итоговая ссылка в массиве: "https://getfile.dokpub.com/yandex/get/https://disk.yandex.ru/i/..."
 */
const ALL_FRAMES = [
  "https://getfile.dokpub.com/yandex/get/https://disk.yandex.ru/i/tuMwPrzupOuCVw",
  "https://getfile.dokpub.com/yandex/get/https://disk.yandex.ru/i/5dpkRAPwv5qSGw",
  "https://getfile.dokpub.com/yandex/get/https://disk.yandex.ru/i/kmHMWItYfoUZ8Q",
  "https://picsum.photos/id/26/1000/1000",
  "https://picsum.photos/id/28/1000/1000",
  "https://picsum.photos/id/35/1000/1000",
  "https://picsum.photos/id/42/1000/1000",
  "https://picsum.photos/id/48/1000/1000",
  "https://picsum.photos/id/58/1000/1000",
  "https://picsum.photos/id/69/1000/1000",
  "https://picsum.photos/id/76/1000/1000",
  "https://picsum.photos/id/88/1000/1000",
  "https://picsum.photos/id/95/1000/1000",
  "https://picsum.photos/id/106/1000/1000",
  "https://picsum.photos/id/111/1000/1000",
  "https://picsum.photos/id/117/1000/1000",
];

// Функция превью (для демонстрации Picsum)
const getThumb = (url: string) => {
  if (url.includes('picsum.photos')) {
    return url.replace('1000/1000', '500/500');
  }
  return url;
};

export const StyleframeGrid: React.FC<StyleframeGridProps> = ({ projects, onProjectSelect, onLightboxToggle }) => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Все элементы теперь используют aspect-square для строгой геометрии
  const gridLayout = [
    { type: 'IMG', col: 'md:col-start-1 md:row-start-1 md:col-span-2 md:row-span-2', srcIdx: 0 },
    { type: 'INFO', col: 'md:col-start-3 md:row-start-1 md:col-span-1 md:row-span-1', projectIdx: 0 },
    { type: 'IMG', col: 'md:col-start-5 md:row-start-1 md:col-span-1 md:row-span-1', srcIdx: 1 },
    { type: 'IMG', col: 'md:col-start-4 md:row-start-2 md:col-span-1 md:row-span-1', srcIdx: 2 },
    { type: 'IMG', col: 'md:col-start-2 md:row-start-3 md:col-span-1 md:row-span-1', srcIdx: 3 },
    { type: 'IMG', col: 'md:col-start-3 md:row-start-3 md:col-span-2 md:row-span-2', srcIdx: 4 },
    { type: 'INFO', col: 'md:col-start-5 md:row-start-3 md:col-span-1 md:row-span-1', projectIdx: 1 },
    { type: 'IMG', col: 'md:col-start-1 md:row-start-4 md:col-span-1 md:row-span-1', srcIdx: 5 },
    { type: 'INFO', col: 'md:col-start-1 md:row-start-5 md:col-span-1 md:row-span-1', projectIdx: 2 },
    { type: 'IMG', col: 'md:col-start-2 md:row-start-5 md:col-span-2 md:row-span-2', srcIdx: 6 },
    { type: 'IMG', col: 'md:col-start-5 md:row-start-5 md:col-span-1 md:row-span-1', srcIdx: 7 },
    { type: 'IMG', col: 'md:col-start-4 md:row-start-6 md:col-span-1 md:row-span-1', srcIdx: 8 },
    { type: 'IMG', col: 'md:col-start-1 md:row-start-7 md:col-span-1 md:row-span-1', srcIdx: 9 },
    { type: 'IMG', col: 'md:col-start-3 md:row-start-7 md:col-span-1 md:row-span-1', srcIdx: 10 },
    { type: 'IMG', col: 'md:col-start-4 md:row-start-7 md:col-span-2 md:row-span-2', srcIdx: 11 },
    { type: 'IMG', col: 'md:col-start-2 md:row-start-8 md:col-span-1 md:row-span-1', srcIdx: 12 },
    { type: 'INFO', col: 'md:col-start-3 md:row-start-8 md:col-span-1 md:row-span-1', projectIdx: 3 },
  ];

  useEffect(() => {
    if (onLightboxToggle) onLightboxToggle(lightboxIndex !== null);
  }, [lightboxIndex, onLightboxToggle]);

  const handleLightboxNext = useCallback(() => setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % ALL_FRAMES.length)), []);
  const handleLightboxPrev = useCallback(() => setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + ALL_FRAMES.length) % ALL_FRAMES.length)), []);

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
    <div className="w-full flex flex-col relative z-10">
      {isMobile ? (
        <div className="grid grid-cols-2 gap-4 w-full px-6 pb-24">
          {ALL_FRAMES.slice(0, 16).map((src, idx) => (
            <div 
              key={idx} 
              className="aspect-square relative cursor-pointer border-[0.5px] border-white/20 overflow-hidden shadow-lg bg-black/10" 
              onClick={() => setLightboxIndex(idx)}
            >
               <img src={getThumb(src)} alt={`Frame ${idx}`} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-5 gap-4 w-full px-16">
          {gridLayout.map((item, idx) => {
            if (item.type === 'INFO') {
              const project = projects[item.projectIdx! % projects.length];
              return (
                <div key={`info-${idx}`} className={`${item.col} aspect-square flex flex-col justify-between p-4 border border-white/40 bg-black/5 backdrop-blur-sm`}>
                   <div className="font-mono text-[10px] text-white/60 font-bold tracking-widest">{getProjectCode(project.id)}</div>
                   <h3 className="text-sm font-bold uppercase leading-tight text-white break-words">{project.title}</h3>
                </div>
              );
            }

            return (
              <div 
                key={`img-${idx}`} 
                className={`${item.col} aspect-square relative cursor-pointer bg-black/10 overflow-hidden border border-white/10 group`} 
                onClick={() => setLightboxIndex(item.srcIdx!)}
              >
                <img 
                  src={getThumb(ALL_FRAMES[item.srcIdx!])} 
                  alt="Styleframe" 
                  className="w-full h-full object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700 group-hover:scale-105" 
                  loading="lazy"
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Section */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center animate-fade-in" onClick={() => setLightboxIndex(null)}>
            <button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[120] p-4" onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <button className="absolute left-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[120] p-4" onClick={(e) => { e.stopPropagation(); handleLightboxPrev(); }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button className="absolute right-8 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors z-[120] p-4" onClick={(e) => { e.stopPropagation(); handleLightboxNext(); }}>
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5l7 7-7 7" /></svg>
            </button>
            <div className="relative w-[85vw] h-[80vh] flex items-center justify-center">
                <img 
                  src={ALL_FRAMES[lightboxIndex]} 
                  alt={`Styleframe ${lightboxIndex}`} 
                  className="max-w-full max-h-full object-contain shadow-2xl" 
                  onClick={(e) => e.stopPropagation()} 
                />
            </div>
            <div className="mt-8 text-white/40 font-mono text-xs tracking-[0.4em] uppercase">
                {String(lightboxIndex + 1).padStart(2, '0')} — {ALL_FRAMES.length}
            </div>
        </div>
      )}
    </div>
  );
};
