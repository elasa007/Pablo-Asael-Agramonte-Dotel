import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  HardDrive, 
  FileText, 
  Presentation, 
  Check, 
  Sparkles, 
  AlertCircle, 
  Link as LinkIcon, 
  Trash2, 
  FileUp, 
  ExternalLink 
} from 'lucide-react';
import { DocumentItem } from '../types/portfolio';
import { parseDocumentUrl, formatGoogleDrivePreviewUrl } from '../utils/mediaEmbed';

interface AddDocumentModalProps {
  isOpen: boolean;
  docToEdit?: DocumentItem | null;
  onClose: () => void;
  onSave: (doc: Omit<DocumentItem, 'id' | 'createdAt'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

export const AddDocumentModal: React.FC<AddDocumentModalProps> = ({
  isOpen,
  docToEdit,
  onClose,
  onSave,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'google_drive'>('upload');
  
  // Form fields
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<'pdf' | 'pptx' | 'google_slides' | 'google_drive'>('pdf');
  const [fileUrl, setFileUrl] = useState('');
  const [driveUrl, setDriveUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [category, setCategory] = useState('Dossier');
  const [client, setClient] = useState('');
  const [year, setYear] = useState('2026');
  const [description, setDescription] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (docToEdit) {
      setTitle(docToEdit.title);
      setDocType(docToEdit.type);
      setFileUrl(docToEdit.fileUrl);
      setCategory(docToEdit.category || 'Dossier');
      setClient(docToEdit.client || '');
      setYear(docToEdit.year || '2026');
      setDescription(docToEdit.description || '');
      setFileSize(docToEdit.size || '');
      setPageCount(docToEdit.pageCount ? String(docToEdit.pageCount) : '');
      setThumbnailUrl(docToEdit.thumbnailUrl || '');

      if (docToEdit.source === 'google_drive' || docToEdit.fileUrl.includes('google.com')) {
        setActiveTab('google_drive');
        setDriveUrl(docToEdit.fileUrl);
      } else {
        setActiveTab('upload');
      }
    } else {
      setTitle('');
      setDocType('pdf');
      setFileUrl('');
      setDriveUrl('');
      setFileName('');
      setFileSize('');
      setPageCount('12 Páginas');
      setCategory('Dossier');
      setClient('');
      setYear('2026');
      setDescription('');
      setThumbnailUrl('');
      setActiveTab('upload');
    }
    setError(null);
  }, [docToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload (PDF or PPTX)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 25MB for local base64 preview)
    if (file.size > 25 * 1024 * 1024) {
      setError('El archivo excede los 25MB. Para archivos más pesados, te recomendamos importarlos desde Google Drive.');
      return;
    }

    const isPdfFile = file.name.endsWith('.pdf') || file.type.includes('pdf');
    const isPptxFile = file.name.endsWith('.pptx') || file.name.endsWith('.ppt') || file.type.includes('presentation');

    const detectedType: 'pdf' | 'pptx' = isPptxFile ? 'pptx' : 'pdf';
    setDocType(detectedType);
    setFileName(file.name);
    setFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setFileUrl(event.target.result);
        setError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  // Google Drive URL processing
  const handleDriveUrlChange = (val: string) => {
    setDriveUrl(val);
    if (!val.trim()) return;

    if (val.includes('docs.google.com/presentation')) {
      setDocType('google_slides');
      if (!category || category === 'Dossier') setCategory('Presentación');
    } else if (val.endsWith('.pptx') || val.includes('presentation')) {
      setDocType('pptx');
    } else {
      setDocType('pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor indica un título para el documento.');
      return;
    }

    let finalFileUrl = '';
    let finalEmbedUrl = '';
    let source: 'upload' | 'google_drive' | 'url' = 'upload';

    if (activeTab === 'google_drive') {
      if (!driveUrl.trim()) {
        setError('Por favor ingresa el enlace de Google Drive o Google Slides.');
        return;
      }
      source = 'google_drive';
      finalFileUrl = driveUrl.trim();
      finalEmbedUrl = formatGoogleDrivePreviewUrl(finalFileUrl);
    } else {
      if (!fileUrl && !docToEdit) {
        setError('Por favor selecciona un archivo PDF o PPTX de tu equipo.');
        return;
      }
      source = 'upload';
      finalFileUrl = fileUrl || docToEdit?.fileUrl || '';
      finalEmbedUrl = finalFileUrl;
    }

    const defaultThumbs: Record<string, string> = {
      pdf: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80',
      pptx: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      google_slides: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
      google_drive: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=800&q=80'
    };

    onSave({
      title: title.trim(),
      type: docType,
      source,
      fileUrl: finalFileUrl,
      embedUrl: finalEmbedUrl,
      thumbnailUrl: thumbnailUrl || defaultThumbs[docType] || defaultThumbs.pdf,
      size: fileSize || (activeTab === 'google_drive' ? 'Nube Google Drive' : '1.5 MB'),
      pageCount: pageCount.trim() || '10 Páginas',
      category: category.trim(),
      client: client.trim(),
      year: year.trim(),
      description: description.trim()
    }, docToEdit ? docToEdit.id : undefined);

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
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
          className="relative w-full max-w-2xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col max-h-[94vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                {docType === 'google_slides' || docType === 'pptx' ? (
                  <Presentation className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </span>
              <div>
                <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  {docToEdit ? 'Editar Documento' : 'Añadir Documento / Presentación'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Sube archivos PDF / PPTX locales o importa desde Google Drive & Slides
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

          {/* Tab Selector: Upload Local vs Google Drive Import */}
          <div className="px-6 pt-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2.5 text-xs font-mono rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'upload'
                  ? 'border-[var(--accent-color)] text-[var(--text-primary)] font-semibold bg-[var(--bg-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <FileUp className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>1. Subir Archivo Local (PDF / PPTX)</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('google_drive')}
              className={`px-4 py-2.5 text-xs font-mono rounded-t-xl transition-all flex items-center gap-2 border-b-2 cursor-pointer ${
                activeTab === 'google_drive'
                  ? 'border-[var(--accent-color)] text-[var(--text-primary)] font-semibold bg-[var(--bg-primary)]'
                  : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5 text-[var(--accent-color)]" />
              <span>2. Importar desde Google Drive / Slides</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* TAB 1: File Uploader */}
            {activeTab === 'upload' ? (
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Seleccionar Documento (PDF o PPTX) *
                </label>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.pptx,.ppt,application/pdf,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-[var(--border-subtle)] hover:border-[var(--accent-color)] bg-[var(--bg-secondary)] text-center cursor-pointer transition-colors group"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-[var(--bg-elevated)] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-110 transition-transform mb-3 shadow">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {fileName ? (
                      <span className="text-[var(--accent-color)] font-semibold">✓ {fileName}</span>
                    ) : (
                      'Haz clic para buscar o arrastra tu archivo PDF o PPTX'
                    )}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                    Formatos: PDF, PPTX (PowerPoint). Máximo 25MB por archivo local.
                  </p>
                  {fileSize && (
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[10px] font-mono text-[var(--text-secondary)]">
                      Peso: {fileSize}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* TAB 2: Google Drive / Google Slides Importer */
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center justify-between">
                  <span>Enlace de Google Drive / Google Slides *</span>
                  <span className="text-[var(--accent-color)] font-mono normal-case">
                    Sincronización en la nube
                  </span>
                </label>
                
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                  <input
                    type="url"
                    value={driveUrl}
                    onChange={(e) => handleDriveUrlChange(e.target.value)}
                    placeholder="https://drive.google.com/file/d/... o https://docs.google.com/presentation/d/..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                  />
                </div>

                <div className="p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-secondary)] space-y-1">
                  <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>Cómo importar desde Google Drive:</span>
                  </p>
                  <p>1. En Google Drive o Google Slides, haz clic en <strong>Compartir</strong>.</p>
                  <p>2. Cambia los permisos a <strong>"Cualquier persona con el enlace puede ver"</strong>.</p>
                  <p>3. Pega el enlace aquí arriba. Nuestro sistema lo transformará automáticamente en un visor embebido interactivo.</p>
                </div>
              </div>
            )}

            {/* Document Metadata Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Título del Documento *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Dossier Editorial Asael Agramonte"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Tipo / Formato de Documento
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="pdf">Documento PDF</option>
                  <option value="pptx">Presentación PowerPoint (PPTX)</option>
                  <option value="google_slides">Google Slides</option>
                  <option value="google_drive">Archivo Google Drive</option>
                </select>
              </div>
            </div>

            {/* Category & Extension / Pages */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors cursor-pointer"
                >
                  <option value="Dossier">Dossier de Obras</option>
                  <option value="Presentación">Presentación / Pitch Deck</option>
                  <option value="Manual de Marca">Manual de Marca</option>
                  <option value="CV">Curriculum / CV</option>
                  <option value="Propuesta">Propuesta Comercial</option>
                  <option value="Editorial">Catálogo Editorial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Extensión / Páginas
                </label>
                <input
                  type="text"
                  value={pageCount}
                  onChange={(e) => setPageCount(e.target.value)}
                  placeholder="ej. 24 Páginas o 16 Slides"
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
            </div>

            {/* Client / Project info */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Cliente o Proyecto Asociado
              </label>
              <input
                type="text"
                value={client}
                onChange={(e) => setClient(e.target.value)}
                placeholder="ej. Asael Agramonte Studio / UNICARIBE / BanReservas"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Descripción / Sinopsis
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Resumen del contenido del documento, objetivos y aplicaciones..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Custom thumbnail */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                URL Imagen Portada (Opcional)
              </label>
              <input
                type="url"
                value={thumbnailUrl}
                onChange={(e) => setThumbnailUrl(e.target.value)}
                placeholder="https://images.unsplash.com/... (o dejar en blanco para carátula predeterminada)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            {/* Submit / Delete */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              {docToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar el documento "${docToEdit.title}"?`)) {
                      onDelete(docToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-4 py-2 text-xs font-mono text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Documento</span>
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
                  <span>{docToEdit ? 'Guardar Cambios' : 'Publicar Documento'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
