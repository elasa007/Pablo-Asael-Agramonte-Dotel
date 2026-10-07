import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  Edit3, 
  Sliders, 
  Sparkles, 
  Building, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2, 
  Plus, 
  Layers, 
  Image as ImageIcon, 
  Briefcase, 
  GraduationCap,
  UserCheck
} from 'lucide-react';
import { SiteProfile, SpecialtyItem, WorkExperience, EducationItem, ReferenceItem } from '../types/portfolio';
import { SiteContentService } from '../services/siteContentService';

interface EditSectionModalProps {
  isOpen: boolean;
  profile: SiteProfile;
  initialTab?: 'hero' | 'specialties' | 'gallery' | 'videos' | 'documents' | 'experience' | 'education' | 'references' | 'contact';
  onClose: () => void;
  onProfileUpdated: (profile: SiteProfile) => void;
}

export const EditSectionModal: React.FC<EditSectionModalProps> = ({
  isOpen,
  profile,
  initialTab = 'hero',
  onClose,
  onProfileUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'specialties' | 'gallery' | 'videos' | 'documents' | 'experience' | 'education' | 'references' | 'contact'>(initialTab);
  const [formData, setFormData] = useState<SiteProfile>({ ...profile });
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>(() => SiteContentService.getSpecialties());
  const [experiences, setExperiences] = useState<WorkExperience[]>(() => SiteContentService.getExperiences());
  const [education, setEducation] = useState<EducationItem[]>(() => SiteContentService.getEducation());
  const [references, setReferences] = useState<ReferenceItem[]>(() => SiteContentService.getReferences());

  // Synchronize state when modal opens or initialTab/profile changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setFormData({ ...profile });
      setSpecialties(SiteContentService.getSpecialties());
      setExperiences(SiteContentService.getExperiences());
      setEducation(SiteContentService.getEducation());
      setReferences(SiteContentService.getReferences());
    }
  }, [isOpen, initialTab, profile]);

  // Form states for creating new items inside modal
  const [isAddingSpecialty, setIsAddingSpecialty] = useState(false);
  const [newSpecTitle, setNewSpecTitle] = useState('');
  const [newSpecSubtitle, setNewSpecSubtitle] = useState('');
  const [newSpecTagline, setNewSpecTagline] = useState('');
  const [newSpecDesc, setNewSpecDesc] = useState('');
  const [newSpecImage, setNewSpecImage] = useState('https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80');

  const [isAddingEducation, setIsAddingEducation] = useState(false);
  const [newEduTitle, setNewEduTitle] = useState('');
  const [newEduInstitution, setNewEduInstitution] = useState('');
  const [newEduYear, setNewEduYear] = useState('2025');
  const [newEduCategory, setNewEduCategory] = useState('Educación Superior e Idiomas');

  const [isAddingReference, setIsAddingReference] = useState(false);
  const [newRefName, setNewRefName] = useState('');
  const [newRefRole, setNewRefRole] = useState('');
  const [newRefOrg, setNewRefOrg] = useState('');
  const [newRefPhone, setNewRefPhone] = useState('');

  const handleChange = (field: keyof SiteProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (index: number, val: string) => {
    const phones = [...formData.phones];
    phones[index] = val;
    setFormData(prev => ({ ...prev, phones }));
  };

  const handleAddPhone = () => {
    setFormData(prev => ({ ...prev, phones: [...prev.phones, ""] }));
  };

  const handleRemovePhone = (index: number) => {
    setFormData(prev => ({ ...prev, phones: prev.phones.filter((_, i) => i !== index) }));
  };

  // Specialties CRUD in modal
  const handleSpecialtyChange = (id: string, field: keyof SpecialtyItem, val: string) => {
    setSpecialties(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
  };

  const handleDeleteSpecialty = (id: string) => {
    setSpecialties(prev => prev.filter(s => s.id !== id));
  };

  const handleCreateSpecialty = () => {
    if (!newSpecTitle.trim()) return;
    const newSpec: SpecialtyItem = {
      id: 'spec_' + Date.now().toString(36),
      title: newSpecTitle.trim(),
      subtitle: newSpecSubtitle.trim() || newSpecTitle.trim(),
      tagline: newSpecTagline.trim() || 'DISCIPLINA MULTIMEDIA',
      description: newSpecDesc.trim() || 'Desarrollo de proyectos creativos de alta gama.',
      image: newSpecImage.trim(),
      accentColor: '#E53935'
    };
    setSpecialties(prev => [...prev, newSpec]);
    setIsAddingSpecialty(false);
    setNewSpecTitle('');
    setNewSpecSubtitle('');
    setNewSpecTagline('');
    setNewSpecDesc('');
  };

  // Experiences CRUD in modal
  const handleExperienceChange = (id: string, field: keyof WorkExperience, val: any) => {
    setExperiences(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => String(e.id) !== String(id)));
    SiteContentService.deleteExperience(id);
  };

  // Education CRUD in modal
  const handleEducationChange = (id: string, field: keyof EducationItem, val: any) => {
    setEducation(prev => prev.map(e => e.id === id ? { ...e, [field]: val } : e));
  };

  const handleDeleteEducation = (id: string) => {
    setEducation(prev => prev.filter(e => String(e.id) !== String(id)));
    SiteContentService.deleteEducation(id);
  };

  const handleCreateEducation = () => {
    if (!newEduTitle.trim() || !newEduInstitution.trim()) return;
    const newItem: EducationItem = {
      id: 'edu_' + Date.now().toString(36),
      title: newEduTitle.trim(),
      institution: newEduInstitution.trim(),
      year: newEduYear.trim(),
      category: newEduCategory.trim()
    };
    setEducation(prev => [...prev, newItem]);
    setIsAddingEducation(false);
    setNewEduTitle('');
    setNewEduInstitution('');
  };

  // References CRUD in modal
  const handleReferenceChange = (id: string, field: keyof ReferenceItem, val: any) => {
    setReferences(prev => prev.map(r => r.id === id ? { ...r, [field]: val } : r));
  };

  const handleDeleteReference = (id: string) => {
    setReferences(prev => prev.filter(r => String(r.id) !== String(id)));
    SiteContentService.deleteReference(id);
  };

  const handleCreateReference = () => {
    if (!newRefName.trim() || !newRefPhone.trim()) return;
    const newRef: ReferenceItem = {
      id: 'ref_' + Date.now().toString(36),
      name: newRefName.trim(),
      role: newRefRole.trim() || 'Supervisor',
      organization: newRefOrg.trim() || 'Institución',
      phone: newRefPhone.trim()
    };
    setReferences(prev => [...prev, newRef]);
    setIsAddingReference(false);
    setNewRefName('');
    setNewRefRole('');
    setNewRefOrg('');
    setNewRefPhone('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    SiteContentService.saveProfile(formData);
    SiteContentService.saveSpecialties(specialties);
    SiteContentService.saveExperiences(experiences);
    SiteContentService.saveEducation(education);
    SiteContentService.saveReferences(references);
    onProfileUpdated(formData);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            key="section-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm"
          />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl p-6 sm:p-8 shadow-2xl z-10 my-8 space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[var(--accent-color)]/20 border border-[var(--accent-color)]/30 flex items-center justify-center text-[var(--accent-color)]">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bebas text-3xl text-[var(--text-primary)] tracking-wide leading-none">
                  EDITAR SECCIONES DEL PORTAFOLIO
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Personaliza textos, títulos, descripciones y contenidos de todas las áreas
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

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-2 overflow-x-auto scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTab('hero')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'hero'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              1. Portada / Hero
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specialties')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'specialties'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              2. Especialidades
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'gallery'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              3. Galería de Obras
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('videos')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'videos'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              4. Videos & Reels
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'documents'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              5. Diapositivas Corporativas
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('experience')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'experience'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              6. Experiencia Laboral
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('education')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'education'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              7. Formación & Especializaciones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('references')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'references'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              8. Referencias Laborales
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('contact')}
              className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              }`}
            >
              9. Contacto & Manifiesto
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            
            {/* TAB: Hero */}
            {activeTab === 'hero' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Kicker Superior
                    </label>
                    <input
                      type="text"
                      value={formData.heroKicker}
                      onChange={(e) => handleChange('heroKicker', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Nombre Profesional & Grado
                    </label>
                    <input
                      type="text"
                      value={formData.degreeTitle}
                      onChange={(e) => handleChange('degreeTitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Titular Gigante Línea 1
                    </label>
                    <input
                      type="text"
                      value={formData.heroHeadlineTop}
                      onChange={(e) => handleChange('heroHeadlineTop', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] font-bebas text-2xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Titular Gigante Línea 2
                    </label>
                    <input
                      type="text"
                      value={formData.heroHeadlineBottom}
                      onChange={(e) => handleChange('heroHeadlineBottom', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] font-bebas text-2xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Rol / Subtítulo Profesional
                  </label>
                  <input
                    type="text"
                    value={formData.roleTitle}
                    onChange={(e) => handleChange('roleTitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Biografía Breve / Resumen de Práctica
                  </label>
                  <textarea
                    rows={3}
                    value={formData.bioSummary}
                    onChange={(e) => handleChange('bioSummary', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>

                {/* Metrics */}
                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-3">
                  <span className="text-xs font-mono uppercase text-[var(--text-muted)] font-semibold block">
                    Métricas de Portada
                  </span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formData.stat1Value}
                        onChange={(e) => handleChange('stat1Value', e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] font-bebas text-lg"
                      />
                      <input
                        type="text"
                        value={formData.stat1Label}
                        onChange={(e) => handleChange('stat1Label', e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-2 py-1 text-[11px] text-[var(--text-secondary)] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formData.stat2Value}
                        onChange={(e) => handleChange('stat2Value', e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] font-bebas text-lg"
                      />
                      <input
                        type="text"
                        value={formData.stat2Label}
                        onChange={(e) => handleChange('stat2Label', e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-2 py-1 text-[11px] text-[var(--text-secondary)] font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <input
                        type="text"
                        value={formData.stat3Value}
                        onChange={(e) => handleChange('stat3Value', e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-2 py-1 text-xs text-[var(--text-primary)] font-bebas text-lg"
                      />
                      <input
                        type="text"
                        value={formData.stat3Label}
                        onChange={(e) => handleChange('stat3Label', e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded px-2 py-1 text-[11px] text-[var(--text-secondary)] font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Especialidades */}
            {activeTab === 'specialties' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Título de la Sección
                    </label>
                    <input
                      type="text"
                      value={formData.specialtiesTitle || "ESPECIALIDADES"}
                      onChange={(e) => handleChange('specialtiesTitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] font-bebas text-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Subtítulo Descriptivo
                    </label>
                    <input
                      type="text"
                      value={formData.specialtiesSubtitle || ""}
                      onChange={(e) => handleChange('specialtiesSubtitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                {/* Specialties List */}
                <div className="space-y-4 pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[var(--text-muted)] font-semibold">
                      Disciplinas Activas ({specialties.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingSpecialty(true)}
                      className="px-3 py-1 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Disciplina</span>
                    </button>
                  </div>

                  {isAddingSpecialty && (
                    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--accent-color)]/50 rounded-xl space-y-3">
                      <h4 className="text-xs font-mono uppercase text-[var(--accent-color)] font-semibold">
                        Nueva Disciplina
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Título (Ej. 3D & CGI)"
                          value={newSpecTitle}
                          onChange={(e) => setNewSpecTitle(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          placeholder="Tagline (Ej. Modelado & Render)"
                          value={newSpecTagline}
                          onChange={(e) => setNewSpecTagline(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                      </div>
                      <input
                        type="text"
                        placeholder="Descripción"
                        value={newSpecDesc}
                        onChange={(e) => setNewSpecDesc(e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                      />
                      <input
                        type="url"
                        placeholder="URL de Imagen de Fondo"
                        value={newSpecImage}
                        onChange={(e) => setNewSpecImage(e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                      />
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingSpecialty(false)}
                          className="px-3 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateSpecialty}
                          className="px-3 py-1 bg-[var(--accent-color)] text-white text-xs rounded-lg"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {specialties.map((spec) => (
                      <div
                        key={spec.id}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bebas text-xl text-[var(--text-primary)] tracking-wide">
                            {spec.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteSpecialty(spec.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                            title="Eliminar especialidad"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <input
                            type="text"
                            value={spec.title}
                            onChange={(e) => handleSpecialtyChange(spec.id, 'title', e.target.value)}
                            placeholder="Título"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                          <input
                            type="text"
                            value={spec.tagline}
                            onChange={(e) => handleSpecialtyChange(spec.id, 'tagline', e.target.value)}
                            placeholder="Tagline"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                        </div>

                        <input
                          type="text"
                          value={spec.description}
                          onChange={(e) => handleSpecialtyChange(spec.id, 'description', e.target.value)}
                          placeholder="Descripción breve"
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />

                        <input
                          type="url"
                          value={spec.image}
                          onChange={(e) => handleSpecialtyChange(spec.id, 'image', e.target.value)}
                          placeholder="URL de la imagen de fondo"
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)] font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Galería */}
            {activeTab === 'gallery' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Título de la Galería
                  </label>
                  <input
                    type="text"
                    value={formData.galleryTitle || "GALERÍA DINÁMICA"}
                    onChange={(e) => handleChange('galleryTitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] font-bebas text-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Subtítulo / Descripción de la Galería
                  </label>
                  <textarea
                    rows={3}
                    value={formData.gallerySubtitle || ""}
                    onChange={(e) => handleChange('gallerySubtitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>

                <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl text-xs text-[var(--text-secondary)] space-y-1">
                  <p className="font-semibold text-[var(--text-primary)]">Gestión individual de proyectos:</p>
                  <p>Para añadir, editar o borrar proyectos específicos, puedes usar directamente los botones [Editar] y [Eliminar] visibles en cada tarjeta de obra, o ir al Panel de Administración.</p>
                </div>
              </div>
            )}

            {/* TAB: Videos & Showreels */}
            {activeTab === 'videos' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Título de la Sección de Videos
                  </label>
                  <input
                    type="text"
                    value={formData.videosTitle || "PRODUCCIÓN AUDIOVISUAL & SHOWREELS"}
                    onChange={(e) => handleChange('videosTitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] font-bebas text-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Subtítulo / Descripción de la Sección de Videos
                  </label>
                  <textarea
                    rows={3}
                    value={formData.videosSubtitle || ""}
                    onChange={(e) => handleChange('videosSubtitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: Diapositivas Corporativas */}
            {activeTab === 'documents' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Kicker / Etiqueta Superior
                  </label>
                  <input
                    type="text"
                    value={formData.documentsKicker || "DIAPOSITIVAS & DECKS CORPORATIVOS"}
                    onChange={(e) => handleChange('documentsKicker', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-xs font-mono text-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Título de la Sección de Diapositivas
                  </label>
                  <input
                    type="text"
                    value={formData.documentsTitle || "DIAPOSITIVAS CORPORATIVAS"}
                    onChange={(e) => handleChange('documentsTitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] font-bebas text-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Subtítulo / Descripción de Diapositivas
                  </label>
                  <textarea
                    rows={3}
                    value={formData.documentsSubtitle || ""}
                    onChange={(e) => handleChange('documentsSubtitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>
              </div>
            )}

            {/* TAB: Experiencia Laboral */}
            {activeTab === 'experience' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Título de la Sección
                    </label>
                    <input
                      type="text"
                      value={formData.experienceTitle || "TRAYECTORIA & EXPERIENCIA LABORAL"}
                      onChange={(e) => handleChange('experienceTitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] font-bebas text-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Subtítulo Descriptivo
                    </label>
                    <input
                      type="text"
                      value={formData.experienceSubtitle || ""}
                      onChange={(e) => handleChange('experienceSubtitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                  <span className="text-xs font-mono uppercase text-[var(--text-muted)] font-semibold block">
                    Cargos de Experiencia Laboral ({experiences.length})
                  </span>
                  
                  {experiences.map((exp) => (
                    <div
                      key={exp.id}
                      className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bebas text-xl text-[var(--text-primary)] tracking-wide">
                          {exp.role} en {exp.company}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteExperience(exp.id)}
                          className="p-1.5 text-neutral-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                          title="Eliminar cargo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(exp.id, 'role', e.target.value)}
                          placeholder="Cargo / Rol"
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(exp.id, 'company', e.target.value)}
                          placeholder="Empresa"
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          value={exp.period}
                          onChange={(e) => handleExperienceChange(exp.id, 'period', e.target.value)}
                          placeholder="Periodo (Ej. 2021 – 2026)"
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB: Formación Académica & Especializaciones */}
            {activeTab === 'education' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Título de la Sección
                    </label>
                    <input
                      type="text"
                      value={formData.educationTitle || "FORMACIÓN ACADÉMICA & ESPECIALIZACIONES"}
                      onChange={(e) => handleChange('educationTitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] font-bebas text-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Subtítulo Descriptivo
                    </label>
                    <input
                      type="text"
                      value={formData.educationSubtitle || ""}
                      onChange={(e) => handleChange('educationSubtitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[var(--text-muted)] font-semibold">
                      Programas Registrados ({education.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingEducation(true)}
                      className="px-3 py-1 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Formación</span>
                    </button>
                  </div>

                  {isAddingEducation && (
                    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--accent-color)]/50 rounded-xl space-y-3">
                      <h4 className="text-xs font-mono uppercase text-[var(--accent-color)] font-semibold">
                        Nueva Formación / Diplomado
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Título del programa"
                          value={newEduTitle}
                          onChange={(e) => setNewEduTitle(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          placeholder="Institución (UNAPEC, UNICARIBE...)"
                          value={newEduInstitution}
                          onChange={(e) => setNewEduInstitution(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Año (2025)"
                          value={newEduYear}
                          onChange={(e) => setNewEduYear(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <select
                          value={newEduCategory}
                          onChange={(e) => setNewEduCategory(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        >
                          <option value="Educación Superior e Idiomas">Educación Superior e Idiomas</option>
                          <option value="Desarrollo Web y Tecnología">Desarrollo Web y Tecnología</option>
                          <option value="Publicidad, Audiovisual y Gestión">Publicidad, Audiovisual y Gestión</option>
                        </select>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingEducation(false)}
                          className="px-3 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateEducation}
                          className="px-3 py-1 bg-[var(--accent-color)] text-white text-xs rounded-lg"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div
                        key={edu.id}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bebas text-xl text-[var(--text-primary)] tracking-wide">
                            {edu.title}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteEducation(edu.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                            title="Eliminar formación"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={edu.title}
                            onChange={(e) => handleEducationChange(edu.id, 'title', e.target.value)}
                            placeholder="Título"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(edu.id, 'institution', e.target.value)}
                            placeholder="Institución"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => handleEducationChange(edu.id, 'year', e.target.value)}
                            placeholder="Año"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Referencias Laborales */}
            {activeTab === 'references' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Título de la Sección
                    </label>
                    <input
                      type="text"
                      value={formData.referencesTitle || "REFERENCIAS LABORALES"}
                      onChange={(e) => handleChange('referencesTitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] font-bebas text-lg"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Subtítulo Descriptivo
                    </label>
                    <input
                      type="text"
                      value={formData.referencesSubtitle || ""}
                      onChange={(e) => handleChange('referencesSubtitle', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-[var(--border-subtle)]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-[var(--text-muted)] font-semibold">
                      Referencias Registradas ({references.length})
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingReference(true)}
                      className="px-3 py-1 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Referencia</span>
                    </button>
                  </div>

                  {isAddingReference && (
                    <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--accent-color)]/50 rounded-xl space-y-3">
                      <h4 className="text-xs font-mono uppercase text-[var(--accent-color)] font-semibold">
                        Nueva Referencia Laboral
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Nombre (Lic. Víctor Rodríguez)"
                          value={newRefName}
                          onChange={(e) => setNewRefName(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          placeholder="Cargo (Director de Operaciones)"
                          value={newRefRole}
                          onChange={(e) => setNewRefRole(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="Organización (World Sign)"
                          value={newRefOrg}
                          onChange={(e) => setNewRefOrg(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                        <input
                          type="text"
                          placeholder="Teléfono (809 592 1212)"
                          value={newRefPhone}
                          onChange={(e) => setNewRefPhone(e.target.value)}
                          className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                        />
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingReference(false)}
                          className="px-3 py-1 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        >
                          Cancelar
                        </button>
                        <button
                          type="button"
                          onClick={handleCreateReference}
                          className="px-3 py-1 bg-[var(--accent-color)] text-white text-xs rounded-lg"
                        >
                          Guardar
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {references.map((ref) => (
                      <div
                        key={ref.id}
                        className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bebas text-xl text-[var(--text-primary)] tracking-wide">
                            {ref.name} — {ref.role}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteReference(ref.id)}
                            className="p-1.5 text-neutral-400 hover:text-red-500 rounded transition-colors cursor-pointer"
                            title="Eliminar referencia"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <input
                            type="text"
                            value={ref.name}
                            onChange={(e) => handleReferenceChange(ref.id, 'name', e.target.value)}
                            placeholder="Nombre"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                          <input
                            type="text"
                            value={ref.organization}
                            onChange={(e) => handleReferenceChange(ref.id, 'organization', e.target.value)}
                            placeholder="Empresa"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                          <input
                            type="text"
                            value={ref.phone}
                            onChange={(e) => handleReferenceChange(ref.id, 'phone', e.target.value)}
                            placeholder="Teléfono"
                            className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-xs text-[var(--text-primary)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB: Contacto & Manifiesto */}
            {activeTab === 'contact' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Título de la Sección de Contacto
                  </label>
                  <input
                    type="text"
                    value={formData.contactTitle || "COORDENADAS & CONTACTO DIRECTO"}
                    onChange={(e) => handleChange('contactTitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] font-bebas text-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Subtítulo de Contacto
                  </label>
                  <textarea
                    rows={2}
                    value={formData.contactSubtitle || ""}
                    onChange={(e) => handleChange('contactSubtitle', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Correo Primario
                    </label>
                    <input
                      type="email"
                      value={formData.emailPrimary}
                      onChange={(e) => handleChange('emailPrimary', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Correo Secundario
                    </label>
                    <input
                      type="email"
                      value={formData.emailSecondary}
                      onChange={(e) => handleChange('emailSecondary', e.target.value)}
                      className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                      Teléfonos de Contacto
                    </label>
                    <button
                      type="button"
                      onClick={handleAddPhone}
                      className="text-xs text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer font-mono"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Añadir Teléfono</span>
                    </button>
                  </div>
                  {formData.phones.map((phone, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => handlePhoneChange(idx, e.target.value)}
                        className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] font-mono"
                      />
                      {formData.phones.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemovePhone(idx)}
                          className="p-2 text-neutral-400 hover:text-red-500 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Ubicación del Estudio
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">
                    Manifiesto Artístico
                  </label>
                  <textarea
                    rows={4}
                    value={formData.manifestoText || ""}
                    onChange={(e) => handleChange('manifestoText', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-xl px-4 py-2 text-sm text-[var(--text-primary)] resize-none"
                  />
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-[var(--accent-color)]/25 flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                <span>Guardar Cambios</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
