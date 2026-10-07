import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Upload, 
  Camera, 
  Check, 
  RefreshCw, 
  AlertCircle, 
  Trash2, 
  Sparkles, 
  Image as ImageIcon,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { SiteContentService } from '../services/siteContentService';
import { StorageService } from '../services/storageService';

interface EditProfilePhotoModalProps {
  isOpen: boolean;
  currentPhoto: string;
  onClose: () => void;
  onPhotoUpdated: (newUrl: string) => void;
}

const PRESET_PORTRAITS = [
  {
    id: 'preset_01',
    label: 'Clásico Dirección de Arte',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset_02',
    label: 'Editorial Avant-Garde',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset_03',
    label: 'Director Ejecutivo Studio',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset_04',
    label: 'Iluminación Natural Cinemática',
    url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'preset_05',
    label: 'Monocromo Minimalista',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80'
  }
];

export const EditProfilePhotoModal: React.FC<EditProfilePhotoModalProps> = ({
  isOpen,
  currentPhoto,
  onClose,
  onPhotoUpdated
}) => {
  const [photoPreview, setPhotoPreview] = useState<string>(currentPhoto);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [savedPhotos, setSavedPhotos] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPhotoPreview(currentPhoto);
      const profile = SiteContentService.getProfile();
      setSavedPhotos(profile.profilePhotos || [currentPhoto]);
    }
  }, [isOpen, currentPhoto]);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    try {
      const uploadRes = await StorageService.uploadImage(file, 'profile');
      const cloudUrl = uploadRes.url;
      setPhotoPreview(cloudUrl);
      SiteContentService.addProfilePhoto(cloudUrl);
      const updated = SiteContentService.getProfile();
      setSavedPhotos(updated.profilePhotos);
      setIsProcessing(false);
    } catch (err) {
      console.warn('Error uploading profile picture to storage, using local fallback:', err);
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        setPhotoPreview(dataUrl);
        SiteContentService.addProfilePhoto(dataUrl);
        const updated = SiteContentService.getProfile();
        setSavedPhotos(updated.profilePhotos);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setIsProcessing(false);
        setErrorMessage('Error al leer la imagen seleccionada.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleApplyUrl = () => {
    if (customUrl.trim()) {
      const url = customUrl.trim();
      setPhotoPreview(url);
      SiteContentService.addProfilePhoto(url);
      const updated = SiteContentService.getProfile();
      setSavedPhotos(updated.profilePhotos);
      setCustomUrl('');
    }
  };

  const handleSelectPreset = (url: string) => {
    setPhotoPreview(url);
    SiteContentService.addProfilePhoto(url);
    const updated = SiteContentService.getProfile();
    setSavedPhotos(updated.profilePhotos);
  };

  const handleDeletePhoto = (urlToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (savedPhotos.length <= 1) {
      setErrorMessage('Debes conservar al menos una foto de perfil en tu galería.');
      return;
    }
    SiteContentService.deleteProfilePhoto(urlToDelete);
    const updated = SiteContentService.getProfile();
    setSavedPhotos(updated.profilePhotos);
    if (photoPreview === urlToDelete) {
      setPhotoPreview(updated.avatarUrl);
    }
  };

  const handleSave = () => {
    SiteContentService.setActiveProfilePhoto(photoPreview);
    onPhotoUpdated(photoPreview);
    onClose();
  };

  const handleResetDefault = () => {
    const defaultUrl = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";
    setPhotoPreview(defaultUrl);
    SiteContentService.setActiveProfilePhoto(defaultUrl);
    onPhotoUpdated(defaultUrl);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="photo-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

        {/* Modal Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 space-y-6 my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)]">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide leading-none">
                  FOTOS DE PERFIL DEL DIRECTOR
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Sube, administra y alterna entre las fotos oficiales de Asael Agramonte
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Current Active Preview */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 sm:p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl">
            <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-xl overflow-hidden border-2 border-[var(--accent-color)] shadow-2xl bg-black shrink-0">
              <img
                src={photoPreview}
                alt="Foto de perfil seleccionada"
                className="w-full h-full object-cover"
                onError={() => {
                  setErrorMessage('No se pudo cargar la imagen seleccionada.');
                }}
              />
              {isProcessing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-white animate-spin" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 right-2 bg-black/70 backdrop-blur-md py-1 px-2 rounded text-[10px] font-mono text-center text-white">
                Foto Activa
              </div>
            </div>

            <div className="flex-1 space-y-2 text-center sm:text-left">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold flex items-center justify-center sm:justify-start gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Foto de Portada & Manifiesto</span>
              </span>
              <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                Lic. Asael Agramonte
              </h4>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Esta fotografía se mostrará con iluminación ambiental en la sección Hero, en el panel administrativo y en la ficha de presentación oficial.
              </p>
              <div className="pt-1 flex flex-wrap gap-2 justify-center sm:justify-start">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Subir Nueva Foto</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetDefault}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Restablecer
                </button>
              </div>
            </div>
          </div>

          {/* Drag & Drop File Upload Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
              isDragging 
                ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/10 scale-[1.01]' 
                : 'border-[var(--border-strong)] hover:border-[var(--accent-color)]/60 bg-[var(--bg-card)]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)]">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                Arrastra tu foto de perfil aquí o <span className="text-[var(--accent-color)] underline">selecciona un archivo</span>
              </p>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Soporta archivos JPG, PNG, WebP de cualquier resolución
              </p>
            </div>
          </div>

          {/* Image URL Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase text-[var(--text-muted)] flex items-center justify-between">
              <span>O agrega una foto mediante enlace web (URL):</span>
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                placeholder="https://ejemplo.com/asael-foto.jpg"
                className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
              />
              <button
                type="button"
                onClick={handleApplyUrl}
                className="px-4 py-2.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-semibold uppercase tracking-wider rounded-xl border border-[var(--border-subtle)] transition-colors cursor-pointer"
              >
                Cargar
              </button>
            </div>
          </div>

          {/* Section: Mis Fotos Guardadas (Library of uploaded photos) */}
          <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[var(--text-muted)]">
                Mis Fotos Disponibles ({savedPhotos.length})
              </span>
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Haz clic en una para activarla
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {savedPhotos.map((photo, idx) => {
                const isActive = photoPreview === photo;
                return (
                  <div
                    key={idx}
                    onClick={() => setPhotoPreview(photo)}
                    className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                      isActive 
                        ? 'border-[var(--accent-color)] shadow-lg scale-105' 
                        : 'border-[var(--border-subtle)] hover:border-[var(--border-strong)] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={photo}
                      alt={`Foto guardada ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Active check icon badge */}
                    {isActive && (
                      <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Delete photo button (hover) */}
                    <button
                      type="button"
                      onClick={(e) => handleDeletePhoto(photo, e)}
                      title="Eliminar esta foto de la galería"
                      className="absolute bottom-1.5 right-1.5 p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section: Presets de Estudio Recomendados */}
          <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
            <span className="text-xs font-mono uppercase text-[var(--text-muted)] block">
              Presets Profesionales Recomendados
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {PRESET_PORTRAITS.map(preset => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset.url)}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-[var(--border-subtle)] hover:border-[var(--accent-color)] bg-[var(--bg-secondary)] text-left transition-colors cursor-pointer"
                >
                  <div className="w-full aspect-[3/4] rounded-lg overflow-hidden bg-neutral-900">
                    <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono text-[var(--text-secondary)] line-clamp-1 text-center w-full">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/20 border border-red-500/40 text-red-500 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-lg cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-lg shadow-[var(--accent-color)]/25 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Aplicar y Guardar Foto</span>
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
