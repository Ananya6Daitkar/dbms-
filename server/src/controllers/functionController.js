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
