import type { SeoSettings } from '@/types/page.types';

type ValidationStatus = 'good' | 'warning' | 'error';

export interface SeoValidation {
  titleLength: ValidationStatus;
  descriptionLength: ValidationStatus;
}

export function useSeoValidation() {
  const validateSeo = (settings: SeoSettings): SeoValidation => {
    const tLen = settings.title?.length ?? 0;
    const titleLength: ValidationStatus =
      tLen === 0 ? 'error'
      : tLen < 30 || tLen > 60 ? 'warning'
      : 'good';

    const dLen = settings.metaDescription?.length ?? 0;
    const descriptionLength: ValidationStatus =
      dLen === 0 ? 'error'
      : dLen < 120 || dLen > 160 ? 'warning'
      : 'good';

    return { titleLength, descriptionLength };
  };

  return { validateSeo };
}
