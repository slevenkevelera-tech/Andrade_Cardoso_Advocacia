import React, { useState, useEffect } from 'react';
import {
  initAuth,
  googleSignIn,
  logout,
  getAccessToken,
} from '../services/googleAuth';
import {
  listGmailMessages,
  getGmailMessage,
  sendGmailEmail,
  trashGmailMessage,
  getGmailProfile,
  GmailMessageSummary,
  GmailUserProfile,
} from '../services/gmailApi';
import { User } from 'firebase/auth';
import {
  Mail,
  Send,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  FileText,
  User as UserIcon,
  LogOut,
  X,
  ExternalLink,
  Inbox,
  Clock,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface GmailHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRecipient?: string;
  defaultSubject?: string;
}

export const GmailHubModal: React.FC<GmailHubModalProps> = ({
  isOpen,
  onClose,
  defaultRecipient = '',
  defaultSubject = '',
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [profile, setProfile] = useState<GmailUserProfile | null>(null);

  // Tabs & Views
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageSummary | null>(null);

  // Data & Loading
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Compose State
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Mandatory Confirmation Dialog State
  const [pendingConfirmation, setPendingConfirmation] = useState<{
    type: 'send' | 'trash';
    messageId?: string;
    details: string;
  } | null>(null);

  // Check auth state on mount
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, accessToken) => {
        setCurrentUser(user);
        setToken(accessToken);
        loadGmailData(accessToken);
      },
      () => {
        setCurrentUser(null);
        setToken(null);
        setMessages([]);
        setProfile(null);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  useEffect(() => {
    if (defaultRecipient) setRecipient(defaultRecipient);
    if (defaultSubject) setSubject(defaultSubject);
  }, [defaultRecipient, defaultSubject]);

  const loadGmailData = async (accessToken: string, query: string = '') => {
    setIsLoadingMessages(true);
    setErrorMessage(null);
    try {
      const [profileData, messageList] = await Promise.all([
        getGmailProfile(accessToken).catch(() => null),
        listGmailMessages(accessToken, query, 12),
      ]);

      if (profileData) {
        setProfile(profileData);
      }

      if (messageList.messages && messageList.messages.length > 0) {
        // Fetch details in parallel
        const fullMessages = await Promise.all(
          messageList.messages.slice(0, 10).map((m) =>
            getGmailMessage(accessToken, m.id).catch(() => null)
          )
        );
        setMessages(fullMessages.filter((m): m is GmailMessageSummary => m !== null));
      } else {
        setMessages([]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar dados do Gmail:', err);
      setErrorMessage(err.message || 'Falha ao sincronizar mensagens com o Gmail.');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        setToken(result.accessToken);
        await loadGmailData(result.accessToken);
      }
    } catch (err: any) {
      console.error('Falha no login Google:', err);
      setErrorMessage(
        err.message || 'Falha na autenticação com o Google Workspace. Tente novamente.'
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setCurrentUser(null);
      setToken(null);
      setMessages([]);
      setSelectedMessage(null);
      setProfile(null);
    } catch (err) {
      console.error('Erro ao sair:', err);
    }
  };

  // Pre-confirmation triggers
  const promptSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || !subject.trim() || !body.trim()) {
      setErrorMessage('Preencha o destinatário, assunto e mensagem do e-mail.');
      return;
    }
    setPendingConfirmation({
      type: 'send',
      details: `Você confirma o envio deste e-mail oficial para ${recipient} com o assunto "${subject}"?`,
    });
  };

  const promptTrashMessage = (messageId: string, subjectTitle: string) => {
    setPendingConfirmation({
      type: 'trash',
      messageId,
      details: `Você tem certeza de que deseja mover a mensagem "${subjectTitle}" para a lixeira do Gmail?`,
    });
  };

  // Execution after user confirmation
  const handleExecuteConfirmedAction = async () => {
    if (!pendingConfirmation || !token) return;

    if (pendingConfirmation.type === 'send') {
      setIsSending(true);
      setErrorMessage(null);
      try {
        await sendGmailEmail(token, recipient, subject, body, currentUser?.email || undefined);
        setSuccessNotice(`E-mail oficial enviado com sucesso para ${recipient}!`);
        setRecipient('');
        setSubject('');
        setBody('');
        setActiveTab('inbox');
        setTimeout(() => setSuccessNotice(null), 5000);
        // Reload list
        loadGmailData(token);
      } catch (err: any) {
        setErrorMessage(`Falha no envio: ${err.message}`);
      } finally {
        setIsSending(false);
        setPendingConfirmation(null);
      }
    } else if (pendingConfirmation.type === 'trash' && pendingConfirmation.messageId) {
      const mId = pendingConfirmation.messageId;
      try {
        await trashGmailMessage(token, mId);
        setMessages((prev) => prev.filter((m) => m.id !== mId));
        if (selectedMessage?.id === mId) {
          setSelectedMessage(null);
        }
        setSuccessNotice('Mensagem movida para a lixeira do Gmail.');
        setTimeout(() => setSuccessNotice(null), 4000);
      } catch (err: any) {
        setErrorMessage(`Falha ao excluir mensagem: ${err.message}`);
      } finally {
        setPendingConfirmation(null);
      }
    }
  };

  const applyLegalTemplate = (title: string, templateText: string) => {
    setSubject(title);
    setBody(templateText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl border border-[#2B374E] bg-[#0B0F17] shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E2638] bg-[#0E1524]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#EA4335]/15 border border-[#EA4335]/30 text-[#EA4335]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold text-white tracking-wide">
                  Gmail Jurídico & Correspondência
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-luxury bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 uppercase">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans-luxury">
                Canal oficial de correspondência processual, notificações e despachos com sócios.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-rose-400 border border-[#232D42] hover:border-rose-900/50 bg-[#121927] transition-colors"
                title="Desconectar do Google Workspace"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Desconectar</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notices */}
        {errorMessage && (
          <div className="px-6 py-2.5 bg-rose-950/40 border-b border-rose-800/40 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {successNotice && (
          <div className="px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-800/40 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content Area */}
        {!currentUser ? (
          /* Sign-in screen with official Google GSI styling */
          <div className="p-8 sm:p-14 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#1A2234] border border-[#2B374E] flex items-center justify-center mb-6 shadow-inner">
              <Mail className="w-8 h-8 text-[#C5A880]" />
            </div>

            <h4 className="font-cinzel text-xl sm:text-2xl font-bold text-white mb-2">
              Conecte sua conta Gmail ao Portal
            </h4>
            <p className="text-sm text-slate-300 font-sans-luxury max-w-lg mb-8 leading-relaxed">
              Acesse suas comunicações processuais, responda notificações de tribunais e envie correspondências jurídicas oficiais com chancela do escritório Andrade & Cardoso diretamente pelo Gmail.
            </p>

            {/* Official Material Google Sign In Button */}
            <button
              onClick={handleSignIn}
              disabled={isLoggingIn}
              className="relative inline-flex items-center justify-center gap-3 px-6 py-3 rounded-lg border border-[#374151] bg-[#1F2937] hover:bg-[#374151] text-white font-medium text-sm transition-all shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                />
              </svg>
              <span>{isLoggingIn ? 'Conectando ao Google...' : 'Entrar com o Google'}</span>
            </button>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl text-left border-t border-[#1E2638] pt-8">
              <div className="p-3 rounded-lg bg-[#0F1626] border border-[#1E2638]">
                <div className="text-xs font-semibold text-[#C5A880] mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Notificações Oficiais
                </div>
                <div className="text-[11px] text-slate-400">
                  Consulte intimações, publicações e comunicados de tribunais.
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0F1626] border border-[#1E2638]">
                <div className="text-xs font-semibold text-[#C5A880] mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Envio com Confirmação
                </div>
                <div className="text-[11px] text-slate-400">
                  Envie peças e despachos com verificação prévia de segurança.
                </div>
              </div>
              <div className="p-3 rounded-lg bg-[#0F1626] border border-[#1E2638]">
                <div className="text-xs font-semibold text-[#C5A880] mb-1 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Segurança Google
                </div>
                <div className="text-[11px] text-slate-400">
                  Conexão autorizada com tokens temporários em memória.
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard with Tabs */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* User Bar & Subnav */}
            <div className="px-6 py-3 bg-[#0A0E17] border-b border-[#1E2638] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-[#2B374E] bg-[#162032] flex items-center justify-center text-xs font-semibold text-[#C5A880]">
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || ''}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{currentUser.displayName || currentUser.email}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" title="Conectado" />
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {profile?.emailAddress || currentUser.email}
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setActiveTab('inbox');
                    setSelectedMessage(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                    activeTab === 'inbox'
                      ? 'bg-[#C5A880] text-[#090D15] shadow-md font-semibold'
                      : 'bg-[#121927] text-slate-300 hover:text-white border border-[#232D42]'
                  }`}
                >
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Caixa de Entrada</span>
                </button>

                <button
                  onClick={() => setActiveTab('compose')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
                    activeTab === 'compose'
                      ? 'bg-[#C5A880] text-[#090D15] shadow-md font-semibold'
                      : 'bg-[#121927] text-slate-300 hover:text-white border border-[#232D42]'
                  }`}
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Escrever E-mail</span>
                </button>

                <button
                  onClick={() => token && loadGmailData(token, searchQuery)}
                  disabled={isLoadingMessages}
                  className="p-2 rounded-lg bg-[#121927] text-slate-400 hover:text-white border border-[#232D42] transition-colors"
                  title="Atualizar mensagens"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* View: Inbox / Selected Message / Compose */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {activeTab === 'inbox' && (
                <div>
                  {selectedMessage ? (
                    /* Detail of a single message */
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between pb-3 border-b border-[#1E2638]">
                        <button
                          onClick={() => setSelectedMessage(null)}
                          className="flex items-center gap-1.5 text-xs text-[#C5A880] hover:underline cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                          <span>Voltar para a lista</span>
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setRecipient(selectedMessage.from);
                              setSubject(`Re: ${selectedMessage.subject}`);
                              setActiveTab('compose');
                            }}
                            className="px-3 py-1 rounded bg-[#121927] hover:bg-[#1C273C] text-xs text-slate-200 border border-[#2A344A] flex items-center gap-1.5"
                          >
                            <Send className="w-3 h-3 text-[#C5A880]" />
                            <span>Responder</span>
                          </button>

                          <button
                            onClick={() => promptTrashMessage(selectedMessage.id, selectedMessage.subject)}
                            className="px-3 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-xs text-rose-300 border border-rose-800/40 flex items-center gap-1.5"
                            title="Mover para a lixeira"
                          >
                            <Trash2 className="w-3 h-3 text-rose-400" />
                            <span>Excluir</span>
                          </button>
                        </div>
                      </div>

                      <div className="bg-[#0E1524] p-5 rounded-xl border border-[#1E2638]">
                        <h4 className="font-cinzel text-lg sm:text-xl font-bold text-white mb-2">
                          {selectedMessage.subject}
                        </h4>

                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pb-4 border-b border-[#1E2638]">
                          <div>
                            <span className="font-semibold text-slate-200">De: </span>
                            <span>{selectedMessage.from}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#C5A880]" />
                            <span>{selectedMessage.date}</span>
                          </div>
                        </div>

                        <div className="mt-4 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans-luxury whitespace-pre-wrap">
                          {selectedMessage.bodyText || selectedMessage.snippet}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Messages List */
                    <div>
                      {/* Search Bar & Quick Filters */}
                      <div className="flex flex-col sm:flex-row items-center gap-3 mb-4">
                        <div className="relative flex-1 w-full">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && token) {
                                loadGmailData(token, searchQuery);
                              }
                            }}
                            placeholder="Pesquisar por processo, tribunal, remetente ou assunto..."
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0E1524] border border-[#232D42] text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-[#C5A880]"
                          />
                        </div>
                        <button
                          onClick={() => token && loadGmailData(token, searchQuery)}
                          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#121927] hover:bg-[#1E273A] border border-[#2B374E] text-xs text-slate-200 font-medium transition-colors"
                        >
                          Buscar
                        </button>
                      </div>

                      {/* Messages list rendering */}
                      {isLoadingMessages ? (
                        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                          <RefreshCw className="w-5 h-5 text-[#C5A880] animate-spin" />
                          <span>Carregando comunicações do Gmail...</span>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-3">
                          <Inbox className="w-8 h-8 text-slate-600" />
                          <span>Nenhuma mensagem encontrada para esta consulta.</span>
                        </div>
                      ) : (
                        <div className="divide-y divide-[#1A2234] border border-[#1E2638] rounded-xl overflow-hidden bg-[#0C121E]">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              onClick={() => setSelectedMessage(msg)}
                              className={`p-4 flex items-start gap-4 hover:bg-[#131B2B] cursor-pointer transition-colors ${
                                msg.unread ? 'bg-[#0E1628]/80 font-medium' : ''
                              }`}
                            >
                              <div className="mt-1">
                                <span
                                  className={`w-2.5 h-2.5 rounded-full block ${
                                    msg.unread ? 'bg-[#C5A880]' : 'bg-transparent'
                                  }`}
                                />
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-xs text-slate-200 font-semibold truncate">
                                    {msg.from.split('<')[0].replace(/"/g, '')}
                                  </span>
                                  <span className="text-[11px] text-slate-500 shrink-0 font-mono-luxury">
                                    {msg.date.split(',')[1] || msg.date}
                                  </span>
                                </div>

                                <div className="text-xs text-[#F8FAFC] truncate font-medium">
                                  {msg.subject}
                                </div>

                                <p className="text-[11px] text-slate-400 truncate mt-1">
                                  {msg.snippet}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* View: Compose Email */}
              {activeTab === 'compose' && (
                <form onSubmit={promptSendEmail} className="flex flex-col gap-4 animate-in fade-in duration-200">
                  {/* Quick Legal Templates */}
                  <div className="p-3 bg-[#0E1524] rounded-xl border border-[#1E2638]">
                    <div className="text-xs font-semibold text-[#C5A880] mb-2 flex items-center gap-1.5 font-cinzel">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Modelos Rápidos de Correspondência Jurídica</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          applyLegalTemplate(
                            'Andamento Processual · Andrade & Cardoso Advocacia',
                            'Prezado(a) Cliente,\n\nInformamos que houve movimentação relevante nos autos do seu processo judicial.\nNossa equipe jurídica já adotou as providências cabíveis e estamos à disposição para maiores esclarecimentos.\n\nAtenciosamente,\nAndrade & Cardoso Advocacia Estratégica'
                          )
                        }
                        className="px-2.5 py-1 rounded bg-[#121927] hover:bg-[#1B2538] border border-[#232D42] text-[11px] text-slate-300 hover:text-white transition-colors"
                      >
                        Andamento Processual
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          applyLegalTemplate(
                            'Envio de Minuta Contratual para Revisão',
                            'Prezado(a),\n\nSegue em anexo a minuta preliminar do contrato devidamente formatada conforme as tratativas e diretrizes de conformidade jurídica.\nSolicitamos a leitura das cláusulas contratuais e retorno com eventuais apontamentos.\n\nCordialmente,\nAndrade & Cardoso Advocacia'
                          )
                        }
                        className="px-2.5 py-1 rounded bg-[#121927] hover:bg-[#1B2538] border border-[#232D42] text-[11px] text-slate-300 hover:text-white transition-colors"
                      >
                        Minuta de Contrato
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          applyLegalTemplate(
                            'Confirmação de Consulta Jurídica com Dr. Maurilo Cardoso',
                            'Prezado(a),\n\nConfirmamos o agendamento de sua consulta jurídica estratégica com o Dr. Maurilo Cardoso.\nData e Horário: Conforme alinhado previamente.\nLocal: Plataforma Virtual / Sede Belém.\n\nEm caso de dúvidas, permaneço ao dispor.\n\nAtenciosamente,\nEquipe Andrade & Cardoso'
                          )
                        }
                        className="px-2.5 py-1 rounded bg-[#121927] hover:bg-[#1B2538] border border-[#232D42] text-[11px] text-slate-300 hover:text-white transition-colors"
                      >
                        Consulta Dr. Maurilo
                      </button>
                    </div>
                  </div>

                  {/* Form fields */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Destinatário (E-mail):
                    </label>
                    <input
                      type="email"
                      required
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="exemplo@tribunal.jus.br ou cliente@empresa.com.br"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0E1524] border border-[#232D42] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Assunto:
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Ref. Autos nº ... ou Parecer Jurídico"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0E1524] border border-[#232D42] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Mensagem / Despacho:
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Escreva a correspondência jurídica oficial..."
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0E1524] border border-[#232D42] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#C5A880] font-sans-luxury leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('inbox')}
                      className="px-4 py-2 rounded-lg bg-[#121927] hover:bg-[#1A2334] text-xs text-slate-300 border border-[#232D42] transition-colors"
                    >
                      Cancelar
                    </button>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="px-6 py-2.5 rounded-lg bg-[#C5A880] hover:bg-[#D4AF37] text-[#090D15] font-semibold text-xs transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSending ? 'Enviando...' : 'Revisar & Enviar E-mail'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* MANDATORY Confirmation Modal for Workspace Data Mutations */}
        {pendingConfirmation && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
            <div className="w-full max-w-md p-6 rounded-xl border border-[#C5A880]/50 bg-[#0C121E] shadow-2xl">
              <div className="flex items-center gap-3 text-[#C5A880] mb-3">
                <AlertTriangle className="w-5 h-5 text-[#C5A880]" />
                <h4 className="font-cinzel text-base font-bold text-white">
                  Confirmação Obrigatória
                </h4>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 font-sans-luxury leading-relaxed mb-6">
                {pendingConfirmation.details}
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPendingConfirmation(null)}
                  className="px-4 py-2 rounded-lg bg-[#121927] hover:bg-[#1A2334] text-xs text-slate-300 border border-[#232D42] transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleExecuteConfirmedAction}
                  className="px-5 py-2 rounded-lg bg-[#C5A880] hover:bg-[#D4AF37] text-[#090D15] font-bold text-xs transition-colors shadow-md cursor-pointer"
                >
                  Confirmar e Prosseguir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
