import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import Info from './components/Info';
import Footer from './components/Footer';
import AllProjects from './components/AllProjects';
import ProjectDetail from './components/ProjectDetail';
import Impressum from './components/Impressum';
import Datenschutz from './components/Datenschutz';
import { PROJECTS } from './utils/constants';

type ViewMode = 'home' | 'gallery' | 'impressum' | 'datenschutz';

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);
  const [activeSection, setActiveSection] = useState<'home' | 'projects' | 'info'>('home');

  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById('projects');
      const infoSection = document.getElementById('info');
      
      if (!projectsSection || !infoSection) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3; // Trigger when 1/3 into viewport

      if (scrollPosition >= infoSection.offsetTop) {
        setActiveSection('info');
      } else if (scrollPosition >= projectsSection.offsetTop) {
        setActiveSection('projects');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOpenAll = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setViewMode('gallery');
    setSelectedProject(null);
    setActiveSection('projects');
  };

  const handleSelectProject = (project: typeof PROJECTS[0]) => {
    setSelectedProject(project);
  };

  const handleBackFromDetail = () => {
    // If we were in gallery mode, go back to gallery (clear selection)
    // If we were in home mode, go back to home (clear selection)
    setSelectedProject(null);
  };

  const handleBackToHome = () => {
    setViewMode('home');
    setSelectedProject(null);
    setActiveSection('home');
  };

  const handleImpressumClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setViewMode('impressum');
    setSelectedProject(null);
  };

  const handleDatenschutzClick = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setViewMode('datenschutz');
    setSelectedProject(null);
  };

  // Navbar Handlers
  const handleHomeClick = () => {
    setViewMode('home');
    setSelectedProject(null);
    setActiveSection('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProjectsClick = () => {
    handleOpenAll();
  };

  const handleInfoClick = () => {
    setViewMode('home');
    setSelectedProject(null);
    setActiveSection('info');
    // Slight delay to ensure element exists if switching from Gallery
    setTimeout(() => {
        const infoSection = document.getElementById('info');
        if (infoSection) {
            infoSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
  };

  // 1. If a project is selected, show Detail View (regardless of View Mode)
  if (selectedProject) {
    return (
        <div className="w-full min-h-screen bg-dr-bg flex flex-col selection:bg-dr-red selection:text-white">
            <Navbar 
                onHomeClick={handleHomeClick}
                onProjectsClick={handleProjectsClick}
                onInfoClick={handleInfoClick}
                activeSection={activeSection}
            />
            <ProjectDetail 
                project={selectedProject} 
                onBack={handleBackFromDetail} 
            />
            <Footer onImpressumClick={handleImpressumClick} onDatenschutzClick={handleDatenschutzClick} />
        </div>
    );
  }

  // 2. If Impressum mode
  if (viewMode === 'impressum') {
      return (
        <div className="w-full min-h-screen bg-[#202124] flex flex-col selection:bg-dr-red selection:text-white">
            <Impressum onBack={handleBackToHome} />
        </div>
      );
  }

  // 3. If Datenschutz mode
  if (viewMode === 'datenschutz') {
      return (
        <div className="w-full min-h-screen bg-[#202124] flex flex-col selection:bg-dr-red selection:text-white">
            <Datenschutz onBack={handleBackToHome} />
        </div>
      );
  }

  // 4. Default View (Home or Gallery)
  return (
    <div className="w-full min-h-screen bg-dr-bg flex flex-col selection:bg-dr-red selection:text-white">
      <Navbar 
          onHomeClick={handleHomeClick}
          onProjectsClick={handleProjectsClick}
          onInfoClick={handleInfoClick}
          activeSection={activeSection}
      />
      
      <main className="flex-grow flex flex-col">
        {viewMode === 'home' ? (
          <>
            <Hero onOpenAll={handleOpenAll} />
            <Projects 
                onOpenAll={handleOpenAll} 
                onSelectProject={handleSelectProject} 
            />
            <Info />
          </>
        ) : (
          <AllProjects 
            onBack={handleBackToHome} 
            onSelectProject={handleSelectProject}
          />
        )}
      </main>
      
      <Footer onImpressumClick={handleImpressumClick} onDatenschutzClick={handleDatenschutzClick} />
    </div>
  );
};

export default App;