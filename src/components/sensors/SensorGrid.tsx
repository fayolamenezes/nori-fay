import { motion } from 'framer-motion';
import { SensorData } from '@/types/aquaculture';
import { SensorCard } from './SensorCard';

interface SensorGridProps {
  sensors: SensorData;
}

export const SensorGrid = ({ sensors }: SensorGridProps) => {
  const sensorEntries = Object.entries(sensors) as [keyof SensorData, number][];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {sensorEntries.map(([sensor, value], index) => (
        <SensorCard
          key={sensor}
          sensor={sensor}
          value={value}
          delay={index}
        />
      ))}
    </motion.div>
  );
};
