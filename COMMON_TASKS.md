# Common Tasks - Simple Examples

This guide shows you how to do common tasks in the application with simple, step-by-step examples.

---

## 📝 Table of Contents

1. [Adding a New Query](#adding-a-new-query)
2. [Adding a New Page](#adding-a-new-page)
3. [Adding a New API Endpoint](#adding-a-new-api-endpoint)
4. [Changing Colors/Theme](#changing-colorstheme)
5. [Adding a New Database Table](#adding-a-new-database-table)
6. [Debugging Common Errors](#debugging-common-errors)

---

## 1. Adding a New Query

### Step 1: Add query to server query service

**File**: `server/src/services/queryService.js`

```javascript
const queries = {
  // ... existing queries ...
  
  // Add your new query here
  s11: {
    id: 's11',
    title: 'Orders Above 500',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT * FROM Orders WHERE quantity > 500',
    entities: ['Orders'],
    explanation: 'Shows all orders with quantity greater than 500.',
    insight: 'Orders with high quantities.'
  }
};
```

### Step 2: Add query to client query service

**File**: `client/src/services/queryService.js`

```javascript
const queries = [
  // ... existing queries ...
  
  // Add the same query here
  {
    id: 's11',
    title: 'Orders Above 500',
    category: 'Simple',
    difficulty: 'Easy',
    sql: 'SELECT * FROM Orders WHERE quantity > 500',
    entities: ['Orders'],
    explanation: 'Shows all orders with quantity greater than 500.',
    insight: 'Orders with high quantities.'
  }
];
```

### Step 3: Test it!

1. Restart the server: `npm run dev`
2. Go to Query Lab page
3. Your new query should appear in the list
4. Click it and run it!

---

## 2. Adding a New Page

### Step 1: Create the page component

**File**: `client/src/pages/MyNewPage.jsx`

```javascript
import React from 'react';
import { motion } from 'framer-motion';

export default function MyNewPage() {
  return (
    <div className="min-h-screen pt-20 px-4 pb-12">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold neon-text mb-4">
            MY NEW PAGE
          </h1>
          <p className="text-gray-400">
            This is my new page content!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
```

### Step 2: Add route to App.jsx

**File**: `client/src/App.jsx`

```javascript
// Import your new page
import MyNewPage from './pages/MyNewPage';

// ... inside the Routes component ...
<Routes>
  <Route path="/" element={<LandingPage />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/query-lab" element={<QueryLab />} />
  
  {/* Add your new route here */}
  <Route path="/my-new-page" element={<MyNewPage />} />
  
  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>
```

### Step 3: Add link to Navbar

**File**: `client/src/components/layout/Navbar.jsx`

```javascript
// Add to the navigation links
<Link
  to="/my-new-page"
  className="hover:text-neon-green transition-colors"
>
  My New Page
</Link>
```

### Step 4: Test it!

1. Restart frontend: `npm run dev`
2. Go to http://localhost:5173/my-new-page
3. Your new page should appear!

---

## 3. Adding a New API Endpoint

### Step 1: Create a controller function

**File**: `server/src/controllers/myController.js`

```javascript
import pool from '../db/pool.js';

// Controller function to get top customers
export async function getTopCustomers(req, res) {
  try {
    // Run SQL query
    const result = await pool.query(`
      SELECT c.first_name, c.last_name, COUNT(o.order_no) as order_count
      FROM Customer c
      JOIN Orders o ON c.customer_id = o.customer_id
      GROUP BY c.customer_id, c.first_name, c.last_name
      ORDER BY order_count DESC
      LIMIT 10
    `);
    
    // Send response
    res.json({
      customers: result.rows
    });
  } catch (error) {
    console.error('Error fetching top customers:', error);
    res.status(500).json({ message: 'Failed to fetch top customers' });
  }
}
```

### Step 2: Create a route file

**File**: `server/src/routes/myRoutes.js`

```javascript
import express from 'express';
import { getTopCustomers } from '../controllers/myController.js';

const router = express.Router();

// Define route
router.get('/top-customers', getTopCustomers);

export default router;
```

### Step 3: Add route to server

**File**: `server/src/index.js`

```javascript
// Import your routes
import myRoutes from './routes/myRoutes.js';

// Add to routes section
app.use('/api/my', myRoutes);
```

### Step 4: Call from frontend

**File**: `client/src/services/api.js`

```javascript
// Add new API function
export const myApi = {
  getTopCustomers: () => api.get('/my/top-customers')
};
```

### Step 5: Use in a component

```javascript
import { myApi } from '../services/api';

// Inside your component
const [customers, setCustomers] = useState([]);

useEffect(() => {
  async function fetchData() {
    const data = await myApi.getTopCustomers();
    setCustomers(data.customers);
  }
  fetchData();
}, []);
```

---

## 4. Changing Colors/Theme

### Change Primary Color (Neon Green)

**File**: `client/tailwind.config.js`

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'neon-green': '#00ff88',  // Change this to your color
        // Example: '#ff0088' for pink
      }
    }
  }
}
```

### Change Background Color

**File**: `client/src/index.css`

```css
:root {
  --space-dark: #0a0a0f;  /* Change this */
  /* Example: #1a1a2e for dark blue */
}
```

### Change Text Colors

**File**: Any component file

```javascript
// Change from green to blue
<h1 className="text-neon-green">  // Old
<h1 className="text-blue-500">    // New

// Change from purple to red
<span className="text-neon-purple">  // Old
<span className="text-red-500">      // New
```

### Available Tailwind Colors

```javascript
// Basic colors
text-red-500
text-blue-500
text-green-500
text-yellow-500
text-purple-500
text-pink-500
text-gray-500

// Background colors
bg-red-500
bg-blue-500
bg-green-500

// Border colors
border-red-500
border-blue-500
```

---

## 5. Adding a New Database Table

### Step 1: Add table to schema

**File**: `database/schema.sql`

```sql
-- Add at the end of the file
CREATE TABLE IF NOT EXISTS Feedback (
  feedback_id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES Customer(customer_id),
  message TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: Add sample data

**File**: `database/seed.sql`

```sql
-- Add at the end of the file
INSERT INTO Feedback (customer_id, message, rating) VALUES
(1, 'Great service!', 5),
(2, 'Food was cold', 2),
(3, 'Fast delivery', 4);
```

### Step 3: Recreate database

```bash
# Drop and recreate database
dropdb food_delivery_db
createdb food_delivery_db

# Run schema and seed
psql -d food_delivery_db -f database/schema.sql
psql -d food_delivery_db -f database/seed.sql
```

### Step 4: Add to Entity Browser

**File**: `client/src/pages/EntityBrowser.jsx`

```javascript
const entities = [
  // ... existing entities ...
  { name: 'Feedback', label: 'Feedback', icon: MessageSquare }
];
```

---

## 6. Debugging Common Errors

### Error: "Cannot find module"

**Problem**: Missing dependency

**Solution**:
```bash
# Install missing package
npm install package-name

# Or reinstall all packages
rm -rf node_modules
npm install
```

### Error: "Port already in use"

**Problem**: Port 5173 or 5001 is already being used

**Solution**:
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### Error: "Database connection failed"

**Problem**: PostgreSQL not running or wrong credentials

**Solution**:
```bash
# Check if PostgreSQL is running
pg_isready

# If not running, start it
brew services start postgresql  # macOS
sudo service postgresql start   # Linux

# Check .env file has correct credentials
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery_db
```

### Error: "React component not updating"

**Problem**: State not updating correctly

**Solution**:
```javascript
// Wrong - mutating state directly
data.push(newItem);
setData(data);

// Correct - create new array
setData([...data, newItem]);
```

### Error: "CORS error"

**Problem**: Frontend can't call backend

**Solution**:
```javascript
// Check server/src/index.js has correct CORS setup
app.use(cors({
  origin: 'http://localhost:5173',  // Must match frontend URL
  credentials: true
}));
```

### Error: "SQL syntax error"

**Problem**: Invalid SQL query

**Solution**:
```sql
-- Test query in psql first
psql -d food_delivery_db

-- Run your query
SELECT * FROM Customer;

-- If it works in psql, copy to code
```

---

## 🎨 Styling Tips

### Make a Card Component

```javascript
<div className="glass-panel p-6">
  <h3 className="text-xl font-bold text-neon-green mb-4">
    Card Title
  </h3>
  <p className="text-gray-400">
    Card content goes here
  </p>
</div>
```

### Add Hover Effect

```javascript
<motion.div
  whileHover={{ scale: 1.05 }}  // Grow 5% on hover
  className="cursor-pointer"
>
  Hover me!
</motion.div>
```

### Add Fade In Animation

```javascript
<motion.div
  initial={{ opacity: 0, y: 20 }}  // Start invisible, 20px down
  animate={{ opacity: 1, y: 0 }}   // Fade in and move up
  transition={{ duration: 0.5 }}   // Animation takes 0.5 seconds
>
  Content
</motion.div>
```

### Center Content

```javascript
<div className="flex items-center justify-center min-h-screen">
  <div>Centered content</div>
</div>
```

### Responsive Grid

```javascript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

---

## 🔧 Useful Code Snippets

### Fetch Data on Component Load

```javascript
const [data, setData] = useState(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  async function fetchData() {
    setIsLoading(true);
    const result = await api.getData();
    setData(result);
    setIsLoading(false);
  }
  fetchData();
}, []);
```

### Handle Form Submit

```javascript
const [formData, setFormData] = useState({ name: '', email: '' });

const handleSubmit = async (e) => {
  e.preventDefault();  // Prevent page reload
  
  // Send data to backend
  const result = await api.submitForm(formData);
  
  // Reset form
  setFormData({ name: '', email: '' });
};

return (
  <form onSubmit={handleSubmit}>
    <input
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    />
    <button type="submit">Submit</button>
  </form>
);
```

### Filter Array

```javascript
const [items, setItems] = useState([...]);
const [filter, setFilter] = useState('');

const filteredItems = items.filter(item =>
  item.name.toLowerCase().includes(filter.toLowerCase())
);

return (
  <>
    <input
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      placeholder="Search..."
    />
    {filteredItems.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </>
);
```

### Show Loading State

```javascript
{isLoading ? (
  <div>Loading...</div>
) : (
  <div>Data: {data}</div>
)}
```

### Conditional Rendering

```javascript
{showDetails && (
  <div>Details panel</div>
)}

{error ? (
  <div>Error: {error}</div>
) : (
  <div>Success!</div>
)}
```

---

## 📚 Quick Reference

### React Hooks

```javascript
// State
const [value, setValue] = useState(initialValue);

// Effect (runs on mount)
useEffect(() => {
  // code here
}, []);

// Effect (runs when dependency changes)
useEffect(() => {
  // code here
}, [dependency]);
```

### Array Methods

```javascript
// Map - transform each item
array.map(item => item * 2)

// Filter - keep items that match
array.filter(item => item > 5)

// Find - get first match
array.find(item => item.id === 1)

// Some - check if any match
array.some(item => item > 5)

// Every - check if all match
array.every(item => item > 0)
```

### Object Methods

```javascript
// Copy object
const copy = { ...original }

// Merge objects
const merged = { ...obj1, ...obj2 }

// Update property
const updated = { ...obj, name: 'New Name' }

// Get keys
Object.keys(obj)  // ['key1', 'key2']

// Get values
Object.values(obj)  // ['value1', 'value2']
```

### String Methods

```javascript
// Uppercase
str.toUpperCase()

// Lowercase
str.toLowerCase()

// Check if includes
str.includes('search')

// Split
str.split(',')  // ['a', 'b', 'c']

// Replace
str.replace('old', 'new')

// Trim whitespace
str.trim()
```

---

## 🎓 Best Practices

### 1. Always use meaningful variable names

```javascript
// Bad
const x = await api.get();

// Good
const customers = await api.getCustomers();
```

### 2. Add comments for complex logic

```javascript
// Calculate average delivery time in minutes
const avgTime = Math.round(hours * 60);
```

### 3. Handle errors

```javascript
try {
  const data = await api.getData();
  setData(data);
} catch (error) {
  console.error('Error:', error);
  setError('Failed to load data');
}
```

### 4. Use loading states

```javascript
const [isLoading, setIsLoading] = useState(false);

// Show loading indicator while fetching
{isLoading && <div>Loading...</div>}
```

### 5. Keep components small

```javascript
// Instead of one huge component, break into smaller ones
<Dashboard>
  <KPISection />
  <ChartsSection />
  <TableSection />
</Dashboard>
```

---

## 🚀 Performance Tips

### 1. Use React.memo for expensive components

```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  // Component only re-renders if data changes
  return <div>{data}</div>;
});
```

### 2. Debounce search input

```javascript
import { useDebounce } from '../hooks/useDebounce';

const [search, setSearch] = useState('');
const debouncedSearch = useDebounce(search, 500);  // Wait 500ms

useEffect(() => {
  // Only search after user stops typing
  searchData(debouncedSearch);
}, [debouncedSearch]);
```

### 3. Limit database results

```sql
-- Add LIMIT to queries
SELECT * FROM Customer LIMIT 100;
```

---

This guide should help you understand and modify the code easily! 🎉
