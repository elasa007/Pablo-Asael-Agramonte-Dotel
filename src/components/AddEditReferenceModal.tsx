import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  UserCheck, 
  Check, 
  AlertCircle, 
  Phone, 
  Mail, 
  Building, 
  Trash2 
} from 'lucide-react';
import { ReferenceItem } from '../types/portfolio';

interface AddEditReferenceModalProps {
  isOpen: boolean;
  referenceToEdit?: ReferenceItem | null;
  onClose: () => void;
  onSave: (refData: Omit<ReferenceItem, 'id'>, existingId?: string) => void;
  onDelete?: (id: string) => void;
}

export const AddEditReferenceModal: React.FC<AddEditReferenceModalProps> = ({
  isOpen,
  referenceToEdit,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [organization, setOrganization] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (referenceToEdit) {
      setName(referenceToEdit.name);
      setRole(referenceToEdit.role);
      setOrganization(referenceToEdit.organization);
      setPhone(referenceToEdit.phone);
      setEmail(referenceToEdit.email || '');
      setRelation(referenceToEdit.relation || '');
    } else {
      setName('');
      setRole('');
      setOrganization('');
      setPhone('');
      setEmail('');
      setRelation('');
    }
    setError(null);
    setConfirmDelete(false);
  }, [referenceToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor indica el nombre de la persona o contacto.');
      return;
    }
    if (!phone.trim()) {
      setError('Por favor indica el número de teléfono de la referencia.');
      return;
    }

    onSave({
      name: name.trim(),
      role: role.trim() || 'Supervisor / Director',
      organization: organization.trim() || 'Empresa',
      phone: phone.trim(),
      email: email.trim() || undefined,
      relation: relation.trim() || undefined
    }, referenceToEdit ? referenceToEdit.id : undefined);

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <motion.div
            key="reference-backdrop"
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
                <UserCheck className="w-4 h-4" />
              </span>
              <div>
                <h3 className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide">
                  {referenceToEdit ? 'Editar Referencia Laboral' : 'Añadir Referencia Laboral'}
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Contacto oficial de respaldo profesional de Lic. Asael Agramonte
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
                Nombre y Título del Contacto *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ej. Lic. Víctor Rodríguez o Ing. Manuel Mercedes"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Cargo o Rol
                </label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="ej. Director de Operaciones / CEO"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                  Empresa u Organización
                </label>
                <input
                  type="text"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  placeholder="ej. World Sign / COOPSOEM / UNICARIBE"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Teléfono Directo *</span>
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="809 592 1212"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span>Correo (Opcional)</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contacto@empresa.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-secondary)] font-semibold">
                Relación / Vínculo Profesional (Opcional)
              </label>
              <input
                type="text"
                value={relation}
                onChange={(e) => setRelation(e.target.value)}
                placeholder="ej. Supervisor directo en proyectos de rotulación e impresión"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] text-sm focus:border-[var(--accent-color)] focus:outline-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[var(--border-subtle)]">
              {referenceToEdit && onDelete ? (
                confirmDelete ? (
                  <div className="flex items-center gap-2 bg-red-950/60 border border-red-500/50 p-1.5 rounded-xl">
                    <span className="text-xs font-mono text-red-300 font-semibold px-1">¿Eliminar referencia?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDelete(referenceToEdit.id);
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
                    <span>Eliminar Referencia</span>
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
                  <span>{referenceToEdit ? 'Guardar Cambios' : 'Añadir Referencia'}</span>
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
