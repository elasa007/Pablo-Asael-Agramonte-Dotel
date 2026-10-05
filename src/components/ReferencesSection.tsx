import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserCheck, 
  Phone, 
  Mail, 
  Building, 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Check,
  X,
  Share2 
} from 'lucide-react';
import { ReferenceItem } from '../types/portfolio';

interface ReferencesSectionProps {
  references: ReferenceItem[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onAddReference?: () => void;
  onEditReference?: (ref: ReferenceItem) => void;
  onDeleteReference?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({
  references,
  isAdmin = false,
  title = "REFERENCIAS LABORALES",
  subtitle = "Contactos directos de directores de operaciones, coordinadores y ejecutivos institucionales que respaldan la trayectoria profesional de Lic. Asael Agramonte.",
  onAddReference,
  onEditReference,
  onDeleteReference,
  onEditSection,
  onDeleteSection
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmHideSection, setConfirmHideSection] = useState(false);

  return (
    <section id="referencias" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Bar — STRICTLY ADMIN ONLY */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Referencias Laborales · Controles de Administración ({references.length} referencias)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddReference && (
                <button
                  type="button"
                  onClick={onAddReference}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Referencia</span>
                </button>
              )}
              {onEditSection && (
                <button
                  type="button"
                  onClick={onEditSection}
                  className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Editar Textos</span>
                </button>
              )}
              {onDeleteSection && (
                confirmHideSection ? (
                  <div className="flex items-center gap-1.5 bg-red-950/40 border border-red-500/40 px-2 py-1 rounded-lg">
                    <span className="text-[11px] font-mono text-red-400">¿Ocultar sección?</span>
                    <button
                      type="button"
                      onClick={() => {
                        onDeleteSection();
                        setConfirmHideSection(false);
                      }}
                      className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer"
                    >
                      Sí
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmHideSection(false)}
                      className="px-2 py-0.5 text-neutral-400 hover:text-white text-[10px] font-mono rounded cursor-pointer"
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmHideSection(true)}
                    className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Ocultar sección Referencias"
                  >
                    <span>Ocultar Sección</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[var(--border-subtle)] gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Verificación de Confianza & Referencias Profesionales</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* References Grid */}
        {references.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-[var(--border-strong)] rounded-2xl bg-[var(--bg-card)] text-[var(--text-muted)] text-xs font-mono">
            No hay referencias laborales registradas actualmente.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {references.map((ref, idx) => (
              <motion.div
                key={ref.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.08 }}
                className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/60 rounded-2xl p-7 flex flex-col justify-between space-y-6 transition-all group relative shadow-sm hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-105 transition-transform shadow-inner">
                      <UserCheck className="w-6 h-6" />
                    </div>

                    {/* Admin inline controls — STRICTLY ADMIN ONLY */}
                    {isAdmin && (
                      <div className="flex items-center gap-1.5">
                        {onEditReference && (
                          <button
                            type="button"
                            onClick={() => onEditReference(ref)}
                            className="p-1.5 text-neutral-400 hover:text-[var(--accent-color)] hover:bg-[var(--bg-elevated)] rounded-lg transition-colors cursor-pointer"
                            title="Editar referencia"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteReference && (
                          confirmDeleteId === ref.id ? (
                            <div className="flex items-center gap-1 bg-red-950/80 border border-red-500/60 p-1 rounded-lg shadow-lg z-20">
                              <span className="text-[10px] font-mono text-red-200 font-bold px-1">¿Eliminar?</span>
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteReference(ref.id);
                                  setConfirmDeleteId(null);
                                }}
                                className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono font-bold rounded cursor-pointer transition-colors shadow"
                                title="Confirmar eliminación"
                              >
                                Sí
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="p-0.5 text-neutral-300 hover:text-white rounded cursor-pointer"
                                title="Cancelar"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(ref.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                              title="Eliminar referencia"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bebas text-2xl sm:text-3xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors">
                      {ref.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--accent-color)] font-mono">
                      {ref.role}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] font-mono">
                      <Building className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                      <span>{ref.organization}</span>
                    </div>
                  </div>

                  {ref.relation && (
                    <p className="text-xs text-[var(--text-muted)] italic pt-2 border-t border-[var(--border-subtle)]">
                      "{ref.relation}"
                    </p>
                  )}
                </div>

                {/* Direct Contact Button */}
                <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                  <a
                    href={`tel:${ref.phone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] transition-colors font-semibold"
                  >
                    <Phone className="w-3.5 h-3.5 text-[var(--accent-color)] group-hover:text-white" />
                    <span>{ref.phone}</span>
                  </a>

                  {ref.email && (
                    <a
                      href={`mailto:${ref.email}`}
                      className="p-2 text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
                      title={ref.email}
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                {/* Admin Card Action Bar — STRICTLY ADMIN ONLY */}
                {isAdmin && (
                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end gap-2">
                    {onEditReference && (
                      <button
                        type="button"
                        onClick={() => onEditReference(ref)}
                        className="px-2.5 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-[var(--text-secondary)] rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 border border-[var(--border-subtle)]"
                        title="Editar referencia"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="font-mono">Editar</span>
                      </button>
                    )}
                    {onDeleteReference && (
                      confirmDeleteId === ref.id ? (
                        <div className="flex items-center gap-1.5 bg-red-950/90 border border-red-500/60 p-1 rounded-lg shadow-lg">
                          <span className="text-[10px] font-mono text-red-200 font-bold px-1.5">¿Eliminar?</span>
                          <button
                            type="button"
                            onClick={() => {
                              onDeleteReference(ref.id);
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-mono font-bold rounded cursor-pointer transition-colors shadow"
                            title="Confirmar eliminación"
                          >
                            Sí, Borrar
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-1.5 py-0.5 text-neutral-300 hover:text-white text-[11px] font-mono rounded cursor-pointer"
                            title="Cancelar"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(ref.id)}
                          className="px-2.5 py-1.5 bg-[var(--bg-elevated)] hover:bg-red-600 hover:text-white text-red-400 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1.5 border border-red-500/30"
                          title="Eliminar referencia"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="font-mono">Eliminar</span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
