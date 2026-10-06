import React, { useState } from 'react';
import { INITIAL_LEADS, INITIAL_AUTOMATIONS, INITIAL_WEBHOOKS } from '../data/mockData';
import { Lead, AutomationRule, WebhookConfig } from '../types';
import {
  LayoutDashboard,
  Users,
  Zap,
  Webhook,
  DollarSign,
  Send,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Filter,
  Phone,
  Mail,
  Building,
  TrendingUp,
  RefreshCw,
  Sliders,
  ExternalLink,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenConsultation,
}) => {
  const [activeTab, setActiveTab] = useState<'crm' | 'automations' | 'communication' | 'webhooks' | 'financial'>('crm');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [automations, setAutomations] = useState<AutomationRule[]>(INITIAL_AUTOMATIONS);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>(INITIAL_WEBHOOKS);

  // New Lead state
  const [isAddingLead, setIsAddingLead] = useState(false);
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadCompany, setNewLeadCompany] = useState('');
  const [newLeadEmail, setNewLeadEmail] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadArea, setNewLeadArea] = useState('Tributário');
  const [newLeadValue, setNewLeadValue] = useState('50000');

  // Communication message state
  const [targetLead, setTargetLead] = useState<Lead>(INITIAL_LEADS[0]);
  const [messageTemplate, setMessageTemplate] = useState(
    'Olá {{nome}}, aqui é do gabinete do Dr. Maurilo Cardoso e Lorenzo Cardoso (Andrade Cardoso Advogados). Confirmamos o recebimento da sua demanda sobre {{area}}. Nosso comitê já preparou a análise prévia de jurisprudência. Qual o melhor horário para alinharmos por videoconferência?'
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalPipelineValue = leads.reduce((acc, curr) => acc + curr.estimatedValue, 0);

  const stages: Lead['stage'][] = [
    'Novo Lead',
    'Triagem Qualificada',
    'Consulta Agendada',
    'Proposta Enviada',
    'Contrato Fechado',
  ];

  const handleMoveStage = (leadId: string, direction: 'next' | 'prev') => {
    setLeads((prev) =>
      prev.map((lead) => {
        if (lead.id !== leadId) return lead;
        const currentIndex = stages.indexOf(lead.stage);
        const newIndex = direction === 'next' ? Math.min(stages.length - 1, currentIndex + 1) : Math.max(0, currentIndex - 1);
        return { ...lead, stage: stages[newIndex], lastContact: 'Agora mesmo' };
      })
    );
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName) return;

    const created: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadName,
      company: newLeadCompany || 'Pessoa Física',
      email: newLeadEmail || 'contato@cliente.com',
      phone: newLeadPhone || '(91) 98000-0000',
      stage: 'Novo Lead',
      legalArea: newLeadArea,
      estimatedValue: Number(newLeadValue) || 20000,
      priority: 'Alta',
      source: 'Site',
      lastContact: 'Agora mesmo',
      notes: 'Cadastrado diretamente pelo painel administrativo.',
    };

    setLeads([created, ...leads]);
    setIsAddingLead(false);
    setNewLeadName('');
    setNewLeadCompany('');
    setNewLeadEmail('');
    setNewLeadPhone('');
    showFeedback('Novo lead adicionado e triagem inicial engatilhada automaticamente!');
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isActive: !item.isActive } : item))
    );
  };

  const handleTestAutomation = (autoName: string) => {
    showFeedback(`Disparo de teste executado para a regra: "${autoName}". Notificação enviada para o canal com sucesso.`);
  };

  const handleSendFollowUp = (channel: 'whatsapp' | 'email') => {
    const parsedText = messageTemplate
      .replace('{{nome}}', targetLead.name)
      .replace('{{area}}', targetLead.legalArea);

    if (channel === 'whatsapp') {
      const cleanPhone = targetLead.phone.replace(/\D/g, '');
      const waUrl = `https://wa.me/55${cleanPhone || '91981234567'}?text=${encodeURIComponent(parsedText)}`;
      window.open(waUrl, '_blank');
      showFeedback(`WhatsApp aberto com mensagem automatizada de follow-up para ${targetLead.name}!`);
    } else {
      showFeedback(`E-mail com proposta e apresentação institucional enviado para ${targetLead.email}!`);
    }
  };

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-7xl h-[92vh] flex flex-col rounded-2xl border border-[#2B374E] bg-[#0A0F1A] shadow-2xl overflow-hidden">
        {/* Top Header Bar */}
        <div className="px-6 py-4 border-b border-[#1E2638] bg-[#0D1424] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#C5A880]/10 border border-[#C5A880]/30 text-[#C5A880]">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-cinzel text-lg sm:text-xl font-bold text-white">
                  Andrade Cardoso · Central de Gestão & CRM
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono-luxury border border-emerald-800">
                  Online 24/7
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gabinete Virtual: Dr. Maurilo Cardoso (OAB/Cametá) & Lorenzo Cardoso (Automação)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                Valor Total no Funil
              </span>
              <span className="text-sm font-bold font-mono-luxury text-[#F3E5D0]">
                R$ {totalPipelineValue.toLocaleString('pt-BR')},00
              </span>
            </div>

            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border border-[#2B374E] bg-[#141E30] text-slate-300 hover:text-white hover:bg-[#1A2840] text-xs font-medium cursor-pointer transition-colors"
            >
              Fechar Painel
            </button>
          </div>
        </div>

        {/* Feedback Alert Banner */}
        {feedbackMessage && (
          <div className="bg-emerald-950/90 border-b border-emerald-600/50 px-6 py-2.5 text-xs text-emerald-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#1E2638] bg-[#0A0F1A] overflow-x-auto">
          {[
            { id: 'crm', label: 'Funil CRM & Captação', icon: Users },
            { id: 'automations', label: 'Regras de Automação', icon: Zap },
            { id: 'communication', label: 'Follow-up & WhatsApp', icon: Send },
            { id: 'webhooks', label: 'Hooks de Integração & APIs', icon: Webhook },
            { id: 'financial', label: 'Receita Recorrente (MRR)', icon: TrendingUp },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'border-[#C5A880] text-[#F3E5D0] bg-[#101726]/60 rounded-t-lg'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A880]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#080B11]/50">
          {/* TAB 1: CRM Funnel */}
          {activeTab === 'crm' && (
            <div className="space-y-6">
              {/* Top Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-cinzel text-lg font-bold text-white">
                    Pipeline Comercial & Captação Ativa
                  </h3>
                  <p className="text-xs text-slate-400">
                    Acompanhe cada oportunidade desde a triagem com IA até a assinatura do contrato de honorários.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingLead(!isAddingLead)}
                  className="px-4 py-2 rounded-lg bg-[#C5A880] hover:bg-[#D4AF37] text-[#0B0F17] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>Novo Lead / Caso</span>
                </button>
              </div>

              {/* Add Lead Form Collapse */}
              {isAddingLead && (
                <form
                  onSubmit={handleCreateLead}
                  className="p-5 rounded-xl border border-[#2B374E] bg-[#0E1524] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
                >
                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      Nome do Cliente / Representante
                    </label>
                    <input
                      type="text"
                      value={newLeadName}
                      onChange={(e) => setNewLeadName(e.target.value)}
                      placeholder="Ex: Carlos Albuquerque"
                      required
                      className="w-full px-3 py-2 rounded bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      Empresa / Instituição
                    </label>
                    <input
                      type="text"
                      value={newLeadCompany}
                      onChange={(e) => setNewLeadCompany(e.target.value)}
                      placeholder="Ex: TransPortes Logística S/A"
                      className="w-full px-3 py-2 rounded bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      Área do Direito
                    </label>
                    <select
                      value={newLeadArea}
                      onChange={(e) => setNewLeadArea(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    >
                      <option value="Tributário">Tributário & Fiscal</option>
                      <option value="Empresarial & Societário">Empresarial & Societário</option>
                      <option value="Civil & Contratos">Civil & Contratos</option>
                      <option value="Trabalhista Estratégico">Trabalhista Estratégico</option>
                      <option value="Regulatório & Portuário">Regulatório & Portuário</option>
                      <option value="LGPD & Automação">LGPD & Automação</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      WhatsApp / Telefone
                    </label>
                    <input
                      type="text"
                      value={newLeadPhone}
                      onChange={(e) => setNewLeadPhone(e.target.value)}
                      placeholder="(91) 98000-0000"
                      className="w-full px-3 py-2 rounded bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 uppercase tracking-wider mb-1">
                      Honorários Estimados (R$)
                    </label>
                    <input
                      type="number"
                      value={newLeadValue}
                      onChange={(e) => setNewLeadValue(e.target.value)}
                      placeholder="50000"
                      className="w-full px-3 py-2 rounded bg-[#080B11] border border-[#232D42] text-xs text-white focus:border-[#C5A880] focus:outline-none font-mono-luxury"
                    />
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      type="submit"
                      className="w-full py-2 rounded bg-[#C5A880] hover:bg-[#D4AF37] text-[#0B0F17] text-xs font-bold uppercase tracking-wider cursor-pointer"
                    >
                      Salvar e Iniciar Triagem
                    </button>
                  </div>
                </form>
              )}

              {/* Kanban Column Layout - Horizontal swipe on mobile, 5 cols on desktop */}
              <div className="flex md:grid md:grid-cols-5 gap-4 overflow-x-auto pb-4 snap-x">
                {stages.map((stg) => {
                  const stageLeads = leads.filter((l) => l.stage === stg);
                  const stageValue = stageLeads.reduce((s, curr) => s + curr.estimatedValue, 0);

                  return (
                    <div
                      key={stg}
                      className="w-[280px] md:w-auto shrink-0 md:shrink flex flex-col rounded-xl border border-[#1E2638] bg-[#0C121E] overflow-hidden snap-start"
                    >
                      {/* Column Header */}
                      <div className="p-3 border-b border-[#1A2234] bg-[#0E1524]">
                        <div className="flex items-center justify-between text-xs font-semibold text-white">
                          <span className="truncate">{stg}</span>
                          <span className="font-mono-luxury px-1.5 py-0.5 rounded bg-[#182236] text-[#C5A880] text-[10px]">
                            {stageLeads.length}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono-luxury mt-1">
                          R$ {stageValue.toLocaleString('pt-BR')}
                        </div>
                      </div>

                      {/* Cards in this stage */}
                      <div className="p-3 space-y-3 flex-1 min-h-[300px] overflow-y-auto">
                        {stageLeads.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 rounded-lg border border-[#1E2638] bg-[#080B11] hover:border-[#C5A880]/50 transition-colors shadow-sm space-y-2 group"
                          >
                            <div className="flex items-start justify-between gap-1">
                              <span className="text-xs font-bold text-slate-200 group-hover:text-[#F3E5D0]">
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#C5A880] font-mono-luxury">
                                R$ {item.estimatedValue.toLocaleString('pt-BR')}
                              </span>
                            </div>

                            {item.company && (
                              <div className="text-[11px] text-slate-400 flex items-center gap-1 truncate">
                                <Building className="w-3 h-3 text-slate-500 shrink-0" />
                                <span>{item.company}</span>
                              </div>
                            )}

                            <div className="text-[10px] text-[#94A3B8] bg-[#101726] px-2 py-0.5 rounded">
                              {item.legalArea}
                            </div>

                            <p className="text-[10px] text-slate-400 line-clamp-2">
                              {item.notes}
                            </p>

                            {/* Stage progression controls */}
                            <div className="pt-2 border-t border-[#182030] flex items-center justify-between text-[10px]">
                              <button
                                onClick={() => handleMoveStage(item.id, 'prev')}
                                className="text-slate-500 hover:text-slate-300 cursor-pointer"
                                title="Mover para estágio anterior"
                              >
                                ← Voltar
                              </button>
                              <button
                                onClick={() => {
                                  setTargetLead(item);
                                  setActiveTab('communication');
                                }}
                                className="text-[#C5A880] hover:underline cursor-pointer"
                              >
                                Follow-up
                              </button>
                              <button
                                onClick={() => handleMoveStage(item.id, 'next')}
                                className="text-slate-500 hover:text-white cursor-pointer"
                                title="Avançar estágio"
                              >
                                Avançar →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: Automation Rules */}
          {activeTab === 'automations' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Motor de Automação Jurídica & Disparos Contínuos
                </h3>
                <p className="text-xs text-slate-400">
                  Regras configuradas por Lorenzo Cardoso para garantir tempo de resposta imediato, nutrição de leads e indexação de jurisprudência.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {automations.map((auto) => (
                  <div
                    key={auto.id}
                    className="p-5 rounded-xl border border-[#1E2638] bg-[#0C121E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-[#141E30] text-[#C5A880] border border-[#232F47] shrink-0">
                        <Zap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h4 className="font-cinzel text-sm font-bold text-white">
                            {auto.name}
                          </h4>
                          <span className="text-[10px] font-mono-luxury px-2 py-0.5 rounded bg-[#182338] text-[#C5A880]">
                            {auto.channel}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-400">
                          <strong className="text-slate-300">Gatilho:</strong> {auto.trigger}
                        </div>
                        <div className="mt-0.5 text-xs text-slate-400">
                          <strong className="text-slate-300">Ação:</strong> {auto.action}
                        </div>
                        <div className="mt-2 text-[11px] text-[#64748B] flex items-center gap-3">
                          <span>Execuções: <strong className="text-slate-300 font-mono-luxury">{auto.executionsCount}</strong></span>
                          <span>·</span>
                          <span>Última execução: {auto.lastExecuted}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => handleTestAutomation(auto.name)}
                        className="px-3 py-1.5 rounded border border-[#2B374E] bg-[#121A2C] text-xs text-slate-300 hover:text-white cursor-pointer"
                      >
                        Simular Teste
                      </button>

                      <button
                        onClick={() => handleToggleAutomation(auto.id)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer ${
                          auto.isActive
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border border-rose-700'
                        }`}
                      >
                        {auto.isActive ? 'Ativo' : 'Pausado'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Communication & Multi-channel Follow-up */}
          {activeTab === 'communication' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Central de Follow-up & Disparos Multicanal
                </h3>
                <p className="text-xs text-slate-400">
                  Responda clientes em segundos com personalização dinâmica e encaminhamento direto para o WhatsApp de Maurilo ou Lorenzo Cardoso.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Select Lead */}
                <div className="rounded-xl border border-[#1E2638] bg-[#0C121E] p-4 space-y-3">
                  <h4 className="text-xs uppercase tracking-wider text-[#C5A880] font-semibold">
                    Selecionar Destinatário
                  </h4>
                  <div className="space-y-2 max-h-[380px] overflow-y-auto">
                    {leads.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => setTargetLead(l)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all ${
                          targetLead.id === l.id
                            ? 'border-[#C5A880] bg-[#131C2E]'
                            : 'border-[#1E2638] bg-[#080B11] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold text-white">
                          <span>{l.name}</span>
                          <span className="text-[10px] text-[#C5A880]">{l.stage}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 mt-1">{l.legalArea}</div>
                        <div className="text-[10px] text-slate-500 font-mono-luxury mt-0.5">{l.phone}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Message Editor */}
                <div className="lg:col-span-2 rounded-xl border border-[#1E2638] bg-[#0C121E] p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
                      <div>
                        <span className="text-xs text-slate-400">Enviando para:</span>
                        <h4 className="font-cinzel text-base font-bold text-white">
                          {targetLead.name} ({targetLead.company || 'Pessoa Física'})
                        </h4>
                      </div>
                      <div className="text-right text-xs text-[#C5A880]">
                        {targetLead.phone} · {targetLead.email}
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="block text-[11px] uppercase tracking-wider text-slate-400 mb-2">
                        Template Inteligente (com variáveis auto-preenchidas)
                      </label>
                      <textarea
                        rows={6}
                        value={messageTemplate}
                        onChange={(e) => setMessageTemplate(e.target.value)}
                        className="w-full p-3.5 rounded-lg bg-[#080B11] border border-[#232D42] text-xs font-sans-luxury text-white focus:border-[#C5A880] focus:outline-none leading-relaxed"
                      />
                    </div>

                    <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-slate-400">
                      <span>Variáveis suportadas:</span>
                      <code className="text-[#C5A880] bg-[#141E30] px-1.5 py-0.5 rounded">{'{{nome}}'}</code>
                      <code className="text-[#C5A880] bg-[#141E30] px-1.5 py-0.5 rounded">{'{{area}}'}</code>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E2638] flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs text-slate-400">
                      Disparo registrado no histórico do cliente
                    </span>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleSendFollowUp('email')}
                        className="px-4 py-2 rounded border border-[#2A344A] bg-[#121A2C] text-xs font-medium text-slate-200 hover:text-white flex items-center gap-2 cursor-pointer"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Enviar via E-mail</span>
                      </button>

                      <button
                        onClick={() => handleSendFollowUp('whatsapp')}
                        className="px-5 py-2 rounded bg-[#25D366] hover:bg-[#20ba5a] text-[#0B0F17] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-md"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Disparar no WhatsApp</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Webhooks & APIs */}
          {activeTab === 'webhooks' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Hooks de Integração & Conexões de APIs
                </h3>
                <p className="text-xs text-slate-400">
                  Gerenciamento de webhooks para pagamentos Stripe, WhatsApp Cloud API, radar do Codex e Google Workspace.
                </p>
              </div>

              <div className="space-y-4">
                {webhooks.map((wh) => (
                  <div
                    key={wh.id}
                    className="p-5 rounded-xl border border-[#1E2638] bg-[#0C121E] space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <span className="font-cinzel text-sm font-bold text-white">
                          {wh.service}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 text-[10px] font-mono-luxury border border-emerald-800">
                          {wh.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono-luxury">
                        Ping: {wh.lastPing}
                      </span>
                    </div>

                    <div className="p-2.5 rounded bg-[#080B11] border border-[#1C2436] font-mono-luxury text-xs text-[#C5A880] truncate">
                      {wh.endpoint}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-500">Eventos escutados:</span>
                        {wh.events.map((e, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-[#131B2A] text-slate-300 font-mono-luxury text-[10px]"
                          >
                            {e}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => showFeedback(`Payload de teste enviado com êxito para ${wh.service}!`)}
                        className="text-xs text-[#C5A880] hover:underline cursor-pointer"
                      >
                        Disparar Ping de Teste
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Financial & Recurrent Revenue (MRR) */}
          {activeTab === 'financial' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-cinzel text-lg font-bold text-white">
                  Métricas de Receita Recorrente & Performance Financeira
                </h3>
                <p className="text-xs text-slate-400">
                  Monitoramento de receita mensal previsível via contratos de partido jurídico e assinaturas do Andrade Cardoso Club.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl border border-[#1E2638] bg-[#0C121E]">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    MRR Total (Recorrente)
                  </span>
                  <div className="mt-2 text-2xl font-bold font-mono-luxury text-[#F3E5D0]">
                    R$ 101.711<span className="text-xs text-slate-400">/mês</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-medium">
                    +18.4% em relação ao trimestre anterior
                  </span>
                </div>

                <div className="p-5 rounded-xl border border-[#1E2638] bg-[#0C121E]">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    Assinantes Club (Academy)
                  </span>
                  <div className="mt-2 text-2xl font-bold font-mono-luxury text-white">
                    890
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Plano R$ 19,90/mês · Churn &lt; 2.1%
                  </span>
                </div>

                <div className="p-5 rounded-xl border border-[#1E2638] bg-[#0C121E]">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    Empresas sob Partido Jurídico
                  </span>
                  <div className="mt-2 text-2xl font-bold font-mono-luxury text-white">
                    12 Contratos
                  </div>
                  <span className="text-[10px] text-[#C5A880]">
                    Ticket médio: R$ 7.000,00/mês
                  </span>
                </div>

                <div className="p-5 rounded-xl border border-[#1E2638] bg-[#0C121E]">
                  <span className="text-[11px] uppercase tracking-wider text-slate-400">
                    Inadimplência Stripe
                  </span>
                  <div className="mt-2 text-2xl font-bold font-mono-luxury text-emerald-400">
                    0.8%
                  </div>
                  <span className="text-[10px] text-slate-400">
                    Retentativa inteligente automática ativa
                  </span>
                </div>
              </div>

              {/* Breakdown Detail */}
              <div className="p-6 rounded-xl border border-[#1E2638] bg-[#0C121E] space-y-4">
                <h4 className="font-cinzel text-base font-bold text-white">
                  Detalhamento da Composição de Receita
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Partidos Jurídicos Mensais (Corporativo)</span>
                      <strong className="font-mono-luxury">R$ 84.000,00 (82.5%)</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#151E30] overflow-hidden">
                      <div className="h-full bg-[#C5A880] w-[82.5%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Andrade Cardoso Club (Advogados Iniciantes - R$ 19,90)</span>
                      <strong className="font-mono-luxury">R$ 17.711,00 (17.5%)</strong>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#151E30] overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[17.5%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
