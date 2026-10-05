import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Calendar, 
  User, 
  Tag, 
  ExternalLink, 
  Sparkles, 
  Play, 
  FileText, 
  Presentation, 
  Video as VideoIcon, 
  Image as ImageIcon,
  Download,
  Maximize2
} from 'lucide-react';
import { Project } from '../types/portfolio';
import { parseVideoUrl, parseDocumentUrl } from '../utils/mediaEmbed';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const videoInfo = parseVideoUrl(project.videoUrl);
  const docInfo = parseDocumentUrl(project.documentUrl, project.documentType);

  // Initial active view: prefer video if category is video, or document if document exists and no video, else image
  const defaultTab: 'image' | 'video' | 'document' = 
    project.category === 'Video' && videoInfo 
      ? 'video' 
      : project.documentUrl && docInfo && !videoInfo 
        ? 'document' 
        : 'image';

  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video' | 'document'>(defaultTab);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-6xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-4 sm:my-8 transition-colors duration-300 max-h-[92vh] flex flex-col"
        >
          {/* Top Bar with Media Switcher and Close Button */}
          <div className="flex flex-wrap items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{project.category}</span>
                <span className="text-[var(--text-muted)]">/</span>
                <span className="text-[var(--text-secondary)]">{project.year}</span>
              </div>

              {/* Media Switcher Tabs if project has multiple formats */}
              {(videoInfo || docInfo) && (
                <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border-subtle)] ml-2">
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('image')}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeMediaTab === 'image'
                        ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border border-[var(--border-strong)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Arte</span>
                  </button>

                  {videoInfo && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('video')}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeMediaTab === 'video'
                          ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      <VideoIcon className="w-3.5 h-3.5" />
                      <span>Video ({videoInfo.type === 'youtube' ? 'YouTube' : videoInfo.type === 'vimeo' ? 'Vimeo' : 'Drive'})</span>
                    </button>
                  )}

                  {docInfo && (
                    <button
                      type="button"
                      onClick={() => setActiveMediaTab('document')}
                      className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                        activeMediaTab === 'document'
                          ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                    >
                      {docInfo.type === 'google_slides' || docInfo.type === 'pptx' ? (
                        <Presentation className="w-3.5 h-3.5" />
                      ) : (
                        <FileText className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {docInfo.type === 'google_slides' ? 'Google Slides' : docInfo.type === 'pptx' ? 'PPTX' : 'PDF'}
                      </span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
            
            {/* Visual media preview container (7 cols) */}
            <div className="lg:col-span-7 bg-black flex flex-col items-center justify-center p-4 sm:p-6 border-b lg:border-b-0 lg:border-r border-[var(--border-subtle)] min-h-[380px] lg:min-h-[520px]">
              
              {/* VIEW 1: Video Player (YouTube, Vimeo, Google Drive, Direct) */}
              {activeMediaTab === 'video' && videoInfo ? (
                <div className="w-full h-full flex flex-col justify-center space-y-3">
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-[var(--border-strong)] shadow-2xl">
                    {videoInfo.type === 'direct_video' ? (
                      <video
                        src={videoInfo.embedUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <iframe
                        src={videoInfo.embedUrl}
                        title={project.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono px-1">
                    <span className="flex items-center gap-1.5 text-[var(--accent-color)]">
                      <Play className="w-3.5 h-3.5" />
                      <span>Reproduciendo en {videoInfo.title}</span>
                    </span>
                    <a
                      href={videoInfo.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--text-primary)] flex items-center gap-1 underline transition-colors"
                    >
                      <span>Abrir en plataforma original</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              ) : activeMediaTab === 'document' && docInfo ? (
                /* VIEW 2: Document & Slides Viewer (PDF, Google Slides, PPTX, Google Drive) */
                <div className="w-full h-full flex flex-col justify-center space-y-3">
                  <div className="relative w-full h-[460px] sm:h-[520px] rounded-xl overflow-hidden bg-neutral-900 border border-[var(--border-strong)] shadow-2xl">
                    {docInfo.type === 'pdf' ? (
                      docInfo.embedUrl.startsWith('data:application/pdf') ? (
                        <object
                          data={docInfo.embedUrl}
                          type="application/pdf"
                          className="w-full h-full"
                        >
                          <iframe
                            src={docInfo.embedUrl}
                            title="Visor PDF"
                            className="w-full h-full border-0"
                          />
                        </object>
                      ) : (
                        <iframe
                          src={`https://docs.google.com/viewer?url=${encodeURIComponent(docInfo.embedUrl)}&embedded=true`}
                          title="Visor PDF"
                          className="w-full h-full border-0"
                        />
                      )
                    ) : docInfo.type === 'google_slides' || docInfo.type === 'drive' ? (
                      <iframe
                        src={docInfo.embedUrl}
                        title="Presentación Google Slides"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : docInfo.type === 'pptx' ? (
                      <iframe
                        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docInfo.embedUrl)}`}
                        title="Presentación PPTX"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    ) : (
                      <iframe
                        src={docInfo.embedUrl}
                        title="Visor de Documento"
                        className="w-full h-full border-0"
                      />
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] font-mono px-1">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{project.documentName || docInfo.title}</span>
                    </span>
                    <a
                      href={docInfo.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--text-primary)] flex items-center gap-1 underline transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Descargar / Abrir Archivo</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* VIEW 3: Main Artwork Photo */
                <div className="relative w-full max-w-xl rounded-xl overflow-hidden shadow-2xl border border-[var(--border-subtle)] group">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-cover max-h-[500px]"
                  />

                  {/* If video exists, show interactive banner overlay */}
                  {videoInfo && (
                    <div 
                      onClick={() => setActiveMediaTab('video')}
                      className="absolute inset-0 bg-black/45 hover:bg-black/30 transition-colors flex items-center justify-center cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 px-5 py-3 rounded-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white shadow-2xl transition-transform group-hover:scale-105 cursor-pointer">
                        <Play className="w-5 h-5 fill-white" />
                        <span className="text-xs font-semibold uppercase tracking-wider">
                          Ver Video en {videoInfo.type === 'youtube' ? 'YouTube' : videoInfo.type === 'vimeo' ? 'Vimeo' : 'Reproductor'}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* If document exists without video */}
                  {!videoInfo && docInfo && (
                    <div 
                      onClick={() => setActiveMediaTab('document')}
                      className="absolute bottom-4 left-4 right-4 p-3 bg-black/80 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-between text-white cursor-pointer hover:bg-black/90 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <FileText className="w-4 h-4 text-[var(--accent-color)]" />
                        <span className="font-semibold">{project.documentName || 'Documento disponible (PDF / Slides)'}</span>
                      </div>
                      <span className="text-xs text-[var(--accent-color)] underline">Abrir visor →</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Project Details & Editorial Info (5 cols) */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-6 bg-[var(--modal-bg)]">
              <div className="space-y-6">
                <div>
                  <h3 className="font-bebas text-3xl sm:text-4xl text-[var(--text-primary)] tracking-wide leading-tight">
                    {project.title}
                  </h3>
                  <div className="h-[2px] w-12 bg-[var(--accent-color)] mt-3" />
                </div>

                {/* Metadata credits table */}
                <div className="space-y-3 py-3 border-y border-[var(--border-subtle)] text-xs">
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-[var(--accent-color)]" /> Cliente</span>
                    <span className="text-[var(--text-primary)] font-medium">{project.client || 'Encargo de Estudio'}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[var(--accent-color)]" /> Año</span>
                    <span className="text-[var(--text-primary)] font-medium">{project.year}</span>
                  </div>
                  <div className="flex items-center justify-between text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5 text-[var(--accent-color)]" /> Disciplina</span>
                    <span className="text-[var(--accent-color)] font-semibold">{project.category}</span>
                  </div>
                  {videoInfo && (
                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5"><VideoIcon className="w-3.5 h-3.5 text-[var(--accent-color)]" /> Video Link</span>
                      <button
                        onClick={() => setActiveMediaTab('video')}
                        className="text-[var(--accent-color)] hover:underline font-mono text-[11px] cursor-pointer"
                      >
                        {videoInfo.type.toUpperCase()} Player
                      </button>
                    </div>
                  )}
                  {docInfo && (
                    <div className="flex items-center justify-between text-[var(--text-secondary)]">
                      <span className="flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-emerald-400" /> Documento</span>
                      <button
                        onClick={() => setActiveMediaTab('document')}
                        className="text-emerald-400 hover:underline font-mono text-[11px] cursor-pointer"
                      >
                        {docInfo.type.toUpperCase()}
                      </button>
                    </div>
                  )}
                </div>

                {/* Project Statement / Description */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Manifiesto & Ejecución
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Unboxed tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Entregables & Formatos
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                      {project.tags.map((tag, i) => (
                        <React.Fragment key={i}>
                          <span className="text-[var(--text-primary)]">{tag}</span>
                          {i < project.tags.length - 1 && <span className="text-[var(--text-muted)]">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
                {videoInfo && activeMediaTab !== 'video' && (
                  <button
                    onClick={() => setActiveMediaTab('video')}
                    className="w-full sm:flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Ver Video</span>
                  </button>
                )}

                {docInfo && activeMediaTab !== 'document' && (
                  <button
                    onClick={() => setActiveMediaTab('document')}
                    className="w-full sm:flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-white bg-neutral-800 hover:bg-neutral-700 border border-[var(--border-subtle)] rounded-xl transition-colors cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ver Documento</span>
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="w-full sm:flex-1 py-3 px-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl transition-colors cursor-pointer text-center"
                >
                  Volver a Galería
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
