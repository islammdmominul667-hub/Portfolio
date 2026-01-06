import React, { useState } from 'react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const [copyFeedback, setCopyFeedback] = useState(false);
  const email = "d.sh.off@mail.ru";

  const content = {
    EN: {
      copied: "Copied!",
      items: [
        { label: "Instagram", href: "https://www.instagram.com/tsynayoush?igsh=MWlqZmFmZTl1aW9meg%3D%3D&utm_source=qr" },
        { label: "Vimeo", href: "https://vimeo.com/user129752706" },
        { label: "Telegram", href: "https://t.me/eziggs" }
      ]
    },
    RU: {
      copied: "Скопировано!",
      items: [
        { label: "Instagram", href: "https://www.instagram.com/tsynayoush?igsh=MWlqZmFmZTl1aW9meg%3D%3D&utm_source=qr" },
        { label: "Vimeo", href: "https://vimeo.com/user129752706" },
        { label: "Telegram", href: "https://t.me/eziggs" }
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

  const copyToClipboard = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(email).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2000);
    });
  };

  return (
    <footer className="h-full w-full bg-red-600 flex items-center justify-center relative px-8 md:px-16">
      <div className="w-full relative flex flex-col items-center">
        
        <div className="flex flex-col items-center gap-4 md:gap-6">
            {/* Email Row with Smaller, Refined Copy Button */}
            <div className="flex items-center gap-6 md:gap-10 group/row">
              <a 
                href={`mailto:${email}`}
                className="block font-mono font-light tracking-tight text-black transition-all duration-300 ease-out text-center text-3xl md:text-6xl hover:text-white hover:font-normal"
              >
                {email}
              </a>
              
              <button 
                onClick={copyToClipboard}
                className="relative w-6 h-6 md:w-9 md:h-9 flex items-center justify-center border-2 border-black group-hover/row:border-white transition-all duration-300 rounded-md hover:bg-black/10 active:scale-95 focus:outline-none"
                title="Copy email"
              >
                {/* Custom Copy Icon: Consistent border thickness (border-2) */}
                <div className="relative w-3 h-4 md:w-4 md:h-5">
                  {/* Background Rectangle (Top-Right) */}
                  <div className="absolute top-0 right-0 w-[65%] h-[65%] border-2 border-black group-hover/row:border-white transition-colors duration-300 rounded-[1px]"></div>
                  {/* Foreground Rectangle (Bottom-Left) */}
                  <div className="absolute bottom-0 left-0 w-[65%] h-[65%] border-2 border-black group-hover/row:border-white transition-colors duration-300 bg-red-600 rounded-[1px]"></div>
                </div>

                {/* Feedback Tooltip */}
                {copyFeedback && (
                  <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded font-mono animate-fade-in whitespace-nowrap z-50">
                    {content[lang].copied}
                  </span>
                )}
              </button>
            </div>

            {/* Other Social Links */}
            {content[lang].items.map((item, index) => (
              <a 
                key={index}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-mono font-light tracking-tight text-black transition-all duration-300 ease-out text-center text-3xl md:text-6xl hover:text-white hover:scale-110 hover:font-normal origin-center"
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
            className="w-6 h-6 md:w-8 md:h-8 text-white transition-colors duration-300 group-hover:text-red-600 overflow-visible" 
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