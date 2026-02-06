import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { HistoricalData } from '@/types/aquaculture';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SensorHistoryChartProps {
  data: HistoricalData[];
  sensors: string[];
  className?: string;
}

const sensorColors: Record<string, string> = {
  temperature: 'hsl(24 95% 53%)',
  ph: 'hsl(38 92% 50%)',
  dissolvedOxygen: 'hsl(187 85% 43%)',
  ammonia: 'hsl(0 72% 51%)',
  nitrite: 'hsl(280 60% 50%)',
  nitrate: 'hsl(280 40% 60%)',
  salinity: 'hsl(199 89% 48%)',
  turbidity: 'hsl(45 80% 50%)',
  tan: 'hsl(12 76% 61%)',
};

export const SensorHistoryChart = ({ data, sensors, className }: SensorHistoryChartProps) => {
  const chartData = data.map(d => ({
    time: format(d.timestamp, 'HH:mm'),
    ...d.sensors,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("h-[350px] w-full", className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 25% 15%)" />
          <XAxis 
            dataKey="time" 
            stroke="hsl(195 20% 60%)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'hsl(210 25% 15%)' }}
          />
          <YAxis 
            stroke="hsl(195 20% 60%)"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'hsl(210 25% 15%)' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(210 35% 6%)',
              border: '1px solid hsl(210 25% 15%)',
              borderRadius: '8px',
              boxShadow: '0 4px 24px hsl(210 40% 3% / 0.5)',
            }}
            labelStyle={{ color: 'hsl(195 100% 95%)' }}
            itemStyle={{ color: 'hsl(195 100% 95%)' }}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />
          {sensors.map((sensor) => (
            <Line
              key={sensor}
              type="monotone"
              dataKey={sensor}
              name={sensor.replace(/([A-Z])/g, ' $1').trim()}
              stroke={sensorColors[sensor] || 'hsl(187 85% 43%)'}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
