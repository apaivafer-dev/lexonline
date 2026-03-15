import { useMemo } from 'react';
import type { Page } from '@/types/page.types';

export type UserPlan = 'essential' | 'professional' | 'agency';

const PLAN_LIMITS: Record<UserPlan, number> = {
  essential: 5,
  professional: 20,
  agency: Infinity,
};

export function usePageLimits(pages: Page[], userPlan: UserPlan = 'essential') {
  return useMemo(() => {
    const limit = PLAN_LIMITS[userPlan];
    const count = pages.filter((p) => p.status !== 'archived').length;
    const remaining = limit === Infinity ? Infinity : Math.max(0, limit - count);
    const isAtLimit = count >= limit;

    return {
      limit,
      count,
      remaining,
      isAtLimit,
      canCreatePage: !isAtLimit,
    };
  }, [pages, userPlan]);
}
