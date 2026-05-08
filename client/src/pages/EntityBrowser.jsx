import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Database, Table } from 'lucide-react';
import ResultTable from '../components/ui/ResultTable';
import useDebounce from '../hooks/useDebounce';
import { entityApi } from '../services/api';

const entities = [
  { name: 'customer', label: 'Customer', icon: '👤' },
  { name: 'restaurant', label: 'Restaurant', icon: '🏪' },
  { name: 'orders', label: 'Orders', icon: '🛒' },
  { name: 'menu_item', label: 'Menu Item', icon: '🍔' },
  { name: 'delivery_partner', label: 'Delivery Partner', icon: '🚚' },
  { name: 'delivers', label: 'Delivers', icon: '📍' },
  { name: 'payment', label: 'Payment', icon: '💳' },
  { name: 'ratings', label: 'Ratings', icon: '⭐' }
];

export default function EntityBrowser() {
  const [selectedEntity, setSelectedEntity] = useState('customer');
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    async function fetchEntity() {
      setIsLoading(true);
      const result = await entityApi.getEntity(selectedEntity);
      setData(result);
      setIsDemoMode(result._isMock);
      setIsLoading(false);
    }
    fetchEntity();
  }, [selectedEntity]);
  
  const filteredRows = data?.rows?.filter(row => {
    if (!debouncedSearch) return true;
    return Object.values(row).some(value =>
      String(value).toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }) || [];
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Database Tables</h1>
              <p className="text-gray-600">Browse and search through all database entities</p>
            </div>
            {isDemoMode && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
                Demo Mode
              </span>
            )}
          </div>
        </motion.div>
          
        {/* Entity Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {entities.map(entity => (
            <button
              key={entity.name}
              onClick={() => setSelectedEntity(entity.name)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedEntity === entity.name
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-indigo-400'
              }`}
            >
              <div className="text-2xl mb-1">{entity.icon}</div>
              <div className="text-xs font-medium">{entity.label}</div>
            </button>
          ))}
        </div>
        
        {/* Search Bar */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>
        
        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Table className="w-5 h-5" />
                {entities.find(e => e.name === selectedEntity)?.label}
              </h3>
              <span className="text-sm text-gray-600">
                {filteredRows.length} rows
              </span>
            </div>
          </div>
          <div className="p-6">
            <ResultTable
              columns={data?.columns || []}
              rows={filteredRows}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
