import { motion } from 'framer-motion';
import { AlertTriangle, Info, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Alert } from '@/types/aquaculture';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface AlertsPanelProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
  className?: string;
  maxAlerts?: number;
}

const alertIcons = {
  info: Info,
  warning: AlertTriangle,
  critical: AlertCircle,
};

const alertStyles = {
  info: 'border-accent/30 bg-accent/5 text-accent',
  warning: 'border-warning/30 bg-warning/5 text-warning',
  critical: 'border-destructive/30 bg-destructive/5 text-destructive',
};

export const AlertsPanel = ({ alerts, onAcknowledge, className, maxAlerts = 5 }: AlertsPanelProps) => {
  const displayAlerts = alerts.slice(0, maxAlerts);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn("space-y-3", className)}
    >
      {displayAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <CheckCircle className="w-12 h-12 text-seaweed mb-3" />
          <p className="text-muted-foreground">All systems operating normally</p>
        </div>
      ) : (
        displayAlerts.map((alert, index) => {
          const Icon = alertIcons[alert.type];
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative p-4 rounded-lg border",
                alertStyles[alert.type],
                alert.acknowledged && "opacity-60"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                  "bg-current/10"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{alert.message}</p>
                  {alert.sensor && alert.value && (
                    <p className="text-xs opacity-70 mt-1">
                      {alert.sensor}: {alert.value} (threshold: {alert.threshold})
                    </p>
                  )}
                  <p className="text-xs opacity-50 mt-2">
                    {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                  </p>
                </div>
                {!alert.acknowledged && onAcknowledge && (
                  <button
                    onClick={() => onAcknowledge(alert.id)}
                    className="p-1 rounded hover:bg-current/10 transition-colors"
                    title="Acknowledge"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );
};
