import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Cpu, 
  Check, 
  AlertCircle, 
  Trash2, 
  Sparkles,
  Layers,
  Sliders,
  Palette
} from 'lucide-react';
import { SkillItem, SkillCategory } from '../types/portfolio';

interface AddEditSkillModalProps {
  isOpen: boolean;
  skillToEdit?: SkillItem | null;
  onClose: () => void;
  onSave: (skillData: Omit<SkillItem, 'id'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

const SKILL_CATEGORIES: SkillCategory[] = [
  'Diseño Gráfico & Editorial',
  'Edición & Postproducción Audiovisual',
  'Artes Visuales & Fotografía',
  'Producción & Gran Formato',
  'Web & Nuevas Tecnologías'
];

export const AddEditSkillModal: React.FC<AddEditSkillModalProps> = ({
  isOpen,
  skillToEdit,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<SkillCategory>('Diseño Gráfico & Editorial');
  const [level, setLevel] = useState('Nivel Experto');
  const [percentage, setPercentage] = useState(95);
  const [description, setDescription] = useState('');
  const [accentColor, setAccentColor] = useState('#E53935');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (skillToEdit) {
      setName(skillToEdit.name);
      setCategory(skillToEdit.category);
      setLevel(skillToEdit.level || 'Dominio Avanzado');
      setPercentage(skillToEdit.percentage || 90);
      setDescription(skillToEdit.description || '');
      setAccentColor(skillToEdit.accentColor || '#E53935');
    } else {
      setName('');
      setCategory('Diseño Gráfico & Editorial');
      setLevel('Nivel Experto');
      setPercentage(95);
      setDescription('');
      setAccentColor('#E53935');
    }
    setError(null);
    setConfirmDelete(false);
  }, [skillToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor indica el nombre de la herramienta o habilidad.');
      return;
    }
    if (!description.trim()) {
      setError('Por favor añade una breve descripción de aplicación práctica.');
      return;
    }

    onSave({
      name: name.trim(),
      category,
      level: level.trim() || 'Dominio Avanzado',
      percentage: Number(percentage) || 90,
      description: description.trim(),
      accentColor
    }, skillToEdit ? skillToEdit.id : undefined);

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
                <Cpu className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  {skillToEdit ? 'Editar Competencia / Skill' : 'Añadir Nueva Competencia'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Software, técnicas y herramientas de dominio profesional
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
                Nombre de la Herramienta o Habilidad *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Adobe Photoshop, DaVinci Resolve, Diseño Web..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Categoría Profesional *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SkillCategory)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs focus:border-[var(--accent-color)] focus:outline-none transition-colors cursor-pointer"
                >
                  {SKILL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Nivel de Dominio
                </label>
                <input
                  type="text"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  placeholder="ej. Nivel Experto / Dominio Avanzado"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                    Porcentaje de Dominio: {percentage}%
                  </label>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  step="1"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full accent-[var(--accent-color)] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Color Representativo
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-10 h-10 rounded-lg border border-[var(--border-subtle)] cursor-pointer p-0.5 bg-[var(--bg-elevated)]"
                  />
                  <input
                    type="text"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Descripción de Aplicación Práctica *
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalla cómo aplica esta herramienta en proyectos reales (retoque, flujos, formatos, etc.)..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-xs leading-relaxed focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              {skillToEdit && onDelete ? (
                confirmDelete ? (
                  <div className="flex items-center gap-2 bg-red-950/60 border border-red-500/50 p-1.5 rounded-xl">
                    <span className="text-xs font-mono text-red-300 font-semibold px-1">¿Eliminar skill?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(skillToEdit.id);
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
                    className="px-3 py-2 text-xs font-mono text-red-400 hover:text-white hover:bg-red-600 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 border border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar Skill</span>
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
                  <span>{skillToEdit ? 'Guardar Cambios' : 'Añadir Skill'}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
