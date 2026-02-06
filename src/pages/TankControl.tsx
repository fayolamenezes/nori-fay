import { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Power, Wind, Timer, Plus, Trash2, Settings2 } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { TankVisualization } from '@/components/tank/TankVisualization';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { useSensorData } from '@/hooks/useSensorData';
import { mockControlSettings } from '@/data/mockData';
import { ControlSettings, FeedingSchedule } from '@/types/aquaculture';
import { cn } from '@/lib/utils';

const TankControl = () => {
  const { tankStatus } = useSensorData();
  const [settings, setSettings] = useState<ControlSettings>(mockControlSettings);

  const updateSetting = <K extends keyof ControlSettings>(key: K, value: ControlSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleFeedingSchedule = (id: string) => {
    setSettings(prev => ({
      ...prev,
      feedingSchedule: prev.feedingSchedule.map(s =>
        s.id === id ? { ...s, enabled: !s.enabled } : s
      ),
    }));
  };

  const tidalPhases = ['low', 'rising', 'high', 'falling'] as const;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tank Control"
        description="Manage aerators, wave simulation, and feeding schedules"
        icon={<Waves className="w-6 h-6 text-accent" />}
        actions={
          <Button className="gap-2">
            <Settings2 className="w-4 h-4" />
            Advanced Settings
          </Button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Tank Visualization */}
        <TankVisualization tank={tankStatus} />

        {/* Control Panels */}
        <div className="space-y-6">
          {/* Aerator Control */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Wind className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Aerator System</h3>
                  <p className="text-sm text-muted-foreground">Control dissolved oxygen</p>
                </div>
              </div>
              <Switch
                checked={settings.aeratorEnabled}
                onCheckedChange={(checked) => updateSetting('aeratorEnabled', checked)}
              />
            </div>

            <div className={cn(
              "space-y-4 transition-opacity",
              !settings.aeratorEnabled && "opacity-50 pointer-events-none"
            )}>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Speed</span>
                  <span className="text-sm font-mono text-foreground">{settings.aeratorSpeed}%</span>
                </div>
                <Slider
                  value={[settings.aeratorSpeed]}
                  onValueChange={([value]) => updateSetting('aeratorSpeed', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Low</span>
                <span>Medium</span>
                <span>High</span>
              </div>
            </div>
          </motion.div>

          {/* Wave Simulation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Waves className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Wave Simulation</h3>
                  <p className="text-sm text-muted-foreground">Mimic natural tidal movements</p>
                </div>
              </div>
              <Switch
                checked={settings.waveSimulation}
                onCheckedChange={(checked) => updateSetting('waveSimulation', checked)}
              />
            </div>

            <div className={cn(
              "space-y-4 transition-opacity",
              !settings.waveSimulation && "opacity-50 pointer-events-none"
            )}>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Intensity</span>
                  <span className="text-sm font-mono text-foreground">{settings.waveIntensity}%</span>
                </div>
                <Slider
                  value={[settings.waveIntensity]}
                  onValueChange={([value]) => updateSetting('waveIntensity', value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </motion.div>

          {/* Tidal Simulation */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-seaweed/10 flex items-center justify-center">
                  <Timer className="w-5 h-5 text-seaweed" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Tidal Simulation</h3>
                  <p className="text-sm text-muted-foreground">Simulate natural tidal cycles</p>
                </div>
              </div>
              <Switch
                checked={settings.tidalSimulation}
                onCheckedChange={(checked) => updateSetting('tidalSimulation', checked)}
              />
            </div>

            <div className={cn(
              "transition-opacity",
              !settings.tidalSimulation && "opacity-50 pointer-events-none"
            )}>
              <div className="grid grid-cols-4 gap-2">
                {tidalPhases.map((phase) => (
                  <button
                    key={phase}
                    onClick={() => updateSetting('tidalPhase', phase)}
                    className={cn(
                      "p-3 rounded-lg border text-sm font-medium capitalize transition-all",
                      settings.tidalPhase === phase
                        ? "bg-seaweed/20 border-seaweed text-seaweed"
                        : "bg-secondary/50 border-border text-muted-foreground hover:border-seaweed/50"
                    )}
                  >
                    {phase}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Feeding Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-shrimp/10 flex items-center justify-center">
              <span className="text-xl">🦐</span>
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Feeding Schedule</h3>
              <p className="text-sm text-muted-foreground">Automated feeding times and amounts</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Add Schedule
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {settings.feedingSchedule.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className={cn(
                "p-4 rounded-lg border transition-all",
                schedule.enabled
                  ? "bg-shrimp/10 border-shrimp/30"
                  : "bg-secondary/50 border-border opacity-60"
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold font-mono text-foreground">
                  {schedule.time}
                </span>
                <Switch
                  checked={schedule.enabled}
                  onCheckedChange={() => toggleFeedingSchedule(schedule.id)}
                />
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">
                  Amount: <span className="text-foreground font-medium">{schedule.amount}g</span>
                </p>
                <p className="text-muted-foreground">
                  Type: <span className="text-foreground font-medium">{schedule.type}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default TankControl;
