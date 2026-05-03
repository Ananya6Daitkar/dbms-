import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dashboardRoutes from './routes/dashboard.js';
import queryRoutes from './routes/queries.js';
import entityRoutes from './routes/entities.js';
import functionRoutes from './routes/functions.js';
import triggerRoutes from './routes/triggers.js';
import pool from './db/pool.js';

// Load environment variables from .env file
dotenv.config();

// Create Express app
const app = express();

// Get configuration from environment variables
const PORT = process.env.PORT || 5001;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

// Middleware - functions that run before our routes
app.use(cors({
  origin: CLIENT_ORIGIN,  // Allow requests from frontend
  credentials: true       // Allow cookies
}));
app.use(express.json());  // Parse JSON request bodies

// Routes - connect URL paths to route handlers
app.use('/api/dashboard', dashboardRoutes);  // Dashboard endpoints
app.use('/api/queries', queryRoutes);        // Query endpoints
app.use('/api/entities', entityRoutes);      // Entity/table endpoints
app.use('/api/functions', functionRoutes);   // PL/pgSQL function endpoints
app.use('/api/triggers', triggerRoutes);     // Trigger endpoints

// Health check endpoint - test if server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Food Delivery Query Lab API is running' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Accepting requests from ${CLIENT_ORIGIN}`);
});

// Graceful shutdown - close database connection when server stops
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server...');
  pool.end();  // Close database connection pool
  process.exit(0);
});
