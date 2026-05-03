import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Store, ShoppingCart, Utensils, Truck, MapPin, CreditCard, Star } from 'lucide-react';

const entities = [
  { name: 'Customer', icon: Users, color: 'text-blue-400' },
  { name: 'Restaurant', icon: Store, color: 'text-blue-500' },
  { name: 'Orders', icon: ShoppingCart, color: 'text-purple-400' },
  { name: 'Menu Item', icon: Utensils, color: 'text-yellow-400' },
  { name: 'Delivery Partner', icon: Truck, color: 'text-red-400' },
  { name: 'Delivers', icon: MapPin, color: 'text-pink-400' },
  { name: 'Payment', icon: CreditCard, color: 'text-cyan-400' },
  { name: 'Ratings', icon: Star, color: 'text-orange-400' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-6xl md:text-8xl font-bold mb-6 text-neon-blue"
          >
            Food Delivery
            <br />
            Query Lab
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl text-gray-400 mb-8"
          >
            PostgreSQL Database Analysis Tool
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={() => navigate('/dashboard')}
            className="btn-neon text-lg px-8 py-4"
          >
            Let's Begin
          </motion.button>
        </motion.div>
        
        {/* Entities Section Heading */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-neon-blue">Entities</h2>
        </motion.div>
        
        {/* Entity Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {entities.map((entity, index) => {
            const Icon = entity.icon;
            return (
              <motion.div
                key={entity.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                className="glass-panel p-6 text-center cursor-pointer hover:bg-white/5 transition-colors"
              >
                <Icon className={`w-12 h-12 mx-auto mb-3 ${entity.color}`} />
                <h3 className="text-lg font-semibold text-gray-200">{entity.name}</h3>
              </motion.div>
            );
          })}
        </div>
        
        {/* Database Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="glass-panel p-12 text-center"
        >
          <div className="relative h-64 flex items-center justify-center">
            <div className="relative z-10">
              <Truck className="w-32 h-32 text-neon-blue mx-auto mb-4" />
              <p className="text-gray-400">Explore database queries and analytics</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
