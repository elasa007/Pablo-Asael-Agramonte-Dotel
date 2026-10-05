import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Calendar, 
  Building, 
  Layers, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Award,
  X 
} from 'lucide-react';
import { EducationItem } from '../types/portfolio';

interface EducationSectionProps {
  education: EducationItem[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onAddEducation?: () => void;
  onEditEducation?: (edu: EducationItem) => void;
  onDeleteEducation?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  isAdmin = false,
  title = "FORMACIÓN ACADÉMICA & ESPECIALIZACIONES",
  subtitle = "Títulos de grado, diplomados y certificaciones técnicas de Lic. Asael Agramonte en publicidad, desarrollo web, diseño audiovisual y docencia virtual.",
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  onEditSection,
  onDeleteSection
}) => {
  const [eduFilter, setEduFilter] = useState<string>('Todos');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmHideSection, setConfirmHideSection] = useState(false);

  // Collect all unique categories
  const eduCategories = [
    'Todos',
    ...Array.from(new Set(education.map(e => e.category)))
  ];

  const filteredEducation = eduFilter === 'Todos'
    ? education
    : education.filter(e => e.category === eduFilter);

  return (
    <section id="formacion" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors duration-300 relative">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[var(--accent-color)]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Admin Bar — STRICTLY ADMIN ONLY */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Formación Académica · Controles de Administración ({education.length} programas)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddEducation && (
                <button
                  type="button"
                  onClick={onAddEducation}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Formación</span>
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
                confirmHideSection ? (
                  <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/40 px-2 py-1 rounded-lg">
                    <span className="text-[11px] font-mono text-red-400">¿Ocultar sección?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteSection();
                        setConfirmHideSection(false);
                      }}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer"
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmHideSection(false)}
                      className="px-2 py-0.5 text-neutral-400 hover:text-white text-[10px] font-mono rounded cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmHideSection(true)}
                    className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Ocultar sección Formación"
                  >
                    <span>Ocultar Sección</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[var(--border-subtle)] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Grado Universitario, Diplomados & Certificaciones</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Education Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-mono scrollbar-none">
          {eduCategories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setEduFilter(cat)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                eduFilter === cat
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-md'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Education Grid */}
        {filteredEducation.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs font-mono">
            No hay programas académicos registrados en esta categoría.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEducation.map((edu, idx) => (
              <motion.div
                key={edu.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/60 rounded-2xl p-6 flex flex-col justify-between space-y-4 transition-all group relative shadow-sm hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[var(--accent-color)] font-mono font-semibold">
                    <span className="truncate pr-2">{edu.category}</span>
                    <span className="px-2 py-0.5 rounded bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-muted)] shrink-0">
                      {edu.year}
                    </span>
                  </div>

                  <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors leading-tight">
                    {edu.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-mono">
                    <Building className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                    <span>{edu.institution}</span>
                  </div>

                  {edu.description && (
                    <p className="text-xs text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                      {edu.description}
                    </p>
                  )}
                </div>

                {/* Admin Controls — STRICTLY ADMIN ONLY */}
                {isAdmin && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-1.5">
                    {onEditEducation && (
                      <button
                        type="button"
                        onClick={() => onEditEducation(edu)}
                        className="p-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-[var(--text-secondary)] rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 border border-[var(--border-subtle)]"
                        title="Editar formación"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="font-mono">Editar</span>
                      </button>
                    )}
                    {onDeleteEducation && (
                      confirmDeleteId === edu.id ? (
                        <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/60 p-1 rounded-lg shadow-lg z-20">
                          <span className="text-[10px] font-mono text-red-200 font-bold px-1">¿Eliminar?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteEducation(edu.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer transition-colors shadow"
                            title="Confirmar eliminación"
                          >
                            Sí
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="p-0.5 text-neutral-300 hover:text-white rounded cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(edu.id)}
                          className="p-1.5 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer border border-red-500/20"
                          title="Eliminar formación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
