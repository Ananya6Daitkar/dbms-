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
