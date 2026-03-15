export type BlockType =
  | 'hero'
  | 'hero-lead'
  | 'hero-vsl'
  | 'hero-urgency'
  | 'hero-video'
  | 'testimonials'
  | 'social-proof'
  | 'benefits-3'
  | 'benefits-4'
  | 'features'
  | 'steps'
  | 'cta'
  | 'contact'
  | 'pricing'
  | 'faq'
  | 'newsletter'
  | 'areas'
  | 'lawyer-profile'
  | 'process-steps'
  | 'oab-badge'
  | 'scheduling'
  | 'juridical-faq'
  | 'about'
  | 'mission'
  | 'timeline'
  | 'partners'
  | 'testimonial-video'
  | 'gallery'
  | 'pricing-table'
  | 'footer';

export type BlockCategory =
  | 'hero'
  | 'social_proof'
  | 'benefits'
  | 'conversion'
  | 'legal'
  | 'structure';

export interface BlockSchema {
  styles: Record<string, string>;
  content: any;
  columns?: number[];
  elements?: BlockElement[];
}

export interface BlockElement {
  id: string;
  type: string;
  tag?: string;
  content?: string;
  styles?: Record<string, string>;
  children?: BlockElement[];
}

export interface Block {
  id: string;
  type: BlockType;
  title: string;
  category: BlockCategory;
  description: string;
  thumbnail?: string;
  schema: BlockSchema;
  defaultContent: any;
  is_premium: boolean;
}
