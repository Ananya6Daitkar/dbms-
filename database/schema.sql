-- Food Delivery Query Lab Database Schema
-- PostgreSQL Database for College DBMS Mini Project

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Ratings CASCADE;
DROP TABLE IF EXISTS Payment CASCADE;
DROP TABLE IF EXISTS Delivers CASCADE;
DROP TABLE IF EXISTS Delivery_Partner CASCADE;
DROP TABLE IF EXISTS Menu_Item CASCADE;
DROP TABLE IF EXISTS Orders CASCADE;
DROP TABLE IF EXISTS Restaurant CASCADE;
DROP TABLE IF EXISTS Customer CASCADE;

-- Customer Table
CREATE TABLE Customer (
  customer_id SERIAL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50),
  zip_code VARCHAR(10),
  apartment_no VARCHAR(20),
  street_name VARCHAR(50),
  city VARCHAR(50) NOT NULL
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

-- Delivery_Partner Table
CREATE TABLE Delivery_Partner (
  partner_id SERIAL PRIMARY KEY,
  partner_name VARCHAR(100),
  location VARCHAR(100)
);

-- Delivers Table (Junction table)
CREATE TABLE Delivers (
  order_no INT REFERENCES Orders(order_no),
  partner_id INT REFERENCES Delivery_Partner(partner_id),
  PRIMARY KEY (order_no, partner_id)
);

-- Payment Table
CREATE TABLE Payment (
  payment_id SERIAL PRIMARY KEY,
  order_no INT REFERENCES Orders(order_no),
  amount NUMERIC(10,2),
  status VARCHAR(30),
  payment_date DATE
);

-- Ratings Table
CREATE TABLE Ratings (
  rating_id SERIAL PRIMARY KEY,
  item_id INT REFERENCES Menu_Item(item_id),
  rating_date DATE,
  comment TEXT
);

-- PL/pgSQL Functions

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
  SELECT COALESCE(SUM(amount), 0) INTO revenue 
  FROM Payment;
  
  RETURN revenue;
END;
$$ LANGUAGE plpgsql;

-- Function 3: Calculate average menu price
CREATE OR REPLACE FUNCTION avg_menu_price()
RETURNS NUMERIC AS $$
DECLARE 
  avg_price NUMERIC;
BEGIN
  SELECT COALESCE(AVG(price), 0) INTO avg_price 
  FROM Menu_Item;
  
  RETURN avg_price;
END;
$$ LANGUAGE plpgsql;

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

-- Trigger: Apply payment status logic before insert or update
CREATE TRIGGER payment_status_trigger
BEFORE INSERT OR UPDATE ON Payment
FOR EACH ROW
EXECUTE FUNCTION set_payment_status();

-- Create indexes for better query performance
CREATE INDEX idx_customer_city ON Customer(city);
CREATE INDEX idx_restaurant_state ON Restaurant(state);
CREATE INDEX idx_orders_customer ON Orders(customer_id);
CREATE INDEX idx_orders_date ON Orders(order_date);
CREATE INDEX idx_menu_restaurant ON Menu_Item(restaurant_id);
CREATE INDEX idx_payment_order ON Payment(order_no);
CREATE INDEX idx_ratings_item ON Ratings(item_id);
