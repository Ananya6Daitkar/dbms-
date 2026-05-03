# Food Delivery Query Lab

A visual control room for PostgreSQL analysis - College DBMS Mini Project

## Features

- 🎨 **Cinematic UI** - Dark theme with glassmorphism and neon accents
- 📊 **Interactive Dashboard** - Real-time KPIs and animated charts
- 🔍 **Query Lab** - 15 predefined SQL queries (simple & complex)
- 📁 **Entity Browser** - Browse all 8 database tables
- ⚡ **PL/pgSQL Functions** - Execute 3 database functions
- 🎯 **Trigger Demo** - Simulate payment triggers
- 🎤 **Presentation Mode** - Fullscreen guided demo for viva

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Framer Motion
- Recharts
- Axios
- React Router v6

**Backend:**
- Node.js + Express
- PostgreSQL + pg
- CORS

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+

## Setup Instructions

### 1. Clone and Install

```bash
# Install root dependencies
npm install

# Install client and server dependencies
cd client && npm install
cd ../server && npm install
cd ..
```

### 2. Database Setup

```bash
# Create database
createdb food_delivery_db

# Run schema
psql -d food_delivery_db -f database/schema.sql

# Run seed data
psql -d food_delivery_db -f database/seed.sql
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/food_delivery_db
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

Replace `username` and `password` with your PostgreSQL credentials.

### 4. Run the Application

**Option 1: Run both servers concurrently (recommended)**
```bash
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Project Structure

```
food-delivery-query-lab/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── layout/   # Navbar, FloatingBackground
│   │   │   └── ui/       # KPICard, ResultTable, SyntaxHighlighter
│   │   ├── pages/        # Page components
│   │   ├── services/     # API service layer
│   │   ├── hooks/        # Custom React hooks
│   │   └── data/         # Mock data fallback
│   └── package.json
├── server/                # Express backend
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   └── db/          # Database connection
│   └── package.json
├── database/             # SQL files
│   ├── schema.sql       # Table definitions + functions + triggers
│   └── seed.sql         # Sample data
└── README.md
```

## Database Schema

### Tables
- **Customer** - Customer information (50+ records)
- **Restaurant** - Restaurant details (50+ records)
- **Orders** - Order records (50+ records)
- **Menu_Item** - Menu items with prices (50+ records)
- **Delivery_Partner** - Delivery personnel (50+ records)
- **Delivers** - Order-Partner junction table
- **Payment** - Payment records with trigger
- **Ratings** - Customer ratings

### PL/pgSQL Functions
1. `get_total_orders(customer_id)` - Count orders for a customer
2. `total_revenue()` - Calculate total revenue
3. `avg_menu_price()` - Average menu item price

### Trigger
- `payment_status_trigger` - Automatically sets payment status:
  - Amount ≤ 0 → status = 'Invalid'
  - Amount > 0 and status NULL → status = 'Pending'

## API Endpoints

### Dashboard
- `GET /api/dashboard/kpis` - Get KPI metrics
- `GET /api/dashboard/charts` - Get chart data

### Queries
- `POST /api/queries/run` - Execute a predefined query

### Entities
- `GET /api/entities/:name` - Get entity data

### Functions
- `POST /api/functions/run` - Execute a PL/pgSQL function

### Triggers
- `POST /api/triggers/payment` - Simulate payment trigger

## Mock Data Fallback

The application includes a complete mock data layer. If the database is unavailable, the UI will automatically fall back to mock data and display a "Demo Mode" badge.

## Presentation Mode

Access fullscreen presentation mode at `/presentation` or click the Presentation button in the navbar.

**Controls:**
- `→` Next slide
- `←` Previous slide
- `Esc` Exit presentation mode

## Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running: `pg_isready`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -l`

### Port Already in Use
- Change PORT in `.env` (backend)
- Change port in `client/vite.config.js` (frontend)

### Module Not Found Errors
- Run `npm install` in root, client, and server directories
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## License

MIT License - Built for educational purposes

## Authors

College DBMS Mini Project Team
