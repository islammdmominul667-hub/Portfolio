import React from 'react';
import { Project } from '../types';

interface CollageProps {
  projects: Project[];
}

export const Collage: React.FC<CollageProps> = ({ projects }) => {
  // Ensure we have enough projects to display
  const displayProjects = [
    projects[0],
    projects[1] || projects[0],
    projects[2] || projects[0],
    projects[3] || projects[1]
  ];

  return (
    <div className="relative w-full h-[200vh]">
        {/* 
            Layout Strategy:
            - Adjusted sizes to avoid "About" section text (Left 33%).
            - Kept dense clustering near the fold (100vh).
            - Flow: Right-Center (Top) -> Center -> Left-Center (Bottom).
        */}

        {/* 1. Top Anchor (About Section) - Shifted Right to clear Bio Text */}
        <div className="absolute left-[55%] top-[35vh] w-[28vw] aspect-[4/3] z-10">
            <div className="w-full h-full bg-white shadow-2xl">
                 <img 
                    src={displayProjects[2].videoUrl} 
                    alt="Collage 1" 
                    className="w-full h-full object-cover"
                 />
            </div>
        </div>

        {/* 2. Crossing the Fold - Shifted Right to clear Bio Text/CTA */}
        <div className="absolute left-[38%] top-[60vh] w-[26vw] aspect-square z-20">
             <div className="w-full h-full bg-white shadow-2xl">
                 <img 
                    src={displayProjects[1].videoUrl} 
                    alt="Collage 2" 
                    className="w-full h-full object-cover"
                 />
            </div>
        </div>

        {/* 3. Entering Works - Large Panoramic, shifted Left to avoid Project Titles */}
        <div className="absolute left-[15%] top-[82vh] w-[38vw] aspect-[16/9] z-30">
             <div className="w-full h-full bg-white shadow-2xl">
                 <img 
                    src={displayProjects[0].videoUrl} 
                    alt="Collage 3" 
                    className="w-full h-full object-cover"
                 />
            </div>
        </div>

        {/* 4. Deep Works - Shifted Left to stay clear of List */}
        <div className="absolute left-[28%] top-[108vh] w-[25vw] aspect-[4/3] z-40">
             <div className="w-full h-full bg-white shadow-2xl">
                 <img 
                    src={displayProjects[3].videoUrl} 
                    alt="Collage 4" 
                    className="w-full h-full object-cover"
                 />
            </div>
        </div>
    </div>
  );
};