# Simple Architecture Diagram

## 🏗️ Overall Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                       │
│                     http://localhost:5173                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    REACT FRONTEND (Client)                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages:                                               │  │
│  │  • LandingPage.jsx    → Home page                    │  │
│  │  • Dashboard.jsx      → KPIs + Charts                │  │
│  │  • QueryLab.jsx       → Run 15 queries               │  │
│  │  • EntityBrowser.jsx  → Browse tables                │  │
│  │  • FunctionsPage.jsx  → Run PL/pgSQL functions       │  │
│  │  • TriggerDemo.jsx    → Test payment trigger         │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services:                                            │  │
│  │  • api.js            → Calls backend APIs            │  │
│  │  • queryService.js   → Query definitions             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls (Axios)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  EXPRESS BACKEND (Server)                    │
│                    http://localhost:5001                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes:                                              │  │
│  │  • /api/dashboard    → Dashboard data                │  │
│  │  • /api/queries      → Run queries                   │  │
│  │  • /api/entities     → Get table data                │  │
│  │  • /api/functions    → Run PL/pgSQL functions        │  │
│  │  • /api/triggers     → Test triggers                 │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers:                                         │  │
│  │  • dashboardController.js  → Handle dashboard        │  │
│  │  • queryController.js      → Handle queries          │  │
│  │  • entityController.js     → Handle entities         │  │
│  │  • functionController.js   → Handle functions        │  │
│  │  • triggerController.js    → Handle triggers         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ SQL Queries (pg)
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    POSTGRESQL DATABASE                       │
│                    localhost:5432                            │
│                    food_delivery_db                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Tables (8):                                          │  │
│  │  • Customer          → Customer info                 │  │
│  │  • Restaurant        → Restaurant details            │  │
│  │  • Orders            → Order records                 │  │
│  │  • Menu_Item         → Menu items + prices           │  │
│  │  • Delivery_Partner  → Delivery personnel            │  │
│  │  • Delivers          → Order-Partner link            │  │
│  │  • Payment           → Payment records               │  │
│  │  • Ratings           → Customer ratings              │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Functions (3):                                       │  │
│  │  • get_total_orders(customer_id)                     │  │
│  │  • total_revenue()                                    │  │
│  │  • avg_menu_price()                                   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Triggers (1):                                        │  │
│  │  • payment_status_trigger  → Auto-set status         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow Example: Running a Query

```
Step 1: User clicks "Run Query" button
        ↓
Step 2: QueryLab.jsx calls handleRunQuery()
        ↓
Step 3: queryApi.runQuery('s01') is called
        ↓
Step 4: Axios sends POST request to http://localhost:5001/api/queries/run
        Body: { id: 's01' }
        ↓
Step 5: Express receives request at /api/queries route
        ↓
Step 6: Routes to queryController.runQuery()
        ↓
Step 7: Controller gets query definition from queryService
        SQL: 'SELECT * FROM Customer'
        ↓
Step 8: Controller executes: pool.query('SELECT * FROM Customer')
        ↓
Step 9: PostgreSQL runs the query and returns rows
        ↓
Step 10: Controller formats response:
         {
           columns: ['customer_id', 'first_name', 'last_name', ...],
           rows: [{customer_id: 1, first_name: 'John', ...}, ...],
           insight: 'This shows all registered customers'
         }
        ↓
Step 11: Express sends JSON response back to frontend
        ↓
Step 12: Frontend receives data and updates state
         setResult(data)
        ↓
Step 13: React re-renders and shows ResultTable with data
```

---

## 📦 File Organization

```
food-delivery-query-lab/
│
├── 📁 client/                    # Frontend (React)
│   ├── 📁 src/
│   │   ├── 📁 components/        # Reusable UI components
│   │   │   ├── 📁 layout/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── FloatingBackground.jsx
│   │   │   └── 📁 ui/
│   │   │       ├── KPICard.jsx
│   │   │       ├── ResultTable.jsx
│   │   │       └── SyntaxHighlighter.jsx
│   │   │
│   │   ├── 📁 pages/             # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── QueryLab.jsx
│   │   │   ├── EntityBrowser.jsx
│   │   │   ├── FunctionsPage.jsx
│   │   │   ├── TriggerDemo.jsx
│   │   │   └── PresentationMode.jsx
│   │   │
│   │   ├── 📁 services/          # API calls
│   │   │   ├── api.js            # Axios + API functions
│   │   │   └── queryService.js   # Query definitions
│   │   │
│   │   ├── 📁 data/              # Mock data
│   │   │   └── mockData.js
│   │   │
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   │
│   └── package.json              # Frontend dependencies
│
├── 📁 server/                    # Backend (Node.js + Express)
│   ├── 📁 src/
│   │   ├── 📁 controllers/       # Request handlers
│   │   │   ├── dashboardController.js
│   │   │   ├── queryController.js
│   │   │   ├── entityController.js
│   │   │   ├── functionController.js
│   │   │   └── triggerController.js
│   │   │
│   │   ├── 📁 routes/            # API routes
│   │   │   ├── dashboard.js
│   │   │   ├── queries.js
│   │   │   ├── entities.js
│   │   │   ├── functions.js
│   │   │   └── triggers.js
│   │   │
│   │   ├── 📁 services/          # Business logic
│   │   │   └── queryService.js   # Query definitions
│   │   │
│   │   ├── 📁 db/                # Database connection
│   │   │   └── pool.js           # PostgreSQL pool
│   │   │
│   │   └── index.js              # Server entry point
│   │
│   └── package.json              # Backend dependencies
│
├── 📁 database/                  # SQL files
│   ├── schema.sql                # Table definitions + functions + triggers
│   └── seed.sql                  # Sample data (50+ records per table)
│
├── .env                          # Environment variables
├── package.json                  # Root package (runs both servers)
├── README.md                     # Full documentation
├── QUICKSTART.md                 # Quick setup guide
├── CODE_EXPLANATION.md           # Code explanation (this file!)
└── ARCHITECTURE_SIMPLE.md        # Architecture diagram
```

---

## 🎯 Component Hierarchy

```
App.jsx
│
├── FloatingBackground.jsx        (Background animations)
│
├── Navbar.jsx                    (Top navigation bar)
│
└── Routes
    │
    ├── LandingPage.jsx
    │   └── Entity cards (8 cards)
    │
    ├── Dashboard.jsx
    │   ├── KPICard.jsx (x3)      (Active Orders, Avg Delivery, New Restaurants)
    │   ├── LineChart             (Monthly Revenue Trends)
    │   └── BarChart              (Revenue by Restaurant)
    │
    ├── QueryLab.jsx
    │   ├── Query List (left)
    │   │   └── Query Cards (15 cards)
    │   │
    │   └── Query Details (right)
    │       ├── SyntaxHighlighter.jsx
    │       ├── Run Button
    │       └── ResultTable.jsx
    │
    ├── EntityBrowser.jsx
    │   ├── Entity Selector
    │   ├── Search Bar
    │   └── ResultTable.jsx
    │
    ├── FunctionsPage.jsx
    │   ├── Function Cards (3 cards)
    │   └── Result Display
    │
    ├── TriggerDemo.jsx
    │   ├── Payment Form
    │   ├── Before State
    │   └── After State
    │
    └── PresentationMode.jsx
        └── Fullscreen Slides
```

---

## 🔌 API Endpoints

### Dashboard Endpoints
```
GET  /api/dashboard/kpis     → Get KPI numbers
GET  /api/dashboard/charts   → Get chart data
```

### Query Endpoints
```
POST /api/queries/run        → Run a query
     Body: { id: 's01' }
     Response: { columns: [...], rows: [...], insight: '...' }
```

### Entity Endpoints
```
GET  /api/entities/:name     → Get table data
     Example: /api/entities/customer
     Response: { columns: [...], rows: [...] }
```

### Function Endpoints
```
POST /api/functions/run      → Run a PL/pgSQL function
     Body: { functionName: 'total_revenue', params: {} }
     Response: { result: 12500 }
```

### Trigger Endpoints
```
POST /api/triggers/payment   → Simulate payment trigger
     Body: { orderId: 1, amount: 500, status: null }
     Response: { before: {...}, after: {...}, triggerFired: true }
```

---

## 🎨 UI Component Props

### KPICard
```javascript
<KPICard
  label="Active Orders"      // Label text
  value={1250}               // Number to display
  unit="mins"                // Optional unit (e.g., "mins", "%")
  isLoading={false}          // Show loading animation?
/>
```

### ResultTable
```javascript
<ResultTable
  columns={['id', 'name']}   // Column headers
  rows={[{id: 1, name: 'John'}]}  // Data rows
  isLoading={false}          // Show loading animation?
/>
```

### SyntaxHighlighter
```javascript
<SyntaxHighlighter
  sql="SELECT * FROM Customer"  // SQL code to highlight
/>
```

---

## 🔐 Environment Variables

### `.env` file
```env
# Database connection string
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery_db

# Backend server port
PORT=5001

# Frontend URL (for CORS)
CLIENT_ORIGIN=http://localhost:5173

# Environment
NODE_ENV=development
```

---

## 🚀 Startup Sequence

### When you run `npm run dev`:

```
1. Root package.json runs "concurrently" command
   ↓
2. Starts two processes in parallel:
   
   Process 1: Backend Server
   ├── cd server
   ├── npm run dev
   ├── nodemon src/index.js
   ├── Load .env file
   ├── Connect to PostgreSQL
   ├── Start Express on port 5001
   └── ✅ Server ready
   
   Process 2: Frontend Dev Server
   ├── cd client
   ├── npm run dev
   ├── vite
   ├── Build React app
   ├── Start dev server on port 5173
   └── ✅ Frontend ready
   
3. Open browser → http://localhost:5173
4. Frontend loads → Shows landing page
5. User interacts → Frontend calls backend APIs
6. Backend queries database → Returns data
7. Frontend displays results → User sees data
```

---

## 💾 Database Schema Relationships

```
Customer (1) ──────< Orders (M)
                      │
                      │ (1)
                      │
                      ↓
                    Payment (1)
                    [Has Trigger!]

Restaurant (1) ────< Menu_Item (M)

Orders (M) ────< Delivers >──── Delivery_Partner (M)
           (Many-to-Many)

Orders (1) ────< Ratings (M)
Menu_Item (1) ─< Ratings (M)
```

**Legend:**
- `(1)` = One
- `(M)` = Many
- `<` = One-to-Many relationship
- `>────<` = Many-to-Many relationship

---

## 🎓 Key Technologies Explained

### React
- **What**: JavaScript library for building user interfaces
- **Why**: Makes it easy to create interactive web pages
- **How**: Components that update automatically when data changes

### Express
- **What**: Web framework for Node.js
- **Why**: Makes it easy to create API endpoints
- **How**: Define routes and handlers for HTTP requests

### PostgreSQL
- **What**: Relational database
- **Why**: Stores data in tables with relationships
- **How**: Use SQL to query and manipulate data

### Axios
- **What**: HTTP client for making API calls
- **Why**: Easier than fetch API, has interceptors
- **How**: `axios.get()`, `axios.post()`, etc.

### Framer Motion
- **What**: Animation library for React
- **Why**: Makes smooth animations easy
- **How**: Wrap components in `<motion.div>` and add animation props

### Tailwind CSS
- **What**: Utility-first CSS framework
- **Why**: Style components quickly with classes
- **How**: `className="bg-blue-500 text-white p-4"`

---

## 🐛 Debugging Tips

### Frontend Issues
```javascript
// Add console.log to see what's happening
console.log('Selected query:', selectedQuery);
console.log('API response:', data);

// Check React DevTools in browser
// View component state and props
```

### Backend Issues
```javascript
// Add console.log in controllers
console.log('Request body:', req.body);
console.log('Query result:', result.rows);

// Check terminal for error messages
// Look for stack traces
```

### Database Issues
```bash
# Check if PostgreSQL is running
pg_isready

# Connect to database
psql -d food_delivery_db

# Run a test query
SELECT * FROM Customer LIMIT 5;
```

---

## 📝 Summary

**Frontend (React)**:
- User interface
- 7 pages
- Calls backend APIs
- Shows data with animations

**Backend (Express)**:
- API server
- Handles requests
- Queries database
- Returns JSON data

**Database (PostgreSQL)**:
- Stores data
- 8 tables
- 3 functions
- 1 trigger

**Flow**: User → Frontend → Backend → Database → Backend → Frontend → User

---

This is a complete, working full-stack application that demonstrates all the concepts required for your college mini-project! 🎓
