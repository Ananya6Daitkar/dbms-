import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Code2, AlertCircle, Database, Search, CheckCircle, Copy } from 'lucide-react';
import SyntaxHighlighter from '../components/ui/SyntaxHighlighter';
import ResultTable from '../components/ui/ResultTable';
import { queryApi } from '../services/api';
import { getAllQueries } from '../services/queryService';

const queries = getAllQueries();

export default function QueryLab() {
  const [selectedQuery, setSelectedQuery] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const [customMode, setCustomMode] = useState(false);
  const [customSql, setCustomSql] = useState('');
  const [customError, setCustomError] = useState(null);
  const [showQueryDetails, setShowQueryDetails] = useState(false);
  
  const filteredQueries = queries.filter(q => {
    if (categoryFilter !== 'All' && q.category !== categoryFilter) return false;
    return true;
  });
  
  const handleRunQuery = async () => {
    if (!selectedQuery) return;
    
    setIsLoading(true);
    setCustomError(null);
    
    const data = await queryApi.runQuery(selectedQuery.id);
    
    setResult(data);
    setIsDemoMode(data._isMock);
    
    setIsLoading(false);
  };
  
  const handleRunCustomQuery = async () => {
    if (!customSql.trim()) {
      setCustomError('Please enter a SQL query');
      return;
    }
    
    setIsLoading(true);
    setCustomError(null);
    
    try {
      const data = await queryApi.runCustomQuery(customSql);
      
      if (data.error) {
        setCustomError(data.error);
        setResult(null);
      } else {
        setResult(data);
        setIsDemoMode(data._isMock);
      }
    } catch (error) {
      setCustomError(error.message || 'Failed to execute query');
      setResult(null);
    }
    
    setIsLoading(false);
  };
  
  const handleModeSwitch = (isCustom) => {
    setCustomMode(isCustom);
    setResult(null);
    setCustomError(null);
    if (!isCustom) {
      setCustomSql('');
    } else {
      setSelectedQuery(null);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Query Lab</h1>
          <p className="text-gray-600">Execute predefined queries or write your own custom SQL</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => handleModeSwitch(false)}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
              !customMode
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
            }`}
          >
            <Database className="w-4 h-4 inline mr-2" />
            Predefined Queries
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
            Custom Query
          </button>
        </div>

        {!customMode ? (
          <>
            <div className="mb-6 flex items-center gap-3">
              <label className="text-sm font-medium text-gray-900">Filter:</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option className="text-gray-900">All</option>
                <option className="text-gray-900">Simple</option>
                <option className="text-gray-900">Complex</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {filteredQueries.map((query) => (
                <motion.div
                  key={query.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => {
                    setSelectedQuery(query);
                    setShowQueryDetails(true);
                    setResult(null);
                  }}
                  className={`bg-white rounded-xl p-5 cursor-pointer transition-all border-2 hover:shadow-lg ${
                    selectedQuery?.id === query.id
                      ? 'border-indigo-500 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 text-sm font-semibold">
                      {query.id.replace(/[^\d]/g, '')}
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      query.category === 'Simple'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {query.category}
                    </span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {query.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {query.explanation}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {query.entities.slice(0, 2).map(entity => (
                      <span key={entity} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        {entity}
                      </span>
                    ))}
                    {query.entities.length > 2 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                        +{query.entities.length - 2}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Selected Query Details & Results */}
            {selectedQuery && showQueryDetails && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedQuery.title}</h2>
                    <p className="text-gray-600">{selectedQuery.explanation}</p>
                  </div>
                  {isDemoMode && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full font-medium">
                      Demo Mode
                    </span>
                  )}
                </div>

                {/* SQL Code */}
                <div className="mb-4">
                  <SyntaxHighlighter sql={selectedQuery.sql} />
                </div>

                {/* Run Button */}
                <button
                  onClick={handleRunQuery}
                  disabled={isLoading}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  {isLoading ? 'Running...' : 'Run Query'}
                </button>
              </motion.div>
            )}
          </>
        ) : (
          /* CUSTOM QUERY MODE */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
          >
            <h2 className="text-xl font-bold text-gray-900 mb-4">Write Custom SQL Query</h2>

            {/* SQL Textarea */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                SQL Query
              </label>
              <textarea
                value={customSql}
                onChange={(e) => setCustomSql(e.target.value)}
                placeholder="Type your SQL query here..."
                className="w-full h-48 bg-white border-2 border-gray-300 rounded-lg p-4 font-mono text-sm text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
              />
            </div>

            {/* Error Message */}
            {customError && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-1">Error</p>
                  <p>{customError}</p>
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleRunCustomQuery}
              disabled={isLoading || !customSql.trim()}
              className="mt-4 px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isLoading ? 'Running...' : 'Run Query'}
            </button>
          </motion.div>
        )}

        {/* Results Section */}
        {result && !customError && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 className="font-semibold text-gray-900">Query Results</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {result.message || `${result.rowCount || result.rows?.length || 0} rows returned`}
                </p>
              </div>
              <div className="p-6">
                {/* For SELECT queries, show table */}
                {result.command === 'SELECT' || result.rows?.length > 0 ? (
                  <ResultTable
                    columns={result.columns}
                    rows={result.rows}
                    isLoading={isLoading}
                  />
                ) : (
                  /* For INSERT/UPDATE/DELETE, show success message */
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                    <p className="text-lg font-semibold text-green-900 mb-1">
                      {result.command} Successful
                    </p>
                    <p className="text-gray-700">
                      {result.message || `${result.rowCount} rows affected`}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Insight Box (for predefined queries) */}
            {result.insight && (
              <div className="mt-4 bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="font-medium text-indigo-900 mb-2">💡 Insight</h4>
                <p className="text-gray-700">{result.insight}</p>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!selectedQuery && !customMode && !result && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Query</h3>
            <p className="text-gray-600">Choose a query from the cards above to view details and run it</p>
          </div>
        )}
      </div>
    </div>
  );
}
