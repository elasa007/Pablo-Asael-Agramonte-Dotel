import { Project, SpecialtyCategory } from '../types/portfolio';

// Initial curated projects reflecting Asael Agramonte's creative direction
const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_01',
    title: 'NOIR ARCHIVE 2026',
    category: 'Editorial',
    description: 'Monografía editorial encuadernada en lino japonés con stamping térmico en rojo carmesí. Un manifiesto visual sobre la arquitectura brutalista y el espacio negativo diseñado por Asael Agramonte.',
    client: 'Atelier Monochrome',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    documentType: 'pdf',
    documentName: 'Monografia-Noir-Archive-2026.pdf',
    tags: ['Editorial', 'Brutalismo', 'Print', 'PDF Completo'],
    featured: true,
    aspectRatio: '3:4',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 12
  },
  {
    id: 'proj_02',
    title: 'NEO-KINETIC SOCIAL LAUNCH',
    category: 'Social Media',
    description: 'Estrategia integral y dirección de arte para campaña viral multiformato en Instagram y TikTok. Superó los 8 millones de impresiones orgánicas en 72 horas.',
    client: 'Pulse Footwear Corp',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://vimeo.com/76979871',
    videoPlatform: 'vimeo',
    tags: ['Social Media', 'Motion 3D', 'Vimeo', 'Viral Content'],
    featured: true,
    aspectRatio: '9:16',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 8
  },
  {
    id: 'proj_03',
    title: 'SHADOW & SINEW: PORTRAIT STUDY',
    category: 'Fotografía',
    description: 'Serie fotográfica de retrato editorial en 35mm con iluminación natural dura de ventana y grading cinematográfico monocromo con toques de ámbar.',
    client: 'Vogue Man Preview',
    year: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    tags: ['Fotografía', '35mm', 'Retrato', 'Chiaroscuro'],
    featured: true,
    aspectRatio: '4:3',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 5
  },
  {
    id: 'proj_04',
    title: 'VALKYRIE BOTANICS BRAND IDENTITY',
    category: 'Branding',
    description: 'Sistema integral de identidad de marca, packaging cosmético botánico y dirección de arte para packaging de vidrio ahumado y tipografías talladas.',
    client: 'Valkyrie Botanics',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
    documentUrl: 'https://docs.google.com/presentation/d/1BfS_Z_yG2s1X9e_8/preview',
    documentType: 'google_slides',
    documentName: 'Brand-Manual-Valkyrie-Botanics.pptx',
    tags: ['Branding', 'Packaging', 'Google Slides', 'Presentación PPTX'],
    featured: false,
    aspectRatio: '16:9',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 3
  },
  {
    id: 'proj_05',
    title: 'CHRONO-METROPOLIS CONCEPT ART',
    category: 'Ilustración',
    description: 'Desarrollo de arte conceptual, visualización especulativa y diseño de universos para producciones de ciencia ficción y videojuegos independientes.',
    client: 'Studio Orbital',
    year: '2025',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    tags: ['Ilustración', 'Concept Art', 'Sci-Fi', 'Matte Painting'],
    featured: true,
    aspectRatio: '16:9',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'proj_06',
    title: 'ECHOES OF CRIMSON: FASHION FILM',
    category: 'Video',
    description: 'Dirección audiovisual y cinematografía experimental rodada con ópticas anamórficas de 50mm. Exploración del movimiento corporal, luz estroboscópica y color rojo saturado.',
    client: 'Maison Électrique Paris',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    videoPlatform: 'youtube',
    tags: ['Video', 'Fashion Film', 'YouTube 4K', 'Anamórfico'],
    featured: true,
    aspectRatio: '16:9',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 1
  }
];

const STORAGE_KEY = 'creativo_multimedia_projects_v1';

export class ProjectService {
  private static listeners: Array<(projects: Project[]) => void> = [];

  public static getProjects(): Project[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // LocalStorage access fallback
    }
    // Default initial seed
    this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }

  public static saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      this.notifyListeners(projects);
    } catch (e) {
      console.error('Error saving projects to localStorage', e);
    }
  }

  public static addProject(project: Omit<Project, 'id' | 'createdAt'>): Project {
    const current = this.getProjects();
    const newProject: Project = {
      ...project,
      id: 'proj_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: Date.now()
    };
    const updated = [newProject, ...current];
    this.saveProjects(updated);
    return newProject;
  }

  public static updateProject(id: string, updates: Partial<Project>): Project | null {
    const current = this.getProjects();
    const index = current.findIndex(p => p.id === id);
    if (index === -1) return null;
    const updatedProject = { ...current[index], ...updates };
    current[index] = updatedProject;
    this.saveProjects([...current]);
    return updatedProject;
  }

  public static deleteProject(id: string): boolean {
    const current = this.getProjects();
    const filtered = current.filter(p => p.id !== id);
    if (filtered.length === current.length) return false;
    this.saveProjects(filtered);
    return true;
  }

  public static resetToDefaults(): Project[] {
    this.saveProjects(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }

  public static subscribe(listener: (projects: Project[]) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(projects: Project[]) {
    this.listeners.forEach(cb => cb(projects));
  }
}
