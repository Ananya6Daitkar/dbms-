import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import ResultTable from '../components/ui/ResultTable';
import useDebounce from '../hooks/useDebounce';
import { entityApi } from '../services/api';

const entities = [
  { name: 'customer', label: 'Customer' },
  { name: 'restaurant', label: 'Restaurant' },
  { name: 'orders', label: 'Orders' },
  { name: 'menu_item', label: 'Menu Item' },
  { name: 'delivery_partner', label: 'Delivery Partner' },
  { name: 'delivers', label: 'Delivers' },
  { name: 'payment', label: 'Payment' },
  { name: 'ratings', label: 'Ratings' }
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
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold neon-text">ENTITY DATA BROWSER</h1>
            {isDemoMode && (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                Demo Mode
              </span>
            )}
          </div>
          
          {/* Entity Tabs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {entities.map(entity => (
              <button
                key={entity.name}
                onClick={() => setSelectedEntity(entity.name)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedEntity === entity.name
                    ? 'bg-neon-blue/20 text-neon-blue'
                    : 'bg-white/5 text-gray-400 hover:text-neon-blue'
                }`}
              >
                {entity.label}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-10 pr-4 py-3 bg-space-dark border border-gray-700 rounded-lg focus:border-neon-blue outline-none"
            />
          </div>
          
          {data && (
            <p className="text-sm text-gray-400 mt-2">
              Total records: {data.total} | Showing: {filteredRows.length}
            </p>
          )}
        </motion.div>
        
        {data && (
          <ResultTable
            columns={data.columns}
            rows={filteredRows}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
}
