/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Lead } from './types';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { PartnersSection } from './components/PartnersSection';
import { JurisprudenceCodexHub } from './components/JurisprudenceCodexHub';
import { BlogSection } from './components/BlogSection';
import { AcademySection } from './components/AcademySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { InstagramFeedSection } from './components/InstagramFeedSection';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { AIChatConcierge } from './components/AIChatConcierge';
import { ConsultationModal } from './components/ConsultationModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { StripeCheckoutModal } from './components/StripeCheckoutModal';
import { GoogleAuthModal } from './components/GoogleAuthModal';
import { GmailHubModal } from './components/GmailHubModal';

export default function App() {
  // Current user state (defaults to an authenticated member with email from user metadata)
  const [user, setUser] = useState<UserProfile>({
    name: 'Dr. Sleven Kevelera',
    email: 'slevenkevelera@gmail.com',
    role: 'guest',
    hasActiveSubscription: false,
  });

  // Modal open states
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [preferredPartner, setPreferredPartner] = useState<string>('Maurilo Cardoso');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isStripeOpen, setIsStripeOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isGmailOpen, setIsGmailOpen] = useState(false);
  const [gmailRecipient, setGmailRecipient] = useState<string>('');
  const [gmailSubject, setGmailSubject] = useState<string>('');

  // Success notification banner state
  const [globalNotice, setGlobalNotice] = useState<string | null>(null);

  useEffect(() => {
    // Ensure authentic, unmodified official photos by clearing legacy temporary overrides
    try {
      localStorage.removeItem('andrade_cardoso_partner_photos');
      localStorage.removeItem('andrade_cardoso_instagram_custom_photos');
    } catch {
      // ignore
    }
  }, []);

  const triggerNotice = (msg: string) => {
    setGlobalNotice(msg);
    setTimeout(() => setGlobalNotice(null), 5000);
  };

  const handleOpenConsultationWithPartner = (partnerName: string) => {
    setPreferredPartner(partnerName);
    setIsConsultationOpen(true);
  };

  const handleOpenGmailToPartner = (email: string, subject: string) => {
    setGmailRecipient(email);
    setGmailSubject(subject);
    setIsGmailOpen(true);
  };

  const handleLeadCaptured = (newLead: Lead) => {
    triggerNotice(
      `Consulta agendada com sucesso! O lead foi inserido no pipeline CRM e o webhook do WhatsApp notificou o Dr. Maurilo e Lorenzo.`
    );
  };

  const handleStripeSuccess = (plan: 'mensal' | 'anual') => {
    setUser((prev) => ({
      ...prev,
      hasActiveSubscription: true,
      role: 'subscriber',
      planName: plan === 'mensal' ? 'Andrade Cardoso Club Mensal (R$ 19,90)' : 'Andrade Cardoso Club Anual VIP',
    }));
    triggerNotice(
      `Pagamento aprovado via Stripe! Assinatura ativada por R$ ${plan === 'mensal' ? '19,90/mês' : '199,00/ano'}. Todos os materiais foram desbloqueados!`
    );
  };

  return (
    <div className="min-h-screen bg-[#080B11] text-[#E5E9F0] flex flex-col font-sans-luxury selection:bg-[#C5A880]/30 selection:text-[#F3E5D0]">
      {/* Global Notification Toast */}
      {globalNotice && (
        <div className="fixed top-24 right-6 z-50 max-w-md p-4 rounded-xl border border-emerald-600/60 bg-emerald-950/95 text-emerald-100 text-xs shadow-2xl backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-3">
            <span>{globalNotice}</span>
            <button
              onClick={() => setGlobalNotice(null)}
              className="text-emerald-400 hover:text-white p-0.5 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Luxury Navigation Header */}
      <Header
        onOpenConsultation={() => {
          setPreferredPartner('Maurilo Cardoso');
          setIsConsultationOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenGmail={() => {
          setGmailRecipient('');
          setGmailSubject('');
          setIsGmailOpen(true);
        }}
        user={user}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <HeroSection
          onOpenConsultation={() => {
            setPreferredPartner('Maurilo Cardoso');
            setIsConsultationOpen(true);
          }}
          onExploreJurisprudence={() => {
            const el = document.getElementById('jurisprudencia');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 2. Quadro de Sócios (Maurilo & Lorenzo in distinct luxury boxes) */}
        <PartnersSection
          onSelectPartnerForMeeting={handleOpenConsultationWithPartner}
          onOpenGmailWithRecipient={handleOpenGmailToPartner}
        />

        {/* 3. Radar de Jurisprudência Codex em Tempo Real */}
        <JurisprudenceCodexHub />

        {/* 4. Blog Jurídico Civil & Empresarial com Plano Editorial SEO */}
        <BlogSection
          onOpenConsultation={() => {
            setPreferredPartner('Ambos os Sócios');
            setIsConsultationOpen(true);
          }}
        />

        {/* 5. Andrade Cardoso Academy & Club (Venda de Conteúdos por R$ 19,90) */}
        <AcademySection
          user={user}
          onOpenStripeCheckout={() => setIsStripeOpen(true)}
        />

        {/* 6. Depoimentos de Clientes Satisfeitos */}
        <TestimonialsSection />

        {/* 7. Instagram Feed em Tempo Real */}
        <InstagramFeedSection />

        {/* 8. Dúvidas Frequentes (FAQ Accordion) */}
        <FaqSection
          onOpenConsultation={() => {
            setPreferredPartner('Maurilo Cardoso');
            setIsConsultationOpen(true);
          }}
        />
      </main>

      {/* Luxury Institutional Footer */}
      <Footer
        onOpenConsultation={() => {
          setPreferredPartner('Maurilo Cardoso');
          setIsConsultationOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 24/7 Autonomous AI Legal Concierge */}
      <AIChatConcierge
        onOpenConsultation={() => {
          setPreferredPartner('Maurilo Cardoso');
          setIsConsultationOpen(true);
        }}
      />

      {/* Consultation Booking Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
        preferredPartner={preferredPartner}
        onLeadCaptured={handleLeadCaptured}
      />

      {/* Complete Law Firm Administration & CRM Modal */}
      <AdminDashboardModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        onOpenConsultation={() => {
          setIsAdminOpen(false);
          setIsConsultationOpen(true);
        }}
      />

      {/* Stripe Recurrent Payment Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isStripeOpen}
        onClose={() => setIsStripeOpen(false)}
        onSuccess={handleStripeSuccess}
        user={user}
      />

      {/* Google OAuth & Account Modal */}
      <GoogleAuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onUpdateUser={(updated) => {
          setUser(updated);
          triggerNotice(`Perfil atualizado: ${updated.name} (${updated.role.toUpperCase()})`);
        }}
      />

      {/* Gmail Workspace Correspondence Hub Modal */}
      <GmailHubModal
        isOpen={isGmailOpen}
        onClose={() => setIsGmailOpen(false)}
        defaultRecipient={gmailRecipient}
        defaultSubject={gmailSubject}
      />
    </div>
  );
}
