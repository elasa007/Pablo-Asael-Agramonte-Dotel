import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Sparkles, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  PenTool, 
  Film, 
  BookOpen, 
  FileCheck, 
  Shapes, 
  LayoutGrid, 
  Camera, 
  Printer, 
  Globe, 
  Brush, 
  GraduationCap, 
  Sliders,
  CheckCircle2,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { SkillItem, SkillCategory } from '../types/portfolio';

interface SkillsSectionProps {
  skills: SkillItem[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onAddSkill?: () => void;
  onEditSkill?: (skill: SkillItem) => void;
  onDeleteSkill?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

// Icon mapping helper for software and disciplines
const getSkillIcon = (name: string, category: string) => {
  const lowerName = name.toLowerCase();
  if (lowerName.includes('photoshop')) return { icon: ImageIcon, monogram: 'Ps', color: '#31A8FF' };
  if (lowerName.includes('illustrator')) return { icon: PenTool, monogram: 'Ai', color: '#FF9A00' };
  if (lowerName.includes('premiere')) return { icon: Film, monogram: 'Pr', color: '#9999FF' };
  if (lowerName.includes('indesign')) return { icon: BookOpen, monogram: 'Id', color: '#FF3366' };
  if (lowerName.includes('acrobat')) return { icon: FileCheck, monogram: 'Ac', color: '#E53935' };
  if (lowerName.includes('coreldraw')) return { icon: Shapes, monogram: 'Cd', color: '#00C853' };
  if (lowerName.includes('canva')) return { icon: LayoutGrid, monogram: 'Cv', color: '#00C4CC' };
  if (lowerName.includes('davinci')) return { icon: Sliders, monogram: 'Dv', color: '#FF6D00' };
  if (lowerName.includes('fotograf')) return { icon: Camera, monogram: 'Ph', color: '#FF5252' };
  if (lowerName.includes('impresi') || lowerName.includes('gigantograf')) return { icon: Printer, monogram: 'Prn', color: '#E53935' };
  if (lowerName.includes('web')) return { icon: Globe, monogram: 'Web', color: '#2979FF' };
  if (lowerName.includes('ilustrac')) return { icon: Brush, monogram: 'Il', color: '#AA00FF' };
  if (lowerName.includes('inteligencia') || lowerName.includes('ia') || lowerName.includes('ai')) return { icon: Cpu, monogram: 'AI', color: '#7C4DFF' };
  if (lowerName.includes('elearning') || lowerName.includes('learning')) return { icon: GraduationCap, monogram: 'eL', color: '#00B0FF' };
  return { icon: Sparkles, monogram: 'Sk', color: '#E53935' };
};

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  isAdmin = false,
  title = "HABILIDADES & COMPETENCIAS TÉCNICAS",
  subtitle = "Dominio integral de suites de diseño, postproducción cinematográfica, pre-prensa, gran formato y tecnologías emergentes.",
  onAddSkill,
  onEditSkill,
  onDeleteSkill,
  onEditSection,
  onDeleteSection
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmHideSection, setConfirmHideSection] = useState(false);

  // Extract unique categories dynamically
  const categories = useMemo(() => {
    const unique = Array.from(new Set(skills.map(s => s.category)));
    return ['Todos', ...unique];
  }, [skills]);

  // Filter skills by category and search
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      const matchesCategory = selectedCategory === 'Todos' || skill.category === selectedCategory;
      const matchesSearch = 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [skills, selectedCategory, searchQuery]);

  return (
    <section id="skills" className="py-14 sm:py-16 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] transition-colors duration-300 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Bar — STRICTLY ADMIN ONLY */}
        {isAdmin && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Competencias · Administración ({skills.length} registradas)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddSkill && (
                <button
                  type="button"
                  onClick={onAddSkill}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Skill</span>
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
                    <span className="text-[11px] font-mono text-red-400">¿Ocultar?</span>
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
                    title="Ocultar sección Competencias"
                  >
                    <span>Ocultar Sección</span>
                  </button>
                )
              )}
            </div>
          </div>
        )}

        {/* Section Header (Compact) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[var(--border-subtle)] gap-4"
        >
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-1.5">
              <Cpu className="w-3.5 h-3.5" />
              <span>Arsenal Tecnológico & Creativo</span>
            </div>
            <h2 className="font-bebas text-4xl sm:text-5xl md:text-6xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Quick Filter Bar & Search (Compact) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-3"
        >
          {/* Category Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            {categories.map((cat) => {
              const count = cat === 'Todos' 
                ? skills.length 
                : skills.filter(s => s.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat
                      ? 'bg-[var(--accent-color)] text-white font-semibold shadow-sm'
                      : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    selectedCategory === cat ? 'bg-black/20 text-white' : 'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar software o técnica..."
              className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono focus:border-[var(--accent-color)] focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Skills Cards Grid — Compact 4-column layout */}
        {filteredSkills.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-[var(--border-strong)] rounded-xl p-6 bg-[var(--bg-card)]">
            <Cpu className="w-7 h-7 text-[var(--text-muted)] mx-auto mb-2" />
            <p className="font-bebas text-xl text-[var(--text-secondary)]">No se encontraron competencias</p>
            <p className="text-xs text-[var(--text-muted)] mt-1 font-mono">
              Intenta con otro término de búsqueda o selecciona "Todos".
            </p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                className="mt-3 px-3 py-1.5 bg-[var(--accent-color)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer"
              >
                Restablecer Filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {filteredSkills.map((skill, index) => {
              const { monogram, color } = getSkillIcon(skill.name, skill.category);
              const customColor = skill.accentColor || color;

              return (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.35, delay: (index % 4) * 0.04, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-[var(--bg-card)] border border-[var(--border-subtle)] hover:border-[var(--accent-color)]/60 rounded-xl p-3.5 flex flex-col justify-between transition-all group relative shadow-xs hover:shadow-md hover:-translate-y-0.5"
                >
                  <div>
                    {/* Top Row: Icon Monogram + Title & Category + Percentage Badge */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white shadow-inner font-mono shrink-0 transition-transform group-hover:scale-105"
                          style={{ 
                            backgroundColor: `${customColor}22`,
                            border: `1px solid ${customColor}50`,
                            color: customColor 
                          }}
                        >
                          <span className="font-bebas text-xl tracking-wider">{monogram}</span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bebas text-lg sm:text-xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors leading-tight truncate">
                            {skill.name}
                          </h3>
                          <span className="text-[10px] font-mono text-[var(--text-muted)] truncate block -mt-0.5">
                            {skill.category} · {skill.level}
                          </span>
                        </div>
                      </div>

                      {/* Percentage Badge */}
                      <span className="px-2 py-0.5 rounded-md bg-[var(--bg-secondary)] border border-[var(--border-subtle)] font-mono text-[11px] font-bold text-[var(--text-primary)] shrink-0">
                        {skill.percentage}%
                      </span>
                    </div>

                    {/* Compact Progress Bar */}
                    <div className="w-full h-1 bg-[var(--bg-secondary)] rounded-full overflow-hidden mt-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.percentage}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: customColor }}
                      />
                    </div>

                    {/* Concise 2-line Description */}
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed mt-2">
                      {skill.description}
                    </p>
                  </div>

                  {/* Admin Actions Bar (Compact) — STRICTLY ADMIN ONLY */}
                  {isAdmin && (
                    <div className="pt-2 mt-2 border-t border-[var(--border-subtle)] flex items-center justify-end gap-1.5">
                      {onEditSkill && (
                        <button
                          type="button"
                          onClick={() => onEditSkill(skill)}
                          className="p-1 hover:bg-[var(--accent-color)] hover:text-white text-[var(--text-muted)] rounded transition-colors cursor-pointer"
                          title="Editar skill"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteSkill && (
                        confirmDeleteId === skill.id ? (
                          <div className="flex items-center gap-1 bg-red-950/90 border border-red-500/60 px-1 py-0.5 rounded">
                            <span className="text-[9px] font-mono text-red-200">¿Borrar?</span>
                            <button
                              type="button"
                              onClick={() => {
                                onDeleteSkill(skill.id);
                                setConfirmDeleteId(null);
                              }}
                              className="px-1.5 py-0.2 bg-red-600 hover:bg-red-700 text-white text-[9px] font-mono font-bold rounded cursor-pointer"
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-1 text-neutral-400 hover:text-white text-[9px] font-mono rounded cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(skill.id)}
                            className="p-1 hover:bg-red-600 hover:text-white text-red-400 rounded transition-colors cursor-pointer"
                            title="Eliminar skill"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
