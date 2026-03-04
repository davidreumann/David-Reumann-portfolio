import React, { useState, useRef, useEffect } from 'react';
import YouTube, { YouTubePlayer } from 'react-youtube';
import { ASSETS, HERO_VIDEOS } from '../utils/constants';

interface HeroProps {
  onOpenAll: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAll }) => {
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);
  const [showFullVideo, setShowFullVideo] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const playerRefs = useRef<{ [key: string]: YouTubePlayer }>({});

  // Bouncing Logo State
  // Using percentages for position (0-100) to ensure scaling consistency
  const [logoPos, setLogoPos] = useState({ x: 42.5, y: 42.5 }); // Start center
  const [logoVel, setLogoVel] = useState({ dx: 0.12, dy: 0.12 });
  const logoRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  // Maintain aspect ratio of the collage image (2561x1427)
  const IMAGE_WIDTH = 2561;
  const IMAGE_HEIGHT = 1430;

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.shiftKey && e.key.toLowerCase() === 'd') {
            setShowDebug(prev => !prev);
        }
        if (e.key === 'Escape' && showFullVideo) {
            setShowFullVideo(false);
        }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showFullVideo]);

  // Bouncing Logo Animation Loop
  useEffect(() => {
    // Initialize random position and velocity once
    if (!initializedRef.current) {
        // Defined boundaries (calculated below)
        const minX = 6.5;
        const maxX = 78.5;
        
        // Y Axis scaled by 1.1x (Range 72 -> 79.2)
        // Center 42.5. 42.5 +/- 39.6
        const minY = 2.9;
        const maxY = 82.1;
        
        const randomX = minX + Math.random() * (maxX - minX);
        const randomY = minY + Math.random() * (maxY - minY);
        
        // Randomize direction, keep speed
        const speed = 0.12;
        const randomDx = (Math.random() > 0.5 ? 1 : -1) * speed;
        const randomDy = (Math.random() > 0.5 ? 1 : -1) * speed;

        setLogoPos({ x: randomX, y: randomY });
        setLogoVel({ dx: randomDx, dy: randomDy });
        initializedRef.current = true;
    }

    let animationFrameId: number;

    const animate = () => {
        if (hoveredIcon) return; 

        setLogoPos((prevPos) => {
            let newX = prevPos.x + logoVel.dx;
            let newY = prevPos.y + logoVel.dy;
            let newDx = logoVel.dx;
            let newDy = logoVel.dy;

            // Define Bounce Box Boundaries (in percentages)
            // X Axis: Scaled down to 0.85x (Range 72)
            const minX = 6.5;
            const maxX = 78.5;
            
            // Y Axis: Scaled up by 1.1x from the 0.85x base (Range 79.2)
            const minY = 2.9;
            const maxY = 82.1;

            // Bounce logic
            if (newX <= minX || newX >= maxX) {
                newDx = -newDx;
                newX = Math.max(minX, Math.min(newX, maxX));
            }
            if (newY <= minY || newY >= maxY) {
                newDy = -newDy;
                newY = Math.max(minY, Math.min(newY, maxY));
            }

            if (newDx !== logoVel.dx || newDy !== logoVel.dy) {
                setLogoVel({ dx: newDx, dy: newDy });
            }

            return { x: newX, y: newY };
        });

        animationFrameId = requestAnimationFrame(animate);
    };

    if (!hoveredIcon) {
        animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [hoveredIcon, logoVel]);


  // Handle video playback on hover
  useEffect(() => {
    Object.keys(playerRefs.current).forEach((id) => {
      const player = playerRefs.current[id];
      // Check if player exists and has the necessary methods
      if (player && typeof player.playVideo === 'function' && typeof player.pauseVideo === 'function') {
        try {
            if (isMobile && id === 'preview-video') {
                player.playVideo();
            } else if (hoveredVideo === id) {
                player.playVideo();
            } else {
                player.pauseVideo();
            }
        } catch (error) {
            console.warn(`Error controlling video player ${id}:`, error);
        }
      }
    });
  }, [hoveredVideo, isMobile]);

  const onPlayerReady = (id: string, event: { target: YouTubePlayer }) => {
    try {
        playerRefs.current[id] = event.target;
        event.target.mute(); // Mute by default for autoplay policy
        if (id === 'preview-video') {
            setIsVideoReady(true);
        }
    } catch (error) {
        console.warn(`Error initializing player ${id}:`, error);
    }
  };

  // Preview is hovered ONLY if the icon is hovered (per user request)
  // Or if we want the scale effect to happen on icon hover
  const isPreviewActive = hoveredIcon; 

  const mobileDevicesRef = useRef<HTMLImageElement>(null);

  const handleMobileDevicesClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = mobileDevicesRef.current;
    if (!img) return;

    try {
        // Create a temporary canvas to check pixel transparency
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // We need the natural dimensions to map the click
        const rect = img.getBoundingClientRect();
        
        // Calculate the relative position within the image
        const x = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
        const y = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;

        canvas.width = 1;
        canvas.height = 1;

        // Draw only the clicked pixel
        // Note: This requires the image to be loaded and CORS-compliant
        ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        const alpha = pixel[3];

        // If alpha > 10 (slight threshold for semi-transparency), it's a hit
        if (alpha > 10) {
            onOpenAll();
        }
    } catch (err) {
        // Fallback: if canvas check fails (e.g. CORS), just allow the click
        console.warn("Transparency check failed, falling back to normal click", err);
        onOpenAll();
    }
  };

  const desktopCollageRef = useRef<HTMLImageElement>(null);

  const handleDesktopCollageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = desktopCollageRef.current;
    if (!img) return;

    try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        const rect = img.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * img.naturalWidth;
        const y = ((e.clientY - rect.top) / rect.height) * img.naturalHeight;

        canvas.width = 1;
        canvas.height = 1;

        ctx.drawImage(img, x, y, 1, 1, 0, 0, 1, 1);
        const pixel = ctx.getImageData(0, 0, 1, 1).data;
        const alpha = pixel[3];

        if (alpha > 10) {
            onOpenAll();
        }
    } catch (err) {
        // Fallback for CORS
        onOpenAll();
    }
  };

  return (
    <section className="relative w-full h-screen md:portrait:h-[85vh] bg-transparent overflow-hidden flex items-center justify-center">
      
      {/* Full Screen Video Modal */}
      {showFullVideo && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center animate-fadeIn p-4 md:p-12">
              <button 
                  onClick={() => setShowFullVideo(false)}
                  className="absolute top-4 right-4 md:top-8 md:right-8 text-white font-heading text-2xl md:text-4xl hover:text-dr-red transition-colors z-[110]"
              >
                  CLOSE [X]
              </button>
              <div className="w-full max-w-7xl aspect-video bg-black shadow-2xl relative">
                 <iframe
                    src={`https://www.youtube.com/embed/ZdygQuP153s?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0`}
                    title="Full Screen Video"
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                 />
              </div>
          </div>
      )}

      {/* Mobile Background - Centered & Full Width */}
      <img
          ref={mobileDevicesRef}
          src={ASSETS.mobileDevices}
          alt="Background"
          onClick={handleMobileDevicesClick}
          className="absolute top-1/2 max-md:top-[44%] md:portrait:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-full object-contain md:hidden md:portrait:block lg:hidden z-0 cursor-pointer"
      />

      {/* Scene Container - Locked to width */}
      <div 
        className={`relative w-full transition-all duration-500 -translate-y-[5vh] max-md:absolute max-md:bottom-[8%] max-md:left-0 max-md:translate-y-0 max-md:scale-[2.093] max-md:landscape:scale-[0.848] max-md:origin-bottom md:portrait:translate-y-[24%] md:portrait:scale-[1.38] ${showFullVideo ? 'blur-md scale-95 opacity-50' : ''}`}
        style={{
            aspectRatio: `${IMAGE_WIDTH} / ${IMAGE_HEIGHT}`,
        }}
      >
          {/* Debug Overlay: Toggle with Shift + D */}
          {showDebug && (
              <div className="absolute inset-0 z-50 pointer-events-none opacity-80 border-4 border-red-500">
                  <img src={ASSETS.calibration} alt="Alignment Calibration" className="w-full h-full object-contain" />
              </div>
          )}

          {/* Wrapper for Preview (z-10, under TV) */}
          <div 
            className={`absolute bottom-[5%] left-[49%] -translate-x-1/2 z-10 w-[21.1%] aspect-[3/2] origin-bottom transition-transform duration-500
                ${isPreviewActive ? 'scale-[1.54]' : 'scale-[1.44]'}
            `}
          >
               {/* 0. Video Preview (Bottom Layer) */}
              <div 
                ref={containerRef}
                className={`absolute inset-0 overflow-hidden transition-all duration-500 pointer-events-none
                    ${(isPreviewActive || isMobile) ? 'blur-[2px]' : 'blur-[4px]'}
                `}
              >
                  <div className="w-full h-full relative pointer-events-none">
                     {/* YouTube Player */}
                     <YouTube
                        videoId="ZdygQuP153s"
                        opts={{
                            width: '100%',
                            height: '100%',
                            playerVars: {
                                autoplay: isMobile ? 1 : 0,
                                controls: 0,
                                disablekb: 1,
                                fs: 0,
                                iv_load_policy: 3,
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 0,
                                loop: 1,
                                playlist: 'ZdygQuP153s',
                                mute: 1
                            },
                        }}
                        onReady={(e) => onPlayerReady('preview-video', e)}
                        className="absolute inset-0 w-full h-full object-cover scale-150 grayscale"
                     />
                     
                     {/* Thumbnail Overlay - Hides "More Videos" UI when not hovering */}
                     <div 
                        className={`absolute inset-0 z-20 bg-black transition-opacity duration-300 ${(isPreviewActive || isMobile) ? 'opacity-0 delay-500' : 'opacity-100 delay-0'}`}
                     >
                        <img 
                            src={`https://img.youtube.com/vi/ZdygQuP153s/maxresdefault.jpg`} 
                            alt="Video Thumbnail" 
                            className="w-full h-full object-cover scale-150 opacity-80 grayscale"
                        />
                     </div>

                     {/* TV Turn On / Loading Overlay */}
                     {(!isVideoReady && isMobile) && (
                         <div className="absolute inset-0 z-30 bg-black overflow-hidden flex items-center justify-center">
                             <div className="absolute inset-0 tv-static opacity-30 mix-blend-screen scale-150"></div>
                         </div>
                     )}
                     {(isVideoReady && isMobile) && (
                         <div className="absolute inset-0 z-30 pointer-events-none tv-turn-on-overlay"></div>
                     )}
                  </div>
              </div>
          </div>

          {/* 0.5 Bouncing Logo Layer (Between Preview and TV) - z-20 */}
          {/* Independent of Preview Scaling, but same base position */}
          {(!isPreviewActive || isMobile) && (
             <div 
                className="absolute bottom-[5%] left-[49%] -translate-x-1/2 z-20 w-[21.1%] aspect-[3/2] pointer-events-none overflow-hidden scale-[1.44] origin-bottom"
             >
                 <div 
                    ref={logoRef}
                    className="absolute w-[15%] h-auto"
                    style={{
                        left: `${logoPos.x}%`,
                        top: `${logoPos.y}%`,
                        willChange: 'transform, left, top',
                    }}
                 >
                     <img src={ASSETS.bouncingLogo} alt="Logo" className="w-full h-full object-contain opacity-80" />
                 </div>
             </div>
          )}

          {/* Wrapper for Play Icon (z-50, above TV) - Synced with Preview Wrapper */}
          <div 
            className={`absolute bottom-[5%] left-[49%] -translate-x-1/2 z-50 w-[21.1%] aspect-[3/2] origin-bottom transition-transform duration-500 pointer-events-none
                ${isPreviewActive ? 'scale-[1.54]' : 'scale-[1.44]'}
            `}
          >
              {/* Play Icon - Centered over Preview */}
              <div 
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[26%] aspect-square pointer-events-auto cursor-pointer transition-transform duration-300 origin-center
                    ${hoveredIcon ? 'scale-[1.4375]' : 'scale-[1.15]'}
                `}
                onMouseEnter={() => {
                    setHoveredVideo('preview-video');
                    setHoveredIcon(true);
                }}
                onMouseLeave={() => {
                    setHoveredVideo(null);
                    setHoveredIcon(false);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    setShowFullVideo(true);
                }}
              >
                  <img src={ASSETS.playIcon} alt="Play" className="w-full h-full object-contain drop-shadow-lg opacity-90 hover:opacity-100" />
              </div>
          </div>

          {/* 1. Background Collage Image (Middle Layer) */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            <img 
              ref={desktopCollageRef}
              src={ASSETS.heroCollage} 
              alt="Retro Tech Collage" 
              onClick={handleDesktopCollageClick}
              className="w-full h-full object-contain hidden md:landscape:block lg:block pointer-events-auto cursor-pointer"
            />
            {/* TV Device Overlay - Anchored to bottom - z-30 (Above Collage) */}
            <img 
              src={ASSETS.tvDevice} 
              alt="TV Device" 
              className={`absolute bottom-0 left-[53%] -translate-x-1/2 object-contain z-30 pointer-events-none transition-transform duration-500 origin-bottom
                ${isPreviewActive ? 'scale-105' : 'scale-100'}
                w-[39.4%] md:portrait:w-[43%] md:portrait:-bottom-[2%]
              `}
            />
          </div>





          {/* 3. Hitboxes (Top Layer - Interaction) */}
          {HERO_VIDEOS.map((vid) => (
             <div
                key={`hitbox-${vid.id}`}
                className="absolute z-30 cursor-pointer"
                onMouseEnter={() => setHoveredVideo(vid.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                style={{
                    top: `${vid.top}%`,
                    left: `${vid.left}%`,
                    width: `${vid.width}%`,
                    height: `${vid.height}%`,
                    transform: `rotate(${vid.rotate}deg)`,
                }}
             /> 
          ))}

      </div>


      {/* --- Typography Groups (Absolute Overlay on top of Scene) --- */}
      
      {/* 1. Logo - z-40 (Above TV) */}
      <div className="absolute top-[19%] md:portrait:top-[12%] max-md:top-[14%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full px-4 flex justify-center pointer-events-auto">
        <img 
            src="https://lh3.googleusercontent.com/pw/AP1GczMkF0ijuVAuFj-uldPzPGnPiLkiZvK2Ld0hFftLETGv6kRa_4Vv6DbY_MvDyx5JzOsteIlRi1wqh0HIUueD0vRjE-xImTXuILMNKgvq6iw3XehALzYmO90L32JU1bbScClGtTRB15Ht5EYPV1JZWD2O=w3415-h478-s-no-gm?authuser=0" 
            alt="David Reumann" 
            className="w-[51.75vw] md:portrait:w-[67vw] max-w-5xl h-auto object-contain transition-transform duration-500 hover:scale-[1.02] md:block hidden"
        />
        <img 
            src="https://lh3.googleusercontent.com/pw/AP1GczM6lPyFhT86H7IRwnjrAmKuSNkIjmPbrXkFLYadduVZjGhHb6Ygtq4P1hS6DG2IPxljXsqllwwqetiS3oA3iPaflxdBPuvxPHtr2an10Hm0fNojpsaOq6cm9NYrIH33h_3qR3wuQ7h5cMMo3fUYMSvZ=w2561-h1067-s-no-gm?authuser=0" 
            alt="David Reumann" 
            className="w-[76.5vw] md:w-[50vw] max-w-4xl h-auto object-contain transition-transform duration-500 hover:scale-[1.02] max-md:hover:scale-[0.75] max-md:scale-[0.736] max-md:landscape:scale-[0.348] max-md:landscape:hover:scale-[0.36] md:hidden block"
        />
      </div>

      {/* 2. Subtitle - z-40 (Above Logo) */}
      <div className="absolute top-[32%] md:portrait:top-[19%] max-md:top-[24%] max-md:landscape:top-[34%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-[57.5vw] max-md:w-[76.5vw] max-w-5xl max-md:max-w-4xl text-center pointer-events-none">
        <div className="w-full flex justify-center gap-[1.5vw] scale-[0.85] max-md:landscape:scale-[0.6875] origin-center">
            {"filmmaker    director".split('    ').map((word, i) => (
                <span key={i} className="font-body text-[4.4vw] max-md:text-[6.5vw] leading-none lowercase font-bold text-dr-text/90 uppercase whitespace-nowrap fragmented-headline tracking-normal mx-[1vw]">
                    {word}
                </span>
            ))}
        </div>
      </div>

      {/* 3. Center Text - z-40 (Above Logo) */}
      <div className="absolute top-[41%] md:portrait:top-[31%] max-md:top-[29%] max-md:landscape:top-[39%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 w-full text-center pointer-events-none">
          <p className="font-special text-xl md:text-3xl text-dr-text/70 lowercase font-light fragmented-headline max-md:scale-[0.7] md:portrait:scale-[0.7] max-md:landscape:scale-[0.65] origin-center">
            based in germany
          </p>
      </div>

    </section>
  );
};

export default Hero;