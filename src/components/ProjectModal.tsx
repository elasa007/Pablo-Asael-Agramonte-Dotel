import React, { useState, useEffect } from 'react';
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
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Layers,
  Share2,
  Check,
  Info,
  Film,
  Palette
} from 'lucide-react';
import { Project } from '../types/portfolio';
import { parseVideoUrl, parseDocumentUrl, getCanvaDirectViewUrl } from '../utils/mediaEmbed';
import { OptimizedImage } from './OptimizedImage';
import { imageOptimizationService } from '../services/imageOptimizationService';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [activeMediaTab, setActiveMediaTab] = useState<'image' | 'video' | 'document'>('image');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const videoInfo = project?.videoUrl ? parseVideoUrl(project.videoUrl) : null;
  const docInfo = project?.documentUrl ? parseDocumentUrl(project.documentUrl, project.documentType) : null;

  // Carousel images array
  const carouselImages = (project?.images && project.images.length > 0)
    ? project.images
    : (project?.imageUrl ? [project.imageUrl] : []);

  // Reset index & tabs when project changes
  useEffect(() => {
    if (!project) return;
    const vInfo = project.videoUrl ? parseVideoUrl(project.videoUrl) : null;
    const dInfo = project.documentUrl ? parseDocumentUrl(project.documentUrl, project.documentType) : null;
    const defaultTab: 'image' | 'video' | 'document' = 
      project.category === 'Video' && vInfo 
        ? 'video' 
        : project.documentUrl && dInfo && !vInfo 
          ? 'document' 
          : 'image';

    setCurrentImageIndex(0);
    setActiveMediaTab(defaultTab);
    setIsFullscreen(false);
    setShowFullDescription(false);
  }, [project?.id]);

  // Preload adjacent carousel images for instant smooth transitions
  useEffect(() => {
    if (!project || carouselImages.length <= 1) return;
    const nextIdx = (currentImageIndex + 1) % carouselImages.length;
    const prevIdx = (currentImageIndex - 1 + carouselImages.length) % carouselImages.length;
    if (carouselImages[nextIdx]) imageOptimizationService.preload(carouselImages[nextIdx]);
    if (carouselImages[prevIdx]) imageOptimizationService.preload(carouselImages[prevIdx]);
  }, [project, currentImageIndex, carouselImages]);

  // Keyboard navigation
  useEffect(() => {
    if (!project) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showFullDescription) {
          setShowFullDescription(false);
        } else if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        if (!(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
          setIsFullscreen(prev => !prev);
        }
      }

      if (activeMediaTab === 'image' && carouselImages.length > 1) {
        if (e.key === 'ArrowLeft') {
          setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : carouselImages.length - 1));
        } else if (e.key === 'ArrowRight') {
          setCurrentImageIndex(prev => (prev < carouselImages.length - 1 ? prev + 1 : 0));
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, activeMediaTab, carouselImages.length, isFullscreen, showFullDescription, onClose]);

  const handleCopyLink = () => {
    const shareUrl = window.location.origin + window.location.pathname + '#galeria';
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCanva = Boolean(
    docInfo?.type === 'canva' || 
    project?.documentType === 'canva' || 
    (project?.documentUrl && project.documentUrl.includes('canva.com'))
  );

  const canvaDirectUrl = isCanva 
    ? (getCanvaDirectViewUrl(project?.documentUrl || docInfo?.embedUrl || '') || project?.documentUrl || '') 
    : '';

  const isSlideDeck = Boolean(
    project?.category === 'Diapositivas' || 
    docInfo?.type === 'google_slides' || 
    docInfo?.type === 'pptx' || 
    isCanva
  );

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 lg:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            key="project-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Window Container: Fixed height, NO SCROLL */}
          <motion.div
            key="project-modal"
            initial={{ opacity: 0, scale: 0.97, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col transition-all duration-300 ${
              isFullscreen
                ? 'fixed inset-2 z-50 max-w-none max-h-none h-[calc(100vh-1rem)]'
                : 'w-[96vw] max-w-6xl 2xl:max-w-7xl h-[88vh] max-h-[88vh]'
            }`}
          >
          {/* 1. COMPACT TOP BAR HEADER (Shrink-0, Zero Overcrowding) */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] gap-3 shrink-0">
            
            {/* Left: Category Icon, Title & Meta */}
            <div className="flex items-center gap-3 min-w-0">
              <span className="p-1.5 rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30 shrink-0">
                {isSlideDeck ? (
                  <Presentation className="w-4 h-4" />
                ) : videoInfo ? (
                  <Film className="w-4 h-4" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </span>

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold truncate">
                  <span>{project.category}</span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-secondary)]">{project.year}</span>
                  {project.client && (
                    <>
                      <span className="text-[var(--text-muted)] hidden md:inline">·</span>
                      <span className="text-[var(--text-primary)] hidden md:inline truncate">{project.client}</span>
                    </>
                  )}
                </div>
                <h3 className="font-bebas text-lg sm:text-2xl text-[var(--text-primary)] tracking-wide line-clamp-1 leading-tight">
                  {project.title}
                </h3>
              </div>
            </div>

            {/* Center: Media Tabs Switcher */}
            {(videoInfo || docInfo) && (
              <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-0.5 sm:p-1 rounded-xl border border-[var(--border-subtle)] shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveMediaTab('image')}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeMediaTab === 'image'
                      ? 'bg-[var(--bg-elevated)] text-[var(--text-primary)] font-semibold border border-[var(--border-strong)] shadow-sm'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                  title="Ver arte visual"
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
                    title="Ver reproductor de video"
                  >
                    <VideoIcon className="w-3.5 h-3.5" />
                    <span>Video</span>
                  </button>
                )}

                {docInfo && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('document')}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                      activeMediaTab === 'document'
                        ? isCanva ? 'bg-[#00C4CC] text-black font-semibold shadow-sm' : 'bg-amber-600 text-white font-semibold shadow-sm'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                    title="Ver presentación / diapositivas"
                  >
                    {isCanva ? (
                      <Palette className="w-3.5 h-3.5" />
                    ) : (
                      <Presentation className="w-3.5 h-3.5" />
                    )}
                    <span>{isCanva ? 'Canva' : 'Diapositivas'}</span>
                  </button>
                )}
              </div>
            )}

            {/* Right: Actions (Share, Fullscreen, Close) */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Share link button */}
              <div className="relative">
                {copied && (
                  <span className="absolute -top-7 right-0 px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-mono whitespace-nowrap shadow-lg animate-fade-in z-30">
                    ¡Copiado!
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
                  title="Copiar enlace"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Fullscreen Toggle */}
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                title={isFullscreen ? 'Salir de pantalla completa (F)' : 'Pantalla completa (F)'}
                aria-label="Pantalla completa"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. MAIN MEDIA CANVAS (Flex-1, Expansive, Takes Up Majority of Screen, No Scroll) */}
          <div className="flex-1 min-h-0 bg-neutral-950 relative flex items-center justify-center overflow-hidden select-none">
            
            {/* VIEW A: Video Player */}
            {activeMediaTab === 'video' && videoInfo ? (
              <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
                <div className="relative w-full h-full max-w-5xl aspect-video max-h-[calc(100%-1rem)] rounded-xl overflow-hidden bg-black border border-[var(--border-strong)] shadow-2xl flex items-center justify-center">
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
              </div>
            ) : activeMediaTab === 'document' && docInfo ? (
              /* VIEW B: Presentation & Slides */
              <div className="w-full h-full p-2 sm:p-4 flex items-center justify-center">
                <div className="relative w-full h-full max-w-5xl rounded-xl overflow-hidden bg-neutral-900 border border-[var(--border-strong)] shadow-2xl flex flex-col">
                  {docInfo.type === 'pdf' ? (
                    <iframe
                      src={`https://docs.google.com/viewer?url=${encodeURIComponent(docInfo.embedUrl)}&embedded=true`}
                      title="Visor PDF"
                      className="w-full h-full border-0"
                    />
                  ) : docInfo.type === 'google_slides' || docInfo.type === 'drive' ? (
                    <iframe
                      src={docInfo.embedUrl}
                      title="Presentación Google Slides"
                      allow="autoplay; fullscreen; clipboard-read; clipboard-write; web-share"
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
                  ) : isCanva ? (
                    <div className="relative w-full h-full flex flex-col">
                      <iframe
                        src={docInfo.embedUrl}
                        title={project.title}
                        allow="autoplay; fullscreen; clipboard-read; clipboard-write; web-share"
                        allowFullScreen
                        loading="lazy"
                        className="w-full h-full border-0 bg-neutral-950"
                      />
                      {/* Canva direct open fallback button */}
                      <div className="absolute top-3 right-3 z-20">
                        <a
                          href={canvaDirectUrl || docInfo.originalUrl || docInfo.embedUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-mono font-semibold bg-[#00C4CC] hover:bg-[#00d8e0] text-black shadow-xl transition-transform hover:scale-105 flex items-center gap-1.5 cursor-pointer"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>Abrir en Canva</span>
                        </a>
                      </div>
                    </div>
                  ) : (
                    <iframe
                      src={docInfo.embedUrl}
                      title="Visor de Documento"
                      allow="autoplay; fullscreen; clipboard-read; clipboard-write; web-share"
                      allowFullScreen
                      className="w-full h-full border-0"
                    />
                  )}
                </div>
              </div>
            ) : (
              /* VIEW C: Artwork Image Carousel */
              <div className="relative w-full h-full flex items-center justify-center p-2 sm:p-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full h-full flex items-center justify-center select-none"
                  >
                    <OptimizedImage
                      src={carouselImages[currentImageIndex] || project.imageUrl}
                      alt={`${project.title} - Imagen ${currentImageIndex + 1}`}
                      priority
                      quality={90}
                      wrapperClassName="w-full h-full flex items-center justify-center"
                      className="w-full h-full object-contain max-h-full max-w-full select-none"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Carousel Arrows */}
                {carouselImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : carouselImages.length - 1))}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[var(--accent-color)] text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg opacity-75 hover:opacity-100 hover:scale-105 z-20"
                      aria-label="Imagen anterior"
                    >
                      <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setCurrentImageIndex(prev => (prev < carouselImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[var(--accent-color)] text-white backdrop-blur-md border border-white/15 transition-all cursor-pointer shadow-lg opacity-75 hover:opacity-100 hover:scale-105 z-20"
                      aria-label="Siguiente imagen"
                    >
                      <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>

                    {/* Image Counter Badge Top-Right */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-white text-[11px] font-mono font-bold border border-white/15 shadow flex items-center gap-1.5 z-20">
                      <Layers className="w-3 h-3 text-[var(--accent-color)]" />
                      <span>{currentImageIndex + 1} / {carouselImages.length}</span>
                    </div>
                  </>
                )}

                {/* Floating Quick Tab Switcher if video or slides exist */}
                {videoInfo && activeMediaTab !== 'video' && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('video')}
                    className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/80 hover:bg-[var(--accent-color)] backdrop-blur-md rounded-xl border border-white/20 text-white text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shadow-lg z-20"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Ver Video ({videoInfo.title})</span>
                  </button>
                )}

                {!videoInfo && docInfo && activeMediaTab !== 'document' && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaTab('document')}
                    className="absolute bottom-3 left-3 px-3 py-1.5 bg-black/80 hover:bg-amber-600 backdrop-blur-md rounded-xl border border-white/20 text-white text-xs font-mono flex items-center gap-2 cursor-pointer transition-all shadow-lg z-20"
                  >
                    <Presentation className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ver Diapositivas</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3. SIMPLIFIED DATA FOOTER (Compact, Space-Saving, No Scroll) */}
          <div className="shrink-0 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 sm:px-6 py-2.5 sm:py-3 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              
              {/* Left Column: Metadata Pills & Concise Description */}
              <div className="flex-1 min-w-0 space-y-1">
                {/* Meta chips row */}
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-[var(--text-secondary)]">
                  <span className="flex items-center gap-1 text-[var(--text-primary)]">
                    <User className="w-3 h-3 text-[var(--accent-color)]" />
                    <strong>{project.client || 'Encargo de Estudio'}</strong>
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[var(--accent-color)]" />
                    <span>{project.year}</span>
                  </span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="flex items-center gap-1 text-[var(--accent-color)] font-semibold">
                    <Tag className="w-3 h-3" />
                    <span>{project.category}</span>
                  </span>

                  {/* Concise Tags */}
                  {project.tags && project.tags.length > 0 && (
                    <>
                      <span className="text-[var(--text-muted)] hidden md:inline">·</span>
                      <span className="text-[var(--text-muted)] hidden md:inline text-[11px] truncate max-w-xs">
                        {project.tags.slice(0, 3).map(t => `#${t}`).join(' ')}
                      </span>
                    </>
                  )}
                </div>

                {/* Concise Description: 1 or 2 lines maximum with quick info toggle */}
                <div className="flex items-center gap-2">
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-1 leading-normal">
                    {project.description}
                  </p>
                  {project.description && project.description.length > 80 && (
                    <button
                      type="button"
                      onClick={() => setShowFullDescription(prev => !prev)}
                      className="text-[11px] font-mono text-[var(--accent-color)] hover:underline shrink-0 cursor-pointer flex items-center gap-0.5"
                    >
                      <Info className="w-3 h-3" />
                      <span>{showFullDescription ? 'Menos' : 'Más'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Multi-photo mini thumbnails + Quick Action CTA */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                {/* Mini thumbnail strip for multi-image project */}
                {activeMediaTab === 'image' && carouselImages.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto max-w-[140px] sm:max-w-none py-0.5">
                    {carouselImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative w-8 h-6 sm:w-9 sm:h-7 rounded overflow-hidden shrink-0 border transition-all cursor-pointer ${
                          currentImageIndex === idx
                            ? 'border-[var(--accent-color)] ring-1 ring-[var(--accent-color)] scale-105'
                            : 'border-white/10 opacity-50 hover:opacity-100'
                        }`}
                        title={`Foto ${idx + 1}`}
                      >
                        <OptimizedImage 
                          src={img} 
                          alt="" 
                          quality={60}
                          wrapperClassName="w-full h-full"
                          className="w-full h-full object-cover" 
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Direct Action Links */}
                {docInfo && (
                  <a
                    href={isCanva ? (canvaDirectUrl || docInfo.originalUrl) : docInfo.originalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center gap-1.5 ${
                      isCanva 
                        ? 'bg-[#00C4CC] hover:bg-[#00d8e0] text-black font-semibold shadow-sm'
                        : 'text-[var(--text-primary)] hover:text-white bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] border border-[var(--border-subtle)]'
                    }`}
                    title={isCanva ? 'Abrir presentación interactiva en Canva' : 'Descargar o abrir enlace original'}
                  >
                    {isCanva ? (
                      <>
                        <Palette className="w-3.5 h-3.5 text-black" />
                        <span>Abrir en Canva</span>
                        <ExternalLink className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Descargar</span>
                      </>
                    )}
                  </a>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

            </div>
          </div>

          {/* Optional Expanded Description Popover Modal (if user wants to read long manifesto) */}
          <AnimatePresence>
            {showFullDescription && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-x-4 bottom-16 sm:bottom-18 max-w-xl mx-auto p-4 sm:p-5 rounded-2xl bg-[var(--modal-bg)] border border-[var(--border-strong)] shadow-2xl z-30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--accent-color)] font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    <span>Manifiesto & Memoria Completa</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setShowFullDescription(false)}
                    className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed max-h-48 overflow-y-auto">
                  {project.description}
                </p>

                {project.tags && project.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
                    {project.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[10px] font-mono text-[var(--text-primary)] border border-[var(--border-subtle)]">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
