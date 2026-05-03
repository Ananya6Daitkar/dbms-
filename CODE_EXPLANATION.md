# Code Explanation - Food Delivery Query Lab

This document explains the code in simple terms so anyone can understand how the application works.

---

## 📁 Project Structure

```
food-delivery-query-lab/
├── client/              # Frontend (React) - What users see
├── server/              # Backend (Node.js) - Handles database
├── database/            # SQL files - Database setup
└── .env                 # Configuration - Database credentials
```

---

## 🎨 Frontend (Client)

### How the Frontend Works

1. **User opens browser** → Goes to http://localhost:5173
2. **React loads** → Shows the landing page
3. **User clicks a page** → React Router changes the page (no page reload!)
4. **User clicks "Run Query"** → Frontend calls backend API
5. **Backend responds** → Frontend shows the results

### Main Frontend Files

#### `client/src/App.jsx` - Main App Component
- **What it does**: Sets up all the pages and routes
- **Simple explanation**: Like a table of contents - tells React which page to show for each URL

```javascript
// When user goes to "/" → show LandingPage
// When user goes to "/dashboard" → show Dashboard
// When user goes to "/query-lab" → show QueryLab
```

#### `client/src/pages/Dashboard.jsx` - Dashboard Page
- **What it does**: Shows KPI cards and charts
- **How it works**:
  1. When page loads, call API to get data
  2. Save data in state variables
  3. Display data in KPI cards and charts

```javascript
// State variables (like boxes to store data)
const [kpis, setKpis] = useState(null);        // Stores KPI numbers
const [charts, setCharts] = useState(null);    // Stores chart data
const [isLoading, setIsLoading] = useState(true); // Is data loading?

// When page loads, fetch data
useEffect(() => {
  fetchData();  // Get data from backend
}, []);
```

#### `client/src/pages/QueryLab.jsx` - Query Lab Page
- **What it does**: Shows 15 queries, lets user run them
- **How it works**:
  1. Show list of queries on left side
  2. When user clicks a query → show details on right side
  3. When user clicks "Run Query" → call API and show results

```javascript
// State variables
const [selectedQuery, setSelectedQuery] = useState(null);  // Which query is selected?
const [result, setResult] = useState(null);                // Query results

// When user clicks "Run Query"
const handleRunQuery = async () => {
  const data = await queryApi.runQuery(selectedQuery.id);  // Call API
  setResult(data);  // Save results
};
```

#### `client/src/services/api.js` - API Service
- **What it does**: Talks to the backend
- **Simple explanation**: Like a phone that calls the backend

```javascript
// Example: Get dashboard KPIs
dashboardApi.getKpis()  // Calls: GET /api/dashboard/kpis

// Example: Run a query
queryApi.runQuery('s01')  // Calls: POST /api/queries/run with {id: 's01'}
```

**Mock Data Fallback**:
- If backend is down → automatically uses fake data
- User sees "Demo Mode" badge
- Everything still works!

---

## 🔧 Backend (Server)

### How the Backend Works

1. **Frontend sends request** → Example: "Run query s01"
2. **Express receives request** → Routes it to correct controller
3. **Controller processes** → Gets SQL from query service
4. **Database query** → Runs SQL on PostgreSQL
5. **Send response** → Returns results to frontend

### Main Backend Files

#### `server/src/index.js` - Main Server File
- **What it does**: Starts the Express server
- **Simple explanation**: Like opening a shop - sets up everything and starts accepting customers

```javascript
// Setup
const app = express();  // Create Express app
const PORT = 5001;      // Server runs on port 5001

// Middleware (runs before routes)
app.use(cors());        // Allow frontend to call backend
app.use(express.json()); // Parse JSON data

// Routes (connect URLs to handlers)
app.use('/api/dashboard', dashboardRoutes);  // Dashboard endpoints
app.use('/api/queries', queryRoutes);        // Query endpoints

// Start server
app.listen(PORT);  // Start listening for requests
```

#### `server/src/controllers/queryController.js` - Query Controller
- **What it does**: Handles query execution requests
- **How it works**:
  1. Get query ID from request
  2. Look up SQL for that query
  3. Run SQL on database
  4. Return results

```javascript
export async function runQuery(req, res) {
  const { id } = req.body;              // Get query ID (e.g., "s01")
  const queryDef = getQuery(id);        // Get SQL for this query
  const result = await pool.query(queryDef.sql);  // Run SQL
  res.json({ columns, rows, insight }); // Send results back
}
```

#### `server/src/services/queryService.js` - Query Definitions
- **What it does**: Stores all 15 SQL queries
- **Simple explanation**: Like a recipe book - each query has its SQL, explanation, and insight

```javascript
const queries = {
  s01: {
    id: 's01',
    title: 'All Customers',
    sql: 'SELECT * FROM Customer',
    explanation: 'Returns every customer...',
    insight: 'This shows all registered customers'
  },
  // ... 14 more queries
};
```

#### `server/src/db/pool.js` - Database Connection
- **What it does**: Connects to PostgreSQL
- **Simple explanation**: Like a phone line to the database

```javascript
const pool = new Pool({
  connectionString: process.env.DATABASE_URL  // Get from .env file
});
```

---

## 🗄️ Database

### Database Tables (8 tables)

1. **Customer** - Customer information (name, address, city)
2. **Restaurant** - Restaurant details (name, location)
3. **Orders** - Order records (order_no, customer_id, date)
4. **Menu_Item** - Menu items with prices
5. **Delivery_Partner** - Delivery personnel
6. **Delivers** - Links orders to delivery partners
7. **Payment** - Payment records (has trigger!)
8. **Ratings** - Customer ratings

### PL/pgSQL Functions (3 functions)

1. **get_total_orders(customer_id)** - Count orders for a customer
2. **total_revenue()** - Calculate total revenue
3. **avg_menu_price()** - Average menu item price

### Trigger (1 trigger)

**payment_status_trigger** - Automatically sets payment status:
- If amount ≤ 0 → status = 'Invalid'
- If amount > 0 and status is NULL → status = 'Pending'

---

## 🔄 How Data Flows

### Example: User runs a query

```
1. User clicks "Run Query" button
   ↓
2. Frontend calls: queryApi.runQuery('s01')
   ↓
3. Axios sends: POST /api/queries/run {id: 's01'}
   ↓
4. Backend receives request at queryController.runQuery()
   ↓
5. Controller gets SQL: getQuery('s01') → 'SELECT * FROM Customer'
   ↓
6. Controller runs SQL: pool.query('SELECT * FROM Customer')
   ↓
7. PostgreSQL executes query and returns rows
   ↓
8. Controller formats response: {columns: [...], rows: [...]}
   ↓
9. Backend sends JSON response
   ↓
10. Frontend receives data and displays in ResultTable
```

---

## 🎨 UI Components

### Reusable Components

#### `KPICard.jsx` - Shows a single KPI number
```javascript
<KPICard 
  label="Active Orders"    // What this number represents
  value={1250}             // The number to show
  isLoading={false}        // Show loading animation?
/>
```

#### `ResultTable.jsx` - Shows query results in a table
```javascript
<ResultTable 
  columns={['customer_id', 'first_name', 'last_name']}  // Column headers
  rows={[{customer_id: 1, first_name: 'John', ...}]}    // Data rows
/>
```

#### `SyntaxHighlighter.jsx` - Shows SQL with colors
```javascript
<SyntaxHighlighter 
  sql="SELECT * FROM Customer"  // SQL to display
/>
```

---

## 🎭 Animations

### Framer Motion - Makes things move smoothly

```javascript
// Fade in from top
<motion.div
  initial={{ opacity: 0, y: 20 }}  // Start: invisible, 20px down
  animate={{ opacity: 1, y: 0 }}   // End: visible, normal position
>
  Content here
</motion.div>

// Hover effect
<motion.div
  whileHover={{ scale: 1.02 }}  // Grow 2% when mouse hovers
>
  Card content
</motion.div>
```

---

## 🔧 Configuration Files

### `.env` - Environment Variables
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery_db
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
```

### `package.json` - Dependencies and Scripts
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm run dev",
    "client": "cd client && npm run dev"
  }
}
```

---

## 🚀 How to Run

### Simple Steps

1. **Install dependencies**
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   ```

2. **Setup database** (if you have PostgreSQL)
   ```bash
   createdb food_delivery_db
   psql -d food_delivery_db -f database/schema.sql
   psql -d food_delivery_db -f database/seed.sql
   ```

3. **Run the app**
   ```bash
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

---

## 🐛 Common Issues

### Port already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9

# Kill process on port 5001
lsof -ti:5001 | xargs kill -9
```

### Database connection failed
- Check PostgreSQL is running: `pg_isready`
- Check `.env` file has correct credentials
- App will use mock data if database is unavailable

---

## 📚 Key Concepts

### React Hooks

**useState** - Store data that can change
```javascript
const [count, setCount] = useState(0);  // count = 0 initially
setCount(5);  // Update count to 5
```

**useEffect** - Run code when component loads
```javascript
useEffect(() => {
  fetchData();  // Run when component loads
}, []);  // Empty array = run once
```

### Async/Await - Wait for data

```javascript
// Without async/await (confusing)
fetchData().then(data => console.log(data));

// With async/await (clear)
const data = await fetchData();
console.log(data);
```

### Array Methods

```javascript
// map - Transform each item
[1, 2, 3].map(x => x * 2)  // [2, 4, 6]

// filter - Keep items that match condition
[1, 2, 3, 4].filter(x => x > 2)  // [3, 4]

// find - Get first item that matches
[1, 2, 3].find(x => x === 2)  // 2
```

---

## 🎓 For Your Presentation

### What to Explain to Professor

1. **Architecture**: Frontend (React) → Backend (Express) → Database (PostgreSQL)
2. **Features**: 15 queries, 3 functions, 1 trigger, 8 tables
3. **UI**: Dark theme, animations, glassmorphism, responsive
4. **Fallback**: Works without database using mock data
5. **Tech Stack**: React, Tailwind, Framer Motion, Node.js, Express, PostgreSQL

### Demo Flow

1. Start with Landing Page (impressive first impression)
2. Show Dashboard (live KPIs and charts)
3. Go to Query Lab (run a simple query, then a complex one)
4. Show Entity Browser (browse tables)
5. Demo Functions (run a PL/pgSQL function)
6. Show Trigger Demo (insert payment, show status change)
7. Use Presentation Mode for guided walkthrough

---

## 💡 Tips for Understanding Code

1. **Read comments** - They explain what each part does
2. **Follow the data flow** - See how data moves from frontend → backend → database
3. **Start simple** - Understand one file at a time
4. **Use console.log()** - Print values to see what's happening
5. **Ask questions** - If something is unclear, ask!

---

Good luck with your presentation! 🎓
