// Client-side query service - mirrors server query definitions

const queries = [
  {
    id: 's01',
    title: 'All Customers',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT * FROM Customer',
    entities: ['Customer'],
    explanation: 'Returns every row from the Customer table, displaying all customer information including names, addresses, and cities.',
    insight: 'This query shows all registered customers in the food delivery system.'
  },
  {
    id: 's02',
    title: 'All Orders',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT * FROM Orders',
    entities: ['Orders'],
    explanation: 'Retrieves all order records with order numbers, customer IDs, dates, and quantities.',
    insight: 'Complete list of all orders placed in the system.'
  },
  {
    id: 's03',
    title: 'Menu Item Prices',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT item_name, price FROM Menu_Item',
    entities: ['Menu_Item'],
    explanation: 'Displays item names and their prices from the menu.',
    insight: 'Quick view of all available menu items with pricing information.'
  },
  {
    id: 's04',
    title: 'Customers Starting with A',
    category: 'Simple',
    difficulty: 'Easy',
    sql: "SELECT * FROM Customer WHERE first_name LIKE 'A%'",
    entities: ['Customer'],
    explanation: 'Filters customers whose first name begins with the letter A using pattern matching.',
    insight: 'Shows all customers with names starting with A.'
  },
  {
    id: 's05',
    title: 'Customers in Cities Starting with M',
    category: 'Simple',
    difficulty: 'Easy',
    sql: "SELECT * FROM Customer WHERE city LIKE 'M%'",
    entities: ['Customer'],
    explanation: 'Finds customers living in cities that start with M (like Mumbai).',
    insight: 'Customers from cities beginning with M.'
  },
  {
    id: 's06',
    title: 'Mumbai Customers Sorted',
    category: 'Simple',
    difficulty: 'Easy',
    sql: "SELECT * FROM Customer WHERE city='Mumbai' ORDER BY first_name",
    entities: ['Customer'],
    explanation: 'Retrieves all Mumbai customers and sorts them alphabetically by first name.',
    insight: 'All Mumbai-based customers in alphabetical order.'
  },
  {
    id: 's07',
    title: 'Maharashtra Restaurants',
    category: 'Simple',
    difficulty: 'Easy',
    sql: "SELECT * FROM Restaurant WHERE state='Maharashtra'",
    entities: ['Restaurant'],
    explanation: 'Lists all restaurants located in the state of Maharashtra.',
    insight: 'Restaurants operating in Maharashtra state.'
  },
  {
    id: 's08',
    title: 'February Orders',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT * FROM Orders WHERE EXTRACT(MONTH FROM order_date)=2',
    entities: ['Orders'],
    explanation: 'Extracts orders placed during February by checking the month component of the order date.',
    insight: 'All orders placed in the month of February.'
  },
  {
    id: 's09',
    title: 'Order Count',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT COUNT(*) as total_orders FROM Orders',
    entities: ['Orders'],
    explanation: 'Counts the total number of orders in the system using the COUNT aggregate function.',
    insight: 'Total number of orders placed.'
  },
  {
    id: 's10',
    title: 'Average Menu Price',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT AVG(price) as avg_price FROM Menu_Item',
    entities: ['Menu_Item'],
    explanation: 'Calculates the average price across all menu items using the AVG aggregate function.',
    insight: 'Average price of all menu items.'
  },
  {
    id: 'c01',
    title: 'Most Popular Item',
    category: 'Complex',
    difficulty: 'Hard',
    sql: `SELECT item_name FROM Menu_Item WHERE item_id = (SELECT item_id FROM Ratings GROUP BY item_id ORDER BY COUNT(*) DESC LIMIT 1)`,
    entities: ['Menu_Item', 'Ratings'],
    explanation: 'Uses a subquery to find the item with the most ratings, then retrieves its name.',
    insight: 'The menu item with the highest number of customer ratings.'
  },
  {
    id: 'c02',
    title: 'Restaurants with Avg Price > 300',
    category: 'Complex',
    difficulty: 'Medium',
    sql: `SELECT r.restaurant_name, AVG(m.price) as avg_price FROM Restaurant r JOIN Menu_Item m ON r.restaurant_id = m.restaurant_id GROUP BY r.restaurant_name HAVING AVG(m.price) > 300`,
    entities: ['Restaurant', 'Menu_Item'],
    explanation: 'Joins restaurants with their menu items, groups by restaurant, calculates average price, and filters using HAVING clause.',
    insight: 'Restaurants with premium pricing (average item price over ₹300).'
  },
  {
    id: 'c03',
    title: 'Customers Who Never Ordered',
    category: 'Complex',
    difficulty: 'Hard',
    sql: `SELECT * FROM Customer c WHERE NOT EXISTS (SELECT 1 FROM Orders o WHERE o.customer_id = c.customer_id)`,
    entities: ['Customer', 'Orders'],
    explanation: 'Uses NOT EXISTS to find customers with no matching orders.',
    insight: 'Customers registered but have never placed an order.'
  },
  {
    id: 'c04',
    title: 'Highest Priced Item per Restaurant',
    category: 'Complex',
    difficulty: 'Hard',
    sql: `SELECT restaurant_id, item_name, price FROM Menu_Item m1 WHERE price = (SELECT MAX(price) FROM Menu_Item m2 WHERE m1.restaurant_id = m2.restaurant_id)`,
    entities: ['Menu_Item'],
    explanation: 'Correlated subquery that finds the maximum price for each restaurant.',
    insight: 'The most expensive menu item at each restaurant.'
  },
  {
    id: 'c05',
    title: 'Total Spending per Customer',
    category: 'Complex',
    difficulty: 'Medium',
    sql: `SELECT c.first_name, SUM(p.amount) FROM Customer c JOIN Orders o ON c.customer_id=o.customer_id JOIN Payment p ON o.order_no=p.order_no GROUP BY c.first_name`,
    entities: ['Customer', 'Orders', 'Payment'],
    explanation: 'Joins three tables to calculate total spending per customer using SUM and GROUP BY.',
    insight: 'Total amount spent by each customer who has placed orders.'
  }
];

export function getAllQueries() {
  return queries;
}

export function getQuery(id) {
  return queries.find(q => q.id === id);
}
