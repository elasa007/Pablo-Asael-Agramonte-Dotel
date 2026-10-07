import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Film, 
  Check, 
  Sparkles, 
  Play, 
  AlertCircle, 
  ExternalLink, 
  Plus, 
  Trash2, 
  Link as LinkIcon 
} from 'lucide-react';
import { VideoItem } from '../types/portfolio';
import { parseVideoUrl } from '../utils/mediaEmbed';

interface AddVideoModalProps {
  isOpen: boolean;
  videoToEdit?: VideoItem | null;
  onClose: () => void;
  onSave: (video: Omit<VideoItem, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

export const AddVideoModal: React.FC<AddVideoModalProps> = ({
  isOpen,
  videoToEdit,
  onClose,
  onSave,
  onDelete
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Showreel');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('2026');
  const [duration, setDuration] = useState('02:00');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state when editing
  useEffect(() => {
    if (videoToEdit) {
      setUrl(videoToEdit.url);
      setTitle(videoToEdit.title);
      setCategory(videoToEdit.category);
      setClient(videoToEdit.client || '');
      setYear(videoToEdit.year || '2026');
      setDuration(videoToEdit.duration || '');
      setDescription(videoToEdit.description || '');
      setThumbnailUrl(videoToEdit.thumbnailUrl || '');
      setFeatured(Boolean(videoToEdit.featured));
    } else {
      setUrl('');
      setTitle('');
      setCategory('Showreel');
      setClient('');
      setYear('2026');
      setDuration('02:00');
      setDescription('');
      setThumbnailUrl('');
      setFeatured(false);
    }
    setError(null);
  }, [videoToEdit, isOpen]);

  const parsed = parseVideoUrl(url);

  // Auto-fill thumbnail if YouTube and no custom thumbnail
  const effectiveThumbnail = thumbnailUrl || (parsed?.type === 'youtube' && parsed.thumbnailUrl ? parsed.thumbnailUrl : 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor escribe un título para el video.');
      return;
    }
    if (!url.trim()) {
      setError('Por favor ingresa el enlace de YouTube, Vimeo o Google Drive.');
      return;
    }

    const platform: 'youtube' | 'vimeo' | 'drive' | 'direct' = 
      parsed?.type === 'youtube' ? 'youtube'
      : parsed?.type === 'vimeo' ? 'vimeo'
      : parsed?.type === 'drive' ? 'drive'
      : 'direct';

    const embedUrl = parsed?.embedUrl || url;

    onSave({
      title: title.trim(),
      category,
      platform,
      url: url.trim(),
      embedUrl,
      thumbnailUrl: effectiveThumbnail,
      duration: duration.trim(),
      client: client.trim(),
      year: year.trim(),
      description: description.trim(),
      featured
    }, videoToEdit ? videoToEdit.id : undefined);

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            key="video-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[92vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                <Film className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  {videoToEdit ? 'Editar Video / Showreel' : 'Añadir Video de YouTube / Vimeo / Drive'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Soporta enlaces directos de YouTube, Vimeo, Google Drive Video y MP4
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Video URL Input with Auto-detection */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center justify-between">
                <span>Enlace del Video (YouTube, Vimeo, Google Drive, MP4) *</span>
                {parsed && (
                  <span className="text-[var(--accent-color)] normal-case font-mono">
                    ✓ Detectado: {parsed.type.toUpperCase()}
                  </span>
                )}
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/... o Drive"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                Ejemplos: YouTube (watch, shorts, youtu.be), Vimeo (vimeo.com/12345), Google Drive (drive.google.com/file/d/...)
              </p>
            </div>

            {/* Live Preview if valid URL */}
            {parsed && (
              <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl flex items-center gap-3">
                <div className="relative w-20 aspect-video rounded-lg overflow-hidden bg-black shrink-0">
                  <img src={effectiveThumbnail} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] font-semibold">
                    {parsed.type}
                  </span>
                  <p className="text-xs font-medium text-[var(--text-primary)] truncate mt-1">
                    {title || parsed.title}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono truncate">
                    {parsed.embedUrl}
                  </p>
                </div>
              </div>
            )}

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Título del Video *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Showreel Dirección Creativa 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Categoría Audiovisual
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Showreel">Showreel</option>
                  <option value="Spot Publicitario">Spot Publicitario</option>
                  <option value="Motion Graphics">Motion Graphics</option>
                  <option value="Animación 3D">Animación 3D</option>
                  <option value="Audiovisual">Audiovisual</option>
                  <option value="Documental">Documental</option>
                  <option value="Cobertura de Evento">Cobertura de Evento</option>
                </select>
              </div>
            </div>

            {/* Client, Year, Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Cliente / Marca
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="ej. UNICARIBE / BanReservas"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Año
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Duración
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="02:15"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Custom Thumbnail URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                URL de Miniatura (Opcional, se auto-extrae para YouTube)
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (o dejar vacío)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Descripción / Sinopsis Técnica
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Dirección artística, software utilizado (After Effects, DaVinci Resolve, Cinema 4D) y objetivos de comunicación..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Featured toggle */}
            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="rounded border-[var(--border-strong)] text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
              />
              <span className="text-xs font-mono text-[var(--text-primary)]">
                Destacar como Video Principal (Showreel de Portada)
              </span>
            </label>

            {/* Submit & Delete buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              {videoToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar el video "${videoToEdit.title}"?`)) {
                      onDelete(videoToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 text-xs font-mono text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Video</span>
                </button>
              ) : <div />}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-mono text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] rounded-xl transition-colors cursor-pointer font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{videoToEdit ? 'Guardar Cambios' : 'Publicar Video'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
