import React, { useState } from 'react';
import { ShieldCheck, Calendar, Clock, CheckCircle2, Send, Lock, MessageSquare } from 'lucide-react';
import { Lead } from '../types';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../config/firebase';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferredPartner?: string;
  onLeadCaptured: (lead: Lead) => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  preferredPartner = 'Maurilo Cardoso',
  onLeadCaptured,
}) => {
  const [partner, setPartner] = useState(preferredPartner || 'Maurilo Cardoso');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [legalArea, setLegalArea] = useState('Tributário & Fiscal Estratégico');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('14:30');
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name,
      company: company || 'Pessoa Física',
      email,
      phone,
      stage: 'Consulta Agendada',
      legalArea,
      estimatedValue: 45000,
      priority: 'Alta',
      source: 'Site',
      lastContact: 'Agora mesmo',
      notes: `Reunião agendada com ${partner} para ${preferredDate} às ${preferredTime}. Resumo: ${description}`,
    };

    onLeadCaptured(newLead);
    setIsSubmitted(true);

    // Persist to Firestore consultations collection
    try {
      await addDoc(collection(db, 'consultations'), {
        clientName: name.slice(0, 150),
        clientEmail: email.slice(0, 150),
        clientPhone: (phone || '').slice(0, 30),
        legalArea: legalArea.slice(0, 100),
        message: (description || `Reunião com ${partner} em ${preferredDate} às ${preferredTime}`).slice(0, 2000),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[Firestore] Falha ao registrar a consulta:', err);
    }

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-[#2B374E] bg-[#0C121E] p-5 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          ✕
        </button>

        {isSubmitted ? (
          <div className="py-10 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Solicitação Confirmada!
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              O gabinete de <strong>{partner}</strong> recebeu suas informações. Nosso sistema autônomo enviou os detalhes da pré-reunião para seu e-mail e WhatsApp.
            </p>
            <div className="pt-2">
              <a
                href="https://w.app/lorenzo_cardoso_software_engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg border border-[#25D366]/40 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-emerald-300 text-xs font-semibold tracking-wide transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-[#25D366]" />
                <span>Conversar Imediatamente no WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#C5A880]" />
                <span>Gabinete de Atendimento Estratégico</span>
              </div>
              <a
                href="https://w.app/lorenzo_cardoso_software_engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-[#25D366]/40 bg-[#25D366]/10 text-[11px] text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
              >
                <MessageSquare className="w-3 h-3" />
                <span>WhatsApp Direto</span>
              </a>
            </div>
            <h3 className="font-cinzel text-2xl font-bold text-white">
              Agendar Consulta Jurídica
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Atendimento exclusivo para pessoas físicas e jurídicas com causas de alta relevância.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Sócio Responsável
                </label>
                <select
                  value={partner}
                  onChange={(e) => setPartner(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                >
                  <option value="Dr. Maurilo Cardoso">Dr. Maurilo Cardoso (Delegado OAB/Cametá - Tribunais & Tributário)</option>
                  <option value="Lorenzo Cardoso">Lorenzo Cardoso (Engenheiro de Automação & Legal Tech)</option>
                  <option value="Ambos os Sócios">Ambos os Sócios (Banca Conjunta Estratégica)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome ou razão social"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Empresa (Opcional)
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Nome da organização"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    E-mail Corporativo
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@empresa.com.br"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    WhatsApp para Confirmação
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(91) 98000-0000"
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Data Sugerida
                  </label>
                  <input
                    type="date"
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono-luxury"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                    Horário Sugerido
                  </label>
                  <input
                    type="time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono-luxury"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-1">
                  Síntese da Demanda ou Processo
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva brevemente o objeto do litígio, tribunal ou necessidade de automação..."
                  className="w-full px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider text-[#0B0F17] bg-[#C5A880] hover:bg-[#D4AF37] transition-all shadow-lg hover:shadow-[#C5A880]/30 cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Confirmar Agendamento com o Escritório</span>
              </button>
            </form>

            <div className="mt-4 pt-3 border-t border-[#1E2638] flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" /> Sigilo profissional protegido pelo Estatuto da OAB
              </span>
              <span>Retorno em até 2 horas</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
