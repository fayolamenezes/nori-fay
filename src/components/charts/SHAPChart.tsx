import { motion } from 'framer-motion';
import { SHAPValue } from '@/types/aquaculture';
import { cn } from '@/lib/utils';

interface SHAPChartProps {
  values: SHAPValue[];
  className?: string;
}

export const SHAPChart = ({ values, className }: SHAPChartProps) => {
  const maxContribution = Math.max(...values.map(v => Math.abs(v.contribution)));
  const sortedValues = [...values].sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn("space-y-3", className)}
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-foreground">SHAP Feature Contributions</h4>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-accent" />
            <span className="text-muted-foreground">Positive</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-destructive" />
            <span className="text-muted-foreground">Negative</span>
          </div>
        </div>
      </div>

      {sortedValues.map((item, index) => {
        const width = (Math.abs(item.contribution) / maxContribution) * 100;
        const isPositive = item.contribution >= 0;

        return (
          <motion.div
            key={item.feature}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <div className="flex items-center gap-4">
              <div className="w-32 text-sm text-muted-foreground truncate">
                {item.feature.replace(/_/g, ' ')}
              </div>
              <div className="flex-1 relative h-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1 bg-muted rounded-full" />
                  <div className="absolute left-1/2 w-px h-4 bg-muted-foreground/30" />
                </div>
                <motion.div
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 h-6 rounded flex items-center px-2",
                    isPositive ? "bg-accent/80 left-1/2" : "bg-destructive/80 right-1/2",
                    "group-hover:shadow-lg transition-shadow"
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${width / 2}%` }}
                  transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                  style={{
                    transformOrigin: isPositive ? 'left' : 'right',
                  }}
                >
                  <span className="text-xs font-mono text-foreground whitespace-nowrap">
                    {isPositive ? '+' : ''}{item.contribution.toFixed(2)}
                  </span>
                </motion.div>
              </div>
              <div className="w-16 text-right">
                <span className="text-sm font-mono text-foreground">
                  {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
