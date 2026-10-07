import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Cloud, 
  HardDrive, 
  Check, 
  Copy, 
  ExternalLink, 
  RefreshCw, 
  AlertCircle, 
  ShieldCheck, 
  UploadCloud, 
  Sliders, 
  Sparkles,
  Server,
  Image as ImageIcon,
  CheckCircle2
} from 'lucide-react';
import { StorageService, StorageSettings, StorageProvider } from '../services/storageService';

interface ImageHostingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImageHostingModal: React.FC<ImageHostingModalProps> = ({
  isOpen,
  onClose
}) => {
  const [settings, setSettings] = useState<StorageSettings>(StorageService.getSettings());
  const [activeTab, setActiveTab] = useState<StorageProvider>('firebase');
  const [copiedRules, setCopiedRules] = useState(false);
  const [copiedTestUrl, setCopiedTestUrl] = useState(false);
  
  // Test upload state
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; url?: string } | null>(null);

  // Cloudinary inputs
  const [cloudinaryName, setCloudinaryName] = useState(settings.cloudinary.cloudName);
  const [cloudinaryPreset, setCloudinaryPreset] = useState(settings.cloudinary.uploadPreset);

  // ImgBB input
  const [imgbbKey, setImgbbKey] = useState(settings.imgbb.apiKey);

  // Optimization toggles
  const [autoCompress, setAutoCompress] = useState(settings.autoCompress);
  const [maxDimension, setMaxDimension] = useState(settings.maxDimension);

  useEffect(() => {
    if (isOpen) {
      const current = StorageService.getSettings();
      setSettings(current);
      setActiveTab(current.provider);
      setCloudinaryName(current.cloudinary.cloudName);
      setCloudinaryPreset(current.cloudinary.uploadPreset);
      setImgbbKey(current.imgbb.apiKey);
      setAutoCompress(current.autoCompress);
      setMaxDimension(current.maxDimension);
      setTestResult(null);
    }
  }, [isOpen]);

  const handleSelectProvider = (provider: StorageProvider) => {
    const updated = StorageService.saveSettings({ provider });
    setSettings(updated);
    setActiveTab(provider);
  };

  const handleSaveCloudinary = () => {
    const updated = StorageService.saveSettings({
      provider: 'cloudinary',
      cloudinary: {
        cloudName: cloudinaryName.trim(),
        uploadPreset: cloudinaryPreset.trim()
      }
    });
    setSettings(updated);
    setTestResult({
      success: true,
      message: 'Configuración de Cloudinary guardada y activada como proveedor principal.'
    });
  };

  const handleSaveImgbb = () => {
    const updated = StorageService.saveSettings({
      provider: 'imgbb',
      imgbb: {
        apiKey: imgbbKey.trim()
      }
    });
    setSettings(updated);
    setTestResult({
      success: true,
      message: 'Configuración de ImgBB guardada y activada como proveedor principal.'
    });
  };

  const handleToggleAutoCompress = (val: boolean) => {
    setAutoCompress(val);
    StorageService.saveSettings({ autoCompress: val });
  };

  const handleDimensionChange = (val: number) => {
    setMaxDimension(val);
    StorageService.saveSettings({ maxDimension: val });
  };

  const handleRunTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await StorageService.testStorage(activeTab);
      setTestResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestResult({
        success: false,
        message: `Error inesperado: ${msg}`
      });
    } finally {
      setIsTesting(false);
    }
  };

  const firebaseRulesSnippet = `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      // Lectura pública y escritura para gestión de contenido
      allow read: if true;
      allow write: if true;
    }
  }
}`;

  const copyRulesToClipboard = () => {
    navigator.clipboard.writeText(firebaseRulesSnippet);
    setCopiedRules(true);
    setTimeout(() => setCopiedRules(false), 2500);
  };

  const copyTestUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedTestUrl(true);
    setTimeout(() => setCopiedTestUrl(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)]">
                <UploadCloud className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  HOSTING & ALMACENAMIENTO DE IMÁGENES
                </h2>
                <p className="text-xs text-[var(--text-secondary)] font-mono">
                  Sube y hospeda imágenes de proyectos, obras y fotos de perfil en la nube
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Provider Status Banner */}
          <div className="px-6 py-3.5 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-[var(--text-muted)] font-mono uppercase text-[11px]">Proveedor Activo:</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {settings.provider === 'firebase' && 'Firebase Cloud Storage (Google Cloud)'}
                {settings.provider === 'cloudinary' && 'Cloudinary Media CDN'}
                {settings.provider === 'imgbb' && 'ImgBB Image Cloud'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunTest}
                disabled={isTesting}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white font-mono text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-50 shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                <span>{isTesting ? 'Probando Conexión...' : 'Probar Subida en la Nube'}</span>
              </button>
            </div>
          </div>

          {/* Test Result Message if any */}
          {testResult && (
            <div className={`px-6 py-3 text-xs border-b ${
              testResult.success
                ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-300'
                : 'bg-rose-950/30 border-rose-800/40 text-rose-300'
            }`}>
              <div className="flex items-start gap-2.5">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1 space-y-1">
                  <p className="font-semibold">{testResult.message}</p>
                  {testResult.url && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="font-mono text-[10px] text-zinc-400 truncate max-w-md">
                        {testResult.url}
                      </span>
                      <button
                        onClick={() => copyTestUrlToClipboard(testResult.url!)}
                        className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-[10px] rounded cursor-pointer transition-colors flex items-center gap-1"
                      >
                        {copiedTestUrl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedTestUrl ? 'Copiada' : 'Copiar URL'}</span>
                      </button>
                      <a
                        href={testResult.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:underline inline-flex items-center gap-0.5 text-[10px]"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tabs selector */}
          <div className="flex border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]/30 px-6 pt-3 gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('firebase')}
              className={`pb-3 px-4 text-xs font-mono border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'firebase'
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)] font-semibold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Cloud className="w-4 h-4" />
              <span>Firebase Cloud Storage</span>
              {settings.provider === 'firebase' && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)]">Activo</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('cloudinary')}
              className={`pb-3 px-4 text-xs font-mono border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'cloudinary'
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)] font-semibold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Server className="w-4 h-4" />
              <span>Cloudinary CDN</span>
              {settings.provider === 'cloudinary' && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)]">Activo</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('imgbb')}
              className={`pb-3 px-4 text-xs font-mono border-b-2 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'imgbb'
                  ? 'border-[var(--accent-color)] text-[var(--accent-color)] font-semibold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>ImgBB API</span>
              {settings.provider === 'imgbb' && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-[var(--accent-color)]/20 text-[var(--accent-color)]">Activo</span>
              )}
            </button>
          </div>

          {/* Tab Content (Scrollable) */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-[var(--text-secondary)]">
            
            {/* TAB 1: Firebase Storage */}
            {activeTab === 'firebase' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Bucket Conectado:</span>
                    <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                      {settings.firebaseBucket}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Ruta de Archivos:</span>
                    <span className="text-xs font-mono text-[var(--text-primary)]">
                      portfolio/projects/ & portfolio/profile/
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[var(--text-muted)]">Integración:</span>
                    <span className="text-xs font-mono text-cyan-400">
                      SDK Oficial Firebase v12 (Directo a Google Cloud)
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>Reglas de Seguridad para Firebase Storage (Storage Rules)</span>
                    </h3>
                    <button
                      onClick={copyRulesToClipboard}
                      className="px-2.5 py-1 text-xs font-mono bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-[var(--text-primary)] transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedRules ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedRules ? 'Copiado al Portapapeles' : 'Copiar Reglas'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Para que las imágenes puedan ser leídas públicamente por los visitantes del portafolio y subidas desde el panel, asegúrate de que tus reglas en <strong>Firebase Console &gt; Storage &gt; Rules</strong> permitan lectura y escritura:
                  </p>
                  <pre className="p-4 bg-zinc-950 text-emerald-300 font-mono text-xs rounded-xl overflow-x-auto border border-zinc-800 leading-relaxed">
                    {firebaseRulesSnippet}
                  </pre>
                </div>

                {settings.provider !== 'firebase' && (
                  <button
                    onClick={() => handleSelectProvider('firebase')}
                    className="w-full py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Establecer Firebase Storage como Hosting Principal</span>
                  </button>
                )}
              </div>
            )}

            {/* TAB 2: Cloudinary */}
            {activeTab === 'cloudinary' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/30 text-xs text-sky-200 space-y-2">
                  <p className="font-semibold flex items-center gap-1.5">
                    <Server className="w-4 h-4" />
                    <span>Hosting Gratuito de Alto Rendimiento en Cloudinary</span>
                  </p>
                  <p className="text-zinc-400">
                    Cloudinary ofrece un CDN global gratuito con 25GB de almacenamiento y transformaciones automáticas a WebP/AVIF.
                    Solo necesitas tu <strong>Cloud Name</strong> y un <strong>Upload Preset (Unsigned)</strong> creado en tu consola de Cloudinary.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Cloud Name
                    </label>
                    <input
                      type="text"
                      value={cloudinaryName}
                      onChange={(e) => setCloudinaryName(e.target.value)}
                      placeholder="ej: mi-portfolio-cloud"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-mono focus:border-[var(--accent-color)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Upload Preset (Sin firmar / Unsigned)
                    </label>
                    <input
                      type="text"
                      value={cloudinaryPreset}
                      onChange={(e) => setCloudinaryPreset(e.target.value)}
                      placeholder="ej: portfolio_unsigned"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-mono focus:border-[var(--accent-color)] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveCloudinary}
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Usar Cloudinary como Hosting</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ImgBB */}
            {activeTab === 'imgbb' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 text-xs text-amber-200 space-y-2">
                  <p className="font-semibold flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4" />
                    <span>Hosting Simple en ImgBB</span>
                  </p>
                  <p className="text-zinc-400">
                    ImgBB permite almacenar imágenes rápidamente con un enlace directo permanente. Solo requieres una clave API gratuita que puedes obtener en <a href="https://api.imgbb.com/" target="_blank" rel="noreferrer" className="text-cyan-400 underline">api.imgbb.com</a>.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      ImgBB API Key
                    </label>
                    <input
                      type="text"
                      value={imgbbKey}
                      onChange={(e) => setImgbbKey(e.target.value)}
                      placeholder="Pega tu clave de API de ImgBB"
                      className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm font-mono focus:border-[var(--accent-color)] focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleSaveImgbb}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Guardar y Usar ImgBB como Hosting</span>
                  </button>
                </div>
              </div>
            )}

            {/* Client-side optimization settings */}
            <div className="pt-6 border-t border-[var(--border-subtle)] space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-primary)] font-semibold flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Optimización Previa al Envío (Ultra Velocidad)</span>
              </h3>

              <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-[var(--text-primary)]">
                      Compresión Inteligente a WebP
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      Comprime fotos de alta resolución en el navegador antes de subirlas al hosting para ahorrar espacio y cargar al instante.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoCompress}
                    onChange={(e) => handleToggleAutoCompress(e.target.checked)}
                    className="w-4 h-4 accent-[var(--accent-color)] rounded cursor-pointer"
                  />
                </div>

                {autoCompress && (
                  <div className="space-y-2 pt-2 border-t border-[var(--border-subtle)]">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">Resolución Máxima:</span>
                      <span className="font-mono text-[var(--text-primary)] font-semibold">{maxDimension}px</span>
                    </div>
                    <div className="flex gap-2">
                      {[1440, 1920, 2048, 2560].map((dim) => (
                        <button
                          key={dim}
                          onClick={() => handleDimensionChange(dim)}
                          className={`flex-1 py-1.5 text-xs font-mono rounded-lg border transition-all cursor-pointer ${
                            maxDimension === dim
                              ? 'bg-[var(--accent-color)] border-[var(--accent-color)] text-white font-semibold'
                              : 'bg-[var(--bg-primary)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {dim}px
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)]/50 flex items-center justify-between">
            <span className="text-[11px] text-[var(--text-muted)] font-mono">
              Las URLs subidas quedan disponibles de forma permanente en la nube
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-mono font-semibold uppercase tracking-wider rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--border-strong)] text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
