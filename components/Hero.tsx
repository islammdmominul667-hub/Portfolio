import React, { useState, useRef, useEffect } from 'react';
import { Language, Project } from '../types';

interface HeroProps {
  lang: Language;
  projects: Project[];
  onProjectSelect: (p: Project) => void;
}

type ModalType = 'none' | 'early' | 'final' | 'wow';

export const Hero: React.FC<HeroProps> = ({ lang, projects, onProjectSelect }) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  
  // Interactive Cube State
  const [clickCount, setClickCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isLit, setIsLit] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('none');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const litTimeoutRef = useRef<number | null>(null);

  // Animation Refs
  const cubeRef = useRef<HTMLDivElement>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isPressedRef = useRef(false);

  // Sync state to ref for animation loop
  useEffect(() => {
    isPressedRef.current = isPressed;
  }, [isPressed]);

  // Determine Cube Phase based on click count
  const getPhase = (count: number) => {
    if (count >= 100) return 'ultimate';
    if (count >= 75) return 'purple';
    if (count >= 50) return 'green';
    if (count >= 25) return 'blue';
    return 'default';
  };

  const phase = getPhase(clickCount);

  // Mouse move handler for the 3D cube rotation target
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    // Normalize coordinates from -1 to 1
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = (clientY / window.innerHeight) * 2 - 1;
    targetRotation.current = { x, y };
  };

  // Animation Loop for Smooth Deceleration (Inertia)
  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      // LERP factor: 0.1 gives a snappy but smooth follow. 
      // Lower values (0.05) make it heavier/slower.
      const easing = 0.08; 

      // Interpolate current rotation towards target
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * easing;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * easing;

      if (cubeRef.current) {
        // Multiplier increased to 120deg to give more "velocity" (range of motion)
        const rotX = currentRotation.current.y * -120; 
        const rotY = currentRotation.current.x * 120;
        const scale = isPressedRef.current ? 0.85 : 1;

        cubeRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const playBop = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // "Bop" sound: Sine wave dropping in pitch quickly
      osc.type = 'sine';
      
      // Pitch varies by phase
      let startFreq = 400;
      if (phase === 'blue') startFreq = 250;
      if (phase === 'green') startFreq = 500;
      if (phase === 'purple') startFreq = 150; // Deep bass
      if (phase === 'ultimate') startFreq = 800; // High pitch celestial sound

      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);

      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  const handleCubeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ensure we don't trigger other interactions
    e.preventDefault();

    setIsPressed(true);
    
    // Illumination Logic: 
    if (litTimeoutRef.current) {
      clearTimeout(litTimeoutRef.current);
    }
    
    // Instantly light up
    setIsLit(true);
    playBop();

    const newCount = clickCount + 1;
    setClickCount(newCount);

    // Modal Logic
    if (newCount === 5) {
      setTimeout(() => setModalType('early'), 300);
    } else if (newCount === 50) {
      setTimeout(() => setModalType('final'), 300);
    } else if (newCount === 100) {
      setTimeout(() => setModalType('wow'), 300);
    }

    // Set timeout to fade out slowly after 1 second
    litTimeoutRef.current = window.setTimeout(() => {
      setIsLit(false);
    }, 1000);
  };

  const handleCubeMouseUp = () => {
    setIsPressed(false);
  };

  const handleCubeMouseLeave = () => {
    setIsPressed(false);
  };

  const closeModal = () => {
    setModalType('none');
  };

  const handleGoToForm = () => {
    closeModal(); 
    const contactsSection = document.getElementById('contacts');
    if (contactsSection) {
      contactsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const content = {
    EN: {
      l1: "MOTION",
      l2: "DESIGNER",
      bio: "Crafting digital experiences through precise timing and visual storytelling. Based in Moscow, partnering with forward-thinking brands to bring ideas to life.",
      modals: {
        early: {
            title: "Congratulations!",
            description: "You have received a free consultation.",
            button: "Contacts"
        },
        final: {
            title: "It seems you liked the site.",
            description: "Let's discuss your project.",
            button: "Contacts"
        }
      }
    },
    RU: {
      l1: "MOTION",
      l2: "DESIGNER",
      bio: "Создаю цифровой опыт, объединяя выверенный\nтайминг и визуальный сторителлинг. Живу в Москве,\nсотрудничаю с прогрессивными брендами,\nвоплощая смелые идеи в жизнь.",
      modals: {
        early: {
            title: "Поздравляем!",
            description: "Вы получили бесплатную консультацию.",
            button: "Контакты"
        },
        final: {
            title: "Кажется, вам понравился сайт.",
            description: "Давайте обсудим ваш проект.",
            button: "Контакты"
        }
      }
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden bg-red-600 perspective-container"
      onMouseMove={handleMouseMove}
      // Global mouse up handler to ensure shrink releases even if mouse leaves cube
      onMouseUp={handleCubeMouseUp}
    >
      
      {/* 
          0. Background 3D Cube 
      */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
        <div 
          ref={cubeRef}
          className="cube-wrapper pointer-events-auto cursor-pointer"
          onMouseDown={handleCubeMouseDown}
          onMouseUp={handleCubeMouseUp}
          onMouseLeave={handleCubeMouseLeave}
          // Style is now handled by requestAnimationFrame logic
        >
          <div className="cube">
            {['front', 'back', 'right', 'left', 'top', 'bottom'].map((side) => (
              <div 
                key={side} 
                className={`face ${side} ${phase} ${isLit ? 'lit' : ''}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* 1. Video Preview Overlay - PRELOADING LOGIC */}
      <div 
        className={`absolute left-0 md:left-16 top-1/2 -translate-y-1/2 w-full md:w-[70vw] aspect-video z-10 
          transition-all duration-500 ease-out pointer-events-none px-4 md:px-0
          ${hoveredProject ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
      >
         <div className="w-full h-full relative overflow-hidden shadow-2xl bg-black">
            {/* 
                We map ALL projects here. 
                They are all rendered in the DOM, allowing iframes/images to preload.
                We toggle visibility with CSS opacity.
            */}
            {projects.map((project) => {
              const isActive = hoveredProject?.id === project.id;
              // NRF 9 (id 1) and AMUR VEF (id 4) need to be cropped to 16:9 (scale up)
              // Increased scale to 2.2 to ensure no bars appear in preview
              const needsCrop = project.id === 1 || project.id === 4;

              return (
                <div 
                  key={project.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                  {project.videoUrl.includes('vimeo') ? (
                     <iframe
                        src={`${project.videoUrl}?background=1&autoplay=1&loop=1&byline=0&title=0&muted=1`}
                        className={`w-full h-full absolute inset-0 pointer-events-none ${needsCrop ? 'scale-[2.2]' : 'scale-100'}`}
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                     />
                  ) : (
                    <img 
                      src={project.videoUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  {/* Title Overlay inside the preview box */}
                  <div className="absolute bottom-6 left-6 text-white z-20 pointer-events-none">
                      <h3 className="text-3xl md:text-5xl font-black leading-none drop-shadow-md">{project.title}</h3>
                  </div>
                </div>
              );
            })}
         </div>
      </div>

      {/* 
          2. Main Layout Container 
      */}
      <div className="relative w-full min-h-screen flex flex-col md:flex-row justify-between items-center z-20 pointer-events-none px-6 md:px-16 pt-32 pb-12 md:py-0">
          
          {/* Left Content: Bio */}
          {/* Aligned items-start and text-left to fix the 'slightly to the right' title issue */}
          <div 
            className={`w-full md:w-auto flex flex-col items-start text-left transition-opacity duration-500 
              ${hoveredProject ? 'opacity-0' : 'opacity-100'}`}
          >
             <div className="font-mono text-4xl md:text-6xl font-black mb-2 text-black/20 select-none">
                {clickCount.toString().padStart(2, '0')}
             </div>

             <h1 className="text-[13vw] md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.9] mb-8 text-black mix-blend-darken whitespace-nowrap">
                {content[lang].l1} <br />
                {content[lang].l2}
             </h1>
             
             <div className="w-full max-w-lg md:max-w-xl text-lg md:text-xl xl:text-2xl text-black font-medium leading-relaxed whitespace-pre-line">
                <p>
                  {content[lang].bio}
                </p>
             </div>
          </div>

          {/* Spacer for Mobile */}
          <div className="w-full h-[40vh] md:hidden pointer-events-none"></div>

          {/* Right Content: Project List */}
          <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-4 pointer-events-auto">
              {projects.map((project) => (
                <h2
                  key={project.id}
                  className={`relative text-[9vw] md:text-[5vw] font-bold cursor-pointer transition-colors duration-300 uppercase tracking-tighter leading-none whitespace-nowrap
                    ${hoveredProject?.id === project.id ? 'text-white' : 'text-black hover:text-white'}
                  `}
                  onMouseEnter={() => setHoveredProject(project)}
                  onMouseLeave={() => setHoveredProject(null)}
                  onClick={() => onProjectSelect(project)}
                >
                  {project.title}
                </h2>
              ))}
          </div>

      </div>

      {/* Modals */}
      {modalType !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-default"></div>
          
          <div className="relative bg-white text-black p-8 md:p-16 max-w-3xl w-full shadow-2xl scale-100 animate-bounce-slow flex flex-col items-center text-center border-4 border-black">
             <button 
               className="absolute top-6 right-6 text-black/40 hover:text-red-600 transition-colors"
               onClick={closeModal}
             >
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
             
             {modalType === 'early' && (
                <>
                  <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center mb-8 text-4xl font-bold shrink-0">!</div>
                  <h3 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight leading-none">{content[lang].modals.early.title}</h3>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 max-w-xl">{content[lang].modals.early.description}</p>
                  <button onClick={handleGoToForm} className="bg-red-600 text-white font-mono font-bold uppercase text-lg px-8 py-4 hover:bg-black transition-colors duration-300 tracking-widest">
                    {content[lang].modals.early.button}
                  </button>
                </>
             )}

             {modalType === 'final' && (
                <>
                  <div className="w-20 h-20 bg-black text-white rounded-full flex items-center justify-center mb-8 text-4xl font-bold shrink-0">?</div>
                  <h3 className="text-4xl md:text-6xl font-black uppercase mb-6 tracking-tight leading-none">{content[lang].modals.final.title}</h3>
                  <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 max-w-xl">{content[lang].modals.final.description}</p>
                  <button onClick={handleGoToForm} className="bg-red-600 text-white font-mono font-bold uppercase text-lg px-8 py-4 hover:bg-black transition-colors duration-300 tracking-widest">
                    {content[lang].modals.final.button}
                  </button>
                </>
             )}

             {modalType === 'wow' && (
                <h3 className="text-6xl md:text-9xl font-black uppercase mb-2 tracking-tighter leading-none">WOW.</h3>
             )}
          </div>
        </div>
      )}

      {/* CSS for the 3D Cube */}
      <style>{`
        .perspective-container {
          perspective: 1200px;
        }
        
        .cube-wrapper {
          width: 50vmin;
          height: 50vmin;
          position: relative;
          transform-style: preserve-3d;
          /* transition removed for smooth rAF logic */
          will-change: transform;
        }
        .cube {
          width: 100%;
          height: 100%;
          position: absolute;
          transform-style: preserve-3d;
        }

        .face {
          position: absolute;
          width: 50vmin;
          height: 50vmin;
          box-sizing: border-box;
          
          backface-visibility: visible;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          
          transition: background 1.5s ease-out, border 1.5s ease-out, box-shadow 1.5s ease-out;
        }

        /* --- PHASE 1: DEFAULT (White/Glass) --- */
        .face.default {
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.0) 30%, rgba(255, 255, 255, 0.6) 100%);
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.1);
        }
        .face.default.lit {
          background: radial-gradient(circle at center, rgba(255, 255, 255, 0.5) 10%, rgba(255, 255, 255, 0.95) 100%);
          border: 1px solid rgba(255, 255, 255, 1);
          box-shadow: 0 0 60px rgba(255, 255, 255, 0.9);
          transition: background 0.05s ease-out, border 0.05s ease-out, box-shadow 0.05s ease-out;
        }

        /* --- PHASE 2: DEEP BLUE (50-99 clicks) --- */
        .face.blue {
          background: radial-gradient(circle at center, rgba(10, 30, 100, 0.2) 30%, rgba(10, 40, 160, 0.7) 100%);
          border: 1px solid rgba(30, 60, 200, 0.8);
          box-shadow: 0 0 30px rgba(10, 30, 140, 0.3);
        }
        .face.blue.lit {
          background: radial-gradient(circle at center, rgba(40, 80, 200, 0.6) 10%, rgba(100, 150, 255, 0.95) 100%);
          border: 1px solid rgba(150, 200, 255, 1);
          box-shadow: 0 0 60px rgba(40, 80, 255, 0.9);
          transition: background 0.05s ease-out, border 0.05s ease-out, box-shadow 0.05s ease-out;
        }

        /* --- PHASE 3: GREEN (100-149 clicks) --- */
        .face.green {
          background: radial-gradient(circle at center, rgba(0, 255, 100, 0.1) 30%, rgba(0, 255, 100, 0.6) 100%);
          border: 1px solid rgba(0, 255, 100, 0.8);
          box-shadow: 0 0 20px rgba(0, 255, 100, 0.2);
        }
        .face.green.lit {
          background: radial-gradient(circle at center, rgba(50, 255, 150, 0.6) 10%, rgba(150, 255, 200, 0.95) 100%);
          border: 1px solid rgba(150, 255, 200, 1);
          box-shadow: 0 0 60px rgba(0, 255, 100, 0.9);
          transition: background 0.05s ease-out, border 0.05s ease-out, box-shadow 0.05s ease-out;
        }

        /* --- PHASE 4: DEEP PURPLE (150-299 clicks) --- */
        .face.purple {
          background: radial-gradient(circle at center, rgba(80, 0, 80, 0.2) 30%, rgba(100, 0, 100, 0.6) 100%);
          border: 1px solid rgba(140, 20, 140, 0.8);
          box-shadow: 0 0 20px rgba(100, 0, 100, 0.2);
        }
        .face.purple.lit {
          background: radial-gradient(circle at center, rgba(150, 50, 150, 0.6) 10%, rgba(255, 150, 255, 0.95) 100%);
          border: 1px solid rgba(255, 200, 255, 1);
          box-shadow: 0 0 60px rgba(200, 50, 200, 0.9);
          transition: background 0.05s ease-out, border 0.05s ease-out, box-shadow 0.05s ease-out;
        }

        /* --- PHASE 5: ULTIMATE (300+ clicks) --- */
        .face.ultimate {
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid #fff;
          box-shadow: 0 0 40px rgba(255, 255, 255, 0.5);
        }
        .face.ultimate.lit {
          background: #fff;
          box-shadow: 0 0 100px rgba(255, 255, 255, 1);
          transition: background 0.05s ease-out, box-shadow 0.05s ease-out;
        }
        
        .front  { transform: translateZ(25vmin); }
        .back   { transform: rotateY(180deg) translateZ(25vmin); }
        .right  { transform: rotateY(90deg) translateZ(25vmin); }
        .left   { transform: rotateY(-90deg) translateZ(25vmin); }
        .top    { transform: rotateX(90deg) translateZ(25vmin); }
        .bottom { transform: rotateX(-90deg) translateZ(25vmin); }
      `}</style>
    </div>
  );
};