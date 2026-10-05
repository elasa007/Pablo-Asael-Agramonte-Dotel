import React, { useState, useRef } from 'react';
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
  Play
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
  if (!isOpen || !project) return null;

  const [title, setTitle] = useState(project.title);
  const [category, setCategory] = useState<SpecialtyCategory>(project.category);
  const [client, setClient] = useState(project.client);
  const [year, setYear] = useState(project.year);
  const [description, setDescription] = useState(project.description);
  const [tagsInput, setTagsInput] = useState(project.tags.join(', '));
  const [imageUrl, setImageUrl] = useState(project.imageUrl);
  const [featured, setFeatured] = useState(Boolean(project.featured));
  
  // Video and Document fields
  const [videoUrl, setVideoUrl] = useState(project.videoUrl || '');
  const [documentUrl, setDocumentUrl] = useState(project.documentUrl || '');
  const [documentName, setDocumentName] = useState(project.documentName || '');
  const [documentType, setDocumentType] = useState<string>(project.documentType || 'none');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
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
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    onSave(project.id, {
      title,
      category,
      client,
      year,
      description,
      tags,
      imageUrl,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
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

            {/* Image Preview & Replacement */}
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase text-[var(--text-muted)] block">
                Imagen de Portada del Proyecto
              </label>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl">
                <div className="w-28 h-20 rounded-lg overflow-hidden bg-black/40 border border-[var(--border-subtle)] shrink-0 flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-2 w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-medium rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Cambiar imagen desde disco</span>
                  </button>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="O pega URL de la imagen"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                  />
                </div>
              </div>
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
                  if (confirm(`¿Eliminar definitivamente "${project.title}"?`)) {
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
    </AnimatePresence>
  );
};
