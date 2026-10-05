import React from 'react';
import { motion } from 'motion/react';
import { SpecialtyItem, SpecialtyCategory } from '../types/portfolio';
import { ArrowUpRight, Sparkles, Edit3, Trash2, Plus, Sliders } from 'lucide-react';

interface SpecialtiesGridProps {
  specialties: SpecialtyItem[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onSelectCategory?: (category: SpecialtyCategory) => void;
  onEditSpecialty?: (specialty: SpecialtyItem) => void;
  onDeleteSpecialty?: (id: string) => void;
  onAddSpecialty?: () => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const SpecialtiesGrid: React.FC<SpecialtiesGridProps> = ({ 
  specialties,
  isAdmin = false,
  title = "ESPECIALIDADES",
  subtitle = "Seis disciplinas articuladas bajo la dirección de arte de Asael Agramonte, combinando sensibilidad plástica con tecnología y pensamiento estratégico.",
  onSelectCategory,
  onEditSpecialty,
  onDeleteSpecialty,
  onAddSpecialty,
  onEditSection,
  onDeleteSection
}) => {
  const [confirmHideSection, setConfirmHideSection] = React.useState(false);
  return (
    <section id="especialidades" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] relative transition-colors duration-300">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-80 h-80 bg-[var(--accent-color)]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Admin Bar */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Especialidades · Controles de Administración ({specialties.length} disciplinas)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddSpecialty && (
                <button
                  type="button"
                  onClick={onAddSpecialty}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Especialidad</span>
                </button>
              )}
              {onEditSection && (
                <button
                  type="button"
                  onClick={onEditSection}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Textos</span>
                </button>
              )}
              {onDeleteSection && (
                <button
                  type="button"
                  onClick={onDeleteSection}
                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Ocultar sección Especialidades de la vista pública"
                >
                  <span>Ocultar Sección</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[var(--border-subtle)] gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campos de Dominio Técnico & Artístico</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Grid de Especialidades */}
        {specialties.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[var(--border-strong)] rounded-2xl p-8 bg-[var(--bg-secondary)]">
            <p className="font-bebas text-2xl text-[var(--text-secondary)]">No hay especialidades registradas</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">Puedes añadir especialidades desde el Panel de Administración.</p>
            {isAdmin && onAddSpecialty && (
              <button
                type="button"
                onClick={onAddSpecialty}
                className="mt-4 px-4 py-2 bg-[var(--accent-color)] text-white text-xs font-semibold uppercase tracking-wider rounded-lg"
              >
                Añadir Primera Especialidad
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {specialties.map((specialty, index) => {
              const rowNumber = String(index + 1).padStart(2, '0');

              return (
                <motion.div
                  key={specialty.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => onSelectCategory?.(specialty.id as SpecialtyCategory)}
                  className="group relative h-[340px] sm:h-[380px] rounded-xl overflow-hidden cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/60 transition-colors duration-500 bg-[var(--bg-secondary)] shadow-md"
                >
                  {/* 1. Imagen de Fondo con Zoom en Hover */}
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      className="w-full h-full"
                      whileHover={{ scale: 1.08 }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <img
                        src={specialty.image}
                        alt={specialty.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-90 transition-all duration-700"
                        loading="lazy"
                      />
                    </motion.div>
                  </div>

                  {/* 2. Oscurecimiento Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/75 to-[var(--bg-primary)]/30 group-hover:via-[var(--bg-primary)]/60 transition-colors duration-500" />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-[var(--accent-color)]/10 transition-colors duration-500" />

                  {/* Admin inline edit/delete controls */}
                  {isAdmin && (
                    <div className="absolute top-4 right-16 flex items-center gap-1.5 z-30">
                      {onEditSpecialty && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditSpecialty(specialty);
                          }}
                          className="p-2 bg-black/80 hover:bg-[var(--accent-color)] text-white rounded-lg transition-colors cursor-pointer shadow"
                          title="Editar especialidad"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteSpecialty && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Eliminar la especialidad "${specialty.title}"?`)) {
                              onDeleteSpecialty(specialty.id);
                            }
                          }}
                          className="p-2 bg-black/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow"
                          title="Eliminar especialidad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* 3. Contenido de la Tarjeta */}
                  <div className="relative h-full p-8 flex flex-col justify-between z-10">
                    {/* Top Bar: Numeración Editorial & Flecha de Acción */}
                    <div className="flex items-center justify-between">
                      <span className="font-bebas text-2xl text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors duration-300">
                        {rowNumber}
                      </span>
                      <div className="w-10 h-10 rounded-full border border-[var(--border-strong)] bg-[var(--bg-primary)]/70 flex items-center justify-center text-[var(--text-primary)] group-hover:bg-[var(--accent-color)] group-hover:border-[var(--accent-color)] group-hover:text-white transition-all duration-300">
                        <ArrowUpRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </div>

                    {/* Bottom Content: Título con brillo (Glow), Subtítulo y Tagline */}
                    <div className="space-y-3">
                      <div className="text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold">
                        {specialty.tagline}
                      </div>

                      {/* Título Principal con Efecto Brillante (Glow) al Hover */}
                      <h3 className="font-bebas text-4xl sm:text-5xl text-[var(--text-primary)] tracking-wide leading-none transition-all duration-300 group-hover:drop-shadow-[0_0_20px_var(--accent-glow)] group-hover:translate-x-1">
                        {specialty.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed transition-colors duration-300 group-hover:text-[var(--text-primary)]">
                        {specialty.description}
                      </p>

                      <div className="pt-2 flex items-center gap-2 text-xs font-medium text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="underline underline-offset-4 decoration-[var(--accent-color)]">Explorar proyectos de {specialty.title}</span>
                        <span>→</span>
                      </div>
                    </div>
                  </div>

                  {/* Línea inferior roja animada en hover */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--accent-color)] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
