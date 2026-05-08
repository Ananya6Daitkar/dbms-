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
