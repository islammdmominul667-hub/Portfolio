import React, { useState, useEffect } from 'react';
import { Language } from '../types';

interface HeaderProps {
  onNavigate: (sectionId: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  forceHidden?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, lang, setLang, forceHidden = false }) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const t = {
    about: lang === 'EN' ? 'About' : 'Обо мне',
    contacts: lang === 'EN' ? 'Contacts' : 'Контакты',
  };

  // Handle Scroll to hide header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate if the header visuals should be visible
  // Visible if: Not forced hidden AND (We are at the top (not hidden) OR We are hovering the top area)
  const isVisible = !forceHidden && (!isHidden || isHovered);

  return (
    /* 
      Outer Container:
      - Fixed to top
      - Z-Index high
      - Height triggers the hover even if visuals are hidden
      - pointer-events disabled when forced hidden to prevent hover triggers during lightbox
    */
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 group ${forceHidden ? 'pointer-events-none' : 'pointer-events-auto'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 
         Visual Wrapper:
         - Handles the slide up/down animation (Translate Y)
         - Handles the Blur Effect (Backdrop filter)
         - Semi-transparent background for blur to be visible
      */}
      <div 
        className={`
          w-full flex justify-between items-center px-8 md:px-16 py-6
          transition-transform duration-500 ease-in-out
          backdrop-blur-md bg-red-600/10 shadow-sm border-b border-white/10
          ${isVisible ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <div 
          className="text-xl font-mono font-bold tracking-tight cursor-pointer hover:text-white transition-colors duration-300 uppercase text-black"
          onClick={() => onNavigate('about')}
        >
          Daniil Shklyaev.
        </div>
        
        <nav className="flex items-center gap-8 text-xl uppercase font-mono font-bold text-black">
          <button 
            onClick={() => onNavigate('about')} 
            className="hover:text-white transition-colors duration-300 hidden md:block"
          >
            {t.about}
          </button>
          <button 
            onClick={() => onNavigate('contacts')} 
            className="hover:text-white transition-colors duration-300 hidden md:block"
          >
            {t.contacts}
          </button>
          
          <div className="w-px h-6 bg-black/20 mx-2 hidden md:block"></div>
          
          <div className="flex gap-2 items-start">
            <button
              className={`
                cursor-pointer transition-all duration-300 font-bold
                ${lang === 'EN' 
                  ? 'text-white translate-y-1' 
                  : 'text-black/40 hover:text-black translate-y-0'
                }
              `}
              onClick={() => setLang('EN')}
            >
              EN
            </button>
            <button
              className={`
                cursor-pointer transition-all duration-300 font-bold
                ${lang === 'RU' 
                  ? 'text-white translate-y-1' 
                  : 'text-black/40 hover:text-black translate-y-0'
                }
              `}
              onClick={() => setLang('RU')}
            >
              RU
            </button>
          </div>
        </nav>
      </div>
      
      {/* Invisible hover extension to make it easier to trigger the header return */}
      <div className={`w-full h-8 absolute top-full left-0 ${isHidden && !forceHidden ? 'block' : 'hidden'}`} />
    </header>
  );
};