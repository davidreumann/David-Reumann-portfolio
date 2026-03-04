import React, { useEffect, useState } from 'react';
import { PROJECTS } from '../utils/constants';

interface ProjectDetailProps {
  project: typeof PROJECTS[0];
  onBack: () => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onBack }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Scroll to top when mounting
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const nextImage = () => {
    if (project.images) {
        setCurrentImageIndex((prev) => (prev + 1) % project.images!.length);
    }
  };

  const prevImage = () => {
    if (project.images) {
        setCurrentImageIndex((prev) => (prev - 1 + project.images!.length) % project.images!.length);
    }
  };

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      nextImage();
    }
    if (isRightSwipe) {
      prevImage();
    }
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-12 px-4 md:px-8 flex flex-col items-center animate-fadeIn">
      
      {/* Navigation */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-8">
          <button 
              onClick={onBack}
              className="font-heading text-xl md:text-2xl text-dr-text hover:text-dr-red uppercase flex items-center gap-2"
          >
              ← Back
          </button>
      </div>

      {/* Media Container (Video or Gallery) */}
      <div className="w-full max-w-6xl aspect-video bg-black rounded-sm shadow-2xl mb-8 overflow-hidden relative group">
          {project.images && project.images.length > 0 ? (
              // Image Gallery
              <div 
                className="w-full h-full relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                  <img 
                    src={project.images[currentImageIndex]} 
                    alt={`${project.title} - ${currentImageIndex + 1}`} 
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Navigation Arrows */}
                  {project.images.length > 1 && (
                      <>
                        <button 
                            onClick={(e) => { e.stopPropagation(); prevImage(); }}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); nextImage(); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                        
                        {/* Dots Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                            {project.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'}`}
                                />
                            ))}
                        </div>
                      </>
                  )}
              </div>
          ) : (
              // Video Player
              <iframe 
                  width="100%" 
                  height="100%" 
                  src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1`} 
                  title={project.title} 
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                  className="absolute inset-0"
              ></iframe>
          )}
      </div>

      {/* Project Details */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Title & Type */}
          <div className="md:col-span-2">
              <h1 className="font-heading text-5xl md:text-7xl text-dr-text uppercase tracking-tight mb-2 fragmented-headline">
                  {project.title}
              </h1>
              <div className="flex gap-4 font-body text-xl md:text-2xl lowercase text-dr-red">
                  <span>{project.subtitle}</span>
                  <span className="text-dr-text">•</span>
                  <span>{project.artist}</span>
                  {project.year && (
                      <>
                          <span className="text-dr-text">•</span>
                          <span>{project.year}</span>
                      </>
                  )}
              </div>
          </div>

          {/* Description */}
          <div className="md:col-span-1 border-l-2 border-dr-red pl-6 pt-2">
              <h3 className="font-heading text-2xl text-dr-text uppercase mb-2">About</h3>
              <p className="font-body text-lg leading-relaxed text-dr-text/80">
                  {project.description}
              </p>
          </div>
      </div>

    </div>
  );
};

export default ProjectDetail;