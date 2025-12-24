import React, { useEffect } from 'react';
import { Project, Language } from '../types';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  lang: Language;
}

export const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack, lang }) => {
  
  const labels = {
    EN: {
      back: "Back to Works",
      date: "Date",
      software: "Software",
      client: "Client",
      agency: "Agency / Confidential",
    },
    RU: {
      back: "Назад к работам",
      date: "Дата",
      software: "Софт",
      client: "Клиент",
      agency: "Агентство / Конфиденциально",
    }
  };

  const t = labels[lang];

  // Scroll to top when mounting detail view
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isVimeo = project.videoUrl.includes('vimeo');

  // Determine aspect ratio class based on project ID
  const getAspectRatioClass = (id: number) => {
    if (id === 1) return 'aspect-[2.4/1]'; // NRF9 - Cinematic Ultra-Wide
    if (id === 4) return 'aspect-[4/3]';   // Amur VEF - 4:3
    return 'aspect-video';                 // Default 16:9
  };

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

      {/* Main Video Player Area */}
      <div className={`w-full ${getAspectRatioClass(project.id)} bg-black mb-12 relative overflow-hidden group shadow-2xl`}>
        {isVimeo ? (
           <iframe
              src={`${project.videoUrl}?autoplay=1&title=0&byline=0&portrait=0`}
              className="w-full h-full bg-black"
              style={{ backgroundColor: 'black' }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
        ) : (
          <>
            <img 
              src={project.videoUrl} 
              alt={project.title} 
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
              <div className="w-24 h-24 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-white hover:text-red-600 hover:border-white text-white transition-colors">
                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Project Info Grid */}
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
    </div>
  );
};