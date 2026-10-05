import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Presentation, 
  HardDrive, 
  Eye, 
  Sparkles, 
  Edit3, 
  Trash2, 
  Plus, 
  FileUp, 
  Share2, 
  Check, 
  Palette, 
  ExternalLink,
  Layers,
  ArrowUpRight,
  X,
  Save,
  CheckCircle2
} from 'lucide-react';
import { DocumentItem } from '../types/portfolio';

interface DocumentsSectionProps {
  documents: DocumentItem[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  kicker?: string;
  onViewDocument: (doc: DocumentItem) => void;
  onAddDocument?: () => void;
  onEditDocument?: (doc: DocumentItem) => void;
  onDeleteDocument?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
  onSaveTitles?: (title: string, subtitle: string, kicker?: string) => void;
  onViewInGallery?: () => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  isAdmin = false,
  title = "DIAPOSITIVAS CORPORATIVAS",
  subtitle = "Presentaciones estratégicas, pitch decks corporativos, slides comerciales y reportes ejecutivos en formatos interactivos (Canva, Google Slides, PowerPoint y PDF).",
  kicker = "DIAPOSITIVAS & DECKS CORPORATIVOS",
  onViewDocument,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onEditSection,
  onDeleteSection,
  onSaveTitles,
  onViewInGallery
}) => {
  const [filter, setFilter] = useState<'Todos' | 'canva' | 'google_slides' | 'pptx' | 'pdf'>('Todos');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Inline Title Editing state
  const [isEditingTitles, setIsEditingTitles] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editSubtitle, setEditSubtitle] = useState(subtitle);
  const [editKicker, setEditKicker] = useState(kicker);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setEditTitle(title);
    setEditSubtitle(subtitle);
    setEditKicker(kicker);
  }, [title, subtitle, kicker]);

  const handleSaveTitles = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (onSaveTitles) {
      onSaveTitles(editTitle.trim() || "DIAPOSITIVAS CORPORATIVAS", editSubtitle.trim(), editKicker.trim());
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
    setIsEditingTitles(false);
  };

  const handleShareLink = (doc: DocumentItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = doc.fileUrl || doc.embedUrl;
    navigator.clipboard.writeText(shareUrl);
    setCopiedId(doc.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredDocs = filter === 'Todos'
    ? documents
    : documents.filter(d => {
        if (filter === 'canva') {
          return d.type === 'canva' || d.source === 'canva' || d.fileUrl?.includes('canva.com');
        }
        if (filter === 'google_slides') {
          return d.type === 'google_slides' || d.fileUrl?.includes('docs.google.com/presentation');
        }
        if (filter === 'pptx') {
          return d.type === 'pptx' || d.size?.toLowerCase().includes('pptx') || d.size?.toLowerCase().includes('powerpoint');
        }
        if (filter === 'pdf') {
          return d.type === 'pdf';
        }
        return d.type === filter;
      });

  return (
    <section id="documentos" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] relative transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[var(--accent-color)]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Admin Bar — STRICTLY ADMIN ONLY */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gestión de Diapositivas Corporativas & Decks ({documents.length} presentaciones)</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsEditingTitles(!isEditingTitles)}
                className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm border ${
                  isEditingTitles 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-[var(--text-primary)] border-[var(--border-subtle)]'
                }`}
                title="Editar títulos directamente en la sección"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditingTitles ? 'Cerrar Edición de Título' : 'Editar Título'}</span>
              </button>
              {onAddDocument && (
                <button
                  type="button"
                  onClick={onAddDocument}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Añadir Diapositivas / Canva</span>
                </button>
              )}
              {onDeleteSection && (
                <button
                  type="button"
                  onClick={onDeleteSection}
                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Ocultar sección de la vista pública"
                >
                  <span>Ocultar Sección</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section Header with Direct In-Place Title Editing */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 pb-6 border-b border-[var(--border-subtle)]"
        >
          {isEditingTitles ? (
            /* Inline Title Editing Form */
            <form onSubmit={handleSaveTitles} className="p-6 bg-[var(--bg-secondary)] border border-[var(--accent-color)]/50 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                <span className="text-xs font-mono uppercase text-[var(--accent-color)] font-semibold flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Títulos de la Sección de Diapositivas</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingTitles(false)}
                  className="p-1 text-gray-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Kicker / Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={editKicker}
                    onChange={(e) => setEditKicker(e.target.value)}
                    placeholder="ej. DIAPOSITIVAS & DECKS CORPORATIVOS"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs font-mono text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="ej. DIAPOSITIVAS CORPORATIVAS"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm font-bebas text-xl text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                  Subtítulo / Descripción
                </label>
                <textarea
                  rows={2}
                  value={editSubtitle}
                  onChange={(e) => setEditSubtitle(e.target.value)}
                  placeholder="Descripción concisa de presentaciones corporativas, decks en Canva, Google Slides y PPTX..."
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-color)] focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingTitles(false)}
                  className="px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-xl font-semibold flex items-center gap-1.5 shadow-md cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Guardar Títulos</span>
                </button>
              </div>
            </form>
          ) : (
            /* Clean Display Header */
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="group relative">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
                  <Presentation className="w-3.5 h-3.5" />
                  <span>{kicker || "DIAPOSITIVAS & DECKS CORPORATIVOS"}</span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => setIsEditingTitles(true)}
                      className="ml-2 p-1 text-[var(--text-muted)] hover:text-[var(--accent-color)] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded"
                      title="Editar título y subtítulo"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <h2 
                  onClick={() => isAdmin && setIsEditingTitles(true)}
                  className={`font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none ${
                    isAdmin ? 'cursor-pointer hover:text-[var(--accent-color)] transition-colors' : ''
                  }`}
                  title={isAdmin ? "Haz clic para editar el título" : undefined}
                >
                  {title}
                </h2>
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 mt-2">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>¡Títulos guardados correctamente!</span>
                  </span>
                )}
              </div>

              <div className="flex flex-col items-start md:items-end gap-3 max-w-md">
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed md:text-right">
                  {subtitle}
                </p>
                {/* Integration link with dynamic gallery */}
                <button
                  type="button"
                  onClick={() => {
                    if (onViewInGallery) {
                      onViewInGallery();
                    } else {
                      const el = document.getElementById('galeria');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-[var(--text-primary)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Ver también en Galería Dinámica</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* Simplified Corporate Slide Filter Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-mono"
        >
          {[
            { id: 'Todos', label: 'Todas las Diapositivas' },
            { id: 'canva', label: 'Canva Slides' },
            { id: 'google_slides', label: 'Google Slides' },
            { id: 'pptx', label: 'PowerPoint (PPTX)' },
            { id: 'pdf', label: 'PDF Slides' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                filter === tab.id
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-md'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'
              }`}
            >
              {tab.id === 'canva' && <Palette className="w-3.5 h-3.5 text-teal-300" />}
              {tab.id === 'google_slides' && <Presentation className="w-3.5 h-3.5 text-amber-300" />}
              {tab.id === 'pptx' && <Presentation className="w-3.5 h-3.5 text-orange-300" />}
              <span>{tab.label}</span>
            </button>
          ))}
        </motion.div>

        {/* Corporate Slides 16:9 Presentation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc, index) => {
            const isCanva = doc.type === 'canva' || doc.source === 'canva' || doc.fileUrl?.includes('canva.com');
            const isGoogleSlides = doc.type === 'google_slides' || doc.fileUrl?.includes('docs.google.com/presentation');
            const isPPTX = doc.type === 'pptx' || doc.size?.toLowerCase().includes('pptx') || doc.size?.toLowerCase().includes('powerpoint');
            const isPDF = doc.type === 'pdf';

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-color)] bg-[var(--bg-secondary)] flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl"
              >
                {/* 16:9 Widescreen Presentation Thumbnail */}
                <div 
                  onClick={() => onViewDocument(doc)}
                  className="relative aspect-video bg-neutral-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={doc.thumbnailUrl || (isCanva 
                      ? 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80'
                      : isGoogleSlides
                      ? 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'
                      : 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80'
                    )}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Format Badge Top Left */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/85 backdrop-blur-md text-[10px] font-mono uppercase text-white font-semibold border border-white/10 flex items-center gap-1.5 shadow">
                    {isCanva ? (
                      <>
                        <Palette className="w-3 h-3 text-[#00C4CC]" />
                        <span>Canva Slides</span>
                      </>
                    ) : isGoogleSlides ? (
                      <>
                        <Presentation className="w-3 h-3 text-amber-400" />
                        <span>Google Slides</span>
                      </>
                    ) : isPPTX ? (
                      <>
                        <Presentation className="w-3 h-3 text-orange-400" />
                        <span>PowerPoint PPTX</span>
                      </>
                    ) : (
                      <>
                        <Presentation className="w-3 h-3 text-red-400" />
                        <span>PDF Slides</span>
                      </>
                    )}
                  </span>

                  {/* Eye preview overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-white text-xs font-mono flex items-center gap-1.5 shadow-xl font-semibold transform group-hover:scale-105 transition-transform">
                      <Eye className="w-4 h-4" />
                      <span>{isCanva ? 'Ver Canva Deck' : 'Visualizar Diapositivas'}</span>
                    </div>
                  </div>

                  {/* Admin controls — STRICTLY ADMIN ONLY */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                      {onEditDocument && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditDocument(doc);
                          }}
                          className="p-1.5 bg-black/80 hover:bg-[var(--accent-color)] text-white rounded-lg transition-colors cursor-pointer shadow"
                          title="Editar diapositivas"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteDocument && (
                        deleteConfirmId === doc.id ? (
                          <div 
                            onClick={(e) => e.stopPropagation()} 
                            className="flex items-center gap-1 bg-red-950/90 border border-red-500/60 p-1 rounded-lg shadow-lg"
                          >
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteDocument(doc.id);
                                setDeleteConfirmId(null);
                              }}
                              className="px-1.5 py-0.5 bg-red-600 text-white text-[10px] font-mono font-bold rounded cursor-pointer"
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
                              setDeleteConfirmId(doc.id);
                            }}
                            className="p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow"
                            title="Eliminar presentación"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  )}

                  {/* Slide Counter Badge Bottom Right */}
                  {doc.pageCount && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/85 text-white text-[10px] font-mono flex items-center gap-1 border border-white/10">
                      <Presentation className="w-3 h-3 text-[var(--accent-color)]" />
                      <span>{doc.pageCount}</span>
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--accent-color)] uppercase font-semibold">
                      <span>{doc.category || 'Diapositivas Corporativas'}</span>
                      <span className="text-[var(--text-muted)]">{doc.year || '2026'}</span>
                    </div>

                    <h4 
                      onClick={() => onViewDocument(doc)}
                      className="font-bebas text-xl sm:text-2xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors cursor-pointer line-clamp-2 leading-snug"
                    >
                      {doc.title}
                    </h4>

                    {doc.description && (
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                    <button
                      type="button"
                      onClick={() => onViewDocument(doc)}
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      {isCanva ? (
                        <>
                          <Palette className="w-3.5 h-3.5 text-[#00C4CC]" />
                          <span>Abrir Canva</span>
                        </>
                      ) : (
                        <>
                          <Presentation className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                          <span>Ver Diapositivas</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1.5 relative">
                      {/* Copied notification toast */}
                      {copiedId === doc.id && (
                        <span className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono whitespace-nowrap shadow-lg animate-fade-in z-30">
                          ¡Enlace copiado!
                        </span>
                      )}

                      {/* Share public link button */}
                      <button
                        type="button"
                        onClick={(e) => handleShareLink(doc, e)}
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
                          copiedId === doc.id
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                        }`}
                        title="Copiar y compartir enlace público (Canva, Drive, PPTX, PDF)"
                      >
                        {copiedId === doc.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                        <span className="sr-only">Compartir</span>
                      </button>

                      {/* Open public link in new tab */}
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                            isCanva
                              ? 'text-[#00C4CC] hover:bg-[#00C4CC]/10'
                              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                          }`}
                          title={isCanva ? "Abrir enlace público de Canva" : "Abrir enlace de presentación"}
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span className="sr-only">Abrir</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default DocumentsSection;
