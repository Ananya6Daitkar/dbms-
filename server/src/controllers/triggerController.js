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
