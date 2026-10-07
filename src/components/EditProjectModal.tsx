import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Sparkles, 
  Video as VideoIcon, 
  FileText, 
  Presentation, 
  ExternalLink,
  Play,
  Plus,
  Layers,
  Star
} from 'lucide-react';
import { Project, SpecialtyCategory } from '../types/portfolio';
import { parseVideoUrl, parseDocumentUrl, formatGoogleDrivePreviewUrl } from '../utils/mediaEmbed';

interface EditProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Project>) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES: SpecialtyCategory[] = [
  'Social Media',
  'Editorial',
  'Fotografía',
  'Ilustración',
  'Branding',
  'Video'
];

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  project,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState(project?.title || '');
  const [category, setCategory] = useState<SpecialtyCategory>(project?.category || 'Social Media');
  const [client, setClient] = useState(project?.client || '');
  const [year, setYear] = useState(project?.year || '');
  const [description, setDescription] = useState(project?.description || '');
  const [tagsInput, setTagsInput] = useState(project?.tags ? project.tags.join(', ') : '');
  const [imageUrl, setImageUrl] = useState(project?.imageUrl || '');
  const [images, setImages] = useState<string[]>(() => {
    if (project && Array.isArray(project.images) && project.images.length > 0) {
      return project.images;
    }
    return project?.imageUrl ? [project.imageUrl] : [];
  });
  const [newImageInputUrl, setNewImageInputUrl] = useState('');
  const [featured, setFeatured] = useState(Boolean(project?.featured));
  
  // Video and Document fields
  const [videoUrl, setVideoUrl] = useState(project?.videoUrl || '');
  const [documentUrl, setDocumentUrl] = useState(project?.documentUrl || '');
  const [documentName, setDocumentName] = useState(project?.documentName || '');
  const [documentType, setDocumentType] = useState<string>(project?.documentType || 'none');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  // Sync state whenever project changes or modal opens
  useEffect(() => {
    if (project) {
      setTitle(project.title || '');
      setCategory(project.category || 'Social Media');
      setClient(project.client || '');
      setYear(project.year || '');
      setDescription(project.description || '');
      setTagsInput(project.tags ? project.tags.join(', ') : '');
      setImageUrl(project.imageUrl || '');
      setImages(
        Array.isArray(project.images) && project.images.length > 0
          ? project.images
          : (project.imageUrl ? [project.imageUrl] : [])
      );
      setFeatured(Boolean(project.featured));
      setVideoUrl(project.videoUrl || '');
      setDocumentUrl(project.documentUrl || '');
      setDocumentName(project.documentName || '');
      setDocumentType(project.documentType || 'none');
      setNewImageInputUrl('');
    }
  }, [project, isOpen]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageUrl(result);
      setImages(prev => {
        if (prev.length === 0) return [result];
        const next = [...prev];
        next[0] = result;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const readers = fileList.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(newImages => {
      setImages(prev => {
        const updated = [...prev, ...newImages];
        if (!imageUrl && updated.length > 0) {
          setImageUrl(updated[0]);
        }
        return updated;
      });
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageInputUrl.trim()) return;
    const url = newImageInputUrl.trim();
    setImages(prev => {
      const updated = [...prev, url];
      if (!imageUrl) setImageUrl(url);
      return updated;
    });
    setNewImageInputUrl('');
  };

  const handleSetCover = (index: number) => {
    setImages(prev => {
      const target = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      const updated = [target, ...rest];
      setImageUrl(target);
      return updated;
    });
  };

  const handleRemoveImage = (index: number) => {
    setImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (index === 0 && updated.length > 0) {
        setImageUrl(updated[0]);
      }
      return updated;
    });
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setDocumentUrl(reader.result as string);
      setDocumentName(file.name);
      setDocumentType('pdf');
    };
    reader.readAsDataURL(file);
  };

  const handleDriveUrlChange = (val: string) => {
    const formatted = formatGoogleDrivePreviewUrl(val);
    setDocumentUrl(formatted);
    if (val.includes('presentation')) {
      setDocumentType('google_slides');
      if (!documentName) setDocumentName('Presentación Google Slides');
    } else if (val.includes('canva.com') || val.includes('canva')) {
      setDocumentType('canva');
      if (!documentName) setDocumentName('Presentación en Canva');
    } else if (val.includes('drive.google.com')) {
      setDocumentType('google_drive');
      if (!documentName) setDocumentName('Documento en Google Drive');
    } else if (val.endsWith('.pdf')) {
      setDocumentType('pdf');
    } else if (val.endsWith('.pptx') || val.endsWith('.ppt')) {
      setDocumentType('pptx');
    }
  };

  const videoPreview = parseVideoUrl(videoUrl);
  const docPreview = parseDocumentUrl(documentUrl, documentType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project) return;

    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const finalImages = images.length > 0 ? images : (imageUrl ? [imageUrl] : []);
    const coverImage = finalImages[0] || imageUrl;

    onSave(project.id, {
      title,
      category,
      client,
      year,
      description,
      tags,
      imageUrl: coverImage,
      images: finalImages,
      videoUrl: videoUrl.trim() || undefined,
      videoPlatform: videoPreview ? (videoPreview.type as any) : undefined,
      documentUrl: documentUrl.trim() || undefined,
      documentType: docPreview ? (docPreview.type as any) : undefined,
      documentName: documentName.trim() || undefined,
      featured
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="edit-project-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 my-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold">
                Editor de Obra & Medios
              </span>
              <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                EDITAR PROYECTO
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                  Título del Proyecto
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                  Especialidad
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SpecialtyCategory)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                  Cliente / Institución
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                  Año de Publicación
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            </div>

            {/* Carrusel de Imágenes & Galería Visual */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <label className="text-xs font-mono uppercase text-[var(--text-primary)] font-semibold flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[var(--accent-color)]" />
                    <span>Carrusel de Imágenes & Galería ({images.length} fotos)</span>
                  </label>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono mt-0.5">
                    Carga múltiples imágenes para que tus visitantes puedan explorarlas en un carrusel interactivo.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    ref={multiFileInputRef}
                    onChange={handleMultipleImagesUpload}
                    multiple
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => multiFileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Añadir varias fotos</span>
                  </button>
                </div>
              </div>

              {/* Add by URL input */}
              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={newImageInputUrl}
                  onChange={(e) => setNewImageInputUrl(e.target.value)}
                  placeholder="O pega URL de una imagen para el carrusel (ej: https://...)"
                  className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddImageUrl();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer shrink-0"
                >
                  + Agregar URL
                </button>
              </div>

              {/* Preview Grid of Carousel Images */}
              {images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 pt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      className={`group relative aspect-[4/3] rounded-lg overflow-hidden border transition-all ${
                        idx === 0 
                          ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/30' 
                          : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                      } bg-black/60`}
                    >
                      <img
                        src={img}
                        alt={`Slide ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />

                      {/* Cover Badge on Image 0 */}
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[var(--accent-color)] text-white text-[9px] font-mono font-bold flex items-center gap-1 shadow">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          <span>Portada</span>
                        </span>
                      ) : (
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-neutral-300 text-[9px] font-mono">
                          #{idx + 1}
                        </span>
                      )}

                      {/* Action buttons overlay on hover */}
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(idx)}
                            className="px-2 py-1 bg-white/20 hover:bg-[var(--accent-color)] text-white text-[10px] font-mono rounded transition-colors cursor-pointer w-full text-center"
                            title="Establecer como portada principal"
                          >
                            Hacer portada
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 bg-red-600/80 hover:bg-red-600 text-white rounded transition-colors cursor-pointer"
                          title="Eliminar esta foto del carrusel"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center border border-dashed border-[var(--border-subtle)] rounded-xl bg-[var(--bg-primary)]/50">
                  <ImageIcon className="w-8 h-8 text-[var(--text-muted)] mx-auto mb-2 opacity-50" />
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    No hay imágenes cargadas en el carrusel.
                  </p>
                </div>
              )}
            </div>

            {/* NEW: Video Links Section (YouTube, Vimeo, Google Drive) */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <VideoIcon className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>Enlace de Video (YouTube, Vimeo o Google Drive)</span>
                </label>
                {videoPreview && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] font-semibold uppercase">
                    Detectado: {videoPreview.title}
                  </span>
                )}
              </div>

              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Ej. https://www.youtube.com/watch?v=... o https://vimeo.com/... o enlace de Drive"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-mono"
              />

              {videoPreview && (
                <div className="mt-2 aspect-video max-h-40 rounded-lg overflow-hidden bg-black border border-[var(--border-subtle)]">
                  <iframe
                    src={videoPreview.embedUrl}
                    title="Previsualización de Video"
                    className="w-full h-full border-0"
                  />
                </div>
              )}
            </div>

            {/* NEW: Document Section (Upload PDF, Google Drive, Google Slides, PPTX) */}
            <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase text-[var(--text-primary)] font-semibold flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Documento Adjunto (PDF, Google Drive, Google Slides o PPTX)</span>
                </label>
                {docPreview && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                    {docPreview.title}
                  </span>
                )}
              </div>

              {/* Action to upload local PDF or import Drive link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <input
                    type="file"
                    ref={pdfInputRef}
                    onChange={handlePdfUpload}
                    accept=".pdf,application/pdf"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    className="w-full py-2.5 px-3 bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Subir Archivo PDF desde Disco</span>
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={documentUrl}
                    onChange={(e) => handleDriveUrlChange(e.target.value)}
                    placeholder="O pega enlace de Google Drive / Slides / PPTX"
                    className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-mono"
                  />
                </div>
              </div>

              {documentName && (
                <div className="flex items-center justify-between text-xs text-emerald-400 font-mono bg-[var(--bg-primary)] px-3 py-1.5 rounded-lg border border-emerald-500/30">
                  <span className="truncate">Archivo adjunto: {documentName}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setDocumentUrl('');
                      setDocumentName('');
                      setDocumentType('none');
                    }}
                    className="text-neutral-400 hover:text-red-400 ml-2"
                  >
                    Quitar
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                Etiquetas (separadas por coma)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                Descripción / Manifiesto
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] resize-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featuredCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-[var(--accent-color)] focus:ring-[var(--accent-color)]"
              />
              <label htmlFor="featuredCheck" className="text-xs font-mono text-[var(--text-secondary)] cursor-pointer">
                Destacar proyecto en portada
              </label>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  if (project && confirm(`¿Eliminar definitivamente "${project.title}"?`)) {
                    onDelete(project.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-mono"
              >
                <Trash2 className="w-4 h-4" />
                <span>Eliminar Proyecto</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Guardar Cambios</span>
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
