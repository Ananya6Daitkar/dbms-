import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { dashboardApi } from '../services/api';

export default function Dashboard() {
  const [kpis, setKpis] = useState(null);
  const [charts, setCharts] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const kpisData = await dashboardApi.getKpis();
      const chartsData = await dashboardApi.getCharts();
      setKpis(kpisData);
      setCharts(chartsData);
      setIsDemoMode(kpisData._isMock || chartsData._isMock);
      setIsLoading(false);
    }
    fetchData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  const kpiCards = [
    { title: 'Total Customers', value: kpis?.totalCustomers || 0, icon: Users, color: 'bg-blue-500', change: '+12%' },
    { title: 'Active Orders', value: kpis?.activeOrders || 0, icon: ShoppingCart, color: 'bg-green-500', change: '+8%' },
    { title: 'Total Revenue', value: `₹${kpis?.totalRevenue || 0}`, icon: DollarSign, color: 'bg-purple-500', change: '+15%' },
    { title: 'Menu Items', value: kpis?.menuItems || 0, icon: Package, color: 'bg-orange-500', change: '+5%' }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <p className="text-gray-600">Overview of your food delivery database</p>
            </div>
            {isDemoMode && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
                Demo Mode
              </span>
            )}
          </div>
        </motion.div>
        
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpiCards.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <motion.div
                key={kpi.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${kpi.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium mb-1">{kpi.title}</h3>
                <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
              </motion.div>
            );
          })}
        </div>
        
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          
          {/* Orders Trend Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={charts?.ordersTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  stroke="#374151" 
                  style={{ fontSize: '12px', fill: '#374151' }} 
                  tick={{ fill: '#374151' }}
                />
                <YAxis 
                  stroke="#374151" 
                  style={{ fontSize: '12px', fill: '#374151' }} 
                  tick={{ fill: '#374151' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#111827'
                  }}
                  labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                  itemStyle={{ color: '#374151' }}
                />
                <Line type="monotone" dataKey="orders" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
          
          {/* Revenue by City Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by City</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={charts?.revenueByCity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="city" 
                  stroke="#374151" 
                  style={{ fontSize: '12px', fill: '#374151' }} 
                  tick={{ fill: '#374151' }}
                />
                <YAxis 
                  stroke="#374151" 
                  style={{ fontSize: '12px', fill: '#374151' }} 
                  tick={{ fill: '#374151' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                    color: '#111827'
                  }}
                  labelStyle={{ color: '#111827', fontWeight: 'bold' }}
                  itemStyle={{ color: '#374151' }}
                />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
        
        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-gray-900">₹{kpis?.avgOrderValue || 0}</p>
            <p className="text-sm text-gray-500 mt-2">Per transaction</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Restaurants</h3>
            <p className="text-3xl font-bold text-gray-900">{kpis?.totalRestaurants || 0}</p>
            <p className="text-sm text-gray-500 mt-2">Active partners</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Delivery Partners</h3>
            <p className="text-3xl font-bold text-gray-900">{kpis?.deliveryPartners || 0}</p>
            <p className="text-sm text-gray-500 mt-2">Available now</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
