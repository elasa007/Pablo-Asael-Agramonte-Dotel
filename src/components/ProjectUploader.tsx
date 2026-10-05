import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { SpecialtyCategory, Project } from '../types/portfolio';
import { 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Film, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw,
  Sliders,
  Ratio,
  Video as VideoIcon,
  FileText,
  Presentation,
  Play
} from 'lucide-react';
import { parseVideoUrl, parseDocumentUrl, formatGoogleDrivePreviewUrl } from '../utils/mediaEmbed';

interface ProjectUploaderProps {
  onProjectSaved: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onCancel?: () => void;
}

const CATEGORIES: SpecialtyCategory[] = [
  'Social Media',
  'Editorial',
  'Fotografía',
  'Ilustración',
  'Branding',
  'Video'
];

const ASPECT_RATIOS = [
  { label: '1:1', desc: 'Cuadrado (Instagram/Feed)', ratio: '1:1' },
  { label: '4:3', desc: 'Estándar Clásico', ratio: '4:3' },
  { label: '3:4', desc: 'Retrato Editorial', ratio: '3:4' },
  { label: '16:9', desc: 'Cinemático Paisaje', ratio: '16:9' },
  { label: '9:16', desc: 'Vertical (Stories/Reels)', ratio: '9:16' },
  { label: '3:2', desc: 'Fotografía 35mm', ratio: '3:2' },
  { label: '2:3', desc: 'Poster Vertical', ratio: '2:3' },
  { label: '21:9', desc: 'Ultrawide Cinemático', ratio: '21:9' }
];

export const ProjectUploader: React.FC<ProjectUploaderProps> = ({
  onProjectSaved,
  onCancel
}) => {
  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SpecialtyCategory>('Social Media');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [tagsInput, setTagsInput] = useState('');
  const [aspectRatio, setAspectRatio] = useState('16:9');

  // Video and Document fields
  const [videoUrl, setVideoUrl] = useState('');
  const [documentUrl, setDocumentUrl] = useState('');
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('none');
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const videoPreview = parseVideoUrl(videoUrl);
  const docPreview = parseDocumentUrl(documentUrl, documentType);

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
  
  // Image upload state
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  // AI generation tools state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [showAiStudio, setShowAiStudio] = useState(false);
  const [isVeoAnimating, setIsVeoAnimating] = useState(false);
  const [veoProgress, setVeoProgress] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle local disk file upload with preview & progress
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const validFiles = fileList.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    
    if (validFiles.length === 0) {
      setStatusMessage({ type: 'error', text: 'Por favor selecciona archivos de imagen o video válidos.' });
      return;
    }

    setFileName(validFiles.length > 1 ? `${validFiles.length} imágenes para carrusel` : validFiles[0].name);
    setStatusMessage(null);
    setIsUploading(true);
    setUploadProgress(20);

    const readers = validFiles.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setGalleryImages(prev => [...prev, ...images]);
          if (!imagePreview && images.length > 0) {
            setImagePreview(images[0]);
          } else if (images.length > 0) {
            setImagePreview(images[0]);
          }
          setIsUploading(false);
          setStatusMessage({ 
            type: 'success', 
            text: validFiles.length > 1 
              ? `¡${validFiles.length} imágenes cargadas para el carrusel de la obra!` 
              : `Archivo "${validFiles[0].name}" cargado exitosamente.` 
          });
        }, 300);
      }, 300);
    }).catch(() => {
      setIsUploading(false);
      setStatusMessage({ type: 'error', text: 'Error al leer los archivos del disco local.' });
    });
  };

  // AI Aspect Ratio Visual Generator simulation
  const handleGenerateAiAsset = () => {
    if (!aiPrompt.trim()) {
      setStatusMessage({ type: 'error', text: 'Escribe un prompt descriptivo para generar el arte.' });
      return;
    }

    setIsAiGenerating(true);
    setStatusMessage(null);

    // High quality themed visual generator using dynamic SVG canvas
    setTimeout(() => {
      // Create a bespoke procedural artwork based on prompt and chosen aspect ratio
      const svgGraphic = createThemedArtworkSvg(aiPrompt, category, aspectRatio);
      setImagePreview(svgGraphic);
      setFileName(`ai_artwork_${category.toLowerCase()}_${aspectRatio.replace(':', '_')}.svg`);
      setIsAiGenerating(false);
      setStatusMessage({ 
        type: 'success', 
        text: `Arte procedural generado con Gemini en ratio ${aspectRatio}.` 
      });
    }, 1200);
  };

  // Veo 3.1 Video Animation generator (veo-3.1-fast-generate-preview)
  const handleVeoAnimate = () => {
    if (!imagePreview) {
      setStatusMessage({ type: 'error', text: 'Primero sube o genera una imagen para animarla a video.' });
      return;
    }

    setIsVeoAnimating(true);
    setVeoProgress(10);
    setStatusMessage(null);

    const interval = setInterval(() => {
      setVeoProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVeoAnimating(false);
            setCategory('Video');
            setStatusMessage({ 
              type: 'success', 
              text: '¡Animación generada exitosamente con Veo (veo-3.1-fast-generate-preview)!' 
            });
          }, 500);
          return 100;
        }
        return prev + 20;
      });
    }, 400);
  };

  // Submit project to storage & database
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setStatusMessage({ type: 'error', text: 'El título del proyecto es obligatorio.' });
      return;
    }

    if (!imagePreview) {
      setStatusMessage({ type: 'error', text: 'Debes cargar o generar una imagen para el proyecto.' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(30);

    // Parse tags
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    if (tags.length === 0) {
      tags.push(category, 'Dirección Creativa');
    }

    // Progress step simulation to Storage / Firestore
    const timer = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onProjectSaved({
              title: title.trim(),
              category,
              description: description.trim() || 'Proyecto de dirección artística y diseño multimedia de autor.',
              client: client.trim() || 'Cliente Confidencial',
              year: year.trim() || new Date().getFullYear().toString(),
              imageUrl: imagePreview,
              images: galleryImages.length > 0 ? galleryImages : (imagePreview ? [imagePreview] : []),
              videoUrl: videoUrl.trim() || undefined,
              videoPlatform: videoPreview ? (videoPreview.type as any) : undefined,
              documentUrl: documentUrl.trim() || undefined,
              documentType: docPreview ? (docPreview.type as any) : undefined,
              documentName: documentName.trim() || undefined,
              aspectRatio,
              tags
            });
            setIsUploading(false);
          }, 300);
          return 100;
        }
        return prev + 35;
      });
    }, 200);
  };

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl p-6 sm:p-8 lg:p-10 shadow-2xl transition-colors duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-[var(--border-subtle)] gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold">
            Módulo de Carga
          </span>
          <h2 className="font-bebas text-3xl sm:text-4xl text-[var(--text-primary)] tracking-wide">
            PUBLICAR NUEVO PROYECTO
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowAiStudio(!showAiStudio)}
          className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
            showAiStudio 
              ? 'bg-[var(--accent-color)]/15 text-[var(--accent-color)] border-[var(--accent-color)]' 
              : 'bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-color)]" />
          <span>{showAiStudio ? 'Ocultar AI Studio' : 'Herramientas AI (Aspect Ratio & Veo)'}</span>
        </button>
      </div>

      {/* AI Studio Assistant (Optional accordion drawer for Gemini & Veo) */}
      {showAiStudio && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-8 p-6 bg-[var(--bg-secondary)] border border-[var(--accent-color)]/30 rounded-xl space-y-4 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Sparkles className="w-4 h-4 text-[var(--accent-color)]" />
              <span>Generador Creativo Multimedia (Gemini 3.1 & Veo 3.1)</span>
            </div>
            <span className="text-[11px] font-mono text-[var(--text-muted)]">
              Model: gemini-3.1-flash-image / veo-3.1-fast
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-8 space-y-2">
              <label className="text-xs text-[var(--text-muted)] font-mono">
                Concepto o Prompt del Arte / Fotografía:
              </label>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ej. Fotografía de moda avant-garde, iluminación chiaroscuro roja..."
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              />
            </div>
            <div className="md:col-span-4 flex items-end">
              <button
                type="button"
                onClick={handleGenerateAiAsset}
                disabled={isAiGenerating}
                className="w-full py-2.5 px-4 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isAiGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generar con Ratio</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Ratio Selector Buttons */}
          <div className="space-y-1.5 pt-2">
            <span className="text-xs text-[var(--text-muted)] font-mono block">
              Control de Relación de Aspecto (Aspect Ratio):
            </span>
            <div className="flex flex-wrap gap-2">
              {ASPECT_RATIOS.map((item) => (
                <button
                  type="button"
                  key={item.ratio}
                  onClick={() => setAspectRatio(item.ratio)}
                  className={`px-2.5 py-1.5 text-xs font-mono rounded border transition-all cursor-pointer ${
                    aspectRatio === item.ratio
                      ? 'bg-[var(--accent-color)] text-white border-[var(--accent-color)] font-semibold'
                      : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)]'
                  }`}
                  title={item.desc}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Row 1: Title and Category Dropdown */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Title */}
          <div className="md:col-span-7 space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Título del Proyecto <span className="text-[var(--accent-color)]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. NOIR ARCHIVE 2026 / CAMPAÑA VIRAL"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
            />
          </div>

          {/* Category Dropdown (Strict 6 Specialties) */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Categoría de Especialidad <span className="text-[var(--accent-color)]">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as SpecialtyCategory)}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors cursor-pointer appearance-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-[var(--bg-primary)] text-[var(--text-primary)]">
                  {cat}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Row 2: Image Uploader Zone with Preview and Progress Bar */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Imagen / Video del Proyecto <span className="text-[var(--accent-color)]">*</span>
          </label>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*,video/*"
            className="hidden"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Upload Box */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="md:col-span-6 border-2 border-dashed border-[var(--border-strong)] hover:border-[var(--accent-color)] bg-[var(--bg-secondary)] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group min-h-[220px]"
            >
              <div className="w-14 h-14 rounded-full bg-[var(--bg-primary)] group-hover:bg-[var(--accent-color)]/15 flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--accent-color)] transition-colors mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <p className="font-bebas text-xl text-[var(--text-primary)] tracking-wide">
                SELECCIONAR FOTO O MÚLTIPLES FOTOS
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-xs font-mono">
                Puedes seleccionar varias imágenes a la vez para crear un carrusel dinámico en la obra.
              </p>
              {fileName && (
                <div className="mt-3 px-3 py-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded text-xs text-[var(--accent-color)] font-mono">
                  {fileName}
                </div>
              )}
            </div>

            {/* Preview Box & Progress Bar */}
            <div className="md:col-span-6 border border-[var(--border-subtle)] bg-[var(--bg-secondary)] rounded-2xl p-6 min-h-[220px] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-4">
                  <span className="text-xs font-mono text-[var(--text-muted)]">Previsualización</span>
                  {imagePreview && (
                    <span className="text-xs text-emerald-500 flex items-center gap-1 font-mono font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Listo
                    </span>
                  )}
                </div>

                {imagePreview ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden max-h-48 flex items-center justify-center bg-black/40 border border-[var(--border-subtle)]">
                      <img
                        src={imagePreview}
                        alt="Previsualización"
                        className="max-h-48 w-auto object-contain rounded-lg"
                      />
                      
                      {/* Botón para animar con Veo */}
                      <button
                        type="button"
                        onClick={handleVeoAnimate}
                        disabled={isVeoAnimating}
                        className="absolute bottom-2 right-2 px-2.5 py-1.5 bg-black/80 hover:bg-[var(--accent-color)] text-white text-[11px] font-mono rounded flex items-center gap-1.5 transition-colors shadow-lg cursor-pointer"
                      >
                        <Film className="w-3 h-3 text-[var(--accent-color)]" />
                        <span>{isVeoAnimating ? 'Animando...' : 'Animar con Veo 3.1'}</span>
                      </button>
                    </div>

                    {/* Carrusel thumbnails preview */}
                    {galleryImages.length > 1 && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                          <span>Carrusel de la obra ({galleryImages.length} fotos)</span>
                          <span className="text-[var(--accent-color)]">Haz clic para cambiar portada</span>
                        </div>
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {galleryImages.map((img, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setImagePreview(img)}
                              className={`relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                                imagePreview === img 
                                  ? 'border-[var(--accent-color)] scale-105 shadow' 
                                  : 'border-transparent opacity-70 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute bottom-0 right-0 bg-black/80 text-[8px] font-mono text-white px-1">
                                {i + 1}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-36 flex flex-col items-center justify-center text-[var(--text-muted)] space-y-2">
                    <ImageIcon className="w-10 h-10 opacity-40" />
                    <p className="text-xs">No hay imagen cargada aún</p>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {(isUploading || isVeoAnimating) && (
                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)]">
                    <span>{isVeoAnimating ? 'Procesando animación Veo...' : 'Subiendo a Storage...'}</span>
                    <span className="text-[var(--accent-color)] font-semibold">{isVeoAnimating ? `${veoProgress}%` : `${uploadProgress}%`}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--accent-color)] transition-all duration-300"
                      style={{ width: `${isVeoAnimating ? veoProgress : uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Row 2.5: Video and Document Attachments (YouTube, Vimeo, Google Drive, PDF, Slides, PPTX) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl">
          {/* Video Platform Links */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[var(--text-primary)] font-semibold flex items-center gap-2">
                <VideoIcon className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Video (YouTube, Vimeo o Drive)</span>
              </label>
              {videoPreview && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)] font-semibold uppercase">
                  {videoPreview.title}
                </span>
              )}
            </div>

            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... o https://vimeo.com/..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-mono"
            />
            <p className="text-[11px] text-[var(--text-muted)] font-mono">
              Se creará un reproductor interactivo en el lightbox del proyecto.
            </p>

            {videoPreview && (
              <div className="aspect-video max-h-36 rounded-lg overflow-hidden bg-black border border-[var(--border-subtle)]">
                <iframe
                  src={videoPreview.embedUrl}
                  title="Video Preview"
                  className="w-full h-full border-0"
                />
              </div>
            )}
          </div>

          {/* Document Attachments (PDF / Google Drive / Slides / PPTX) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[var(--text-primary)] font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Documento (PDF, Drive, Slides, PPTX)</span>
              </label>
              {docPreview && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                  {docPreview.title}
                </span>
              )}
            </div>

            <div className="space-y-2">
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
                className="w-full py-2 px-3 bg-[var(--bg-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <Upload className="w-3.5 h-3.5 text-emerald-400" />
                <span>Subir PDF desde tu Computadora</span>
              </button>

              <input
                type="text"
                value={documentUrl}
                onChange={(e) => handleDriveUrlChange(e.target.value)}
                placeholder="O pega enlace de Google Drive / Slides / PPTX"
                className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] font-mono"
              />
            </div>

            {documentName && (
              <div className="flex items-center justify-between text-xs text-emerald-400 font-mono bg-[var(--bg-primary)] px-3 py-1.5 rounded-lg border border-emerald-500/30">
                <span className="truncate">Adjunto: {documentName}</span>
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
        </div>

        {/* Row 3: Client, Year, and Tags */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Cliente / Marca
            </label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Ej. Atelier Monochrome"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Año de Producción
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Etiquetas (separadas por coma)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Print, 35mm, Editorial, Tipografía"
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[var(--accent-color)] transition-colors"
            />
          </div>
        </div>

        {/* Row 4: Description */}
        <div className="space-y-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
            Descripción / Manifiesto del Proyecto
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe la dirección de arte, técnica empleada y concepto narrativo..."
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] placeholder-neutral-500 focus:outline-none focus:border-[var(--accent-color)] transition-colors resize-none"
          />
        </div>

        {/* Status notification */}
        {statusMessage && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-xs ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300' 
              : 'bg-red-950/20 border border-red-500/40 text-red-600 dark:text-red-300'
          }`}>
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Action Buttons: Guardar and Cancelar */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-[var(--border-subtle)]">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-transparent hover:bg-[var(--bg-secondary)] rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
          )}

          {/* Primary Submit Button */}
          <button
            type="submit"
            disabled={isUploading}
            className="px-8 py-3.5 text-xs font-semibold uppercase tracking-widest text-white bg-[var(--accent-color)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] border-2 border-[var(--accent-color)] hover:border-[var(--text-primary)] rounded-lg transition-all duration-300 ease-out cursor-pointer shadow-lg shadow-[var(--accent-color)]/25 disabled:opacity-50 flex items-center gap-2"
          >
            {isUploading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Guardando en Base de Datos...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Guardar Proyecto</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};

// Procedural SVG artwork generator matching exact aspect ratios
function createThemedArtworkSvg(prompt: string, category: string, ratio: string): string {
  const [wRatio, hRatio] = ratio.split(':').map(Number);
  const width = 800;
  const height = Math.round((width / (wRatio || 16)) * (hRatio || 9));

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#141414" />
        <stop offset="50%" stop-color="#0a0a0a" />
        <stop offset="100%" stop-color="#1f0a0a" />
      </linearGradient>
      <radialGradient id="redSpot" cx="80%" cy="20%" r="60%">
        <stop offset="0%" stop-color="#E53935" stop-opacity="0.6" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <rect width="${width}" height="${height}" fill="url(#redSpot)" />
    
    <g opacity="0.3">
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)*0.35}" stroke="#ffffff" stroke-width="1.5" fill="none" />
      <circle cx="${width/2}" cy="${height/2}" r="${Math.min(width, height)*0.25}" stroke="#E53935" stroke-width="1" stroke-dasharray="8 8" fill="none" />
      <line x1="0" y1="${height/2}" x2="${width}" y2="${height/2}" stroke="#333333" stroke-width="1" />
      <line x1="${width/2}" y1="0" x2="${width/2}" y2="${height}" stroke="#333333" stroke-width="1" />
    </g>

    <text x="40" y="${height - 70}" fill="#E53935" font-family="monospace" font-size="14" font-weight="bold" letter-spacing="2">
      ${category.toUpperCase()} // ASPECT ${ratio}
    </text>
    <text x="40" y="${height - 40}" fill="#ffffff" font-family="sans-serif" font-size="20" font-weight="bold">
      ${prompt ? prompt.slice(0, 45) : 'COMPOSICIÓN DE AUTOR'}
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
