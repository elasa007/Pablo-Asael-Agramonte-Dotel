import { Project, SpecialtyCategory } from '../types/portfolio';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs,
  query,
  orderBy
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

// Initial curated projects reflecting Asael Agramonte's creative direction
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj_01',
    title: 'NOIR ARCHIVE 2026',
    category: 'Editorial',
    description: 'Monografía editorial encuadernada en lino japonés con stamping térmico en rojo carmesí. Un manifiesto visual sobre la arquitectura brutalista y el espacio negativo diseñado por Asael Agramonte.',
    client: 'Atelier Monochrome',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1200&q=80'
    ],
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
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80'
    ],
    tags: ['Ilustración', 'Concept Art', 'Sci-Fi', 'Matte Painting'],
    featured: true,
    aspectRatio: '16:9',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 2
  },
  {
    id: 'proj_06',
    title: 'DECK ESTRATÉGICO B2B CORPORATIVO',
    category: 'Presentaciones',
    description: 'Diseño de presentación ejecutiva de alta gama para captación de capital e inversores institucionales, con gráficos de datos y arquitectura de producto.',
    client: 'FinTech Horizons',
    year: '2026',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80'
    ],
    documentUrl: 'https://view.officeapps.live.com/op/embed.aspx?src=https%3A%2F%2Fraw.githubusercontent.com%2Fmozilla%2Fpdf.js%2Fmaster%2Fexamples%2Flearning%2Fhelloworld.pdf',
    documentType: 'pptx',
    documentName: 'Propuesta-Comercial-B2B.pptx',
    tags: ['Diapositivas', 'PowerPoint', 'Keynote', 'B2B', 'Presentación PPTX'],
    featured: true,
    aspectRatio: '16:9',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 10
  }
];

export class ProjectService {
  private static cachedProjects: Project[] = INITIAL_PROJECTS;
  private static isInitialized = false;
  private static listeners: Array<(projects: Project[]) => void> = [];

  public static initialize(): void {
    if (this.isInitialized) return;
    this.isInitialized = true;

    try {
      const projectsCol = collection(db, 'projects');
      onSnapshot(projectsCol, async (snapshot) => {
        if (snapshot.empty) {
          // Auto-seed initial projects into Firestore if collection is empty
          this.seedInitialProjects();
        } else {
          const loaded: Project[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push(docSnap.data() as Project);
          });
          // Sort newest first
          loaded.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
          this.cachedProjects = loaded;
          this.notifyListeners(loaded);
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, 'projects');
      });
    } catch (error) {
      console.error('Failed to initialize projects listener', error);
    }
  }

  private static async seedInitialProjects() {
    try {
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
    } catch (e) {
      console.warn('Could not seed initial projects to Firestore (may need admin auth):', e);
    }
  }

  public static getProjects(): Project[] {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.cachedProjects;
  }

  public static async addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const newId = 'proj_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
    const newProject: Project = {
      ...project,
      id: newId,
      createdAt: Date.now()
    };

    try {
      await setDoc(doc(db, 'projects', newId), newProject);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `projects/${newId}`);
    }

    // Optimistic update
    this.cachedProjects = [newProject, ...this.cachedProjects.filter(p => p.id !== newId)];
    this.notifyListeners(this.cachedProjects);
    return newProject;
  }

  public static async updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
    const existing = this.cachedProjects.find(p => p.id === id);
    if (!existing) return null;

    const updatedProject: Project = {
      ...existing,
      ...updates
    };

    try {
      await updateDoc(doc(db, 'projects', id), updates as any);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
    }

    // Optimistic update
    this.cachedProjects = this.cachedProjects.map(p => p.id === id ? updatedProject : p);
    this.notifyListeners(this.cachedProjects);
    return updatedProject;
  }

  public static async deleteProject(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
    }

    // Optimistic update
    this.cachedProjects = this.cachedProjects.filter(p => p.id !== id);
    this.notifyListeners(this.cachedProjects);
    return true;
  }

  public static async resetToDefaults(): Promise<Project[]> {
    try {
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), p);
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'projects');
    }
    this.cachedProjects = INITIAL_PROJECTS;
    this.notifyListeners(INITIAL_PROJECTS);
    return INITIAL_PROJECTS;
  }

  public static subscribe(listener: (projects: Project[]) => void): () => void {
    if (!this.isInitialized) {
      this.initialize();
    }
    this.listeners.push(listener);
    // Send immediate current state
    listener(this.cachedProjects);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notifyListeners(projects: Project[]) {
    this.listeners.forEach(cb => cb(projects));
  }
}

// Auto initialize on load
ProjectService.initialize();
