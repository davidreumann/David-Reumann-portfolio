import React, { useRef, useState, useEffect } from 'react';
import { PROJECTS, ASSETS } from '../utils/constants';

interface ProjectsProps {
  onOpenAll: () => void;
  onSelectProject: (project: typeof PROJECTS[0]) => void;
}

const Projects: React.FC<ProjectsProps> = ({ onOpenAll, onSelectProject }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  
  // Dragging state for the scroll container (mouse/touch)
  const [isDraggingContainer, setIsDraggingContainer] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Dragging state for the scrollbar thumb
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
  const [thumbStartX, setThumbStartX] = useState(0);
  const [thumbStartScroll, setThumbStartScroll] = useState(0);

  // Scroll Progress (0 to 1) for UI updates
  const [scrollProgress, setScrollProgress] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Navigation Arrows Visibility
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Check if click was a drag (to prevent opening project on drag end)
  const [wasDrag, setWasDrag] = useState(false);

  // Update Scroll State
  const updateScrollState = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const max = scrollWidth - clientWidth;
      setMaxScroll(max);
      setScrollProgress(max > 0 ? scrollLeft / max : 0);
      
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < max - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', updateScrollState);
      // Initial check
      updateScrollState();
      // Update on resize
      window.addEventListener('resize', updateScrollState);
      return () => {
        el.removeEventListener('scroll', updateScrollState);
        window.removeEventListener('resize', updateScrollState);
      };
    }
  }, []);


  // --- Container Drag Handlers ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDraggingContainer(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
    setWasDrag(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingContainer && scrollRef.current) {
      e.preventDefault();
      setWasDrag(true);
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2; 
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleMouseUp = () => {
    setIsDraggingContainer(false);
    setTimeout(() => setWasDrag(false), 50); // Small delay to prevent click firing
  };

  const handleMouseLeave = () => {
    setIsDraggingContainer(false);
  };


  // --- Scrollbar Thumb Drag Handlers ---
  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent container drag
    setIsDraggingThumb(true);
    setThumbStartX(e.pageX);
    if (scrollRef.current) {
        setThumbStartScroll(scrollRef.current.scrollLeft);
    }
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (isDraggingThumb && scrollRef.current && trackRef.current) {
        e.preventDefault();
        const deltaX = e.pageX - thumbStartX;
        
        // Calculate new scroll position based on thumb movement
        // Ratio: (Content Width - Viewport) / (Track Width - Thumb Width)
        const trackWidth = trackRef.current.clientWidth;
        const thumbWidth = trackWidth * 0.33; // Assuming 33% width
        const scrollableWidth = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
        const trackScrollableWidth = trackWidth - thumbWidth;
        
        if (trackScrollableWidth > 0) {
            const scrollDelta = (deltaX / trackScrollableWidth) * scrollableWidth;
            scrollRef.current.scrollLeft = thumbStartScroll + scrollDelta;
        }
      }
    };

    const handleWindowMouseUp = () => {
      setIsDraggingThumb(false);
    };

    if (isDraggingThumb) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDraggingThumb, thumbStartX, thumbStartScroll]);


  // --- Arrow Navigation ---
  const scrollContainer = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };


  // Hover State for Previews
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Slideshow Interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (hoveredProject !== null) {
        const project = PROJECTS.find(p => p.id === hoveredProject);
        if (project && project.images && project.images.length > 1) {
            interval = setInterval(() => {
                setCurrentImageIndex(prev => (prev + 1) % (project.images?.length || 1));
            }, 2000);
        }
    } else {
        setCurrentImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [hoveredProject]);

  return (
    <section id="projects" className="w-full bg-transparent py-12 border-t-2 border-dr-text relative group/section">
      
      {/* Header */}
      <div className="px-4 md:px-8 relative mb-8 flex items-end justify-center">
        <h2 className="font-heading text-5xl md:text-6xl text-dr-red tracking-tight uppercase text-center glitch-hover fragmented-headline-color">
            SELECTED W<sup className="text-2xl md:text-3xl text-dr-red">0</sup>RK<span className="text-dr-text">.</span>
        </h2>
        {/* "See all" link */}
        <button onClick={onOpenAll} className="absolute right-4 md:right-8 bottom-2 font-body font-medium text-dr-red text-lg md:text-xl underline decoration-2 underline-offset-4 hover:text-dr-text transition-colors lowercase bg-transparent border-none cursor-pointer">
            see all
        </button>
      </div>

      {/* Navigation Arrows (Absolute) */}
      {showLeftArrow && (
          <button 
            onClick={() => scrollContainer('left')}
            className="absolute left-2 md:left-4 top-1/2 z-20 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-dr-text hover:text-dr-red transition-colors hidden md:flex"
            aria-label="Scroll Left"
          >
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg>
          </button>
      )}
      
      {showRightArrow && (
          <button 
            onClick={() => scrollContainer('right')}
            className="absolute right-2 md:right-4 top-1/2 z-20 -translate-y-1/2 w-12 h-12 flex items-center justify-center text-dr-text hover:text-dr-red transition-colors hidden md:flex"
            aria-label="Scroll Right"
          >
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
          </button>
      )}

      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollRef}
        className="w-full overflow-x-auto no-scrollbar pl-4 md:pl-16 pr-4 md:pr-16 pb-8 cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex w-max gap-6 md:gap-10 pt-4 items-stretch">
          {PROJECTS.slice(0, 4).map((project) => (
            <div 
                key={project.id} 
                className="flex flex-col w-[260px] md:w-[320px] group transition-transform duration-300 hover:scale-105"
                onClick={() => {
                    if (!wasDrag) onSelectProject(project);
                }}
                onMouseEnter={() => setHoveredProject(project.id)}
                onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Thumbnail */}
              <div 
                className={`w-full aspect-[4/3] bg-[#202124] rounded-3xl mb-3 border border-transparent group-hover:border-dr-text transition-all shadow-lg overflow-hidden relative`}
              >
                  {/* Video Preview on Hover */}
                  {hoveredProject === project.id && project.youtubeId ? (
                      <iframe
                          src={`https://www.youtube.com/embed/${project.youtubeId}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${project.youtubeId}&showinfo=0&rel=0&iv_load_policy=3&fs=0&disablekb=1&vq=small`}
                          title={project.title}
                          className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none scale-[1.8]"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      />
                  ) : null}

                  {/* Slideshow on Hover */}
                  {hoveredProject === project.id && project.images && project.images.length > 0 ? (
                      <img 
                        src={project.images[currentImageIndex]} 
                        alt={project.title} 
                        className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500"
                      />
                  ) : null}

                  {/* Static Thumbnail (Fallback) - Fades out after delay on hover */}
                  {project.thumbnail ? (
                      <img 
                        src={project.thumbnail} 
                        alt={project.title} 
                        className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-500 delay-500 ${hoveredProject === project.id ? 'opacity-0' : 'opacity-100'}`}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('maxresdefault')) {
                                target.src = target.src.replace('maxresdefault', 'hqdefault');
                                target.style.transform = 'scale(1.35)';
                            }
                        }}
                      />
                  ) : project.images && project.images.length > 0 ? (
                      <img 
                        src={project.images[0]} 
                        alt={project.title} 
                        className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-500 delay-500 ${hoveredProject === project.id ? 'opacity-0' : 'opacity-100'}`}
                      />
                  ) : project.youtubeId ? (
                      <img 
                        src={`https://img.youtube.com/vi/${project.youtubeId}/maxresdefault.jpg`} 
                        alt={project.title} 
                        className={`absolute inset-0 w-full h-full object-cover z-20 transition-opacity duration-500 delay-500 ${hoveredProject === project.id ? 'opacity-0' : 'opacity-100'}`}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (target.src.includes('maxresdefault')) {
                                target.src = target.src.replace('maxresdefault', 'hqdefault');
                            }
                        }}
                      />
                  ) : (
                      <div className={`absolute inset-0 w-full h-full bg-[#303134] flex items-center justify-center z-20 transition-opacity duration-500 delay-500 ${hoveredProject === project.id ? 'opacity-0' : 'opacity-100'}`}>
                          <span className="text-dr-text/30 font-heading text-xl">Coming Soon</span>
                      </div>
                  )}
                  
                  {/* Hover Overlay (Darken) - Only show if NOT hovering (to darken static image) OR if hovering but no preview available */}
                  <div className={`absolute inset-0 bg-black/10 transition-opacity ${hoveredProject === project.id ? 'opacity-0' : 'opacity-0 group-hover:opacity-100'}`}></div>
              </div>
              
              {/* Info */}
              <div className="text-center pointer-events-none">
                <h3 className="font-heading text-2xl md:text-3xl text-dr-text uppercase tracking-wide mb-0 leading-none">
                    {project.title}
                </h3>
                <div className="font-body text-base md:text-lg leading-tight mt-1">
                    <div className="text-dr-red lowercase">{project.subtitle}</div>
                    <div className="text-gray-400 lowercase">{project.artist}</div>
                </div>
              </div>
            </div>
          ))}

          {/* "See All" Blurred Card */}
          <div 
            onClick={() => !wasDrag && onOpenAll()}
            className="flex flex-col w-[260px] md:w-[320px] group transition-transform duration-300 hover:scale-105 cursor-pointer"
          >
             <div className="w-full aspect-[4/3] rounded-3xl mb-3 border border-dr-text/20 shadow-lg overflow-hidden relative">
                 {/* Background Image (First Project NOT shown - Index 4) */}
                 {PROJECTS[4] && (
                    PROJECTS[4].thumbnail ? (
                        <img 
                            src={PROJECTS[4].thumbnail} 
                            alt="See all" 
                            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50" 
                        />
                    ) : PROJECTS[4].images && PROJECTS[4].images.length > 0 ? (
                        <img 
                            src={PROJECTS[4].images[0]} 
                            alt="See all" 
                            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50" 
                        />
                    ) : PROJECTS[4].youtubeId ? (
                        <img 
                            src={`https://img.youtube.com/vi/${PROJECTS[4].youtubeId}/maxresdefault.jpg`} 
                            alt="See all" 
                            className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-50" 
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.includes('maxresdefault')) {
                                    target.src = target.src.replace('maxresdefault', 'hqdefault');
                                }
                            }}
                        />
                    ) : null
                 )}
                 
                 {/* Blur Overlay */}
                 <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-all group-hover:bg-black/40">
                    <span className="font-heading text-4xl text-white uppercase tracking-wider drop-shadow-md">
                        See All
                    </span>
                 </div>
             </div>
             {/* Info Placeholder to align with others */}
             <div className="text-center opacity-0">
                <h3 className="font-heading text-2xl">Hidden</h3>
             </div>
          </div>

          {/* Spacer for right padding */}
          <div className="w-4 md:w-8 shrink-0"></div>
        </div>
      </div>
      
      {/* Custom Draggable Scrollbar */}
      <div className="w-full px-4 md:px-8 mt-2 flex justify-center">
        <div 
            ref={trackRef}
            className="w-full md:w-[80%] h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden relative cursor-pointer"
            onClick={(e) => {
                // Click on track to jump
                if (trackRef.current && scrollRef.current) {
                   const rect = trackRef.current.getBoundingClientRect();
                   const clickX = e.clientX - rect.left;
                   const ratio = clickX / rect.width;
                   const max = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
                   scrollRef.current.scrollTo({ left: ratio * max, behavior: 'smooth' });
                 }
            }}
        >
             <div 
                className="absolute top-0 h-full bg-[#9ca3af] hover:bg-dr-text transition-colors rounded-full cursor-grab active:cursor-grabbing"
                style={{ 
                    left: `${scrollProgress * (100 - 33)}%`, // Move within the available 67%
                    width: '33%' 
                }}
                onMouseDown={handleThumbMouseDown}
             ></div>
        </div>
      </div>

      {/* Subtle Progress Indicator at the very bottom */}
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-dr-text/5 overflow-hidden">
        <div 
          className="h-full bg-dr-red/30 transition-all duration-200 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        ></div>
      </div>

    </section>
  );
};

export default Projects;