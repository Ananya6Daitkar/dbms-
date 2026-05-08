import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Store, ShoppingCart, Utensils, Truck, MapPin, CreditCard, Star, Database, ArrowRight } from 'lucide-react';

const entities = [
  { name: 'Customer', icon: Users, color: 'bg-blue-100 text-blue-600', description: 'User accounts' },
  { name: 'Restaurant', icon: Store, color: 'bg-purple-100 text-purple-600', description: 'Food outlets' },
  { name: 'Orders', icon: ShoppingCart, color: 'bg-green-100 text-green-600', description: 'Order records' },
  { name: 'Menu Item', icon: Utensils, color: 'bg-yellow-100 text-yellow-600', description: 'Food items' },
  { name: 'Delivery Partner', icon: Truck, color: 'bg-red-100 text-red-600', description: 'Delivery agents' },
  { name: 'Delivers', icon: MapPin, color: 'bg-pink-100 text-pink-600', description: 'Delivery tracking' },
  { name: 'Payment', icon: CreditCard, color: 'bg-cyan-100 text-cyan-600', description: 'Transactions' },
  { name: 'Ratings', icon: Star, color: 'bg-orange-100 text-orange-600', description: 'User reviews' }
];

const features = [
  { title: '15 SQL Queries', description: 'Simple and complex queries ready to execute' },
  { title: '3 PL/pgSQL Functions', description: 'Custom database functions for analytics' },
  { title: 'Trigger Demonstrations', description: 'Automated database actions' },
  { title: 'Custom Query Editor', description: 'Write and execute your own SQL' }
];

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 py-12"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-2xl mb-6"
          >
            <Database className="w-12 h-12 text-white" />
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-6xl font-bold mb-4 text-gray-900"
          >
            Food Delivery Database
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            A comprehensive PostgreSQL database system for managing food delivery operations with advanced query capabilities
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            onClick={() => navigate('/dashboard')}
            className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2"
          >
            Explore Dashboard
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>
        
        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
            >
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Entities Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Database Entities</h2>
          <p className="text-gray-600 text-center mb-8">8 interconnected tables managing the complete food delivery workflow</p>
        </motion.div>
        
        {/* Entity Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {entities.map((entity, index) => {
            const Icon = entity.icon;
            return (
              <motion.div
                key={entity.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.05 }}
                className="bg-white rounded-xl p-6 text-center border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
              >
                <div className={`w-14 h-14 ${entity.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <Icon className="w-7 h-7" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{entity.name}</h3>
                <p className="text-sm text-gray-600">{entity.description}</p>
              </motion.div>
            );
          })}
        </div>
        
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Execute SQL queries, test database functions, and analyze food delivery data in real-time
          </p>
          <button
            onClick={() => navigate('/query-lab')}
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
          >
            Start Querying
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
