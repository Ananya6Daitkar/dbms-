import pool from '../db/pool.js';

// Get KPI (Key Performance Indicator) numbers for dashboard
export async function getKpis(req, res) {
  try {
    // Query 1: Count total orders
    const activeOrdersResult = await pool.query(
      'SELECT COUNT(*) as count FROM Orders'
    );
    
    // Query 2: Calculate average delivery time
    // This calculates hours between order_date and payment_date, then converts to minutes
    const avgDeliveryTimeResult = await pool.query(
      'SELECT AVG(EXTRACT(EPOCH FROM (payment_date - order_date))/3600) as avg_hours FROM Orders o JOIN Payment p ON o.order_no = p.order_no'
    );
    
    // Query 3: Count total restaurants
    const newRestaurantsResult = await pool.query(
      'SELECT COUNT(*) as count FROM Restaurant'
    );
    
    // Extract values from query results
    const activeOrders = parseInt(activeOrdersResult.rows[0].count);
    const avgDeliveryTime = Math.round(parseFloat(avgDeliveryTimeResult.rows[0].avg_hours || 28) * 60); // Convert hours to minutes
    const newRestaurants = parseInt(newRestaurantsResult.rows[0].count);
    
    // Send response
    res.json({
      activeOrders,
      avgDeliveryTime,
      newRestaurants
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ message: 'Failed to fetch KPIs' });
  }
}

// Get chart data for dashboard
export async function getCharts(req, res) {
  try {
    // Query 1: Get order count by month
    const orderTrendResult = await pool.query(`
      SELECT 
        TO_CHAR(order_date, 'Mon') as month,  -- Format date as "Jan", "Feb", etc.
        COUNT(*) as orders                     -- Count orders per month
      FROM Orders
      GROUP BY TO_CHAR(order_date, 'Mon'), EXTRACT(MONTH FROM order_date)
      ORDER BY EXTRACT(MONTH FROM order_date)
    `);
    
    // Query 2: Get revenue by restaurant (top 10)
    const revenueByRestaurantResult = await pool.query(`
      SELECT 
        r.restaurant_name as name,
        COALESCE(SUM(p.amount), 0) as revenue  -- Sum payment amounts, default to 0 if null
      FROM Restaurant r
      LEFT JOIN Menu_Item m ON r.restaurant_id = m.restaurant_id
      LEFT JOIN Orders o ON o.order_no IN (
        SELECT order_no FROM Payment WHERE order_no = o.order_no
      )
      LEFT JOIN Payment p ON o.order_no = p.order_no
      GROUP BY r.restaurant_name
      ORDER BY revenue DESC
      LIMIT 10  -- Only top 10 restaurants
    `);
    
    // Send response with both chart datasets
    res.json({
      orderTrend: orderTrendResult.rows,
      revenueByRestaurant: revenueByRestaurantResult.rows
    });
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
}
