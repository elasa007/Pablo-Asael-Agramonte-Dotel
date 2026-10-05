import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Mail, 
  Send, 
  ArrowUpRight, 
  Sparkles, 
  Phone, 
  Globe, 
  Award, 
  MapPin, 
  Edit3, 
  Share2, 
  Check, 
  MessageCircle,
  ExternalLink
} from 'lucide-react';
import { SiteProfile } from '../types/portfolio';

interface ContactSectionProps {
  profile?: SiteProfile;
  isAdmin?: boolean;
  onEditSection?: () => void;
  onDeleteSection?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  profile,
  isAdmin = false,
  onEditSection,
  onDeleteSection
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = profile?.emailPrimary || "asael.agramonte@gmail.com";
  const secondaryEmail = profile?.emailSecondary || "elasa007@gmail.com";
  const phones = profile?.phones || ["809 709 5650", "829 663 5650"];
  const primaryPhone = phones[0] || "809 709 5650";
  const cleanPhone = primaryPhone.replace(/\D/g, '');
  const address = profile?.address || "Calle Camino Real, Residencial El Sembrador V, Ciudad Juan Bosch, SDE";
  const contactTitle = profile?.contactTitle || "COORDENADAS & CONTACTO DIRECTO";
  const contactSubtitle = profile?.contactSubtitle || "Canales oficiales para contactar directamente a Lic. Asael Agramonte para dirección creativa, proyectos audiovisuales o consultoría.";
  const manifesto = profile?.manifestoText || "Como director creativo y diseñador multimedia, concibo cada proyecto como una obra integral que sintetiza arte visual, narrativa cinematográfica y diseño funcional. Mi enfoque abarca desde la dirección artística de campañas virales y branding hasta la producción audiovisual en 4K y la exploración editorial contemporánea.";

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  return (
    <>
      {/* Editorial Manifesto & Bio Section */}
      <section id="manifiesto" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] relative overflow-hidden transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Admin Bar */}
          {isAdmin && (
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3 p-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-xl shadow-sm">
              <span className="text-xs font-mono text-[var(--accent-color)] flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Sección Manifiesto & Contacto · Controles de Administración</span>
              </span>
              <div className="flex items-center gap-2">
                {onEditSection && (
                  <button
                    type="button"
                    onClick={onEditSection}
                    className="px-3 py-1.5 bg-[var(--bg-elevated)] hover:bg-[var(--accent-color)] hover:text-white text-xs font-mono text-[var(--text-primary)] rounded-lg border border-[var(--border-subtle)] transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar Textos & Contacto</span>
                  </button>
                )}
                {onDeleteSection && (
                  <button
                    type="button"
                    onClick={onDeleteSection}
                    className="px-3 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-mono rounded-lg border border-red-500/30 transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Ocultar sección Contacto de la vista pública"
                  >
                    <span>Ocultar Sección</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[var(--accent-color)] font-semibold">
                Perfil & Manifiesto Artístico
              </span>
              <h2 className="font-bebas text-5xl sm:text-6xl text-[var(--text-primary)] tracking-tight leading-none">
                {profile?.degreeTitle || "LIC. ASAEL AGRAMONTE"}
              </h2>
              <p className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                {profile?.roleTitle || "Director Creativo · Diseñador Multimedia"}
              </p>
              <div className="h-[2px] w-16 bg-[var(--accent-color)]" />
            </div>

            <div className="lg:col-span-7 space-y-6 text-[var(--text-secondary)] text-sm sm:text-base leading-relaxed">
              <p>
                {manifesto}
              </p>
              <p>
                {profile?.bioDetailed || "Experto en el manejo de herramientas de diseño y edición audiovisual (Adobe Creative Cloud, DaVinci Resolve, entre otras) para gestionar proyectos desde la conceptualización hasta la producción final."}
              </p>
              
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs font-mono border-t border-[var(--border-subtle)] pt-6">
                <div>
                  <span className="text-[var(--text-primary)] font-bold block text-sm">GLOBAL / REMOTO</span>
                  <span className="text-[var(--text-muted)]">Alcance Internacional</span>
                </div>
                <div>
                  <span className="text-[var(--text-primary)] font-bold block text-sm">ESPAÑOL / INGLÉS</span>
                  <span className="text-[var(--text-muted)]">Idiomas de Trabajo</span>
                </div>
                <div>
                  <span className="text-[var(--accent-color)] font-bold block text-sm">DISPONIBLE</span>
                  <span className="text-[var(--text-muted)]">Temporada {new Date().getFullYear()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Direct Contact Coordinates Section (Sin Solicitud de Proyecto) */}
      <section id="contacto" className="py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)] relative transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[var(--border-subtle)] gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent-color)] mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Canales Oficiales & Disponibilidad</span>
              </div>
              <h2 className="font-bebas text-5xl sm:text-6xl md:text-7xl tracking-tight text-[var(--text-primary)] leading-none">
                {contactTitle}
              </h2>
            </div>
            <p className="max-w-md text-sm text-[var(--text-secondary)] leading-relaxed">
              {contactSubtitle}
            </p>
          </div>

          {/* Editorial Grid of Contact Channels */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. Correo Electrónico */}
            <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/60 transition-all space-y-5 shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                  Correo Electrónico
                </span>
                <a 
                  href={`mailto:${email}`}
                  className="font-bebas text-2xl text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors block line-clamp-1"
                >
                  {email}
                </a>
                {secondaryEmail && (
                  <p className="text-xs font-mono text-[var(--text-muted)]">
                    Secundario: {secondaryEmail}
                  </p>
                )}
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
                <a 
                  href={`mailto:${email}`}
                  className="px-4 py-2 bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-white text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow-sm font-semibold"
                >
                  <span>Escribir Correo</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(email, 'email')}
                  className="p-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-secondary)] transition-colors cursor-pointer"
                  title="Copiar correo"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 2. Teléfonos & WhatsApp */}
            <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/60 transition-all space-y-5 shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                  Teléfonos & WhatsApp
                </span>
                <div className="space-y-0.5">
                  {phones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${phone.replace(/\s+/g, '')}`}
                      className="font-bebas text-2xl text-[var(--text-primary)] hover:text-[var(--accent-color)] transition-colors block"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
                <a 
                  href={`https://wa.me/1${cleanPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 shadow-sm font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chatear por WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(primaryPhone, 'phone')}
                  className="p-2 bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg text-xs font-mono text-[var(--text-secondary)] transition-colors cursor-pointer"
                  title="Copiar teléfono"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* 3. Ubicación & Red Oficial */}
            <div className="p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-secondary)] hover:border-[var(--accent-color)]/60 transition-all space-y-5 shadow-sm group">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--accent-color)] group-hover:scale-110 transition-transform">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider block">
                  Ubicación & Estudio
                </span>
                <p className="font-bebas text-2xl text-[var(--text-primary)] leading-tight">
                  CIUDAD JUAN BOSCH, SDE
                </p>
                <p className="text-xs font-mono text-[var(--text-muted)] line-clamp-2">
                  {address}
                </p>
              </div>
              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3">
                <a 
                  href="https://sites.google.com/view/asaelagramonte/inicio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[var(--bg-card)] hover:bg-[var(--accent-color)] hover:text-white border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)] rounded-lg transition-colors flex items-center gap-1.5 font-semibold"
                >
                  <span>Google Site Oficial</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* Bottom Trust Badge */}
          <div className="mt-12 p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-secondary)]">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10B981]" />
              <span>
                Atención directa con <strong>Lic. Asael Agramonte</strong> · Disponibilidad inmediata para contratos y consultoría multimedia.
              </span>
            </div>
            <div className="flex items-center gap-4 text-[var(--text-muted)]">
              <span>Santo Domingo, República Dominicana</span>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};
