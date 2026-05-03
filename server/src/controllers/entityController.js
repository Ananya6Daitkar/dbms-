import pool from '../db/pool.js';

// Map entity names to table names
const entityTableMap = {
  'customer': 'Customer',
  'restaurant': 'Restaurant',
  'orders': 'Orders',
  'menu_item': 'Menu_Item',
  'delivery_partner': 'Delivery_Partner',
  'delivers': 'Delivers',
  'payment': 'Payment',
  'ratings': 'Ratings'
};

export async function getEntity(req, res) {
  try {
    const { name } = req.params;
    const tableName = entityTableMap[name.toLowerCase()];
    
    if (!tableName) {
      return res.status(400).json({ message: 'Unknown entity name' });
    }
    
    // Execute query
    const result = await pool.query(`SELECT * FROM ${tableName}`);
    
    // Extract column names
    const columns = result.fields.map(field => field.name);
    
    // Format rows
    const rows = result.rows;
    
    res.json({
      columns,
      rows,
      total: rows.length
    });
  } catch (error) {
    console.error('Error fetching entity:', error);
    res.status(500).json({ message: 'Failed to fetch entity data' });
  }
}
