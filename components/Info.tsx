import React, { useEffect, useRef, useState } from 'react';
import { ASSETS } from '../utils/constants';

// Simple Icon Components
const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);
const InstaIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);
const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

const Info: React.FC = () => {
  const textRef = useRef<HTMLDivElement>(null);
  const [revealProgress, setRevealProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [activeQA, setActiveQA] = useState(0);
  const [showQAList, setShowQAList] = useState(false);
  const portraitRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowOverlay(true);
        }
      },
      { threshold: 0.2 }
    );

    if (portraitRef.current) {
      observer.observe(portraitRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Dynamic positioning for Desktop/Landscape Overlay
  useEffect(() => {
    const updatePosition = () => {
        if (!portraitRef.current || !overlayRef.current || !sectionRef.current) return;
        
        // Check if overlay is visible (desktop/landscape only)
        const style = window.getComputedStyle(overlayRef.current);
        if (style.display === 'none') return;

        const sectionRect = sectionRef.current.getBoundingClientRect();
        const portraitRect = portraitRef.current.getBoundingClientRect();
        const overlayHeight = overlayRef.current.offsetHeight;
        const portraitHeight = portraitRect.height;

        // Calculate top relative to section
        // We want Overlay Bottom = Portrait Top - (Portrait Height * 0.05) (Gap of 5%)
        // Overlay Top = Portrait Top - (Portrait Height * 0.05) - Overlay Height
        
        const relativePortraitTop = portraitRect.top - sectionRect.top;
        const targetTop = relativePortraitTop - (portraitHeight * 0.05) - overlayHeight;

        overlayRef.current.style.top = `${targetTop}px`;
    };

    // Observers
    const resizeObserver = new ResizeObserver(updatePosition);
    if (portraitRef.current) resizeObserver.observe(portraitRef.current);
    if (overlayRef.current) resizeObserver.observe(overlayRef.current);
    if (sectionRef.current) resizeObserver.observe(sectionRef.current);
    
    window.addEventListener('resize', updatePosition);
    
    // Initial call
    const timeout = setTimeout(updatePosition, 100);

    return () => {
        resizeObserver.disconnect();
        window.removeEventListener('resize', updatePosition);
        clearTimeout(timeout);
    };
  }, []);

  const qaData = [
    {
      question: "what is cinematography?",
      answer: <>
        <span className="text-white font-bold">Cinematography</span> is the art and technology of motion picture photography, translating a director's vision into visual storytelling through lighting, camera choices, composition, and movement.
        <div className="w-full h-1 bg-[#3c4043] mt-4 rounded-full"></div>
      </>
    },
    {
      question: "why work with you?",
      answer: <>
        I support you from concept to final delivery. Creative direction, cinematography, precise editing, and a color grade that aligns with your visual identity and message.
        <br/><br/>
        With multiple years of experience and a name to make for myself in the industry, i have the know how and the motivation to turn your idea into a movie.
      </>
    },
    {
      question: "what services do you offer?",
      answer: <>
        my services include:
        <br/><br/>
        <ul className="list-none pl-0 space-y-1">
            <li>- event coverage & aftermovies</li>
            <li>- imagefilms & social media content</li>
            <li>- music videos</li>
            <li>- shortfilm and documentary projects</li>
        </ul>
        <br/>
        I’m not limited to one niche.<br/>
        I’m interested in strong ideas, regardless of format.<br/>
        Contact me for further information.
      </>
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!textRef.current) return;
      const rect = textRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start: top of text at bottom of screen (windowHeight)
      // End: top of text at 2/3 of screen (windowHeight * 0.66) -> this is 1/3rd up from bottom
      const start = windowHeight;
      const end = windowHeight * 0.66;
      
      let progress = (start - rect.top) / (start - end);
      progress = Math.max(0, Math.min(1, progress));
      
      setRevealProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const AnimatedLine = ({ 
    text, 
    progress, 
    startRange, 
    endRange, 
    isJustified = true,
    className = "" 
  }: { 
    text: string, 
    progress: number, 
    startRange: number, 
    endRange: number, 
    isJustified?: boolean,
    className?: string 
  }) => {
    const words = text.split(' ');
    const totalChars = text.length || 1; // Guard against division by zero
    let charCounter = 0;

    return (
      <div className={`${className} ${isJustified ? 'flex justify-between' : ''}`}>
        {words.map((word, wordIdx) => (
          <span key={wordIdx} className="inline-flex">
            {word.split('').map((char, charIdx) => {
              const globalCharIdx = charCounter++;
              const charStart = startRange + (globalCharIdx / totalChars) * (endRange - startRange);
              const charEnd = startRange + ((globalCharIdx + 1) / totalChars) * (endRange - startRange);
              
              let opacity = 0;
              const range = charEnd - charStart;
              if (progress >= charEnd) opacity = 1;
              else if (progress <= charStart) opacity = 0;
              else if (range > 0) opacity = (progress - charStart) / range;
              else opacity = 1;

              // Ensure opacity is a valid number
              const safeOpacity = isNaN(opacity) ? 0 : opacity;

              return (
                <span key={charIdx} style={{ opacity: safeOpacity }}>
                  {char}
                </span>
              );
            })}
            {/* Add space after word if not the last word and not justified */}
            {!isJustified && wordIdx < words.length - 1 && (
              <span style={{ 
                opacity: progress >= (startRange + ((charCounter++) / totalChars) * (endRange - startRange)) ? 1 : 0 
              }}>&nbsp;</span>
            )}
            {/* Increment counter for space even if justified (to keep timing consistent) */}
            {isJustified && wordIdx < words.length - 1 && <span className="hidden">{charCounter++}</span>}
          </span>
        ))}
      </div>
    );
  };

  const renderTextContent = (progress: number, isDark: boolean = false) => (
    <div className={`flex flex-col w-full font-stencil font-black lowercase tracking-wide ${isDark ? 'text-[#222222]' : 'text-transparent'}`}>
        {/* Desktop Layout */}
        <div className="hidden md:flex flex-col w-full">
            <AnimatedLine 
                text="everyone's got a great story to tell."
                progress={progress}
                startRange={0}
                endRange={0.5}
                isJustified={true}
                className="text-2xl"
            />
            <AnimatedLine 
                text="i create visuals to make yours feel like cinema."
                progress={progress}
                startRange={0.5}
                endRange={1}
                isJustified={false}
                className="text-2xl mt-2 whitespace-nowrap"
            />
        </div>

        {/* Mobile Layout (4 rows with spacing) */}
        <div className="flex md:hidden flex-col w-full gap-0.5">
             <AnimatedLine 
                text="everyone's got a"
                progress={progress}
                startRange={0}
                endRange={0.2}
                isJustified={true}
                className="text-[7vw]"
            />
            <AnimatedLine 
                text="great story to tell."
                progress={progress}
                startRange={0.2}
                endRange={0.4}
                isJustified={true}
                className="text-[7vw]"
            />
             <div className="h-4"></div>
             <AnimatedLine 
                text="i create visuals to make"
                progress={progress}
                startRange={0.4}
                endRange={0.7}
                isJustified={true}
                className="text-[7vw]"
            />
             <AnimatedLine 
                text="yours feel like cinema."
                progress={progress}
                startRange={0.7}
                endRange={1}
                isJustified={true}
                className="text-[7vw]"
            />
        </div>
    </div>
  );

  return (
    <section ref={sectionRef} id="info" className="w-full bg-transparent border-t-2 border-dr-text overflow-hidden flex flex-col relative items-center">
        
        {/* Info Header */}
        <div className="w-full text-center pt-8 pb-2 z-30 relative">
            <h2 className="font-heading text-5xl md:text-6xl text-dr-red uppercase tracking-tight glitch-hover fragmented-headline-color">
                INF<sup className="text-2xl md:text-3xl text-dr-red">0</sup><span className="text-dr-text">.</span>
            </h2>
        </div>

        {/* Narrative Heading - Font Body (Rationale), Less Bold, Above Portrait */}
        <div className="w-full text-center px-6 mb-4 md:landscape:mb-12 lg:mb-16 z-20">
            <h3 className="font-body font-medium text-3xl md:text-5xl text-dr-red lowercase tracking-tight fragmented-headline">
                story driven cinematography
            </h3>
        </div>

        {/* Q&A Section */}
        <div 
            className="w-full max-w-3xl md:landscape:max-w-none lg:max-w-none px-6 mb-4 z-20 animate-fadeIn max-md:translate-y-[5%] md:translate-x-[20%] md:landscape:translate-x-0 lg:translate-x-0 md:translate-y-[3%] md:scale-50 md:portrait:scale-[0.65] lg:scale-100 lg:translate-x-[50%] md:landscape:w-[40vw] lg:w-[35vw] md:landscape:ml-auto md:landscape:mr-[10%] lg:ml-auto lg:mr-[10%] md:h-[26rem] md:overflow-visible group/qa"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
                e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
            }}
        >
            <div className="bg-[#202124] border border-[#3c4043] rounded-2xl p-6 md:p-8 shadow-2xl font-sans text-left relative overflow-hidden md:overflow-visible h-fit">
                {/* Spotlight Effect Layer */}
                <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover/qa:opacity-100 transition-opacity duration-300"
                    style={{
                        background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`
                    }}
                />
                
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="w-6 h-6 rounded-full bg-[#303134] flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#03CAAE]">
                            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                        </svg>
                    </div>
                    <span className="text-[#9aa0a6] text-sm tracking-wide">Q&A</span>
                </div>
                
                <h4 className="text-[#03CAAE] text-xl md:text-2xl mb-3 hover:underline cursor-pointer font-normal transition-all">
                    {qaData[activeQA].question}
                </h4>
                
                <div className="min-h-[80px]">
                    <div className="text-[#bdc1c6] text-base md:text-lg leading-relaxed animate-fadeIn">
                        {qaData[activeQA].answer}
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#3c4043] flex flex-col gap-4 relative">
                    <div className="flex justify-end items-center text-[10px] md:text-xs text-[#9aa0a6]">
                        <div 
                            className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors group px-2 py-1"
                            onClick={() => setShowQAList(!showQAList)}
                        >
                            <span className={`font-bold text-sm md:text-base uppercase tracking-wider ${showQAList ? 'text-white' : 'text-[#bdc1c6]'}`}>People also ask</span>
                            <svg viewBox="0 0 24 24" className={`w-4 h-4 fill-current transition-transform duration-300 ${showQAList ? 'rotate-180' : ''}`}>
                                <path d="M7 10l5 5 5-5z"/>
                            </svg>
                        </div>
                    </div>

                    {/* Expandable Question List */}
                    {showQAList && (
                        <div className="flex flex-col gap-2 animate-slideDown md:absolute md:top-full md:left-0 md:w-full md:bg-[#202124] md:border md:border-[#3c4043] md:rounded-b-lg md:p-4 md:shadow-2xl md:z-50">
                            {qaData.map((item, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => {
                                        setActiveQA(idx);
                                        setShowQAList(false);
                                    }}
                                    className={`p-3 rounded-lg cursor-pointer transition-all border ${idx === activeQA ? 'bg-[#303134] border-[#03CAAE] text-white' : 'bg-transparent border-[#3c4043] text-[#bdc1c6] hover:bg-[#303134]'}`}
                                >
                                    <p className="text-sm md:text-base">{item.question}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* New Anchored About Me PNG (Visible on Desktop/Landscape) */}
        <img 
            ref={overlayRef}
            src="https://lh3.googleusercontent.com/pw/AP1GczP_RiGAblCpixMhTIWU-aE6zoPKvaRr0fJZZLWLint1zIxeIC-TDqMRKtM04NhWK3GEcydvhKd4zAC3h_fagDzuUVVUg_2SZCgrar0WIEB3ba--PmwAcPuVW-AuadwJTaCOs0jIUph6EFt8JyQRkgbU=w903-h549-s-no-gm?authuser=0" 
            alt="Overlay" 
            className={`hidden md:landscape:block lg:block absolute left-[6.75vw] lg:left-[5vw] md:landscape:w-[33.1vw] lg:w-[20.3vw] z-20 pointer-events-none transition-transform duration-700 ease-out origin-bottom-left ${showOverlay ? 'scale-100 lg:scale-[0.75]' : 'scale-0'}`}
        />

        {/* Portrait & Text Container */}
        <div className="w-full max-w-6xl relative mb-32 md:mb-6 mt-0 flex flex-col md:flex-row items-center px-6 min-h-[400px] md:min-h-0 md:-translate-y-[7%] max-md:gap-8">
            
            {/* Portrait Image */}
            {/* Mobile: w-full max-w-3xl (matches Q&A), static, scaled 0.7x, moved down 12% (-22% -> -10%) */}
            {/* Desktop: w-[30%], moved left 15% and up 14% */}
            <div ref={portraitRef} className="relative w-full max-w-3xl md:w-[30%] shrink-0 md:-translate-x-[10%] md:portrait:-translate-x-[8%] md:-translate-y-[14%] max-md:scale-[0.7] max-md:-translate-y-[10%]">
                {/* Original Image (Visible on Mobile/Portrait) */}
                <img 
                    src="https://lh3.googleusercontent.com/pw/AP1GczP_RiGAblCpixMhTIWU-aE6zoPKvaRr0fJZZLWLint1zIxeIC-TDqMRKtM04NhWK3GEcydvhKd4zAC3h_fagDzuUVVUg_2SZCgrar0WIEB3ba--PmwAcPuVW-AuadwJTaCOs0jIUph6EFt8JyQRkgbU=w903-h549-s-no-gm?authuser=0" 
                    alt="Overlay" 
                    className={`absolute z-20 object-contain w-[108%] top-[70%] -left-[5%] md:w-[975%] md:-top-[59%] md:portrait:-top-[60%] md:-left-[40%] md:portrait:-left-[1%] lg:-left-[60%] lg:-top-[69%] transition-transform duration-700 ease-out origin-top-right md:origin-top-left ${showOverlay ? 'scale-[1.2] md:scale-[1.3] lg:scale-[1.56]' : 'scale-0'} md:landscape:hidden lg:hidden`}
                />

                <img 
                    src={ASSETS.portrait} 
                    alt="David Reumann" 
                    className="w-full h-auto object-cover origin-left md:scale-[1.35]"
                />
            </div>

            {/* Justified Text */}
            {/* Mobile: w-full max-w-3xl (matches Q&A), static, moved up 6% (-53% -> -59%), scaled 0.8x */}
            {/* Desktop: absolute centered, scaled, rotated */}
            <div 
                ref={textRef}
                className="flex flex-col pt-4 origin-center w-full max-w-3xl md:w-auto md:absolute md:left-1/2 md:top-1/2 md:scale-[0.95] md:portrait:scale-[0.96] lg:scale-[1.25] xl:scale-[1.74] md:-translate-x-[30%] md:-translate-y-[43%] md:-rotate-5 z-10 max-md:-translate-y-[39%] max-md:scale-[0.8]"
            >
                <div className="relative w-full md:w-fit mx-auto">
                    {/* Sticky Note Background */}
                    <div className="absolute inset-0 -m-6 bg-[#D8D8D8] shadow-[2px_4px_12px_rgba(0,0,0,0.2)] -rotate-1 rounded-sm -z-10"></div>
                    
                    {/* Base Layer: Invisible (for sizing) */}
                    <div className="opacity-0">
                        {renderTextContent(0)}
                    </div>

                    {/* Reveal Layer: Dark Text (Animated) */}
                    <div className="absolute top-0 left-0 w-full h-full">
                        {renderTextContent(revealProgress, true)}
                    </div>

                    {/* Software Skills (Desktop/Tablet) - Attached to Quote Box */}
                    <img 
                        src="https://lh3.googleusercontent.com/pw/AP1GczNJkywzFA7Fs0QrybRPGT5RdoJ94WPot4NBWwBD7m7qvm5Eqk5N6N3wSK0eYTbHtZbDBylGwYRoUnAuyxKxPNnixCKJxb6SwmT9vrVN7kwMNMeS5JSzsuUzDWJQyTuxOG_uvsGo-NyO744IF-Z4tvnP=w911-h390-s-no-gm?authuser=0" 
                        alt="Software Skills" 
                        className="hidden md:block absolute top-[150%] -right-[45%] w-[400px] h-auto object-contain scale-[0.38] hover:scale-[0.48] transition-transform duration-300 origin-top-left z-20"
                    />
                </div>
            </div>
        </div>

        {/* Centered Info Text */}
        <div className="w-full flex flex-col items-center text-center px-6 pb-8 z-20 max-md:-mt-48">
            
            {/* Software Skills (Mobile Only) */}
            <div className="relative mb-20 flex flex-col items-center md:hidden">
                <img 
                    src="https://lh3.googleusercontent.com/pw/AP1GczNJkywzFA7Fs0QrybRPGT5RdoJ94WPot4NBWwBD7m7qvm5Eqk5N6N3wSK0eYTbHtZbDBylGwYRoUnAuyxKxPNnixCKJxb6SwmT9vrVN7kwMNMeS5JSzsuUzDWJQyTuxOG_uvsGo-NyO744IF-Z4tvnP=w911-h390-s-no-gm?authuser=0" 
                    alt="Software Skills" 
                    className="w-full max-w-[500px] h-auto object-contain scale-[0.6] hover:scale-[0.7] transition-transform duration-300"
                />
            </div>

            {/* Location & Availability */}
            <div className="mb-16 md:mb-8 flex flex-col items-center gap-2">
                <p className="font-special font-bold text-dr-grey text-xl md:text-2xl uppercase tracking-[0.2em] md:tracking-[0.25em] fragmented-headline">
                    BASED IN MUNICH
                </p>
                <p className="font-special font-bold text-dr-grey text-xl md:text-2xl uppercase tracking-[0.2em] md:tracking-[0.25em] fragmented-headline">
                    AVAILABLE WORLDWIDE
                </p>
            </div>

            {/* Icons */}
            <div className="flex justify-center gap-6 md:gap-8 w-full mb-8">
                <a href="mailto:info@davidreumann.com" aria-label="Email" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 border-dr-text rounded-[50%] hover:border-dr-blue hover:text-dr-blue transition-colors text-dr-text bg-transparent">
                    <MailIcon />
                </a>
                <a href="https://www.instagram.com/reumanndp/" target="_blank" rel="noreferrer" aria-label="Instagram" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 border-dr-text rounded-[50%] hover:border-dr-blue hover:text-dr-blue transition-colors text-dr-text bg-transparent">
                    <InstaIcon />
                </a>
                <a href="https://www.linkedin.com/in/david-reumann-16a55436a?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border-2 border-dr-text rounded-[50%] hover:border-dr-blue hover:text-dr-blue transition-colors text-dr-text bg-transparent">
                    <LinkedinIcon />
                </a>
            </div>
            
            {/* Email Text */}
            <a href="mailto:info@davidreumann.com" className="font-body text-xl md:text-3xl text-dr-text hover:text-dr-red transition-colors lowercase bg-transparent px-2">
                info@davidreumann.com
            </a>

        </div>
    </section>
  );
};

export default Info;