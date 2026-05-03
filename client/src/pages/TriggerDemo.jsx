import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap } from 'lucide-react';
import { triggerApi } from '../services/api';

export default function TriggerDemo() {
  const [formData, setFormData] = useState({
    orderId: '1',
    amount: '0',
    status: ''
  });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = await triggerApi.simulatePayment(
      formData.orderId,
      parseFloat(formData.amount),
      formData.status || null
    );
    
    setResult(data);
    setIsDemoMode(data._isMock);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold neon-text mb-2">TRIGGER DEMO: REAL-TIME UPDATES</h1>
          <p className="text-gray-400">Simulate payment trigger and observe automatic status changes</p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* BEFORE State */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6"
          >
            <h2 className="text-xl font-semibold text-neon-blue mb-4">PAYMENT SIMULATION</h2>
            <p className="text-sm text-gray-400 mb-4">BEFORE State</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Order ID
                </label>
                <input
                  type="number"
                  value={formData.orderId}
                  onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                  className="w-full px-4 py-2 bg-space-dark border border-gray-700 rounded-lg focus:border-neon-blue outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Amount
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 bg-space-dark border border-gray-700 rounded-lg focus:border-neon-blue outline-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Initial Status (optional)
                </label>
                <input
                  type="text"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  placeholder="Leave empty for null"
                  className="w-full px-4 py-2 bg-space-dark border border-gray-700 rounded-lg focus:border-neon-blue outline-none"
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="btn-neon w-full flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                {isLoading ? 'Running...' : 'TRIGGER'}
              </button>
            </form>
          </motion.div>
          
          {/* Arrow */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              animate={{ x: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowRight className="w-12 h-12 text-neon-blue" />
            </motion.div>
          </div>
          
          {/* AFTER State */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-panel p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-neon-purple">RESULT</h2>
                  {isDemoMode && (
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">
                      Simulated
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mb-4">AFTER State</p>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Order ID</p>
                    <p className="text-lg font-semibold">{result.after.orderId}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Amount</p>
                    <p className="text-lg font-semibold">₹{result.after.amount}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-400">Status</p>
                    <motion.p
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className={`text-lg font-semibold ${
                        result.before.status !== result.after.status
                          ? 'text-neon-blue'
                          : 'text-white'
                      }`}
                    >
                      {result.after.status}
                      {result.before.status !== result.after.status && (
                        <span className="ml-2 text-sm text-neon-blue">✓ Changed</span>
                      )}
                    </motion.p>
                  </div>
                  
                  {result.triggerFired && (
                    <div className="mt-4 p-3 bg-neon-blue/10 border border-neon-blue/30 rounded-lg">
                      <p className="text-sm text-neon-blue flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        Trigger fired successfully
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Explanation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 mt-8"
        >
          <h3 className="text-lg font-semibold text-neon-purple mb-3">Trigger Logic:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• If amount ≤ 0 → status = 'Invalid'</li>
            <li>• If amount &gt; 0 and status is NULL → status = 'Pending'</li>
            <li>• If amount &gt; 0 and status is set → status remains unchanged</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
}
