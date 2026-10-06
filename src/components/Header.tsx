import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Shield, Sparkles, UserCheck, LayoutDashboard, Menu, X, Calendar, Mail, MessageSquare } from 'lucide-react';

interface HeaderProps {
  onOpenConsultation: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onOpenGmail: () => void;
  user: UserProfile;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenConsultation,
  onOpenAdmin,
  onOpenAuth,
  onOpenGmail,
  user,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '#socios', label: 'Sócios' },
    { href: '#jurisprudencia', label: 'Jurisprudência' },
    { href: '#blog', label: 'Artigos' },
    { href: '#academy', label: 'Academy' },
    { href: '#depoimentos', label: 'Depoimentos' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1E2638] bg-[#080B11]/95 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Zone 1: Single text element wordmark adhering to Top Bar Contract */}
        <a
          href="#"
          className="group flex flex-col text-left focus-visible:outline-none shrink-0"
        >
          <span className="font-cinzel text-base sm:text-lg lg:text-xl font-bold tracking-[0.12em] sm:tracking-[0.18em] text-[#F3E5D0] group-hover:text-white transition-colors whitespace-nowrap">
            ANDRADE CARDOSO
          </span>
          <span className="font-sans-luxury text-[9px] sm:text-[10px] tracking-[0.25em] sm:tracking-[0.32em] text-[#C5A880] uppercase whitespace-nowrap">
            Advogados Associados
          </span>
        </a>

        {/* Zone 2: Clean, Symmetrical Desktop Navigation */}
        <nav className="hidden xl:flex items-center gap-6 2xl:gap-8 font-sans-luxury text-xs tracking-wider uppercase text-[#94A3B8]">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#F3E5D0] transition-colors py-1 relative hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-0 hover:after:w-full hover:after:h-[1px] hover:after:bg-[#C5A880] whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Symmetrical Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* WhatsApp Direct Contact Button */}
          <a
            href="https://w.app/lorenzo_cardoso_software_engineer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-medium text-emerald-400 border border-[#25D366]/40 bg-[#25D366]/10 hover:bg-[#25D366]/20 rounded-md transition-all shadow-sm whitespace-nowrap"
            title="Atendimento Imediato via WhatsApp"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
            <span className="hidden 2xl:inline">WhatsApp</span>
          </a>

          {/* Desktop Tools (Gmail, CRM, Auth) - Elegant and uncluttered */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={onOpenGmail}
              className="flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-medium text-slate-200 border border-[#232F42] bg-[#0E1524] hover:bg-[#152035] hover:border-[#EA4335]/60 hover:text-white rounded-md transition-all shadow-sm cursor-pointer whitespace-nowrap"
              title="Gmail Jurídico & Correspondência Processual"
            >
              <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
              <span className="hidden lg:inline">Gmail</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-medium text-[#C5A880] border border-[#232F42] bg-[#0E1524] hover:border-[#C5A880]/60 hover:bg-[#152035] rounded-md transition-all shadow-sm cursor-pointer whitespace-nowrap"
              title="Painel Administrativo, CRM e Automações"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="hidden lg:inline">CRM</span>
            </button>

            <button
              onClick={onOpenAuth}
              className="flex items-center justify-center gap-1.5 h-9 px-2.5 sm:px-3 text-xs font-medium text-slate-300 border border-[#232F42] bg-[#0B0F17] hover:border-[#C5A880]/50 hover:text-white rounded-md transition-all shadow-sm cursor-pointer whitespace-nowrap"
              title="Acesso e Credenciais"
            >
              {user.role === 'admin' ? (
                <>
                  <Shield className="w-3.5 h-3.5 text-[#C5A880]" />
                  <span className="hidden 2xl:inline">Dr. Maurilo (OAB)</span>
                </>
              ) : user.hasActiveSubscription ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="hidden 2xl:inline">{user.name.split(' ')[0]}</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden 2xl:inline">Conta</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden flex items-center justify-center h-9 w-9 rounded-md text-slate-300 hover:text-white hover:bg-slate-800/60 border border-[#232F42] transition-colors cursor-pointer"
            aria-label="Abrir Menu Principal"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#C5A880]" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer with Structured Grid */}
      {isMobileMenuOpen && (
        <div className="xl:hidden border-b border-[#1E2638] bg-[#0C121E] px-6 py-6 space-y-5 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-2.5 font-sans-luxury text-sm uppercase tracking-wider text-[#94A3B8]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 hover:text-[#F3E5D0] border-b border-[#1A2336] transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-[#C5A880] text-xs">→</span>
              </a>
            ))}
          </nav>

          {/* Mobile Action Controls & Shortcuts */}
          <div className="pt-2 flex flex-col gap-2.5">
            <a
              href="https://w.app/lorenzo_cardoso_software_engineer"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-md text-xs font-semibold text-emerald-300 border border-[#25D366]/40 bg-[#25D366]/15 hover:bg-[#25D366]/25 transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              <span>Falar no WhatsApp com o Escritório</span>
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenGmail();
                }}
                className="py-2.5 px-3 rounded-md text-xs font-medium text-white border border-[#EA4335]/40 bg-[#EA4335]/15 hover:bg-[#EA4335]/25 transition-colors flex items-center justify-center gap-2"
              >
                <Mail className="w-3.5 h-3.5 text-[#EA4335]" />
                <span>Gmail Jurídico</span>
              </button>

              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="py-2.5 px-3 rounded-md text-xs font-medium text-[#C5A880] border border-[#2A344A] bg-[#0E1524] hover:bg-[#151F33] transition-colors flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Painel CRM</span>
              </button>
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenAuth();
              }}
              className="w-full py-2.5 rounded-md text-xs font-medium text-slate-300 border border-[#232D42] bg-[#080B11] hover:border-[#C5A880]/50 hover:text-white transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5 text-slate-400" />
              <span>Acessar Credenciais OAB / Google</span>
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenConsultation();
              }}
              className="w-full py-3 rounded-md text-xs font-bold uppercase tracking-wider text-center text-[#0B0F17] bg-[#C5A880] hover:bg-[#D4AF37] transition-colors shadow-md"
            >
              Agendar Reunião com os Sócios
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

