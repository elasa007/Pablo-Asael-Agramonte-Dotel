export type SpecialtyCategory = 
  | 'Social Media'
  | 'Editorial'
  | 'Fotografía'
  | 'Ilustración'
  | 'Branding'
  | 'Video'
  | 'Presentaciones'
  | string;

export interface Project {
  id: string;
  title: string;
  category: SpecialtyCategory;
  description: string;
  client: string;
  year: string;
  imageUrl: string;
  images?: string[]; // Array of gallery images for carousel
  videoUrl?: string;
  videoPlatform?: 'youtube' | 'vimeo' | 'drive' | 'direct' | 'none';
  documentUrl?: string;
  documentType?: 'pdf' | 'pptx' | 'google_slides' | 'google_drive' | 'canva' | 'none';
  documentName?: string;
  aspectRatio?: string;
  tags: string[];
  featured?: boolean;
  createdAt: number;
}

export interface VideoItem {
  id: string;
  title: string;
  category: string;
  platform: 'youtube' | 'vimeo' | 'drive' | 'direct';
  url: string;
  embedUrl: string;
  thumbnailUrl: string;
  duration?: string;
  client?: string;
  year?: string;
  description?: string;
  featured?: boolean;
  createdAt: number;
}

export interface DocumentItem {
  id: string;
  title: string;
  type: 'pdf' | 'pptx' | 'google_slides' | 'google_drive' | 'canva';
  source: 'upload' | 'google_drive' | 'url' | 'canva';
  fileUrl: string;
  embedUrl: string;
  thumbnailUrl?: string;
  size?: string;
  pageCount?: string | number;
  category: 'Dossier' | 'Presentación' | 'CV' | 'Manual de Marca' | 'Propuesta' | string;
  description?: string;
  client?: string;
  year?: string;
  createdAt: number;
}

export interface SpecialtyItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  image: string;
  accentColor: string;
}

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string[];
}

export interface EducationItem {
  id: string;
  title: string;
  institution: string;
  year: string;
  category: 'Educación Superior e Idiomas' | 'Desarrollo Web y Tecnología' | 'Publicidad, Audiovisual y Gestión' | string;
  description?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  phone: string;
  email?: string;
  relation?: string;
}

export type SkillCategory = 
  | 'Diseño Gráfico & Editorial'
  | 'Edición & Postproducción Audiovisual'
  | 'Artes Visuales & Fotografía'
  | 'Producción & Gran Formato'
  | 'Web & Nuevas Tecnologías'
  | string;

export interface SkillItem {
  id: string;
  name: string;
  category: SkillCategory;
  level: string; // e.g. "Nivel Experto", "Dominio Avanzado"
  percentage: number; // 0 - 100
  description: string;
  iconName?: string;
  accentColor?: string;
}

export interface SectionVisibility {
  hero: boolean;
  specialties: boolean;
  skills?: boolean;   // Competencias Técnicas & Software
  gallery: boolean;
  videos: boolean;
  documents: boolean;
  experience: boolean; // Trayectoria / Experiencia Laboral
  education: boolean;  // Formación Académica & Especializaciones
  references: boolean; // Referencias Laborales
  contact: boolean;    // Manifiesto & Contacto Directo
}

export interface SiteProfile {
  name: string;
  degreeTitle: string; // e.g. "Lic. Asael Agramonte"
  roleTitle: string; // e.g. "Diseñador gráfico / Multimedia"
  heroHeadlineTop: string;
  heroHeadlineBottom: string;
  heroKicker: string;
  bioSummary: string;
  bioDetailed: string;
  avatarUrl: string;
  profilePhotos: string[]; // List of available/saved profile photos
  emailPrimary: string;
  emailSecondary: string;
  phones: string[];
  address: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  // Section headers customization
  specialtiesTitle?: string;
  specialtiesSubtitle?: string;
  skillsTitle?: string;
  skillsSubtitle?: string;
  galleryTitle?: string;
  gallerySubtitle?: string;
  videosTitle?: string;
  videosSubtitle?: string;
  documentsTitle?: string;
  documentsSubtitle?: string;
  documentsKicker?: string;
  experienceTitle?: string;
  experienceSubtitle?: string;
  educationTitle?: string;
  educationSubtitle?: string;
  referencesTitle?: string;
  referencesSubtitle?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  manifestoText?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialBehance?: string;
  socialWhatsapp?: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: 'admin' | 'director';
  isAuthenticated: boolean;
}
