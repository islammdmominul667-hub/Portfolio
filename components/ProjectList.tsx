import React, { useState } from 'react';
import { Project, Language } from '../types';

interface ProjectListProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  lang: Language;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onProjectSelect, lang }) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  const handleMouseEnter = (project: Project) => {
    setHoveredProject(project);
  };

  return (
    <div className="w-full relative flex justify-end px-8 md:px-16 items-center">
      
      {/* The Video Preview Container */}
      {/* 
          Animation:
          - transition-all duration-500 ease-out: Smooth movement.
          - translate-x-12: Starts slightly to the right (hidden state).
          - translate-x-0: Moves to final position (hover state).
          - -translate-y-1/2: Maintains vertical centering.
      */}
      <div 
        className={`absolute left-8 md:left-16 top-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] md:w-[70vw] aspect-video z-10 
          transition-all duration-500 ease-out pointer-events-none 
          ${hoveredProject ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
      >
        <div className="w-full h-full border-0 md:border-2 border-red-600 bg-black relative shadow-2xl overflow-hidden">
           {projects.map((project) => (
              <div 
                key={project.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${hoveredProject?.id === project.id ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
              >
                <img 
                  src={project.videoUrl} 
                  alt={project.title}
                  className="w-full h-full object-cover opacity-80"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 mix-blend-multiply"></div>
                
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-white z-20">
                  <p className="font-mono text-[10px] md:text-xs uppercase tracking-widest mb-2 text-red-500 font-bold">
                    {lang === 'EN' ? 'Selected Work' : 'Проект'}
                  </p>
                  <p className="text-lg md:text-3xl font-black leading-none tracking-tight">{project.title}</p>
                </div>
              </div>
           ))}
        </div>
      </div>

      {/* Project Titles */}
      <div className="relative flex flex-col gap-6 items-end w-fit max-w-full z-20">
        {projects.map((project) => (
          <h2
            key={project.id}
            className={`relative text-5xl md:text-7xl lg:text-8xl font-bold cursor-pointer transition-colors duration-300 text-right uppercase tracking-tighter leading-none whitespace-nowrap
              ${hoveredProject?.id === project.id ? 'text-red-600' : 'text-black hover:text-red-600'}`}
            onMouseEnter={() => handleMouseEnter(project)}
            onMouseLeave={() => setHoveredProject(null)}
            onClick={() => onProjectSelect(project)}
          >
            {/* The Text Content - z-20 ensures it sits ON TOP of the Video (z-10) */}
            <span className="relative z-20">
              {project.title}
            </span>
          </h2>
        ))}
      </div>
    </div>
  );
};