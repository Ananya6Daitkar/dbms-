import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { functionApi } from '../services/api';

const functions = [
  {
    name: 'get_total_orders',
    label: 'Get Total Orders',
    description: 'Count total orders for a specific customer',
    params: [{ name: 'customerId', type: 'number', label: 'Customer ID' }]
  },
  {
    name: 'total_revenue',
    label: 'Total Revenue',
    description: 'Calculate total revenue across all payments',
    params: []
  },
  {
    name: 'avg_menu_price',
    label: 'Average Menu Price',
    description: 'Calculate average price of all menu items',
    params: []
  }
];

export default function FunctionsPage() {
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [params, setParams] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const handleRunFunction = async () => {
    if (!selectedFunction) return;
    
    setIsLoading(true);
    const data = await functionApi.runFunction(selectedFunction.name, params);
    setResult(data);
    setIsDemoMode(data._isMock);
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold neon-text mb-2">PL/pgSQL FUNCTIONS</h1>
          <p className="text-gray-400">Execute database functions and view results</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {functions.map((func, index) => (
            <motion.div
              key={func.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                setSelectedFunction(func);
                setParams({});
                setResult(null);
              }}
              className={`glass-panel p-6 cursor-pointer transition-all ${
                selectedFunction?.name === func.name ? 'ring-2 ring-neon-blue' : ''
              }`}
            >
              <h3 className="text-lg font-semibold text-neon-blue mb-2">{func.label}</h3>
              <p className="text-sm text-gray-400">{func.description}</p>
            </motion.div>
          ))}
        </div>
        
        {selectedFunction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-neon-blue">{selectedFunction.label}</h2>
              {isDemoMode && (
                <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                  Demo Mode
                </span>
              )}
            </div>
            
            {selectedFunction.params.length > 0 && (
              <div className="mb-6 space-y-4">
                {selectedFunction.params.map(param => (
                  <div key={param.name}>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      {param.label}
                    </label>
                    <input
                      type={param.type}
                      value={params[param.name] || ''}
                      onChange={(e) => setParams({ ...params, [param.name]: e.target.value })}
                      className="w-full px-4 py-2 bg-space-dark border border-gray-700 rounded-lg focus:border-neon-blue outline-none"
                    />
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={handleRunFunction}
              disabled={isLoading}
              className="btn-neon flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              {isLoading ? 'Running...' : 'RUN FUNCTION'}
            </button>
            
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 glass-panel p-6 bg-neon-blue/5"
              >
                <h3 className="text-lg font-semibold text-neon-blue mb-2">Result:</h3>
                <p className="text-3xl font-bold text-white">{result.result}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
