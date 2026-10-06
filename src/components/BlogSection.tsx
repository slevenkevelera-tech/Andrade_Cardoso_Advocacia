import React, { useState } from 'react';
import { BLOG_POSTS_DATA, EDITORIAL_CALENDAR_DATA } from '../data/mockData';
import { BlogPost } from '../types';
import { BookOpen, Calendar, Clock, User, ArrowRight, Share2, Tag, CalendarDays, CheckCircle } from 'lucide-react';

interface BlogSectionProps {
  onOpenConsultation: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onOpenConsultation }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  return (
    <section id="blog" className="py-24 sm:py-32 bg-[#080B11] border-b border-[#1E2638]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#C5A880] mb-3">
            <span>Doutrina Prática & Estratégia Jurídica</span>
          </div>
          <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8FAFC]">
            Blog Jurídico: Civil & Empresarial
          </h2>
          <p className="mt-4 font-sans-luxury text-base text-[#94A3B8] leading-relaxed">
            Análises aprofundadas, precedentes recentes e estratégias contratuais redigidas em linguagem acessível para empresários e operadores do direito.
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowCalendarModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2A344A] bg-[#0E1524] text-xs font-medium text-[#C5A880] hover:border-[#C5A880] transition-colors cursor-pointer"
            >
              <CalendarDays className="w-4 h-4 text-[#C5A880]" />
              <span>Ver Calendário Editorial & Estratégia de SEO 2026</span>
            </button>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {BLOG_POSTS_DATA.map((post) => (
            <article
              key={post.id}
              className="flex flex-col justify-between rounded-xl border border-[#1E2638] bg-[#0C121E] p-8 hover:border-[#C5A880]/50 transition-all duration-300 shadow-md group"
            >
              <div>
                {/* Category & Read Time (Unboxed zero-pill metadata) */}
                <div className="flex items-center gap-2 text-xs text-[#C5A880] font-sans-luxury tracking-wider uppercase mb-3">
                  <span>{post.category}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-[#94A3B8] normal-case">{post.readTime}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-[#94A3B8] normal-case font-mono-luxury">{post.viewsCount.toLocaleString()} leituras</span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => setSelectedPost(post)}
                  className="font-cinzel text-xl sm:text-2xl font-bold text-[#F8FAFC] group-hover:text-[#F3E5D0] transition-colors cursor-pointer leading-snug"
                >
                  {post.title}
                </h3>

                {/* Summary */}
                <p className="mt-4 font-sans-luxury text-sm text-[#94A3B8] leading-relaxed line-clamp-3">
                  {post.summary}
                </p>

                {/* SEO Keywords Tag Cloud (quiet inline tags) */}
                <div className="mt-5 pt-4 border-t border-[#1A2234] flex flex-wrap gap-2 text-[11px] text-slate-400">
                  {post.seoKeywords.slice(0, 4).map((kw, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-[#131B2A] text-slate-300 font-mono-luxury"
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author & Read Action */}
              <div className="mt-6 pt-5 border-t border-[#1A2234] flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {post.author}
                  </div>
                  <div className="text-[11px] text-[#64748B]">
                    {post.publishedAt}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPost(post)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#C5A880] group-hover:text-[#D4AF37] cursor-pointer"
                >
                  <span>Ler Artigo Completo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Modal: Full Article Reader */}
        {selectedPost && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-xl border border-[#2B374E] bg-[#0C121E] p-6 sm:p-10 shadow-2xl">
              {/* Close Button */}
              <button
                onClick={() => setSelectedPost(null)}
                className="absolute top-6 right-6 p-2 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>

              {/* Metadata */}
              <div className="flex items-center gap-2 text-xs text-[#C5A880] tracking-wider uppercase font-medium">
                <span>{selectedPost.category}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 normal-case">{selectedPost.publishedAt}</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-slate-400 normal-case">{selectedPost.readTime}</span>
              </div>

              <h2 className="mt-3 font-cinzel text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                {selectedPost.title}
              </h2>

              <div className="mt-3 text-xs text-slate-400">
                Por <strong className="text-[#F3E5D0]">{selectedPost.author}</strong> ({selectedPost.authorRole})
              </div>

              {/* Key Takeaways Box */}
              <div className="mt-6 p-5 rounded-lg bg-[#080B11] border border-[#232F47]">
                <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold mb-3">
                  Pontos Principais (Executive Summary)
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
                  {selectedPost.keyTakeaways.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#C5A880] shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Body Content */}
              <div className="mt-8 space-y-5 text-sm sm:text-base font-sans-luxury text-slate-300 leading-relaxed">
                {selectedPost.content.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* SEO Tags & Target Persona */}
              <div className="mt-8 pt-6 border-t border-[#1E2638] bg-[#090E18] p-4 rounded-lg">
                <div className="text-xs text-slate-400 mb-2">
                  <strong className="text-[#C5A880]">Público-Alvo:</strong> {selectedPost.targetAudience}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
                  <strong className="text-[#C5A880] mr-2">Palavras-chave SEO:</strong>
                  {selectedPost.seoKeywords.map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-[#131B2A] text-slate-300 font-mono-luxury text-[11px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="mt-8 pt-6 border-t border-[#1E2638] flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-xs text-slate-400 text-center sm:text-left">
                  Precisa de um parecer especializado para sua empresa ou caso concreto?
                </p>
                <button
                  onClick={() => {
                    setSelectedPost(null);
                    onOpenConsultation();
                  }}
                  className="px-5 py-2.5 rounded text-xs font-semibold tracking-wider uppercase text-[#0B0F17] bg-[#C5A880] hover:bg-[#D4AF37] transition-colors cursor-pointer"
                >
                  Falar com os Autores
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Editorial Calendar & SEO Strategy */}
        {showCalendarModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl border border-[#2B374E] bg-[#0C121E] p-6 sm:p-10 shadow-2xl">
              <button
                onClick={() => setShowCalendarModal(false)}
                className="absolute top-6 right-6 p-2 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-2 text-xs text-[#C5A880] uppercase tracking-widest font-semibold mb-2">
                <Calendar className="w-4 h-4" />
                <span>Planejamento Estratégico de Conteúdo</span>
              </div>
              <h3 className="font-cinzel text-2xl font-bold text-white">
                Calendário Editorial & Plano de SEO Jurídico (2026)
              </h3>
              <p className="mt-2 text-xs text-slate-400">
                Estratégia voltada à atração de clientes qualificados em Direito Civil e Empresarial, fortalecendo a autoridade de Dr. Maurilo Cardoso e Lorenzo Cardoso com foco em conversão e compliance com o Código de Ética da OAB.
              </p>

              <div className="mt-6 space-y-4">
                {EDITORIAL_CALENDAR_DATA.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-lg border border-[#1E2638] bg-[#090E18] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#182030]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-luxury text-xs text-[#C5A880] font-semibold">
                          {item.week}
                        </span>
                        <span className="text-slate-600">·</span>
                        <span className="text-xs text-slate-400">
                          Data prevista: {item.scheduledDate}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 text-[11px] font-medium rounded ${
                        item.status === 'Publicado'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : item.status === 'Em Redação'
                          ? 'bg-amber-950 text-amber-400 border border-amber-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <h4 className="font-cinzel text-base font-bold text-white">
                      {item.topic}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                      <div>
                        <strong className="text-slate-400">Área:</strong> {item.legalArea}
                      </div>
                      <div>
                        <strong className="text-slate-400">Persona-Alvo:</strong> {item.targetPersona}
                      </div>
                      <div>
                        <strong className="text-slate-400">Palavra-Chave Foco:</strong>{' '}
                        <span className="text-[#D4AF37] font-mono-luxury">{item.primaryKeyword}</span>
                      </div>
                      <div>
                        <strong className="text-slate-400">Autor Responsável:</strong> {item.responsibleAuthor}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[#182030] text-[11px] text-slate-400">
                      <span className="text-[#C5A880] mr-2">Canais de Distribuição:</span>
                      {item.distributionChannels.map((c, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-[#131B2A] text-slate-300">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-[#1E2638] flex justify-end">
                <button
                  onClick={() => setShowCalendarModal(false)}
                  className="px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider bg-slate-800 text-white hover:bg-slate-700 cursor-pointer"
                >
                  Fechar Calendário
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
