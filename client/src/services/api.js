import axios from 'axios';
import { mockKpis, mockCharts, mockQueryResults, mockEntities, mockFunctions, mockTrigger } from '../data/mockData.js';

// Create axios instance - this is like creating a phone to call the backend
const api = axios.create({
  baseURL: '/api',  // All API calls start with /api
  timeout: 10000,   // Wait max 10 seconds for response
  headers: {
    'Content-Type': 'application/json'  // We send/receive JSON data
  }
});

// This function returns fake data when the database is not connected
function getMockDataForUrl(url, config) {
  // Check which endpoint was called and return appropriate mock data
  
  if (url.includes('/dashboard/kpis')) {
    return mockKpis;  // Return fake KPI data
  }
  
  if (url.includes('/dashboard/charts')) {
    return mockCharts;  // Return fake chart data
  }
  
  if (url.includes('/queries/run')) {
    // Get the query ID from the request
    const queryId = config?.data ? JSON.parse(config.data).id : 's01';
    return mockQueryResults[queryId] || mockQueryResults.s01;
  }
  
  if (url.includes('/entities/')) {
    // Extract entity name from URL (e.g., /entities/customer -> customer)
    const entityName = url.split('/entities/')[1];
    return mockEntities[entityName] || mockEntities.customer;
  }
  
  if (url.includes('/functions/run')) {
    const functionName = config?.data ? JSON.parse(config.data).functionName : 'total_revenue';
    return mockFunctions[functionName] || mockFunctions.total_revenue;
  }
  
  if (url.includes('/triggers/payment')) {
    const data = config?.data ? JSON.parse(config.data) : {};
    const amount = parseFloat(data.amount || 0);
    const status = data.status || null;
    
    // Simulate trigger logic (same as database trigger)
    let afterStatus = status;
    if (amount <= 0) {
      afterStatus = 'Invalid';
    } else if (!status) {
      afterStatus = 'Pending';
    }
    
    return {
      before: { orderId: data.orderId, amount, status },
      after: { orderId: data.orderId, amount, status: afterStatus },
      triggerFired: true
    };
  }
  
  // If no match found, return default message
  return { message: 'Mock data not available for this endpoint' };
}

// Interceptor: catches all API responses
// If API call succeeds -> return the data
// If API call fails -> return mock data instead (fallback)
api.interceptors.response.use(
  // Success case: just return the data from response
  (response) => response.data,
  
  // Error case: API failed, so use mock data
  (error) => {
    console.warn('⚠️  API request failed, using mock data:', error.message);
    
    const url = error.config?.url || '';
    const mockData = getMockDataForUrl(url, error.config);
    
    // Return mock data with a flag to show it's fake data
    return Promise.resolve({ ...mockData, _isMock: true });
  }
);

// Simple API functions - each function calls one backend endpoint

// Dashboard API - get dashboard data
export const dashboardApi = {
  getKpis: () => api.get('/dashboard/kpis'),      // Get KPI numbers
  getCharts: () => api.get('/dashboard/charts')   // Get chart data
};

// Query API - run SQL queries
export const queryApi = {
  runQuery: (id) => api.post('/queries/run', { id })  // Run a query by ID
};

// Entity API - get table data
export const entityApi = {
  getEntity: (name) => api.get(`/entities/${name}`)  // Get data from a table
};

// Function API - run PL/pgSQL functions
export const functionApi = {
  runFunction: (functionName, params = {}) => api.post('/functions/run', { functionName, params })
};

// Trigger API - test payment trigger
export const triggerApi = {
  simulatePayment: (orderId, amount, status) => api.post('/triggers/payment', { orderId, amount, status })
};

export default api;
