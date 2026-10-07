import React, { useState } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles, User, CheckCircle2, Phone, Calendar } from 'lucide-react';
import { Lead } from '../types';

interface AIChatConciergeProps {
  onLeadCaptured?: (lead: Partial<Lead>) => void;
  onOpenConsultation?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  options?: string[];
}

export const AIChatConcierge: React.FC<AIChatConciergeProps> = ({
  onLeadCaptured,
  onOpenConsultation,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Bem-vindo ao escritório Andrade Cardoso Advogados. Sou o Concierge Virtual de triagem. Como posso orientar sua demanda hoje?',
      timestamp: 'Agora',
      options: [
        'Agendar Reunião com Dr. Maurilo Cardoso',
        'Consultar Soluções em Legal Tech & Lorenzo',
        'Dúvidas sobre Assinatura do Club (R$ 19,90)',
        'Triagem de Processo Judicial Urgente',
      ],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Agora',
    };

    const previousMessages = messages;
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    let reply = '';
    let nextOptions: string[] | undefined;

    try {
      const history = previousMessages.slice(-12).map((item: ChatMessage) => ({
        role: item.sender === 'ai' ? 'model' : 'user',
        text: item.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.text, history }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply) {
          reply = data.reply;
        }
      }
    } catch {
      // Silent catch; fallback logic below handles offline/fallback
    }

    if (!reply) {
      const lower = text.toLowerCase();
      if (lower.includes('maurilo') || lower.includes('reunião') || lower.includes('consulta')) {
        reply = 'Perfeito. O Dr. Maurilo Cardoso atua prioritariamente em litígios estratégicos, Direito Tributário e Tribunais Superiores (TRF1/STJ/STF), com base em Cametá e atendimento nacional. Deseja registrar seus dados para contato prioritário via WhatsApp?';
        nextOptions = ['Sim, preencher formulário', 'Falar direto no WhatsApp'];
      } else if (lower.includes('lorenzo') || lower.includes('tech') || lower.includes('software') || lower.includes('automação')) {
        reply = 'Lorenzo Cardoso lidera a área de Engenharia de Automação Jurídica, conformidade algorítmica e jurimetria. Qual o escopo da sua demanda empresarial?';
        nextOptions = ['Automação de Escritório', 'Compliance LGPD / IA', 'Integração de APIs'];
      } else if (lower.includes('club') || lower.includes('19,90') || lower.includes('assinatura') || lower.includes('materiais')) {
        reply = 'O Andrade Cardoso Club conta com mais de 35 modelos autorais de peças cíveis e tributárias, manuais e scripts de automação. Deseja assinar agora pelo Stripe?';
        nextOptions = ['Ver Materiais Disponíveis', 'Ir para o Checkout Stripe'];
      } else if (lower.includes('urgente') || lower.includes('processo') || lower.includes('triagem')) {
        reply = 'Entendido. Em casos com prazos processuais em curso ou bloqueios judiciais, nossa equipe realiza triagem prioritária. Por favor, informe seu nome e telefone WhatsApp.';
      } else {
        reply = 'Agradeço as informações. Posso orientar sua demanda e, se necessário, encaminhá-la para contato com o escritório pelos canais disponíveis.';
        nextOptions = ['Falar com Concierge no WhatsApp', 'Consultar Jurisprudência'];
      }
    }

    const aiMsg: ChatMessage = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: reply,
      timestamp: 'Agora',
      options: nextOptions,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 sm:gap-3 p-3 sm:px-5 sm:py-3.5 rounded-full bg-[#0E1524] border border-[#C5A880]/60 text-white shadow-2xl hover:border-[#D4AF37] hover:scale-105 transition-all cursor-pointer"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-[#C5A880]" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#080B11]" />
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-semibold text-[#F3E5D0]">Concierge Virtual</div>
            <div className="text-[10px] text-slate-400">Atendimento · Triagem IA</div>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="relative w-[calc(100vw-32px)] sm:w-[380px] md:w-[400px] max-w-[400px] h-[480px] sm:h-[520px] max-h-[82vh] rounded-2xl border border-[#2B374E] bg-[#0A0F1A] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          <div className="p-4 border-b border-[#1E2638] bg-[#0E1626] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <div className="font-cinzel text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <span>Concierge Andrade Cardoso</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[10px] text-[#C5A880] font-sans-luxury">
                  Triagem Inteligente · OAB/Cametá
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Fechar concierge"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#080B11]/60">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl text-xs font-sans-luxury leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#C5A880] text-[#0B0F17] font-medium rounded-br-none'
                      : 'bg-[#121A2C] text-slate-200 border border-[#222E44] rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {m.options && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                    {m.options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => {
                          if (opt === 'Sim, preencher formulário' && onOpenConsultation) {
                            onOpenConsultation();
                          } else if (opt === 'Falar direto no WhatsApp' || opt === 'Falar com Concierge no WhatsApp') {
                            window.open('https://w.app/lorenzo_cardoso_software_engineer', '_blank', 'noopener,noreferrer');
                          } else {
                            handleSendMessage(opt);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-[#152136] hover:bg-[#C5A880] hover:text-[#0B0F17] border border-[#293B57] text-[11px] text-slate-300 transition-colors cursor-pointer text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#121A2C] border border-[#222E44] w-fit text-xs text-[#C5A880] animate-pulse">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[11px] text-slate-400">Concierge redigindo orientação...</span>
              </div>
            )}
          </div>

          <div className="px-4 py-2 bg-[#0C121E] border-t border-[#1E2638] flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              Algoritmo de Triagem Ativo
            </span>
            <a
              href="https://w.app/lorenzo_cardoso_software_engineer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline flex items-center gap-1 font-medium"
            >
              <Phone className="w-3 h-3" /> WhatsApp Direto
            </a>
          </div>

          <div className="p-3 bg-[#0A0F1A] border-t border-[#1E2638] flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua dúvida ou demanda..."
              aria-label="Mensagem para o concierge"
              maxLength={1000}
              className="flex-1 px-3 py-2 rounded-lg bg-[#080B11] border border-[#232D42] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="p-2 rounded-lg bg-[#C5A880] text-[#0B0F17] hover:bg-[#D4AF37] transition-colors cursor-pointer"
              aria-label="Enviar mensagem"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
