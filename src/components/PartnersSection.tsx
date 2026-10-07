import React from 'react';
import { PARTNERS_DATA } from '../data/mockData';
import { ShieldCheck, Cpu, Mail, Linkedin, MessageSquare, Award, CheckCircle2 } from 'lucide-react';

interface HighResolutionPortraitProps {
  src: string;
  alt: string;
  enabled: boolean;
}

const HighResolutionPortrait: React.FC<HighResolutionPortraitProps> = ({ src, alt, enabled }) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    if (!enabled) return;

    const image = new Image();
    image.decoding = 'async';
    image.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // 4K-class portrait render: keep the original framing, upscale with
      // browser high-quality resampling, and apply a very subtle contrast
      // pass so the result stays natural rather than looking over-sharpened.
      const targetWidth = 2880;
      const targetHeight = 3840;
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      const sourceRatio = image.naturalWidth / image.naturalHeight;
      const targetRatio = targetWidth / targetHeight;
      let sx = 0;
      let sy = 0;
      let sw = image.naturalWidth;
      let sh = image.naturalHeight;

      if (sourceRatio > targetRatio) {
        sw = image.naturalHeight * targetRatio;
        sx = (image.naturalWidth - sw) / 2;
      } else {
        sh = image.naturalWidth / targetRatio;
        sy = (image.naturalHeight - sh) / 2;
      }

      ctx.filter = 'contrast(1.035) saturate(1.01)';
      ctx.drawImage(image, sx, sy, sw, sh, 0, 0, targetWidth, targetHeight);
      ctx.filter = 'none';
    };

    image.src = src;
  }, [src, enabled]);

  if (!enabled) {
    return (
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
    />
  );
};

interface PartnersSectionProps {
  onSelectPartnerForMeeting: (partnerName: string) => void;
  onOpenGmailWithRecipient?: (email: string, subject: string) => void;
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({
  onSelectPartnerForMeeting,
  onOpenGmailWithRecipient,
}) => {
  return (
    <section id="socios" className="py-24 sm:py-32 bg-[#090D15] border-b border-[#1E2638]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-3">
            <span>Governança Institucional & Liderança</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8FAFC]">
            Quadro de Sócios
          </h2>
          <p className="mt-4 font-sans-luxury text-base text-[#94A3B8] leading-relaxed">
            Uma sociedade arquitetada na confluência entre a alta estratégia processual nos tribunais e a ciência da computação aplicada ao direito.
          </p>
        </div>

        {/* Quadro de Sócios: Cada um em sua caixa individual de luxo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {PARTNERS_DATA.map((partner) => {
            const isMaurilo = partner.id === 'maurilo-cardoso';
            const isLorenzo = partner.id === 'lorenzo-cardoso';

            return (
              <div
                key={partner.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#232D42] bg-[#0C121E] hover:border-[#C5A880]/60 transition-all duration-300 shadow-xl"
              >
                {/* Top Subtle Accent Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#C5A880]/40 to-transparent" />

                <div className="p-6 sm:p-8 flex-1 flex flex-col">
                  {/* Partner Portrait & Core Header */}
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center pb-6 border-b border-[#1E2638]">
                    {/* Partner Official Portrait */}
                    <div className="flex flex-col items-center shrink-0 w-28 sm:w-32">
                      <div className="relative w-28 h-36 sm:w-32 sm:h-40 rounded-lg overflow-hidden border border-[#2B374E] shadow-md">
                        <HighResolutionPortrait
                          src={partner.image}
                          alt={partner.name}
                          enabled={isMaurilo || partner.id === 'luana-andrade'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17]/80 via-transparent to-transparent pointer-events-none" />
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A880] font-sans-luxury font-medium mb-1">
                        {isMaurilo ? (
                          <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                        ) : isLorenzo ? (
                          <Cpu className="w-4 h-4 text-[#C5A880]" />
                        ) : (
                          <Award className="w-4 h-4 text-[#C5A880]" />
                        )}
                        <span>{partner.badge}</span>
                      </div>

                      <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8FAFC]">
                        {partner.name}
                      </h3>
                      <p className="mt-1 font-sans-luxury text-xs sm:text-sm text-[#94A3B8]">
                        {partner.role}
                      </p>

                      <div className="mt-4 flex items-center gap-3">
                        {onOpenGmailWithRecipient ? (
                          <button
                            type="button"
                            onClick={() =>
                              onOpenGmailWithRecipient(
                                partner.email,
                                `Consulta Processual · ${partner.name}`
                              )
                            }
                            className="p-2 rounded border border-[#2A344A] bg-[#111827] text-slate-300 hover:text-[#C5A880] hover:border-[#C5A880]/50 transition-colors cursor-pointer"
                            title={`Enviar mensagem via Gmail Oficial para ${partner.name}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <a
                            href={`mailto:${partner.email}`}
                            className="p-2 rounded border border-[#2A344A] bg-[#111827] text-slate-300 hover:text-[#C5A880] hover:border-[#C5A880]/50 transition-colors"
                            title={`Enviar e-mail para ${partner.name}`}
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                        )}
                        <a
                          href={partner.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded border border-[#2A344A] bg-[#111827] text-slate-300 hover:text-[#C5A880] hover:border-[#C5A880]/50 transition-colors"
                          title="LinkedIn Oficial"
                        >
                          <Linkedin className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={partner.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded border border-[#2A344A] bg-[#111827] text-slate-300 hover:text-[#25D366] hover:border-[#25D366]/50 transition-colors"
                          title="WhatsApp Direto"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Partner Bio & Direct Quote */}
                  <div className="mt-6 flex-1">
                    <p className="font-sans-luxury text-sm text-[#CBD5E1] leading-relaxed">
                      {partner.bio}
                    </p>

                    <blockquote className="mt-5 p-4 rounded-lg bg-[#080B11]/70 border-l-2 border-[#C5A880] italic font-cormorant text-base text-[#E2E8F0]">
                      "{partner.quote}"
                    </blockquote>
                  </div>

                  {/* Credentials & Distinctions */}
                  <div className="mt-6 pt-6 border-t border-[#1E2638]">
                    <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-medium mb-3">
                      Credenciais e Atuação Institucional
                    </div>
                    <ul className="space-y-2">
                      {partner.credentials.map((cred, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                          <span>{cred}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Specializations Tags (Unboxed / Clean Subtle Grid) */}
                  <div className="mt-6 pt-6 border-t border-[#1E2638]">
                    <div className="text-xs uppercase tracking-wider text-[#94A3B8] font-medium mb-3">
                      Áreas de Especialização
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 font-sans-luxury">
                      {partner.specialties.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 py-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Box Footer Action Button */}
                <div className="p-6 bg-[#090E18] border-t border-[#1E2638] flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => onSelectPartnerForMeeting(partner.name)}
                    className="flex-1 w-full py-3 px-4 text-xs font-semibold tracking-wider uppercase text-[#0B0F17] bg-[#C5A880] hover:bg-[#D4AF37] rounded transition-colors cursor-pointer text-center"
                  >
                    Agendar Reunião com {partner.name}
                  </button>
                  <a
                    href={partner.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-4 py-3 text-xs font-semibold text-emerald-300 border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded transition-colors flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                    title={`Falar com ${partner.name} no WhatsApp`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
