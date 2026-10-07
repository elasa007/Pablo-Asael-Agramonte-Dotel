import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Project, 
  AdminUser, 
  SiteProfile, 
  SpecialtyItem, 
  WorkExperience, 
  EducationItem, 
  ReferenceItem,
  SectionVisibility,
  VideoItem,
  DocumentItem
} from '../types/portfolio';
import { ProjectUploader } from './ProjectUploader';
import { EditProjectModal } from './EditProjectModal';
import { EditProfilePhotoModal } from './EditProfilePhotoModal';
import { EditSectionModal } from './EditSectionModal';
import { AddVideoModal } from './AddVideoModal';
import { AddDocumentModal } from './AddDocumentModal';
import { ImageHostingModal } from './ImageHostingModal';
import { SiteContentService } from '../services/siteContentService';
import { StorageService } from '../services/storageService';
import { 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  Eye, 
  Edit, 
  CheckCircle, 
  Database, 
  Layers, 
  HardDrive, 
  LogOut, 
  FolderKanban, 
  Sparkles,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Server,
  Camera,
  Briefcase,
  GraduationCap,
  Sliders,
  EyeOff,
  Layout,
  Search,
  Check,
  UserCheck,
  Film,
  Play,
  FileText,
  Presentation,
  Download,
  FileUp,
  X,
  Cloud,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';

interface AdminPanelProps {
  projects: Project[];
  profile: SiteProfile;
  specialties: SpecialtyItem[];
  videos: VideoItem[];
  documents: DocumentItem[];
  experiences: WorkExperience[];
  education: EducationItem[];
  references?: ReferenceItem[];
  onProjectSaved: (project: Omit<Project, 'id' | 'createdAt'>) => void;
  onProjectUpdate: (id: string, updates: Partial<Project>) => void;
  onProjectDelete: (id: string) => void;
  onVideoSaved: (video: Omit<VideoItem, 'id' | 'createdAt'>, existingId?: string) => void;
  onVideoDelete: (id: string) => void;
  onDocumentSaved: (doc: Omit<DocumentItem, 'id' | 'createdAt'>, existingId?: string) => void;
  onDocumentDelete: (id: string) => void;
  onAddExperience?: () => void;
  onEditExperience?: (exp: WorkExperience) => void;
  onDeleteExperience?: (id: string) => void;
  onAddEducation?: () => void;
  onEditEducation?: (edu: EducationItem) => void;
  onDeleteEducation?: (id: string) => void;
  onAddReference?: () => void;
  onEditReference?: (ref: ReferenceItem) => void;
  onDeleteReference?: (id: string) => void;
  onResetDefaults: () => void;
  onCloseAdmin: () => void;
  onViewProject: (project: Project) => void;
  onPlayVideo: (video: VideoItem) => void;
  onViewDocument: (doc: DocumentItem) => void;
  onOpenArchitectureDocs: () => void;
  onProfileUpdated: (profile: SiteProfile) => void;
  onAuthStatusChange?: (isAuthenticated: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  projects,
  profile,
  specialties,
  videos,
  documents,
  experiences,
  education,
  references = [],
  onProjectSaved,
  onProjectUpdate,
  onProjectDelete,
  onVideoSaved,
  onVideoDelete,
  onDocumentSaved,
  onDocumentDelete,
  onAddExperience,
  onEditExperience,
  onDeleteExperience,
  onAddEducation,
  onEditEducation,
  onDeleteEducation,
  onAddReference,
  onEditReference,
  onDeleteReference,
  onResetDefaults,
  onCloseAdmin,
  onViewProject,
  onPlayVideo,
  onViewDocument,
  onOpenArchitectureDocs,
  onProfileUpdated,
  onAuthStatusChange
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('creativo_admin_auth') === 'true';
  });
  const [emailInput, setEmailInput] = useState('asael.agramonte@gmail.com');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tabs state: 'projects' | 'new_project' | 'videos' | 'documents' | 'sections' | 'profile_photos' | 'experience' | 'storage'
  const [currentTab, setCurrentTab] = useState<'projects' | 'new_project' | 'videos' | 'documents' | 'sections' | 'profile_photos' | 'experience' | 'storage'>('projects');
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);

  // Search & Filter state for projects
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');

  // Modals state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionModalTab, setSectionModalTab] = useState<'hero' | 'specialties' | 'gallery' | 'videos' | 'documents' | 'experience' | 'education' | 'references' | 'contact'>('hero');

  // Section Visibility state
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(() => 
    SiteContentService.getSectionVisibility()
  );

  // In-UI Confirmation states (safe for iframes)
  const [deleteRefConfirmId, setDeleteRefConfirmId] = useState<string | null>(null);
  const [deleteEduConfirmId, setDeleteEduConfirmId] = useState<string | null>(null);
  const [deleteExpConfirmId, setDeleteExpConfirmId] = useState<string | null>(null);

  // Form states for adding new experience
  const [newRole, setNewRole] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newPeriod, setNewPeriod] = useState('2026');
  const [newDesc, setNewDesc] = useState('');

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Por favor ingresa la contraseña.');
      return;
    }

    // Validación estricta: Solo entra si el correo y la contraseña son exactamente estos
    if (emailInput === 'asael.agramonte@gmail.com' && passwordInput === 'PortafoliosAsaelAgramonte**') {
      setIsAuthenticated(true);
      localStorage.setItem('creativo_admin_auth', 'true');
      window.dispatchEvent(new Event('auth-change'));
      onAuthStatusChange?.(true);
      setAuthError(null);
    } else {
      // Mensaje de error genérico para no dar pistas a intrusos
      setAuthError('Usuario o contraseña incorrectos. Acceso denegado.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('creativo_admin_auth');
    window.dispatchEvent(new Event('auth-change'));
    onAuthStatusChange?.(false);
    onCloseAdmin();
  };

  const handleQuickDemoAccess = () => {
    // Bloqueamos el botón de "Acceso Rápido" para que nadie pueda entrar con un clic
    setAuthError('El acceso rápido de demostración ha sido deshabilitado por seguridad.');
  };

  const handleToggleSection = (sectionKey: keyof SectionVisibility) => {
    SiteContentService.toggleSectionVisibility(sectionKey);
    setSectionVisibility(SiteContentService.getSectionVisibility());
  };

  const handleResetSections = () => {
    SiteContentService.resetSectionVisibility();
    setSectionVisibility(SiteContentService.getSectionVisibility());
  };

  const openSectionEditor = (tab: 'hero' | 'specialties' | 'gallery' | 'videos' | 'documents' | 'experience' | 'education' | 'references' | 'contact') => {
    setSectionModalTab(tab);
    setIsSectionModalOpen(true);
  };
  // Add experience handler
  const handleAddExperienceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRole.trim() || !newCompany.trim()) return;

    const descArray = newDesc
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    SiteContentService.addExperience({
      role: newRole.trim(),
      company: newCompany.trim(),
      period: newPeriod.trim(),
      description: descArray.length > 0 ? descArray : ['Funciones de diseño y dirección de arte.']
    });

    setNewRole('');
    setNewCompany('');
    setNewDesc('');
  };

  // 1. Protected Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md p-8 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-2xl shadow-2xl space-y-6"
        >
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h2 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                ACCESO RESTRINGIDO
              </h2>
              <p className="text-xs text-[var(--text-secondary)] font-mono uppercase tracking-wider">
                Panel de Administración · {profile.degreeTitle}
              </p>
            </div>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Solo los usuarios autenticados pueden modificar o borrar secciones, subir videos, gestionar documentos y editar proyectos.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-500/50 rounded-xl text-xs text-red-300 font-mono">
                {authError}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)] uppercase">
                Correo Electrónico
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono text-[var(--text-secondary)] uppercase flex items-center justify-between">
                <span>Contraseña Maestra</span>
                <span className="text-[10px] text-[var(--accent-color)]"></span>
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Ingresa tu contraseña"
                className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg shadow-[var(--accent-color)]/25 flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Iniciar Sesión en el Panel</span>
            </button>
          </form>

          {/* Quick Demo Access Button */}
          <div className="pt-2 border-t border-[var(--border-subtle)]">
            <p className="text-[11px] text-center text-[var(--text-muted)] mt-2">
              Credenciales pre-aprobadas para evaluación de arquitectura
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'Todos' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[var(--bg-primary)] transition-colors duration-300">
      
      {/* Top Banner / Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-8 border-b border-[var(--border-subtle)] gap-6">
        <div>
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] mb-1 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Panel Oficial · {profile.degreeTitle}</span>
          </div>
          <h1 className="font-bebas text-4xl sm:text-5xl lg:text-6xl text-[var(--text-primary)] tracking-wide leading-none">
            PANEL DE ADMINISTRACIÓN
          </h1>
        </div>

        {/* Action Header controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentTab('new_project')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white shadow-lg shadow-[var(--accent-color)]/25 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </button>

          <button
            onClick={onCloseAdmin}
            className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] transition-all cursor-pointer"
          >
            Ver Portafolio Público
          </button>

          <button
            onClick={() => setIsHostingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl transition-colors cursor-pointer text-xs font-mono"
            title="Hosting y Almacenamiento de Imágenes (Cloud Storage)"
          >
            <Cloud className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Hosting Imágenes</span>
          </button>

          <button
            onClick={onOpenArchitectureDocs}
            className="p-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl transition-colors cursor-pointer"
            title="Ver Arquitectura y Base de Datos"
          >
            <Database className="w-4 h-4 text-[var(--accent-color)]" />
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-red-500 rounded-xl transition-colors cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile quick preview banner in Admin */}
      <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-24 rounded-xl overflow-hidden border-2 border-[var(--accent-color)] shrink-0 shadow-md bg-black">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                {profile.degreeTitle}
              </h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-semibold border border-[var(--accent-color)]/20">
                PROPIETARIO
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{profile.roleTitle}</p>
            <p className="text-xs text-[var(--text-muted)] font-mono mt-0.5">{profile.emailPrimary} · {profile.phones[0]}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-[var(--accent-color)] text-xs font-mono text-[var(--text-primary)] rounded-lg transition-all cursor-pointer flex items-center gap-2"
          >
            <Camera className="w-3.5 h-3.5 text-[var(--accent-color)]" />
            <span>Colocar / Cambiar Fotos ({profile.profilePhotos?.length || 1})</span>
          </button>

          <button
            onClick={() => openSectionEditor('hero')}
            className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-xs font-mono text-white rounded-lg transition-all cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Editar Secciones</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation inside Admin */}
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setCurrentTab('projects')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'projects'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Proyectos ({projects.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('videos')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'videos'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Videos & Reels ({videos.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('documents')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'documents'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Presentation className="w-3.5 h-3.5" />
          <span>Diapositivas Corporativas ({documents.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('new_project')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'new_project'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Subir Obra</span>
        </button>

        <button
          onClick={() => setCurrentTab('sections')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'sections'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Layout className="w-3.5 h-3.5" />
          <span>Gestor de Secciones</span>
        </button>

        <button
          onClick={() => setCurrentTab('profile_photos')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'profile_photos'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Fotos de Perfil ({profile.profilePhotos?.length || 1})</span>
        </button>

        <button
          onClick={() => setCurrentTab('experience')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'experience'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Trayectoria & CV ({experiences.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('storage')}
          className={`px-4 py-2 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2 ${
            currentTab === 'storage'
              ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          }`}
        >
          <Cloud className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hosting de Imágenes</span>
        </button>
      </div>

      {/* TAB: HOSTING Y ALMACENAMIENTO DE IMÁGENES */}
      {currentTab === 'storage' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-semibold uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Almacenamiento en la Nube Activo</span>
              </div>
              <h3 className="font-bebas text-3xl sm:text-4xl text-[var(--text-primary)] tracking-wide">
                HOSTING DE IMÁGENES & MEDIA CLOUD
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Conexión directa a Google Cloud Firebase Storage para alojar imágenes de proyectos, carruseles y fotos de perfil con URLs permanentes.
              </p>
            </div>

            <button
              onClick={() => setIsHostingModalOpen(true)}
              className="px-5 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono font-semibold uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md self-start sm:self-auto"
            >
              <Sliders className="w-4 h-4" />
              <span>Configuración y Diagnóstico</span>
            </button>
          </div>

          {/* Hosting Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Firebase Storage */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border-2 border-emerald-500/40 shadow-lg space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Cloud className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                  EN USO
                </span>
              </div>
              <div>
                <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  FIREBASE CLOUD STORAGE
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Bucket oficial de Google Cloud conectado a tu proyecto:
                </p>
                <div className="mt-2 p-2 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-subtle)] font-mono text-[11px] text-emerald-400 truncate">
                  gen-lang-client-0126152032.firebasestorage.app
                </div>
              </div>
              <ul className="text-xs text-[var(--text-muted)] space-y-1.5 pt-2 border-t border-[var(--border-subtle)]">
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Subida directa de archivos binarios (File / Blob)</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Generación de URL pública en firebasestorage.googleapis.com</span>
                </li>
                <li className="flex items-center gap-1.5 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Organizado en carpetas /projects/ y /profile/</span>
                </li>
              </ul>
              <button
                onClick={() => setIsHostingModalOpen(true)}
                className="w-full py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono rounded-lg transition-colors cursor-pointer"
              >
                Ver Reglas de Seguridad & Probar
              </button>
            </div>

            {/* Card 2: Cloudinary Option */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                  <Server className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  DISPONIBLE
                </span>
              </div>
              <div>
                <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  CLOUDINARY CDN
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Hosting CDN global de imágenes con optimizaciones y transformaciones dinámicas.
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Puedes alternar a Cloudinary ingresando tu Cloud Name y Upload Preset unsigned.
              </p>
              <button
                onClick={() => setIsHostingModalOpen(true)}
                className="w-full py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono rounded-lg transition-colors cursor-pointer"
              >
                Configurar Cloudinary
              </button>
            </div>

            {/* Card 3: ImgBB Option */}
            <div className="p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
                  DISPONIBLE
                </span>
              </div>
              <div>
                <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  IMGBB HOSTING
                </h4>
                <p className="text-xs text-[var(--text-secondary)]">
                  Alojamiento rápido y gratuito mediante API Key para enlaces directos.
                </p>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Ideal como respaldo secundario si no deseas usar cuentas de Google Cloud.
              </p>
              <button
                onClick={() => setIsHostingModalOpen(true)}
                className="w-full py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-mono rounded-lg transition-colors cursor-pointer"
              >
                Configurar ImgBB
              </button>
            </div>
          </div>

          {/* Pre-upload Optimization banner */}
          <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[var(--accent-color)]/10 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)] shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)]">
                  Compresor Inteligente Pre-Envío Activado
                </h4>
                <p className="text-xs text-[var(--text-muted)]">
                  Las fotografías seleccionadas se optimizan automáticamente a formato WebP (hasta 2048px) antes de enviarse al hosting. Esto ahorra hasta un 90% de almacenamiento y acelera la carga para clientes.
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsHostingModalOpen(true)}
              className="px-4 py-2 text-xs font-mono bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl text-[var(--text-primary)] cursor-pointer whitespace-nowrap transition-colors"
            >
              Ajustar Resolución
            </button>
          </div>
        </div>
      )}

      {/* TAB: VIDEOS & SHOWREELS */}
      {currentTab === 'videos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                GESTIÓN DE PRODUCCIONES AUDIOVISUALES & VIDEOS
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Agrega y reproduce videos embebidos desde YouTube, Vimeo, Google Drive Video o archivos directos.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingVideo(null);
                setIsVideoModalOpen(true);
              }}
              className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Video (YouTube / Vimeo / Drive)</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((vid) => (
              <div
                key={vid.id}
                className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div 
                    onClick={() => onPlayVideo(vid)}
                    className="relative aspect-video rounded-xl overflow-hidden bg-black cursor-pointer group"
                  >
                    <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono uppercase text-white font-semibold">
                      {vid.platform}
                    </span>
                    {vid.duration && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {vid.duration}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] uppercase font-semibold">
                      {vid.category} · {vid.year || '2026'}
                    </span>
                    <h4 className="font-bebas text-xl text-[var(--text-primary)] tracking-wide line-clamp-1">
                      {vid.title}
                    </h4>
                    {vid.client && (
                      <p className="text-xs text-[var(--text-muted)] font-mono">
                        Cliente: {vid.client}
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => onPlayVideo(vid)}
                    className="text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Probar Visor</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingVideo(vid);
                        setIsVideoModalOpen(true);
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-color)] rounded-lg transition-colors cursor-pointer"
                      title="Editar video"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar el video "${vid.title}"?`)) {
                          onVideoDelete(vid.id);
                        }
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: DOCUMENTOS & PRESENTACIONES */}
      {currentTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                GESTIÓN DE DOCUMENTOS, PRESENTACIONES Y SLIDES
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Sube archivos PDF o PPTX de tu disco local e importa presentaciones y documentos desde Google Drive o Google Slides.
              </p>
            </div>
            <button
              onClick={() => {
                setEditingDocument(null);
                setIsDocumentModalOpen(true);
              }}
              className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md"
            >
              <FileUp className="w-4 h-4" />
              <span>Subir PDF / Importar de Drive</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-secondary)] p-4 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div 
                    onClick={() => onViewDocument(doc)}
                    className="relative aspect-[4/3] rounded-xl overflow-hidden bg-neutral-900 cursor-pointer group"
                  >
                    <img src={doc.thumbnailUrl} alt={doc.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="px-3 py-1.5 rounded-lg bg-[var(--accent-color)] text-white text-xs font-mono flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Abrir Visor</span>
                      </div>
                    </div>
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono uppercase text-white font-semibold">
                      {doc.type === 'google_slides' ? 'Google Slides' : doc.type === 'pptx' ? 'PPTX' : 'PDF'}
                    </span>
                    {doc.pageCount && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-white">
                        {doc.pageCount}
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-[10px] font-mono text-[var(--accent-color)] uppercase font-semibold">
                      {doc.category || 'Diapositivas'} · {doc.year || '2026'}
                    </span>
                    <h4 className="font-bebas text-lg text-[var(--text-primary)] tracking-wide line-clamp-1">
                      {doc.title}
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono">
                      Fuente: {doc.source === 'google_drive' ? 'Google Drive' : doc.source === 'upload' ? 'Carga Local' : 'Enlace'}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                  <button
                    onClick={() => onViewDocument(doc)}
                    className="text-[var(--text-primary)] hover:text-[var(--accent-color)] flex items-center gap-1 cursor-pointer font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>Visualizar</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => {
                        setEditingDocument(doc);
                        setIsDocumentModalOpen(true);
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-color)] rounded-lg transition-colors cursor-pointer"
                      title="Editar documento"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar documento "${doc.title}"?`)) {
                          onDocumentDelete(doc.id);
                        }
                      }}
                      className="p-1.5 text-[var(--text-muted)] hover:text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar documento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1: GESTOR DE PROYECTOS */}
      {currentTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                CATÁLOGO DE OBRAS Y PROYECTOS ({projects.length})
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Gestiona, edita o elimina proyectos en la galería pública en tiempo real.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('new_project')}
              className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Nueva Obra</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Buscar por título, cliente o categoría..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] transition-colors cursor-pointer w-full sm:w-auto"
            >
              <option value="Todos">Todas las Especialidades</option>
              <option value="Social Media">Social Media</option>
              <option value="Editorial">Editorial</option>
              <option value="Fotografía">Fotografía</option>
              <option value="Ilustración">Ilustración</option>
              <option value="Branding">Branding</option>
              <option value="Video">Video</option>
            </select>
          </div>

          {/* Projects Table / Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex flex-col justify-between space-y-4 hover:border-[var(--accent-color)] transition-colors group"
              >
                <div className="space-y-3">
                  <div 
                    onClick={() => onViewProject(project)}
                    className="relative aspect-video rounded-xl overflow-hidden bg-black cursor-pointer"
                  >
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-[var(--accent-color)] font-semibold border border-white/10">
                      {project.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide line-clamp-1">
                      {project.title}
                    </h4>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">
                      {project.description}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] font-mono mt-2">
                      Cliente: {project.client} · {project.year}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
                  <button
                    onClick={() => onViewProject(project)}
                    className="text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--accent-color)] flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProject(project)}
                      className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg transition-colors cursor-pointer flex items-center gap-1 border border-[var(--border-subtle)]"
                      title="Editar proyecto"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Editar</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`¿Eliminar la obra "${project.title}"?`)) {
                          onProjectDelete(project.id);
                        }
                      }}
                      className="p-1.5 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer border border-red-500/20"
                      title="Eliminar proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SUBIR NUEVA OBRA */}
      {currentTab === 'new_project' && (
        <div className="space-y-6">
          <div className="pb-4 border-b border-[var(--border-subtle)]">
            <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
              SUBIDA Y CATALOGACIÓN DE PROYECTO
            </h3>
            <p className="text-xs text-[var(--text-secondary)]">
              Módulo de Carga con previsualización, adjuntos de video y barra de progreso.
            </p>
          </div>

          <ProjectUploader
            onProjectSaved={(newProject) => {
              onProjectSaved(newProject);
              setCurrentTab('projects');
            }}
          />
        </div>
      )}

      {/* TAB: GESTOR DE SECCIONES */}
      {currentTab === 'sections' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                VISIBILIDAD Y CONTROL DE SECCIONES DEL PORTAFOLIO
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Oculta, borra o edita cualquier sección de la vista pública con un solo clic.
              </p>
            </div>
            <button
              onClick={handleResetSections}
              className="px-4 py-2 bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Restaurar Todas las Secciones</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* 1. Portada / Hero */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.hero 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">1. Portada / Hero</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.hero 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.hero ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Titular "{profile.heroHeadlineTop} {profile.heroHeadlineBottom}", foto de perfil flotante y métricas.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('hero')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Textos</span>
                </button>
                <button
                  onClick={() => setIsPhotoModalOpen(true)}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Foto de Perfil</span>
                </button>
                <button
                  onClick={() => handleToggleSection('hero')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.hero
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.hero ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2. Grid de Especialidades */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.specialties 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">2. Especialidades (2x3)</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.specialties 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.specialties ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Tarjetas interactivas de las 6 disciplinas con zoom y brillo al pasar el ratón.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('specialties')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Disciplinas</span>
                </button>
                <button
                  onClick={() => handleToggleSection('specialties')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.specialties
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.specialties ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 2.5 Habilidades & Competencias Técnicas */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.skills !== false
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">Habilidades & Competencias (Skills)</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.skills !== false
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.skills !== false ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Arsenal de software, suites de diseño, audiovisual, gran formato y tecnologías emergentes (14 skills).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('specialties')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Textos</span>
                </button>
                <button
                  onClick={() => handleToggleSection('skills')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.skills !== false
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.skills !== false ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 3. Galería Dinámica */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.gallery 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">3. Galería de Proyectos</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.gallery 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.gallery ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Muro Masonry con {projects.length} obras, filtros por especialidad y visor de proyectos.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('gallery')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Textos</span>
                </button>
                <button
                  onClick={() => setCurrentTab('new_project')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Obra</span>
                </button>
                <button
                  onClick={() => handleToggleSection('gallery')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.gallery
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.gallery ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4. Producción Audiovisual & Videos */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.videos 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">4. Sección Videos & Showreels</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.videos 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.videos ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Showreels cinematográficos y piezas de video ({videos.length}) enlazados desde YouTube, Vimeo y Google Drive.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setCurrentTab('videos')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>Gestionar Videos</span>
                </button>
                <button
                  onClick={() => handleToggleSection('videos')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.videos
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.videos ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 5. Documentos & Presentaciones */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.documents 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">5. Diapositivas Corporativas</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.documents 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.documents ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Presentaciones ejecutivas, pitch decks en Canva, Google Slides y PowerPoint ({documents.length} presentaciones).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => setCurrentTab('documents')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Gestionar Documentos</span>
                </button>
                <button
                  onClick={() => handleToggleSection('documents')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.documents
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.documents ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 6. Trayectoria & Experiencia Laboral */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.experience 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">6. Experiencia Laboral</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.experience 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.experience ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Cargos directivos y desarrollo multimedia en UNICARIBE, World Sign, BanReservas ({experiences.length} cargos).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('experience')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Experiencia</span>
                </button>
                <button
                  onClick={() => handleToggleSection('experience')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.experience
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.experience ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 7. Formación Académica & Especializaciones */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.education 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">7. Formación Académica & Especializaciones</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.education 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.education ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Títulos de grado, diplomados y certificaciones técnicas de Lic. Asael Agramonte ({education.length} programas).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('education')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Formación</span>
                </button>
                <button
                  onClick={() => handleToggleSection('education')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.education
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.education ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 8. Referencias Laborales */}
            <div className={`p-6 rounded-2xl border transition-all ${
              sectionVisibility.references 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">8. Referencias Laborales</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.references 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.references ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Contactos directos de directores y ejecutivos que respaldan la trayectoria profesional ({references.length} referencias).
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('references')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Referencias</span>
                </button>
                <button
                  onClick={() => handleToggleSection('references')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.references
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.references ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 9. Contacto & Coordenadas */}
            <div className={`p-6 rounded-2xl border transition-all md:col-span-2 ${
              sectionVisibility.contact 
                ? 'bg-[var(--bg-card)] border-[var(--border-subtle)] shadow-md' 
                : 'bg-[var(--bg-secondary)]/50 border-dashed border-red-500/30 opacity-75'
            }`}>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[var(--text-primary)]">9. Manifiesto & Coordenadas de Contacto</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      sectionVisibility.contact 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {sectionVisibility.contact ? 'Visible' : 'Oculta / Borrada'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Canales directos: WhatsApp ({profile.socialWhatsapp || "+1 809 709 5650"}), Correo ({profile.emailPrimary}), Teléfonos y Redes.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  onClick={() => openSectionEditor('contact')}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Editar Datos de Contacto & Manifiesto</span>
                </button>

                <button
                  onClick={() => handleToggleSection('contact')}
                  className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1 ml-auto ${
                    sectionVisibility.contact
                      ? 'bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30'
                      : 'bg-emerald-950/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30'
                  }`}
                >
                  {sectionVisibility.contact ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Ocultar / Borrar</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Restaurar en Web</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: FOTOS DE PERFIL */}
      {currentTab === 'profile_photos' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                GALERÍA Y GESTOR DE FOTOS DE PERFIL
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Sube fotos desde tu computadora, selecciona la foto activa para la portada o elimina imágenes antiguas.
              </p>
            </div>
            <button
              onClick={() => setIsPhotoModalOpen(true)}
              className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-2 self-start sm:self-auto shadow-md"
            >
              <Camera className="w-4 h-4" />
              <span>Subir Foto Nueva</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {profile.profilePhotos?.map((photo, i) => {
              const isActive = profile.avatarUrl === photo;
              return (
                <div
                  key={i}
                  className={`relative aspect-[3/4] rounded-2xl overflow-hidden border-2 transition-all group ${
                    isActive 
                      ? 'border-[var(--accent-color)] shadow-xl ring-2 ring-[var(--accent-color)]/30' 
                      : 'border-[var(--border-subtle)] hover:border-[var(--text-secondary)]'
                  }`}
                >
                  <img src={photo} alt="" className="w-full h-full object-cover" />
                  
                  {isActive && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[var(--accent-color)] text-white text-[10px] font-mono uppercase font-bold flex items-center gap-1 shadow">
                      <Check className="w-3 h-3" />
                      <span>Activa</span>
                    </span>
                  )}

                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                    {!isActive && (
                      <button
                        onClick={() => {
                          SiteContentService.setActiveProfilePhoto(photo);
                          onProfileUpdated(SiteContentService.getProfile());
                        }}
                        className="px-3 py-1.5 bg-[var(--accent-color)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer w-full text-center font-semibold"
                      >
                        Establecer Activa
                      </button>
                    )}

                    {profile.profilePhotos.length > 1 && (
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar esta foto de perfil?')) {
                            SiteContentService.deleteProfilePhoto(photo);
                            onProfileUpdated(SiteContentService.getProfile());
                          }
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded-lg transition-colors cursor-pointer w-full text-center flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Eliminar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB: TRAYECTORIA, FORMACIÓN & REFERENCIAS */}
      {currentTab === 'experience' && (
        <div className="space-y-12">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[var(--border-subtle)] gap-4">
            <div>
              <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide">
                CV, TRAYECTORIA, FORMACIÓN & REFERENCIAS
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Agrega, edita y administra cargos laborales, títulos académicos y referencias oficiales de respaldo.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => openSectionEditor('experience')}
                className="px-3.5 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-[var(--border-subtle)]"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Textos Experiencia</span>
              </button>
              <button
                onClick={() => openSectionEditor('education')}
                className="px-3.5 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-[var(--border-subtle)]"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Textos Formación</span>
              </button>
              <button
                onClick={() => openSectionEditor('references')}
                className="px-3.5 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border border-[var(--border-subtle)]"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Textos Referencias</span>
              </button>
            </div>
          </div>

          {/* 1. Experiencia Laboral */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--accent-color)]" />
                <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  1. EXPERIENCIA LABORAL ({experiences.length})
                </h4>
              </div>
            </div>

            {/* Form to add experience */}
            <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl space-y-4">
              <h5 className="font-bebas text-lg text-[var(--text-primary)] tracking-wide flex items-center gap-2">
                <Plus className="w-4 h-4 text-[var(--accent-color)]" />
                <span>Añadir Nueva Posición Laboral</span>
              </h5>

              <form onSubmit={handleAddExperienceSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Puesto (ej. Director Creativo)"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Empresa o Institución (ej. UNICARIBE)"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Período (ej. 2021 – 2026)"
                    value={newPeriod}
                    onChange={(e) => setNewPeriod(e.target.value)}
                    className="px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)]"
                  />
                </div>

                <textarea
                  rows={3}
                  placeholder="Logros y funciones (un logro por línea)..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-color)] resize-none"
                />

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-xl transition-all cursor-pointer font-semibold shadow-sm"
                >
                  Guardar Posición
                </button>
              </form>
            </div>

            {/* List of current experiences */}
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div
                  key={exp.id}
                  className="p-5 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-start justify-between gap-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h5 className="font-bebas text-xl text-[var(--text-primary)] tracking-wide">
                        {exp.role}
                      </h5>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-elevated)] text-[var(--accent-color)] border border-[var(--border-subtle)]">
                        {exp.company}
                      </span>
                      <span className="text-xs font-mono text-[var(--text-muted)]">
                        {exp.period}
                      </span>
                    </div>
                    <ul className="text-xs text-[var(--text-secondary)] space-y-1 list-disc list-inside">
                      {exp.description.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onEditExperience && (
                      <button
                        type="button"
                        onClick={() => onEditExperience(exp)}
                        className="p-2 text-neutral-400 hover:text-[var(--accent-color)] hover:bg-[var(--bg-elevated)] rounded-xl transition-colors cursor-pointer"
                        title="Editar posición"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    {deleteExpConfirmId === exp.id ? (
                      <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded-xl shadow">
                        <span className="text-[10px] font-mono text-red-200 font-bold px-1">¿Borrar?</span>
                        <button
                          type="button"
                          onClick={() => {
                            SiteContentService.deleteExperience(exp.id);
                            onDeleteExperience?.(exp.id);
                            setDeleteExpConfirmId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer transition-colors"
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteExpConfirmId(null)}
                          className="p-0.5 text-neutral-300 hover:text-white rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteExpConfirmId(exp.id)}
                        className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer border border-red-500/20"
                        title="Eliminar posición"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Formación Académica & Especializaciones */}
          <div className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-[var(--accent-color)]" />
                <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  2. FORMACIÓN ACADÉMICA & ESPECIALIZACIONES ({education.length})
                </h4>
              </div>
              {onAddEducation && (
                <button
                  type="button"
                  onClick={onAddEducation}
                  className="px-3.5 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Formación</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {education.map((edu) => (
                <div
                  key={edu.id}
                  className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-semibold block">
                      {edu.category} · {edu.year}
                    </span>
                    <h5 className="font-bebas text-lg text-[var(--text-primary)] tracking-wide leading-tight">
                      {edu.title}
                    </h5>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {edu.institution}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onEditEducation && (
                      <button
                        type="button"
                        onClick={() => onEditEducation(edu)}
                        className="p-1.5 text-neutral-400 hover:text-[var(--accent-color)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                        title="Editar formación"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {deleteEduConfirmId === edu.id ? (
                      <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded-lg shadow">
                        <span className="text-[10px] font-mono text-red-200 font-bold px-1">¿Borrar?</span>
                        <button
                          type="button"
                          onClick={() => {
                            SiteContentService.deleteEducation(edu.id);
                            onDeleteEducation?.(edu.id);
                            setDeleteEduConfirmId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer transition-colors"
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteEduConfirmId(null)}
                          className="p-0.5 text-neutral-300 hover:text-white rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteEduConfirmId(edu.id)}
                        className="p-1.5 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Eliminar formación"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Referencias Laborales */}
          <div className="space-y-6 pt-8 border-t border-[var(--border-subtle)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-[var(--accent-color)]" />
                <h4 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  3. REFERENCIAS LABORALES ({references.length})
                </h4>
              </div>
              {onAddReference && (
                <button
                  type="button"
                  onClick={onAddReference}
                  className="px-3.5 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Referencia</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] flex items-start justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[var(--accent-color)] font-semibold block">
                      {ref.role} · {ref.organization}
                    </span>
                    <h5 className="font-bebas text-lg text-[var(--text-primary)] tracking-wide leading-tight">
                      {ref.name}
                    </h5>
                    <p className="text-xs font-mono text-[var(--text-secondary)]">
                      Tel: {ref.phone}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {onEditReference && (
                      <button
                        type="button"
                        onClick={() => onEditReference(ref)}
                        className="p-1.5 text-neutral-400 hover:text-[var(--accent-color)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                        title="Editar referencia"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {deleteRefConfirmId === ref.id ? (
                      <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/50 p-1 rounded-lg shadow">
                        <span className="text-[10px] font-mono text-red-200 font-bold px-1">¿Borrar?</span>
                        <button
                          type="button"
                          onClick={() => {
                            SiteContentService.deleteReference(ref.id);
                            onDeleteReference?.(ref.id);
                            setDeleteRefConfirmId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer transition-colors"
                        >
                          Sí
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteRefConfirmId(null)}
                          className="p-0.5 text-neutral-300 hover:text-white rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteRefConfirmId(ref.id)}
                        className="p-1.5 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Eliminar referencia"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Edit Project Lightbox Modal */}
      <EditProjectModal
        project={editingProject}
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onSave={(id, updates) => {
          onProjectUpdate(id, updates);
          setEditingProject(null);
        }}
        onDelete={(id) => {
          onProjectDelete(id);
          setEditingProject(null);
        }}
      />

      {/* Profile Photo Modal */}
      <EditProfilePhotoModal
        isOpen={isPhotoModalOpen}
        currentPhoto={profile.avatarUrl}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotoUpdated={(newUrl) => {
          onProfileUpdated(SiteContentService.getProfile());
        }}
      />

      {/* Edit Section Text Modal */}
      <EditSectionModal
        isOpen={isSectionModalOpen}
        profile={profile}
        initialTab={sectionModalTab}
        onClose={() => setIsSectionModalOpen(false)}
        onProfileUpdated={(updated) => onProfileUpdated(updated)}
      />

      {/* Add / Edit Video Modal */}
      <AddVideoModal
        isOpen={isVideoModalOpen}
        videoToEdit={editingVideo}
        onClose={() => {
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
        onSave={(videoData, existingId) => {
          onVideoSaved(videoData, existingId);
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
        onDelete={(id) => {
          onVideoDelete(id);
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
      />

      {/* Add / Edit Document Modal */}
      <AddDocumentModal
        isOpen={isDocumentModalOpen}
        docToEdit={editingDocument}
        onClose={() => {
          setIsDocumentModalOpen(false);
          setEditingDocument(null);
        }}
        onSave={(docData, existingId) => {
          onDocumentSaved(docData, existingId);
          setIsDocumentModalOpen(false);
          setEditingDocument(null);
        }}
        onDelete={(id) => {
          onDocumentDelete(id);
          setIsDocumentModalOpen(false);
          setEditingDocument(null);
        }}
      />

      {/* Image Hosting & Cloud Storage Modal */}
      <ImageHostingModal
        isOpen={isHostingModalOpen}
        onClose={() => setIsHostingModalOpen(false)}
      />
    </div>
  );
};
