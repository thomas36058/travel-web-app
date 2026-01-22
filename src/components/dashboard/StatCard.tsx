import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  iconVariant: 'terracotta' | 'sage' | 'amber' | 'navy';
  delay?: number;
}

const iconVariants = {
  terracotta: 'stat-icon-terracotta',
  sage: 'stat-icon-sage',
  amber: 'stat-icon-amber',
  navy: 'stat-icon-navy',
};

export default function StatCard({ title, value, subtitle, icon, iconVariant, delay = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="bg-card rounded-2xl p-6 transition-all duration-300 shadow-card hover:shadow-card-hover hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 font-display text-4xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className={cn('rounded-xl p-3', iconVariants[iconVariant])}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
