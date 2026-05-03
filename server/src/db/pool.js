import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.warn('⚠️  Warning: Unable to connect to database. Mock data will be used.');
    console.warn('   Error:', err.message);
  } else {
    console.log('✅ Database connected successfully');
    release();
  }
});

// Handle pool errors
pool.on('error', (err) => {
  console.warn('⚠️  Unexpected database error:', err.message);
});

export default pool;
