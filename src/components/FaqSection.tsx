import React, { useState, useMemo } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Shield,
  Scale,
  Building2,
  FileText,
  Search,
  MessageSquare,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'Geral' | 'Tributário' | 'Empresarial' | 'Contencioso' | 'Honorários';
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'Geral',
    question: 'Como funciona a primeira consulta estratégica e qual é o tempo de resposta do escritório?',
    answer:
      'A consulta inicial é realizada diretamente com os sócios Dr. Maurilo Cardoso ou Lorenzo Cardoso, em formato presencial ou por videoconferência segura em alta definição. Após o envio de suas informações, nosso gabinete realiza a triagem preliminar dos fatos e documentos em até 2 horas úteis, preparando uma nota de viabilidade jurídica fundamentada na jurisprudência mais recente antes mesmo da sessão de alinhamento.',
  },
  {
    id: 'faq-2',
    category: 'Contencioso',
    question: 'O escritório atua em âmbito nacional e perante Tribunais Superiores (STF, STJ, TST e CARF)?',
    answer:
      'Sim. Nossa bancada possui atuação contenciosa em todo o território nacional, com destaque para a entrega presencial de memoriais em gabinetes de Ministros e desembargadores, sustentação oral presencial e remota perante o Supremo Tribunal Federal (STF), Superior Tribunal de Justiça (STJ), Tribunal Superior do Trabalho (TST) e Conselho Administrativo de Recursos Fiscais (CARF).',
  },
  {
    id: 'faq-3',
    category: 'Honorários',
    question: 'Quais são as modalidades de contratação e honorários advocatícios praticados?',
    answer:
      'Pautamos nossa precificação com total transparência e aderência ao Código de Ética e Disciplina da OAB. Atuamos com modalidades sob medida para cada cliente: honorários fixos por fase processual (pro labore), honorários de êxito (quota litis) atrelados à efetiva vantagem econômica obtida pelo cliente, ou contratos de assessoria jurídica continuada (retainer fee mensal) para empresas e grupos econômicos.',
  },
  {
    id: 'faq-4',
    category: 'Tributário',
    question: 'Como é realizada a recuperação de créditos tributários e a defesa em execuções fiscais?',
    answer:
      'Conduzimos diagnósticos fiscais digitais com cruzamento eletrônico de SPEDs e notas fiscais dos últimos 60 meses. Mapeamos teses consolidadas pelo STF em repercussão geral (como a exclusão do ICMS e ISS da base do PIS/COFINS e subvenções de ICMS), ajuizando ações ordinárias ou mandados de segurança com pedido de tutela de urgência para garantir a suspensão da exigibilidade do crédito e certidões positivas com efeito de negativa (CPEN).',
  },
  {
    id: 'faq-5',
    category: 'Empresarial',
    question: 'Como funciona o planejamento patrimonial, societário e sucessório da Andrade Cardoso?',
    answer:
      'Desenvolvemos estruturas societárias robustas (Holdings Patrimoniais e Operacionais, Family Offices e Acordos de Sócios/Acionistas) munidas de cláusulas de incomunicabilidade, inalienabilidade, impenhorabilidade e usufruto vitalício. Isso propicia proteção patrimonial legítima contra contingências operacionais futuras, mitiga custos com inventários judiciais litigiosos e otimiza a tributação do ITCMD.',
  },
  {
    id: 'faq-6',
    category: 'Geral',
    question: 'Como os clientes acompanham o andamento de seus processos judiciais e decisões?',
    answer:
      'Priorizamos a clareza e a prontidão executiva. Nossos clientes recebem relatórios gerenciais periódicos e comunicações imediatas a cada movimentação relevante ou publicação nos Diários Oficiais. Além disso, mantemos um canal direto via WhatsApp Concierge e e-mail corporativo criptografado diretamente com a equipe jurídica responsável pelo caso.',
  },
  {
    id: 'faq-7',
    category: 'Empresarial',
    question: 'O que é o Andrade Cardoso Academy & Club e quais conteúdos estão inclusos?',
    answer:
      'É a nossa plataforma exclusiva de formação continuada e engenharia jurídica prática. Por R$ 19,90/mês (ou plano anual com condições especiais), advogados, empresários e executivos têm acesso irrestrito ao Radar de Jurisprudência Codex, modelos de peças e contratos de alta complexidade auditados e masterclasses mensais focadas em teses tributárias e societárias de vanguarda.',
  },
  {
    id: 'faq-8',
    category: 'Contencioso',
    question: 'Como são tratados o sigilo profissional e a proteção de dados confidenciais (LGPD)?',
    answer:
      'O sigilo entre advogado e cliente é inviolável por preceito legal e constitucional. Todos os documentos compartilhados são custodiados em servidores com criptografia de ponta a ponta (AES-256), rigoroso controle de acesso e conformidade estrita com a Lei Geral de Proteção de Dados Pessoais (LGPD - Lei nº 13.709/2018).',
  },
];

const CATEGORIES = ['Todos', 'Geral', 'Tributário', 'Empresarial', 'Contencioso', 'Honorários'] as const;

interface FaqSectionProps {
  onOpenConsultation: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenConsultation }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true, // Keep the first question open by default for immediate context
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Todos' || item.category === selectedCategory;
      const matchesSearch =
        item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="faq" className="relative py-20 lg:py-24 bg-[#080B11] border-t border-[#1E2638]/70">
      {/* Subtle luxury ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#C5A880]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative mx-auto max-w-5xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880] text-xs uppercase tracking-[0.25em] font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-[#C5A880]" />
            <span>Dúvidas Frequentes</span>
          </div>

          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F3E5D0]">
            Respostas Claras para Decisões Estratégicas
          </h2>

          <p className="font-sans-luxury text-sm sm:text-base text-slate-400 leading-relaxed">
            Consulte os principais esclarecimentos sobre nossa metodologia de atuação, honorários,
            prazos de resposta e conduta jurídica perante os Tribunais.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-10 space-y-4">
          {/* Search Input */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por assunto (ex: honorários, tributário, liminar)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#222E42] bg-[#0C121E] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A880] text-[#080B11] font-semibold shadow-md shadow-[#C5A880]/20'
                      : 'border border-[#1E2638] bg-[#0E1524]/60 text-slate-400 hover:text-slate-200 hover:border-[#2B374E]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-dashed border-[#1E2638] bg-[#0C121E]/40 p-8 space-y-3">
              <p className="text-sm text-slate-400">
                Nenhuma resposta encontrada para a busca "{searchQuery}".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Todos');
                }}
                className="text-xs text-[#C5A880] hover:underline cursor-pointer"
              >
                Redefinir filtros de pesquisa
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className={`group rounded-xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-[#C5A880]/40 bg-[#0F1626] shadow-xl shadow-black/40'
                      : 'border-[#1E2638] bg-[#0C121E]/80 hover:border-[#2C384E] hover:bg-[#0E1422]'
                  }`}
                >
                  {/* Header / Question Button */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left cursor-pointer select-none transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3">
                      <span className="shrink-0 mt-0.5 sm:mt-0 px-2 py-0.5 rounded text-[10px] uppercase font-mono tracking-wider font-semibold border border-[#C5A880]/30 bg-[#C5A880]/10 text-[#C5A880]">
                        {faq.category}
                      </span>
                      <h3
                        className={`text-sm sm:text-base font-medium transition-colors ${
                          isOpen ? 'text-[#F3E5D0] font-semibold' : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>

                    <div
                      className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-300 ${
                        isOpen
                          ? 'border-[#C5A880]/50 bg-[#C5A880] text-[#080B11] rotate-180'
                          : 'border-[#1E2638] bg-[#141C2E] text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4 transition-transform duration-300" />
                    </div>
                  </button>

                  {/* Collapsible Answer Body */}
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-[#1C263A] bg-[#0B101C]/60 animate-in fade-in duration-200">
                      <p className="font-sans-luxury">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl border border-[#C5A880]/30 bg-gradient-to-r from-[#101828] via-[#0E1524] to-[#121B2D] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Atendimento Exclusivo</span>
            </div>
            <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white">
              Possui uma demanda específica ou caso urgente?
            </h4>
            <p className="text-xs text-slate-400 max-w-lg">
              Agende uma consulta estratégica com os sócios Dr. Maurilo Cardoso e Lorenzo Cardoso para análise minuciosa dos autos.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenConsultation}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-[#C5A880] to-[#E3C69D] text-[#080B11] font-semibold text-xs tracking-wider uppercase hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#C5A880]/20 cursor-pointer"
            >
              <span>Agendar Consulta</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="https://w.app/lorenzo_cardoso_software_engineer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-[#2B374E] bg-[#0E1524] text-xs font-semibold tracking-wide text-slate-200 hover:text-white hover:border-[#25D366]/50 hover:bg-[#25D366]/10 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
