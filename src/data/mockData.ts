import { SensorData, TankStatus, Alert, GrowthPrediction, SHAPValue, AIInsight, HistoricalData, ControlSettings, ThresholdSettings } from '@/types/aquaculture';

// Generate realistic sensor data with some variance
export const generateSensorData = (): SensorData => ({
  temperature: 28 + Math.random() * 2 - 1,
  ph: 7.8 + Math.random() * 0.4 - 0.2,
  dissolvedOxygen: 5.5 + Math.random() * 1.5 - 0.5,
  ammonia: 0.02 + Math.random() * 0.08,
  nitrite: 0.1 + Math.random() * 0.15,
  nitrate: 15 + Math.random() * 10,
  salinity: 25 + Math.random() * 3,
  turbidity: 10 + Math.random() * 5,
  tan: 0.5 + Math.random() * 0.3,
});

export const getSensorStatus = (sensor: keyof SensorData, value: number): 'optimal' | 'warning' | 'critical' => {
  const thresholds: Record<keyof SensorData, { optimal: [number, number]; warning: [number, number] }> = {
    temperature: { optimal: [27, 30], warning: [25, 32] },
    ph: { optimal: [7.5, 8.5], warning: [7.0, 9.0] },
    dissolvedOxygen: { optimal: [5, 8], warning: [4, 10] },
    ammonia: { optimal: [0, 0.05], warning: [0, 0.1] },
    nitrite: { optimal: [0, 0.2], warning: [0, 0.5] },
    nitrate: { optimal: [0, 20], warning: [0, 40] },
    salinity: { optimal: [24, 28], warning: [20, 32] },
    turbidity: { optimal: [0, 15], warning: [0, 25] },
    tan: { optimal: [0, 0.5], warning: [0, 1.0] },
  };

  const { optimal, warning } = thresholds[sensor];
  if (value >= optimal[0] && value <= optimal[1]) return 'optimal';
  if (value >= warning[0] && value <= warning[1]) return 'warning';
  return 'critical';
};

export const mockTankStatus: TankStatus = {
  id: 'tank-001',
  name: 'Main Production Tank',
  sensors: generateSensorData(),
  shrimpCount: 15000,
  shrimpAvgWeight: 12.5,
  shrimpAge: 45,
  seaweedBiomass: 125,
  lastUpdated: new Date(),
  healthScore: 87,
  alerts: [
    {
      id: 'alert-1',
      type: 'warning',
      message: 'Dissolved oxygen trending lower',
      sensor: 'dissolvedOxygen',
      value: 4.8,
      threshold: 5.0,
      timestamp: new Date(Date.now() - 3600000),
      acknowledged: false,
    },
    {
      id: 'alert-2',
      type: 'info',
      message: 'Feeding schedule completed',
      timestamp: new Date(Date.now() - 7200000),
      acknowledged: true,
    },
  ],
};

export const mockGrowthPredictions: GrowthPrediction[] = Array.from({ length: 90 }, (_, i) => ({
  day: i + 1,
  predictedWeight: 0.1 * Math.pow(1.05, i) + Math.random() * 0.5,
  actualWeight: i < 45 ? 0.1 * Math.pow(1.048, i) + Math.random() * 0.3 : undefined,
  confidence: 0.85 + Math.random() * 0.1,
}));

export const mockSHAPValues: SHAPValue[] = [
  { feature: 'age_days', value: 45, contribution: 0.35, color: 'hsl(187 85% 43%)' },
  { feature: 'avg_weight_g', value: 12.5, contribution: 0.28, color: 'hsl(160 84% 39%)' },
  { feature: 'do_min_mg_l', value: 5.2, contribution: 0.18, color: 'hsl(199 89% 28%)' },
  { feature: 'seaweed_biomass', value: 125, contribution: 0.12, color: 'hsl(160 84% 39%)' },
  { feature: 'temperature', value: 28.5, contribution: 0.08, color: 'hsl(24 95% 53%)' },
  { feature: 'ph', value: 7.9, contribution: 0.05, color: 'hsl(38 92% 50%)' },
  { feature: 'nh3_mg_l', value: 0.03, contribution: -0.04, color: 'hsl(0 72% 51%)' },
  { feature: 'tan', value: 0.6, contribution: -0.02, color: 'hsl(0 72% 51%)' },
];

export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'prediction',
    title: 'Growth Rate Forecast',
    description: 'Based on current conditions, shrimp growth rate is expected to increase by 12% over the next week. Optimal feeding and DO levels are key contributors.',
    confidence: 0.89,
    timestamp: new Date(),
    actionable: false,
  },
  {
    id: 'insight-2',
    type: 'recommendation',
    title: 'Increase Aeration',
    description: 'Dissolved oxygen levels are trending lower. Recommend increasing aerator speed by 15% during peak feeding hours.',
    confidence: 0.92,
    timestamp: new Date(Date.now() - 1800000),
    actionable: true,
    action: 'Increase aerator speed',
  },
  {
    id: 'insight-3',
    type: 'analysis',
    title: 'Seaweed Impact Analysis',
    description: 'Seaweed biomass has reached optimal level (125kg). Nutrient absorption is effectively controlling ammonia levels below 0.05 mg/L.',
    confidence: 0.95,
    timestamp: new Date(Date.now() - 3600000),
    actionable: false,
  },
  {
    id: 'insight-4',
    type: 'warning',
    title: 'Temperature Alert',
    description: 'Temperature is approaching upper threshold. Consider activating cooling system if ambient temperature continues to rise.',
    confidence: 0.78,
    timestamp: new Date(Date.now() - 5400000),
    actionable: true,
    action: 'Monitor temperature',
  },
];

export const generateHistoricalData = (days: number): HistoricalData[] => {
  return Array.from({ length: days * 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (days * 24 - i) * 3600000),
    sensors: generateSensorData(),
    growthRate: 0.02 + Math.random() * 0.01,
  }));
};

export const mockControlSettings: ControlSettings = {
  aeratorEnabled: true,
  aeratorSpeed: 75,
  waveSimulation: true,
  waveIntensity: 60,
  feedingSchedule: [
    { id: 'feed-1', time: '06:00', amount: 250, type: 'Starter Feed', enabled: true },
    { id: 'feed-2', time: '12:00', amount: 300, type: 'Growth Feed', enabled: true },
    { id: 'feed-3', time: '18:00', amount: 280, type: 'Growth Feed', enabled: true },
    { id: 'feed-4', time: '22:00', amount: 150, type: 'Night Feed', enabled: false },
  ],
  tidalSimulation: true,
  tidalPhase: 'rising',
};

export const defaultThresholds: ThresholdSettings[] = [
  { sensor: 'temperature', min: 25, max: 32, warningMin: 26, warningMax: 30, unit: '°C' },
  { sensor: 'ph', min: 7.0, max: 9.0, warningMin: 7.5, warningMax: 8.5, unit: '' },
  { sensor: 'dissolvedOxygen', min: 4.0, max: 10.0, warningMin: 5.0, warningMax: 8.0, unit: 'mg/L' },
  { sensor: 'ammonia', min: 0, max: 0.15, warningMin: 0, warningMax: 0.05, unit: 'mg/L' },
  { sensor: 'nitrite', min: 0, max: 0.5, warningMin: 0, warningMax: 0.2, unit: 'mg/L' },
  { sensor: 'nitrate', min: 0, max: 50, warningMin: 0, warningMax: 20, unit: 'mg/L' },
  { sensor: 'salinity', min: 18, max: 35, warningMin: 24, warningMax: 28, unit: 'ppt' },
  { sensor: 'turbidity', min: 0, max: 30, warningMin: 0, warningMax: 15, unit: 'NTU' },
  { sensor: 'tan', min: 0, max: 1.5, warningMin: 0, warningMax: 0.5, unit: 'mg/L' },
];

export const sensorLabels: Record<keyof SensorData, string> = {
  temperature: 'Temperature',
  ph: 'pH Level',
  dissolvedOxygen: 'Dissolved Oxygen',
  ammonia: 'Ammonia (NH₃)',
  nitrite: 'Nitrite (NO₂)',
  nitrate: 'Nitrate (NO₃)',
  salinity: 'Salinity',
  turbidity: 'Turbidity',
  tan: 'Total Ammonia Nitrogen',
};

export const sensorUnits: Record<keyof SensorData, string> = {
  temperature: '°C',
  ph: '',
  dissolvedOxygen: 'mg/L',
  ammonia: 'mg/L',
  nitrite: 'mg/L',
  nitrate: 'mg/L',
  salinity: 'ppt',
  turbidity: 'NTU',
  tan: 'mg/L',
};

export const sensorIcons: Record<keyof SensorData, string> = {
  temperature: 'Thermometer',
  ph: 'FlaskConical',
  dissolvedOxygen: 'Wind',
  ammonia: 'AlertTriangle',
  nitrite: 'TestTube',
  nitrate: 'Beaker',
  salinity: 'Waves',
  turbidity: 'Eye',
  tan: 'Atom',
};
