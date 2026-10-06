import React from 'react';
import { TESTIMONIALS_DATA } from '../data/mockData';
import { Star, Building2, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="depoimentos" className="py-24 sm:py-32 bg-[#080B11] border-b border-[#1E2638]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-3">
            <span>Resultados & Reputação Comprovada</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8FAFC]">
            Depoimentos de Clientes & Líderes Empresariais
          </h2>
          <p className="mt-4 font-sans-luxury text-base text-[#94A3B8] leading-relaxed">
            A chancela de confiança de organizações que confiam seus ativos mais sensíveis à nossa equipe.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {TESTIMONIALS_DATA.map((t) => (
            <div
              key={t.id}
              className="relative flex flex-col justify-between p-8 rounded-xl border border-[#1E2638] bg-[#0C121E]/90 hover:border-[#C5A880]/50 transition-colors shadow-lg"
            >
              <div>
                {/* Header info with Verified Impact Metric */}
                <div className="flex items-center justify-between pb-4 border-b border-[#1A2234]">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-[#D4AF37] text-[#D4AF37]" />
                    ))}
                  </div>
                  <div className="text-xs font-mono-luxury font-semibold text-[#C5A880]">
                    {t.impactMetric}
                  </div>
                </div>

                {/* Case Area & Quote */}
                <div className="mt-4 text-xs uppercase tracking-wider text-[#64748B] font-sans-luxury">
                  {t.caseType}
                </div>

                <p className="mt-4 font-cormorant text-lg sm:text-xl text-[#E2E8F0] italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              {/* Attribution */}
              <div className="mt-8 pt-6 border-t border-[#1A2234] flex items-center justify-between">
                <div>
                  <div className="font-cinzel text-base font-semibold text-[#F8FAFC]">
                    {t.clientName}
                  </div>
                  <div className="text-xs text-[#94A3B8] font-sans-luxury mt-0.5">
                    {t.role} · <strong className="text-slate-300 font-medium">{t.company}</strong>
                  </div>
                </div>
                <div className="text-xs text-[#64748B] font-sans-luxury">
                  {t.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
