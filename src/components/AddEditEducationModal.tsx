import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  GraduationCap, 
  Check, 
  AlertCircle, 
  Building, 
  Calendar, 
  Layers, 
  Trash2 
} from 'lucide-react';
import { EducationItem } from '../types/portfolio';

interface AddEditEducationModalProps {
  isOpen: boolean;
  educationToEdit?: EducationItem | null;
  onClose: () => void;
  onSave: (eduData: Omit<EducationItem, 'id'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

export const AddEditEducationModal: React.FC<AddEditEducationModalProps> = ({
  isOpen,
  educationToEdit,
  onClose,
  onSave,
  onDelete
}) => {
  const [title, setTitle] = useState('');
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('2025');
  const [category, setCategory] = useState<string>('Educación Superior e Idiomas');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (educationToEdit) {
      setTitle(educationToEdit.title);
      setInstitution(educationToEdit.institution);
      setYear(educationToEdit.year);
      setCategory(educationToEdit.category);
      setDescription(educationToEdit.description || '');
    } else {
      setTitle('');
      setInstitution('');
      setYear('2025');
      setCategory('Educación Superior e Idiomas');
      setDescription('');
    }
    setError(null);
    setConfirmDelete(false);
  }, [educationToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor indica el título del programa o certificación.');
      return;
    }
    if (!institution.trim()) {
      setError('Por favor indica la institución académica o entidad certificadora.');
      return;
    }

    onSave({
      title: title.trim(),
      institution: institution.trim(),
      year: year.trim() || '2025',
      category: category.trim(),
      description: description.trim() || undefined
    }, educationToEdit ? educationToEdit.id : undefined);

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            key="education-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg bg-[var(--modal-bg)] border border-[var(--border-strong)] rounded-2xl overflow-hidden shadow-2xl z-10 my-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-lg bg-[var(--accent-color)]/15 text-[var(--accent-color)]">
                <GraduationCap className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  {educationToEdit ? 'Editar Formación & Especialización' : 'Añadir Formación & Especialización'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Título, diplomado, certificación técnica o especialización
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-950/30 border border-red-500/40 rounded-xl flex items-center gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Título del Programa o Certificación *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ej. Licenciatura en Publicidad / Diplomado Docente Virtual"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Institución / Universidad *</span>
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="ej. UNAPEC / UNICARIBE / INFOTEP"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Año *</span>
                </label>
                <input
                  type="text"
                  required
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="2025"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                <span>Especialización / Área</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Educación Superior e Idiomas">Educación Superior e Idiomas</option>
                <option value="Desarrollo Web y Tecnología">Desarrollo Web y Tecnología</option>
                <option value="Publicidad, Audiovisual y Gestión">Publicidad, Audiovisual y Gestión</option>
                <option value="Diplomados & Docencia">Diplomados & Docencia</option>
                <option value="Certificaciones Especializadas">Certificaciones Especializadas</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Detalle / Contenido Clave (Opcional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Competencias adquiridas, horas académicas o mención de honor..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              {educationToEdit && onDelete ? (
                confirmDelete ? (
                  <div className="flex items-center gap-2 bg-red-950/60 border border-red-500/50 p-1.5 rounded-xl">
                    <span className="text-xs font-mono text-red-300 font-semibold px-1">¿Eliminar formación?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(educationToEdit.id);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold rounded-lg cursor-pointer transition-colors shadow"
                    >
                      Sí, Eliminar
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(false)}
                      className="px-2 py-1 text-neutral-300 hover:text-white text-xs font-mono rounded-lg cursor-pointer"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(true)}
                    className="px-3.5 py-2 text-xs font-mono text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Formación</span>
                  </button>
                )
              ) : <div />}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] rounded-xl transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-mono text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] rounded-xl transition-colors cursor-pointer font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{educationToEdit ? 'Guardar Cambios' : 'Añadir Formación'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
