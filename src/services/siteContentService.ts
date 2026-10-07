import { 
  SiteProfile, 
  WorkExperience, 
  EducationItem, 
  ReferenceItem, 
  SpecialtyItem, 
  SectionVisibility,
  VideoItem,
  DocumentItem,
  SkillItem
} from '../types/portfolio';
import { SPECIALTIES_DATA } from '../data/specialties';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

// High-fidelity portrait artwork representing Lic. Asael Agramonte from CV photo
export const DEFAULT_ASAEL_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80";

export const DEFAULT_SITE_PROFILE: SiteProfile = {
  name: "Lic. Asael Agramonte",
  degreeTitle: "Lic. Asael Agramonte",
  roleTitle: "Diseñador gráfico / Multimedia",
  heroHeadlineTop: "CREATIVO",
  heroHeadlineBottom: "MULTIMEDIA",
  heroKicker: "Lic. Asael Agramonte · Diseño Gráfico & Multimedia",
  bioSummary: "Diseñador Multimedia y Publicista enfocado en la creación de soluciones visuales integrales. Combino una sólida base en diseño gráfico con experiencia en fotografía, producción de video y marketing digital para desarrollar marcas e interfaces atractivas.",
  bioDetailed: "Experto en el manejo de herramientas de diseño y edición audiovisual (Adobe Creative Cloud, DaVinci Resolve, entre otras) para gestionar proyectos desde la conceptualización hasta la producción final.",
  avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  profilePhotos: [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80"
  ],
  emailPrimary: "asael.agramonte@gmail.com",
  emailSecondary: "elasa007@gmail.com",
  phones: ["809 709 5650", "829 663 5650"],
  address: "Calle Camino Real, Residencial El Sembrador V, Ciudad Juan Bosch, SDE",
  stat1Value: "12+ Años",
  stat1Label: "Trayectoria Profesional",
  stat2Value: "6+",
  stat2Label: "Disciplinas Dominadas",
  stat3Value: "100%",
  stat3Label: "Compromiso & Calidad",
  specialtiesTitle: "ESPECIALIDADES",
  specialtiesSubtitle: "Seis disciplinas articuladas bajo la dirección de arte de Asael Agramonte, combinando sensibilidad plástica con tecnología y pensamiento estratégico.",
  skillsTitle: "HABILIDADES & COMPETENCIAS TÉCNICAS",
  skillsSubtitle: "Dominio integral de suites de diseño, postproducción cinematográfica, pre-prensa, gran formato y tecnologías emergentes.",
  galleryTitle: "GALERÍA DINÁMICA",
  gallerySubtitle: "Curaduría de proyectos de Asael Agramonte gestionados en tiempo real. Haz clic en cualquier pieza para examinar el caso de estudio y la ficha técnica.",
  videosTitle: "PRODUCCIÓN AUDIOVISUAL & SHOWREELS",
  videosSubtitle: "Dirección cinematográfica, edición de video, motion graphics y diseño sonoro. Proyectos transmitidos e integrados desde YouTube, Vimeo y Google Drive.",
  documentsTitle: "DIAPOSITIVAS CORPORATIVAS",
  documentsSubtitle: "Presentaciones estratégicas, pitch decks corporativos, slides comerciales y reportes ejecutivos en formatos interactivos (Canva, Google Slides, PowerPoint y PDF).",
  documentsKicker: "DIAPOSITIVAS & DECKS CORPORATIVOS",
  experienceTitle: "TRAYECTORIA & EXPERIENCIA LABORAL",
  experienceSubtitle: "Trayectoria contrastada de Lic. Asael Agramonte en publicidad, dirección gráfica institucional, producción audiovisual y desarrollo web.",
  educationTitle: "FORMACIÓN ACADÉMICA & ESPECIALIZACIONES",
  educationSubtitle: "Títulos de grado, diplomados y certificaciones técnicas de Lic. Asael Agramonte en publicidad, desarrollo web, diseño audiovisual y docencia virtual.",
  referencesTitle: "REFERENCIAS LABORALES",
  referencesSubtitle: "Contactos directos de directores, coordinadores y ejecutivos que respaldan la trayectoria y ética profesional de Lic. Asael Agramonte.",
  contactTitle: "COORDENADAS & CONTACTO DIRECTO",
  contactSubtitle: "Canales oficiales para contactar directamente a Lic. Asael Agramonte para dirección creativa, proyectos audiovisuales o consultoría.",
  manifestoText: "Como director creativo y diseñador multimedia, concibo cada proyecto como una obra integral que sintetiza arte visual, narrativa cinematográfica y diseño funcional. Mi enfoque abarca desde la dirección artística de campañas virales y branding hasta la producción audiovisual en 4K y la exploración editorial contemporánea.",
  socialInstagram: "instagram.com/asaelagramonte",
  socialLinkedin: "linkedin.com/in/asael-agramonte",
  socialBehance: "behance.net/asaelagramonte",
  socialWhatsapp: "+1 809 709 5650"
};

export const DEFAULT_SECTION_VISIBILITY: SectionVisibility = {
  hero: true,
  specialties: true,
  skills: true,
  gallery: true,
  videos: true,
  documents: true,
  experience: true,
  education: true,
  references: true,
  contact: true
};

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "vid_01",
    title: "Showreel Creativo & Motion Graphics 2026",
    category: "Showreel",
    platform: "youtube",
    url: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
    embedUrl: "https://www.youtube-nocookie.com/embed/LXb3EKWsInQ?autoplay=1&rel=0&modestbranding=1",
    thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    duration: "02:15",
    client: "Asael Agramonte Studio",
    year: "2026",
    description: "Compilación de piezas audiovisuales, cinemáticas 3D, animación de logotipos y dirección de arte para campañas de alto impacto.",
    featured: true,
    createdAt: 1710000000000
  },
  {
    id: "vid_02",
    title: "Campaña Institucional 'Identidad & Futuro'",
    category: "Spot Publicitario",
    platform: "vimeo",
    url: "https://vimeo.com/76979871",
    embedUrl: "https://player.vimeo.com/video/76979871?autoplay=1&title=0&byline=0",
    thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    duration: "01:30",
    client: "UNICARIBE",
    year: "2025",
    description: "Spot cinematográfico con dirección de fotografía en estudio y exteriores, etalonaje digital en DaVinci Resolve y composición sonora profesional.",
    featured: true,
    createdAt: 1709000000000
  },
  {
    id: "vid_03",
    title: "Identidad Dinámica & Animación de Marca 3D",
    category: "Motion Graphics",
    platform: "youtube",
    url: "https://www.youtube.com/watch?v=ysz5S6PUM-U",
    embedUrl: "https://www.youtube-nocookie.com/embed/ysz5S6PUM-U?autoplay=1&rel=0&modestbranding=1",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    duration: "00:45",
    client: "World Sign Branding",
    year: "2024",
    description: "Modelado, texturizado procedimental y animación de monograma corporativo para rotulación digital y cabeceras de video broadcast.",
    featured: false,
    createdAt: 1708000000000
  },
  {
    id: "vid_04",
    title: "Cobertura de Exposición Artística & Documental",
    category: "Audiovisual",
    platform: "drive",
    url: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/view",
    embedUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    thumbnailUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    duration: "03:40",
    client: "Centro Cultural BanReservas",
    year: "2023",
    description: "Cobertura multicámara y edición rítmica para inauguración de galería de arte, preservando la fidelidad cromática y ambiental.",
    featured: false,
    createdAt: 1707000000000
  }
];

export const DEFAULT_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc_01",
    title: "Master Pitch Deck: Estrategia de Expansión & Inversión 2026",
    type: "pptx",
    source: "url",
    fileUrl: "https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2Fmozilla%2Fpdf.js%2Fmaster%2Fexamples%2Flearning%2Fhelloworld.pdf",
    embedUrl: "https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2Fmozilla%2Fpdf.js%2Fmaster%2Fexamples%2Flearning%2Fhelloworld.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
    category: "Presentación",
    size: "PowerPoint PPTX · 12.4 MB",
    pageCount: "32 Diapositivas",
    client: "Junta Directiva Corporativa",
    year: "2026",
    description: "Deck ejecutivo de alta dirección en PowerPoint (PPTX) con proyecciones financieras, arquitectura de producto y roadmap estratégico.",
    createdAt: 1710000000000
  },
  {
    id: "doc_02",
    title: "Deck Estratégico: Rediseño Visual & Campaña BanReservas",
    type: "pptx",
    source: "url",
    fileUrl: "https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2Fmozilla%2Fpdf.js%2Fmaster%2Fexamples%2Flearning%2Fhelloworld.pdf",
    embedUrl: "https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2Fmozilla%2Fpdf.js%2Fmaster%2Fexamples%2Flearning%2Fhelloworld.pdf",
    thumbnailUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80",
    category: "Presentación",
    size: "PowerPoint PPTX · 8.6 MB",
    pageCount: "24 Diapositivas",
    client: "BanReservas Multimedia",
    year: "2025",
    description: "Presentación ejecutiva corporativa en PowerPoint con auditoría de marca, diseño de diapositivas animadas y sistema cromático.",
    createdAt: 1709000000000
  },
  {
    id: "doc_03",
    title: "Presentación Institucional & Rendición de Cuentas (Google Slides)",
    type: "google_slides",
    source: "google_drive",
    fileUrl: "https://docs.google.com/presentation/d/1Y3W9a2wE6D8xZ7k0/edit",
    embedUrl: "https://docs.google.com/presentation/d/1_sample_deck_id/embed?start=false&loop=false&delayms=3000",
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    category: "Presentación",
    size: "Nube Google Slides",
    pageCount: "28 Slides",
    client: "UNICARIBE Institucional",
    year: "2025",
    description: "Diapositivas interactivas en Google Slides con métricas de impacto, gráficos corporativos y balance de gestión académica y tecnológica.",
    createdAt: 1708000000000
  },
  {
    id: "doc_canva_01",
    title: "Pitch Deck & Dirección Audiovisual 2026 (Canva)",
    type: "canva",
    source: "canva",
    fileUrl: "https://www.canva.com/design/DAGR5W4Y2vU/view",
    embedUrl: "https://www.canva.com/design/DAGR5W4Y2vU/view?embed",
    thumbnailUrl: "https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?auto=format&fit=crop&w=800&q=80",
    category: "Dossier",
    size: "Presentación Canva",
    pageCount: "20 Slides",
    client: "Asael Agramonte Studio",
    year: "2026",
    description: "Pitch deck interactivo diseñado en Canva para propuesta de producción cinematográfica, estética visual contemporánea y presupuestos.",
    createdAt: 1711000000000
  }
];

export const DEFAULT_EXPERIENCES: WorkExperience[] = [
  {
    id: "exp_01",
    role: "Diseñador Gráfico y Audiovisual",
    company: "UNIVERSIDAD DEL CARIBE (UNICARIBE)",
    period: "2021 – 2026",
    description: [
      "Diseño y conceptualización de piezas gráficas para redes sociales, campañas publicitarias institucionales y señalización para eventos.",
      "Edición de video y animación gráfica para cápsulas informativas y comerciales.",
      "Fotografía institucional y cobertura de eventos académicos y protocolares."
    ]
  },
  {
    id: "exp_02",
    role: "Docente de Multimedia",
    company: "UNIVERSIDAD DEL CARIBE (UNICARIBE)",
    period: "2022 – 2026",
    description: [
      "Facilitador de asignaturas en el área de diseño, edición de video y producción multimedia.",
      "Desarrollo de contenidos académicos y talleres prácticos orientados a herramientas profesionales."
    ]
  },
  {
    id: "exp_03",
    role: "Director de Arte / Diseñador Gráfico",
    company: "WORLD SIGN",
    period: "2019 – 2021",
    description: [
      "Supervisión y control de calidad en el área de producción e impresión gráfica.",
      "Diseño de materiales POP, señalética corporativa, rotulación vehicular y proyectos de gran formato.",
      "Elaboración de artes para corte en router CNC y ploteo de vinil."
    ]
  },
  {
    id: "exp_04",
    role: "Diseñador Gráfico",
    company: "COOPSOEM",
    period: "2017 – 2019",
    description: [
      "Creación de identidad visual para eventos, asambleas y memorias anuales de la cooperativa.",
      "Diseño de material impreso (brochures, volantes, banners) y contenidos para medios digitales."
    ]
  },
  {
    id: "exp_05",
    role: "Fotógrafo y Editor de Video (Freelance)",
    company: "PROYECTOS INDEPENDIENTES",
    period: "2015 – PRESENTE",
    description: [
      "Producción audiovisual integral: preproducción, grabación con cámaras cinematográficas y DSLR, iluminación en locación y postproducción.",
      "Sesiones fotográficas para marcas, productos, retratos editoriales y cobertura de eventos corporativos."
    ]
  }
];

export const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: "edu_01",
    title: "Licenciatura en Publicidad",
    institution: "UNIVERSIDAD DEL CARIBE (UNICARIBE)",
    year: "2018",
    category: "Educación Superior e Idiomas",
    description: "Mención Creatividad y Gerencia de Marca. Promoción de Excelencia."
  },
  {
    id: "edu_02",
    title: "Docencia Virtual",
    institution: "UNIVERSIDAD DEL CARIBE (UNICARIBE)",
    year: "2022",
    category: "Educación Superior e Idiomas",
    description: "Certificación Pedagógica en Entornos Virtuales de Aprendizaje y Diseño Instruccional."
  },
  {
    id: "edu_03",
    title: "Inglés de Inmersión para la Competitividad",
    institution: "MESCYT",
    year: "2016",
    category: "Educación Superior e Idiomas",
    description: "Programa Intensivo de Idioma Inglés Avanzado B2-C1."
  },
  {
    id: "edu_04",
    title: "Diplomado en Desarrollo Web Frontend",
    institution: "ITLA",
    year: "2023",
    category: "Desarrollo Web y Tecnología"
  },
  {
    id: "edu_05",
    title: "Diseño UX/UI y Prototipado en Figma",
    institution: "PLATZI",
    year: "2025",
    category: "Desarrollo Web y Tecnología"
  },
  {
    id: "edu_06",
    title: "Diseño de páginas web, CSS y JS",
    institution: "INFOTEP",
    year: "2024",
    category: "Desarrollo Web y Tecnología"
  },
  {
    id: "edu_07",
    title: "POWER BI Nivel Básico",
    institution: "INFOTEP",
    year: "2025",
    category: "Desarrollo Web y Tecnología"
  },
  {
    id: "edu_08",
    title: "Asistencia de dirección",
    institution: "UNIBE / DGCINE",
    year: "2022",
    category: "Publicidad, Audiovisual y Gestión"
  },
  {
    id: "edu_09",
    title: "Fotografía de Productos",
    institution: "CREHANA",
    year: "2020",
    category: "Publicidad, Audiovisual y Gestión"
  },
  {
    id: "edu_10",
    title: "Iluminación Profesional en Estudio",
    institution: "ESCUELA DE ARTE Y DISEÑO",
    year: "2019",
    category: "Publicidad, Audiovisual y Gestión"
  }
];

export const DEFAULT_REFERENCES: ReferenceItem[] = [
  {
    id: "ref_01",
    name: "Lic. Víctor Rodríguez",
    role: "Director de Operaciones",
    organization: "World Sign",
    phone: "809 592 1212"
  },
  {
    id: "ref_02",
    name: "Licda. Kenia Santana",
    role: "Coordinadora de Producción",
    organization: "UNICARIBE",
    phone: "809 610 8820"
  },
  {
    id: "ref_03",
    name: "Ing. Manuel Mercedes",
    role: "CEO",
    organization: "COOPSOEM",
    phone: "829 312 8594"
  }
];

export const DEFAULT_SKILLS: SkillItem[] = [
  {
    id: "skill_photoshop",
    name: "Adobe Photoshop",
    category: "Diseño Gráfico & Editorial",
    level: "Nivel Experto",
    percentage: 98,
    description: "Retoque fotográfico digital de alta gama, composición publicitaria, fotomontajes hiperrealistas, matte painting y tratamiento de color para medios impresos y digitales.",
    iconName: "Image",
    accentColor: "#31A8FF"
  },
  {
    id: "skill_illustrator",
    name: "Adobe Illustrator",
    category: "Diseño Gráfico & Editorial",
    level: "Nivel Experto",
    percentage: 97,
    description: "Desarrollo de identidades visuales, logotipos geométricos, ilustración vectorial compleja, tipografías personalizadas y preparación de artes finales para producción masiva.",
    iconName: "PenTool",
    accentColor: "#FF9A00"
  },
  {
    id: "skill_indesign",
    name: "Adobe InDesign",
    category: "Diseño Gráfico & Editorial",
    level: "Nivel Experto",
    percentage: 95,
    description: "Maquetación editorial multipágina, memorias institucionales, catálogos comerciales, revistas, libros y dossiers interactivos con retículas precisas y hojas de estilo.",
    iconName: "BookOpen",
    accentColor: "#FF3366"
  },
  {
    id: "skill_acrobat",
    name: "Adobe Acrobat",
    category: "Diseño Gráfico & Editorial",
    level: "Nivel Experto",
    percentage: 94,
    description: "Gestión técnica de preflight e imposición para imprenta, estándares internacionales PDF/X, formularios digitales interactivos, validación de tintas y separaciones.",
    iconName: "FileCheck",
    accentColor: "#E53935"
  },
  {
    id: "skill_coreldraw",
    name: "CorelDRAW",
    category: "Diseño Gráfico & Editorial",
    level: "Dominio Avanzado",
    percentage: 92,
    description: "Diseño vectorial para rotulación comercial exterior e interior, ploteo de vinil, preparación de archivos de corte CNC y compatibilidad con maquinaria de producción gráfica.",
    iconName: "Shapes",
    accentColor: "#00C853"
  },
  {
    id: "skill_canva",
    name: "Canva",
    category: "Diseño Gráfico & Editorial",
    level: "Dominio Avanzado",
    percentage: 90,
    description: "Desarrollo de sistemas de plantillas maestras de marca, automatización de contenidos corporativos para redes sociales y prototipado visual ágil colaborativo.",
    iconName: "LayoutGrid",
    accentColor: "#00C4CC"
  },
  {
    id: "skill_premiere",
    name: "Adobe Premiere",
    category: "Edición & Postproducción Audiovisual",
    level: "Dominio Avanzado",
    percentage: 93,
    description: "Edición de video no lineal cinematográfica y publicitaria en 4K, montaje rítmico, sincronización sonora multipista y exportación optimizada para broadcasting y streaming.",
    iconName: "Film",
    accentColor: "#9999FF"
  },
  {
    id: "skill_davinci",
    name: "Davinci Resolve",
    category: "Edición & Postproducción Audiovisual",
    level: "Dominio Avanzado",
    percentage: 91,
    description: "Etalonaje y corrección de color profesional con nodos y curvas, balance de perfiles logarítmicos (LOG/RAW/Rec.709), looks cinematográficos y masterización final con Fairlight.",
    iconName: "Sliders",
    accentColor: "#FF6D00"
  }
];

export class SiteContentService {
  private static listeners: Array<() => void> = [];
  private static isInitialized = false;

  private static cachedProfile: SiteProfile = DEFAULT_SITE_PROFILE;
  private static cachedVisibility: SectionVisibility = DEFAULT_SECTION_VISIBILITY;
  private static cachedSpecialties: SpecialtyItem[] = SPECIALTIES_DATA;
  private static cachedVideos: VideoItem[] = DEFAULT_VIDEOS;
  private static cachedDocuments: DocumentItem[] = DEFAULT_DOCUMENTS;
  private static cachedExperiences: WorkExperience[] = DEFAULT_EXPERIENCES;
  private static cachedEducation: EducationItem[] = DEFAULT_EDUCATION;
  private static cachedReferences: ReferenceItem[] = DEFAULT_REFERENCES;
  private static cachedSkills: SkillItem[] = DEFAULT_SKILLS;

  public static initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    // 1. Profile Listener
    try {
      const profileRef = doc(db, 'profile', 'current');
      onSnapshot(profileRef, (snap) => {
        if (snap.exists()) {
          this.cachedProfile = { ...DEFAULT_SITE_PROFILE, ...snap.data() } as SiteProfile;
          this.notify();
        } else {
          setDoc(profileRef, DEFAULT_SITE_PROFILE).catch((err) => {
            console.warn('Initial profile seed error (may require auth):', err);
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'profile/current');
      });
    } catch (e) {
      console.warn('Profile listener initialization error', e);
    }

    // 2. Visibility Listener
    try {
      const visRef = doc(db, 'visibility', 'current');
      onSnapshot(visRef, (snap) => {
        if (snap.exists()) {
          this.cachedVisibility = { ...DEFAULT_SECTION_VISIBILITY, ...snap.data() } as SectionVisibility;
          this.notify();
        } else {
          setDoc(visRef, DEFAULT_SECTION_VISIBILITY).catch(() => {});
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'visibility/current');
      });
    } catch (e) {
      console.warn('Visibility listener initialization error', e);
    }

    // 3. Videos Listener
    try {
      const videosCol = collection(db, 'videos');
      onSnapshot(videosCol, (snap) => {
        if (!snap.empty) {
          const list: VideoItem[] = [];
          snap.forEach(d => list.push(d.data() as VideoItem));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.cachedVideos = list;
          this.notify();
        } else {
          this.seedCollection('videos', DEFAULT_VIDEOS);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'videos');
      });
    } catch (e) {
      console.warn('Videos listener initialization error', e);
    }

    // 4. Documents Listener
    try {
      const docsCol = collection(db, 'documents');
      onSnapshot(docsCol, (snap) => {
        if (!snap.empty) {
          const list: DocumentItem[] = [];
          snap.forEach(d => list.push(d.data() as DocumentItem));
          list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.cachedDocuments = list;
          this.notify();
        } else {
          this.seedCollection('documents', DEFAULT_DOCUMENTS);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'documents');
      });
    } catch (e) {
      console.warn('Documents listener initialization error', e);
    }

    // 5. Experiences Listener
    try {
      const expCol = collection(db, 'experiences');
      onSnapshot(expCol, (snap) => {
        if (!snap.empty) {
          const list: WorkExperience[] = [];
          snap.forEach(d => list.push(d.data() as WorkExperience));
          this.cachedExperiences = list;
          this.notify();
        } else {
          this.seedCollection('experiences', DEFAULT_EXPERIENCES);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'experiences');
      });
    } catch (e) {
      console.warn('Experiences listener initialization error', e);
    }

    // 6. Education Listener
    try {
      const eduCol = collection(db, 'education');
      onSnapshot(eduCol, (snap) => {
        if (!snap.empty) {
          const list: EducationItem[] = [];
          snap.forEach(d => list.push(d.data() as EducationItem));
          this.cachedEducation = list;
          this.notify();
        } else {
          this.seedCollection('education', DEFAULT_EDUCATION);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'education');
      });
    } catch (e) {
      console.warn('Education listener initialization error', e);
    }

    // 7. References Listener
    try {
      const refCol = collection(db, 'references');
      onSnapshot(refCol, (snap) => {
        if (!snap.empty) {
          const list: ReferenceItem[] = [];
          snap.forEach(d => list.push(d.data() as ReferenceItem));
          this.cachedReferences = list;
          this.notify();
        } else {
          this.seedCollection('references', DEFAULT_REFERENCES);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'references');
      });
    } catch (e) {
      console.warn('References listener initialization error', e);
    }

    // 8. Skills Listener
    try {
      const skillsCol = collection(db, 'skills');
      onSnapshot(skillsCol, (snap) => {
        if (!snap.empty) {
          const list: SkillItem[] = [];
          snap.forEach(d => list.push(d.data() as SkillItem));
          this.cachedSkills = list;
          this.notify();
        } else {
          this.seedCollection('skills', DEFAULT_SKILLS);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'skills');
      });
    } catch (e) {
      console.warn('Skills listener initialization error', e);
    }
  }

  private static async seedCollection(colName: string, items: Array<{ id: string } & any>) {
    try {
      for (const item of items) {
        await setDoc(doc(db, colName, item.id), item);
      }
    } catch (e) {
      console.warn(`Could not seed ${colName} (may require admin auth):`, e);
    }
  }

  // Section Visibility
  public static getSectionVisibility(): SectionVisibility {
    if (!this.isInitialized) this.initialize();
    return this.cachedVisibility;
  }

  public static async saveSectionVisibility(visibility: SectionVisibility): Promise<void> {
    this.cachedVisibility = visibility;
    this.notify();
    try {
      await setDoc(doc(db, 'visibility', 'current'), visibility);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'visibility/current');
    }
  }

  public static toggleSectionVisibility(sectionKey: keyof SectionVisibility): void {
    const current = { ...this.getSectionVisibility() };
    current[sectionKey] = !current[sectionKey];
    this.saveSectionVisibility(current);
  }

  public static resetSectionVisibility(): void {
    this.saveSectionVisibility({ ...DEFAULT_SECTION_VISIBILITY });
  }

  // Profile & Hero
  public static getProfile(): SiteProfile {
    if (!this.isInitialized) this.initialize();
    return this.cachedProfile;
  }

  public static async saveProfile(profile: SiteProfile): Promise<void> {
    this.cachedProfile = profile;
    this.notify();
    try {
      await setDoc(doc(db, 'profile', 'current'), profile);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'profile/current');
    }
  }

  public static updateProfile(updates: Partial<SiteProfile>): SiteProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    this.saveProfile(updated);
    return updated;
  }

  public static updateProfilePhoto(avatarUrl: string): void {
    const profile = this.getProfile();
    const photos = profile.profilePhotos || [];
    if (!photos.includes(avatarUrl)) {
      photos.unshift(avatarUrl);
    }
    this.saveProfile({ ...profile, avatarUrl, profilePhotos: photos });
  }

  public static addProfilePhoto(photoUrl: string): void {
    const profile = this.getProfile();
    const currentPhotos = profile.profilePhotos || [];
    if (!currentPhotos.includes(photoUrl)) {
      const updated = [photoUrl, ...currentPhotos];
      this.saveProfile({ ...profile, avatarUrl: photoUrl, profilePhotos: updated });
    } else {
      this.saveProfile({ ...profile, avatarUrl: photoUrl });
    }
  }

  public static deleteProfilePhoto(photoUrl: string): void {
    const profile = this.getProfile();
    const currentPhotos = (profile.profilePhotos || []).filter(p => p !== photoUrl);
    const nextAvatar = profile.avatarUrl === photoUrl 
      ? (currentPhotos[0] || DEFAULT_ASAEL_AVATAR) 
      : profile.avatarUrl;
    this.saveProfile({
      ...profile,
      avatarUrl: nextAvatar,
      profilePhotos: currentPhotos.length > 0 ? currentPhotos : [DEFAULT_ASAEL_AVATAR]
    });
  }

  public static setActiveProfilePhoto(photoUrl: string): void {
    const profile = this.getProfile();
    this.saveProfile({ ...profile, avatarUrl: photoUrl });
  }

  // Specialties
  public static getSpecialties(): SpecialtyItem[] {
    return this.cachedSpecialties;
  }

  public static saveSpecialties(specialties: SpecialtyItem[]): void {
    this.cachedSpecialties = specialties;
    this.notify();
  }

  public static updateSpecialty(id: string, updates: Partial<SpecialtyItem>): void {
    const list = this.getSpecialties();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveSpecialties([...list]);
    }
  }

  public static deleteSpecialty(id: string): void {
    const list = this.getSpecialties().filter(s => s.id !== id);
    this.saveSpecialties(list);
  }

  // Videos
  public static getVideos(): VideoItem[] {
    if (!this.isInitialized) this.initialize();
    return this.cachedVideos;
  }

  public static async saveVideos(videos: VideoItem[]): Promise<void> {
    this.cachedVideos = videos;
    this.notify();
  }

  public static async addVideo(video: Omit<VideoItem, 'id' | 'createdAt'>): Promise<VideoItem> {
    const newId = 'vid_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newVideo: VideoItem = {
      ...video,
      id: newId,
      createdAt: Date.now()
    };
    try {
      await setDoc(doc(db, 'videos', newId), newVideo);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `videos/${newId}`);
    }
    this.cachedVideos = [newVideo, ...this.cachedVideos];
    this.notify();
    return newVideo;
  }

  public static async updateVideo(id: string, updates: Partial<VideoItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'videos', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `videos/${id}`);
    }
    this.cachedVideos = this.cachedVideos.map(v => v.id === id ? { ...v, ...updates } : v);
    this.notify();
  }

  public static async deleteVideo(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'videos', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `videos/${id}`);
    }
    this.cachedVideos = this.cachedVideos.filter(v => v.id !== id);
    this.notify();
  }

  // Documents
  public static getDocuments(): DocumentItem[] {
    if (!this.isInitialized) this.initialize();
    return this.cachedDocuments;
  }

  public static async saveDocuments(docs: DocumentItem[]): Promise<void> {
    this.cachedDocuments = docs;
    this.notify();
  }

  public static async addDocument(docData: Omit<DocumentItem, 'id' | 'createdAt'>): Promise<DocumentItem> {
    const newId = 'doc_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newDoc: DocumentItem = {
      ...docData,
      id: newId,
      createdAt: Date.now()
    };
    try {
      await setDoc(doc(db, 'documents', newId), newDoc);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `documents/${newId}`);
    }
    this.cachedDocuments = [newDoc, ...this.cachedDocuments];
    this.notify();
    return newDoc;
  }

  public static async updateDocument(id: string, updates: Partial<DocumentItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'documents', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `documents/${id}`);
    }
    this.cachedDocuments = this.cachedDocuments.map(d => d.id === id ? { ...d, ...updates } : d);
    this.notify();
  }

  public static async deleteDocument(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'documents', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `documents/${id}`);
    }
    this.cachedDocuments = this.cachedDocuments.filter(d => d.id !== id);
    this.notify();
  }

  // Experience
  public static getExperiences(): WorkExperience[] {
    if (!this.isInitialized) this.initialize();
    return this.cachedExperiences;
  }

  public static async saveExperiences(items: WorkExperience[]): Promise<void> {
    this.cachedExperiences = items;
    this.notify();
  }

  public static async addExperience(item: Omit<WorkExperience, "id">): Promise<void> {
    const newId = "exp_" + Date.now().toString(36);
    const newItem: WorkExperience = { ...item, id: newId };
    try {
      await setDoc(doc(db, 'experiences', newId), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `experiences/${newId}`);
    }
    this.cachedExperiences = [...this.cachedExperiences, newItem];
    this.notify();
  }

  public static async updateExperience(id: string, updates: Partial<WorkExperience>): Promise<void> {
    try {
      await updateDoc(doc(db, 'experiences', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `experiences/${id}`);
    }
    this.cachedExperiences = this.cachedExperiences.map(e => e.id === id ? { ...e, ...updates } : e);
    this.notify();
  }

  public static async deleteExperience(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'experiences', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `experiences/${id}`);
    }
    this.cachedExperiences = this.cachedExperiences.filter(e => e.id !== id);
    this.notify();
  }

  // Education
  public static getEducation(): EducationItem[] {
    if (!this.isInitialized) this.initialize();
    return this.cachedEducation;
  }

  public static async saveEducation(items: EducationItem[]): Promise<void> {
    this.cachedEducation = items;
    this.notify();
  }

  public static async addEducation(item: Omit<EducationItem, "id">): Promise<void> {
    const newId = "edu_" + Date.now().toString(36);
    const newItem: EducationItem = { ...item, id: newId };
    try {
      await setDoc(doc(db, 'education', newId), newItem);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `education/${newId}`);
    }
    this.cachedEducation = [...this.cachedEducation, newItem];
    this.notify();
  }

  public static async updateEducation(id: string, updates: Partial<EducationItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'education', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `education/${id}`);
    }
    this.cachedEducation = this.cachedEducation.map(e => e.id === id ? { ...e, ...updates } : e);
    this.notify();
  }

  public static async deleteEducation(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'education', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `education/${id}`);
    }
    this.cachedEducation = this.cachedEducation.filter(e => e.id !== id);
    this.notify();
  }

  // References
  public static getReferences(): ReferenceItem[] {
    if (!this.isInitialized) this.initialize();
    return this.cachedReferences;
  }

  public static async saveReferences(items: ReferenceItem[]): Promise<void> {
    this.cachedReferences = items;
    this.notify();
  }

  public static async addReference(ref: Omit<ReferenceItem, "id">): Promise<void> {
    const newId = "ref_" + Date.now().toString(36);
    const newRef: ReferenceItem = { ...ref, id: newId };
    try {
      await setDoc(doc(db, 'references', newId), newRef);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `references/${newId}`);
    }
    this.cachedReferences = [...this.cachedReferences, newRef];
    this.notify();
  }

  public static async updateReference(id: string, updates: Partial<ReferenceItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'references', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `references/${id}`);
    }
    this.cachedReferences = this.cachedReferences.map(r => r.id === id ? { ...r, ...updates } : r);
    this.notify();
  }

  public static async deleteReference(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'references', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `references/${id}`);
    }
    this.cachedReferences = this.cachedReferences.filter(r => r.id !== id);
    this.notify();
  }

  // Skills
  public static getSkills(): SkillItem[] {
    if (!this.isInitialized) this.initialize();
    return this.cachedSkills;
  }

  public static async saveSkills(items: SkillItem[]): Promise<void> {
    this.cachedSkills = items;
    this.notify();
  }

  public static async addSkill(skill: Omit<SkillItem, "id">): Promise<void> {
    const newId = "skill_" + Date.now().toString(36);
    const newSkill: SkillItem = { ...skill, id: newId };
    try {
      await setDoc(doc(db, 'skills', newId), newSkill);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `skills/${newId}`);
    }
    this.cachedSkills = [...this.cachedSkills, newSkill];
    this.notify();
  }

  public static async updateSkill(id: string, updates: Partial<SkillItem>): Promise<void> {
    try {
      await updateDoc(doc(db, 'skills', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `skills/${id}`);
    }
    this.cachedSkills = this.cachedSkills.map(s => s.id === id ? { ...s, ...updates } : s);
    this.notify();
  }

  public static async deleteSkill(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `skills/${id}`);
    }
    this.cachedSkills = this.cachedSkills.filter(s => s.id !== id);
    this.notify();
  }

  public static async resetAllToDefaults(): Promise<void> {
    await this.saveProfile(DEFAULT_SITE_PROFILE);
    await this.saveSectionVisibility(DEFAULT_SECTION_VISIBILITY);
    await this.seedCollection('videos', DEFAULT_VIDEOS);
    await this.seedCollection('documents', DEFAULT_DOCUMENTS);
    await this.seedCollection('experiences', DEFAULT_EXPERIENCES);
    await this.seedCollection('education', DEFAULT_EDUCATION);
    await this.seedCollection('references', DEFAULT_REFERENCES);
    await this.seedCollection('skills', DEFAULT_SKILLS);
  }

  public static subscribe(listener: () => void): () => void {
    if (!this.isInitialized) this.initialize();
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify(): void {
    this.listeners.forEach(cb => cb());
  }
}

// Auto-initialize on load
SiteContentService.initialize();
