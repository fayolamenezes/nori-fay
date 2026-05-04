import { motion } from 'framer-motion';
import { Thermometer, Droplets, FlaskConical, Gauge } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SensorData } from '@/types/aquaculture';
import { getSensorStatus, sensorLabels, sensorUnits } from '@/data/mockData';

interface SensorCardProps {
  sensor: keyof SensorData;
  value: number;
  className?: string;
  delay?: number;
}

const sensorIcons: Record<keyof SensorData, typeof Thermometer> = {
  temperature: Thermometer,
  ph: FlaskConical,
  dissolvedOxygen: Gauge,
  turbidity: Droplets,
};

const statusConfig = {
  optimal: {
    dot: 'bg-[hsl(158,48%,32%)]',
    label: 'Nominal',
    labelColor: 'text-[hsl(158,48%,28%)]',
    barColor: 'bg-[hsl(158,48%,32%)]',
    tagBg: 'bg-[hsl(158,48%,95%)]',
    tagBorder: 'border-[hsl(158,48%,80%)]',
  },
  warning: {
    dot: 'bg-[hsl(36,72%,40%)]',
    label: 'Warning',
    labelColor: 'text-[hsl(36,72%,34%)]',
    barColor: 'bg-[hsl(36,72%,40%)]',
    tagBg: 'bg-[hsl(36,72%,95%)]',
    tagBorder: 'border-[hsl(36,72%,76%)]',
  },
  critical: {
    dot: 'bg-[hsl(0,62%,46%)]',
    label: 'Critical',
    labelColor: 'text-[hsl(0,62%,40%)]',
    barColor: 'bg-[hsl(0,62%,46%)]',
    tagBg: 'bg-[hsl(0,62%,97%)]',
    tagBorder: 'border-[hsl(0,62%,82%)]',
  },
};

export const SensorCard = ({ sensor, value, className, delay = 0 }: SensorCardProps) => {
  const Icon = sensorIcons[sensor];
  const status = getSensorStatus(sensor, value);
  const cfg = statusConfig[status];
  const label = sensorLabels[sensor];
  const unit = sensorUnits[sensor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.07, duration: 0.3 }}
      className={cn(
        'bg-white border border-[hsl(220,16%,80%)] p-5',
        'shadow-[0_1px_3px_hsl(220,20%,80%/0.5)]',
        'transition-all duration-150 hover:border-[hsl(191,70%,60%)] hover:shadow-[0_2px_8px_hsl(220,20%,70%/0.4)]',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-[hsl(220,18%,45%)]" strokeWidth={1.75} />
          <span className="text-[13px] font-semibold text-[hsl(220,25%,25%)] tracking-wide uppercase font-mono">
            {label}
          </span>
        </div>
        <div className={cn('flex items-center gap-1.5 px-2 py-0.5 border text-[11px] font-mono font-semibold', cfg.tagBg, cfg.tagBorder, cfg.labelColor)}>
          <div className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot, status !== 'optimal' && 'ticker-live')} />
          {cfg.label}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-mono font-semibold text-[hsl(220,30%,10%)] leading-none tabular-nums">
          {value.toFixed(sensor === 'ph' ? 1 : sensor === 'temperature' ? 1 : 0)}
        </span>
        <span className="text-base font-mono text-[hsl(220,18%,42%)]">{unit}</span>
      </div>

      {/* Status bar */}
      <div className="h-1 bg-[hsl(220,16%,90%)] w-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: status === 'optimal' ? '100%' : status === 'warning' ? '60%' : '25%' }}
          transition={{ delay: delay * 0.07 + 0.2, duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full', cfg.barColor)}
        />
      </div>
    </motion.div>
  );
};