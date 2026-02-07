import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { TankStatus } from '@/types/aquaculture';
import { cn } from '@/lib/utils';
import { Fish, Leaf, Activity, Droplets } from 'lucide-react';

interface TankVisualizationProps {
  tank: TankStatus;
  className?: string;
}

/**
 * Final updated version:
 * - Tank is shorter in height (same look/layout)
 * - Bubble travel distance matches new height
 * - Slightly reduced seaweed max height so it fits better visually
 */
export const TankVisualization = ({ tank, className }: TankVisualizationProps) => {
  const [bubbles, setBubbles] = useState<{ id: number; x: number; size: number; delay: number }[]>([]);

  // Hardcoded Tailwind-safe heights (no dynamic classes)
  const bubbleRise = useMemo(() => -520, []); // tuned for h-[320px] / lg:h-[380px]

  useEffect(() => {
    const newBubbles = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      size: 4 + Math.random() * 8,
      delay: Math.random() * 4,
    }));
    setBubbles(newBubbles);
  }, []);

  const healthColor =
    tank.healthScore >= 80 ? 'text-seaweed' : tank.healthScore >= 60 ? 'text-warning' : 'text-destructive';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('relative rounded-2xl overflow-hidden border border-border bg-card', className)}
    >
      {/* Tank container (SHORTER) */}
      <div className="relative h-[320px] lg:h-[380px]">
        {/* Water effect */}
        <div className="absolute inset-0 tank-water animate-water-surface" />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-ocean-deep/50" />

        {/* Bubbles */}
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-accent/30 border border-accent/20"
            style={{
              left: `${bubble.x}%`,
              width: bubble.size,
              height: bubble.size,
              bottom: '-10%',
            }}
            animate={{
              y: [0, bubbleRise],
              opacity: [0, 0.6, 0.4, 0],
              scale: [0.8, 1, 1.2],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: bubble.delay,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Seaweed visualization */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end px-8 pb-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="relative"
              animate={{
                rotateZ: [-3, 3, -3],
                originY: 1,
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <div
                className="w-3 rounded-t-full bg-gradient-to-t from-seaweed/80 to-seaweed/40"
                style={{ height: 30 + Math.random() * 55 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Shrimp representation */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            className="relative"
            animate={{ y: [-5, 5, -5], x: [-3, 3, -3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="w-20 h-20 rounded-full bg-shrimp/20 border border-shrimp/30 flex items-center justify-center glow-warning">
              <Fish className="w-10 h-10 text-shrimp" />
            </div>
          </motion.div>
        </div>

        {/* Health score overlay */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-muted-foreground">Health Score</span>
            </div>
            <div className={cn('text-3xl font-bold font-mono', healthColor)}>{tank.healthScore}%</div>
          </div>

          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Droplets className="w-4 h-4 text-accent" />
              <span className="text-xs font-medium text-muted-foreground">Water Quality</span>
            </div>
            <div className="text-lg font-semibold text-seaweed">Optimal</div>
          </div>
        </div>

        {/* Tank stats */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="glass rounded-xl p-4 grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Fish className="w-4 h-4 text-shrimp" />
                <span className="text-xs text-muted-foreground">Shrimp Count</span>
              </div>
              <div className="text-xl font-bold font-mono text-foreground">{tank.shrimpCount.toLocaleString()}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Activity className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Avg Weight</span>
              </div>
              <div className="text-xl font-bold font-mono text-foreground">{tank.shrimpAvgWeight}g</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-xs text-muted-foreground">🦐 Age</span>
              </div>
              <div className="text-xl font-bold font-mono text-foreground">{tank.shrimpAge} days</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Leaf className="w-4 h-4 text-seaweed" />
                <span className="text-xs text-muted-foreground">Seaweed</span>
              </div>
              <div className="text-xl font-bold font-mono text-foreground">{tank.seaweedBiomass}kg</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
