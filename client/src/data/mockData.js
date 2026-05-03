// Mock Data Module - Fallback data when backend is unavailable

export const mockKpis = {
  activeOrders: 1250,
  avgDeliveryTime: 28,
  newRestaurants: 42
};

export const mockCharts = {
  orderTrend: [
    { month: 'Jan', orders: 850 },
    { month: 'Feb', orders: 1050 },
    { month: 'Mar', orders: 1250 },
    { month: 'Apr', orders: 980 },
    { month: 'May', orders: 1150 },
    { month: 'Jun', orders: 1320 }
  ],
  revenueByRestaurant: [
    { name: 'Dominos', revenue: 45000 },
    { name: 'KFC', revenue: 38000 },
    { name: 'Pizza Hut', revenue: 35000 },
    { name: 'Burger King', revenue: 28000 },
    { name: 'Subway', revenue: 22000 },
    { name: 'McDonalds', revenue: 31000 }
  ]
};

export const mockQueryResults = {
  s01: {
    columns: ['customer_id', 'first_name', 'last_name', 'zip_code', 'apartment_no', 'street_name', 'city'],
    rows: [
      { customer_id: 1, first_name: 'Sam', last_name: 'Shah', zip_code: '400001', apartment_no: '12A', street_name: 'Road', city: 'Mumbai' },
      { customer_id: 2, first_name: 'Amit', last_name: 'Verma', zip_code: '400002', apartment_no: '14B', street_name: 'Link Road', city: 'Mumbai' },
      { customer_id: 3, first_name: 'Neha', last_name: 'Patel', zip_code: '400003', apartment_no: '22C', street_name: 'Hill Road', city: 'Mumbai' }
    ],
    insight: 'This query shows all registered customers in the food delivery system.'
  },
  
  s02: {
    columns: ['order_no', 'customer_id', 'order_date', 'quantity'],
    rows: [
      { order_no: 1, customer_id: 1, order_date: '2026-02-20', quantity: 2 },
      { order_no: 2, customer_id: 2, order_date: '2026-02-21', quantity: 1 },
      { order_no: 3, customer_id: 3, order_date: '2026-02-21', quantity: 3 }
    ],
    insight: 'Complete list of all orders placed in the system.'
  },
  
  s03: {
    columns: ['item_name', 'price'],
    rows: [
      { item_name: 'Margherita Pizza', price: '299.00' },
      { item_name: 'Chicken Bucket', price: '499.00' },
      { item_name: 'Veg Supreme Pizza', price: '399.00' },
      { item_name: 'Whopper Burger', price: '249.00' }
    ],
    insight: 'Quick view of all available menu items with pricing information.'
  },
  
  s04: {
    columns: ['customer_id', 'first_name', 'last_name', 'city'],
    rows: [
      { customer_id: 2, first_name: 'Amit', last_name: 'Verma', city: 'Mumbai' },
      { customer_id: 7, first_name: 'Anjali', last_name: 'Desai', city: 'Mumbai' }
    ],
    insight: 'Shows all customers with names starting with A.'
  },
  
  s05: {
    columns: ['customer_id', 'first_name', 'last_name', 'city'],
    rows: [
      { customer_id: 1, first_name: 'Sam', last_name: 'Shah', city: 'Mumbai' },
      { customer_id: 2, first_name: 'Amit', last_name: 'Verma', city: 'Mumbai' },
      { customer_id: 3, first_name: 'Neha', last_name: 'Patel', city: 'Mumbai' }
    ],
    insight: 'Customers from cities beginning with M.'
  },
  
  s06: {
    columns: ['customer_id', 'first_name', 'last_name', 'city'],
    rows: [
      { customer_id: 2, first_name: 'Amit', last_name: 'Verma', city: 'Mumbai' },
      { customer_id: 7, first_name: 'Anjali', last_name: 'Desai', city: 'Mumbai' },
      { customer_id: 3, first_name: 'Neha', last_name: 'Patel', city: 'Mumbai' },
      { customer_id: 1, first_name: 'Sam', last_name: 'Shah', city: 'Mumbai' }
    ],
    insight: 'All Mumbai-based customers in alphabetical order.'
  },
  
  s07: {
    columns: ['restaurant_id', 'restaurant_name', 'state', 'city'],
    rows: [
      { restaurant_id: 1, restaurant_name: 'Dominos', state: 'Maharashtra', city: 'Mumbai' },
      { restaurant_id: 4, restaurant_name: 'Burger King', state: 'Maharashtra', city: 'Pune' }
    ],
    insight: 'Restaurants operating in Maharashtra state.'
  },
  
  s08: {
    columns: ['order_no', 'customer_id', 'order_date', 'quantity'],
    rows: [
      { order_no: 1, customer_id: 1, order_date: '2026-02-20', quantity: 2 },
      { order_no: 2, customer_id: 2, order_date: '2026-02-21', quantity: 1 }
    ],
    insight: 'All orders placed in the month of February.'
  },
  
  s09: {
    columns: ['total_orders'],
    rows: [{ total_orders: 50 }],
    insight: 'Total number of orders placed.'
  },
  
  s10: {
    columns: ['avg_price'],
    rows: [{ avg_price: '249.50' }],
    insight: 'Average price of all menu items.'
  },
  
  c01: {
    columns: ['item_name'],
    rows: [{ item_name: 'Margherita Pizza' }],
    insight: 'The menu item with the highest number of customer ratings.'
  },
  
  c02: {
    columns: ['restaurant_name', 'avg_price'],
    rows: [
      { restaurant_name: 'KFC', avg_price: '349.00' },
      { restaurant_name: 'Pizza Hut', avg_price: '399.00' }
    ],
    insight: 'Restaurants with premium pricing (average item price over ₹300).'
  },
  
  c03: {
    columns: ['customer_id', 'first_name', 'last_name', 'city'],
    rows: [
      { customer_id: 15, first_name: 'Kavya', last_name: 'Sharma', city: 'Mumbai' },
      { customer_id: 20, first_name: 'Nikhil', last_name: 'Agarwal', city: 'Pune' }
    ],
    insight: 'Customers registered but have never placed an order.'
  },
  
  c04: {
    columns: ['restaurant_id', 'item_name', 'price'],
    rows: [
      { restaurant_id: 1, item_name: 'Pepperoni Pizza', price: '399.00' },
      { restaurant_id: 2, item_name: 'Chicken Bucket', price: '499.00' },
      { restaurant_id: 3, item_name: 'Chicken Supreme Pizza', price: '449.00' }
    ],
    insight: 'The most expensive menu item at each restaurant.'
  },
  
  c05: {
    columns: ['first_name', 'last_name', 'total_spent'],
    rows: [
      { first_name: 'Sam', last_name: 'Shah', total_spent: '1250.00' },
      { first_name: 'Amit', last_name: 'Verma', total_spent: '850.00' },
      { first_name: 'Neha', last_name: 'Patel', total_spent: '1100.00' }
    ],
    insight: 'Total amount spent by each customer who has placed orders.'
  }
};

export const mockEntities = {
  customer: {
    columns: ['customer_id', 'first_name', 'last_name', 'zip_code', 'apartment_no', 'street_name', 'city'],
    rows: [
      { customer_id: 1, first_name: 'Sam', last_name: 'Shah', zip_code: '400001', apartment_no: '12A', street_name: 'Road', city: 'Mumbai' },
      { customer_id: 2, first_name: 'Amit', last_name: 'Verma', zip_code: '400002', apartment_no: '14B', street_name: 'Link Road', city: 'Mumbai' },
      { customer_id: 3, first_name: 'Neha', last_name: 'Patel', zip_code: '400003', apartment_no: '22C', street_name: 'Hill Road', city: 'Mumbai' }
    ],
    total: 3
  },
  
  restaurant: {
    columns: ['restaurant_id', 'restaurant_name', 'street_name', 'state', 'city', 'zip_code'],
    rows: [
      { restaurant_id: 1, restaurant_name: 'Dominos', street_name: 'Main Street', state: 'Maharashtra', city: 'Mumbai', zip_code: '400002' },
      { restaurant_id: 2, restaurant_name: 'KFC', street_name: 'Park Street', state: 'West Bengal', city: 'Kolkata', zip_code: '700016' }
    ],
    total: 2
  },
  
  orders: {
    columns: ['order_no', 'customer_id', 'order_date', 'quantity'],
    rows: [
      { order_no: 1, customer_id: 1, order_date: '2026-02-20', quantity: 2 },
      { order_no: 2, customer_id: 2, order_date: '2026-02-21', quantity: 1 }
    ],
    total: 2
  },
  
  menu_item: {
    columns: ['item_id', 'restaurant_id', 'item_name', 'category', 'price', 'availability'],
    rows: [
      { item_id: 1, restaurant_id: 1, item_name: 'Margherita Pizza', category: 'Veg', price: '299.00', availability: true },
      { item_id: 2, restaurant_id: 2, item_name: 'Chicken Bucket', category: 'Non-Veg', price: '499.00', availability: true }
    ],
    total: 2
  },
  
  delivery_partner: {
    columns: ['partner_id', 'partner_name', 'location'],
    rows: [
      { partner_id: 1, partner_name: 'Rahul', location: 'Andheri' },
      { partner_id: 2, partner_name: 'Vikas', location: 'Pune' }
    ],
    total: 2
  },
  
  delivers: {
    columns: ['order_no', 'partner_id'],
    rows: [
      { order_no: 1, partner_id: 1 },
      { order_no: 2, partner_id: 2 }
    ],
    total: 2
  },
  
  payment: {
    columns: ['payment_id', 'order_no', 'amount', 'status', 'payment_date'],
    rows: [
      { payment_id: 1, order_no: 1, amount: '598.00', status: 'Paid', payment_date: '2026-02-20' },
      { payment_id: 2, order_no: 2, amount: '199.00', status: 'Paid', payment_date: '2026-02-21' }
    ],
    total: 2
  },
  
  ratings: {
    columns: ['rating_id', 'item_id', 'rating_date', 'comment'],
    rows: [
      { rating_id: 1, item_id: 1, rating_date: '2026-02-21', comment: 'Very good taste' },
      { rating_id: 2, item_id: 2, rating_date: '2026-02-22', comment: 'Excellent chicken!' }
    ],
    total: 2
  }
};

export const mockFunctions = {
  get_total_orders: { result: 5 },
  total_revenue: { result: 25000 },
  avg_menu_price: { result: 249.50 }
};

export const mockTrigger = {
  before: { orderId: 1, amount: 0, status: null },
  after: { orderId: 1, amount: 0, status: 'Invalid' },
  triggerFired: true
};
