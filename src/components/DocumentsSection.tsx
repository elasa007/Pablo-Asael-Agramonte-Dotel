import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  Presentation, 
  HardDrive, 
  Sparkles, 
  Download, 
  ExternalLink, 
  Eye, 
  Plus, 
  Edit3, 
  Trash2, 
  FileUp, 
  Layers 
} from 'lucide-react';
import { DocumentItem } from '../types/portfolio';

interface DocumentsSectionProps {
  documents: DocumentItem[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onViewDocument: (doc: DocumentItem) => void;
  onAddDocument?: () => void;
  onEditDocument?: (doc: DocumentItem) => void;
  onDeleteDocument?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  isAdmin = false,
  title = "DOCUMENTOS & PRESENTACIONES",
  subtitle = "Explora y visualiza dossiers editoriales, carpetas de arte en PDF, presentaciones ejecutivas en PowerPoint (PPTX) y decks interactivos en Google Slides.",
  onViewDocument,
  onAddDocument,
  onEditDocument,
  onDeleteDocument,
  onEditSection,
  onDeleteSection
}) => {
  const [filter, setFilter] = useState<'Todos' | 'pdf' | 'pptx' | 'google_slides' | 'google_drive'>('Todos');

  const filteredDocs = filter === 'Todos'
    ? documents
    : documents.filter(d => d.type === filter || (filter === 'google_drive' && d.source === 'google_drive'));

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
              <span>Sección Documentos & Slides · Controles de Administración ({documents.length} archivos)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddDocument && (
                <button
                  type="button"
                  onClick={onAddDocument}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Subir PDF / Importar de Google Drive</span>
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
                    if (confirm('¿Deseas ocultar la sección de Documentos de la vista pública? Podrás restaurarla en el Gestor de Secciones.')) {
                      onDeleteSection();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Ocultar sección Documentos"
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
              <Presentation className="w-3.5 h-3.5" />
              <span>Dossiers, Presentaciones & Slides</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Filter Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 text-xs font-mono"
        >
          {[
            { id: 'Todos', label: 'Todos los Documentos' },
            { id: 'pdf', label: 'Dossiers en PDF' },
            { id: 'pptx', label: 'Presentaciones PPTX' },
            { id: 'google_slides', label: 'Google Slides' },
            { id: 'google_drive', label: 'Google Drive' }
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                filter === tab.id
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-md'
                  : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredDocs.map((doc, index) => {
            const isGoogleSlides = doc.type === 'google_slides';
            const isPPTX = doc.type === 'pptx';
            const isPDF = doc.type === 'pdf';
            const isDrive = doc.source === 'google_drive' || doc.type === 'google_drive';

            return (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-color)] bg-[var(--bg-secondary)] flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl"
              >
                {/* Visual Thumbnail */}
                <div 
                  onClick={() => onViewDocument(doc)}
                  className="relative aspect-[4/3] bg-neutral-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={doc.thumbnailUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'}
                    alt={doc.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  {/* Format Badge Top Left */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono uppercase text-white font-semibold border border-white/10 flex items-center gap-1.5 shadow">
                    {isGoogleSlides ? (
                      <>
                        <Presentation className="w-3 h-3 text-amber-400" />
                        <span>Google Slides</span>
                      </>
                    ) : isPPTX ? (
                      <>
                        <Presentation className="w-3 h-3 text-orange-400" />
                        <span>PowerPoint</span>
                      </>
                    ) : isDrive ? (
                      <>
                        <HardDrive className="w-3 h-3 text-blue-400" />
                        <span>Google Drive</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3 h-3 text-red-400" />
                        <span>PDF</span>
                      </>
                    )}
                  </span>

                  {/* Eye preview overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <div className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-white text-xs font-mono flex items-center gap-1.5 shadow-xl font-semibold transform group-hover:scale-105 transition-transform">
                      <Eye className="w-4 h-4" />
                      <span>Visualizar</span>
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
                          title="Editar documento"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteDocument && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Eliminar documento "${doc.title}"?`)) {
                              onDeleteDocument(doc.id);
                            }
                          }}
                          className="p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow"
                          title="Eliminar documento"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Extension / Pages Badge Bottom Right */}
                  {doc.pageCount && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                      {doc.pageCount}
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--accent-color)] uppercase font-semibold">
                      <span>{doc.category || 'Dossier'}</span>
                      <span className="text-[var(--text-muted)]">{doc.year || '2026'}</span>
                    </div>

                    <h4 
                      onClick={() => onViewDocument(doc)}
                      className="font-bebas text-xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors cursor-pointer line-clamp-2 leading-snug"
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
                      className="text-[var(--text-primary)] hover:text-[var(--accent-color)] font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      <span>Ver Interactivo</span>
                    </button>

                    {doc.fileUrl && (
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                        title="Abrir o descargar"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    )}
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
