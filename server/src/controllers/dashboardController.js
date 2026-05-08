import pool from '../db/pool.js';

// Get KPI (Key Performance Indicator) numbers for dashboard
export async function getKpis(req, res) {
  try {
    // Query 1: Count total customers
    const totalCustomersResult = await pool.query(
      'SELECT COUNT(*) as count FROM Customer'
    );
    
    // Query 2: Count active orders
    const activeOrdersResult = await pool.query(
      'SELECT COUNT(*) as count FROM Orders'
    );
    
    // Query 3: Calculate total revenue
    const totalRevenueResult = await pool.query(
      'SELECT COALESCE(SUM(amount), 0) as total FROM Payment'
    );
    
    // Query 4: Count menu items
    const menuItemsResult = await pool.query(
      'SELECT COUNT(*) as count FROM Menu_Item'
    );
    
    // Query 5: Calculate average order value
    const avgOrderValueResult = await pool.query(
      'SELECT COALESCE(AVG(amount), 0) as avg FROM Payment'
    );
    
    // Query 6: Count total restaurants
    const totalRestaurantsResult = await pool.query(
      'SELECT COUNT(*) as count FROM Restaurant'
    );
    
    // Query 7: Count delivery partners
    const deliveryPartnersResult = await pool.query(
      'SELECT COUNT(*) as count FROM Delivery_Partner'
    );
    
    // Extract values from query results
    const totalCustomers = parseInt(totalCustomersResult.rows[0].count);
    const activeOrders = parseInt(activeOrdersResult.rows[0].count);
    const totalRevenue = Math.round(parseFloat(totalRevenueResult.rows[0].total));
    const menuItems = parseInt(menuItemsResult.rows[0].count);
    const avgOrderValue = Math.round(parseFloat(avgOrderValueResult.rows[0].avg));
    const totalRestaurants = parseInt(totalRestaurantsResult.rows[0].count);
    const deliveryPartners = parseInt(deliveryPartnersResult.rows[0].count);
    
    // Send response
    res.json({
      totalCustomers,
      activeOrders,
      totalRevenue,
      menuItems,
      avgOrderValue,
      totalRestaurants,
      deliveryPartners
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ message: 'Failed to fetch KPIs' });
  }
}

// Get chart data for dashboard
export async function getCharts(req, res) {
  try {
    // Query 1: Get orders by date (last 7 days of data)
    const ordersTrendResult = await pool.query(`
      SELECT 
        TO_CHAR(order_date, 'Mon DD') as date,
        COUNT(*) as orders
      FROM Orders
      WHERE order_date IS NOT NULL
      GROUP BY order_date
      ORDER BY order_date
      LIMIT 7
    `);
    
    // Query 2: Get revenue by city
    const revenueByCityResult = await pool.query(`
      SELECT 
        c.city,
        COALESCE(SUM(p.amount), 0) as revenue
      FROM Customer c
      LEFT JOIN Orders o ON c.customer_id = o.customer_id
      LEFT JOIN Payment p ON o.order_no = p.order_no
      WHERE c.city IS NOT NULL
      GROUP BY c.city
      ORDER BY revenue DESC
      LIMIT 5
    `);
    
    // Send response with both chart datasets
    res.json({
      ordersTrend: ordersTrendResult.rows,
      revenueByCity: revenueByCityResult.rows
    });
  } catch (error) {
    console.error('Error fetching charts:', error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
}
