import pool from '../db/pool.js';

// Map function names to SQL calls
const functionMap = {
  'get_total_orders': (params) => `SELECT get_total_orders(${params.customerId})`,
  'total_revenue': () => 'SELECT total_revenue()',
  'avg_menu_price': () => 'SELECT avg_menu_price()'
};

export async function runFunction(req, res) {
  try {
    const { functionName, params = {} } = req.body;
    
    if (!functionName) {
      return res.status(400).json({ message: 'Function name is required' });
    }
    
    const sqlGenerator = functionMap[functionName];
    
    if (!sqlGenerator) {
      return res.status(400).json({ message: 'Unknown function name' });
    }
    
    // Generate SQL and execute
    const sql = sqlGenerator(params);
    const result = await pool.query(sql);
    
    // Extract result value
    const resultValue = result.rows[0][Object.keys(result.rows[0])[0]];
    
    res.json({
      result: resultValue
    });
  } catch (error) {
    console.error('Error running function:', error);
    res.status(500).json({ message: 'Failed to execute function' });
  }
}

export async function runCustomFunction(req, res) {
  try {
    const { sql } = req.body;
    
    if (!sql || !sql.trim()) {
      return res.status(400).json({ error: 'SQL is required' });
    }
    
    // Split SQL into statements
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
    
    if (statements.length === 0) {
      return res.status(400).json({ error: 'No valid SQL statements provided' });
    }
    
    let result;
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      result = await pool.query(statement);
    }
    
    // Return the result of the last statement (usually the SELECT)
    if (result && result.rows && result.rows.length > 0) {
      const resultValue = result.rows[0][Object.keys(result.rows[0])[0]];
      res.json({ result: resultValue });
    } else {
      res.json({ result: 'Function created successfully' });
    }
  } catch (error) {
    console.error('Error running custom function:', error);
    res.status(500).json({ error: error.message || 'Failed to execute custom function' });
  }
}
