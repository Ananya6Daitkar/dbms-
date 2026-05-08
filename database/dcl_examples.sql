-- DCL (Data Control Language) Examples
-- Commands for managing user permissions and access control

-- ============================================
-- 1. CREATE USERS
-- ============================================

-- Create a read-only user for viewing data
CREATE USER readonly_user WITH PASSWORD 'readonly123';

-- Create an admin user with full access
CREATE USER admin_user WITH PASSWORD 'admin123';

-- Create a data entry user for INSERT/UPDATE
CREATE USER dataentry_user WITH PASSWORD 'dataentry123';

-- ============================================
-- 2. GRANT PERMISSIONS
-- ============================================

-- Grant SELECT permission on all tables to readonly user
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;

-- Grant SELECT on specific tables
GRANT SELECT ON Customer, Restaurant, Orders TO readonly_user;

-- Grant INSERT and UPDATE on specific tables to data entry user
GRANT SELECT, INSERT, UPDATE ON Customer TO dataentry_user;
GRANT SELECT, INSERT, UPDATE ON Orders TO dataentry_user;
GRANT SELECT, INSERT, UPDATE ON Payment TO dataentry_user;

-- Grant all privileges to admin user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin_user;

-- Grant EXECUTE permission on functions
GRANT EXECUTE ON FUNCTION get_total_orders(INT) TO readonly_user;
GRANT EXECUTE ON FUNCTION total_revenue() TO readonly_user;
GRANT EXECUTE ON FUNCTION avg_menu_price() TO readonly_user;

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO readonly_user;
GRANT USAGE ON SCHEMA public TO dataentry_user;
GRANT USAGE ON SCHEMA public TO admin_user;

-- ============================================
-- 3. REVOKE PERMISSIONS
-- ============================================

-- Revoke INSERT permission from readonly user (if accidentally granted)
REVOKE INSERT ON Customer FROM readonly_user;

-- Revoke DELETE permission from dataentry user
REVOKE DELETE ON ALL TABLES IN SCHEMA public FROM dataentry_user;

-- Revoke all privileges from a user
REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM readonly_user;

-- ============================================
-- 4. VIEW PERMISSIONS
-- ============================================

-- Check permissions for a specific user
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE grantee = 'readonly_user';

-- Check all permissions on a specific table
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'customer';

-- List all users
SELECT usename FROM pg_user;

-- ============================================
-- 5. DROP USERS (Cleanup)
-- ============================================

-- Drop users (run this to clean up after demo)
-- DROP USER IF EXISTS readonly_user;
-- DROP USER IF EXISTS admin_user;
-- DROP USER IF EXISTS dataentry_user;

-- ============================================
-- DEMONSTRATION SCRIPT
-- ============================================

/*
STEP 1: Create readonly_user
*/
CREATE USER readonly_user WITH PASSWORD 'readonly123';

/*
STEP 2: Grant SELECT permission
*/
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_user;
GRANT USAGE ON SCHEMA public TO readonly_user;

/*
STEP 3: Verify permissions
*/
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE grantee = 'readonly_user'
ORDER BY table_name;

/*
STEP 4: Test readonly_user (connect as readonly_user)
*/
-- This should work:
-- SELECT * FROM Customer;

-- This should fail:
-- INSERT INTO Customer (first_name, last_name, city) VALUES ('Test', 'User', 'Mumbai');

/*
STEP 5: Revoke permissions
*/
REVOKE SELECT ON Customer FROM readonly_user;

/*
STEP 6: Verify revocation
*/
SELECT grantee, privilege_type, table_name
FROM information_schema.role_table_grants
WHERE grantee = 'readonly_user'
ORDER BY table_name;

-- ============================================
-- NOTES FOR DEMONSTRATION
-- ============================================

/*
1. DCL controls WHO can access WHAT in the database
2. GRANT gives permissions
3. REVOKE removes permissions
4. Common privileges: SELECT, INSERT, UPDATE, DELETE, ALL
5. Always follow principle of least privilege (give minimum necessary access)
*/
