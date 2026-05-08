import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, AlertCircle, CheckCircle, Code2 } from 'lucide-react';
import { triggerApi } from '../services/api';

export default function TriggerDemo() {
  const [orderId, setOrderId] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [customMode, setCustomMode] = useState(false);
  const [customTriggerSql, setCustomTriggerSql] = useState('');
  const [customError, setCustomError] = useState(null);
  
  const handleSimulate = async () => {
    setIsLoading(true);
    const data = await triggerApi.simulatePayment(orderId, parseFloat(amount), status || null);
    setResult(data);
    setIsDemoMode(data._isMock);
    setIsLoading(false);
  };
  
  const handleRunCustomTrigger = async () => {
    if (!customTriggerSql.trim()) {
      setCustomError('Please enter trigger SQL');
      return;
    }
    
    setIsLoading(true);
    setCustomError(null);
    
    try {
      const response = await fetch('/api/triggers/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sql: customTriggerSql })
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
      setCustomError(error.message || 'Failed to execute trigger');
      setResult(null);
    }
    
    setIsLoading(false);
  };
  
  const handleModeSwitch = (isCustom) => {
    setCustomMode(isCustom);
    setResult(null);
    setCustomError(null);
    if (!isCustom) {
      setCustomTriggerSql('');
    } else {
      setOrderId('');
      setAmount('');
      setStatus('');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trigger Demonstration</h1>
          <p className="text-gray-600">Test predefined triggers or create your own</p>
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
            <Zap className="w-4 h-4 inline mr-2" />
            Payment Trigger
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
            Custom Trigger
          </button>
        </div>
        
        {!customMode ? (
          <>
            {/* Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6"
            >
              <div className="flex gap-3">
                <Zap className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">How the Trigger Works</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• If amount &gt; 0 and status is NULL → Sets status to 'Pending'</li>
                    <li>• If amount ≤ 0 → Sets status to 'Invalid'</li>
                    <li>• Trigger fires automatically before INSERT or UPDATE</li>
                  </ul>
                </div>
              </div>
            </motion.div>
            
            {/* Input Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Order ID</label>
                  <input
                    type="number"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="Enter order ID"
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Amount</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount (e.g., 500)"
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Status (leave empty to test trigger)
                  </label>
                  <input
                    type="text"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    placeholder="Leave empty or enter status"
                    className="w-full px-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              
              <button
                onClick={handleSimulate}
                disabled={isLoading || !orderId || !amount}
                className="mt-6 btn-primary flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                {isLoading ? 'Simulating...' : 'Simulate Payment'}
              </button>
            </motion.div>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create Custom Trigger</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Trigger SQL
              </label>
              <textarea
                value={customTriggerSql}
                onChange={(e) => setCustomTriggerSql(e.target.value)}
                placeholder="CREATE OR REPLACE FUNCTION my_trigger_func() RETURNS TRIGGER AS $&#10;BEGIN&#10;  NEW.status := 'Processed';&#10;  RETURN NEW;&#10;END;&#10;$ LANGUAGE plpgsql;&#10;&#10;CREATE TRIGGER my_trigger&#10;BEFORE INSERT ON Payment&#10;FOR EACH ROW EXECUTE FUNCTION my_trigger_func();&#10;&#10;INSERT INTO Payment (order_no, amount, status, payment_date) VALUES (1, 100, NULL, CURRENT_DATE) RETURNING *;"
                className="w-full h-80 bg-white border-2 border-gray-300 rounded-lg p-4 font-mono text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
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
              onClick={handleRunCustomTrigger}
              disabled={isLoading || !customTriggerSql.trim()}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Running...' : 'Create & Execute'}
            </button>
          </motion.div>
        )}
        
        {/* Result */}
        {result && !customMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Before State */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-gray-900">Before Trigger</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{result.before.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{result.before.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-gray-400">
                    {result.before.status || 'null'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* After State */}
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h3 className="font-semibold text-gray-900">After Trigger</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-medium">{result.after.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{result.after.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className={`font-medium ${
                    result.after.status === 'Pending' ? 'text-blue-600' :
                    result.after.status === 'Invalid' ? 'text-red-600' :
                    'text-green-600'
                  }`}>
                    {result.after.status}
                  </span>
                </div>
              </div>
              
              {result.triggerFired && (
                <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800 font-medium">✓ Trigger executed successfully!</p>
                </div>
              )}
              
              {isDemoMode && (
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
                    Demo Mode
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Custom Trigger Result */}
        {result && customMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="font-semibold text-gray-900 mb-4">Result</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 font-medium">✓ Trigger created and executed successfully!</p>
              {result.result && (
                <div className="mt-3 bg-white rounded p-3 font-mono text-sm text-gray-900">
                  <pre>{JSON.stringify(result.result, null, 2)}</pre>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
