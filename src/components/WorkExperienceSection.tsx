import React from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  Building, 
  Calendar, 
  CheckCircle, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2 
} from 'lucide-react';
import { WorkExperience } from '../types/portfolio';

interface WorkExperienceSectionProps {
  experiences: WorkExperience[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onAddExperience?: () => void;
  onEditExperience?: (exp: WorkExperience) => void;
  onDeleteExperience?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({
  experiences,
  isAdmin = false,
  title = "TRAYECTORIA & EXPERIENCIA LABORAL",
  subtitle = "Cargos en dirección gráfica institucional, diseño multimedia, producción audiovisual y liderazgo de equipos creativos.",
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onEditSection,
  onDeleteSection
}) => {
  return (
    <section id="trayectoria" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Bar — STRICTLY ADMIN ONLY */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Experiencia Laboral · Controles de Administración ({experiences.length} cargos)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddExperience && (
                <button
                  type="button"
                  onClick={onAddExperience}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Experiencia</span>
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
                  title="Ocultar sección Experiencia Laboral de la vista pública"
                >
                  <span>Ocultar Sección</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[var(--border-subtle)] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Trayectoria Profesional y Cargos Desempeñados</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Timeline List */}
        {experiences.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs font-mono">
            No hay experiencias laborales registradas actualmente.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {experiences.map((exp, idx) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/50 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-subtle)] pb-4">
                  <div>
                    <h3 className="font-bebas text-2xl sm:text-3xl text-[var(--text-primary)] tracking-wide">
                      {exp.role}
                    </h3>
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-color)] font-semibold mt-0.5">
                      <Building className="w-3.5 h-3.5" />
                      <span>{exp.company}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)]">
                      {exp.period}
                    </span>
                    
                    {/* Admin actions — STRICTLY ADMIN ONLY */}
                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        {onEditExperience && (
                          <button
                            type="button"
                            onClick={() => onEditExperience(exp)}
                            className="p-1.5 text-neutral-400 hover:text-[var(--accent-color)] hover:bg-[var(--bg-elevated)] rounded-lg cursor-pointer transition-colors"
                            title="Editar experiencia"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteExperience && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar la experiencia "${exp.role} en ${exp.company}"?`)) {
                                onDeleteExperience(exp.id);
                              }
                            }}
                            className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-950/20 rounded-lg cursor-pointer transition-colors"
                            title="Eliminar experiencia"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <ul className="space-y-2 pt-2">
                  {exp.description.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                      <CheckCircle className="w-4 h-4 text-[var(--accent-color)] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
