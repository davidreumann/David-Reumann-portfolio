import React from 'react';

interface NavbarProps {
  onHomeClick: () => void;
  onProjectsClick: () => void;
  onInfoClick: () => void;
  activeSection: 'home' | 'projects' | 'info';
}

const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onProjectsClick, onInfoClick, activeSection }) => {
  return (
    <nav className="w-full flex justify-between items-center py-3 px-4 md:px-8 border-b-2 border-dr-text bg-[#1a1a1a] sticky top-0 z-[100] shadow-xl">
      <button 
        onClick={onHomeClick}
        className="font-body text-xl md:text-2xl tracking-tighter text-dr-text lowercase hover:text-dr-blue transition-colors bg-transparent border-none cursor-pointer"
      >
        david reumann
      </button>
      <div className="flex gap-4 md:gap-8 font-body text-sm md:text-lg lowercase">
        <button 
            onClick={onHomeClick} 
            className={`${activeSection === 'home' ? 'text-dr-blue' : 'text-dr-text'} hover:text-dr-blue transition-colors bg-transparent border-none cursor-pointer`}
        >
            start
        </button>
        <button 
            onClick={onProjectsClick} 
            className={`${activeSection === 'projects' ? 'text-dr-blue' : 'text-dr-text'} hover:text-dr-blue transition-colors bg-transparent border-none cursor-pointer`}
        >
            selected work
        </button>
        <button 
            onClick={onInfoClick} 
            className={`${activeSection === 'info' ? 'text-dr-blue' : 'text-dr-text'} hover:text-dr-blue transition-colors bg-transparent border-none cursor-pointer`}
        >
            info
        </button>
      </div>
    </nav>
  );
};

export default Navbar;