import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Briefcase, 
  Check, 
  AlertCircle, 
  Building, 
  Calendar, 
  Trash2 
} from 'lucide-react';
import { WorkExperience } from '../types/portfolio';

interface AddEditExperienceModalProps {
  isOpen: boolean;
  experienceToEdit?: WorkExperience | null;
  onClose: () => void;
  onSave: (expData: Omit<WorkExperience, 'id'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

export const AddEditExperienceModal: React.FC<AddEditExperienceModalProps> = ({
  isOpen,
  experienceToEdit,
  onClose,
  onSave,
  onDelete
}) => {
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [period, setPeriod] = useState('2021 – 2026');
  const [descriptionText, setDescriptionText] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (experienceToEdit) {
      setRole(experienceToEdit.role);
      setCompany(experienceToEdit.company);
      setPeriod(experienceToEdit.period);
      setDescriptionText(experienceToEdit.description.join('\n'));
    } else {
      setRole('');
      setCompany('');
      setPeriod('2021 – 2026');
      setDescriptionText('');
    }
    setError(null);
  }, [experienceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role.trim()) {
      setError('Por favor indica el puesto o rol laboral.');
      return;
    }
    if (!company.trim()) {
      setError('Por favor indica la empresa o institución.');
      return;
    }

    const descList = descriptionText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    onSave({
      role: role.trim(),
      company: company.trim(),
      period: period.trim(),
      description: descList.length > 0 ? descList : ['Responsabilidades y logros en diseño y multimedia.']
    }, experienceToEdit ? experienceToEdit.id : undefined);

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        <motion.div
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
                <Briefcase className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  {experienceToEdit ? 'Editar Experiencia Laboral' : 'Añadir Experiencia Laboral'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Trayectoria profesional y cargos desempeñados
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
                Puesto o Rol *
              </label>
              <input
                type="text"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="ej. Diseñador Multimedia / Director de Arte"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Empresa o Institución *</span>
                </label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ej. UNICARIBE / World Sign"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Período *</span>
                </label>
                <input
                  type="text"
                  required
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  placeholder="ej. 2021 – 2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Funciones y Logros (Un logro por línea)
              </label>
              <textarea
                rows={4}
                value={descriptionText}
                onChange={(e) => setDescriptionText(e.target.value)}
                placeholder="Desarrollo de la identidad de marca...&#10;Gestión de producción gráfica en gran formato...&#10;Supervisión de calidad y entrega a tiempo..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors resize-none font-sans"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              {experienceToEdit && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`¿Eliminar la posición "${experienceToEdit.role}"?`)) {
                      onDelete(experienceToEdit.id);
                      onClose();
                    }
                  }}
                  className="px-3.5 py-2 text-xs font-mono text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-500/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Posición</span>
                </button>
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
                  <span>{experienceToEdit ? 'Guardar Cambios' : 'Añadir Posición'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
