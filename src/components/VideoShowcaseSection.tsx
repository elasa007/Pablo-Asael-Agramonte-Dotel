import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Play, 
  Film, 
  Sparkles, 
  Clock, 
  User, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink,
  Sliders
} from 'lucide-react';
import { VideoItem } from '../types/portfolio';

interface VideoShowcaseSectionProps {
  videos: VideoItem[];
  isAdmin?: boolean;
  title?: string;
  subtitle?: string;
  onPlayVideo: (video: VideoItem) => void;
  onAddVideo?: () => void;
  onEditVideo?: (video: VideoItem) => void;
  onDeleteVideo?: (id: string) => void;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({
  videos,
  isAdmin = false,
  title = "PRODUCCIÓN AUDIOVISUAL & SHOWREELS",
  subtitle = "Dirección cinematográfica, edición de video, motion graphics y diseño sonoro. Proyectos transmitidos e integrados desde YouTube, Vimeo y Google Drive.",
  onPlayVideo,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onEditSection,
  onDeleteSection
}) => {
  const [filter, setFilter] = useState<'Todos' | 'Showreel' | 'Spot Publicitario' | 'Motion Graphics' | 'Audiovisual'>('Todos');

  const filteredVideos = filter === 'Todos' 
    ? videos 
    : videos.filter(v => v.category === filter);

  const featuredVideo = videos.find(v => v.featured) || videos[0];

  return (
    <section id="videos" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] relative transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-[var(--accent-color)]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Admin Bar — STRICTLY ADMIN ONLY */}
        {isAdmin && (
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
            <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sección Videos & Showreels · Controles de Administración ({videos.length} videos)</span>
            </span>
            <div className="flex items-center gap-2">
              {onAddVideo && (
                <button
                  type="button"
                  onClick={onAddVideo}
                  className="px-3 py-1.5 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Añadir Video (YouTube / Vimeo / Drive)</span>
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
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('¿Deseas ocultar la sección de Videos de la vista pública? Podrás restaurarla en cualquier momento desde el Gestor de Secciones.')) {
                      onDeleteSection();
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                  title="Ocultar sección Videos"
                >
                  <span>Ocultar Sección</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[var(--border-subtle)] gap-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
              <Film className="w-3.5 h-3.5" />
              <span>Dirección & Realización Multimedia</span>
            </div>
            <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
              {title}
            </h2>
          </div>
          <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        {/* Featured Video Cinema Card (if available) */}
        {featuredVideo && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14 relative group rounded-2xl overflow-hidden border border-[var(--border-strong)] bg-neutral-950 shadow-2xl"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Video Thumbnail / Screen (7 cols) */}
              <div 
                onClick={() => onPlayVideo(featuredVideo)}
                className="lg:col-span-7 relative aspect-video bg-black overflow-hidden cursor-pointer group/player"
              >
                <img
                  src={featuredVideo.thumbnailUrl}
                  alt={featuredVideo.title}
                  className="w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-700 opacity-90 group-hover/player:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Big Floating Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[var(--accent-color)] text-white flex items-center justify-center shadow-2xl group-hover/player:scale-110 group-hover/player:bg-white group-hover/player:text-black transition-all duration-300">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>
                </div>

                {/* Platform Badge on video */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs font-mono uppercase tracking-wider font-semibold">
                    {featuredVideo.platform === 'youtube' ? 'YouTube' : featuredVideo.platform === 'vimeo' ? 'Vimeo' : 'Google Drive'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[var(--accent-color)] text-white text-xs font-mono uppercase font-bold tracking-wider">
                    ★ Destacado
                  </span>
                </div>

                {featuredVideo.duration && (
                  <div className="absolute bottom-4 right-4 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-xs font-mono flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                    <span>{featuredVideo.duration}</span>
                  </div>
                )}
              </div>

              {/* Video Story & Info (5 cols) */}
              <div className="lg:col-span-5 p-8 lg:p-10 flex flex-col justify-between h-full space-y-6 bg-[var(--bg-secondary)]">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-bold">
                      {featuredVideo.category} · {featuredVideo.year || '2026'}
                    </span>
                    {/* Admin actions if logged in */}
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        {onEditVideo && (
                          <button
                            type="button"
                            onClick={() => onEditVideo(featuredVideo)}
                            className="p-1.5 text-[var(--text-muted)] hover:text-white hover:bg-[var(--accent-color)] rounded-lg transition-colors cursor-pointer"
                            title="Editar video"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                        {onDeleteVideo && (
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`¿Eliminar "${featuredVideo.title}"?`)) {
                                onDeleteVideo(featuredVideo.id);
                              }
                            }}
                            className="p-1.5 text-[var(--text-muted)] hover:text-white hover:bg-red-600 rounded-lg transition-colors cursor-pointer"
                            title="Eliminar video"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <h3 className="font-bebas text-3xl sm:text-4xl text-[var(--text-primary)] tracking-wide leading-tight">
                    {featuredVideo.title}
                  </h3>

                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {featuredVideo.description}
                  </p>

                  {featuredVideo.client && (
                    <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-secondary)] pt-2 border-t border-[var(--border-subtle)]">
                      <User className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                      <span>Cliente: <strong className="text-[var(--text-primary)]">{featuredVideo.client}</strong></span>
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onPlayVideo(featuredVideo)}
                    className="inline-flex items-center justify-center gap-2.5 px-6 py-3 text-xs font-mono uppercase tracking-wider text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] rounded-xl transition-all cursor-pointer font-semibold shadow-lg shadow-[var(--accent-color)]/20"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>Reproducir Video</span>
                  </button>

                  {featuredVideo.url && (
                    <a
                      href={featuredVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <span>Ver enlace</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Video Grid for Other Pieces */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredVideos.map((video, index) => {
            const isYouTube = video.platform === 'youtube';
            const isVimeo = video.platform === 'vimeo';

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: (index % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="group relative rounded-2xl overflow-hidden border border-[var(--border-subtle)] hover:border-[var(--accent-color)] bg-[var(--bg-secondary)] flex flex-col justify-between transition-all duration-300 shadow-md hover:shadow-xl"
              >
                {/* Thumbnail Card with Play Overlay */}
                <div 
                  onClick={() => onPlayVideo(video)}
                  className="relative aspect-video bg-neutral-900 overflow-hidden cursor-pointer"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Icon Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center group-hover:bg-[var(--accent-color)] group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {/* Platform Tag */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono uppercase text-white font-semibold border border-white/10">
                    {isYouTube ? 'YouTube' : isVimeo ? 'Vimeo' : 'Drive'}
                  </span>

                  {video.duration && (
                    <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/80 text-white text-[10px] font-mono">
                      {video.duration}
                    </span>
                  )}

                  {/* Admin inline controls — STRICTLY ADMIN ONLY */}
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 z-20">
                      {onEditVideo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditVideo(video);
                          }}
                          className="p-1.5 bg-black/80 hover:bg-[var(--accent-color)] text-white rounded-lg transition-colors cursor-pointer shadow"
                          title="Editar video"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeleteVideo && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`¿Eliminar video "${video.title}"?`)) {
                              onDeleteVideo(video.id);
                            }
                          }}
                          className="p-1.5 bg-black/80 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer shadow"
                          title="Eliminar video"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[var(--accent-color)] uppercase font-semibold">
                      <span>{video.category}</span>
                      <span className="text-[var(--text-muted)]">{video.year || '2026'}</span>
                    </div>

                    <h4 
                      onClick={() => onPlayVideo(video)}
                      className="font-bebas text-2xl text-[var(--text-primary)] tracking-wide group-hover:text-[var(--accent-color)] transition-colors cursor-pointer line-clamp-1"
                    >
                      {video.title}
                    </h4>

                    {video.description && (
                      <p className="text-xs text-[var(--text-secondary)] line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono">
                    <span className="text-[var(--text-muted)] truncate max-w-[150px]">
                      {video.client ? `Cliente: ${video.client}` : 'Showcase'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onPlayVideo(video)}
                      className="text-[var(--accent-color)] hover:underline flex items-center gap-1 cursor-pointer font-semibold"
                    >
                      <span>Ver Video</span>
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
