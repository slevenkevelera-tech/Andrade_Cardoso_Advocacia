import React from 'react';
import { ArrowUpRight, Scale, Cpu, Search, Sparkles, MessageSquare } from 'lucide-react';

interface HeroSectionProps {
  onOpenConsultation: () => void;
  onExploreJurisprudence: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenConsultation,
  onExploreJurisprudence,
}) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden border-b border-[#1E2638] bg-[#080B11]">
      {/* Background Image with Measured Contrast Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-advocacia-luxury.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center opacity-35 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080B11]/95 via-[#080B11]/72 to-[#080B11]/48" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080B11] via-[#080B11]/62 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_72%_42%,rgba(197,168,128,0.12),transparent)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center lg:px-8">
        {/* Zero-Pill Unboxed Trust Metadata */}
        <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880]">
          <span>Subseção OAB Cametá / PA</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Atuação Estratégica nos Tribunais Superiores</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span>Engenharia de Automação & Codex API</span>
        </div>

        {/* Primary Display Headline with Balanced Wrapping */}
        <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#F8FAFC] max-w-5xl mx-auto leading-[1.15] text-balance">
          Advocacia de Alta Complexidade & <span className="gold-gradient-text">Engenharia Jurídica</span>
        </h1>

        {/* Descriptive Body Prose */}
        <p className="mt-8 text-base sm:text-lg md:text-xl font-sans-luxury text-[#94A3B8] max-w-3xl mx-auto leading-relaxed font-light">
          A Andrade Cardoso nasce da convergência entre a força da advocacia estratégica, a inteligência de dados e a experiência humana que transforma complexidade jurídica em decisões mais seguras.{' '}
          <strong className="text-[#F1E5D5] font-semibold">Dr. Maurilo Cardoso</strong> (Delegado OAB/Cametá) imprime liderança institucional e rigor processual;{' '}
          <strong className="text-[#F1E5D5] font-semibold">Lorenzo Cardoso</strong> (Engenheiro de Software & Automação) desenvolve a camada tecnológica de jurimetria, automação e inteligência jurídica; e{' '}
          <strong className="text-[#F1E5D5] font-semibold">Luana Monteiro</strong>, sócia especializada em Direito do Trabalho há mais de 16 anos, agrega experiência estratégica na proteção de relações profissionais, prevenção de passivos e condução de demandas trabalhistas.
        </p>

        {/* Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onOpenConsultation}
            className="w-full sm:w-auto px-8 py-4 text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#0B0F17] bg-[#C5A880] hover:bg-[#D4AF37] rounded transition-all shadow-lg hover:shadow-[#C5A880]/30 cursor-pointer flex items-center justify-center gap-3"
          >
            <span>Solicitar Reunião com os Sócios</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <a
            href="https://w.app/lorenzo_cardoso_software_engineer"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-4 text-xs sm:text-sm font-semibold tracking-wider text-emerald-300 border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded transition-all cursor-pointer flex items-center justify-center gap-2.5 shadow-md"
            title="Atendimento Imediato via WhatsApp"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>Falar no WhatsApp</span>
          </a>

          <button
            onClick={onExploreJurisprudence}
            className="w-full sm:w-auto px-6 py-4 text-xs sm:text-sm font-medium tracking-wider text-[#E2E8F0] border border-[#2A344A] bg-[#0E1524]/80 hover:bg-[#151F33] hover:border-[#C5A880]/50 rounded transition-all cursor-pointer flex items-center justify-center gap-2.5"
          >
            <Search className="w-4 h-4 text-[#C5A880]" />
            <span>Radar Codex</span>
          </button>
        </div>

        {/* Key Quantitative Proofs Adjacent to Hero Claims */}
        <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-[#1E2638]/70 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="border-l border-[#C5A880]/40 pl-4">
            <span className="font-mono-luxury tabular-nums text-2xl sm:text-3xl font-bold text-[#F3E5D0]">
              10+
            </span>
            <p className="mt-1 text-xs text-[#94A3B8] font-sans-luxury">
              Anos de prática contenciosa e liderança na OAB
            </p>
          </div>

          <div className="border-l border-[#C5A880]/40 pl-4">
            <span className="font-mono-luxury tabular-nums text-2xl sm:text-3xl font-bold text-[#F3E5D0]">
              R$ 5M+
            </span>
            <p className="mt-1 text-xs text-[#94A3B8] font-sans-luxury">
              Em passivos tributários e contratos blindados
            </p>
          </div>

          <div className="border-l border-[#C5A880]/40 pl-4">
            <span className="font-mono-luxury tabular-nums text-2xl sm:text-3xl font-bold text-[#F3E5D0]">
              2.4s
            </span>
            <p className="mt-1 text-xs text-[#94A3B8] font-sans-luxury">
              Tempo de indexação de acórdãos STF, STJ e TRF1
            </p>
          </div>

          <div className="border-l border-[#C5A880]/40 pl-4">
            <span className="font-mono-luxury tabular-nums text-2xl sm:text-3xl font-bold text-[#F3E5D0]">
              100%
            </span>
            <p className="mt-1 text-xs text-[#94A3B8] font-sans-luxury">
              Automação contínua em follow-up e conciergerie
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
