import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function KPICard({ label, value, unit = '', sparklineData = [], isLoading = false }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (isLoading || !value) return;
    
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    const stepDuration = duration / steps;
    
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [value, isLoading]);
  
  if (isLoading) {
    return (
      <div className="glass-panel p-6">
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="h-8 bg-gray-700 rounded w-3/4"></div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className="glass-panel p-6 relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-neon opacity-0 group-hover:opacity-10 transition-opacity"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400 uppercase tracking-wide">{label}</p>
          <TrendingUp className="w-4 h-4 text-neon-blue" />
        </div>
        
        <div className="flex items-baseline gap-2">
          <motion.p
            key={displayValue}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold neon-text"
          >
            {displayValue.toLocaleString()}
          </motion.p>
          {unit && <span className="text-lg text-gray-400">{unit}</span>}
        </div>
        
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4 h-12 flex items-end gap-1">
            {sparklineData.map((val, index) => (
              <motion.div
                key={index}
                initial={{ height: 0 }}
                animate={{ height: `${(val / Math.max(...sparklineData)) * 100}%` }}
                transition={{ delay: index * 0.05 }}
                className="flex-1 bg-neon-blue/30 rounded-t"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
