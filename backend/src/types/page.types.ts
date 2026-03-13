export type PageStatus = 'draft' | 'published' | 'archived';
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

export interface Page {
  id: string;
  user_id: string;
  team_id?: string | null;
  title: string;
  slug: string;
  description?: string | null;
  status: PageStatus;
  schema: unknown;
  metadata: unknown;
  published_url?: string | null;
  published_at?: Date | null;
  domain_id?: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PageTemplate {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  category: TemplateCategory;
  thumbnail_url?: string | null;
  schema: unknown;
  is_premium: boolean;
  preview_url?: string | null;
  created_at: Date;
  updated_at: Date;
}

export type UserPlan = 'essential' | 'professional' | 'agency';

// ─── Page Settings (stored in page.metadata) ─────────────────────────────────

export interface PageSettings {
  seo?: {
    title?: string;
    metaDescription?: string;
    ogImage?: string;
    slug?: string;
    keywords?: string[];
    indexable?: boolean;
  };
  analytics?: {
    ga4Id?: string;
    gtmId?: string;
    metaPixelId?: string;
    metaPixelPageView?: boolean;
    googleAdsId?: string;
    hotjarId?: string;
  };
  whatsapp?: {
    enabled?: boolean;
    phoneNumber?: string;
    defaultMessage?: string;
    position?: 'bottom-right' | 'bottom-left';
  };
  lgpd?: {
    enabled?: boolean;
    text?: string;
    backgroundColor?: string;
    position?: 'bottom' | 'top' | 'modal';
    privacyLink?: string;
    consentType?: 'opt-in' | 'opt-out';
  };
  integrations?: Record<string, unknown>;
}

export const PAGE_LIMITS: Record<UserPlan, number> = {
  essential: 5,
  professional: 20,
  agency: Infinity,
};
