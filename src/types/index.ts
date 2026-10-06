export interface Partner {
  id: string;
  name: string;
  role: string;
  badge: string;
  bio: string;
  credentials: string[];
  specialties: string[];
  quote: string;
  image: string;
  email: string;
  linkedin: string;
  whatsapp: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company: string;
  location: string;
  caseType: string;
  impactMetric: string;
  content: string;
  rating: number;
}

export interface Jurisprudence {
  id: string;
  tribunal: 'STF' | 'STJ' | 'TST' | 'TRF1' | 'TRF4' | 'TJSP' | 'TJPA';
  processo: string;
  relator: string;
  orgaoJulgador: string;
  dataJulgamento: string;
  area: 'Tributário' | 'Empresarial' | 'Cível' | 'Trabalhista' | 'Constitucional' | 'Automação & LGPD';
  temaOuSumula?: string;
  titulo: string;
  ementa: string;
  teseFixada: string;
  codexAiSummary: string;
  abntCitation: string;
  tags: string[];
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  tag: string;
  postUrl: string;
}

export interface AcademyMaterial {
  id: string;
  title: string;
  category: 'Peças Processuais' | 'Teses Estruturadas' | 'Prática de Audiência' | 'Automação para Escritórios' | 'Contratos & Gestão';
  description: string;
  fileFormat: 'DOCX + PDF' | 'PDF + Templates' | 'Planilha + Automação' | 'Vídeo + Kit';
  pageCountOrDuration: string;
  previewSnippet: string;
  isPopular?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  stage: 'Novo Lead' | 'Triagem Qualificada' | 'Consulta Agendada' | 'Proposta Enviada' | 'Contrato Fechado';
  legalArea: string;
  estimatedValue: number;
  priority: 'Alta' | 'Média' | 'Estratégica';
  source: 'Site' | 'WhatsApp Concierge' | 'Instagram' | 'Indicação';
  lastContact: string;
  notes: string;
}

export interface AutomationRule {
  id: string;
  name: string;
  channel: 'WhatsApp' | 'E-mail' | 'Google Calendar' | 'Stripe' | 'Codex Sync';
  trigger: string;
  action: string;
  isActive: boolean;
  executionsCount: number;
  lastExecuted: string;
}

export interface WebhookConfig {
  id: string;
  service: string;
  endpoint: string;
  events: string[];
  status: 'Ativo' | 'Pausado';
  lastPing: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: 'Direito Empresarial' | 'Direito Civil' | 'Planejamento Patrimonial' | 'Legal Tech & Inovação';
  author: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  summary: string;
  content: string[];
  seoKeywords: string[];
  targetAudience: string;
  keyTakeaways: string[];
  viewsCount: number;
}

export interface EditorialCalendarItem {
  id: string;
  week: string;
  scheduledDate: string;
  topic: string;
  legalArea: string;
  targetPersona: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  distributionChannels: string[];
  status: 'Publicado' | 'Em Redação' | 'Pauta Aprovada' | 'Agendado';
  responsibleAuthor: string;
}

export interface UserProfile {
  name: string;
  email: string;
  picture?: string;
  role: 'admin' | 'subscriber' | 'guest';
  hasActiveSubscription: boolean;
  planName?: string;
}
