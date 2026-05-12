# Food Delivery Query Lab - Core Code Documentation

## Project Overview
Full-stack web application for PostgreSQL database management with custom PL/pgSQL functions and triggers.

**Tech Stack:** React 18 + Vite | Node.js + Express | PostgreSQL  
**GitHub:** https://github.com/Ananya6Daitkar/dbms-  
**Live URL:** https://carina-unrollable-carlton.ngrok-free.dev

---

## 1. DATABASE SCHEMA (database/schema.sql)

### Tables (8 Total)
```sql
-- Customer Table
CREATE TABLE Customer (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50),
  city VARCHAR(50) NOT NULL,
  zip_code VARCHAR(10),
  apartment_no VARCHAR(20),
  street_name VARCHAR(50)
);

-- Restaurant Table
CREATE TABLE Restaurant (
  restaurant_id SERIAL PRIMARY KEY,
  restaurant_name VARCHAR(100) NOT NULL,
  street_name VARCHAR(50),
  state VARCHAR(50),
  city VARCHAR(50),
  zip_code VARCHAR(10)
);

-- Orders Table
CREATE TABLE Orders (
  order_no SERIAL PRIMARY KEY,
  customer_id INT REFERENCES Customer(customer_id),
  order_date DATE,
  quantity INT CHECK (quantity > 0)
);

-- Menu_Item Table
CREATE TABLE Menu_Item (
  item_id SERIAL PRIMARY KEY,
  restaurant_id INT REFERENCES Restaurant(restaurant_id),
  item_name VARCHAR(100),
  category VARCHAR(50),
  price NUMERIC(8,2) CHECK (price > 0),
  availability BOOLEAN
);

-- Payment Table
CREATE TABLE Payment (
  payment_id SERIAL PRIMARY KEY,
  order_no INT REFERENCES Orders(order_no),
  amount NUMERIC(10,2),
  status VARCHAR(30),
  payment_date DATE
);

-- Other tables: Delivery_Partner, Delivers, Ratings
```

### Predefined Functions (3 Total)
```sql
-- Function 1: Get total orders for a customer
CREATE OR REPLACE FUNCTION get_total_orders(cust_id INT)
RETURNS INT AS $$
DECLARE 
  total_orders INT;
BEGIN
  SELECT COUNT(*) INTO total_orders 
  FROM Orders 
  WHERE customer_id = cust_id;
  RETURN total_orders;
END;
$$ LANGUAGE plpgsql;

-- Function 2: Calculate total revenue
CREATE OR REPLACE FUNCTION total_revenue()
RETURNS NUMERIC AS $$
DECLARE 
  revenue NUMERIC;
BEGIN
  SELECT COALESCE(SUM(amount), 0) INTO revenue FROM Payment;
  RETURN revenue;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Calculate average menu price
CREATE OR REPLACE FUNCTION avg_menu_price()
RETURNS NUMERIC AS $$
DECLARE 
  avg_price NUMERIC;
BEGIN
  SELECT COALESCE(AVG(price), 0) INTO avg_price FROM Menu_Item;
  RETURN avg_price;
END;
$$ LANGUAGE plpgsql;
```

### Predefined Trigger
```sql
-- Trigger Function: Set payment status automatically
CREATE OR REPLACE FUNCTION set_payment_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.amount <= 0 THEN
    NEW.status := 'Invalid';
  ELSIF NEW.status IS NULL THEN
    NEW.status := 'Pending';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER payment_status_trigger
BEFORE INSERT OR UPDATE ON Payment
FOR EACH ROW
EXECUTE FUNCTION set_payment_status();
```

---

## 2. BACKEND - SERVER SETUP

### Main Server (server/src/index.js)
```javascript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import functionRoutes from './routes/functions.js';
import triggerRoutes from './routes/triggers.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/functions', functionRoutes);
app.use('/api/triggers', triggerRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
```

### Database Connection (server/src/db/pool.js)
```javascript
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('✅ Database connected successfully');
});

export default pool;
```

---

## 3. BACKEND - CUSTOM FUNCTION HANDLER

### File: server/src/controllers/functionController.js

**Key Feature:** Smart SQL Parser that handles dollar-quoted strings (`$$`)

```javascript
import pool from '../db/pool.js';

export async function runCustomFunction(req, res) {
  try {
    const { sql } = req.body;
    
    if (!sql || !sql.trim()) {
      return res.status(400).json({ error: 'SQL is required' });
    }
    
    // SMART SQL PARSER - Handles dollar-quoted strings
    const statements = [];
    let current = '';
    let i = 0;
    
    while (i < sql.length) {
      const char = sql[i];
      
      // Detect dollar quote (e.g., $$)
      if (char === '$') {
        let tagEnd = i + 1;
        while (tagEnd < sql.length && sql[tagEnd] !== '$') tagEnd++;
        
        if (tagEnd < sql.length) {
          const tag = sql.substring(i, tagEnd + 1);
          current += tag;
          i = tagEnd + 1;
          
          // Find matching closing tag
          while (i < sql.length) {
            if (sql.substring(i, i + tag.length) === tag) {
              current += tag;
              i += tag.length;
              break;
            }
            current += sql[i++];
          }
        } else {
          current += char;
          i++;
        }
      } else if (char === ';') {
        // Split on semicolon (outside dollar quotes)
        if (current.trim()) statements.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    if (current.trim()) statements.push(current.trim());
    
    // Execute all statements
    let result;
    for (const stmt of statements) {
      result = await pool.query(stmt);
    }
    
    // Return result
    if (result && result.rows && result.rows.length > 0) {
      const resultValue = result.rows[0][Object.keys(result.rows[0])[0]];
      res.json({ result: resultValue });
    } else {
      res.json({ result: 'Function created successfully' });
    }
  } catch (error) {
    console.error('Error running custom function:', error);
    res.status(500).json({ error: error.message });
  }
}
```

---

## 4. BACKEND - CUSTOM TRIGGER HANDLER

### File: server/src/controllers/triggerController.js

```javascript
import pool from '../db/pool.js';

export async function runCustomTrigger(req, res) {
  try {
    const { sql } = req.body;
    
    if (!sql || !sql.trim()) {
      return res.status(400).json({ error: 'SQL is required' });
    }
    
    // Same smart SQL parser as above
    const statements = [];
    let current = '';
    let i = 0;
    
    while (i < sql.length) {
      const char = sql[i];
      
      if (char === '$') {
        let tagEnd = i + 1;
        while (tagEnd < sql.length && sql[tagEnd] !== '$') tagEnd++;
        
        if (tagEnd < sql.length) {
          const tag = sql.substring(i, tagEnd + 1);
          current += tag;
          i = tagEnd + 1;
          
          while (i < sql.length) {
            if (sql.substring(i, i + tag.length) === tag) {
              current += tag;
              i += tag.length;
              break;
            }
            current += sql[i++];
          }
        } else {
          current += char;
          i++;
        }
      } else if (char === ';') {
        if (current.trim()) statements.push(current.trim());
        current = '';
        i++;
      } else {
        current += char;
        i++;
      }
    }
    
    if (current.trim()) statements.push(current.trim());
    
    // Execute all statements
    let result;
    for (const stmt of statements) {
      result = await pool.query(stmt);
    }
    
    // Return result
    res.json({ 
      result: result?.rows?.[0] || null,
      message: 'Trigger created and executed successfully'
    });
  } catch (error) {
    console.error('Error running custom trigger:', error);
    res.status(500).json({ error: error.message });
  }
}
```

---

## 5. FRONTEND - CUSTOM FUNCTION EXECUTION

### File: client/src/pages/FunctionsPage.jsx (Key Part)

```javascript
const handleRunCustomFunction = async () => {
  if (!customFunctionSql.trim()) {
    setCustomError('Please enter function SQL');
    return;
  }
  
  setIsLoading(true);
  setCustomError(null);
  
  try {
    const response = await fetch('/api/functions/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: customFunctionSql })
    });
    
    const data = await response.json();
    
    if (data.error) {
      setCustomError(data.error);
      setResult(null);
    } else {
      setResult(data);
      setCustomError(null);
    }
  } catch (error) {
    setCustomError(error.message || 'Failed to execute function');
    setResult(null);
  }
  
  setIsLoading(false);
};
```

---

## 6. FRONTEND - CUSTOM TRIGGER EXECUTION

### File: client/src/pages/TriggerDemo.jsx (Key Part)

```javascript
const handleRunCustomTrigger = async () => {
  if (!customTriggerSql.trim()) {
    setCustomError('Please enter trigger SQL');
    return;
  }
  
  setIsLoading(true);
  setCustomError(null);
  
  try {
    const response = await fetch('/api/triggers/custom', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sql: customTriggerSql })
    });
    
    const data = await response.json();
    
    if (data.error) {
      setCustomError(data.error);
      setResult(null);
    } else {
      setResult(data);
      setCustomError(null);
    }
  } catch (error) {
    setCustomError(error.message || 'Failed to execute trigger');
    setResult(null);
  }
  
  setIsLoading(false);
};
```

---

## 7. WORKING EXAMPLES

### Custom Function Examples

```sql
-- Example 1: Count Customers
CREATE OR REPLACE FUNCTION count_customers() RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM Customer);
END;
$$ LANGUAGE plpgsql;
SELECT count_customers();

-- Example 2: Count Orders
CREATE OR REPLACE FUNCTION count_orders() RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM Orders);
END;
$$ LANGUAGE plpgsql;
SELECT count_orders();
```

### Custom Trigger Examples

```sql
-- Example 1: Uppercase City
DROP TRIGGER IF EXISTS upper_city ON Customer;
CREATE OR REPLACE FUNCTION make_upper() RETURNS TRIGGER AS $$
BEGIN
  NEW.city := UPPER(NEW.city);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER upper_city BEFORE INSERT ON Customer FOR EACH ROW EXECUTE FUNCTION make_upper();
INSERT INTO Customer (first_name, city) VALUES ('Test', 'mumbai') RETURNING *;

-- Example 2: Default Quantity
DROP TRIGGER IF EXISTS set_qty ON Orders;
CREATE OR REPLACE FUNCTION default_qty() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.quantity IS NULL THEN NEW.quantity := 1; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER set_qty BEFORE INSERT ON Orders FOR EACH ROW EXECUTE FUNCTION default_qty();
INSERT INTO Orders (customer_id, order_date, quantity) VALUES (1, CURRENT_DATE, NULL) RETURNING *;
```

---

## 8. CONFIGURATION

### Backend (.env)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/food_delivery
PORT=5001
CLIENT_ORIGIN=http://localhost:5173
```

### Frontend (vite.config.js)
```javascript
export default {
  server: {
    proxy: {
      '/api': 'http://localhost:5001'
    },
    allowedHosts: ['localhost', '.ngrok-free.dev', '.ngrok.io']
  }
}
```

---

## KEY INNOVATION

**Smart SQL Parser**: The core feature that makes custom functions/triggers work is the intelligent SQL parser that correctly handles PL/pgSQL dollar-quoted strings (`$$`). Without this, the SQL would be split incorrectly at semicolons inside function bodies, causing syntax errors.

---

## PROJECT STRUCTURE

```
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── FunctionsPage.jsx
│   │   │   ├── TriggerDemo.jsx
│   │   │   └── QueryLab.jsx
│   │   └── App.jsx
│   └── package.json
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── functionController.js
│   │   │   └── triggerController.js
│   │   ├── db/pool.js
│   │   └── index.js
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

---

**End of Documentation**
