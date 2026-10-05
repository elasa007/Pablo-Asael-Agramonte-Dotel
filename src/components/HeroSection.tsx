import React from 'react';
import { motion } from 'motion/react';
import { ArrowDownRight, Mail, Sparkles, Award, Camera, Edit3 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { SiteProfile } from '../types/portfolio';

interface HeroSectionProps {
  profile: SiteProfile;
  isAdmin: boolean;
  onExploreProjects: () => void;
  onContactClick: () => void;
  onChangeProfilePhoto: () => void;
  onEditSection: () => void;
  onDeleteSection?: () => void;
  onSelectProfilePhoto?: (url: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  profile,
  isAdmin,
  onExploreProjects,
  onContactClick,
  onChangeProfilePhoto,
  onEditSection,
  onDeleteSection,
  onSelectProfilePhoto
}) => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden border-b border-[var(--border-subtle)] py-16 lg:py-24 transition-colors duration-300">
      {/* Background ambient lighting and subtle editorial grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--accent-color)]/25 rounded-full blur-[140px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--accent-color)]/15 rounded-full blur-[150px]" />
        <div className="w-full h-full bg-[radial-gradient(var(--border-strong)_1px,transparent_1px)] [background-size:32px_32px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Admin Quick Edit Bar for Hero */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Portada / Hero · Controles de Administración</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onChangeProfilePhoto}
                className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Gestionar Fotos</span>
              </button>
              <button
                onClick={onEditSection}
                className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Editar Textos</span>
              </button>
              {onDeleteSection && (
                <button
                  onClick={() => {
                    if (confirm('¿Deseas ocultar/borrar la sección Portada de la vista pública? Podrás restaurarla en el Gestor de Secciones.')) {
                      onDeleteSection();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Ocultar sección Portada"
                >
                  <span>Ocultar Sección</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Massive Editorial Typography & Actions (7 columns) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center space-y-8"
          >
            {/* Top editorial kicker (clean unboxed text with separator) */}
            <div className="flex items-center gap-3 text-xs sm:text-sm font-medium tracking-widest uppercase text-[var(--text-secondary)]">
              <span className="text-[var(--accent-color)] font-bold">{profile.degreeTitle}</span>
              <span aria-hidden="true" className="text-neutral-500">·</span>
              <span>{profile.roleTitle}</span>
            </div>

            {/* Giant Title: CREATIVO MULTIMEDIA */}
            <div className="space-y-1">
              <h1 className="font-bebas text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] tracking-tight leading-[0.88] text-[var(--text-primary)] select-none">
                {profile.heroHeadlineTop} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--text-primary)] via-neutral-400 to-[var(--accent-color)]">
                  {profile.heroHeadlineBottom}
                </span>
              </h1>
            </div>

            {/* Descriptive Subtitle with Asael Agramonte's specific practice */}
            <p className="max-w-xl text-base sm:text-lg lg:text-xl text-[var(--text-secondary)] font-normal leading-relaxed">
              {profile.bioSummary}
            </p>

            {/* Key Metrics / Editorial Trust Marks */}
            <div className="pt-2 pb-2 flex items-center gap-6 sm:gap-10 border-y border-[var(--border-subtle)] py-4 text-xs sm:text-sm">
              <div>
                <p className="font-bebas text-2xl sm:text-3xl text-[var(--text-primary)] tracking-wide">{profile.stat1Value}</p>
                <p className="text-[var(--text-muted)] uppercase text-[11px] tracking-wider">{profile.stat1Label}</p>
              </div>
              <div className="w-[1px] h-8 bg-[var(--border-subtle)]" />
              <div>
                <p className="font-bebas text-2xl sm:text-3xl text-[var(--text-primary)] tracking-wide">{profile.stat2Value}</p>
                <p className="text-[var(--text-muted)] uppercase text-[11px] tracking-wider">{profile.stat2Label}</p>
              </div>
              <div className="w-[1px] h-8 bg-[var(--border-subtle)]" />
              <div>
                <p className="font-bebas text-2xl sm:text-3xl text-[var(--accent-color)] tracking-wide">{profile.stat3Value}</p>
                <p className="text-[var(--text-muted)] uppercase text-[11px] tracking-wider">{profile.stat3Label}</p>
              </div>
            </div>

            {/* Inverted Hover Buttons as strictly requested */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              {/* Botón 1: "Ver Proyectos" - Efecto hover que invierte colores */}
              <button
                onClick={onExploreProjects}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white bg-[var(--accent-color)] border-2 border-[var(--accent-color)] rounded-none hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] hover:border-[var(--text-primary)] transition-all duration-300 ease-out cursor-pointer shadow-lg shadow-[var(--accent-color)]/20"
              >
                <span>Ver Proyectos</span>
                <ArrowDownRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" />
              </button>

              {/* Botón 2: "Contáctame" - Efecto hover que invierte colores */}
              <button
                onClick={onContactClick}
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-primary)] bg-transparent border-2 border-[var(--text-primary)] rounded-none hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 ease-out cursor-pointer"
              >
                <span>Contáctame</span>
                <Mail className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
              </button>
            </div>
          </motion.div>

          {/* Right Column: Floating Profile Cutout Image with Red Ambient Glow (5 columns) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Ambient lighting halo */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 bg-[var(--accent-color)]/25 rounded-full blur-[100px] pointer-events-none" />

            {/* Profile Cutout Card with floating animation */}
            <div className="flex flex-col items-center gap-4 w-full max-w-sm sm:max-w-md">
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden border border-[var(--border-strong)] bg-[var(--bg-secondary)] shadow-2xl group ${
                  isAdmin ? 'cursor-pointer' : ''
                }`}
                onClick={isAdmin ? onChangeProfilePhoto : undefined}
              >
                {/* Studio photo of Lic. Asael Agramonte */}
                <img
                  src={profile.avatarUrl}
                  alt={profile.degreeTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Gradient Scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-90 group-hover:opacity-75 transition-opacity" />

                {/* Floating "Cambiar Foto" Badge top right - STRICTLY ADMIN ONLY */}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChangeProfilePhoto();
                    }}
                    className="absolute top-4 right-4 px-3 py-1.5 bg-black/75 hover:bg-[var(--accent-color)] text-white text-xs font-mono rounded-full border border-white/20 transition-all flex items-center gap-1.5 backdrop-blur-md shadow-lg cursor-pointer z-30"
                    title="Cambiar o subir foto de perfil"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Cambiar Foto</span>
                  </button>
                )}

                {/* Hover overlay hint - STRICTLY ADMIN ONLY */}
                {isAdmin && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white pointer-events-none">
                    <Camera className="w-8 h-8 text-[var(--accent-color)] mb-2" />
                    <span className="text-xs font-mono uppercase tracking-wider font-semibold">
                      Haz clic para cambiar foto de perfil
                    </span>
                  </div>
                )}

                {/* Floating Badge on Card */}
                <div className="absolute bottom-6 left-6 right-6 z-20 flex items-center justify-between backdrop-blur-md bg-[var(--bg-primary)]/85 border border-[var(--border-strong)] p-4 rounded-xl shadow-lg">
                  <div>
                    <p className="font-bebas text-lg text-[var(--text-primary)] tracking-wide">{profile.degreeTitle}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{profile.roleTitle}</p>
                  </div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
                </div>
              </motion.div>

              {/* Photo Selector Strip: Quick switch between Asael's profile photos */}
              {profile.profilePhotos && profile.profilePhotos.length > 1 && (
                <div className="w-full flex items-center justify-center gap-2 p-2 bg-[var(--bg-secondary)]/80 backdrop-blur-md border border-[var(--border-subtle)] rounded-xl">
                  <span className="text-[10px] font-mono uppercase text-[var(--text-muted)] mr-1">
                    Retratos ({profile.profilePhotos.length}):
                  </span>
                  <div className="flex items-center gap-2 overflow-x-auto">
                    {profile.profilePhotos.slice(0, 5).map((photo, i) => {
                      const isActive = profile.avatarUrl === photo;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => onSelectProfilePhoto?.(photo)}
                          className={`relative w-8 h-10 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${
                            isActive 
                              ? 'border-[var(--accent-color)] scale-110 shadow-sm' 
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                          title={`Ver foto ${i + 1}`}
                        >
                          <img src={photo} alt="" className="w-full h-full object-cover" />
                        </button>
                      );
                    })}
                  </div>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={onChangeProfilePhoto}
                      className="p-1.5 text-xs text-[var(--accent-color)] hover:bg-[var(--accent-color)]/10 rounded-lg transition-colors cursor-pointer ml-1"
                      title="Añadir más fotos"
                    >
                      +
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

