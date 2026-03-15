export type PageStatus = 'draft' | 'published' | 'archived';

// ─── Page Settings (stored in page.metadata) ────────────────────────────────

export interface SeoSettings {
  title?: string;
  metaDescription?: string;
  ogImage?: string;
  slug?: string;
  keywords?: string[];
  indexable?: boolean;
}

export interface AnalyticsSettings {
  ga4Id?: string;
  gtmId?: string;
  metaPixelId?: string;
  metaPixelPageView?: boolean;
  googleAdsId?: string;
  hotjarId?: string;
}

export interface WhatsAppSettings {
  enabled?: boolean;
  phoneNumber?: string;
  defaultMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
}

export interface LgpdSettings {
  enabled?: boolean;
  text?: string;
  backgroundColor?: string;
  position?: 'bottom' | 'top' | 'modal';
  privacyLink?: string;
  consentType?: 'opt-in' | 'opt-out';
}

export interface CrmSettings {
  apiKey?: string;
  listId?: string;
}

export interface IntegrationsSettings {
  rdstation?: CrmSettings;
  activecampaign?: CrmSettings;
  hubspot?: CrmSettings;
  leadlovers?: CrmSettings;
  webhookUrl?: string;
}

export interface PageSettings {
  seo?: SeoSettings;
  analytics?: AnalyticsSettings;
  whatsapp?: WhatsAppSettings;
  lgpd?: LgpdSettings;
  integrations?: IntegrationsSettings;
}

export type TemplateCategory =
  | 'landing_page'
  | 'institutional'
  | 'capture'
  | 'sales'
  | 'legal'
  | 'services'
  | 'portfolio'
  | 'event'
  | 'blog'
  | 'contact';

export interface PageElement {
  id: string;
  type: string;
  content?: string;
  styles: Record<string, string>;
  metadata?: Record<string, unknown>;
}

export interface PageColumn {
  id: string;
  width: number;
  elements: PageElement[];
}

export interface PageSchema {
  id: string;
  type: 'section';
  styles: Record<string, string>;
  columns: PageColumn[];
}

export interface Page {
  id: string;
  user_id: string;
  title: string;
  slug: string;
  status: PageStatus;
  schema: PageSchema[];
  metadata?: PageSettings | null;
  published_url?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  domain_id?: string;
}

export interface PageTemplate {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: TemplateCategory;
  thumbnail_url?: string;
  schema: PageSchema[];
  is_premium: boolean;
  preview_url?: string;
  created_at: string;
}

export interface CreatePageInput {
  title: string;
  slug: string;
  template_id?: string;
}

// ─── Domain Types (Fase 7) ────────────────────────────────────────────────────

export type DomainStatus = 'pending' | 'active' | 'error';

export interface Domain {
  id: string;
  domain: string;
  status: DomainStatus;
  error_message?: string | null;
  verified_at?: string | null;
  created_at: string;
}

export interface DomainInstructions {
  cname: { name: string; value: string; ttl: number };
  steps: string[];
}

export interface AddDomainResponse {
  domainId: string;
  domain: string;
  status: DomainStatus;
  created_at: string;
  instructions: DomainInstructions;
}

export interface PageDomainsResponse {
  domains: Domain[];
  plan_limit: number;
  used: number;
  free_subdomain: string;
}

export const DOMAIN_LIMITS: Record<'essential' | 'professional' | 'agency', number> = {
  essential: 0,
  professional: 3,
  agency: 25,
};
