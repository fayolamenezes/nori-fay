import { useState } from 'react';
import { motion } from 'framer-motion';
import { History, Calendar, Filter, Search } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { SensorHistoryChart } from '@/components/charts/SensorHistoryChart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { generateHistoricalData, sensorLabels, sensorUnits } from '@/data/mockData';
import { format } from 'date-fns';
import { SensorData } from '@/types/aquaculture';

const HistoryPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const historicalData = generateHistoricalData(7);

  // Create event log from historical data
  const eventLog = [
    { id: 1, type: 'feeding', message: 'Automated feeding completed - 300g', timestamp: new Date(Date.now() - 3600000) },
    { id: 2, type: 'alert', message: 'DO level dropped below 5.0 mg/L', timestamp: new Date(Date.now() - 7200000) },
    { id: 3, type: 'system', message: 'Aerator speed increased to 80%', timestamp: new Date(Date.now() - 10800000) },
    { id: 4, type: 'feeding', message: 'Automated feeding completed - 280g', timestamp: new Date(Date.now() - 14400000) },
    { id: 5, type: 'measurement', message: 'Manual water quality check performed', timestamp: new Date(Date.now() - 18000000) },
    { id: 6, type: 'system', message: 'Wave simulation intensity adjusted', timestamp: new Date(Date.now() - 21600000) },
    { id: 7, type: 'alert', message: 'Temperature exceeded 30°C briefly', timestamp: new Date(Date.now() - 25200000) },
    { id: 8, type: 'feeding', message: 'Automated feeding completed - 250g', timestamp: new Date(Date.now() - 28800000) },
  ];

  const eventColors = {
    feeding: 'bg-shrimp/10 border-shrimp/30 text-shrimp',
    alert: 'bg-warning/10 border-warning/30 text-warning',
    system: 'bg-accent/10 border-accent/30 text-accent',
    measurement: 'bg-seaweed/10 border-seaweed/30 text-seaweed',
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="History"
        description="Historical sensor data and system event logs"
        icon={<History className="w-6 h-6 text-accent" />}
        actions={
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Calendar className="w-4 h-4" />
              Date Range
            </Button>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        }
      />

      {/* Historical Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border border-border p-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4">
          7-Day Sensor History
        </h3>
        <SensorHistoryChart
          data={historicalData}
          sensors={['temperature', 'dissolvedOxygen', 'ph', 'ammonia']}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Event Log */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Event Log
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {eventLog.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border ${eventColors[event.type as keyof typeof eventColors]}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{event.message}</p>
                  <span className="text-xs opacity-70">
                    {format(event.timestamp, 'HH:mm')}
                  </span>
                </div>
                <p className="text-xs opacity-50 mt-1">
                  {format(event.timestamp, 'MMM dd, yyyy')}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Daily Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-card rounded-xl border border-border p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Today's Summary
          </h3>
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Feedings Completed</p>
              <p className="text-2xl font-bold font-mono text-foreground">3/4</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Alerts Triggered</p>
              <p className="text-2xl font-bold font-mono text-warning">2</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">System Uptime</p>
              <p className="text-2xl font-bold font-mono text-seaweed">99.8%</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <p className="text-xs text-muted-foreground mb-1">Data Points Collected</p>
              <p className="text-2xl font-bold font-mono text-accent">17,280</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HistoryPage;
