import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Copy, Check, FolderTree, Database, Code2, Sparkles, FileText, Server } from 'lucide-react';
import { FIREBASE_SETUP_CODE, GOOGLE_APPS_SCRIPT_CODE } from '../services/firebaseConfig';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NEXTJS_FOLDER_TREE = `
mi-portafolio-creativo/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root Layout (Fuentes Oswald/Inter, Metadata)
│   ├── page.tsx                      # Vista Pública Principal (Hero, Especialidades, Galería, Contacto)
│   ├── globals.css                   # Tailwind CSS v4 (@import "tailwindcss", tokens)
│   ├── admin/                        # Ruta Privada del Panel de Administración
│   │   ├── page.tsx                  # Dashboard y Gestor de Proyectos
│   │   ├── login/                    # Ruta de Autenticación
│   │   │   └── page.tsx              # Formulario Login con Firebase Auth
│   │   └── uploader/                 # Módulo de Subida
│   │       └── page.tsx              # Formulario con Previsualización y Progreso
│   └── api/                          # Endpoints Serverless (Opcional si usas Firebase directo)
│       ├── projects/route.ts         # GET y POST de Proyectos
│       └── ai-assist/route.ts        # Gemini 3.1 & Veo 3.1 proxy
├── components/                       # Componentes Modulares de UI
│   ├── Navbar.tsx                    # Top Bar Contract con botón de acceso
│   ├── HeroSection.tsx               # Titular gigante, foto recortada y botones invertidos
│   ├── SpecialtiesGrid.tsx           # Grid 2x3 con hover zoom y glow effect
│   ├── MasonryGallery.tsx            # Galería mampostería con filtros
│   ├── ProjectModal.tsx              # Lightbox y Ficha de caso de estudio
│   ├── ProjectUploader.tsx           # Formulario de subida y barra de progreso
│   └── ContactSection.tsx            # Formulario de brief para clientes
├── lib/                              # Configuración de Servicios y Base de Datos
│   ├── firebase.ts                   # Inicialización de Auth, Firestore y Storage
│   └── googleAppsScriptApi.ts        # Adaptador para Google Drive y Google Sheets
├── types/                            # Tipos de TypeScript
│   └── portfolio.ts                  # Interfaces de Project, Category, AdminUser
├── public/                           # Assets estáticos y logos
│   ├── favicon.ico
│   └── director-portrait.svg
├── .env.local                        # Claves y variables de entorno
├── next.config.mjs                   # Configuración de Next.js (dominios de imágenes)
├── tailwind.config.ts                # Configuración de Tailwind CSS
├── tsconfig.json                     # Configuración de TypeScript
└── package.json                      # Dependencias
`;

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'paso1' | 'paso2_firebase' | 'paso2_gas'>('paso1');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            key="arch-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="relative w-full max-w-4xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-8 flex flex-col max-h-[88vh] transition-colors duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[var(--accent-color)]" />
              <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                DOCUMENTACIÓN DE ARQUITECTURA & ENTREGABLES
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-x-auto">
            <button
              onClick={() => setActiveTab('paso1')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'paso1'
                  ? 'bg-[var(--accent-color)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              <span>Paso 1: Estructura de Carpetas Next.js</span>
            </button>

            <button
              onClick={() => setActiveTab('paso2_firebase')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'paso2_firebase'
                  ? 'bg-[var(--accent-color)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Paso 2: Firebase (Auth/Firestore/Storage)</span>
            </button>

            <button
              onClick={() => setActiveTab('paso2_gas')}
              className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'paso2_gas'
                  ? 'bg-[var(--accent-color)] text-white font-semibold'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>Paso 2 (Alt): Google Apps Script (Drive/Sheets)</span>
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-[var(--bg-card)]">
            {activeTab === 'paso1' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)] font-bold">
                    Estructura de Directorios Next.js 15 (App Router):
                  </span>
                  <button
                    onClick={() => handleCopy(NEXTJS_FOLDER_TREE, 'tree')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'tree' ? 'Copiado' : 'Copiar Árbol'}</span>
                  </button>
                </div>
                <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] overflow-x-auto leading-relaxed">
                  {NEXTJS_FOLDER_TREE}
                </pre>
              </div>
            )}

            {activeTab === 'paso2_firebase' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)] font-bold">
                    Código de Configuración Firebase (lib/firebase.ts):
                  </span>
                  <button
                    onClick={() => handleCopy(FIREBASE_SETUP_CODE, 'firebase')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'firebase' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'firebase' ? 'Copiado' : 'Copiar Código'}</span>
                  </button>
                </div>
                <p className="text-[var(--text-secondary)] font-sans text-xs">
                  Este módulo exporta los clientes singleton de <code>auth</code> (para el acceso del administrador), <code>db</code> (Firestore para metadatos de proyectos) y <code>storage</code> (para la subida de imágenes y videos).
                </p>
                <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] overflow-x-auto leading-relaxed">
                  {FIREBASE_SETUP_CODE}
                </pre>
              </div>
            )}

            {activeTab === 'paso2_gas' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[var(--text-primary)] font-bold">
                    Script de Google Apps Script (Drive + Google Sheets API):
                  </span>
                  <button
                    onClick={() => handleCopy(GOOGLE_APPS_SCRIPT_CODE, 'gas')}
                    className="flex items-center gap-1.5 px-3 py-1 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded border border-[var(--border-subtle)] transition-colors cursor-pointer"
                  >
                    {copiedKey === 'gas' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'gas' ? 'Copiado' : 'Copiar Script'}</span>
                  </button>
                </div>
                <p className="text-[var(--text-secondary)] font-sans text-xs">
                  Arquitectura 100% serverless gratuita con Google Apps Script: almacena las imágenes en tu carpeta de Google Drive y registra las filas de metadatos en Google Sheets con respuesta en JSON vía HTTP GET y POST.
                </p>
                <pre className="p-4 bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-secondary)] overflow-x-auto leading-relaxed">
                  {GOOGLE_APPS_SCRIPT_CODE}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-mono">
              ASAEL AGRAMONTE · 2026 ARCHITECTURE SPEC
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] text-xs font-mono rounded-lg transition-colors cursor-pointer border border-[var(--border-subtle)]"
            >
              Cerrar
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
