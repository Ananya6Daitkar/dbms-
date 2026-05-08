-- TCL (Transaction Control Language) Examples
-- Commands for managing database transactions

-- ============================================
-- 1. BASIC TRANSACTION - COMMIT
-- ============================================

-- Example: Successfully add a new customer and their first order
BEGIN;
    -- Insert new customer
    INSERT INTO Customer (first_name, last_name, city) 
    VALUES ('Rajesh', 'Kumar', 'Mumbai');
    
    -- Get the customer_id (in real scenario, you'd use RETURNING clause)
    -- INSERT INTO Orders (customer_id, order_date, quantity) 
    -- VALUES (51, '2026-05-08', 2);
    
    -- Everything looks good, save the changes
COMMIT;

-- Verify the transaction was committed
SELECT * FROM Customer WHERE first_name = 'Rajesh' AND last_name = 'Kumar';

-- ============================================
-- 2. TRANSACTION WITH ROLLBACK
-- ============================================

-- Example: Accidentally update wrong payment amount, then undo
BEGIN;
    -- Oops! Wrong amount
    UPDATE Payment 
    SET amount = 0 
    WHERE payment_id = 1;
    
    -- Check the change
    SELECT * FROM Payment WHERE payment_id = 1;
    
    -- Wait, that's wrong! Undo everything
ROLLBACK;

-- Verify the rollback - amount should be unchanged
SELECT * FROM Payment WHERE payment_id = 1;

-- ============================================
-- 3. TRANSACTION WITH SAVEPOINT
-- ============================================

-- Example: Add customer and order, but rollback only the order if it fails
BEGIN;
    -- Step 1: Insert customer
    INSERT INTO Customer (first_name, last_name, city) 
    VALUES ('Priya', 'Sharma', 'Delhi');
    
    -- Create a savepoint after customer insert
    SAVEPOINT after_customer;
    
    -- Step 2: Try to insert order (this might fail due to invalid customer_id)
    INSERT INTO Orders (customer_id, order_date, quantity) 
    VALUES (999, '2026-05-08', 1);  -- customer_id 999 doesn't exist!
    
    -- If the above fails, rollback to savepoint
    ROLLBACK TO SAVEPOINT after_customer;
    
    -- Customer insert is still saved, only order insert was undone
COMMIT;

-- Verify: Customer exists, but no order for customer_id 999
SELECT * FROM Customer WHERE first_name = 'Priya' AND last_name = 'Sharma';
SELECT * FROM Orders WHERE customer_id = 999;

-- ============================================
-- 4. MULTIPLE SAVEPOINTS
-- ============================================

-- Example: Complex transaction with multiple savepoints
BEGIN;
    -- Insert a new restaurant
    INSERT INTO Restaurant (restaurant_name, city, state) 
    VALUES ('New Restaurant', 'Mumbai', 'Maharashtra');
    
    SAVEPOINT after_restaurant;
    
    -- Add menu items
    INSERT INTO Menu_Item (restaurant_id, item_name, category, price, availability) 
    VALUES (51, 'Special Dish', 'Veg', 299, TRUE);
    
    SAVEPOINT after_menu;
    
    -- Try to add invalid menu item (negative price)
    INSERT INTO Menu_Item (restaurant_id, item_name, category, price, availability) 
    VALUES (51, 'Invalid Item', 'Veg', -100, TRUE);  -- This will fail CHECK constraint
    
    -- Rollback only the invalid menu item
    ROLLBACK TO SAVEPOINT after_menu;
    
    -- Restaurant and first menu item are still saved
COMMIT;

-- ============================================
-- 5. TRANSACTION ISOLATION DEMO
-- ============================================

-- Example: Show how transactions isolate changes
-- (Run this in one session)
BEGIN;
    UPDATE Payment 
    SET status = 'Processing' 
    WHERE payment_id = 2;
    
    -- At this point, other sessions won't see 'Processing' status
    -- They still see the old status until we COMMIT
    
    -- Simulate some processing time...
    -- SELECT pg_sleep(5);
    
COMMIT;
-- Now other sessions can see the updated status

-- ============================================
-- 6. PRACTICAL EXAMPLE - ORDER PROCESSING
-- ============================================

-- Example: Complete order processing with error handling
BEGIN;
    -- Step 1: Create order
    INSERT INTO Orders (customer_id, order_date, quantity) 
    VALUES (1, CURRENT_DATE, 2);
    
    SAVEPOINT after_order;
    
    -- Step 2: Assign delivery partner
    INSERT INTO Delivers (order_no, partner_id) 
    VALUES (51, 1);
    
    SAVEPOINT after_delivery;
    
    -- Step 3: Process payment
    INSERT INTO Payment (order_no, amount, payment_date) 
    VALUES (51, 598, CURRENT_DATE);
    -- Trigger will automatically set status to 'Pending'
    
    -- If everything succeeded, commit all changes
COMMIT;

-- Verify the complete order
SELECT o.order_no, o.customer_id, o.quantity, 
       d.partner_id, p.amount, p.status
FROM Orders o
JOIN Delivers d ON o.order_no = d.order_no
JOIN Payment p ON o.order_no = p.order_no
WHERE o.order_no = 51;

-- ============================================
-- 7. ROLLBACK ENTIRE TRANSACTION
-- ============================================

-- Example: Cancel entire order if payment fails
BEGIN;
    -- Create order
    INSERT INTO Orders (customer_id, order_date, quantity) 
    VALUES (2, CURRENT_DATE, 3);
    
    -- Assign delivery
    INSERT INTO Delivers (order_no, partner_id) 
    VALUES (52, 2);
    
    -- Try payment with invalid amount
    INSERT INTO Payment (order_no, amount, payment_date) 
    VALUES (52, -100, CURRENT_DATE);
    -- Trigger sets status to 'Invalid'
    
    -- Check payment status
    SELECT status FROM Payment WHERE order_no = 52;
    
    -- If status is 'Invalid', cancel everything
ROLLBACK;

-- Verify: No order, no delivery, no payment
SELECT * FROM Orders WHERE order_no = 52;
SELECT * FROM Delivers WHERE order_no = 52;
SELECT * FROM Payment WHERE order_no = 52;

-- ============================================
-- 8. NESTED SAVEPOINTS
-- ============================================

-- Example: Nested savepoints for complex operations
BEGIN;
    INSERT INTO Customer (first_name, last_name, city) 
    VALUES ('Test', 'User', 'Pune');
    
    SAVEPOINT level1;
    
    INSERT INTO Orders (customer_id, order_date, quantity) 
    VALUES (1, CURRENT_DATE, 1);
    
    SAVEPOINT level2;
    
    INSERT INTO Payment (order_no, amount, payment_date) 
    VALUES (1, 100, CURRENT_DATE);
    
    SAVEPOINT level3;
    
    -- Rollback to level2 (undoes payment, keeps order and customer)
    ROLLBACK TO SAVEPOINT level2;
    
    -- Or rollback to level1 (undoes order and payment, keeps customer)
    -- ROLLBACK TO SAVEPOINT level1;
    
COMMIT;

-- ============================================
-- DEMONSTRATION SCRIPT FOR PRESENTATION
-- ============================================

/*
DEMO 1: Successful Transaction (COMMIT)
*/
BEGIN;
    INSERT INTO Customer (first_name, last_name, city) 
    VALUES ('Demo', 'User', 'Mumbai');
    
    -- Show the data (visible in this transaction)
    SELECT * FROM Customer WHERE first_name = 'Demo';
COMMIT;

-- Verify it's saved
SELECT * FROM Customer WHERE first_name = 'Demo';

/*
DEMO 2: Failed Transaction (ROLLBACK)
*/
BEGIN;
    UPDATE Payment SET amount = 0 WHERE payment_id = 1;
    
    -- Show the change (only visible in this transaction)
    SELECT amount FROM Payment WHERE payment_id = 1;
    
    -- Undo the change
ROLLBACK;

-- Verify it's unchanged
SELECT amount FROM Payment WHERE payment_id = 1;

/*
DEMO 3: Partial Rollback (SAVEPOINT)
*/
BEGIN;
    -- Insert customer (we want to keep this)
    INSERT INTO Customer (first_name, last_name, city) 
    VALUES ('Keep', 'Me', 'Delhi');
    
    SAVEPOINT keep_customer;
    
    -- Insert invalid order (we want to undo this)
    INSERT INTO Orders (customer_id, order_date, quantity) 
    VALUES (999, CURRENT_DATE, 1);  -- Invalid customer_id
    
    -- Undo only the order insert
    ROLLBACK TO SAVEPOINT keep_customer;
    
    -- Customer is still there
COMMIT;

-- Verify: Customer exists, order doesn't
SELECT * FROM Customer WHERE first_name = 'Keep';
SELECT * FROM Orders WHERE customer_id = 999;

-- ============================================
-- CLEANUP (Optional - run after demo)
-- ============================================

-- Remove demo data
-- DELETE FROM Customer WHERE first_name IN ('Demo', 'Keep', 'Test', 'Rajesh', 'Priya');
-- DELETE FROM Orders WHERE order_no > 50;
-- DELETE FROM Delivers WHERE order_no > 50;
-- DELETE FROM Payment WHERE order_no > 50;

-- ============================================
-- NOTES FOR DEMONSTRATION
-- ============================================

/*
1. TCL controls WHEN changes are saved to the database
2. BEGIN starts a transaction
3. COMMIT saves all changes permanently
4. ROLLBACK undoes all changes since BEGIN
5. SAVEPOINT creates a checkpoint within a transaction
6. ROLLBACK TO SAVEPOINT undoes changes after that checkpoint
7. Transactions ensure ACID properties (Atomicity, Consistency, Isolation, Durability)
8. Use transactions for operations that must succeed or fail together
*/
