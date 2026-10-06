import React, { useState } from 'react';
import { ACADEMY_MATERIALS_DATA } from '../data/mockData';
import { AcademyMaterial, UserProfile } from '../types';
import { BookOpen, Lock, Download, Check, Sparkles, CreditCard, ShieldAlert, FileText, ArrowRight, Eye } from 'lucide-react';

interface AcademySectionProps {
  user: UserProfile;
  onOpenStripeCheckout: (materialId?: string) => void;
}

export const AcademySection: React.FC<AcademySectionProps> = ({
  user,
  onOpenStripeCheckout,
}) => {
  const [selectedMaterial, setSelectedMaterial] = useState<AcademyMaterial | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('TODOS');

  const categories = ['TODOS', 'Peças Processuais', 'Teses Estruturadas', 'Prática de Audiência', 'Automação para Escritórios', 'Contratos & Gestão'];

  const filteredMaterials = ACADEMY_MATERIALS_DATA.filter(
    (m) => activeCategory === 'TODOS' || m.category === activeCategory
  );

  return (
    <section id="academy" className="py-24 sm:py-32 bg-[#080B11] border-b border-[#1E2638]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-3">
            <span>Andrade Cardoso Academy & Club</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8FAFC]">
            Materiais de Estudo & Prática Jurídica de Elite
          </h2>
          <p className="mt-4 font-sans-luxury text-base text-[#94A3B8] leading-relaxed">
            Acervo autoral com modelos de peças reais testadas em tribunais, estratégias de audiência e automações de alta eficiência desenvolvidas por Maurilo Cardoso e Lorenzo Cardoso para advogados iniciantes.
          </p>

          {/* Promotional Pricing Card Banner (R$ 29,90 por R$ 19,90) */}
          <div className="mt-8 mx-auto max-w-2xl rounded-2xl border-2 border-[#C5A880]/50 bg-gradient-to-b from-[#111A2E] to-[#0A101C] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-36 h-36 bg-[#C5A880]/10 rounded-full blur-2xl" />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                  <span>Oferta Especial de Lançamento</span>
                </div>
                <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                  Plano de Assinatura Recorrente Club
                </h3>
                <p className="text-xs text-slate-300 font-sans-luxury mt-1 max-w-md">
                  Acesso ilimitado e irrestrito a todas as peças, atualizações mensais de jurisprudência e suporte na comunidade de novos advogados.
                </p>
              </div>

              <div className="shrink-0 flex flex-col items-center sm:items-end">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-500 line-through font-mono-luxury">
                    De R$ 29,90
                  </span>
                  <div className="text-3xl sm:text-4xl font-bold text-[#F3E5D0] font-mono-luxury">
                    R$ 19<span className="text-xl">,90</span>
                    <span className="text-xs text-slate-400 font-normal">/mês</span>
                  </div>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium mt-0.5">
                  Cobrança recorrente Stripe · Cancele quando quiser
                </span>

                <button
                  onClick={() => onOpenStripeCheckout()}
                  className="mt-3 w-full sm:w-auto px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider text-[#0B0F17] bg-[#C5A880] hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-[#C5A880]/30 cursor-pointer flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{user.hasActiveSubscription ? 'Assinatura Ativa (Acessar)' : 'Assinar por R$ 19,90'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#C5A880] text-[#0B0F17] font-semibold'
                  : 'bg-[#121927] text-slate-300 hover:bg-[#1A2438] border border-[#1E2638]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((mat) => {
            const isUnlocked = user.hasActiveSubscription || user.role === 'admin';
            return (
              <div
                key={mat.id}
                className="group relative flex flex-col justify-between rounded-xl border border-[#1E2638] bg-[#0C121E] hover:border-[#C5A880]/60 transition-all duration-300 p-6 shadow-md"
              >
                <div>
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] font-sans-luxury mb-3">
                    <span className="text-[#C5A880] font-medium">{mat.category}</span>
                    <span className="font-mono-luxury text-[11px] px-2 py-0.5 rounded bg-[#131B2A] border border-[#202C3F]">
                      {mat.fileFormat}
                    </span>
                  </div>

                  <h4 className="font-cinzel text-lg font-bold text-[#F8FAFC] group-hover:text-[#F3E5D0] transition-colors leading-snug">
                    {mat.title}
                  </h4>

                  <p className="mt-3 text-xs text-slate-400 font-sans-luxury leading-relaxed">
                    {mat.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-[#1E2638] text-[11px] text-[#64748B] flex items-center justify-between">
                    <span>{mat.pageCountOrDuration}</span>
                    {mat.isPopular && (
                      <span className="text-[#D4AF37] font-medium flex items-center gap-1">
                        ★ Mais Utilizado
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Action Area */}
                <div className="mt-6 pt-4 border-t border-[#1E2638] flex items-center justify-between gap-3">
                  <button
                    onClick={() => setSelectedMaterial(mat)}
                    className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#C5A880]" />
                    <span>Ver Amostra</span>
                  </button>

                  {isUnlocked ? (
                    <button
                      onClick={() => alert(`Download iniciado com sucesso: ${mat.title} (${mat.fileFormat})`)}
                      className="px-3.5 py-1.5 rounded bg-emerald-900/60 border border-emerald-700/80 text-emerald-300 text-xs font-medium flex items-center gap-1.5 hover:bg-emerald-800 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Baixar Material</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenStripeCheckout(mat.id)}
                      className="px-3.5 py-1.5 rounded bg-[#151E30] hover:bg-[#C5A880] hover:text-[#0B0F17] text-[#C5A880] border border-[#29374E] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Lock className="w-3 h-3" />
                      <span>Desbloquear</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal: Material Sample Preview */}
        {selectedMaterial && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl border border-[#2B374E] bg-[#0C121E] p-6 sm:p-8 shadow-2xl">
              <button
                onClick={() => setSelectedMaterial(null)}
                className="absolute top-6 right-6 p-2 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                {selectedMaterial.category} · {selectedMaterial.fileFormat}
              </div>

              <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                {selectedMaterial.title}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                {selectedMaterial.description}
              </p>

              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-[#94A3B8] font-semibold uppercase tracking-wider mb-2">
                  <span>Trecho de Pré-Visualização Técnica</span>
                  <span>{selectedMaterial.pageCountOrDuration}</span>
                </div>
                <div className="p-4 rounded-lg bg-[#080B11] border border-[#1E2638] font-mono-luxury text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {selectedMaterial.previewSnippet}
                  <span className="text-[#C5A880] block mt-4 font-sans-luxury italic">
                    [... Conteúdo integral reservado para assinantes do Andrade Cardoso Club ...]
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E2638] flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Acesso total por apenas <strong>R$ 19,90/mês</strong> recorrente
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMaterial(null)}
                    className="px-4 py-2 rounded text-xs text-slate-300 hover:text-white"
                  >
                    Fechar
                  </button>

                  <button
                    onClick={() => {
                      setSelectedMaterial(null);
                      onOpenStripeCheckout(selectedMaterial.id);
                    }}
                    className="px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-[#C5A880] text-[#0B0F17] hover:bg-[#D4AF37] cursor-pointer"
                  >
                    Assinar e Baixar Agora
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
