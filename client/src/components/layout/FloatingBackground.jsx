import React from 'react';
import { motion } from 'framer-motion';

export default function FloatingBackground() {
  // Create 20 floating particles with random properties
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 100 + 50,        // Random size between 50-150px
    x: Math.random() * 100,                 // Random X position (0-100%)
    y: Math.random() * 100,                 // Random Y position (0-100%)
    duration: Math.random() * 20 + 10,      // Random animation duration (10-30s)
    delay: Math.random() * 5                // Random start delay (0-5s)
  }));
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Render each floating particle */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            // Alternate between blue shades
            background: `radial-gradient(circle, ${
              particle.id % 2 === 0 ? 'rgba(59, 130, 246, 0.1)' : 'rgba(30, 64, 175, 0.1)'
            }, transparent)`
          }}
          // Animate: move up/down, left/right, scale, and fade
          animate={{
            y: [0, -30, 0],           // Move up 30px then back
            x: [0, 15, 0],            // Move right 15px then back
            scale: [1, 1.1, 1],       // Grow 10% then shrink back
            opacity: [0.3, 0.6, 0.3]  // Fade in and out
          }}
          transition={{
            duration: particle.duration,  // How long one cycle takes
            repeat: Infinity,             // Loop forever
            delay: particle.delay,        // When to start
            ease: 'easeInOut'            // Smooth animation
          }}
        />
      ))}
      
      {/* Grid overlay - creates the background grid pattern */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'  // Grid cell size
        }}
      />
    </div>
  );
}
