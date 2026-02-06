// Sensor data types
export interface SensorReading {
  id: string;
  timestamp: Date;
  value: number;
  unit: string;
  status: 'optimal' | 'warning' | 'critical';
}

export interface SensorData {
  temperature: number;
  ph: number;
  dissolvedOxygen: number;
  ammonia: number;
  nitrite: number;
  nitrate: number;
  salinity: number;
  turbidity: number;
  tan: number;
}

export interface TankStatus {
  id: string;
  name: string;
  sensors: SensorData;
  shrimpCount: number;
  shrimpAvgWeight: number;
  shrimpAge: number;
  seaweedBiomass: number;
  lastUpdated: Date;
  healthScore: number;
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical';
  message: string;
  sensor?: string;
  value?: number;
  threshold?: number;
  timestamp: Date;
  acknowledged: boolean;
}

export interface GrowthPrediction {
  day: number;
  predictedWeight: number;
  actualWeight?: number;
  confidence: number;
}

export interface SHAPValue {
  feature: string;
  value: number;
  contribution: number;
  color: string;
}

export interface ControlSettings {
  aeratorEnabled: boolean;
  aeratorSpeed: number;
  waveSimulation: boolean;
  waveIntensity: number;
  feedingSchedule: FeedingSchedule[];
  tidalSimulation: boolean;
  tidalPhase: 'high' | 'low' | 'rising' | 'falling';
}

export interface FeedingSchedule {
  id: string;
  time: string;
  amount: number;
  type: string;
  enabled: boolean;
}

export interface HistoricalData {
  timestamp: Date;
  sensors: SensorData;
  growthRate: number;
}

export interface AIInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'warning' | 'analysis';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
  actionable: boolean;
  action?: string;
}

export interface Report {
  id: string;
  type: 'daily' | 'weekly' | 'monthly';
  title: string;
  generatedAt: Date;
  summary: string;
  metrics: ReportMetric[];
}

export interface ReportMetric {
  name: string;
  value: number;
  change: number;
  unit: string;
}

export interface ThresholdSettings {
  sensor: keyof SensorData;
  min: number;
  max: number;
  warningMin: number;
  warningMax: number;
  unit: string;
}
