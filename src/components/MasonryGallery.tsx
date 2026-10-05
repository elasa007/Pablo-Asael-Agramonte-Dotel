import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, SpecialtyCategory } from '../types/portfolio';
import { OptimizedImage } from './OptimizedImage';
import { imageOptimizationService } from '../services/imageOptimizationService';
import { 
  Eye, 
  ArrowUpRight, 
  Sparkles, 
  Filter, 
  Edit3, 
  Trash2, 
  Plus, 
  Play, 
  FileText, 
  Presentation, 
  Video as VideoIcon, 
  Layers,
  LayoutGrid,
  Columns2,
  Calendar,
  User,
  ExternalLink,
  Check
} from 'lucide-react';

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
  // View mode state: 'large' (default widescreen 2-col showcase) or 'compact' (3-col grid)
  const [viewMode, setViewMode] = useState<'large' | 'compact'>('large');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  // Spotlight featured project when in 'Todos' and 'large' mode
  const featuredProject = (selectedCategory === 'Todos' && viewMode === 'large')
    ? filteredProjects.find(p => p.featured) || filteredProjects[0]
    : null;

  const remainingProjects = featuredProject
    ? filteredProjects.filter(p => p.id !== featuredProject.id)
    : filteredProjects;

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
              <span>Archivo de Trabajos & Casos de Estudio</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Interactive Segmented Filter Bar + View Mode Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 mb-10"
        >
          {/* Categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <div className="flex items-center gap-1.5 p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-subtle)] shrink-0">
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
            <span className="text-xs text-[var(--text-muted)] font-mono pl-2 hidden lg:inline whitespace-nowrap">
              {filteredProjects.length} {filteredProjects.length === 1 ? 'proyecto' : 'proyectos'}
            </span>
          </div>

          {/* View Size Switcher (Grande / Cuadrícula) */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <span className="text-xs font-mono text-[var(--text-muted)] uppercase hidden sm:inline">
              Formato:
            </span>
            <div className="flex items-center gap-1 bg-[var(--bg-secondary)] p-1 rounded-xl border border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => setViewMode('large')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'large'
                    ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
                title="Vista Grande / Formato Widescreen (2 columnas amplias)"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Vista Grande</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer ${
                  viewMode === 'compact'
                    ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                }`}
                title="Vista Cuadrícula (3 columnas)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cuadrícula</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Diapositivas Integration Banner when filter is active */}
        {selectedCategory === 'Diapositivas' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-5 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-[var(--accent-color)]/10 text-[var(--accent-color)] border border-[var(--accent-color)]/20 shrink-0">
                <Presentation className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-semibold text-[var(--text-primary)]">
                  Presentaciones & Decks Corporativos en la Galería
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
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

        {/* Empty State */}
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
          <div className="space-y-10">
            {/* FEATURED CINEMA SPOTLIGHT CARD (when viewing large mode in 'Todos') */}
            {featuredProject && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl overflow-hidden border border-[var(--border-strong)] bg-neutral-950 shadow-2xl transition-all duration-300"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                  {/* Huge Widescreen Showcase Image (7 cols) */}
                  <div 
                    onClick={() => onProjectClick(featuredProject)}
                    className="lg:col-span-7 relative aspect-[16/10] sm:aspect-video bg-black overflow-hidden cursor-pointer"
                  >
                    <OptimizedImage
                      src={featuredProject.imageUrl}
                      alt={featuredProject.title}
                      priority
                      quality={85}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

                    {/* Floating Badges */}
                    <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 z-10">
                      <span className="px-3 py-1 rounded-full bg-black/85 backdrop-blur-md border border-white/20 text-white text-xs font-mono uppercase tracking-wider font-semibold">
                        {featuredProject.category}
                      </span>
                      <span className="px-2.5 py-1 rounded-full bg-[var(--accent-color)] text-white text-xs font-mono uppercase font-bold tracking-wider">
                        ★ Obra Destacada
                      </span>
                      {featuredProject.documentUrl && (
                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-600 to-[#E53935] text-white text-xs font-mono uppercase font-bold flex items-center gap-1 shadow">
                          <Presentation className="w-3 h-3" />
                          <span>{featuredProject.documentType === 'canva' ? 'Canva Slides' : 'Diapositivas'}</span>
                        </span>
                      )}
                      {featuredProject.videoUrl && (
                        <span className="px-2.5 py-1 rounded-full bg-red-600 text-white text-xs font-mono uppercase font-bold flex items-center gap-1 shadow">
                          <Play className="w-3 h-3 fill-current" />
                          <span>Video</span>
                        </span>
                      )}
                    </div>

                    {/* Hover eye icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <div className="px-5 py-2.5 rounded-xl bg-[var(--accent-color)] text-white text-xs font-mono uppercase tracking-wider font-semibold flex items-center gap-2 shadow-2xl transform group-hover:scale-105 transition-transform">
                        <Eye className="w-4 h-4" />
                        <span>Abrir Caso de Estudio</span>
                      </div>
                    </div>
                  </div>

                  {/* Spotlight Project Details (5 cols) */}
                  <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between h-full space-y-6 bg-[var(--bg-secondary)]">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-mono uppercase text-[var(--accent-color)] font-semibold tracking-wider">
                        <span>{featuredProject.category} · {featuredProject.client}</span>
                        <span className="text-[var(--text-muted)]">{featuredProject.year}</span>
                      </div>

                      <h3 
                        onClick={() => onProjectClick(featuredProject)}
                        className="font-bebas text-4xl sm:text-5xl text-[var(--text-primary)] tracking-wide leading-tight group-hover:text-[var(--accent-color)] transition-colors cursor-pointer"
                      >
                        {featuredProject.title}
                      </h3>

                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                        {featuredProject.description}
                      </p>

                      {featuredProject.tags && featuredProject.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {featuredProject.tags.map((tag) => (
                            <span 
                              key={tag}
                              className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-[11px] font-mono text-[var(--text-muted)]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => onProjectClick(featuredProject)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono uppercase tracking-wider rounded-xl font-semibold shadow-lg shadow-[var(--accent-color)]/25 transition-all cursor-pointer"
                      >
                        {featuredProject.documentUrl ? (
                          <>
                            <Presentation className="w-4 h-4" />
                            <span>Ver Diapositivas</span>
                          </>
                        ) : featuredProject.videoUrl ? (
                          <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Ver Video</span>
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4" />
                            <span>Examinar Proyecto</span>
                          </>
                        )}
                        <ArrowUpRight className="w-4 h-4" />
                      </button>

                      {featuredProject.images && featuredProject.images.length > 1 && (
                        <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                          <span>{featuredProject.images.length} piezas</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SPACIOUS GRID: 2 Columns Large Showcase (or 3 Columns Compact) */}
            <div className={
              viewMode === 'large'
                ? "grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10"
                : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
            }>
              <AnimatePresence mode="popLayout">
                {remainingProjects.map((project, idx) => {
                  const isSlides = project.category === 'Diapositivas' || Boolean(project.documentUrl);
                  const isVideo = Boolean(project.videoUrl);

                  return (
                    <motion.div
                      key={project.id}
                      layout="position"
                      initial={{ opacity: 0, scale: 0.97, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      onMouseEnter={() => {
                        imageOptimizationService.preload(project.imageUrl);
                        if (project.images && project.images.length > 0) {
                          imageOptimizationService.preloadBatch(project.images.slice(0, 3));
                        }
                      }}
                      className="group relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-color)] bg-[var(--bg-secondary)] flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-2xl gpu-layer"
                    >
                      {/* Generous Widescreen Artwork Container */}
                      <div 
                        onClick={() => onProjectClick(project)}
                        className={`relative w-full bg-neutral-950 overflow-hidden cursor-pointer ${
                          viewMode === 'large' ? 'aspect-[16/10] sm:aspect-video' : 'aspect-[4/3] sm:aspect-video'
                        }`}
                      >
                        <OptimizedImage
                          src={project.imageUrl}
                          alt={project.title}
                          quality={80}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />

                        {/* Dark gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)]/90 via-black/25 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-300 pointer-events-none" />

                        {/* Top Left Floating Badges */}
                        <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-1.5 z-10">
                          <span className="text-[11px] font-mono uppercase tracking-widest text-[var(--accent-color)] bg-black/85 backdrop-blur-md px-3 py-1 rounded-lg border border-[var(--accent-color)]/30 font-semibold shadow">
                            {project.category}
                          </span>

                          {isSlides && !isVideo && (
                            <span className="text-[10px] font-mono uppercase text-white bg-gradient-to-r from-amber-600 to-[#E53935] backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow font-semibold">
                              <Presentation className="w-3 h-3 text-white" />
                              <span>
                                {project.documentType === 'canva' 
                                  ? 'Canva Slides' 
                                  : project.documentType === 'google_slides' 
                                  ? 'Google Slides' 
                                  : project.documentType === 'pptx' 
                                  ? 'PowerPoint' 
                                  : 'Diapositivas'}
                              </span>
                            </span>
                          )}

                          {isVideo && (
                            <span className="text-[10px] font-mono uppercase text-white bg-red-600/90 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow font-semibold">
                              <Play className="w-2.5 h-2.5 fill-white" />
                              <span>Video / Reel</span>
                            </span>
                          )}

                          {project.images && project.images.length > 1 && (
                            <span className="text-[10px] font-mono text-white bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5 shadow">
                              <Layers className="w-2.5 h-2.5 text-[var(--accent-color)]" />
                              <span>{project.images.length} fotos</span>
                            </span>
                          )}
                        </div>

                        {/* Hover Zoom Eye Icon (Top Right) */}
                        <div className="absolute top-3.5 right-3.5 w-10 h-10 rounded-xl bg-black/75 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:scale-105 shadow-xl z-10">
                          <ArrowUpRight className="w-4 h-4 text-[var(--accent-color)]" />
                        </div>

                        {/* Admin direct edit & delete buttons */}
                        {isAdmin && (
                          <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 z-20">
                            {onEditProject && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onEditProject(project);
                                }}
                                className="p-2 bg-black/85 hover:bg-[var(--accent-color)] text-white rounded-xl transition-colors cursor-pointer shadow-lg border border-white/10"
                                title="Editar proyecto"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDeleteProject && (
                              deleteConfirmId === project.id ? (
                                <div 
                                  onClick={(e) => e.stopPropagation()} 
                                  className="flex items-center gap-1 bg-red-950/95 border border-red-500/60 p-1 rounded-xl shadow-lg"
                                >
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onDeleteProject(project.id);
                                      setDeleteConfirmId(null);
                                    }}
                                    className="px-2 py-1 bg-red-600 text-white text-[10px] font-mono font-bold rounded-lg cursor-pointer"
                                  >
                                    Borrar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDeleteConfirmId(null);
                                    }}
                                    className="px-1 text-neutral-300 text-[10px] font-mono cursor-pointer"
                                  >
                                    X
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeleteConfirmId(project.id);
                                  }}
                                  className="p-2 bg-black/85 hover:bg-red-600 text-white rounded-xl transition-colors cursor-pointer shadow-lg border border-white/10"
                                  title="Eliminar proyecto"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )
                            )}
                          </div>
                        )}
                      </div>

                      {/* Card Content & Metadata (Generous, like Videos & Documents) */}
                      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-mono text-[var(--accent-color)] uppercase font-semibold">
                            <span>{project.client || 'Estudio Creativo'}</span>
                            <span className="text-[var(--text-muted)]">{project.year || '2026'}</span>
                          </div>

                          <h3 
                            onClick={() => onProjectClick(project)}
                            className="font-bebas text-3xl sm:text-4xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors duration-200 line-clamp-2 leading-tight cursor-pointer"
                          >
                            {project.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-2 sm:line-clamp-3 leading-relaxed">
                            {project.description}
                          </p>

                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5 pt-2">
                              {project.tags.slice(0, 4).map((tag) => (
                                <span 
                                  key={tag}
                                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[11px] font-mono text-[var(--text-muted)]"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Bottom Action Bar (matching Documents and Videos) */}
                        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                          <button
                            type="button"
                            onClick={() => onProjectClick(project)}
                            className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold flex items-center gap-1.5 cursor-pointer py-1 uppercase tracking-wider text-xs"
                          >
                            {isSlides ? (
                              <>
                                <Presentation className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                                <span>Ver Diapositivas</span>
                              </>
                            ) : isVideo ? (
                              <>
                                <Play className="w-3.5 h-3.5 text-[var(--accent-color)] fill-current" />
                                <span>Ver Video</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                                <span>Examinar Proyecto</span>
                              </>
                            )}
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </button>

                          <span className="text-[var(--text-muted)] text-[11px] hidden sm:inline">
                            {project.category}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MasonryGallery;
