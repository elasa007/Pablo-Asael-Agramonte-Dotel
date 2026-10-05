import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  ExternalLink, 
  FileText, 
  Presentation, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Check, 
  HardDrive, 
  Eye, 
  Sliders
} from 'lucide-react';
import { DocumentItem } from '../types/portfolio';
import { parseDocumentUrl, formatGoogleDrivePreviewUrl, formatCanvaEmbedUrl, getCanvaDirectViewUrl } from '../utils/mediaEmbed';
import { Palette } from 'lucide-react';

interface DocumentViewerModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({ document: doc, onClose }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSlide, setActiveSlide] = useState(1);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState<'embed' | 'slides_preview'>('embed');

  if (!doc) return null;

  const docParsed = parseDocumentUrl(doc.fileUrl || doc.embedUrl, doc.type);
  const isCanva = doc.type === 'canva' || doc.source === 'canva' || docParsed?.type === 'canva' || (doc.fileUrl && doc.fileUrl.includes('canva.com'));
  const isGoogleSlides = doc.type === 'google_slides' || docParsed?.type === 'google_slides';
  const isPPTX = doc.type === 'pptx' || docParsed?.type === 'pptx';
  const isPDF = doc.type === 'pdf' || docParsed?.type === 'pdf';
  const isDrive = doc.type === 'google_drive' || doc.source === 'google_drive' || docParsed?.type === 'drive';

  // Determine optimal iframe embed URL
  let embedUrl = doc.embedUrl || docParsed?.embedUrl || doc.fileUrl;
  if (isCanva) {
    embedUrl = formatCanvaEmbedUrl(doc.fileUrl || doc.embedUrl);
  } else if (doc.fileUrl && doc.fileUrl.includes('drive.google.com')) {
    embedUrl = formatGoogleDrivePreviewUrl(doc.fileUrl);
  } else if (isPPTX && !embedUrl.includes('officeapps') && !embedUrl.includes('docs.google.com/viewer')) {
    // If external URL, wrap with Microsoft Office online viewer or Google docs viewer
    embedUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.fileUrl)}&embedded=true`;
  }

  const canvaDirectUrl = isCanva ? (getCanvaDirectViewUrl(doc.fileUrl || doc.embedUrl) || doc.fileUrl) : doc.fileUrl;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(doc.fileUrl || embedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (doc.fileUrl.startsWith('data:')) {
      const a = document.createElement('a');
      a.href = doc.fileUrl;
      a.download = `${doc.title.replace(/\s+/g, '_')}.${isPDF ? 'pdf' : isPPTX ? 'pptx' : 'pdf'}`;
      a.click();
    } else {
      window.open(doc.fileUrl, '_blank');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className={`relative w-full bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col transition-all duration-300 ${
            isFullscreen 
              ? 'fixed inset-2 z-50 max-w-none max-h-none h-[calc(100vh-1rem)]' 
              : 'max-w-6xl h-[88vh]'
          }`}
        >
          {/* Top Control Bar */}
          <div className="flex flex-wrap items-center justify-between px-6 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-xl bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                {isCanva ? (
                  <Palette className="w-4 h-4 text-[#00C4CC]" />
                ) : isGoogleSlides || isPPTX ? (
                  <Presentation className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </span>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {isCanva ? 'Canva Presentation' : isGoogleSlides ? 'Google Slides' : isPPTX ? 'PowerPoint (PPTX)' : isDrive ? 'Google Drive Deck' : 'Diapositivas PDF'}
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-secondary)]">{doc.category || 'Diapositivas'}</span>
                  {doc.year && (
                    <>
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="text-[var(--text-secondary)]">{doc.year}</span>
                    </>
                  )}
                </div>
                <h3 className="font-bebas text-xl sm:text-2xl text-[var(--text-primary)] tracking-wide line-clamp-1">
                  {doc.title}
                </h3>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Slides simulation toggle if PPTX */}
              {isPPTX && (
                <button
                  type="button"
                  onClick={() => setViewMode(viewMode === 'embed' ? 'slides_preview' : 'embed')}
                  className="px-2.5 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Alternar modo visor"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">
                    {viewMode === 'embed' ? 'Modo Diapositivas' : 'Modo Web Viewer'}
                  </span>
                </button>
              )}

              {/* Open in Canva specifically or Download/Open */}
              {isCanva ? (
                <a
                  href={canvaDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 text-xs font-mono font-semibold text-black bg-[#00C4CC] hover:bg-[#00d8e0] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Abrir diseño directamente en Canva"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Abrir en Canva</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-3 py-1.5 text-xs font-mono text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  title="Descargar o abrir documento"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Descargar / Abrir</span>
                </button>
              )}

              {/* Copy share link with toast badge */}
              <div className="relative">
                {copied && (
                  <span className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono whitespace-nowrap shadow-lg animate-fade-in z-30">
                    ¡Enlace copiado!
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    copied
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                  }`}
                  title="Copiar y compartir enlace público (Canva / Drive / PPT)"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span className="hidden md:inline text-xs font-mono">
                    {copied ? '¡Copiado!' : 'Compartir'}
                  </span>
                </button>
              </div>

              {/* Fullscreen toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer ml-1"
                aria-label="Cerrar visor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Viewer Canvas */}
          <div className="flex-1 bg-neutral-950 relative overflow-hidden flex flex-col items-center justify-center">
            {viewMode === 'slides_preview' ? (
              /* Interactive Presentation Deck Carousel for PPTX */
              <div className="w-full h-full flex flex-col items-center justify-between p-6 sm:p-8 bg-gradient-to-br from-neutral-900 to-neutral-950 text-white">
                <div className="flex items-center justify-between w-full max-w-4xl border-b border-white/10 pb-3">
                  <div className="text-xs font-mono text-neutral-400">
                    DIAPOSITIVA <strong className="text-[var(--accent-color)]">{activeSlide}</strong> DE 16
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/10 text-white">
                    PowerPoint Presentation (.PPTX)
                  </span>
                </div>

                {/* Simulated Presentation Slide Frame */}
                <div className="relative w-full max-w-4xl aspect-[16/9] bg-neutral-900 border border-white/20 rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-8 sm:p-12">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="font-bebas text-2xl text-[var(--accent-color)] tracking-wider">
                      ASAEL AGRAMONTE
                    </span>
                    <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
                      {doc.category} · {doc.year || '2026'}
                    </span>
                  </div>

                  <div className="space-y-4 my-auto">
                    <span className="text-xs font-mono text-[var(--accent-color)] uppercase tracking-wider font-semibold">
                      Diapositiva {activeSlide} — Conceptualización y Estrategia
                    </span>
                    <h2 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-white tracking-wide">
                      {doc.title}
                    </h2>
                    <p className="max-w-2xl text-neutral-300 text-sm sm:text-base leading-relaxed">
                      {doc.description || "Desarrollo estratégico de identidad de marca, dirección de arte e investigación para campañas multimedia y plataformas institucionales."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs font-mono text-neutral-400">
                    <span>Cliente: {doc.client || 'Dirección de Arte'}</span>
                    <span>Diapositiva {activeSlide}/16</span>
                  </div>
                </div>

                {/* Presentation Navigation Controls */}
                <div className="flex items-center gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveSlide(Math.max(1, activeSlide - 1))}
                    disabled={activeSlide <= 1}
                    className="p-3 rounded-full bg-white/10 hover:bg-[var(--accent-color)] disabled:opacity-40 disabled:hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="font-mono text-sm text-neutral-300">
                    {activeSlide} / 16
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveSlide(Math.min(16, activeSlide + 1))}
                    disabled={activeSlide >= 16}
                    className="p-3 rounded-full bg-white/10 hover:bg-[var(--accent-color)] disabled:opacity-40 disabled:hover:bg-white/10 text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Live Embed Iframe (PDF / Google Slides / Google Drive / Office Online) */
              <div className="relative w-full h-full flex flex-col">
                <iframe
                  src={embedUrl}
                  title={doc.title}
                  className="w-full h-full border-0 bg-neutral-900"
                  allow="autoplay; fullscreen; clipboard-read; clipboard-write; web-share"
                  allowFullScreen
                />

                {/* Helpful bottom fallback bar */}
                <div className="px-6 py-2 bg-neutral-900 border-t border-neutral-800 text-[11px] font-mono text-neutral-400 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>
                      Visualizador Activo: {isCanva ? 'Canva Embed Player' : isGoogleSlides ? 'Google Slides Live Player' : isDrive ? 'Google Drive Viewer' : isPPTX ? 'PowerPoint Web' : 'Lector PDF Integrado'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {isCanva && (
                      <span className="text-[10px] text-neutral-400 hidden lg:inline">
                        ¿El navegador bloquea la inserción?
                      </span>
                    )}
                    <a
                      href={isCanva ? canvaDirectUrl : doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`hover:underline flex items-center gap-1 font-semibold ${
                        isCanva ? 'text-[#00C4CC]' : 'text-[var(--accent-color)]'
                      }`}
                    >
                      <span>{isCanva ? 'Abrir en Canva' : 'Abrir en pestaña nueva'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Metadata Footer */}
          <div className="px-6 py-3.5 bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-[var(--text-secondary)] shrink-0">
            <div className="flex flex-wrap items-center gap-4">
              {doc.client && (
                <span>Cliente: <strong className="text-[var(--text-primary)]">{doc.client}</strong></span>
              )}
              {doc.size && (
                <span>Tamaño: <strong className="text-[var(--text-primary)]">{doc.size}</strong></span>
              )}
              {doc.pageCount && (
                <span>Extensión: <strong className="text-[var(--text-primary)]">{doc.pageCount}</strong></span>
              )}
              <span className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] uppercase">
                Fuente: {doc.source === 'google_drive' ? 'Google Drive Cloud' : doc.source === 'upload' ? 'Carga Local' : 'Enlace Web'}
              </span>
            </div>

            <div className="text-[11px] text-[var(--text-muted)]">
              {doc.description ? doc.description.slice(0, 80) + '...' : 'Portafolio Profesional · Lic. Asael Agramonte'}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
