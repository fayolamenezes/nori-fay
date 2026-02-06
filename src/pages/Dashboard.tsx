import { motion } from 'framer-motion';
import { LayoutDashboard, RefreshCw, Bell, Wifi, WifiOff } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SensorGrid } from '@/components/sensors/SensorGrid';
import { TankVisualization } from '@/components/tank/TankVisualization';
import { AlertsPanel } from '@/components/alerts/AlertsPanel';
import { AIInsightsList } from '@/components/ai/AIInsightCard';
import { useSensorData } from '@/hooks/useSensorData';
import { mockAIInsights } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { 
    sensorData, 
    tankStatus, 
    isConnected, 
    lastUpdate, 
    refreshData, 
    acknowledgeAlert,
    setIsConnected 
  } = useSensorData(5000);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Real-time monitoring of your IMTA system"
        icon={<LayoutDashboard className="w-6 h-6 text-accent" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isConnected ? (
                <>
                  <Wifi className="w-4 h-4 text-seaweed" />
                  <span>Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-4 h-4 text-destructive" />
                  <span>Offline</span>
                </>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "relative",
                tankStatus.alerts.filter(a => !a.acknowledged).length > 0 && "text-warning"
              )}
            >
              <Bell className="w-4 h-4" />
              {tankStatus.alerts.filter(a => !a.acknowledged).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-warning text-warning-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {tankStatus.alerts.filter(a => !a.acknowledged).length}
                </span>
              )}
            </Button>
          </div>
        }
      />

      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-card border border-border"
      >
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            isConnected ? "bg-seaweed animate-pulse" : "bg-destructive"
          )} />
          <span className="text-sm font-medium text-foreground">
            {tankStatus.name}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm text-muted-foreground">
          Last updated: {formatDistanceToNow(lastUpdate, { addSuffix: true })}
        </span>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm text-muted-foreground">
          Health: <span className={cn(
            "font-semibold",
            tankStatus.healthScore >= 80 ? "text-seaweed" : 
            tankStatus.healthScore >= 60 ? "text-warning" : "text-destructive"
          )}>{tankStatus.healthScore}%</span>
        </span>
      </motion.div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Tank visualization - spans 2 columns on xl */}
        <div className="xl:col-span-2">
          <TankVisualization tank={tankStatus} />
        </div>

        {/* Alerts panel */}
        <div className="bg-card rounded-xl border border-border p-4">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent" />
            Active Alerts
          </h3>
          <AlertsPanel
            alerts={tankStatus.alerts}
            onAcknowledge={acknowledgeAlert}
          />
        </div>
      </div>

      {/* Sensor Grid */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          All Sensors
        </h3>
        <SensorGrid sensors={sensorData} />
      </div>

      {/* AI Insights Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            🧠 Latest AI Insights
          </h3>
          <AIInsightsList insights={mockAIInsights.slice(0, 2)} />
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-accent/10 border border-accent/20"
            >
              <p className="text-xs text-muted-foreground mb-1">Shrimp Survival Rate</p>
              <p className="text-2xl font-bold text-accent font-mono">96.8%</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-seaweed/10 border border-seaweed/20"
            >
              <p className="text-xs text-muted-foreground mb-1">Growth Rate</p>
              <p className="text-2xl font-bold text-seaweed font-mono">+2.3g/wk</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-primary/10 border border-primary/20"
            >
              <p className="text-xs text-muted-foreground mb-1">Feed Conversion</p>
              <p className="text-2xl font-bold text-primary font-mono">1.42</p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="p-4 rounded-lg bg-coral/10 border border-coral/20"
            >
              <p className="text-xs text-muted-foreground mb-1">Cycle Day</p>
              <p className="text-2xl font-bold text-coral font-mono">{tankStatus.shrimpAge}</p>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
