import React from 'react';
import { Scale, Mail, Phone, MapPin, Instagram, Linkedin, MessageSquare, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onOpenConsultation: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsultation, onOpenAdmin }) => {
  return (
    <footer className="border-t border-[#1E2638] bg-[#06080E] text-[#94A3B8]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#1A2234]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-cinzel text-xl font-bold tracking-[0.2em] text-[#F3E5D0] block">
              ANDRADE CARDOSO
            </span>
            <span className="font-sans-luxury text-[10px] tracking-[0.3em] text-[#C5A880] uppercase block">
              Advocacia Estratégica & Engenharia Jurídica
            </span>
            <p className="font-sans-luxury text-xs text-slate-400 max-w-sm leading-relaxed">
              Banca jurídica de alta performance especializada em causas tributárias complexas, defesa corporativa perante Tribunais Superiores e automação de operações jurídicas em escala nacional.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://instagram.com/andradecardosoadv"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-[#222E42] bg-[#0E1524] text-slate-300 hover:text-[#E1306C] hover:border-[#E1306C]/40 transition-colors"
                title="Instagram Oficial"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/company/andrade-cardoso-advogados"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-[#222E42] bg-[#0E1524] text-slate-300 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 transition-colors"
                title="LinkedIn Corporativo"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://w.app/lorenzo_cardoso_software_engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg border border-[#222E42] bg-[#0E1524] text-slate-300 hover:text-[#25D366] hover:border-[#25D366]/40 transition-colors"
                title="WhatsApp Concierge"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs font-sans-luxury">
              <li>
                <a href="#socios" className="hover:text-white transition-colors">
                  Quadro de Sócios
                </a>
              </li>
              <li>
                <a href="#jurisprudencia" className="hover:text-white transition-colors">
                  Radar Jurisprudência Codex
                </a>
              </li>
              <li>
                <a href="#blog" className="hover:text-white transition-colors">
                  Blog & Artigos Doutrinários
                </a>
              </li>
              <li>
                <a href="#academy" className="hover:text-white transition-colors">
                  Andrade Cardoso Academy
                </a>
              </li>
              <li>
                <a href="#depoimentos" className="hover:text-white transition-colors">
                  Depoimentos de Clientes
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Dúvidas Frequentes (FAQ)
                </a>
              </li>
            </ul>
          </div>

          {/* Practice Areas */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              Áreas de Atuação
            </h4>
            <ul className="space-y-2 text-xs font-sans-luxury text-slate-400">
              <li>Contencioso Tributário & CARF</li>
              <li>Recursos no STF, STJ e TST</li>
              <li>Direito Societário & M&A</li>
              <li>Automação de Workflows & LGPD</li>
              <li>Reestruturação de Passivos</li>
            </ul>
          </div>

          {/* Headquarters & Representation */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
              Gabinete & Unidades
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block">Cametá / PA</strong>
                  <span>Sede Institucional · Subseção OAB/Cametá</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C5A880] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-300 block">Belém / Brasília / SP</strong>
                  <span>Atendimento Virtual & Tribunais Superiores</span>
                </div>
              </div>
              <a
                href="https://w.app/lorenzo_cardoso_software_engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 pt-1 text-slate-300 hover:text-[#25D366] transition-colors"
                title="Falar no WhatsApp"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="font-mono-luxury">(91) 98123-4567</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & OAB Compliance Notice */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Andrade Cardoso Advogados Associados. Todos os direitos reservados.
            <span className="block text-[11px] text-slate-600 mt-0.5">
              Inscrição OAB/PA · Delegacia da Subseção OAB Cametá. Em estrita conformidade com o Provimento nº 205/2021 do CFOAB.
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenAdmin}
              className="text-slate-400 hover:text-[#C5A880] transition-colors cursor-pointer"
            >
              Acesso Restrito CRM
            </button>
            <span>·</span>
            <a href="#academy" className="hover:text-white transition-colors">
              Clube de Assinaturas (R$ 19,90)
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
