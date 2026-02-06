import { motion } from 'framer-motion';
import { Brain, Zap, RefreshCw, Settings } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { AIInsightsList } from '@/components/ai/AIInsightCard';
import { SHAPChart } from '@/components/charts/SHAPChart';
import { Button } from '@/components/ui/button';
import { mockAIInsights, mockSHAPValues } from '@/data/mockData';

const AIInsights = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Insights"
        description="Machine learning predictions and explainable AI analysis"
        icon={<Brain className="w-6 h-6 text-accent" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retrain Model
            </Button>
            <Button className="gap-2">
              <Zap className="w-4 h-4" />
              Generate Insights
            </Button>
          </div>
        }
      />

      {/* Model Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-seaweed/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-seaweed" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model Status</p>
              <p className="font-semibold text-seaweed">Active</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Last trained: 2 hours ago</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Brain className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model Accuracy</p>
              <p className="font-semibold text-accent font-mono">94.2%</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">R² Score: 0.89</p>
        </div>

        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Settings className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Algorithm</p>
              <p className="font-semibold text-primary">XGBoost + SHAP</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Features: 12 | Trees: 500</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* SHAP Analysis */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Feature Importance Analysis
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            SHAP values showing each feature's contribution to growth predictions
          </p>
          <SHAPChart values={mockSHAPValues} />
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-6">
            Latest AI Recommendations
          </h3>
          <AIInsightsList insights={mockAIInsights} />
        </motion.div>
      </div>

      {/* Prediction Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Current Prediction Breakdown
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm text-muted-foreground mb-1">Predicted Growth Score</p>
            <p className="text-3xl font-bold font-mono text-accent">0.78</p>
            <p className="text-xs text-muted-foreground mt-2">Above average growth expected</p>
          </div>
          <div className="p-4 rounded-lg bg-seaweed/10 border border-seaweed/20">
            <p className="text-sm text-muted-foreground mb-1">DO Impact</p>
            <p className="text-3xl font-bold font-mono text-seaweed">+0.18</p>
            <p className="text-xs text-muted-foreground mt-2">DO levels supporting growth</p>
          </div>
          <div className="p-4 rounded-lg bg-coral/10 border border-coral/20">
            <p className="text-sm text-muted-foreground mb-1">Age Factor</p>
            <p className="text-3xl font-bold font-mono text-coral">+0.35</p>
            <p className="text-xs text-muted-foreground mt-2">Optimal growth phase</p>
          </div>
          <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-muted-foreground mb-1">Stress Index</p>
            <p className="text-3xl font-bold font-mono text-warning">-0.04</p>
            <p className="text-xs text-muted-foreground mt-2">Minor ammonia stress</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIInsights;
