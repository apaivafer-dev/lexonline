import React from 'react';
import type { BlockType } from '@/types/block.types';

// Hero
import { HeroBlock } from '../blocks/HeroBlock';
import { HeroLeadBlock } from '../blocks/HeroLeadBlock';
import { HeroVslBlock } from '../blocks/HeroVslBlock';
import { HeroUrgencyBlock } from '../blocks/HeroUrgencyBlock';
import { HeroVideoBlock } from '../blocks/HeroVideoBlock';

// Social Proof
import { TestimonialsBlock } from '../blocks/TestimonialsBlock';
import { SocialProofBlock } from '../blocks/SocialProofBlock';

// Benefits
import { Benefits3Block } from '../blocks/Benefits3Block';
import { Benefits4Block } from '../blocks/Benefits4Block';
import { FeaturesBlock } from '../blocks/FeaturesBlock';
import { StepsBlock } from '../blocks/StepsBlock';

// Conversion
import { CtaBlock } from '../blocks/CtaBlock';
import { ContactBlock } from '../blocks/ContactBlock';
import { PricingBlock } from '../blocks/PricingBlock';
import { FaqBlock } from '../blocks/FaqBlock';
import { NewsletterBlock } from '../blocks/NewsletterBlock';

// Legal
import { AreasBlock } from '../blocks/legal/AreasBlock';
import { LawyerProfileBlock } from '../blocks/legal/LawyerProfileBlock';
import { ProcessStepsBlock } from '../blocks/legal/ProcessStepsBlock';
import { OabBadgeBlock } from '../blocks/legal/OabBadgeBlock';
import { SchedulingBlock } from '../blocks/legal/SchedulingBlock';
import { JuridicalFaqBlock } from '../blocks/legal/JuridicalFaqBlock';

// Structure
import { AboutBlock } from '../blocks/structure/AboutBlock';
import { MissionBlock } from '../blocks/structure/MissionBlock';
import { TimelineBlock } from '../blocks/structure/TimelineBlock';
import { PartnersBlock } from '../blocks/structure/PartnersBlock';
import { TestimonialVideoBlock } from '../blocks/structure/TestimonialVideoBlock';
import { GalleryBlock } from '../blocks/structure/GalleryBlock';
import { PricingTableBlock } from '../blocks/structure/PricingTableBlock';
import { FooterBlock } from '../blocks/structure/FooterBlock';

const BLOCK_COMPONENTS: Record<BlockType, React.ComponentType> = {
  'hero': HeroBlock,
  'hero-lead': HeroLeadBlock,
  'hero-vsl': HeroVslBlock,
  'hero-urgency': HeroUrgencyBlock,
  'hero-video': HeroVideoBlock,
  'testimonials': TestimonialsBlock,
  'social-proof': SocialProofBlock,
  'benefits-3': Benefits3Block,
  'benefits-4': Benefits4Block,
  'features': FeaturesBlock,
  'steps': StepsBlock,
  'cta': CtaBlock,
  'contact': ContactBlock,
  'pricing': PricingBlock,
  'faq': FaqBlock,
  'newsletter': NewsletterBlock,
  'areas': AreasBlock,
  'lawyer-profile': LawyerProfileBlock,
  'process-steps': ProcessStepsBlock,
  'oab-badge': OabBadgeBlock,
  'scheduling': SchedulingBlock,
  'juridical-faq': JuridicalFaqBlock,
  'about': AboutBlock,
  'mission': MissionBlock,
  'timeline': TimelineBlock,
  'partners': PartnersBlock,
  'testimonial-video': TestimonialVideoBlock,
  'gallery': GalleryBlock,
  'pricing-table': PricingTableBlock,
  'footer': FooterBlock,
};

interface BlockRendererProps {
  blockType: string;
}

export function BlockRenderer({ blockType }: BlockRendererProps) {
  const Component = BLOCK_COMPONENTS[blockType as BlockType];
  if (!Component) {
    return (
      <div className="p-8 text-center text-slate-400 text-sm border-2 border-dashed border-slate-200 rounded-lg">
        Bloco "{blockType}" não encontrado
      </div>
    );
  }
  return <Component />;
}
