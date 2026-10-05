import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, SpecialtyCategory } from '../types/portfolio';
import { Eye, ArrowUpRight, Sparkles, Filter, Edit3, Trash2, Plus, Play, FileText, Presentation, Video as VideoIcon, Layers } from 'lucide-react';

interface MasonryGalleryProps {
  projects: Project[];
  selectedCategory: SpecialtyCategory | 'Todos';
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onCategoryChange: (category: SpecialtyCategory | 'Todos') => void;
  onProjectClick: (project: Project) => void;
  onEditProject?: (project: Project) => void;
  onDeleteProject?: (id: string) => void;
  onAddProject?: () => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

const DEFAULT_CATEGORIES: Array<SpecialtyCategory | 'Todos'> = [
  'Todos',
  'Diapositivas',
  'Social Media',
  'Branding',
  'Editorial',
  'Fotografía',
  'Ilustración',
  'Video'
];

export const MasonryGallery: React.FC<MasonryGalleryProps> = ({
  projects,
  selectedCategory,
  isAdmin = false,
  title = "GALERÍA DINÁMICA",
  subtitle = "Curaduría de proyectos de Asael Agramonte gestionados en tiempo real. Haz clic en cualquier pieza para examinar el caso de estudio y la ficha técnica.",
  onCategoryChange,
  onProjectClick,
  onEditProject,
  onDeleteProject,
  onAddProject,
  onEditSection,
  onDeleteSection
}) => {
  // Collect all unique categories from current projects and default categories
  const categories: Array<SpecialtyCategory | 'Todos'> = [
    'Todos',
    ...Array.from(new Set([
      ...DEFAULT_CATEGORIES.filter(c => c !== 'Todos'),
      ...projects.map(p => p.category)
    ]))
  ];

  const filteredProjects = selectedCategory === 'Todos'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  return (
    <section id="galeria" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] relative transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Bar */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Proyectos & Galería · Controles de Administración ({projects.length} obras)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddProject && (
                <button
                  type="button"
                  onClick={onAddProject}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Proyecto</span>
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
                  title="Ocultar sección Galería de la vista pública"
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
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[var(--border-subtle)] gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Archivo de Trabajos Seleccionados</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Interactive Segmented Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 overflow-x-auto pb-6 scrollbar-none mb-10"
        >
          <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)]">
            {categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => onCategoryChange(category)}
                  className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[var(--accent-color)] text-white shadow-md shadow-[var(--accent-color)]/25'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
          <span className="text-xs text-[var(--text-muted)] font-mono pl-3 hidden sm:inline">
            {filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}
          </span>
        </motion.div>

        {/* Diapositivas Integration Banner when filter is active */}
        {selectedCategory === 'Diapositivas' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 sm:p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 shrink-0">
                <Presentation className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Presentaciones & Decks Corporativos en la Galería
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Formatos interactivos en Canva, Google Slides y PowerPoint con acceso directo a visualización y fichas de diseño.
                </p>
              </div>
            </div>
            <a
              href="#documentos"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors whitespace-nowrap self-start sm:self-auto cursor-pointer"
            >
              <span>Ver Sección de Diapositivas</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>
        )}

        {/* Dynamic Masonry Columns Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-[var(--border-strong)] rounded-2xl p-8 bg-[var(--bg-secondary)]">
            <p className="font-bebas text-2xl text-[var(--text-secondary)]">No hay proyectos en esta categoría</p>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Puedes subir un nuevo proyecto desde el Panel de Administración o cambiar de filtro.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => onCategoryChange('Todos')}
                className="px-4 py-2 text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-elevated)] hover:bg-[var(--bg-primary)] border border-[var(--border-strong)] rounded-lg transition-colors cursor-pointer"
              >
                Ver todos los proyectos
              </button>
              {isAdmin && onAddProject && (
                <button
                  onClick={onAddProject}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--accent-color)] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Subir Proyecto</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, delay: (idx % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => onProjectClick(project)}
                  className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/60 bg-[var(--bg-card)] transition-all duration-500 shadow-md"
                >
                  {/* Image Container with Hover Zoom */}
                  <div className="relative overflow-hidden bg-neutral-900">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300" />

                    {/* Hover eye icon badge */}
                    <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--border-strong)] flex items-center justify-center text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110">
                      <ArrowUpRight className="w-4 h-4 text-[var(--accent-color)]" />
                    </div>

                    {/* Category tag watermark / subtle kicker */}
                    <div className="absolute top-4 left-4 flex flex-col gap-1 items-start">
                      <div className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent-color)] bg-[var(--bg-primary)]/85 backdrop-blur-md px-2.5 py-1 rounded border border-[var(--accent-color)]/20 font-semibold shadow">
                        {project.category}
                      </div>
                      {project.videoUrl && (
                        <div className="text-[10px] font-mono uppercase text-white bg-red-600/90 backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1 shadow">
                          <Play className="w-2.5 h-2.5 fill-white" />
                          <span>Video</span>
                        </div>
                      )}
                      {(project.category === 'Diapositivas' || project.documentUrl) && !project.videoUrl && (
                        <div className="text-[10px] font-mono uppercase text-white bg-gradient-to-r from-amber-600 to-[#E53935] backdrop-blur-md px-2 py-0.5 rounded flex items-center gap-1 shadow font-semibold">
                          <Presentation className="w-2.5 h-2.5" />
                          <span>
                            {project.documentType === 'canva' 
                              ? 'Canva Slides' 
                              : project.documentType === 'google_slides' 
                              ? 'Google Slides' 
                              : project.documentType === 'pptx' 
                              ? 'PPTX' 
                              : 'Diapositivas'}
                          </span>
                        </div>
                      )}
                      {project.images && project.images.length > 1 && (
                        <div className="text-[10px] font-mono text-white bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1 shadow">
                          <Layers className="w-2.5 h-2.5 text-[var(--accent-color)]" />
                          <span>{project.images.length} fotos</span>
                        </div>
                      )}
                    </div>

                    {/* Admin direct edit & delete buttons */}
                    {isAdmin && (
                      <div className="absolute top-4 right-14 flex items-center gap-1.5 z-20">
                        {onEditProject && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditProject(project);
                            }}
                            className="p-1.5 bg-black/80 hover:bg-[var(--accent-color)] text-white rounded-lg transition-colors cursor-pointer shadow"
                            title="Editar proyecto"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onDeleteProject && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`¿Eliminar definitivamente el proyecto "${project.title}"?`)) {
                                onDeleteProject(project.id);
                              }
                            }}
                            className="p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow"
                            title="Eliminar proyecto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-6 space-y-3">
                    <h3 className="font-bebas text-2xl sm:text-3xl text-[var(--text-primary)] tracking-wide leading-tight group-hover:text-[var(--accent-color)] transition-colors duration-300">
                      {project.title}
                    </h3>

                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="pt-2 flex items-center justify-between border-t border-[var(--border-subtle)] text-xs text-[var(--text-muted)] font-mono">
                      <span>{project.client}</span>
                      <span>{project.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};
