import * as React from 'react';
import {cva, type VariantProps} from 'class-variance-authority';

import {cn} from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full border border-slate-200 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:focus:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-slate-900 text-slate-50 hover:bg-slate-900/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        Pending:
          'border-transparent bg-yellow-500 text-slate-50 hover:bg-yellow-500/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        Approved:
          'border-transparent bg-green-500 text-slate-50 hover:bg-green-500/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
        Rejected:
          'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({className, variant, ...props}: BadgeProps) {
  return <div className={cn(badgeVariants({variant}), className)} {...props} />;
}

export {Badge, badgeVariants};
