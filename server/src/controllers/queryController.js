import pool from '../db/pool.js';
import { getQuery } from '../services/queryService.js';

// Controller function to run a query
export async function runQuery(req, res) {
  try {
    // Get query ID from request body
    const { id } = req.body;
    
    // Validate: make sure ID was provided
    if (!id) {
      return res.status(400).json({ message: 'Query ID is required' });
    }
    
    // Get query definition (SQL, insight, etc.) from our query service
    let queryDef;
    try {
      queryDef = getQuery(id);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
    
    // Execute the SQL query against PostgreSQL
    const result = await pool.query(queryDef.sql);
    
    // Extract column names from result
    const columns = result.fields.map(field => field.name);
    
    // Get the data rows
    const rows = result.rows;
    
    // Send response with columns, rows, and insight
    res.json({
      columns,
      rows,
      insight: queryDef.insight
    });
  } catch (error) {
    console.error('Error running query:', error);
    res.status(500).json({ message: 'Failed to execute query' });
  }
}

// Controller function to run a custom SQL query
export async function runCustomQuery(req, res) {
  try {
    // Get custom SQL from request body
    const { sql } = req.body;
    
    // Validate: make sure SQL was provided
    if (!sql || sql.trim() === '') {
      return res.status(400).json({ 
        message: 'SQL query is required',
        error: 'Please enter a SQL query'
      });
    }
    
    // Clean the SQL (remove common copy-paste issues)
    const cleanedSql = sql
      .trim()
      .replace(/^[•\-\*]\s+/gm, '') // Remove bullet points
      .replace(/[\u2022\u2023\u25E6\u2043\u2219]/g, ''); // Remove various bullet characters
    
    // Basic validation - check if it looks like SQL
    if (!cleanedSql.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|DROP|ALTER|GRANT|REVOKE|BEGIN|COMMIT|ROLLBACK)/i)) {
      return res.status(400).json({ 
        message: 'Invalid SQL query',
        error: 'Query must start with a valid SQL command (SELECT, INSERT, UPDATE, DELETE, etc.)'
      });
    }
    
    // Execute the custom SQL query against PostgreSQL
    const result = await pool.query(cleanedSql);
    
    // Extract column names from result (if any)
    const columns = result.fields ? result.fields.map(field => field.name) : [];
    
    // Get the data rows (if any)
    const rows = result.rows || [];
    
    // Send response with columns, rows, and affected row count
    res.json({
      columns,
      rows,
      rowCount: result.rowCount,
      command: result.command, // SELECT, INSERT, UPDATE, DELETE, etc.
      message: result.command === 'SELECT' 
        ? `${result.rowCount} rows returned` 
        : `${result.rowCount} rows affected`
    });
  } catch (error) {
    console.error('Error running custom query:', error);
    
    // Send detailed error message to help with debugging
    res.status(500).json({ 
      message: 'Failed to execute query',
      error: error.message || 'Unknown database error'
    });
  }
}
