import React from 'react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const content = {
    EN: {
      cta: "Contact me",
      items: [
        { label: "d.sh.off@mail.ru", href: "mailto:d.sh.off@mail.ru" },
        { label: "Instagram", href: "#" },
        { label: "Vimeo", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "Telegram", href: "#" }
      ]
    },
    RU: {
      cta: "Свяжитесь со мной",
      items: [
        { label: "d.sh.off@mail.ru", href: "mailto:d.sh.off@mail.ru" },
        { label: "Instagram", href: "#" },
        { label: "Vimeo", href: "#" },
        { label: "LinkedIn", href: "#" },
        { label: "Telegram", href: "#" }
      ]
    }
  };

  const scrollToTop = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="h-full w-full bg-red-600 flex items-center justify-center relative overflow-hidden px-8 md:px-16">
      
      {/* 
        Central Zone Wrapper 
        - w-full: Spans the full width between the paddings.
        - py-24: Adds vertical spacing so content is centered.
      */}
      <div className="w-full relative py-24 flex flex-col items-center">
        
        {/* Small Label - WHITE & Larger */}
        <h3 className="text-white text-sm md:text-lg font-mono font-bold uppercase tracking-[0.3em] mb-12 select-none text-center">
          {content[lang].cta}
        </h3>

        {/* Links List - Centered (Kept Black for contrast on Red, following standard style) - Larger */}
        <div className="flex flex-col items-center gap-4 md:gap-6">
            {content[lang].items.map((item, index) => (
            <a 
                key={index}
                href={item.href}
                className={`
                block font-mono font-light tracking-tight text-black transition-all duration-300 ease-out text-center
                text-3xl md:text-6xl
                hover:text-white hover:scale-110 hover:font-normal origin-center
                `}
            >
                {item.label}
            </a>
            ))}
        </div>

        {/* Scroll To Top Button */}
        <button 
          onClick={scrollToTop}
          className="group relative w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center transition-all duration-300 hover:bg-white hover:scale-110 mt-20 md:mt-32"
          aria-label="Back to top"
        >
          <svg 
            className="w-6 h-6 md:w-8 md:h-8 text-white transition-colors duration-300 group-hover:text-red-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>

      </div>
    </footer>
  );
};