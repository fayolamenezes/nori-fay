import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings2, Bell, Sliders, Database, Wifi, Shield, Save } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { defaultThresholds, sensorLabels, sensorUnits } from '@/data/mockData';
import { SensorData } from '@/types/aquaculture';

const SettingsPage = () => {
  const [thresholds, setThresholds] = useState(defaultThresholds);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    critical: true,
    warnings: true,
    info: false,
  });

  const updateThreshold = (sensor: keyof SensorData, field: 'min' | 'max' | 'warningMin' | 'warningMax', value: number) => {
    setThresholds(prev => prev.map(t => 
      t.sensor === sensor ? { ...t, [field]: value } : t
    ));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure system thresholds and notifications"
        icon={<Settings2 className="w-6 h-6 text-accent" />}
        actions={
          <Button className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        }
      />

      <Tabs defaultValue="thresholds" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="thresholds" className="gap-2">
            <Sliders className="w-4 h-4" />
            Thresholds
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="system" className="gap-2">
            <Database className="w-4 h-4" />
            System
          </TabsTrigger>
        </TabsList>

        <TabsContent value="thresholds" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Sensor Alert Thresholds
            </h3>
            <div className="space-y-6">
              {thresholds.map((threshold, index) => (
                <motion.div
                  key={threshold.sensor}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-secondary/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-foreground">
                        {sensorLabels[threshold.sensor]}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Unit: {sensorUnits[threshold.sensor] || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Critical Range</p>
                        <p className="text-sm font-mono text-foreground">
                          {threshold.min} - {threshold.max}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Warning Range</p>
                        <p className="text-sm font-mono text-warning">
                          {threshold.warningMin} - {threshold.warningMax}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground">Min (Critical)</label>
                      <Input
                        type="number"
                        value={threshold.min}
                        onChange={(e) => updateThreshold(threshold.sensor, 'min', parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Min (Warning)</label>
                      <Input
                        type="number"
                        value={threshold.warningMin}
                        onChange={(e) => updateThreshold(threshold.sensor, 'warningMin', parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Max (Warning)</label>
                      <Input
                        type="number"
                        value={threshold.warningMax}
                        onChange={(e) => updateThreshold(threshold.sensor, 'warningMax', parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Max (Critical)</label>
                      <Input
                        type="number"
                        value={threshold.max}
                        onChange={(e) => updateThreshold(threshold.sensor, 'max', parseFloat(e.target.value))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Notification Channels
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <h4 className="font-medium text-foreground">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Receive alerts via email</p>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <h4 className="font-medium text-foreground">Push Notifications</h4>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <h4 className="font-medium text-foreground">SMS Alerts</h4>
                  <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                />
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6">
              Alert Types
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <div>
                  <h4 className="font-medium text-destructive">Critical Alerts</h4>
                  <p className="text-sm text-muted-foreground">System failures and dangerous conditions</p>
                </div>
                <Switch
                  checked={notifications.critical}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, critical: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-warning/10 border border-warning/20">
                <div>
                  <h4 className="font-medium text-warning">Warning Alerts</h4>
                  <p className="text-sm text-muted-foreground">Parameters approaching thresholds</p>
                </div>
                <Switch
                  checked={notifications.warnings}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, warnings: checked }))}
                />
              </div>
              <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div>
                  <h4 className="font-medium text-accent">Info Notifications</h4>
                  <p className="text-sm text-muted-foreground">System updates and routine events</p>
                </div>
                <Switch
                  checked={notifications.info}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, info: checked }))}
                />
              </div>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Wifi className="w-5 h-5 text-accent" />
              Connection Settings
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-foreground">Data Refresh Interval</h4>
                    <p className="text-sm text-muted-foreground">How often sensor data updates</p>
                  </div>
                  <span className="text-lg font-mono text-accent">5s</span>
                </div>
                <Slider
                  defaultValue={[5]}
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>1s (fastest)</span>
                  <span>30s (battery saver)</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6"
          >
            <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-seaweed" />
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">System Version</p>
                <p className="font-mono text-foreground">v2.1.0-beta</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">ML Model Version</p>
                <p className="font-mono text-foreground">XGBoost v1.7.6</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Last Sync</p>
                <p className="font-mono text-foreground">Just now</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Sensors Connected</p>
                <p className="font-mono text-seaweed">9/9 Online</p>
              </div>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
