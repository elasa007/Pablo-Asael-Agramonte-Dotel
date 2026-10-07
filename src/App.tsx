import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SpecialtiesGrid } from './components/SpecialtiesGrid';
import { MasonryGallery } from './components/MasonryGallery';
import { VideoShowcaseSection } from './components/VideoShowcaseSection';
import { DocumentsSection } from './components/DocumentsSection';
import { WorkExperienceSection } from './components/WorkExperienceSection';
import { EducationSection } from './components/EducationSection';
import { ReferencesSection } from './components/ReferencesSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectModal } from './components/ProjectModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { ArchitectureDocsModal } from './components/ArchitectureDocsModal';
import { EditProfilePhotoModal } from './components/EditProfilePhotoModal';
import { EditSectionModal } from './components/EditSectionModal';
import { EditProjectModal } from './components/EditProjectModal';
import { AddVideoModal } from './components/AddVideoModal';
import { AddDocumentModal } from './components/AddDocumentModal';
import { AddEditExperienceModal } from './components/AddEditExperienceModal';
import { AddEditEducationModal } from './components/AddEditEducationModal';
import { AddEditReferenceModal } from './components/AddEditReferenceModal';
import { AddEditSkillModal } from './components/AddEditSkillModal';
import { ProjectService } from './services/projectService';
import { SiteContentService } from './services/siteContentService';
import { 
  Project, 
  SpecialtyCategory, 
  SiteProfile, 
  WorkExperience, 
  EducationItem, 
  ReferenceItem,
  SpecialtyItem, 
  SectionVisibility,
  VideoItem,
  DocumentItem,
  SkillItem
} from './types/portfolio';
import { Lock, ArrowUp, Eye, Sparkles } from 'lucide-react';
import { useAuth } from './context/AuthContext';
import { testConnection } from './firebase';

function PortfolioApp() {
  const [currentView, setCurrentView] = useState<'portfolio' | 'admin'>('portfolio');
  const [projects, setProjects] = useState<Project[]>(() => ProjectService.getProjects());
  const [videos, setVideos] = useState<VideoItem[]>(() => SiteContentService.getVideos());
  const [documents, setDocuments] = useState<DocumentItem[]>(() => SiteContentService.getDocuments());
  const [selectedCategory, setSelectedCategory] = useState<SpecialtyCategory | 'Todos'>('Todos');
  
  // Modals for viewer lightboxes
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);
  const [activeModalVideo, setActiveModalVideo] = useState<VideoItem | null>(null);
  const [activeModalDocument, setActiveModalDocument] = useState<DocumentItem | null>(null);

  // Modals for editing / uploading (Admin only)
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState<DocumentItem | null>(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<EducationItem | null>(null);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [editingReference, setEditingReference] = useState<ReferenceItem | null>(null);
  const [isReferenceModalOpen, setIsReferenceModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isArchitectureModalOpen, setIsArchitectureModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [sectionModalTab, setSectionModalTab] = useState<'hero' | 'specialties' | 'gallery' | 'videos' | 'documents' | 'experience' | 'education' | 'references' | 'contact'>('hero');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Dynamic Site Profile, Resume data & Section Visibility from SiteContentService
  const [profile, setProfile] = useState<SiteProfile>(() => SiteContentService.getProfile());
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>(() => SiteContentService.getSpecialties());
  const [skills, setSkills] = useState<SkillItem[]>(() => SiteContentService.getSkills());
  const [experiences, setExperiences] = useState<WorkExperience[]>(() => SiteContentService.getExperiences());
  const [education, setEducation] = useState<EducationItem[]>(() => SiteContentService.getEducation());
  const [references, setReferences] = useState<ReferenceItem[]>(() => SiteContentService.getReferences());
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibility>(() => 
    SiteContentService.getSectionVisibility()
  );

  const { currentUser, isAdmin: authIsAdmin } = useAuth();
  const [localAdmin, setLocalAdmin] = useState<boolean>(() => {
    return localStorage.getItem('creativo_admin_auth') === 'true';
  });

  const isAdmin = Boolean(authIsAdmin || localAdmin);

  // Test Firestore connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Sync auth state immediately on login/logout
  useEffect(() => {
    const handleAuthChange = () => {
      setLocalAdmin(localStorage.getItem('creativo_admin_auth') === 'true');
    };
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    return () => {
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Subscribe to ProjectService and SiteContentService reactive updates
  useEffect(() => {
    const unsubProjects = ProjectService.subscribe((updatedProjects) => {
      setProjects([...updatedProjects]);
    });
    const unsubSite = SiteContentService.subscribe(() => {
      setProfile(SiteContentService.getProfile());
      setSpecialties(SiteContentService.getSpecialties());
      setSkills(SiteContentService.getSkills());
      setVideos(SiteContentService.getVideos());
      setDocuments(SiteContentService.getDocuments());
      setExperiences(SiteContentService.getExperiences());
      setEducation(SiteContentService.getEducation());
      setReferences(SiteContentService.getReferences());
      setSectionVisibility(SiteContentService.getSectionVisibility());
    });
    return () => {
      unsubProjects();
      unsubSite();
    };
  }, []);

  // Monitor scroll for top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Project Actions
  const handleProjectSaved = (newProjectData: Omit<Project, 'id' | 'createdAt'>) => {
    ProjectService.addProject(newProjectData);
    setProjects(ProjectService.getProjects());
  };

  const handleProjectUpdate = (id: string, updates: Partial<Project>) => {
    ProjectService.updateProject(id, updates);
    setProjects(ProjectService.getProjects());
  };

  const handleProjectDelete = (id: string) => {
    ProjectService.deleteProject(id);
    setProjects(ProjectService.getProjects());
  };

  // Video Actions
  const handleVideoSaved = (videoData: Omit<VideoItem, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      SiteContentService.updateVideo(existingId, videoData);
    } else {
      SiteContentService.addVideo(videoData);
    }
    setVideos(SiteContentService.getVideos());
  };

  const handleVideoDelete = (id: string) => {
    SiteContentService.deleteVideo(id);
    setVideos(SiteContentService.getVideos());
  };

  // Document Actions
  const handleDocumentSaved = (docData: Omit<DocumentItem, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      SiteContentService.updateDocument(existingId, docData);
    } else {
      SiteContentService.addDocument(docData);
    }
    setDocuments(SiteContentService.getDocuments());
  };

  const handleDocumentDelete = (id: string) => {
    SiteContentService.deleteDocument(id);
    setDocuments(SiteContentService.getDocuments());
  };

  // Experience Actions
  const handleExperienceSaved = (expData: Omit<WorkExperience, 'id'>, existingId?: string) => {
    if (existingId) {
      SiteContentService.updateExperience(existingId, expData);
    } else {
      SiteContentService.addExperience(expData);
    }
    setExperiences(SiteContentService.getExperiences());
  };

  const handleExperienceDelete = (id: string) => {
    SiteContentService.deleteExperience(id);
    setExperiences(SiteContentService.getExperiences());
  };

  // Education Actions
  const handleEducationSaved = (eduData: Omit<EducationItem, 'id'>, existingId?: string) => {
    if (existingId) {
      SiteContentService.updateEducation(existingId, eduData);
    } else {
      SiteContentService.addEducation(eduData);
    }
    setEducation(SiteContentService.getEducation());
  };

  const handleEducationDelete = (id: string) => {
    SiteContentService.deleteEducation(id);
    setEducation(SiteContentService.getEducation());
  };

  // Reference Actions
  const handleReferenceSaved = (refData: Omit<ReferenceItem, 'id'>, existingId?: string) => {
    if (existingId) {
      SiteContentService.updateReference(existingId, refData);
    } else {
      SiteContentService.addReference(refData);
    }
    setReferences(SiteContentService.getReferences());
  };

  const handleReferenceDelete = (id: string) => {
    SiteContentService.deleteReference(id);
    setReferences(SiteContentService.getReferences());
  };

  // Skills Actions
  const handleSkillSaved = (skillData: Omit<SkillItem, 'id'>, existingId?: string) => {
    if (existingId) {
      SiteContentService.updateSkill(existingId, skillData);
    } else {
      SiteContentService.addSkill(skillData);
    }
    setSkills(SiteContentService.getSkills());
  };

  const handleSkillDelete = (id: string) => {
    SiteContentService.deleteSkill(id);
    setSkills(SiteContentService.getSkills());
  };

  const handleResetDefaults = async () => {
    const reset = await ProjectService.resetToDefaults();
    setProjects([...reset]);
    await SiteContentService.resetAllToDefaults();
  };

  const handleToggleSection = (key: keyof SectionVisibility) => {
    SiteContentService.toggleSectionVisibility(key);
    setSectionVisibility(SiteContentService.getSectionVisibility());
  };

  const openSectionModalWithTab = (tab: 'hero' | 'specialties' | 'gallery' | 'videos' | 'documents' | 'experience' | 'education' | 'references' | 'contact') => {
    setSectionModalTab(tab);
    setIsSectionModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    setCurrentView('portfolio');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleSpecialtyClick = (category: SpecialtyCategory) => {
    setSelectedCategory(category);
    scrollToSection('galeria');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans selection:bg-[var(--accent-color)] selection:text-white transition-colors duration-300">
      {/* Top Bar Navigation with Theme Switcher & Auth State */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isAdminAuthenticated={isAdmin}
        onOpenArchitectureDocs={() => setIsArchitectureModalOpen(true)}
        sectionVisibility={sectionVisibility}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'portfolio' ? (
          <>
            {/* 1. Hero Section with dynamic Profile Photo & Texts */}
            {sectionVisibility.hero ? (
              <HeroSection
                profile={profile}
                isAdmin={isAdmin}
                onExploreProjects={() => scrollToSection('galeria')}
                onContactClick={() => scrollToSection('contacto')}
                onChangeProfilePhoto={() => setIsPhotoModalOpen(true)}
                onSelectProfilePhoto={(photoUrl) => {
                  SiteContentService.setActiveProfilePhoto(photoUrl);
                  setProfile(prev => ({ ...prev, avatarUrl: photoUrl }));
                }}
                onEditSection={() => openSectionModalWithTab('hero')}
                onDeleteSection={() => handleToggleSection('hero')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Portada / Hero oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('hero')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Portada</span>
                </button>
              </div>
            ) : null}

            {/* 2. Grid de Especialidades (2x3 con datos reactivos y edición) */}
            {sectionVisibility.specialties ? (
              <SpecialtiesGrid 
                specialties={specialties}
                isAdmin={isAdmin}
                title={profile.specialtiesTitle || "ESPECIALIDADES"}
                subtitle={profile.specialtiesSubtitle || "Seis disciplinas articuladas bajo la dirección de arte de Asael Agramonte, combinando sensibilidad plástica con tecnología y pensamiento estratégico."}
                onSelectCategory={handleSpecialtyClick}
                onEditSpecialty={() => openSectionModalWithTab('specialties')}
                onDeleteSpecialty={(id) => SiteContentService.deleteSpecialty(id)}
                onAddSpecialty={() => openSectionModalWithTab('specialties')}
                onEditSection={() => openSectionModalWithTab('specialties')}
                onDeleteSection={() => handleToggleSection('specialties')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Especialidades oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('specialties')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Especialidades</span>
                </button>
              </div>
            ) : null}

            {/* 3. Habilidades & Competencias Técnicas */}
            {sectionVisibility.skills !== false ? (
              <SkillsSection
                skills={skills}
                isAdmin={isAdmin}
                title={profile.skillsTitle || "HABILIDADES & COMPETENCIAS TÉCNICAS"}
                subtitle={profile.skillsSubtitle || "Dominio integral de suites de diseño, postproducción cinematográfica, pre-prensa, gran formato y tecnologías emergentes."}
                onAddSkill={() => {
                  setEditingSkill(null);
                  setIsSkillModalOpen(true);
                }}
                onEditSkill={(skill) => {
                  setEditingSkill(skill);
                  setIsSkillModalOpen(true);
                }}
                onDeleteSkill={handleSkillDelete}
                onEditSection={() => openSectionModalWithTab('specialties')}
                onDeleteSection={() => handleToggleSection('skills')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Habilidades & Competencias Técnicas oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('skills')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Competencias</span>
                </button>
              </div>
            ) : null}

            {/* 4. Galería Dinámica Masonry con controles directos */}
            {sectionVisibility.gallery ? (
              <MasonryGallery
                projects={projects}
                selectedCategory={selectedCategory}
                isAdmin={isAdmin}
                title={profile.galleryTitle || "GALERÍA DINÁMICA"}
                subtitle={profile.gallerySubtitle || "Curaduría de proyectos de Asael Agramonte gestionados en tiempo real. Haz clic en cualquier pieza para examinar el caso de estudio y la ficha técnica."}
                onCategoryChange={setSelectedCategory}
                onProjectClick={(project) => setActiveModalProject(project)}
                onEditProject={(project) => setEditingProject(project)}
                onDeleteProject={handleProjectDelete}
                onAddProject={() => setCurrentView('admin')}
                onEditSection={() => openSectionModalWithTab('gallery')}
                onDeleteSection={() => handleToggleSection('gallery')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Galería de Proyectos oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('gallery')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Galería</span>
                </button>
              </div>
            ) : null}

            {/* 4. Producción Audiovisual & Videos de YouTube / Vimeo / Drive */}
            {sectionVisibility.videos ? (
              <VideoShowcaseSection
                videos={videos}
                isAdmin={isAdmin}
                title={profile.videosTitle || "PRODUCCIÓN AUDIOVISUAL & SHOWREELS"}
                subtitle={profile.videosSubtitle || "Dirección cinematográfica, edición de video, motion graphics y diseño sonoro. Proyectos transmitidos e integrados desde YouTube, Vimeo y Google Drive."}
                onPlayVideo={(v) => setActiveModalVideo(v)}
                onAddVideo={() => {
                  setEditingVideo(null);
                  setIsVideoModalOpen(true);
                }}
                onEditVideo={(v) => {
                  setEditingVideo(v);
                  setIsVideoModalOpen(true);
                }}
                onDeleteVideo={handleVideoDelete}
                onEditSection={() => openSectionModalWithTab('videos')}
                onDeleteSection={() => handleToggleSection('videos')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Videos oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('videos')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Videos</span>
                </button>
              </div>
            ) : null}

            {/* 5. Diapositivas Corporativas & Decks (Canva, Google Slides, PowerPoint, PDF) */}
            {sectionVisibility.documents ? (
              <DocumentsSection
                documents={documents}
                isAdmin={isAdmin}
                title={profile.documentsTitle || "DIAPOSITIVAS CORPORATIVAS"}
                subtitle={profile.documentsSubtitle || "Presentaciones estratégicas, pitch decks corporativos, slides comerciales y reportes ejecutivos en formatos interactivos (Canva, Google Slides, PowerPoint y PDF)."}
                kicker={profile.documentsKicker || "DIAPOSITIVAS & DECKS CORPORATIVOS"}
                onViewDocument={(d) => setActiveModalDocument(d)}
                onAddDocument={() => {
                  setEditingDocument(null);
                  setIsDocumentModalOpen(true);
                }}
                onEditDocument={(d) => {
                  setEditingDocument(d);
                  setIsDocumentModalOpen(true);
                }}
                onDeleteDocument={handleDocumentDelete}
                onEditSection={() => openSectionModalWithTab('documents')}
                onDeleteSection={() => handleToggleSection('documents')}
                onSaveTitles={(newTitle, newSubtitle, newKicker) => {
                  const updated = SiteContentService.updateProfile({
                    documentsTitle: newTitle,
                    documentsSubtitle: newSubtitle,
                    documentsKicker: newKicker
                  });
                  setProfile(updated);
                }}
                onViewInGallery={() => {
                  setSelectedCategory('Diapositivas');
                  scrollToSection('galeria');
                }}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Diapositivas Corporativas oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('documents')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Diapositivas</span>
                </button>
              </div>
            ) : null}

            {/* 6. Trayectoria & Experiencia Laboral */}
            {sectionVisibility.experience ? (
              <WorkExperienceSection
                experiences={experiences}
                isAdmin={isAdmin}
                title={profile.experienceTitle || "TRAYECTORIA & EXPERIENCIA LABORAL"}
                subtitle={profile.experienceSubtitle || "Cargos directivos y de desarrollo multimedia en UNICARIBE, World Sign, BanReservas e instituciones de prestigio."}
                onAddExperience={() => {
                  setEditingExperience(null);
                  setIsExperienceModalOpen(true);
                }}
                onEditExperience={(exp) => {
                  setEditingExperience(exp);
                  setIsExperienceModalOpen(true);
                }}
                onDeleteExperience={handleExperienceDelete}
                onEditSection={() => openSectionModalWithTab('experience')}
                onDeleteSection={() => handleToggleSection('experience')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Experiencia Laboral oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('experience')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Experiencia</span>
                </button>
              </div>
            ) : null}

            {/* 7. Formación Académica & Especializaciones */}
            {sectionVisibility.education ? (
              <EducationSection
                education={education}
                isAdmin={isAdmin}
                title={profile.educationTitle || "FORMACIÓN ACADÉMICA & ESPECIALIZACIONES"}
                subtitle={profile.educationSubtitle || "Títulos de grado, diplomados y certificaciones técnicas de Lic. Asael Agramonte en publicidad, desarrollo web, diseño audiovisual y docencia virtual."}
                onAddEducation={() => {
                  setEditingEducation(null);
                  setIsEducationModalOpen(true);
                }}
                onEditEducation={(edu) => {
                  setEditingEducation(edu);
                  setIsEducationModalOpen(true);
                }}
                onDeleteEducation={handleEducationDelete}
                onEditSection={() => openSectionModalWithTab('education')}
                onDeleteSection={() => handleToggleSection('education')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Formación Académica & Especializaciones oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('education')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Formación</span>
                </button>
              </div>
            ) : null}

            {/* 8. Referencias Laborales */}
            {sectionVisibility.references ? (
              <ReferencesSection
                references={references}
                isAdmin={isAdmin}
                title={profile.referencesTitle || "REFERENCIAS LABORALES"}
                subtitle={profile.referencesSubtitle || "Contactos directos de directores de operaciones, coordinadores y ejecutivos institucionales que respaldan la trayectoria profesional de Lic. Asael Agramonte."}
                onAddReference={() => {
                  setEditingReference(null);
                  setIsReferenceModalOpen(true);
                }}
                onEditReference={(ref) => {
                  setEditingReference(ref);
                  setIsReferenceModalOpen(true);
                }}
                onDeleteReference={handleReferenceDelete}
                onEditSection={() => openSectionModalWithTab('references')}
                onDeleteSection={() => handleToggleSection('references')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Referencias Laborales oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('references')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Referencias</span>
                </button>
              </div>
            ) : null}

            {/* 9. Manifiesto & Coordenadas de Contacto Directo */}
            {sectionVisibility.contact ? (
              <ContactSection 
                profile={profile}
                isAdmin={isAdmin}
                onEditSection={() => openSectionModalWithTab('contact')}
                onDeleteSection={() => handleToggleSection('contact')}
              />
            ) : isAdmin ? (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 my-4 bg-red-950/20 border border-dashed border-red-500/40 rounded-xl flex items-center justify-between">
                <span className="text-xs font-mono text-red-400">
                  🚫 Sección Contacto & Manifiesto oculta/borrada de la vista pública
                </span>
                <button
                  onClick={() => handleToggleSection('contact')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono rounded flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Restaurar Contacto</span>
                </button>
              </div>
            ) : null}
          </>
        ) : (
          /* Private Admin Panel with Full Edit, Video, Document & Section Controls */
          <AdminPanel
            projects={projects}
            profile={profile}
            specialties={specialties}
            videos={videos}
            documents={documents}
            experiences={experiences}
            education={education}
            references={references}
            onProjectSaved={handleProjectSaved}
            onProjectUpdate={handleProjectUpdate}
            onProjectDelete={handleProjectDelete}
            onVideoSaved={handleVideoSaved}
            onVideoDelete={handleVideoDelete}
            onDocumentSaved={handleDocumentSaved}
            onDocumentDelete={handleDocumentDelete}
            onAddExperience={() => {
              setEditingExperience(null);
              setIsExperienceModalOpen(true);
            }}
            onEditExperience={(exp) => {
              setEditingExperience(exp);
              setIsExperienceModalOpen(true);
            }}
            onDeleteExperience={handleExperienceDelete}
            onAddEducation={() => {
              setEditingEducation(null);
              setIsEducationModalOpen(true);
            }}
            onEditEducation={(edu) => {
              setEditingEducation(edu);
              setIsEducationModalOpen(true);
            }}
            onDeleteEducation={handleEducationDelete}
            onAddReference={() => {
              setEditingReference(null);
              setIsReferenceModalOpen(true);
            }}
            onEditReference={(ref) => {
              setEditingReference(ref);
              setIsReferenceModalOpen(true);
            }}
            onDeleteReference={handleReferenceDelete}
            onResetDefaults={handleResetDefaults}
            onCloseAdmin={() => setCurrentView('portfolio')}
            onViewProject={(p) => setActiveModalProject(p)}
            onPlayVideo={(v) => setActiveModalVideo(v)}
            onViewDocument={(d) => setActiveModalDocument(d)}
            onOpenArchitectureDocs={() => setIsArchitectureModalOpen(true)}
            onProfileUpdated={(updatedProfile) => setProfile(updatedProfile)}
            onAuthStatusChange={(status) => setLocalAdmin(status)}
          />
        )}
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] py-12 text-[var(--text-secondary)] text-xs transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bebas text-xl text-[var(--text-primary)] tracking-wider">{profile.degreeTitle}</span>
            <span className="text-neutral-500">·</span>
            <span>{profile.roleTitle} © {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href={`mailto:${profile.emailPrimary}`}
              className="hover:text-[var(--text-primary)] transition-colors"
            >
              {profile.emailPrimary}
            </a>
            <span className="text-neutral-400">/</span>
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="hover:text-[var(--text-primary)] transition-colors cursor-pointer"
            >
              Arquitectura Next.js & DB
            </button>
            <span className="text-neutral-400">/</span>
            <button
              onClick={() => setCurrentView(currentView === 'portfolio' ? 'admin' : 'portfolio')}
              className="hover:text-[var(--accent-color)] transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Lock className="w-3 h-3 text-[var(--accent-color)]" />
              <span>{currentView === 'portfolio' ? (isAdmin ? 'Dashboard Admin' : 'Acceso Admin') : 'Volver a Portafolio'}</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Project Lightbox Modal */}
      <ProjectModal
        project={activeModalProject}
        onClose={() => setActiveModalProject(null)}
      />

      {/* Cinema-Mode Video Modal Player (YouTube, Vimeo, Google Drive, MP4) */}
      <VideoPlayerModal
        video={activeModalVideo}
        onClose={() => setActiveModalVideo(null)}
      />

      {/* Interactive Document & Presentation Viewer Modal (PDF, PPTX, Google Slides) */}
      <DocumentViewerModal
        document={activeModalDocument}
        onClose={() => setActiveModalDocument(null)}
      />

      {/* Edit Project Modal (for editing projects from frontend or admin) */}
      <EditProjectModal
        project={editingProject}
        isOpen={Boolean(editingProject)}
        onClose={() => setEditingProject(null)}
        onSave={handleProjectUpdate}
        onDelete={handleProjectDelete}
      />

      {/* Add / Edit Video Modal (Admin) */}
      <AddVideoModal
        isOpen={isVideoModalOpen}
        videoToEdit={editingVideo}
        onClose={() => {
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
        onSave={(videoData, existingId) => {
          handleVideoSaved(videoData, existingId);
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
        onDelete={(id) => {
          handleVideoDelete(id);
          setIsVideoModalOpen(false);
          setEditingVideo(null);
        }}
      />

      {/* Add / Edit Document Modal (Admin) */}
      <AddDocumentModal
        isOpen={isDocumentModalOpen}
        docToEdit={editingDocument}
        onClose={() => {
          setIsDocumentModalOpen(false);
          setEditingDocument(null);
        }}
        onSave={(docData, existingId) => {
          handleDocumentSaved(docData, existingId);
          setIsDocumentModalOpen(false);
          setEditingDocument(null);
        }}
        onDelete={(id) => {
          handleDocumentDelete(id);
          setIsDocumentModalOpen(false);
          setEditingDocument(null);
        }}
      />

      {/* Add / Edit Work Experience Modal (Admin) */}
      <AddEditExperienceModal
        isOpen={isExperienceModalOpen}
        experienceToEdit={editingExperience}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleExperienceSaved}
        onDelete={handleExperienceDelete}
      />

      {/* Add / Edit Education Modal (Admin) */}
      <AddEditEducationModal
        isOpen={isEducationModalOpen}
        educationToEdit={editingEducation}
        onClose={() => {
          setIsEducationModalOpen(false);
          setEditingEducation(null);
        }}
        onSave={handleEducationSaved}
        onDelete={handleEducationDelete}
      />

      {/* Add / Edit Reference Modal (Admin) */}
      <AddEditReferenceModal
        isOpen={isReferenceModalOpen}
        referenceToEdit={editingReference}
        onClose={() => {
          setIsReferenceModalOpen(false);
          setEditingReference(null);
        }}
        onSave={handleReferenceSaved}
        onDelete={handleReferenceDelete}
      />

      {/* Add / Edit Skill Modal (Admin) */}
      <AddEditSkillModal
        isOpen={isSkillModalOpen}
        skillToEdit={editingSkill}
        onClose={() => {
          setIsSkillModalOpen(false);
          setEditingSkill(null);
        }}
        onSave={handleSkillSaved}
        onDelete={handleSkillDelete}
      />

      {/* Architecture & Database Documentation Modal */}
      <ArchitectureDocsModal
        isOpen={isArchitectureModalOpen}
        onClose={() => setIsArchitectureModalOpen(false)}
      />

      {/* Profile Photo Upload Modal */}
      <EditProfilePhotoModal
        isOpen={isPhotoModalOpen}
        currentPhoto={profile.avatarUrl}
        onClose={() => setIsPhotoModalOpen(false)}
        onPhotoUpdated={(newUrl) => {
          setProfile(SiteContentService.getProfile());
        }}
      />

      {/* Section Text & Info Editor Modal */}
      <EditSectionModal
        isOpen={isSectionModalOpen}
        profile={profile}
        initialTab={sectionModalTab}
        onClose={() => setIsSectionModalOpen(false)}
        onProfileUpdated={(updated) => setProfile(updated)}
      />

      {/* Floating Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-[var(--text-primary)] border border-[var(--border-subtle)] transition-all shadow-xl z-40 cursor-pointer"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioApp />
    </ThemeProvider>
  );
}
