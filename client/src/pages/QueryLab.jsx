import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Filter } from 'lucide-react';
import SyntaxHighlighter from '../components/ui/SyntaxHighlighter';
import ResultTable from '../components/ui/ResultTable';
import { queryApi } from '../services/api';
import { getAllQueries } from '../services/queryService';

// Get all 15 queries (10 simple + 5 complex)
const queries = getAllQueries();

export default function QueryLab() {
  // State variables
  const [selectedQuery, setSelectedQuery] = useState(null);  // Which query is selected
  const [result, setResult] = useState(null);                // Query result data
  const [isLoading, setIsLoading] = useState(false);         // Is query running?
  const [categoryFilter, setCategoryFilter] = useState('All'); // Filter: Simple/Complex/All
  const [difficultyFilter, setDifficultyFilter] = useState('All'); // Filter: Easy/Medium/Hard/All
  const [isDemoMode, setIsDemoMode] = useState(false);       // Using mock data?
  
  // Filter queries based on selected filters
  const filteredQueries = queries.filter(q => {
    // If category filter is not "All", check if query matches
    if (categoryFilter !== 'All' && q.category !== categoryFilter) return false;
    
    // If difficulty filter is not "All", check if query matches
    if (difficultyFilter !== 'All' && q.difficulty !== difficultyFilter) return false;
    
    return true; // Query passes all filters
  });
  
  // Function to run the selected query
  const handleRunQuery = async () => {
    if (!selectedQuery) return; // No query selected, do nothing
    
    setIsLoading(true);
    
    // Call API to run the query
    const data = await queryApi.runQuery(selectedQuery.id);
    
    // Save result and check if it's mock data
    setResult(data);
    setIsDemoMode(data._isMock);
    
    setIsLoading(false);
  };
  
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Title and Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-neon-blue mb-4">Query Lab</h1>
          
          {/* Filter Dropdowns */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-neon-blue" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-space-dark border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-neon-blue outline-none"
              >
                <option>All</option>
                <option>Simple</option>
                <option>Complex</option>
              </select>
            </div>
            
            {/* Difficulty Filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-space-dark border border-gray-700 rounded-lg px-4 py-2 text-sm focus:border-neon-blue outline-none"
            >
              <option>All</option>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </motion.div>
        
        {/* Two Column Layout: Query List (left) | Query Details (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN: Query List */}
          <div className="lg:col-span-1 space-y-4">
            {filteredQueries.map((query, index) => (
              <motion.div
                key={query.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
                onClick={() => setSelectedQuery(query)} // Select this query when clicked
                className={`glass-panel p-4 cursor-pointer transition-all hover:bg-white/5 ${
                  selectedQuery?.id === query.id ? 'ring-2 ring-neon-blue' : ''
                }`}
              >
                {/* Query Title and Difficulty Badge */}
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-200">{query.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    query.difficulty === 'Easy' ? 'bg-blue-500/20 text-blue-400' :
                    query.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {query.difficulty}
                  </span>
                </div>
                
                {/* Query Description */}
                <p className="text-sm text-gray-400">
                  {query.description || query.explanation.substring(0, 80) + '...'}
                </p>
                
                {/* Category Badge */}
                <div className="mt-2">
                  <span className="text-xs px-2 py-1 rounded bg-neon-purple/20 text-neon-purple">
                    {query.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
          
          {/* RIGHT COLUMN: Query Details & Results */}
          <div className="lg:col-span-2 space-y-6">
            {selectedQuery ? (
              <>
                {/* Query Details Panel */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="glass-panel p-6"
                >
                  {/* Query Title and Demo Mode Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-neon-blue">{selectedQuery.title}</h2>
                    {isDemoMode && (
                      <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-sm rounded-full">
                        Demo Mode
                      </span>
                    )}
                  </div>
                  
                  {/* Explanation */}
                  <p className="text-gray-400 mb-4">{selectedQuery.explanation}</p>
                  
                  {/* Entities Involved */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-400 mb-2">Entities Involved:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedQuery.entities.map(entity => (
                        <span key={entity} className="px-3 py-1 bg-neon-blue/20 text-neon-blue text-sm rounded-full">
                          {entity}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* SQL Code with Syntax Highlighting */}
                  <SyntaxHighlighter sql={selectedQuery.sql} />
                  
                  {/* Run Query Button */}
                  <button
                    onClick={handleRunQuery}
                    disabled={isLoading}
                    className="btn-neon mt-4 flex items-center gap-2"
                  >
                    <Play className="w-5 h-5" />
                    {isLoading ? 'Running...' : 'RUN QUERY'}
                  </button>
                </motion.div>
                
                {/* Query Results Panel (only show if we have results) */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Results Table */}
                    <ResultTable
                      columns={result.columns}
                      rows={result.rows}
                      isLoading={isLoading}
                    />
                    
                    {/* Insight Box */}
                    {result.insight && (
                      <div className="glass-panel p-4 mt-4">
                        <h4 className="text-sm font-semibold text-neon-purple mb-2">Insight:</h4>
                        <p className="text-gray-300">{result.insight}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </>
            ) : (
              // No query selected - show placeholder
              <div className="glass-panel p-12 text-center text-gray-400">
                Select a query from the list to view details and run it
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
