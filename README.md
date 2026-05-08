# Food Delivery Database Management System

A full-stack web application for managing a food delivery database with PostgreSQL, built for DBMS mini project.

## Project Overview

This project demonstrates all PostgreSQL concepts including DDL, DQL, DML, DCL, TCL, Triggers, and PL/pgSQL functions through a web interface.

**Tech Stack:**
- Frontend: React 18 + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL

**Public URL:** https://carina-unrollable-carlton.ngrok-free.dev

---

## Quick Start

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
cd client && npm install
cd ../server && npm install
cd ..
```

2. **Setup database:**
```bash
createdb food_delivery_db
psql -d food_delivery_db -f database/schema.sql
psql -d food_delivery_db -f database/seed.sql
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

4. **Start application:**
```bash
npm run dev
```

5. **Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

---

## Database Schema

### Tables (8 total)

**Customer**
- customer_id, first_name, last_name, zip_code, apartment_no, street_name, city

**Restaurant**
- restaurant_id, restaurant_name, street_name, state, city, zip_code

**Orders**
- order_no, customer_id, order_date, quantity

**Menu_Item**
- item_id, restaurant_id, item_name, category, price, availability

**Delivery_Partner**
- partner_id, partner_name, phone_no, vehicle_type

**Delivers** (Junction table)
- order_no, partner_id

**Payment**
- payment_id, order_no, amount, status, payment_date

**Ratings**
- rating_id, item_id, rating_date, comment

---

## Features

### 1. Query Lab
Execute predefined queries or write custom SQL:
- 10 Simple queries
- 5 Complex queries (JOINs, GROUP BY, subqueries)
- Custom SQL input (SELECT, INSERT, UPDATE, DELETE)

### 2. Tables (Entity Browser)
Browse all 8 database tables with search functionality.

### 3. Functions
Execute 3 PL/pgSQL functions:
- `get_total_orders(customer_id)` - Count orders for a customer
- `total_revenue()` - Calculate total revenue
- `avg_menu_price()` - Average menu item price

### 4. Triggers
Demonstrate payment status trigger:
- Automatically sets payment status based on amount
- Shows before/after comparison

---

## PostgreSQL Concepts Demonstrated

### DDL (Data Definition Language)
- 8 tables with primary keys, foreign keys, constraints
- Location: `database/schema.sql`

### DQL (Data Query Language)
- 15 predefined queries (10 simple + 5 complex)
- Custom query execution
- Location: Query Lab page

### DML (Data Manipulation Language)
- INSERT, UPDATE, DELETE through custom query
- Location: Query Lab → Custom Query

### DCL (Data Control Language)
- GRANT, REVOKE, user management
- Location: `database/dcl_examples.sql`

### TCL (Transaction Control Language)
- BEGIN, COMMIT, ROLLBACK, SAVEPOINT
- Location: `database/tcl_examples.sql`

### Triggers
- `payment_status_trigger` - Auto-set payment status
- Location: Triggers page + `database/schema.sql`

### PL/pgSQL Functions
- 3 custom functions for analytics
- Location: Functions page + `database/schema.sql`

---

## Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main app component
│   └── vite.config.js     # Vite configuration
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── index.js       # Server entry point
│   └── .env               # Environment variables
│
├── database/              # Database files
│   ├── schema.sql         # Table definitions, functions, triggers
│   ├── seed.sql           # Sample data
│   ├── dcl_examples.sql   # DCL commands
│   └── tcl_examples.sql   # TCL commands
│
└── package.json           # Root dependencies
```

---

## API Endpoints

### Queries
- `POST /api/queries/run` - Execute predefined query
- `POST /api/queries/custom` - Execute custom SQL

### Entities
- `GET /api/entities/:name` - Get table data

### Functions
- `POST /api/functions/run` - Execute PL/pgSQL function

### Triggers
- `POST /api/triggers/simulate` - Simulate trigger execution

---

## Development

### Run in development mode:
```bash
npm run dev
```

### Run frontend only:
```bash
cd client && npm run dev
```

### Run backend only:
```bash
cd server && npm run dev
```

### Database operations:
```bash
# Reset database
psql -d food_delivery_db -f database/schema.sql

# Add sample data
psql -d food_delivery_db -f database/seed.sql

# Test DCL commands
psql -d food_delivery_db -f database/dcl_examples.sql

# Test TCL commands
psql -d food_delivery_db -f database/tcl_examples.sql
```

---

## Public Access (ngrok)

The application is accessible publicly via ngrok:

**URL:** https://carina-unrollable-carlton.ngrok-free.dev

### Setup ngrok:
```bash
ngrok http 5173
```

### Monitor traffic:
- ngrok dashboard: http://localhost:4040

---

## Demonstration Guide

### For Teacher Presentation:

1. **Show DDL:**
   - Open `database/schema.sql`
   - Show CREATE TABLE statements

2. **Show DQL:**
   - Go to Query Lab
   - Run simple and complex queries
   - Show custom query feature

3. **Show DML:**
   - Go to Query Lab → Custom Query
   - Execute INSERT, UPDATE, DELETE

4. **Show DCL:**
   - Open pgAdmin
   - Run commands from `database/dcl_examples.sql`

5. **Show TCL:**
   - Open pgAdmin
   - Run commands from `database/tcl_examples.sql`

6. **Show Triggers:**
   - Go to Triggers page
   - Enter test data
   - Show before/after comparison

7. **Show PL/pgSQL:**
   - Go to Functions page
   - Execute all 3 functions
   - Show results

---

## Troubleshooting

### Database connection failed
```bash
# Check PostgreSQL status
pg_ctl status

# Start PostgreSQL
pg_ctl start

# Check credentials in server/.env
```

### Port already in use
```bash
# Kill process on port 5001
lsof -ti:5001 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Tables don't exist
```bash
# Recreate database
dropdb food_delivery_db
createdb food_delivery_db
psql -d food_delivery_db -f database/schema.sql
psql -d food_delivery_db -f database/seed.sql
```

---

## Team

- Group of 3 members
- DBMS Mini Project
- College: [Your College Name]

---

## License

This project is for educational purposes.

---

## Notes

- All queries work with live PostgreSQL database
- Frontend changes database in real-time
- Professional UI with clean design
- Responsive layout for all devices
- Error handling and validation included
