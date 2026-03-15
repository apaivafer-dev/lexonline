export type ElementType =
  | 'heading' | 'text' | 'rich_text' | 'list' | 'quote' | 'highlight'
  | 'image' | 'video' | 'icon' | 'gallery' | 'lottie'
  | 'button' | 'icon_button' | 'html_custom'
  | 'form' | 'input' | 'textarea' | 'select' | 'checkbox' | 'radio'
  | 'section' | 'container' | 'column' | 'spacer' | 'divider'
  | 'countdown' | 'testimonial' | 'pricing' | 'faq' | 'features' | 'stats_counter'
  | 'social_icons' | 'whatsapp' | 'map'
  | 'tabs' | 'carousel' | 'popup';

export type ElementCategory =
  | 'text' | 'media' | 'interaction' | 'form'
  | 'layout' | 'marketing' | 'social' | 'advanced';

export interface ElementMeta {
  id: ElementType;
  name: string;
  icon: string;
  category: ElementCategory;
  defaultProps?: Record<string, any>;
}

export interface ElementInstance {
  id: string;
  type: ElementType;
  props: Record<string, any>;
  styles: Record<string, string>;
  visibleOn?: { desktop: boolean; tablet: boolean; mobile: boolean };
  animationIn?: string;
  animationSpeed?: string;
  animationDelay?: number;
  customId?: string;
  customClasses?: string;
}

export interface StylePropDef {
  key: string;
  label: string;
  type: 'select' | 'slider' | 'number' | 'input' | 'color-picker' | 'font-selector' | 'anim-selector';
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  placeholder?: string;
}

export interface StyleGroup {
  name: string;
  props: StylePropDef[];
}
