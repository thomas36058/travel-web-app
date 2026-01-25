import { motion, type Variants } from "framer-motion";
import { cn } from "../../lib/utils";
import type { ReactNode } from "react";

export type StatVariant = "terracotta" | "sage" | "amber" | "navy";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  variant: StatVariant;
  index?: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  }),
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  variant,
  index = 0,
}: StatCardProps) {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
      className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 will-change-transform"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            {title}
          </p>
          <h3 className="font-display text-4xl font-bold text-foreground leading-none">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs font-medium text-muted-foreground/70">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={cn(
            "rounded-xl p-3 flex items-center justify-center",
            `stat-icon-${variant}`,
          )}
          aria-hidden="true"
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
