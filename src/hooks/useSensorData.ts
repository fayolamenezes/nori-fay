import { useState, useEffect, useCallback } from 'react';
import { SensorData, TankStatus, Alert } from '@/types/aquaculture';
import { generateSensorData, getSensorStatus, mockTankStatus } from '@/data/mockData';

export const useSensorData = (refreshInterval = 5000) => {
  const [sensorData, setSensorData] = useState<SensorData>(generateSensorData());
  const [tankStatus, setTankStatus] = useState<TankStatus>(mockTankStatus);
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const refreshData = useCallback(() => {
    const newData = generateSensorData();
    setSensorData(newData);
    setLastUpdate(new Date());
    
    // Update tank status with new sensor data
    setTankStatus(prev => ({
      ...prev,
      sensors: newData,
      lastUpdated: new Date(),
      healthScore: calculateHealthScore(newData),
    }));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isConnected) {
        refreshData();
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, isConnected, refreshData]);

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
