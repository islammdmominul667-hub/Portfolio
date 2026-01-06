
import React, { useEffect, useState } from 'react';
import { Project, Language } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  lang: Language;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, lang }) => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  const labels = {
    EN: {
      back: "Back to Works",
      date: "Date",
      software: "Software",
      client: "Client",
      agency: "Agency / Confidential",
      loading: "Establishing Stream...",
    },
    RU: {
      back: "Назад к работам",
      date: "Дата",
      software: "Софт",
      client: "Клиент",
      agency: "Агентство / Конфиденциально",
      loading: "Установка соединения...",
    }
  };

  const t = labels[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-20 px-4 md:px-8 max-w-screen-xl mx-auto animate-fade-in-up">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-sm font-mono font-bold uppercase tracking-widest text-black hover:text-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {t.back}
      </button>

      {/* Main Video Player Area - All 16:9 (aspect-video) */}
      <div className="w-full aspect-video bg-black mb-12 relative overflow-hidden shadow-2xl border-4 border-white/20">
        
        {/* Optimized Placeholder */}
        {!videoLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-20">
             <div className="w-[60%] h-1 bg-white/10 relative overflow-hidden rounded-full mb-4">
                <div className="absolute inset-0 bg-red-600 w-1/3 animate-loading-bar"></div>
             </div>
             <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">{t.loading}</p>
          </div>
        )}

        <div className="w-full h-full">
          <iframe
            src={`${project.videoUrl}?autoplay=0&loop=1&muted=0&quality=1080p&dnt=1`}
            className={`w-full h-full bg-black transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'} scale-[1.02]`}
            frameBorder="0"
            allow="autoplay; fullscreen"
            allowFullScreen
            onLoad={() => setVideoLoaded(true)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
        <div className="md:col-span-2">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 uppercase leading-none text-black">
            {project.title}
          </h1>
          <p className="text-lg md:text-xl text-black/90 leading-relaxed max-w-2xl font-medium">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col gap-8 md:pt-4">
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black/60 mb-2">{t.date}</h3>
            <p className="font-mono text-lg text-black">{project.date}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black/60 mb-2">{t.software}</h3>
            <ul className="flex flex-wrap gap-2">
              {project.software.map((sw, index) => (
                <li key={index} className="px-3 py-1 border border-black/20 rounded-full text-sm font-medium text-black">
                  {sw}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-black/60 mb-2">{t.client}</h3>
            <p className="font-medium text-lg text-black">{t.agency}</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(300%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};
