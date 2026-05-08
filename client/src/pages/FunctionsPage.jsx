import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Code, TrendingUp, DollarSign, ShoppingBag, Code2 } from 'lucide-react';
import { functionApi } from '../services/api';

const functions = [
  {
    name: 'get_total_orders',
    label: 'Get Total Orders',
    description: 'Returns the total number of orders for a specific customer',
    icon: ShoppingBag,
    color: 'bg-blue-500',
    params: [{ name: 'customer_id', type: 'number', placeholder: 'Enter customer ID' }]
  },
  {
    name: 'total_revenue',
    label: 'Total Revenue',
    description: 'Calculates the total revenue from all payments',
    icon: DollarSign,
    color: 'bg-green-500',
    params: []
  },
  {
    name: 'avg_menu_price',
    label: 'Average Menu Price',
    description: 'Calculates the average price of all menu items',
    icon: TrendingUp,
    color: 'bg-purple-500',
    params: []
  }
];

export default function FunctionsPage() {
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [params, setParams] = useState({});
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [customMode, setCustomMode] = useState(false);
  const [customFunctionSql, setCustomFunctionSql] = useState('');
  const [customError, setCustomError] = useState(null);
  
  const handleRunFunction = async () => {
    if (!selectedFunction) return;
    
    setIsLoading(true);
    const data = await functionApi.runFunction(selectedFunction.name, params);
    setResult(data);
    setIsDemoMode(data._isMock);
    setIsLoading(false);
  };
  
  const handleRunCustomFunction = async () => {
    if (!customFunctionSql.trim()) {
      setCustomError('Please enter function SQL');
      return;
    }
    
    setIsLoading(true);
    setCustomError(null);
    
    try {
      const response = await fetch('/api/functions/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: customFunctionSql })
      });
      
      const data = await response.json();
      
      if (data.error) {
        setCustomError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setCustomError(null);
      }
    } catch (error) {
      setCustomError(error.message || 'Failed to execute function');
      setResult(null);
    }
    
    setIsLoading(false);
  };
  
  const handleModeSwitch = (isCustom) => {
    setCustomMode(isCustom);
    setResult(null);
    setCustomError(null);
    if (!isCustom) {
      setCustomFunctionSql('');
    } else {
      setSelectedFunction(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PL/pgSQL Functions</h1>
          <p className="text-gray-600">Execute predefined functions or create your own</p>
        </motion.div>
        
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleModeSwitch(false)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              !customMode
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
            }`}
          >
            <ShoppingBag className="w-4 h-4 inline mr-2" />
            Predefined Functions
          </button>
          <button
            onClick={() => handleModeSwitch(true)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              customMode
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
            }`}
          >
            <Code2 className="w-4 h-4 inline mr-2" />
            Custom Function
          </button>
        </div>
        
        {!customMode ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {functions.map((func, index) => {
                const Icon = func.icon;
                return (
                  <motion.div
                    key={func.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => {
                      setSelectedFunction(func);
                      setParams({});
                      setResult(null);
                    }}
                    className={`bg-white rounded-xl p-6 cursor-pointer transition-all border-2 ${
                      selectedFunction?.name === func.name
                        ? 'border-indigo-500 shadow-md'
                        : 'border-gray-200 hover:border-indigo-300 hover:shadow-sm'
                    }`}
                  >
                    <div className={`w-12 h-12 ${func.color} rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{func.label}</h3>
                    <p className="text-sm text-gray-600">{func.description}</p>
                  </motion.div>
                );
              })}
            </div>
            
            {selectedFunction && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Code className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-bold text-gray-900">{selectedFunction.label}</h2>
                </div>
                
                {selectedFunction.params.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-2">Parameters</label>
                    {selectedFunction.params.map(param => (
                      <input
                        key={param.name}
                        type={param.type}
                        placeholder={param.placeholder}
                        value={params[param.name] || ''}
                        onChange={(e) => setParams({ ...params, [param.name]: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                      />
                    ))}
                  </div>
                )}
                
                <button
                  onClick={handleRunFunction}
                  disabled={isLoading}
                  className="btn-primary flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isLoading ? 'Running...' : 'Run Function'}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Custom Function</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Function SQL
              </label>
              <textarea
                value={customFunctionSql}
                onChange={(e) => setCustomFunctionSql(e.target.value)}
                placeholder="CREATE OR REPLACE FUNCTION my_function() RETURNS INTEGER AS $$&#10;BEGIN&#10;  RETURN 42;&#10;END;&#10;$$ LANGUAGE plpgsql;&#10;&#10;SELECT my_function();"
                className="w-full h-64 bg-white border-2 border-gray-300 rounded-lg p-4 font-mono text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
            </div>
            
            {customError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Error</p>
                  <p>{customError}</p>
                </div>
              </div>
            )}
            
            <button
              onClick={handleRunCustomFunction}
              disabled={isLoading || !customFunctionSql.trim()}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Running...' : 'Create & Execute'}
            </button>
          </motion.div>
        )}
        
        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Result</h3>
            <div className="bg-indigo-50 rounded-lg p-6 text-center">
              <p className="text-4xl font-bold text-indigo-600">{result.result}</p>
              {isDemoMode && (
                <span className="inline-block mt-2 px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                  Demo Mode
                </span>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
