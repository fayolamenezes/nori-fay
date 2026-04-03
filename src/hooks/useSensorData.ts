import { useState, useEffect, useCallback } from 'react';
import { SensorData, TankStatus, Alert } from '@/types/aquaculture';
import { generateSensorData, getSensorStatus, mockTankStatus } from '@/data/mockData';

export const useSensorData = (refreshInterval = 5000) => {
  const [sensorData, setSensorData] = useState<SensorData>(generateSensorData());
  const [tankStatus, setTankStatus] = useState<TankStatus>(mockTankStatus);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const calculateHealthScore = (data: SensorData): number => {
    const sensors = Object.keys(data) as (keyof SensorData)[];
    let score = 100;
    sensors.forEach(sensor => {
      const status = getSensorStatus(sensor, data[sensor]);
      if (status === 'warning') score -= 5;
      if (status === 'critical') score -= 15;
    });
    return Math.max(0, Math.min(100, score));
  };

  const refreshData = useCallback(async () => {
    try {
      const res = await fetch('/api/sensor-data');
      const esp = await res.json();

      if (esp && esp.dissolvedOxygen !== undefined) {
        // Real data from ESP — override only the sensors we have
        const newData: SensorData = {
          ...generateSensorData(),           // keeps other fields realistic
          turbidity: esp.turbidity,
          dissolvedOxygen: esp.dissolvedOxygen,
        };

        setSensorData(newData);
        setLastUpdate(new Date());
        setIsConnected(true);
        setTankStatus(prev => ({
          ...prev,
          sensors: newData,
          lastUpdated: new Date(),
          healthScore: calculateHealthScore(newData),
        }));
      } else {
        // No ESP data yet, fall back to mock
        const newData = generateSensorData();
        setSensorData(newData);
        setLastUpdate(new Date());
      }
    } catch {
      // Network error — mark disconnected
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    refreshData(); // fetch immediately on mount
    const interval = setInterval(refreshData, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval, refreshData]);

  const acknowledgeAlert = (alertId: string) => {
    setTankStatus(prev => ({
      ...prev,
      alerts: prev.alerts.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      ),
    }));
  };

  const addAlert = (alert: Omit<Alert, 'id' | 'timestamp'>) => {
    const newAlert: Alert = {
      ...alert,
      id: `alert-${Date.now()}`,
      timestamp: new Date(),
    };
    setTankStatus(prev => ({
      ...prev,
      alerts: [newAlert, ...prev.alerts],
    }));
  };

  return {
    sensorData,
    tankStatus,
    isConnected,
    lastUpdate,
    refreshData,
    acknowledgeAlert,
    addAlert,
    setIsConnected,
  };
};