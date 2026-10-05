import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  GraduationCap, 
  Award, 
  Phone, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle,
  Building,
  Calendar,
  Layers,
  UserCheck,
  Edit3
} from 'lucide-react';
import { WorkExperience, EducationItem, ReferenceItem } from '../types/portfolio';

interface ExperienceEducationSectionProps {
  experiences: WorkExperience[];
  education: EducationItem[];
  references: ReferenceItem[];
  isAdmin: boolean;
  title?: string;
  subtitle?: string;
  onAddExperience?: () => void;
  onEditExperience?: (exp: WorkExperience) => void;
  onDeleteExperience?: (id: string) => void;
  onAddEducation?: () => void;
  onEditEducation?: (edu: EducationItem) => void;
  onDeleteEducation?: (id: string) => void;
  onAddReference?: () => void;
  onDeleteReference?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const ExperienceEducationSection: React.FC<ExperienceEducationSectionProps> = ({
  experiences,
  education,
  references,
  isAdmin,
  title = "EXPERIENCIA & FORMACIÓN",
  subtitle = "Trayectoria contrastada de Lic. Asael Agramonte en publicidad, dirección gráfica institucional, producción audiovisual y desarrollo web.",
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  onAddReference,
  onDeleteReference,
  onEditSection,
  onDeleteSection
}) => {
  const [eduFilter, setEduFilter] = useState<string>('Todos');

  const eduCategories = [
    'Todos',
    'Educación Superior e Idiomas',
    'Desarrollo Web y Tecnología',
    'Publicidad, Audiovisual y Gestión'
  ];

  const filteredEducation = eduFilter === 'Todos'
    ? education
    : education.filter(e => e.category === eduFilter);

  return (
    <section id="trayectoria" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Bar */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Trayectoria & CV · Controles de Administración</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddExperience && (
                <button
                  type="button"
                  onClick={onAddExperience}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Experiencia</span>
                </button>
              )}
              {onAddEducation && (
                <button
                  type="button"
                  onClick={onAddEducation}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Formación</span>
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
                  onClick={() => {
                    if (confirm('¿Deseas ocultar/borrar la sección de Trayectoria de la vista pública? Podrás restaurarla en el Gestor de Secciones.')) {
                      onDeleteSection();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Ocultar sección Trayectoria"
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
              <Award className="w-3.5 h-3.5" />
              <span>Currículum Vitae & Respaldos Oficiales</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 1. Experiencia Laboral Timeline */}
        <div className="mb-20 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)] shadow-sm">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                  EXPERIENCIA LABORAL
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Cargos directivos y de desarrollo multimedia ({experiences.length} registros)
                </p>
              </div>
            </div>

            {isAdmin && onAddExperience && (
              <button
                onClick={onAddExperience}
                className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Experiencia</span>
              </button>
            )}
          </div>

          {experiences.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--bg-secondary)] text-[var(--text-muted)] text-xs">
              No hay experiencias laborales registradas.
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-4">
                    <div>
                      <h4 className="font-bebas text-2xl sm:text-3xl text-[var(--text-primary)] tracking-wide">
                        {exp.role}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-[var(--accent-color)] font-semibold">
                        <Building className="w-3.5 h-3.5" />
                        <span>{exp.company}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg font-mono text-xs text-[var(--text-secondary)]">
                        {exp.period}
                      </span>
                      {isAdmin && (
                        <div className="flex items-center gap-1">
                          {onEditExperience && (
                            <button
                              onClick={() => onEditExperience(exp)}
                              className="p-1.5 text-neutral-400 hover:text-[var(--accent-color)] rounded cursor-pointer transition-colors"
                              title="Editar experiencia"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}
                          {onDeleteExperience && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Eliminar la experiencia "${exp.role} en ${exp.company}"?`)) {
                                  onDeleteExperience(exp.id);
                                }
                              }}
                              className="p-1.5 text-neutral-400 hover:text-red-500 rounded cursor-pointer transition-colors"
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

        {/* 2. Formación Académica & Certificaciones */}
        <div className="mb-20 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)] shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                  FORMACIÓN ACADÉMICA & ESPECIALIZACIONES
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Títulos de grado, diplomados y certificaciones técnicas ({education.length} programas)
                </p>
              </div>
            </div>

            {isAdmin && onAddEducation && (
              <button
                onClick={onAddEducation}
                className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Formación</span>
              </button>
            )}
          </div>

          {/* Education Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {eduCategories.map(cat => (
              <button
                key={cat}
                onClick={() => setEduFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer whitespace-nowrap ${
                  eduFilter === cat
                    ? 'bg-[var(--accent-color)] text-white font-semibold'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Education Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEducation.map((edu, idx) => (
              <div
                key={edu.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/40 rounded-xl p-5 space-y-2 transition-all group relative"
              >
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onEditEducation && (
                      <button
                        onClick={() => onEditEducation(edu)}
                        className="p-1 bg-black/60 hover:bg-[var(--accent-color)] text-white rounded transition-colors"
                        title="Editar formación"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                    )}
                    {onDeleteEducation && (
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar "${edu.title}"?`)) {
                            onDeleteEducation(edu.id);
                          }
                        }}
                        className="p-1 bg-black/60 hover:bg-red-600 text-white rounded transition-colors"
                        title="Eliminar formación"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between text-xs text-[var(--accent-color)] font-mono font-semibold">
                  <span>{edu.category}</span>
                  <span className="text-[var(--text-muted)]">{edu.year}</span>
                </div>
                <h4 className="font-bebas text-xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors">
                  {edu.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  {edu.institution}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Referencias Laborales */}
        <div className="space-y-6 pt-10 border-t border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)] shadow-sm">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                  REFERENCIAS LABORALES
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Contactos directos de respaldo profesional ({references.length} referencias)
                </p>
              </div>
            </div>

            {isAdmin && onAddReference && (
              <button
                onClick={onAddReference}
                className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white border border-[var(--border-subtle)] text-xs font-mono rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Referencia</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {references.map((ref) => (
              <div
                key={ref.id}
                className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl p-6 space-y-3 relative group"
              >
                {isAdmin && onDeleteReference && (
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar referencia de ${ref.name}?`)) {
                        onDeleteReference(ref.id);
                      }
                    }}
                    className="absolute top-3 right-3 p-1 text-neutral-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Eliminar referencia"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                <div>
                  <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                    {ref.name}
                  </h4>
                  <p className="text-xs text-[var(--accent-color)] font-mono font-medium">
                    {ref.role}
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {ref.organization}
                  </p>
                </div>

                <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)]">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <a href={`tel:${ref.phone.replace(/\s+/g, '')}`} className="hover:text-[var(--text-primary)]">
                    {ref.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
