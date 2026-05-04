import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export const PageHeader = ({ title, description, actions, className }: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-col lg:flex-row lg:items-center justify-between pb-5 border-b border-border mb-6 gap-3', className)}>
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight" style={{ fontFamily: 'Syne, sans-serif' }}>
          {title}
        </h1>
        {description && (
          <p className="text-sm text-[hsl(220,18%,38%)] mt-1 font-mono">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};