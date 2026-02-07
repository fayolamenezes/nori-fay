import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Wind,
  AlertTriangle,
  TestTube2,
  Waves,
  Eye,
  Atom,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { SensorData } from '@/types/aquaculture';
import { getSensorStatus, sensorLabels, sensorUnits } from '@/data/mockData';

interface SensorCardProps {
  sensor: keyof SensorData;
  value: number;
  className?: string;
  showTrend?: boolean;
  delay?: number;
}

const sensorIcons: Record<keyof SensorData, typeof Thermometer> = {
  temperature: Thermometer,
  ph: Droplets,
  dissolvedOxygen: Wind,
  ammonia: AlertTriangle,
  nitrite: TestTube2,
  nitrate: TestTube2,
  salinity: Waves,
  turbidity: Eye,
  tan: Atom,
};

const sensorColors: Record<'optimal' | 'warning' | 'critical', string> = {
  optimal: 'text-seaweed border-seaweed/30 bg-seaweed/10',
  warning: 'text-warning border-warning/30 bg-warning/10',
  critical: 'text-destructive border-destructive/30 bg-destructive/10',
};

const sensorGlows: Record<'optimal' | 'warning' | 'critical', string> = {
  optimal: 'glow-success',
  warning: 'glow-warning',
  critical: 'glow-danger',
};

export const SensorCard = ({
  sensor,
  value,
  className,
  showTrend = true,
  delay = 0,
}: SensorCardProps) => {
  const Icon = sensorIcons[sensor];
  const status = getSensorStatus(sensor, value);
  const label = sensorLabels[sensor];
  const unit = sensorUnits[sensor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.08 }}
      whileHover={{ scale: 1.03 }}
      className={cn(
        'relative p-6 rounded-2xl border bg-card-gradient overflow-hidden group',
        'transition-all duration-300',
        sensorColors[status],
        sensorGlows[status],
        className
      )}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-sensor-gradient opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Status indicator */}
      <div
        className={cn(
          'absolute top-4 right-4 w-3.5 h-3.5 rounded-full',
          status === 'optimal' && 'bg-seaweed',
          status === 'warning' && 'bg-warning animate-pulse',
          status === 'critical' && 'bg-destructive animate-pulse'
        )}
      >
        {status !== 'optimal' && (
          <span className="absolute inset-0 rounded-full animate-pulse-ring bg-current opacity-40" />
        )}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-current/10">
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-sm font-semibold uppercase tracking-wider opacity-85">
            {label}
          </span>
        </div>

        {/* VALUE */}
        <div className="flex items-end gap-2 mb-2">
          <span className="text-4xl font-extrabold font-mono leading-none">
            {value.toFixed(sensor === 'ph' ? 1 : 2)}
          </span>
          <span className="text-base font-semibold opacity-70 mb-0.5">
            {unit}
          </span>
        </div>

        {/* Trend */}
        {showTrend && (
          <div className="mt-2 flex items-center gap-2 text-sm font-medium opacity-65">
            <span
              className={cn(
                'inline-block w-0 h-0',
                'border-l-[5px] border-l-transparent',
                'border-r-[5px] border-r-transparent',
                Math.random() > 0.5
                  ? 'border-b-[7px] border-b-current'
                  : 'border-t-[7px] border-t-current'
              )}
            />
            <span>{(Math.random() * 5).toFixed(1)}% from last hour</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
