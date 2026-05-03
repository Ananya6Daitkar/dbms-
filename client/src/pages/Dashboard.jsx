import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import KPICard from '../components/ui/KPICard';
import { dashboardApi } from '../services/api';

export default function Dashboard() {
  // State variables to store data
  const [kpis, setKpis] = useState(null);           // KPI numbers (active orders, etc.)
  const [charts, setCharts] = useState(null);       // Chart data
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [isDemoMode, setIsDemoMode] = useState(false); // Is using mock data?
  
  // Fetch data when component loads
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      
      // Call API to get KPIs and charts
      const kpisData = await dashboardApi.getKpis();
      const chartsData = await dashboardApi.getCharts();
      
      // Save data to state
      setKpis(kpisData);
      setCharts(chartsData);
      
      // Check if we're using mock data (database not connected)
      setIsDemoMode(kpisData._isMock || chartsData._isMock);
      
      setIsLoading(false);
    }
    
    fetchData();
  }, []); // Empty array = run once when component loads
  
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neon-blue mb-2">Dashboard</h1>
          {isDemoMode && (
            <span className="inline-block px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
              Demo Mode
            </span>
          )}
        </motion.div>
        
        {/* KPI Cards - 3 cards showing key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <KPICard
            label="Active Orders"
            value={kpis?.activeOrders || 0}
            isLoading={isLoading}
          />
          <KPICard
            label="Avg Delivery Time"
            value={kpis?.avgDeliveryTime || 0}
            unit="mins"
            isLoading={isLoading}
          />
          <KPICard
            label="New Restaurants"
            value={kpis?.newRestaurants || 0}
            isLoading={isLoading}
          />
        </div>
        
        {/* Charts - 2 charts side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Line Chart - Monthly Revenue Trends */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-neon-blue">Monthly Order Trends</h3>
            {!isLoading && charts?.orderTrend && (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={charts.orderTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid #3b82f6' }}
                  />
                  <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </motion.div>
          
          {/* Bar Chart - Revenue by Restaurant */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="glass-panel p-6"
          >
            <h3 className="text-xl font-semibold mb-4 text-neon-purple">Revenue by Restaurant</h3>
            {!isLoading && charts?.revenueByRestaurant && (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={charts.revenueByRestaurant}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1a1a1f', border: '1px solid #a855f7' }}
                  />
                  <Bar dataKey="revenue" fill="#a855f7" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
