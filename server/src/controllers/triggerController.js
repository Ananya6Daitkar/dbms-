import pool from '../db/pool.js';

export async function simulatePayment(req, res) {
  try {
    const { orderId, amount, status } = req.body;
    
    if (!orderId || amount === undefined) {
      return res.status(400).json({ message: 'Order ID and amount are required' });
    }
    
    // Capture BEFORE state
    const before = {
      orderId: parseInt(orderId),
      amount: parseFloat(amount),
      status: status || null
    };
    
    // Insert payment (trigger will fire automatically)
    const insertResult = await pool.query(
      'INSERT INTO Payment (order_no, amount, status, payment_date) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING *',
      [orderId, amount, status]
    );
    
    // Capture AFTER state
    const after = {
      orderId: insertResult.rows[0].order_no,
      amount: parseFloat(insertResult.rows[0].amount),
      status: insertResult.rows[0].status
    };
    
    res.json({
      before,
      after,
      triggerFired: true
    });
  } catch (error) {
    console.error('Error simulating payment:', error);
    res.status(500).json({ message: 'Failed to simulate payment trigger' });
  }
}

export async function runCustomTrigger(req, res) {
  try {
    const { sql } = req.body;
    
    if (!sql || !sql.trim()) {
      return res.status(400).json({ error: 'SQL is required' });
    }
    
    // Smart split that respects dollar-quoted strings
    const statements = [];
    let current = '';
    let inDollarQuote = false;
    let dollarTag = '';
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      current += char;
      
      // Check for dollar quote start/end
      if (char === '$') {
        let tag = '$';
        let j = i + 1;
        while (j < sql.length && sql[j] !== '$') {
          tag += sql[j];
          j++;
        }
        if (j < sql.length) {
          tag += '$';
          
          if (!inDollarQuote) {
            inDollarQuote = true;
            dollarTag = tag;
            current += sql.substring(i + 1, j + 1);
            i = j;
          } else if (tag === dollarTag) {
            inDollarQuote = false;
            dollarTag = '';
            current += sql.substring(i + 1, j + 1);
            i = j;
          }
        }
      }
      
      // Split on semicolon only if not inside dollar quotes
      if (char === ';' && !inDollarQuote) {
        const stmt = current.slice(0, -1).trim();
        if (stmt.length > 0) {
          statements.push(stmt);
        }
        current = '';
      }
    }
    
    // Add remaining statement
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
    
    // Return the result of the last statement
    if (result && result.rows && result.rows.length > 0) {
      res.json({ 
        result: result.rows[0],
        message: 'Trigger created and executed successfully'
      });
    } else {
      res.json({ 
        result: null,
        message: 'Trigger created successfully'
      });
    }
  } catch (error) {
    console.error('Error running custom trigger:', error);
    res.status(500).json({ error: error.message || 'Failed to execute custom trigger' });
  }
}
