import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Calendar, Download, TrendingUp, TrendingDown } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SensorHistoryChart } from '@/components/charts/SensorHistoryChart';
import { GrowthChart } from '@/components/charts/GrowthChart';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateHistoricalData, mockGrowthPredictions, sensorLabels } from '@/data/mockData';
import { SensorData } from '@/types/aquaculture';
import { cn } from '@/lib/utils';

const timeRanges = ['24h', '7d', '30d', '90d'] as const;

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<typeof timeRanges[number]>('24h');
  const [selectedSensors, setSelectedSensors] = useState<(keyof SensorData)[]>(['temperature', 'dissolvedOxygen', 'ph']);

  const historicalData = generateHistoricalData(timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90);

  const toggleSensor = (sensor: keyof SensorData) => {
    setSelectedSensors(prev =>
      prev.includes(sensor)
        ? prev.filter(s => s !== sensor)
        : [...prev, sensor]
    );
  };

  const sensorKeys = Object.keys(sensorLabels) as (keyof SensorData)[];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Historical data and growth analysis"
        icon={<Activity className="w-6 h-6 text-accent" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-all",
                    timeRange === range
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {range}
                </button>
              ))}
            </div>
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg Temperature</span>
            <TrendingUp className="w-4 h-4 text-seaweed" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">28.4°C</p>
          <p className="text-xs text-seaweed">+0.3°C from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Avg DO Level</span>
            <TrendingDown className="w-4 h-4 text-warning" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">5.8 mg/L</p>
          <p className="text-xs text-warning">-0.2 mg/L from last period</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Growth Rate</span>
            <TrendingUp className="w-4 h-4 text-seaweed" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">2.3g/wk</p>
          <p className="text-xs text-seaweed">+12% from target</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Feed Efficiency</span>
            <TrendingUp className="w-4 h-4 text-seaweed" />
          </div>
          <p className="text-2xl font-bold font-mono text-foreground">1.42 FCR</p>
          <p className="text-xs text-seaweed">Better than average (1.6)</p>
        </motion.div>
      </div>

      <Tabs defaultValue="sensors" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="sensors">Sensor History</TabsTrigger>
          <TabsTrigger value="growth">Growth Analysis</TabsTrigger>
          <TabsTrigger value="correlation">Correlations</TabsTrigger>
        </TabsList>

        <TabsContent value="sensors" className="space-y-4">
          {/* Sensor selector */}
          <div className="flex flex-wrap gap-2">
            {sensorKeys.map((sensor) => (
              <button
                key={sensor}
                onClick={() => toggleSensor(sensor)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
                  selectedSensors.includes(sensor)
                    ? "bg-accent/20 border-accent text-accent"
                    : "bg-secondary border-border text-muted-foreground hover:border-accent/50"
                )}
              >
                {sensorLabels[sensor]}
              </button>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Sensor Trends - Last {timeRange}
            </h3>
            <SensorHistoryChart
              data={historicalData}
              sensors={selectedSensors}
            />
          </motion.div>
        </TabsContent>

        <TabsContent value="growth">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">
                Shrimp Growth Trajectory
              </h3>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-accent" />
                  <span className="text-muted-foreground">Predicted</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-seaweed" />
                  <span className="text-muted-foreground">Actual</span>
                </div>
              </div>
            </div>
            <GrowthChart data={mockGrowthPredictions} />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Harvest Projection</h4>
              <p className="text-3xl font-bold font-mono text-accent">Day 85</p>
              <p className="text-xs text-muted-foreground mt-1">Based on current growth rate</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Expected Final Weight</h4>
              <p className="text-3xl font-bold font-mono text-seaweed">28.5g</p>
              <p className="text-xs text-muted-foreground mt-1">±2.3g confidence interval</p>
            </div>
            <div className="bg-card rounded-xl border border-border p-5">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Predicted Yield</h4>
              <p className="text-3xl font-bold font-mono text-coral">412kg</p>
              <p className="text-xs text-muted-foreground mt-1">Based on 96.8% survival rate</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="correlation">
          <div className="bg-card rounded-xl border border-border p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Parameter Correlations
            </h3>
            <p className="text-muted-foreground mb-4">
              Showing relationships between environmental parameters and growth metrics.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-seaweed/10 border border-seaweed/20">
                <h4 className="font-medium text-seaweed mb-2">Strong Positive Correlation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• DO Level → Growth Rate (r = 0.82)</li>
                  <li>• Seaweed Biomass → Water Quality (r = 0.78)</li>
                  <li>• Temperature Stability → Survival Rate (r = 0.71)</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <h4 className="font-medium text-destructive mb-2">Strong Negative Correlation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ammonia Level → Growth Rate (r = -0.85)</li>
                  <li>• Turbidity → DO Level (r = -0.67)</li>
                  <li>• TAN → Feed Efficiency (r = -0.72)</li>
                </ul>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
