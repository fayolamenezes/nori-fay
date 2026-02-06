import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, Legend } from 'recharts';
import { motion } from 'framer-motion';
import { GrowthPrediction } from '@/types/aquaculture';
import { cn } from '@/lib/utils';

interface GrowthChartProps {
  data: GrowthPrediction[];
  className?: string;
}

export const GrowthChart = ({ data, className }: GrowthChartProps) => {
  const chartData = data.map(d => ({
    day: d.day,
    predicted: d.predictedWeight,
    actual: d.actualWeight,
    confidence: d.confidence * d.predictedWeight,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("h-[300px] w-full", className)}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(187 85% 43%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(187 85% 43%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(210 25% 15%)" />
          <XAxis 
            dataKey="day" 
            stroke="hsl(195 20% 60%)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'hsl(210 25% 15%)' }}
            label={{ value: 'Days', position: 'insideBottom', offset: -5, fill: 'hsl(195 20% 60%)' }}
          />
          <YAxis 
            stroke="hsl(195 20% 60%)"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: 'hsl(210 25% 15%)' }}
            label={{ value: 'Weight (g)', angle: -90, position: 'insideLeft', fill: 'hsl(195 20% 60%)' }}
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
            iconType="circle"
          />
          <Area
            type="monotone"
            dataKey="predicted"
            name="Predicted Weight"
            stroke="hsl(187 85% 43%)"
            strokeWidth={2}
            fill="url(#colorPredicted)"
          />
          <Area
            type="monotone"
            dataKey="actual"
            name="Actual Weight"
            stroke="hsl(160 84% 39%)"
            strokeWidth={2}
            fill="url(#colorActual)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
