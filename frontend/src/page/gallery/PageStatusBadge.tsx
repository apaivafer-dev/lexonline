import type { PageStatus } from '@/types/page.types';
import { cn } from '@/utils/cn';

interface PageStatusBadgeProps {
  status: PageStatus;
}

const statusColors: Record<PageStatus, string> = {
  draft: 'bg-slate-200 text-slate-800',
  published: 'bg-green-200 text-green-800',
  archived: 'bg-gray-200 text-gray-800',
};

const statusLabels: Record<PageStatus, string> = {
  draft: 'Rascunho',
  published: 'Publicada',
  archived: 'Arquivada',
};

export function PageStatusBadge({ status }: PageStatusBadgeProps) {
  return (
    <span className={cn('px-3 py-1 rounded-full text-xs font-medium', statusColors[status])}>
      {statusLabels[status]}
    </span>
  );
}
