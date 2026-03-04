import React from 'react';

interface FooterProps {
  onImpressumClick?: () => void;
  onDatenschutzClick?: () => void;
}

const Footer: React.FC<FooterProps> = ({ onImpressumClick, onDatenschutzClick }) => {
  return (
    <footer className="w-full flex justify-between items-start py-4 px-4 md:px-8 border-t-2 border-dr-text bg-transparent text-dr-text font-body text-sm md:text-lg">
      <div className="flex flex-col items-start">
        <div className="lowercase leading-tight">
          david reumann
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="uppercase tracking-wide leading-tight">
          <button 
            onClick={onImpressumClick} 
            className="hover:text-dr-red transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit uppercase"
          >
            IMPRESSUM
          </button>
        </div>
        <div className="uppercase tracking-wide text-xs md:text-sm mt-0.5">
          <button 
            onClick={onDatenschutzClick} 
            className="hover:text-dr-red transition-colors bg-transparent border-none cursor-pointer p-0 font-inherit uppercase"
          >
            DATENSCHUTZERKLÄRUNG
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;