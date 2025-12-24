import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProjectDetail } from './components/ProjectDetail';
import { StyleframeGrid } from './components/StyleframeGrid';
import { Project, ViewState, Language } from './types';

// Updated Mock Data with STATIC IDs for caching
const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "NRF 9 | INTRO",
    // using /id/15/ for static image ensures browser caching works effectively
    videoUrl: "https://player.vimeo.com/video/1148880228",
    description: "Opening title sequence for the NRF 9 conference. A blend of kinetic typography and abstract 3D forms representing the convergence of technology and retail.",
    software: ["After Effects", "Cinema 4D", "Redshift"],
    date: "Oct 2023",
    styleframes: [
       '/images/styleframes/11_carabiner.jpg',
       '/images/styleframes/12_wires_mesh.jpg',
       '/images/styleframes/13_electronics_1.jpg'
    ]
  },
  {
    id: 2,
    title: "1ST REGIONAL",
    videoUrl: "https://player.vimeo.com/video/1137364064",
    description: "Brand identity motion package for 1st Regional Channel. Focused on speed, reliability, and local connection through smooth transitions and bold color palettes.",
    software: ["After Effects", "Cinema 4D", "Redshift"],
    date: "Aug 2023",
    styleframes: [
      '/images/styleframes/01_pillars.jpg',
      '/images/styleframes/02_cubes.jpg',
      '/images/styleframes/03_purple_y.jpg'
    ]
  },
  {
    id: 3,
    title: "ELIGOVISION",
    videoUrl: "https://player.vimeo.com/video/1061595931",
    description: "Interactive installation showcase for Eligovision. Augmented reality demonstrations visualized through high-end motion graphics and post-processing.",
    software: ["After Effects", "Cinema 4D", "Redshift"],
    date: "Jun 2023"
  },
  {
    id: 4,
    title: "AMUR VEF",
    videoUrl: "https://player.vimeo.com/video/1026189292",
    description: "Event screen graphics for the Amur Economic Forum. Large scale visuals designed to set the tone for international cooperation and development.",
    software: ["Blender", "Cycles"],
    date: "Feb 2023",
    styleframes: [
      '/images/styleframes/04_lotus_1.jpg',
      '/images/styleframes/05_bud.jpg',
      '/images/styleframes/06_flowers.jpg'
    ]
  },
  {
    id: 5,
    title: "TR100",
    videoUrl: "https://player.vimeo.com/video/1054912340",
    description: "Product reveal for the TR100 series. Emphasizing precision engineering and control mechanics through macro cinematography and 3D overlays.",
    software: ["Blender", "Cycles"],
    date: "Jan 2023",
    styleframes: [
      '/images/styleframes/08_reel_1.jpg',
      '/images/styleframes/09_orange_box.jpg',
      '/images/styleframes/10_reel_wide_1.jpg'
    ]
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [lang, setLang] = useState<Language>('EN');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // State to track if the lightbox is open to hide the header
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setView('PROJECT_DETAIL');
  };

  const handleNavigate = (sectionId: string) => {
    if (view !== 'HOME') {
      setView('HOME');
      setSelectedProject(null);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-red-600 text-black font-sans selection:bg-black selection:text-white">
      <Header 
        onNavigate={handleNavigate} 
        lang={lang} 
        setLang={setLang} 
        forceHidden={isLightboxOpen}
      />
      
      <main className="flex-grow relative w-full">
        {view === 'HOME' ? (
          <>
            {/* Block 1: Combined Hero (About + Works) */}
            <section 
              id="about" 
              className="min-h-screen w-full snap-start flex flex-col relative z-10"
            >
              <Hero 
                lang={lang} 
                projects={MOCK_PROJECTS}
                onProjectSelect={handleProjectSelect}
              />
            </section>
            
            {/* Divider Block: Styleframes */}
            <section className="min-h-screen w-full snap-start flex flex-col justify-center bg-red-600 py-24 md:py-32 overflow-hidden relative z-20">
               <StyleframeGrid 
                 projects={MOCK_PROJECTS} 
                 onProjectSelect={handleProjectSelect} 
                 onLightboxToggle={setIsLightboxOpen}
               />
            </section>

             {/* Block 3: Contacts (Footer) */}
             <section 
               id="contacts" 
               className="h-screen w-full snap-start flex flex-col relative z-10"
             >
                <Footer lang={lang} />
             </section>
          </>
        ) : (
          selectedProject && (
            <ProjectDetail 
              project={selectedProject} 
              onBack={() => handleNavigate('about')} 
              lang={lang}
            />
          )
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(0, 20px) rotate(var(--tw-rotate)); }
          to { opacity: 1; transform: translate(0, 0) rotate(var(--tw-rotate)); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(10px); }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
};

export default App;