import { motion } from 'framer-motion';
import { Bell, CheckCircle, AlertTriangle, AlertCircle, Info, Filter, Settings } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';

const mockAlerts = [
  { id: 1, type: 'critical', title: 'Low Dissolved Oxygen', message: 'DO level dropped to 3.8 mg/L - immediate action required', sensor: 'dissolvedOxygen', value: 3.8, threshold: 4.0, timestamp: new Date(Date.now() - 1800000), acknowledged: false },
  { id: 2, type: 'warning', title: 'Ammonia Trending High', message: 'NH3 levels approaching warning threshold', sensor: 'ammonia', value: 0.08, threshold: 0.1, timestamp: new Date(Date.now() - 3600000), acknowledged: false },
  { id: 3, type: 'warning', title: 'Temperature Fluctuation', message: 'Temperature variance exceeded 2°C in past hour', sensor: 'temperature', value: 30.2, threshold: 30.0, timestamp: new Date(Date.now() - 7200000), acknowledged: true },
  { id: 4, type: 'info', title: 'Feeding Completed', message: 'Scheduled feeding at 12:00 completed successfully', timestamp: new Date(Date.now() - 10800000), acknowledged: true },
  { id: 5, type: 'info', title: 'Model Retrained', message: 'AI growth prediction model updated with latest data', timestamp: new Date(Date.now() - 14400000), acknowledged: true },
  { id: 6, type: 'critical', title: 'Aerator Malfunction', message: 'Aerator 2 showing irregular operation - check immediately', timestamp: new Date(Date.now() - 86400000), acknowledged: true },
  { id: 7, type: 'warning', title: 'pH Level Warning', message: 'pH dropped below optimal range', sensor: 'ph', value: 7.2, threshold: 7.5, timestamp: new Date(Date.now() - 172800000), acknowledged: true },
];

const AlertsPage = () => {
  const alertIcons = {
    critical: AlertCircle,
    warning: AlertTriangle,
    info: Info,
  };

  const alertStyles = {
    critical: 'border-destructive/30 bg-destructive/5 text-destructive',
    warning: 'border-warning/30 bg-warning/5 text-warning',
    info: 'border-accent/30 bg-accent/5 text-accent',
  };

  const unacknowledged = mockAlerts.filter(a => !a.acknowledged);
  const acknowledged = mockAlerts.filter(a => a.acknowledged);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Alerts & Notifications"
        description="System alerts, warnings, and notifications"
        icon={<Bell className="w-6 h-6 text-accent" />}
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Alert Settings
            </Button>
            <Button className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Acknowledge All
            </Button>
          </div>
        }
      />

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-destructive" />
            <div>
              <p className="text-sm text-muted-foreground">Critical</p>
              <p className="text-2xl font-bold text-destructive">
                {mockAlerts.filter(a => a.type === 'critical' && !a.acknowledged).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-warning/10 border border-warning/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-8 h-8 text-warning" />
            <div>
              <p className="text-sm text-muted-foreground">Warnings</p>
              <p className="text-2xl font-bold text-warning">
                {mockAlerts.filter(a => a.type === 'warning' && !a.acknowledged).length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent/10 border border-accent/20 rounded-xl p-5"
        >
          <div className="flex items-center gap-3">
            <Info className="w-8 h-8 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Info</p>
              <p className="text-2xl font-bold text-accent">
                {mockAlerts.filter(a => a.type === 'info' && !a.acknowledged).length}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="bg-secondary">
          <TabsTrigger value="active" className="gap-2">
            Active
            {unacknowledged.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-destructive text-destructive-foreground rounded-full">
                {unacknowledged.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-3">
          {unacknowledged.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="w-16 h-16 text-seaweed mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">All Clear!</h3>
              <p className="text-muted-foreground">No active alerts at this time.</p>
            </div>
          ) : (
            unacknowledged.map((alert, index) => {
              const Icon = alertIcons[alert.type as keyof typeof alertIcons];
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "p-5 rounded-xl border",
                    alertStyles[alert.type as keyof typeof alertStyles]
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-current/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{alert.title}</h4>
                        <span className="text-xs opacity-70">
                          {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm opacity-80 mb-2">{alert.message}</p>
                      {alert.sensor && (
                        <p className="text-xs opacity-60">
                          Sensor: {alert.sensor} | Value: {alert.value} | Threshold: {alert.threshold}
                        </p>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      Acknowledge
                    </Button>
                  </div>
                </motion.div>
              );
            })
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-3">
          {acknowledged.map((alert, index) => {
            const Icon = alertIcons[alert.type as keyof typeof alertIcons];
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl border border-border bg-card/50 opacity-70"
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-foreground">{alert.title}</h4>
                      <span className="text-xs text-muted-foreground">
                        {format(alert.timestamp, 'MMM dd, HH:mm')}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AlertsPage;
