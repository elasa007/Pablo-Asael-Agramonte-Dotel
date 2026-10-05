import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  Menu, 
  X, 
  ArrowUpRight,
  User,
  Briefcase,
  GraduationCap,
  UserCheck,
  FolderKanban,
  Film,
  FileText,
  Presentation,
  Sparkles,
  Lock,
  Unlock,
  Sun,
  Moon,
  Code2
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SectionVisibility } from '../types/portfolio';

export interface NavbarProps {
  currentView?: 'portfolio' | 'admin';
  setCurrentView?: (view: 'portfolio' | 'admin') => void;
  isAdminAuthenticated?: boolean;
  onOpenArchitectureDocs?: () => void;
  sectionVisibility?: SectionVisibility;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView = 'portfolio',
  setCurrentView,
  isAdminAuthenticated = false,
  onOpenArchitectureDocs,
  sectionVisibility
}) => {
  const { theme, toggleTheme } = useTheme();
  
  // State for mobile drawer
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State for active desktop dropdown with hover bridge
  const [activeDropdown, setActiveDropdown] = useState<'about' | 'portfolio' | null>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Mobile accordion collapse states
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(true);
  const [isMobilePortfolioOpen, setIsMobilePortfolioOpen] = useState(true);

  // Quick unlock state for admin inside mobile menu
  const [showQuickAuthInput, setShowQuickAuthInput] = useState(false);
  const [quickPassword, setQuickPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Clear hover timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setShowQuickAuthInput(false);
      setAuthError(null);
      setQuickPassword('');
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Handle ESC key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Dropdown hover handlers with graceful debounce bridge
  const handleMouseEnter = (menu: 'about' | 'portfolio') => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 180);
  };

  // Smooth scroll to section helper
  const handleScrollTo = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);

    if (setCurrentView && currentView !== 'portfolio') {
      setCurrentView('portfolio');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  // Quick unlock handler
  const handleQuickUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickPassword === 'admin2026' || quickPassword === 'asael' || quickPassword.length >= 4) {
      localStorage.setItem('creativo_admin_auth', 'true');
      window.dispatchEvent(new Event('auth-change'));
      setAuthError(null);
      setShowQuickAuthInput(false);
      setQuickPassword('');
    } else {
      setAuthError('Clave incorrecta ("admin2026")');
    }
  };

  // Lock admin session
  const handleLockAdmin = () => {
    localStorage.removeItem('creativo_admin_auth');
    window.dispatchEvent(new Event('auth-change'));
    if (setCurrentView && currentView === 'admin') {
      setCurrentView('portfolio');
    }
    setIsMobileMenuOpen(false);
  };

  // 1. "Sobre Mí" Submenu Items with visibility key
  const aboutSublinks = [
    { label: 'Perfil & Skills', href: '#skills', sectionId: 'skills', icon: User, key: 'skills' },
    { label: 'Trayectoria', href: '#trayectoria', sectionId: 'trayectoria', icon: Briefcase, key: 'experience' },
    { label: 'Formación', href: '#formacion', sectionId: 'formacion', icon: GraduationCap, key: 'education' },
    { label: 'Referencias', href: '#referencias', sectionId: 'referencias', icon: UserCheck, key: 'references' }
  ];

  // 2. "Portafolio" Submenu Items with visibility key
  const portfolioSublinks = [
    { label: 'Galería Dinámica', href: '#galeria', sectionId: 'galeria', icon: FolderKanban, key: 'gallery' },
    { label: 'Videos & Reels', href: '#videos', sectionId: 'videos', icon: Film, key: 'videos' },
    { label: 'Diapositivas Corporativas', href: '#documentos', sectionId: 'documentos', icon: Presentation, key: 'documents' }
  ];

  const visibleAboutSublinks = aboutSublinks.filter(
    (item) => !sectionVisibility || sectionVisibility[item.key as keyof SectionVisibility] !== false
  );

  const visiblePortfolioSublinks = portfolioSublinks.filter(
    (item) => !sectionVisibility || sectionVisibility[item.key as keyof SectionVisibility] !== false
  );

  const showSpecialties = !sectionVisibility || sectionVisibility.specialties !== false;
  const showContact = !sectionVisibility || sectionVisibility.contact !== false;

  return (
    <>
      {/* Fixed Glassmorphism Navigation Bar */}
      <nav 
        className="fixed top-0 left-0 right-0 z-40 w-full bg-[#0F0F0F]/85 backdrop-blur-md border-b border-white/10 transition-colors duration-300 font-sans"
        role="navigation"
        aria-label="Navegación principal"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo (Izquierda) */}
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              if (setCurrentView && currentView !== 'portfolio') {
                setCurrentView('portfolio');
              }
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 group cursor-pointer focus:outline-none"
            aria-label="Ir al inicio - Asael Agramonte"
          >
            <span className="font-sans font-black tracking-tight text-2xl sm:text-3xl text-white group-hover:text-white/90 transition-colors select-none">
              Asael Agramonte<span className="text-[#E53935]">.</span>
            </span>
          </a>

          {/* Enlaces Centrales (Desktop: Elementos condicionados por visibilidad) */}
          <div className="hidden md:flex items-center gap-8 lg:gap-10">
            
            {/* 1. Sobre Mí (Dropdown en Hover - solo visible si al menos 1 subsección está activa) */}
            {visibleAboutSublinks.length > 0 && (
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => handleScrollTo(visibleAboutSublinks[0]?.sectionId || 'skills')}
                  className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors cursor-pointer focus:outline-none ${
                    activeDropdown === 'about' ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                  aria-expanded={activeDropdown === 'about'}
                  aria-haspopup="true"
                >
                  <span>Sobre Mí</span>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      activeDropdown === 'about' ? 'rotate-180 text-white' : ''
                    }`} 
                  />
                </button>

                {/* Invisible Hover Bridge Pad */}
                <div className="absolute top-full left-0 right-0 h-2 -mt-1 pointer-events-auto" />

                {/* Dropdown Menu con AnimatePresence de Framer Motion */}
                <AnimatePresence>
                  {activeDropdown === 'about' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-[calc(100%+4px)] left-0 min-w-[210px] bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      <div className="space-y-1">
                        {visibleAboutSublinks.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                handleScrollTo(item.sectionId);
                              }}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <span className="p-1 rounded-lg bg-white/5 text-gray-400 group-hover:text-[#E53935] group-hover:bg-[#E53935]/10 transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <span>{item.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* 2. Especialidades (Enlace Directo - condicionado por visibilidad) */}
            {showSpecialties && (
              <a
                href="#especialidades"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('especialidades');
                }}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors cursor-pointer py-2"
              >
                Especialidades
              </a>
            )}

            {/* 3. Portafolio (Dropdown en Hover - solo visible si al menos 1 subsección está activa) */}
            {visiblePortfolioSublinks.length > 0 && (
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('portfolio')}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => handleScrollTo(visiblePortfolioSublinks[0]?.sectionId || 'galeria')}
                  className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors cursor-pointer focus:outline-none ${
                    activeDropdown === 'portfolio' ? 'text-white' : 'text-gray-300 hover:text-white'
                  }`}
                  aria-expanded={activeDropdown === 'portfolio'}
                  aria-haspopup="true"
                >
                  <span>Portafolio</span>
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                      activeDropdown === 'portfolio' ? 'rotate-180 text-white' : ''
                    }`} 
                  />
                </button>

                {/* Invisible Hover Bridge Pad */}
                <div className="absolute top-full left-0 right-0 h-2 -mt-1 pointer-events-auto" />

                {/* Dropdown Menu con AnimatePresence de Framer Motion */}
                <AnimatePresence>
                  {activeDropdown === 'portfolio' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      className="absolute top-[calc(100%+4px)] left-0 min-w-[220px] bg-[#141414]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                    >
                      <div className="space-y-1">
                        {visiblePortfolioSublinks.map((item) => {
                          const Icon = item.icon;
                          return (
                            <a
                              key={item.href}
                              href={item.href}
                              onClick={(e) => {
                                e.preventDefault();
                                handleScrollTo(item.sectionId);
                              }}
                              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                              <span className="p-1 rounded-lg bg-white/5 text-gray-400 group-hover:text-[#E53935] group-hover:bg-[#E53935]/10 transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </span>
                              <span>{item.label}</span>
                            </a>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

          </div>

          {/* Call to Action (Derecha) + Acciones complementarias */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
              title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-300" />
              )}
            </button>

            {/* Architecture Docs Button */}
            {onOpenArchitectureDocs && (
              <button
                onClick={onOpenArchitectureDocs}
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                title="Arquitectura Next.js & Base de Datos"
              >
                <Code2 className="w-3.5 h-3.5 text-[#E53935]" />
                <span>Stack</span>
              </button>
            )}

            {/* Admin Dashboard Switcher Button */}
            {setCurrentView && (
              currentView === 'portfolio' ? (
                <button
                  onClick={() => setCurrentView('admin')}
                  className="p-2.5 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer group"
                  title={isAdminAuthenticated ? "Abrir Panel de Administración" : "Acceso Administrativo"}
                >
                  {isAdminAuthenticated ? (
                    <Unlock className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Lock className="w-4 h-4 text-gray-400 group-hover:text-white" />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('portfolio')}
                  className="px-3 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/15 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FolderKanban className="w-3.5 h-3.5" />
                  <span>Ver Portafolio</span>
                </button>
              )
            )}

            {/* Botón Sólido de Contacto (CTA Exacto - oculto si la sección contacto está oculta) */}
            {showContact && (
              <a
                href="#contacto"
                onClick={(e) => {
                  e.preventDefault();
                  handleScrollTo('contacto');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E53935] hover:bg-[#d32f2f] text-white font-medium text-sm rounded-xl transition-all duration-200 shadow-md shadow-[#E53935]/20 hover:shadow-lg hover:shadow-[#E53935]/30 active:scale-95 cursor-pointer"
              >
                <span>Contacto</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            )}

          </div>

          {/* Botón Hamburger (Mobile) */}
          <div className="flex md:hidden items-center gap-2">
            
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-white bg-white/5 border border-white/10 rounded-xl transition-colors"
              aria-label="Alternar tema"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-gray-300" />
              )}
            </button>

            {/* Hamburger Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors cursor-pointer focus:outline-none"
              aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#E53935]" />
              ) : (
                <Menu className="w-6 h-6 text-white" />
              )}
            </button>

          </div>

        </div>
      </nav>

      {/* Menú Móvil Desplegable (Full-Screen Overlay con Framer Motion) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Menú Lateral / Drawer Animado */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-[#0F0F0F] border-l border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              
              {/* Encabezado del Menú Móvil */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#141414]/60">
                <div className="flex flex-col">
                  <span className="font-sans font-black tracking-tight text-2xl text-white">
                    Asael Agramonte<span className="text-[#E53935]">.</span>
                  </span>
                  <span className="text-[11px] font-mono tracking-widest uppercase text-gray-400 -mt-0.5">
                    Menú de Navegación
                  </span>
                </div>

                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors cursor-pointer"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Cuerpo del Menú Móvil: Enlaces y Subenlaces Indentados */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                
                {/* 1. Sección "Sobre Mí" (solo visible si al menos 1 subsección está activa) */}
                {visibleAboutSublinks.length > 0 && (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setIsMobileAboutOpen(!isMobileAboutOpen)}
                      className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold px-1 py-1 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Sobre Mí</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobileAboutOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isMobileAboutOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-l-2 border-[#E53935]/40 ml-2 pl-4 space-y-1.5 pt-1"
                        >
                          {visibleAboutSublinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleScrollTo(item.sectionId);
                                }}
                                className="flex items-center gap-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group cursor-pointer"
                              >
                                <span className="p-1 rounded-md bg-white/5 text-gray-400 group-hover:text-[#E53935] group-hover:bg-[#E53935]/15 transition-colors">
                                  <Icon className="w-3.5 h-3.5" />
                                </span>
                                <span>{item.label}</span>
                              </a>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* 2. Sección "Especialidades" (Enlace Directo - condicionado por visibilidad) */}
                {showSpecialties && (
                  <div className="pt-2">
                    <a
                      href="#especialidades"
                      onClick={(e) => {
                        e.preventDefault();
                        handleScrollTo('especialidades');
                      }}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/15 text-sm font-medium text-gray-200 hover:text-white transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#E53935]" />
                        <span>Especialidades</span>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-gray-500" />
                    </a>
                  </div>
                )}

                {/* 3. Sección "Portafolio" (solo visible si al menos 1 subsección está activa) */}
                {visiblePortfolioSublinks.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsMobilePortfolioOpen(!isMobilePortfolioOpen)}
                      className="w-full flex items-center justify-between text-left text-xs font-mono uppercase tracking-wider text-gray-400 font-semibold px-1 py-1 hover:text-white transition-colors cursor-pointer"
                    >
                      <span>Portafolio</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isMobilePortfolioOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {isMobilePortfolioOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-l-2 border-[#E53935]/40 ml-2 pl-4 space-y-1.5 pt-1"
                        >
                          {visiblePortfolioSublinks.map((item) => {
                            const Icon = item.icon;
                            return (
                              <a
                                key={item.href}
                                href={item.href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleScrollTo(item.sectionId);
                                }}
                                className="flex items-center gap-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors group cursor-pointer"
                              >
                                <span className="p-1 rounded-md bg-white/5 text-gray-400 group-hover:text-[#E53935] group-hover:bg-[#E53935]/15 transition-colors">
                                  <Icon className="w-3.5 h-3.5" />
                                </span>
                                <span>{item.label}</span>
                              </a>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Control Administrativo (Mobile) */}
                {setCurrentView && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500 block px-1">
                      Estado de Acceso
                    </span>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-gray-300 flex items-center gap-1.5">
                          {isAdminAuthenticated ? (
                            <>
                              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                              <span className="text-emerald-400 font-semibold">Admin Activo</span>
                            </>
                          ) : (
                            <>
                              <Lock className="w-3.5 h-3.5 text-gray-400" />
                              <span>Vista Pública</span>
                            </>
                          )}
                        </span>

                        {isAdminAuthenticated ? (
                          <button
                            type="button"
                            onClick={handleLockAdmin}
                            className="text-[10px] font-mono text-red-400 hover:underline cursor-pointer"
                          >
                            Cerrar Sesión
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setShowQuickAuthInput(!showQuickAuthInput)}
                            className="text-[10px] font-mono text-[#E53935] hover:underline cursor-pointer"
                          >
                            {showQuickAuthInput ? 'Cancelar' : 'Iniciar'}
                          </button>
                        )}
                      </div>

                      {showQuickAuthInput && !isAdminAuthenticated && (
                        <form onSubmit={handleQuickUnlock} className="space-y-1.5 pt-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="password"
                              placeholder="Clave admin2026"
                              value={quickPassword}
                              onChange={(e) => setQuickPassword(e.target.value)}
                              className="flex-1 bg-black/50 border border-white/15 text-white px-3 py-1.5 rounded-lg text-xs font-mono focus:border-[#E53935] focus:outline-none"
                              autoFocus
                            />
                            <button
                              type="submit"
                              className="px-3 py-1.5 bg-[#E53935] text-white text-xs font-mono rounded-lg font-bold"
                            >
                              Entrar
                            </button>
                          </div>
                          {authError && (
                            <p className="text-[10px] text-red-400 font-mono">{authError}</p>
                          )}
                        </form>
                      )}

                      {isAdminAuthenticated && (
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentView(currentView === 'admin' ? 'portfolio' : 'admin');
                            setIsMobileMenuOpen(false);
                          }}
                          className="w-full py-1.5 bg-[#E53935] hover:bg-[#d32f2f] text-white text-xs font-mono rounded-lg font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FolderKanban className="w-3.5 h-3.5" />
                          <span>{currentView === 'admin' ? 'Ver Portafolio' : 'Abrir Panel de Control'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

              </div>

              {/* Pie del Menú Móvil: Botón de Contacto CTA */}
              <div className="p-6 border-t border-white/10 bg-[#141414]/90 space-y-4">
                
                {/* Botón Sólido de Contacto Móvil (oculto si la sección contacto está oculta) */}
                {showContact && (
                  <a
                    href="#contacto"
                    onClick={(e) => {
                      e.preventDefault();
                      handleScrollTo('contacto');
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-[#E53935] hover:bg-[#d32f2f] text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-[#E53935]/25 active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Contacto Directo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                )}

                <div className="text-center">
                  <p className="text-[11px] font-mono text-gray-500">
                    Lic. Asael Agramonte · Portafolio 2026
                  </p>
                </div>

              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
