import React, { useEffect } from 'react';
import { PROJECTS } from '../utils/constants';

interface AllProjectsProps {
  onBack: () => void;
  onSelectProject: (project: typeof PROJECTS[0]) => void;
}

const AllProjects: React.FC<AllProjectsProps> = ({ onBack, onSelectProject }) => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12 px-4 md:px-8 animate-fadeIn">
      {/* Header */}
      <div className="relative mb-12 flex items-center justify-between border-b-2 border-dr-text pb-4">
        <h2 className="font-heading text-5xl md:text-6xl text-dr-red tracking-tight uppercase glitch-hover fragmented-headline">
            SELECTED W<sup className="text-2xl md:text-3xl text-dr-red">0</sup>RK<span className="text-dr-text">.</span>
        </h2>
        <button 
            onClick={onBack}
            className="font-heading text-xl md:text-3xl text-dr-text hover:text-dr-red uppercase"
        >
            CLOSE X
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
        {PROJECTS.map((project) => (
            <div 
                key={project.id} 
                onClick={() => onSelectProject(project)}
                className="group cursor-pointer flex flex-col"
            >
                {/* Thumbnail */}
                <div className="w-full aspect-video bg-[#202124] rounded-lg mb-4 overflow-hidden relative shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                    {project.thumbnail ? (
                        <img 
                            src={project.thumbnail} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('maxresdefault')) {
                                    target.src = target.src.replace('maxresdefault', 'hqdefault');
                                    // If we fallback to hqdefault (which has bars), scale it up
                                    target.style.transform = 'scale(1.35)';
                                }
                            }}
                        />
                    ) : project.images && project.images.length > 0 ? (
                        <img 
                            src={project.images[0]} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                        />
                    ) : project.youtubeId ? (
                        <img 
                            src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`} 
                            alt={project.title} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('maxresdefault')) {
                                    target.src = target.src.replace('maxresdefault', 'hqdefault');
                                }
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-[#303134] flex items-center justify-center">
                            <span className="text-dr-text/30 font-heading text-xl">Coming Soon</span>
                        </div>
                    )}
                    {/* Play Icon Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                            <svg className="w-6 h-6 ml-1 text-black" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                </div>

                {/* Metadata */}
                <div className="flex flex-col items-start border-t border-dr-text pt-2">
                    <div className="flex justify-between w-full items-baseline">
                        <h3 className="font-heading text-3xl md:text-4xl text-dr-text uppercase group-hover:text-dr-red transition-colors">
                            {project.title}
                        </h3>
                        <span className="font-body text-dr-red lowercase text-lg">{project.subtitle}</span>
                    </div>
                    <span className="font-body text-gray-500 lowercase text-lg">{project.artist}</span>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default AllProjects;