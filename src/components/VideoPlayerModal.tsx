import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Play, 
  ExternalLink, 
  Calendar, 
  User, 
  Sparkles, 
  Clock, 
  Share2, 
  Check, 
  Film
} from 'lucide-react';
import { VideoItem } from '../types/portfolio';
import { parseVideoUrl } from '../utils/mediaEmbed';

interface VideoPlayerModalProps {
  video: VideoItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ video, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const parsed = video ? parseVideoUrl(video.url) : null;
  const embedSrc = video ? (video.embedUrl || parsed?.embedUrl || video.url) : '';
  const platform = video ? (video.platform || parsed?.type || 'direct') : 'direct';

  const handleCopyLink = () => {
    if (!video) return;
    navigator.clipboard.writeText(video.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      {video && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="video-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Window Cinema Box */}
          <motion.div
            key="video-cinema-box"
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-5xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-4 sm:my-8 flex flex-col"
          >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] gap-3 shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-1.5 rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)] border border-[var(--accent-color)]/30">
                <Film className="w-4 h-4" />
              </span>
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  <span>{video.category}</span>
                  <span className="text-[var(--text-muted)]">·</span>
                  <span className="text-[var(--text-secondary)]">{video.year || '2026'}</span>
                </span>
                <h3 className="font-bebas text-xl sm:text-2xl text-[var(--text-primary)] tracking-wide line-clamp-1">
                  {video.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                title="Copiar enlace"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500 hidden sm:inline font-mono">Copiado</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline font-mono">Compartir</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                aria-label="Cerrar reproductor"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Cinema Screen (Video Player) */}
          <div className="relative w-full aspect-video bg-black overflow-hidden flex items-center justify-center">
            {platform === 'direct' ? (
              <video
                src={embedSrc}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={video.thumbnailUrl}
              >
                Tu navegador no soporta el tag de video.
              </video>
            ) : (
              <iframe
                src={embedSrc}
                title={video.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            )}
          </div>

          {/* Video Metadata & Details Footer */}
          <div className="p-6 bg-[var(--bg-primary)] border-t border-[var(--border-subtle)] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-[var(--text-secondary)]">
                {video.client && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>Cliente: <strong className="text-[var(--text-primary)]">{video.client}</strong></span>
                  </span>
                )}
                {video.duration && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>Duración: {video.duration}</span>
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] uppercase tracking-wider">
                  Plataforma: {platform === 'youtube' ? 'YouTube' : platform === 'vimeo' ? 'Vimeo' : platform === 'drive' ? 'Google Drive' : 'MP4 Directo'}
                </span>
              </div>

              {video.url && (
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-[var(--text-primary)] hover:text-white bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] border border-[var(--border-subtle)] rounded-lg transition-colors"
                >
                  <span>Abrir en {platform === 'youtube' ? 'YouTube' : platform === 'vimeo' ? 'Vimeo' : 'Fuente Original'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {video.description && (
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed pt-2 border-t border-[var(--border-subtle)]">
                {video.description}
              </p>
            )}
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
