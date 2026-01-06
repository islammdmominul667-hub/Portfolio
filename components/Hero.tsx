
import React, { useState, useRef, useEffect } from 'react';
import { Language, Project } from '../types';

interface HeroProps {
  lang: Language;
  projects: Project[];
  onProjectSelect: (p: Project) => void;
  onReady?: () => void;
  isPaused?: boolean;
}

type ModalType = 'none' | 'early' | 'final' | 'wow';

export const Hero: React.FC<HeroProps> = ({ lang, projects, onProjectSelect, onReady, isPaused = false }) => {
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  const [clickCount, setClickCount] = useState(0);
  const [isPressed, setIsPressed] = useState(false);
  const [isLit, setIsLit] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('none');
  
  const audioCtxRef = useRef<AudioContext | null>(null);
  const litTimeoutRef = useRef<number | null>(null);
  const iframeRefs = useRef<{[key: number]: HTMLIFrameElement | null}>({});

  const cubeRef = useRef<HTMLDivElement>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isPressedRef = useRef(false);

  useEffect(() => {
    const checkMobile = () => {
      // Treat tablets (up to 1024px) as mobile to enforce click-only behavior and mobile layout
      const mobile = window.innerWidth <= 1024 || window.matchMedia('(pointer: coarse)').matches;
      setIsMobile(mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    isPressedRef.current = isPressed;
  }, [isPressed]);

  const controlVideo = (projectId: number, action: 'play' | 'stop') => {
    const iframe = iframeRefs.current[projectId];
    if (!iframe || !iframe.contentWindow) return;

    const send = (msg: any) => {
      try {
        iframe.contentWindow?.postMessage(msg, '*');
        iframe.contentWindow?.postMessage(JSON.stringify(msg), '*');
      } catch (e) {}
    };

    if (action === 'play') {
      send({ type: 'player:seek', data: { time: 0 } });
      send({ type: 'set_time', data: { time: 0 } });
      
      setTimeout(() => {
        send({ type: 'player:play' });
        send({ type: 'play' });
      }, 50);
    } else {
      send({ type: 'player:pause' });
      send({ type: 'pause' });
      
      setTimeout(() => {
        send({ type: 'player:seek', data: { time: 0 } });
        send({ type: 'set_time', data: { time: 0 } });
      }, 100);
    }
  };

  useEffect(() => {
    if (onReady) onReady();
  }, [onReady]);

  useEffect(() => {
    if (isPaused) {
      projects.forEach(p => controlVideo(p.id, 'stop'));
    }
  }, [isPaused, projects]);

  useEffect(() => {
    if (isMobile || isPaused) return;

    if (hoveredProject) {
      controlVideo(hoveredProject.id, 'play');
    } else {
      projects.forEach(p => controlVideo(p.id, 'stop'));
    }
  }, [hoveredProject, projects, isMobile, isPaused]);

  const phase = (count: number) => {
    if (count >= 100) return 'ultimate';
    if (count >= 75) return 'purple';
    if (count >= 50) return 'green';
    if (count >= 25) return 'blue';
    return 'default';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) * 2 - 1;
    const y = (clientY / window.innerHeight) * 2 - 1;
    targetRotation.current = { x, y };
  };

  useEffect(() => {
    let animationFrameId: number;
    let time = 0;
    const animate = () => {
      const easing = 0.08; 
      if (isMobile) {
        time += 0.005; // Slower time increment for smoother animation
      } else {
        currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * easing;
        currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * easing;
      }

      if (cubeRef.current) {
        const scale = isPressedRef.current ? 0.85 : 1;
        if (isMobile) {
          // Chaotic but smoother and slower rotation
          const rotX = (time * 30) % 360;
          const rotY = (time * 40) % 360;
          const rotZ = Math.sin(time * 1.0) * 20;
          cubeRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`;
        } else {
          const rotX = currentRotation.current.y * -120; 
          const rotY = currentRotation.current.x * 120;
          cubeRef.current.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [isMobile]);

  const playBop = () => {
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      const currentPhase = phase(clickCount);
      let startFreq = 400;
      if (currentPhase === 'blue') startFreq = 250;
      if (currentPhase === 'green') startFreq = 500;
      if (currentPhase === 'purple') startFreq = 150;
      if (currentPhase === 'ultimate') startFreq = 800;
      osc.frequency.setValueAtTime(startFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const handleCubeMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    setIsPressed(true);
    if (litTimeoutRef.current) clearTimeout(litTimeoutRef.current);
    setIsLit(true);
    playBop();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Updated logic: Trigger at 5, 50, and 100
    if (newCount === 5) setTimeout(() => setModalType('early'), 300);
    else if (newCount === 50) setTimeout(() => setModalType('final'), 300);
    else if (newCount === 100) setTimeout(() => setModalType('wow'), 300);
    
    litTimeoutRef.current = window.setTimeout(() => setIsLit(false), 1000);
  };

  const content = {
    EN: {
      l1: "MOTION",
      l2: "DESIGNER",
      projectsTitle: "PROJECTS",
      bio: "Specializing in Product Visualization and Immersive Event Content. I use timing and visual storytelling to help brands bring ideas to life.",
      modals: {
        early: { title: "Let's discuss your project.", description: "", button: "Contacts" },
        final: { title: "Maybe now?", description: "", button: "Contact" }
      }
    },
    RU: {
      l1: "MOTION",
      l2: "DESIGNER",
      projectsTitle: "ПРОЕКТЫ",
      bio: "Специализируюсь на продуктовой визуализации и иммерсивном контенте для ивентов. Использую тайминг и визуальный сторителлинг, помогая брендам воплощать идеи в жизнь.",
      modals: {
        early: { title: "Давайте обсудим ваш проект.", description: "", button: "Контакты" },
        final: { title: "Может быть сейчас?", description: "", button: "Контакты" }
      }
    }
  };

  const currentPhase = phase(clickCount);

  // Helper to render the Cube
  const renderCube = () => (
    <div 
      ref={cubeRef}
      className={`${isMobile ? 'w-[40vw] h-[40vw]' : 'w-[50vmin] h-[50vmin]'} cube-wrapper pointer-events-auto cursor-pointer`}
      onMouseDown={handleCubeMouseDown}
      onTouchStart={handleCubeMouseDown}
    >
      <div className="cube">
        {['front', 'back', 'right', 'left', 'top', 'bottom'].map((side) => (
          <div key={side} className={`face ${side} ${currentPhase} ${isLit ? 'lit' : ''} ${isMobile ? 'face-mobile' : ''}`}></div>
        ))}
      </div>
    </div>
  );

  // Desktop Bio Section
  const DesktopBioSection = () => (
    <div className={`w-auto flex flex-col items-start text-left transition-opacity duration-500 ${!isMobile && hoveredProject ? 'opacity-0' : 'opacity-100'} pointer-events-none`}>
      <div className="font-mono text-4xl md:text-6xl font-black mb-2 text-black/20 select-none pointer-events-auto">{clickCount.toString().padStart(2, '0')}</div>
      <h1 
        className="text-[14vw] md:text-[8vw] font-bold uppercase tracking-tighter leading-[0.9] mb-6 text-black mix-blend-darken whitespace-nowrap pointer-events-auto"
        style={{ transform: 'translateX(-5px)' }}
      >
        {content[lang].l1} <br /> {content[lang].l2}
      </h1>
      <div className="w-full text-lg md:text-xl xl:text-2xl text-black font-medium leading-[1.3] md:leading-relaxed pointer-events-auto">
        <p className="whitespace-pre-line max-w-[300px] sm:max-w-sm md:max-w-xl">
          {content[lang].bio}
        </p>
      </div>
    </div>
  );

  // Desktop Project Links
  const DesktopProjectLinks = () => (
    <div className="w-auto flex flex-col items-end pointer-events-auto">
      <div className="flex flex-col items-end gap-6 md:gap-4">
        {projects.map((project, index) => (
          <div key={project.id} className="w-full flex justify-end">
              <h2
                className={`relative text-[5vw] font-bold cursor-pointer transition-colors duration-300 uppercase tracking-tighter leading-none whitespace-nowrap text-right 
                ${!isMobile && hoveredProject?.id === project.id ? 'text-white' : 'text-black md:hover:text-white'}`}
                onMouseEnter={() => !isMobile && setHoveredProject(project)}
                onMouseLeave={() => !isMobile && setHoveredProject(null)}
                onClick={() => onProjectSelect(project)}
              >
                {project.title}
              </h2>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden bg-red-600 perspective-container"
      onMouseMove={handleMouseMove}
      onMouseUp={() => setIsPressed(false)}
      onTouchEnd={() => setIsPressed(false)}
    >
      {/* Desktop Background Cube (Centered) - Only rendered on non-mobile */}
      {!isMobile && (
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          {renderCube()}
        </div>
      )}

      {/* Desktop Video Preview (Hidden on Mobile) */}
      {!isMobile && (
        <div 
          className={`absolute left-0 md:left-16 top-1/2 -translate-y-1/2 w-full md:w-[70vw] aspect-video z-10 
            transition-all duration-500 ease-out pointer-events-none px-4 md:px-0
            ${hoveredProject ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
        >
          <div className="w-full h-full relative overflow-hidden shadow-2xl bg-black">
              {projects.map((project) => {
                const isActive = hoveredProject?.id === project.id;
                const videoSrc = project.previewUrl || project.videoUrl;
                const kinescopeParams = `?autoplay=1&muted=1&loop=1&controls=0&header=0&quality=1080p&dnt=1`;

                return (
                  <div 
                    key={project.id} 
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${isActive ? 'opacity-100 z-10' : 'opacity-0.01 z-0'}`}
                    style={{ 
                      pointerEvents: isActive ? 'auto' : 'none'
                    }}
                  >
                    <iframe 
                      ref={el => { iframeRefs.current[project.id] = el; }}
                      src={`${videoSrc}${kinescopeParams}`} 
                      className="w-full h-full absolute inset-0 pointer-events-none scale-[1.01]" 
                      frameBorder="0" 
                      allow="autoplay; fullscreen" 
                    />
                    
                    <div className={`absolute bottom-6 left-6 text-white z-20 transition-transform duration-500 ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                      <h3 className="text-3xl md:text-5xl font-black leading-none drop-shadow-md">{project.title}</h3>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* MOBILE LAYOUT: Split into two screens via scroll. Rendered on Phone AND Tablet. */}
      {isMobile && (
        <div className="relative z-20 w-full flex flex-col">
          
          {/* SCREEN 1: Bio + Large Cube (min-h-screen ensures Projects are below fold) */}
          <div className="w-full min-h-screen flex flex-col justify-start px-6 pt-32 pb-10">
            {/* Bio Block */}
            <div className="w-full flex flex-col pointer-events-auto z-20 relative">
              <div className="flex flex-col w-full mb-6" style={{ transform: 'translateX(-5px)' }}>
                 <div className="flex justify-between w-full text-[21vw] leading-[0.8] font-black uppercase tracking-tighter text-black mix-blend-darken">
                    {content[lang].l1.split('').map((char, i) => <span key={i}>{char}</span>)}
                 </div>
                 <div className="flex justify-between w-full text-[15.5vw] leading-[0.8] font-black uppercase tracking-tighter text-black mix-blend-darken mt-2">
                    {content[lang].l2.split('').map((char, i) => <span key={i}>{char}</span>)}
                 </div>
              </div>
              <p 
                  className="w-full text-lg leading-snug font-medium text-black text-justify whitespace-normal"
                  style={{ textAlignLast: 'justify' }}
              >
                {content[lang].bio}
              </p>
            </div>

            {/* Cube Block - Fills remaining space and centers */}
            <div className="relative w-full flex-grow flex items-center justify-center mt-4">
               {/* Counter - Flanking the cube */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-between items-center z-0 pointer-events-none px-2 opacity-30">
                   {clickCount.toString().padStart(2, '0').split('').map((digit, i) => (
                      <span key={i} className="font-mono text-[50vw] font-black text-black leading-none translate-y-2">
                          {digit}
                      </span>
                   ))}
               </div>
               {/* Cube */}
               <div className="relative z-10">
                  {renderCube()}
               </div>
            </div>
          </div>

          {/* SCREEN 2: Projects Block (Header + List) */}
          <div className="w-full min-h-screen flex flex-col justify-center pointer-events-auto px-6 pb-20">
            {/* Projects Header - Small, White, Right Aligned */}
            <div className="w-full flex justify-end mb-4">
                <h3 className="text-white font-mono text-2xl font-bold uppercase tracking-widest">
                  {content[lang].projectsTitle}
                </h3>
            </div>

            {/* Project List */}
            <div className="w-full flex flex-col gap-6">
              {projects.map((project, index) => (
                <div key={project.id} className="w-full flex flex-row items-baseline justify-between">
                    <span className="text-[9vw] font-bold text-black/50 tracking-tighter leading-none shrink-0 mr-4">
                        {(index + 1).toString().padStart(2, '0')}.
                    </span>
                    <h2
                      className="text-[9vw] font-bold uppercase tracking-tighter leading-none text-right text-black w-full"
                      onClick={() => onProjectSelect(project)}
                    >
                      {project.title}
                    </h2>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* DESKTOP LAYOUT: Single screen side-by-side. Only for Width > 1024px */}
      {!isMobile && (
        <div className="relative w-full min-h-screen flex flex-row justify-between items-center z-20 px-16 pointer-events-none">
            <div className="pointer-events-auto">
               <DesktopBioSection />
            </div>
            <div className="pointer-events-auto">
               <DesktopProjectLinks />
            </div>
        </div>
      )}

      {/* Modals */}
      {modalType !== 'none' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in pointer-events-auto">
          <div className="absolute inset-0 bg-transparent cursor-default" onClick={() => setModalType('none')}></div>
          <div className="relative bg-white text-black p-8 md:p-16 max-w-3xl w-full shadow-2xl scale-100 animate-bounce-slow flex flex-col items-center text-center border-4 border-black">
             <button className="absolute top-6 right-6 text-black/40 hover:text-red-600 transition-colors" onClick={() => setModalType('none')}>
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
             {modalType === 'wow' ? <h3 className="text-6xl md:text-9xl font-black uppercase mb-2 tracking-tighter leading-none">WOW.</h3> : (
                <>
                  {/* Removed icon div here */}
                  <h3 className="text-4xl md:text-6xl font-black uppercase mb-12 tracking-tight leading-none pt-4">{content[lang].modals[modalType as 'early'|'final'].title}</h3>
                  {content[lang].modals[modalType as 'early'|'final'].description && (
                      <p className="text-xl md:text-2xl font-medium leading-relaxed mb-10 max-w-xl">{content[lang].modals[modalType as 'early'|'final'].description}</p>
                  )}
                  <button onClick={() => { setModalType('none'); document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth' }); }} className="bg-red-600 text-white font-mono font-bold uppercase text-lg px-8 py-4 hover:bg-black transition-colors duration-300 tracking-widest">{content[lang].modals[modalType as 'early'|'final'].button}</button>
                </>
             )}
          </div>
        </div>
      )}

      <style>{`
        .perspective-container { perspective: 1200px; }
        .cube-wrapper { position: relative; transform-style: preserve-3d; }
        .cube { width: 100%; height: 100%; position: absolute; transform-style: preserve-3d; }
        .face { position: absolute; width: 50vmin; height: 50vmin; box-sizing: border-box; backface-visibility: visible; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); transition: background 1.5s ease-out, border 1.5s ease-out, box-shadow 1.5s ease-out; }
        .face-mobile { width: 40vw; height: 40vw; }
        .face.default { background: radial-gradient(circle at center, rgba(255,255,255,0) 30%, rgba(255,255,255,0.6) 100%); border: 1px solid rgba(255,255,255,0.8); }
        .face.default.lit { background: radial-gradient(circle at center, rgba(255,255,255,0.5) 10%, rgba(255,255,255,0.95) 100%); border: 1px solid #fff; box-shadow: 0 0 60px rgba(255,255,255,0.9); transition: background 0.05s, border 0.05s, box-shadow 0.05s; }
        .face.blue { background: radial-gradient(circle at center, rgba(10,30,100,0.2) 30%, rgba(10,40,160,0.7) 100%); border: 1px solid rgba(30,60,200,0.8); }
        .face.blue.lit { background: radial-gradient(circle at center, rgba(40,80,200,0.6) 10%, rgba(100,150,255,0.95) 100%); border: 1px solid rgba(150,200,255,1); box-shadow: 0 0 60px rgba(40,80,255,0.9); transition: background 0.05s; }
        .face.green { background: radial-gradient(circle at center, rgba(0,255,100,0.1) 30%, rgba(0,255,100,0.6) 100%); border: 1px solid rgba(0,255,100,0.8); }
        .face.green.lit { background: radial-gradient(circle at center, rgba(50,255,150,0.6) 10%, rgba(150,255,200,0.95) 100%); border: 1px solid rgba(150,255,200,1); box-shadow: 0 0 60px rgba(0,255,100,0.9); transition: background 0.05s; }
        .face.purple { background: radial-gradient(circle at center, rgba(80,0,80,0.2) 30%, rgba(100,0,100,0.6) 100%); border: 1px solid rgba(140,20,140,0.8); }
        .face.purple.lit { background: radial-gradient(circle at center, rgba(150,50,150,0.6) 10%, rgba(255,150,255,0.95) 100%); border: 1px solid rgba(255,200,255,1); box-shadow: 0 0 60px rgba(200,50,200,0.9); transition: background 0.05s; }
        .face.ultimate { background: rgba(255,255,255,0.85); border: 1px solid #fff; }
        .face.ultimate.lit { background: #fff; box-shadow: 0 0 100px #fff; transition: background 0.05s; }
        .front { transform: translateZ(25vmin); } .face-mobile.front { transform: translateZ(20vw); }
        .back { transform: rotateY(180deg) translateZ(25vmin); } .face-mobile.back { transform: rotateY(180deg) translateZ(20vw); }
        .right { transform: rotateY(90deg) translateZ(25vmin); } .face-mobile.right { transform: rotateY(90deg) translateZ(20vw); }
        .left { transform: rotateY(-90deg) translateZ(25vmin); } .face-mobile.left { transform: rotateY(-90deg) translateZ(20vw); }
        .top { transform: rotateX(90deg) translateZ(25vmin); } .face-mobile.top { transform: rotateX(90deg) translateZ(20vw); }
        .bottom { transform: rotateX(-90deg) translateZ(25vmin); } .face-mobile.bottom { transform: rotateX(-90deg) translateZ(20vw); }
      `}</style>
    </div>
  );
};
