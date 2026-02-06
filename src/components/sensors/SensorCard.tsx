import { motion } from 'framer-motion';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  TestTube2,
  Waves,
  Eye,
  Atom
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

export const SensorCard = ({ sensor, value, className, showTrend = true, delay = 0 }: SensorCardProps) => {
  const Icon = sensorIcons[sensor];
  const status = getSensorStatus(sensor, value);
  const label = sensorLabels[sensor];
  const unit = sensorUnits[sensor];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={cn(
        "relative p-4 rounded-xl border bg-card-gradient overflow-hidden group",
        "hover:scale-[1.02] transition-transform duration-300",
        sensorColors[status],
        sensorGlows[status],
        className
      )}
    >
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-sensor-gradient opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Animated ring for status */}
      <div className={cn(
        "absolute top-3 right-3 w-3 h-3 rounded-full",
        status === 'optimal' && "bg-seaweed",
        status === 'warning' && "bg-warning animate-pulse",
        status === 'critical' && "bg-destructive animate-pulse"
      )}>
        {status !== 'optimal' && (
          <span className="absolute inset-0 rounded-full animate-pulse-ring bg-current opacity-50" />
        )}
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            "bg-current/10"
          )}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider opacity-80">
            {label}
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold font-mono">
            {value.toFixed(sensor === 'ph' ? 1 : 2)}
          </span>
          <span className="text-sm opacity-70">{unit}</span>
        </div>

        {showTrend && (
          <div className="mt-2 flex items-center gap-1 text-xs opacity-60">
            <span className={cn(
              "inline-block w-0 h-0",
              "border-l-[4px] border-l-transparent",
              "border-r-[4px] border-r-transparent",
              Math.random() > 0.5 
                ? "border-b-[6px] border-b-current" 
                : "border-t-[6px] border-t-current"
            )} />
            <span>{(Math.random() * 5).toFixed(1)}% from last hour</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
