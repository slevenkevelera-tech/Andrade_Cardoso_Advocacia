import React, { useState, useMemo } from 'react';
import { JURISPRUDENCE_DATA } from '../data/mockData';
import { Jurisprudence } from '../types';
import { Search, Filter, Sparkles, Copy, Check, ExternalLink, Scale, BookOpen, Layers } from 'lucide-react';

export const JurisprudenceCodexHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTribunal, setSelectedTribunal] = useState<string>('TODOS');
  const [selectedArea, setSelectedArea] = useState<string>('TODOS');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPrecedent, setSelectedPrecedent] = useState<Jurisprudence | null>(null);

  const filteredData = useMemo(() => {
    return JURISPRUDENCE_DATA.filter((item) => {
      const matchTribunal = selectedTribunal === 'TODOS' || item.tribunal === selectedTribunal;
      const matchArea = selectedArea === 'TODOS' || item.area === selectedArea;
      const queryLower = searchQuery.toLowerCase().trim();
      const matchQuery =
        !queryLower ||
        item.processo.toLowerCase().includes(queryLower) ||
        item.titulo.toLowerCase().includes(queryLower) ||
        item.ementa.toLowerCase().includes(queryLower) ||
        item.teseFixada.toLowerCase().includes(queryLower) ||
        item.relator.toLowerCase().includes(queryLower) ||
        item.tags.some((t) => t.toLowerCase().includes(queryLower));

      return matchTribunal && matchArea && matchQuery;
    });
  }, [searchQuery, selectedTribunal, selectedArea]);

  const handleCopyCitation = (item: Jurisprudence) => {
    navigator.clipboard.writeText(item.abntCitation);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <section id="jurisprudencia" className="py-24 sm:py-32 bg-[#090E18] border-b border-[#1E2638]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-3">
            <span>Integração Codex API & Tribunais Superiores</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8FAFC]">
            Radar de Jurisprudência em Tempo Real
          </h2>
          <p className="mt-4 font-sans-luxury text-base text-[#94A3B8] leading-relaxed">
            Consulte acórdãos, súmulas vinculantes e teses repetitivas do STF, STJ, TST e TRFs integrados à inteligência preditiva do escritório.
          </p>
        </div>

        {/* Search Controls & Filters */}
        <div className="p-6 rounded-xl border border-[#1E2638] bg-[#0C121E] shadow-xl mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#C5A880]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por tese, número do processo (ex: Tema 1072, REsp, ICMS-ST), relator ou palavra-chave..."
              className="w-full pl-12 pr-4 py-3.5 bg-[#080B11] border border-[#232D42] focus:border-[#C5A880] rounded-lg text-sm text-[#F8FAFC] placeholder-slate-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="mt-4 pt-4 border-t border-[#1E2638] flex flex-wrap items-center justify-between gap-4">
            {/* Tribunal Filter Tabs (interactive functional buttons) */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs uppercase tracking-wider text-[#64748B] mr-2 shrink-0">
                Tribunal:
              </span>
              {['TODOS', 'STF', 'STJ', 'TST', 'TRF1'].map((trib) => (
                <button
                  key={trib}
                  onClick={() => setSelectedTribunal(trib)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    selectedTribunal === trib
                      ? 'bg-[#C5A880] text-[#0B0F17] font-semibold'
                      : 'bg-[#121927] text-slate-300 hover:bg-[#1A2438]'
                  }`}
                >
                  {trib}
                </button>
              ))}
            </div>

            {/* Area Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs uppercase tracking-wider text-[#64748B] mr-2 shrink-0">
                Ramo:
              </span>
              {['TODOS', 'Tributário', 'Empresarial', 'Cível', 'Trabalhista'].map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    selectedArea === area
                      ? 'bg-[#C5A880] text-[#0B0F17] font-semibold'
                      : 'bg-[#121927] text-slate-300 hover:bg-[#1A2438]'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count & Codex Status Bar */}
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-6 px-1">
          <div className="flex items-center gap-2">
            <span>Resultados encontrados:</span>
            <strong className="text-[#F3E5D0] font-mono-luxury">{filteredData.length} precedentes</strong>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#C5A880]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sincronização Ativa com API Codex & Diários Eletrônicos</span>
          </div>
        </div>

        {/* Jurisprudence Cards Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredData.length === 0 ? (
            <div className="p-12 text-center border border-dashed border-[#2A344A] rounded-xl text-slate-400">
              <BookOpen className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-sm font-medium">Nenhum precedente localizado com estes termos.</p>
              <p className="text-xs text-slate-500 mt-1">Tente buscar por termos genéricos como "Tributário", "STF", "Contratos" ou limpe os filtros.</p>
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="group relative p-6 sm:p-8 rounded-xl border border-[#1E2638] bg-[#0C121E] hover:border-[#C5A880]/50 transition-all duration-300 shadow-md"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1A2234]">
                  <div className="flex items-center gap-3">
                    <span className="font-mono-luxury text-xs px-2.5 py-1 rounded bg-[#151D2E] text-[#D4AF37] border border-[#232F47] font-semibold">
                      {item.tribunal}
                    </span>
                    <span className="text-xs text-[#CBD5E1] font-mono-luxury">
                      {item.processo}
                    </span>
                    <span className="text-slate-600 hidden sm:inline">·</span>
                    <span className="text-xs text-[#94A3B8] hidden sm:inline">
                      {item.orgaoJulgador}
                    </span>
                  </div>

                  <div className="text-xs text-[#64748B] font-mono-luxury">
                    Julgado em: {item.dataJulgamento}
                  </div>
                </div>

                {/* Title & Ementa Preview */}
                <div className="mt-4">
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold text-[#F8FAFC] group-hover:text-[#F3E5D0] transition-colors">
                    {item.titulo}
                  </h3>

                  {item.temaOuSumula && (
                    <div className="mt-2 text-xs font-semibold text-[#C5A880] tracking-wide">
                      {item.temaOuSumula}
                    </div>
                  )}

                  <p className="mt-3 text-xs sm:text-sm font-sans-luxury text-[#94A3B8] line-clamp-3 leading-relaxed">
                    {item.ementa}
                  </p>
                </div>

                {/* Tese Fixada & AI Codex Summary Box */}
                <div className="mt-5 p-4 rounded-lg bg-[#080B11]/90 border-l-2 border-[#C5A880] space-y-2">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A880] font-semibold block mb-0.5">
                      Tese Jurídica Firmada:
                    </span>
                    <p className="text-xs font-serif-editorial italic text-[#E2E8F0] leading-relaxed">
                      "{item.teseFixada}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#1E2638] flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#CBD5E1] font-sans-luxury">
                      {item.codexAiSummary}
                    </p>
                  </div>
                </div>

                {/* Footer Controls: ABNT Copy & Full Modal */}
                <div className="mt-6 pt-4 border-t border-[#1A2234] flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-[#64748B]">
                    <span>Relatoria:</span>
                    <strong className="text-slate-300 font-medium">{item.relator}</strong>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                    <button
                      onClick={() => handleCopyCitation(item)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-3 py-1.5 rounded border border-[#232D42] bg-[#121927] hover:border-[#C5A880] hover:text-[#C5A880] text-xs text-slate-300 transition-colors cursor-pointer"
                      title="Copiar citação formatada nas normas da ABNT"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copiado em ABNT!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Citação ABNT</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedPrecedent(item)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 rounded text-xs font-medium text-[#0B0F17] bg-[#C5A880] hover:bg-[#D4AF37] transition-colors cursor-pointer text-center"
                    >
                      Ver Inteiro Teor
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Inteiro Teor & Codex Details */}
        {selectedPrecedent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#2B374E] bg-[#0C121E] p-6 sm:p-8 shadow-2xl">
              <div className="flex items-start justify-between pb-4 border-b border-[#1E2638]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono-luxury text-[#C5A880]">
                    <span>{selectedPrecedent.tribunal}</span>
                    <span>·</span>
                    <span>{selectedPrecedent.processo}</span>
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold text-white mt-1">
                    {selectedPrecedent.titulo}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPrecedent(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="mt-6 space-y-6 text-xs sm:text-sm">
                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">
                    Ementa Completa
                  </h4>
                  <p className="p-4 rounded bg-[#080B11] border border-[#1E2638] text-slate-300 font-sans-luxury leading-relaxed whitespace-pre-line">
                    {selectedPrecedent.ementa}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">
                    Tese Jurídica Vinculante
                  </h4>
                  <div className="p-4 rounded bg-[#0E1729] border border-[#232F47] text-[#E2E8F0] font-cormorant italic text-base leading-relaxed">
                    "{selectedPrecedent.teseFixada}"
                  </div>
                </div>

                <div>
                  <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-2">
                    Citação em Padrão ABNT
                  </h4>
                  <div className="p-3 rounded bg-[#080B11] border border-[#1E2638] font-mono-luxury text-xs text-slate-300 flex items-center justify-between gap-3">
                    <span className="truncate">{selectedPrecedent.abntCitation}</span>
                    <button
                      onClick={() => handleCopyCitation(selectedPrecedent)}
                      className="px-2.5 py-1 rounded bg-[#C5A880] text-[#0B0F17] font-semibold text-xs shrink-0 cursor-pointer"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-[#1E2638] flex justify-end">
                <button
                  onClick={() => setSelectedPrecedent(null)}
                  className="px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
                >
                  Fechar Visualizador
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
