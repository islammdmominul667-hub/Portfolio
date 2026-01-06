
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { ProjectDetail } from './components/ProjectDetail';
import { StyleframeGrid } from './components/StyleframeGrid';
import { LoadingScreen } from './components/LoadingScreen';
import { Project, ViewState, Language } from './types';

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "NRF 9 | INTRO",
    videoUrl: "https://kinescope.io/embed/i9T9yte2WXTsYfLRqScLHH",
    previewUrl: "https://kinescope.io/embed/7hc7yTnAJ49yKekdXcvCEL",
    description: "Opening title sequence for the NRF 9 conference. A blend of kinetic typography and abstract 3D forms representing the convergence of technology and retail.",
    software: ["After Effects", "Cinema 4D", "Redshift"],
    date: "Oct 2023",
  },
  {
    id: 2,
    title: "1ST REGIONAL",
    videoUrl: "https://kinescope.io/embed/wQU5j13yV9mzH2LmkgXsm6",
    previewUrl: "https://kinescope.io/embed/iiTyktJix2hMBnb7g1W83j",
    description: "Brand identity motion package for 1st Regional Channel. Focused on speed, reliability, and local connection through smooth transitions and bold color palettes.",
    software: ["After Effects", "Cinema 4D", "Redshift"],
    date: "Aug 2023",
  },
  {
    id: 3,
    title: "ELIGOVISION",
    videoUrl: "https://kinescope.io/embed/hcafejsK3VTMqNxCyvhTsx",
    previewUrl: "https://kinescope.io/embed/oyhq6pCuzp8BovN5JbxYrC",
    description: "Interactive installation showcase for Eligovision. Augmented reality demonstrations visualized through high-end motion graphics and post-processing.",
    software: ["After Effects", "Cinema 4D", "Redshift"],
    date: "Jun 2023"
  },
  {
    id: 4,
    title: "AMUR VEF",
    videoUrl: "https://kinescope.io/embed/eFkporXHoe92KtAzTShT3m",
    previewUrl: "https://kinescope.io/embed/jQ2rJMLpRuJMPGBNbvewk4",
    description: "Event screen graphics for the Amur Economic Forum. Large scale visuals designed to set the tone for international cooperation and development.",
    software: ["Blender", "Cycles"],
    date: "Feb 2023",
  },
  {
    id: 5,
    title: "TR100",
    videoUrl: "https://kinescope.io/embed/ohMWEueyGUJnF2dMhVUZ6q",
    previewUrl: "https://kinescope.io/embed/suwtdgH7z8hB1aaoH2YZYW",
    description: "Product reveal for the TR100 series. Emphasizing precision engineering and control mechanics through macro cinematography and 3D overlays.",
    software: ["Blender", "Cycles"],
    date: "Jan 2023",
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('HOME');
  const [lang, setLang] = useState<Language>('EN');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [appIsLoading, setAppIsLoading] = useState(true);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setView('PROJECT_DETAIL');
  };

  const handleNavigate = (sectionId: string) => {
    if (view !== 'HOME') {
      setView('HOME');
      setSelectedProject(null);
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-red-600 text-black font-sans selection:bg-black selection:text-white">
      {appIsLoading && (
        <LoadingScreen 
          onComplete={() => setAppIsLoading(false)} 
        />
      )}
      
      <Header 
        onNavigate={handleNavigate} 
        lang={lang} 
        setLang={setLang} 
        forceHidden={isLightboxOpen}
      />
      
      <main className={`flex-grow relative w-full transition-opacity duration-1000 ${!appIsLoading ? 'opacity-100' : 'opacity-0'}`}>
        <div style={{ display: view === 'HOME' ? 'block' : 'none' }}>
          <section id="about" className="min-h-screen w-full snap-start flex flex-col relative z-10">
            <Hero 
              lang={lang} 
              projects={MOCK_PROJECTS}
              onProjectSelect={handleProjectSelect}
              isPaused={view !== 'HOME' || appIsLoading}
            />
          </section>
          
          <section className="min-h-fit w-full snap-start flex flex-col justify-center bg-red-600 py-6 md:py-10 overflow-hidden relative z-20">
             <StyleframeGrid 
               projects={MOCK_PROJECTS} 
               onProjectSelect={handleProjectSelect} 
               onLightboxToggle={setIsLightboxOpen}
             />
          </section>

           <section id="contacts" className="min-h-screen w-full snap-start flex flex-col justify-center relative z-30 bg-red-600">
              <Footer lang={lang} />
           </section>
        </div>

        {view === 'PROJECT_DETAIL' && selectedProject && (
          <ProjectDetail 
            project={selectedProject} 
            onBack={() => {
              setView('HOME');
              setSelectedProject(null);
            }} 
            lang={lang}
          />
        )}
      </main>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
        html { scrollbar-width: none; scroll-snap-type: y mandatory; height: 100%; }
        body { height: 100%; -webkit-font-smoothing: antialiased; }
        body::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default App;
