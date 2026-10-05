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
    thumbnailUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
    category: "Presentación",
    size: "Canva Presentation Cloud",
    pageCount: "20 Slides",
    client: "Dirección Creativa",
    year: "2026",
    description: "Presentación multimedia y deck interactivo en Canva con diapositivas animadas, propuesta estética y desglose de producción en tiempo real.",
    createdAt: 1709000000000
  },
  {
    id: "doc_04",
    title: "Propuesta Comercial & Keynote Deck de Servicios B2B",
    type: "pdf",
    source: "google_drive",
    fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    embedUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/preview",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    category: "Presentación",
    size: "Keynote / PDF Deck · 4.8 MB",
    pageCount: "18 Diapositivas",
    client: "Clientes Corporativos",
    year: "2026",
    description: "Diapositivas ejecutivas en formato horizontal 16:9 con desglose de paquetes de servicios, metodología de diseño y casos de éxito comercial.",
    createdAt: 1707000000000
  }
];

export const DEFAULT_EXPERIENCES: WorkExperience[] = [
  {
    id: "exp_01",
    role: "Diseñador Multimedia",
    company: "UNICARIBE",
    period: "2021 – 2026",
    description: [
      "Desarrollo de la identidad de marca, interfaces y materiales gráficos para plataformas institucionales y campañas de marketing.",
      "Diseño de piezas para eventos corporativos y académicos, incluyendo backpanels, invitaciones, programas y certificados.",
      "Gestión de producción gráfica, abarcando impresión en gran formato, rotulación y coordinación directa con proveedores para asegurar el control de calidad.",
      "Colaboración con equipos multidisciplinarios para la creación de recursos digitales adaptados a distintas plataformas."
    ]
  },
  {
    id: "exp_02",
    role: "Enc. Departamento de diseño e impresión",
    company: "World Sign",
    period: "2014 – 2020",
    description: [
      "Liderazgo y supervisión de proyectos integrales de diseño gráfico e impresión, asegurando el cumplimiento de los estándares corporativos.",
      "Gestión de un equipo creativo de 5 personas, optimizando los flujos de trabajo para garantizar la calidad y puntualidad en las entregas.",
      "Control de calidad de los materiales producidos, logrando un alto nivel de satisfacción y retención en la cartera de clientes.",
      "Coordinación de la producción gráfica, desde la conceptualización hasta la entrega final del producto impreso."
    ]
  },
  {
    id: "exp_03",
    role: "Diagramador",
    company: "Centro Cultural BanReservas",
    period: "2016",
    description: [
      "Ejecución de proyectos de diseño y diagramación para catálogos artísticos, trabajando bajo modalidad de iguala para la promoción de colecciones de arte.",
      "Conceptualización visual de materiales institucionales, asegurando una presentación estética que fortaleciera la identidad cultural de la institución en cada exposición.",
      "Maquetación y preparación de archivos para impresión, aplicando alta precisión técnica para mantener la fidelidad de las obras artísticas reproducidas."
    ]
  }
];

export const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: "edu_01",
    title: "Licenciatura en Publicidad",
    institution: "UNAPEC",
    year: "2022",
    category: "Educación Superior e Idiomas"
  },
  {
    id: "edu_02",
    title: "Diplomado Docente Virtual",
    institution: "UNICARIBE / ANTOLOGY",
    year: "2021",
    category: "Educación Superior e Idiomas"
  },
  {
    id: "edu_03",
    title: "Inglés por Inmersión",
    institution: "MESCYT",
    year: "2023",
    category: "Educación Superior e Idiomas"
  },
  {
    id: "edu_04",
    title: "Desarrollo Web Full Stack - Nivel Intermedio",
    institution: "BID Y CYMETRIA GROUP SAS",
    year: "2024",
    category: "Desarrollo Web y Tecnología"
  },
  {
    id: "edu_05",
    title: "Desarrollo de apps en las nubes",
    institution: "INFOTEP",
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
  // 1. Diseño Gráfico & Editorial
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

  // 2. Edición & Postproducción Audiovisual
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
  },

  // 3. Artes Visuales & Fotografía
  {
    id: "skill_fotografia",
    name: "Fotografía Digital",
    category: "Artes Visuales & Fotografía",
    level: "Dominio Avanzado",
    percentage: 92,
    description: "Captura profesional en estudio y locaciones, dirección de esquemas de iluminación de 3 puntos, retratos corporativos, fotografía de producto comercial y revelado RAW.",
    iconName: "Camera",
    accentColor: "#FF5252"
  },
  {
    id: "skill_ilustracion",
    name: "Ilustración Digital",
    category: "Artes Visuales & Fotografía",
    level: "Dominio Avanzado",
    percentage: 91,
    description: "Dibujo y pintura digital estilizada con tabletas gráficas, concept art, personajes corporativos, portadas editoriales y arte original para campañas y branding.",
    iconName: "Brush",
    accentColor: "#AA00FF"
  },

  // 4. Producción & Gran Formato
  {
    id: "skill_impresion",
    name: "Impresión Digital y Gigantografía",
    category: "Producción & Gran Formato",
    level: "Nivel Experto",
    percentage: 96,
    description: "Producción técnica y supervisión de impresión en gran escala: vallas publicitarias, vinilos microperforados, lonas frontlit/backlit, señalética exterior y perfiles de color CMYK.",
    iconName: "Printer",
    accentColor: "#E53935"
  },

  // 5. Web & Nuevas Tecnologías
  {
    id: "skill_web",
    name: "Diseño Web",
    category: "Web & Nuevas Tecnologías",
    level: "Dominio Avanzado",
    percentage: 90,
    description: "Diseño de interfaces web responsivas (UI/UX), prototipos interactivos modernos, maquetación adaptativa, arquitectura de información y diseño centrado en el usuario.",
    iconName: "Globe",
    accentColor: "#2979FF"
  },
  {
    id: "skill_ia",
    name: "Inteligencia Artificial",
    category: "Web & Nuevas Tecnologías",
    level: "Vanguardia Creativa",
    percentage: 89,
    description: "Implementación de IA generativa para ideación conceptual, creación de fondos fotorrealistas, prompt engineering visual, upscale y optimización de flujos creativos.",
    iconName: "Cpu",
    accentColor: "#7C4DFF"
  },
  {
    id: "skill_elearning",
    name: "eLearning",
    category: "Web & Nuevas Tecnologías",
    level: "Dominio Avanzado",
    percentage: 90,
    description: "Diseño instruccional visual, módulos de aprendizaje multimedia, infografías didácticas e interactividad pedagógica para plataformas de educación en línea (LMS).",
    iconName: "GraduationCap",
    accentColor: "#00B0FF"
  }
];

const PROFILE_KEY = "asael_site_profile_v3";
const SPECIALTIES_KEY = "asael_site_specialties_v3";
const EXPERIENCE_KEY = "asael_site_experience_v3";
const EDUCATION_KEY = "asael_site_education_v3";
const REFERENCES_KEY = "asael_site_references_v3";
const SKILLS_KEY = "asael_site_skills_v3";
const VISIBILITY_KEY = "asael_section_visibility_v4";
const VIDEOS_KEY = "asael_site_videos_v3";
const DOCUMENTS_KEY = "asael_site_documents_v3";

export class SiteContentService {
  private static listeners: Array<() => void> = [];

  // Section Visibility (Delete / Hide / Show any section)
  public static getSectionVisibility(): SectionVisibility {
    try {
      const stored = localStorage.getItem(VISIBILITY_KEY);
      if (stored) return { ...DEFAULT_SECTION_VISIBILITY, ...JSON.parse(stored) };
    } catch {}
    return { ...DEFAULT_SECTION_VISIBILITY };
  }

  public static saveSectionVisibility(visibility: SectionVisibility): void {
    try {
      localStorage.setItem(VISIBILITY_KEY, JSON.stringify(visibility));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static toggleSectionVisibility(sectionKey: keyof SectionVisibility): void {
    const current = this.getSectionVisibility();
    current[sectionKey] = !current[sectionKey];
    this.saveSectionVisibility(current);
  }

  public static resetSectionVisibility(): void {
    this.saveSectionVisibility({ ...DEFAULT_SECTION_VISIBILITY });
  }

  // Profile & Hero
  public static getProfile(): SiteProfile {
    try {
      const stored = localStorage.getItem(PROFILE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...DEFAULT_SITE_PROFILE,
          ...parsed,
          profilePhotos: Array.isArray(parsed.profilePhotos) && parsed.profilePhotos.length > 0
            ? parsed.profilePhotos
            : DEFAULT_SITE_PROFILE.profilePhotos
        };
      }
    } catch {}
    this.saveProfile(DEFAULT_SITE_PROFILE);
    return DEFAULT_SITE_PROFILE;
  }

  public static saveProfile(profile: SiteProfile): void {
    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
      this.notify();
    } catch (e) {
      console.error(e);
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
    try {
      const stored = localStorage.getItem(SPECIALTIES_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveSpecialties(SPECIALTIES_DATA);
    return SPECIALTIES_DATA;
  }

  public static saveSpecialties(specialties: SpecialtyItem[]): void {
    try {
      localStorage.setItem(SPECIALTIES_KEY, JSON.stringify(specialties));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static updateSpecialty(id: string, updates: Partial<SpecialtyItem>): void {
    const list = this.getSpecialties();
    const idx = list.findIndex(s => s.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveSpecialties([...list]);
    }
  }

  public static addSpecialty(specialty: Omit<SpecialtyItem, 'id'>): void {
    const list = this.getSpecialties();
    const newItem: SpecialtyItem = {
      ...specialty,
      id: 'spec_' + Date.now().toString(36)
    };
    this.saveSpecialties([...list, newItem]);
  }

  public static deleteSpecialty(id: string): void {
    const list = this.getSpecialties().filter(s => s.id !== id);
    this.saveSpecialties(list);
  }

  // Videos
  public static getVideos(): VideoItem[] {
    try {
      const stored = localStorage.getItem(VIDEOS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveVideos(DEFAULT_VIDEOS);
    return DEFAULT_VIDEOS;
  }

  public static saveVideos(videos: VideoItem[]): void {
    try {
      localStorage.setItem(VIDEOS_KEY, JSON.stringify(videos));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static addVideo(video: Omit<VideoItem, 'id' | 'createdAt'>): VideoItem {
    const list = this.getVideos();
    const newVideo: VideoItem = {
      ...video,
      id: 'vid_' + Date.now().toString(36),
      createdAt: Date.now()
    };
    this.saveVideos([newVideo, ...list]);
    return newVideo;
  }

  public static updateVideo(id: string, updates: Partial<VideoItem>): void {
    const list = this.getVideos();
    const idx = list.findIndex(v => v.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveVideos([...list]);
    }
  }

  public static deleteVideo(id: string): void {
    const list = this.getVideos().filter(v => v.id !== id);
    this.saveVideos(list);
  }

  // Documents (PDF, PPTX, Google Slides, Google Drive)
  public static getDocuments(): DocumentItem[] {
    try {
      const stored = localStorage.getItem(DOCUMENTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveDocuments(DEFAULT_DOCUMENTS);
    return DEFAULT_DOCUMENTS;
  }

  public static saveDocuments(docs: DocumentItem[]): void {
    try {
      localStorage.setItem(DOCUMENTS_KEY, JSON.stringify(docs));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static addDocument(doc: Omit<DocumentItem, 'id' | 'createdAt'>): DocumentItem {
    const list = this.getDocuments();
    const newDoc: DocumentItem = {
      ...doc,
      id: 'doc_' + Date.now().toString(36),
      createdAt: Date.now()
    };
    this.saveDocuments([newDoc, ...list]);
    return newDoc;
  }

  public static updateDocument(id: string, updates: Partial<DocumentItem>): void {
    const list = this.getDocuments();
    const idx = list.findIndex(d => d.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveDocuments([...list]);
    }
  }

  public static deleteDocument(id: string): void {
    const list = this.getDocuments().filter(d => d.id !== id);
    this.saveDocuments(list);
  }

  // Experience
  public static getExperiences(): WorkExperience[] {
    try {
      const stored = localStorage.getItem(EXPERIENCE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveExperiences(DEFAULT_EXPERIENCES);
    return DEFAULT_EXPERIENCES;
  }

  public static saveExperiences(items: WorkExperience[]): void {
    try {
      localStorage.setItem(EXPERIENCE_KEY, JSON.stringify(items));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static addExperience(item: Omit<WorkExperience, "id">): void {
    const list = this.getExperiences();
    const newItem = { ...item, id: "exp_" + Date.now().toString(36) };
    this.saveExperiences([...list, newItem]);
  }

  public static updateExperience(id: string, updates: Partial<WorkExperience>): void {
    const list = this.getExperiences();
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveExperiences([...list]);
    }
  }

  public static deleteExperience(id: string): void {
    const list = this.getExperiences().filter(e => e.id !== id);
    this.saveExperiences(list);
  }

  // Education
  public static getEducation(): EducationItem[] {
    try {
      const stored = localStorage.getItem(EDUCATION_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    this.saveEducation(DEFAULT_EDUCATION);
    return DEFAULT_EDUCATION;
  }

  public static saveEducation(items: EducationItem[]): void {
    try {
      localStorage.setItem(EDUCATION_KEY, JSON.stringify(items));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static addEducation(item: Omit<EducationItem, "id">): void {
    const list = this.getEducation();
    const newItem = { ...item, id: "edu_" + Date.now().toString(36) };
    this.saveEducation([...list, newItem]);
  }

  public static updateEducation(id: string, updates: Partial<EducationItem>): void {
    const list = this.getEducation();
    const idx = list.findIndex(e => e.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveEducation([...list]);
    }
  }

  public static deleteEducation(id: string): void {
    const list = this.getEducation().filter(e => e.id !== id);
    this.saveEducation(list);
  }

  // References
  public static getReferences(): ReferenceItem[] {
    try {
      const stored = localStorage.getItem(REFERENCES_KEY);
      if (stored !== null && stored !== undefined) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    try {
      localStorage.setItem(REFERENCES_KEY, JSON.stringify(DEFAULT_REFERENCES));
    } catch {}
    return [...DEFAULT_REFERENCES];
  }

  public static saveReferences(items: ReferenceItem[]): void {
    try {
      localStorage.setItem(REFERENCES_KEY, JSON.stringify(items));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static addReference(ref: Omit<ReferenceItem, "id">): void {
    const list = this.getReferences();
    const newRef = { ...ref, id: "ref_" + Date.now().toString(36) };
    this.saveReferences([...list, newRef]);
  }

  public static updateReference(id: string, updates: Partial<ReferenceItem>): void {
    const list = this.getReferences();
    const targetId = String(id).trim();
    const idx = list.findIndex(r => String(r.id).trim() === targetId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveReferences([...list]);
    }
  }

  public static deleteReference(id: string): void {
    const targetId = String(id).trim();
    const list = this.getReferences().filter(r => String(r.id).trim() !== targetId);
    this.saveReferences(list);
  }

  // Skills & Technical Competencies
  public static getSkills(): SkillItem[] {
    try {
      const stored = localStorage.getItem(SKILLS_KEY);
      if (stored !== null && stored !== undefined) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    try {
      localStorage.setItem(SKILLS_KEY, JSON.stringify(DEFAULT_SKILLS));
    } catch {}
    return [...DEFAULT_SKILLS];
  }

  public static saveSkills(items: SkillItem[]): void {
    try {
      localStorage.setItem(SKILLS_KEY, JSON.stringify(items));
      this.notify();
    } catch (e) {
      console.error(e);
    }
  }

  public static addSkill(skill: Omit<SkillItem, "id">): void {
    const list = this.getSkills();
    const newSkill: SkillItem = {
      ...skill,
      id: "skill_" + Date.now().toString(36)
    };
    this.saveSkills([...list, newSkill]);
  }

  public static updateSkill(id: string, updates: Partial<SkillItem>): void {
    const list = this.getSkills();
    const targetId = String(id).trim();
    const idx = list.findIndex(s => String(s.id).trim() === targetId);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      this.saveSkills([...list]);
    }
  }

  public static deleteSkill(id: string): void {
    const targetId = String(id).trim();
    const list = this.getSkills().filter(s => String(s.id).trim() !== targetId);
    this.saveSkills(list);
  }

  public static resetAllToDefaults(): void {
    this.saveProfile(DEFAULT_SITE_PROFILE);
    this.saveSpecialties(SPECIALTIES_DATA);
    this.saveSkills(DEFAULT_SKILLS);
    this.saveVideos(DEFAULT_VIDEOS);
    this.saveDocuments(DEFAULT_DOCUMENTS);
    this.saveExperiences(DEFAULT_EXPERIENCES);
    this.saveEducation(DEFAULT_EDUCATION);
    this.saveReferences(DEFAULT_REFERENCES);
    this.saveSectionVisibility(DEFAULT_SECTION_VISIBILITY);
  }

  public static subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify(): void {
    this.listeners.forEach(cb => cb());
  }
}
