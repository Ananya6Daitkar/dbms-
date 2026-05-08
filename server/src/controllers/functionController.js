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
    
    // Improved parser for dollar-quoted strings
    const statements = [];
    let current = '';
    let i = 0;
    
    while (i < sql.length) {
      const char = sql[i];
      
      // Check if we're at a dollar sign (potential start of dollar quote)
      if (char === '$') {
        // Find the closing $ of the tag
        let tagEnd = i + 1;
        while (tagEnd < sql.length && sql[tagEnd] !== '$') {
          tagEnd++;
        }
        
        if (tagEnd < sql.length) {
          // We found a complete dollar tag
          const tag = sql.substring(i, tagEnd + 1);
          current += tag;
          i = tagEnd + 1;
          
          // Now find the matching closing tag
          const closingTag = tag;
          let foundClosing = false;
          
          while (i < sql.length && !foundClosing) {
            if (sql[i] === '$') {
              // Check if this matches our closing tag
              const potentialTag = sql.substring(i, i + closingTag.length);
              if (potentialTag === closingTag) {
                current += closingTag;
                i += closingTag.length;
                foundClosing = true;
              } else {
                current += sql[i];
                i++;
              }
            } else {
              current += sql[i];
              i++;
            }
          }
        } else {
          current += char;
          i++;
        }
      } else if (char === ';') {
        // Semicolon outside of dollar quotes - end of statement
        const stmt = current.trim();
        if (stmt.length > 0) {
          statements.push(stmt);
        }
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    // Add any remaining statement
    const lastStmt = current.trim();
    if (lastStmt.length > 0) {
      statements.push(lastStmt);
    }
    
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
