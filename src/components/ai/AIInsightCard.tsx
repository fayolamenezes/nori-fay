import { motion } from 'framer-motion';
import { Brain, Lightbulb, AlertTriangle, BarChart3, ChevronRight } from 'lucide-react';
import { AIInsight } from '@/types/aquaculture';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';

interface AIInsightCardProps {
  insight: AIInsight;
  onAction?: () => void;
  delay?: number;
}

const insightIcons = {
  prediction: BarChart3,
  recommendation: Lightbulb,
  warning: AlertTriangle,
  analysis: Brain,
};

const insightStyles = {
  prediction: 'border-accent/30 bg-accent/5',
  recommendation: 'border-seaweed/30 bg-seaweed/5',
  warning: 'border-warning/30 bg-warning/5',
  analysis: 'border-primary/30 bg-primary/5',
};

const insightTextColors = {
  prediction: 'text-accent',
  recommendation: 'text-seaweed',
  warning: 'text-warning',
  analysis: 'text-primary',
};

export const AIInsightCard = ({ insight, onAction, delay = 0 }: AIInsightCardProps) => {
  const Icon = insightIcons[insight.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
      className={cn(
        "relative p-5 rounded-xl border overflow-hidden group",
        "hover:shadow-lg transition-all duration-300",
        insightStyles[insight.type]
      )}
    >
      {/* Shimmer effect */}
      <div className="absolute inset-0 animate-shimmer pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              "bg-current/10",
              insightTextColors[insight.type]
            )}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{insight.title}</h4>
              <span className="text-xs text-muted-foreground capitalize">{insight.type}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <span className={cn(
                "text-sm font-mono font-semibold",
                insight.confidence >= 0.85 ? "text-seaweed" : "text-warning"
              )}>
                {(insight.confidence * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
          {insight.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(insight.timestamp, { addSuffix: true })}
          </span>
          
          {insight.actionable && insight.action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAction}
              className={cn(
                "gap-1 text-xs",
                insightTextColors[insight.type]
              )}
            >
              {insight.action}
              <ChevronRight className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface AIInsightsListProps {
  insights: AIInsight[];
  className?: string;
}

export const AIInsightsList = ({ insights, className }: AIInsightsListProps) => {
  return (
    <div className={cn("space-y-4", className)}>
      {insights.map((insight, index) => (
        <AIInsightCard key={insight.id} insight={insight} delay={index} />
      ))}
    </div>
  );
};
