import { motion } from 'framer-motion';
import { Cpu, Target, TrendingUp, Calendar, Zap } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { mockGrowthPredictions } from '@/data/mockData';
import { Progress } from '@/components/ui/progress';

const Predictions = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Growth Predictions"
        description="AI-powered forecasting for shrimp and seaweed co-culture"
        icon={<Cpu className="w-6 h-6 text-accent" />}
      />

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Harvest Date</p>
              <p className="font-semibold text-foreground">March 22, 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={53} className="h-2 flex-1" />
            <span className="text-xs text-muted-foreground">53%</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">40 days remaining</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-seaweed/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-seaweed" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Final Weight</p>
              <p className="font-semibold text-foreground font-mono">28.5g ± 2.3g</p>
            </div>
          </div>
          <p className="text-xs text-seaweed">+15% above target</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-coral/10 flex items-center justify-center">
              <span className="text-xl">🦐</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Predicted Yield</p>
              <p className="font-semibold text-foreground font-mono">412 kg</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Based on 96.8% survival</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confidence</p>
              <p className="font-semibold text-foreground font-mono">89%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">High prediction accuracy</p>
        </motion.div>
      </div>

      {/* Growth Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-6">
          90-Day Growth Projection
        </h3>
        <GrowthChart data={mockGrowthPredictions} />
      </motion.div>

      {/* Weekly Predictions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Weekly Growth Milestones
          </h3>
          <div className="space-y-3">
            {[
              { week: 7, weight: 14.2, status: 'completed' },
              { week: 8, weight: 16.8, status: 'current' },
              { week: 9, weight: 19.5, status: 'upcoming' },
              { week: 10, weight: 22.3, status: 'upcoming' },
              { week: 11, weight: 25.2, status: 'upcoming' },
              { week: 12, weight: 28.5, status: 'upcoming' },
            ].map((milestone, index) => (
              <div
                key={milestone.week}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  milestone.status === 'completed'
                    ? 'bg-seaweed/10 border border-seaweed/20'
                    : milestone.status === 'current'
                    ? 'bg-accent/10 border border-accent/20'
                    : 'bg-secondary/50 border border-border'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      milestone.status === 'completed'
                        ? 'bg-seaweed text-seaweed-foreground'
                        : milestone.status === 'current'
                        ? 'bg-accent text-accent-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {milestone.week}
                  </div>
                  <span className="font-medium text-foreground">Week {milestone.week}</span>
                </div>
                <span className="font-mono text-foreground">{milestone.weight}g</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Seaweed Biomass Projection
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Current Biomass</span>
              <span className="font-mono font-semibold text-seaweed">125 kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Target at Harvest</span>
              <span className="font-mono font-semibold text-foreground">180 kg</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Growth Rate</span>
              <span className="font-mono font-semibold text-accent">+8.5%/week</span>
            </div>
            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-foreground mb-3">Nutrient Absorption Efficiency</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Ammonia</span>
                  <div className="flex items-center gap-2">
                    <Progress value={92} className="h-2 w-24" />
                    <span className="text-seaweed">92%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Nitrate</span>
                  <div className="flex items-center gap-2">
                    <Progress value={78} className="h-2 w-24" />
                    <span className="text-accent">78%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Phosphate</span>
                  <div className="flex items-center gap-2">
                    <Progress value={85} className="h-2 w-24" />
                    <span className="text-seaweed">85%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Predictions;
