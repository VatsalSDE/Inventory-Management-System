import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();

const { Pool } = pkg;

function buildPoolConfig() {
  if (process.env.DATABASE_URL) {
    const isRequire = (process.env.PGSSLMODE || '').toLowerCase() === 'require';
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: isRequire ? { rejectUnauthorized: false } : false,
    };
  }

  const isRequire = (process.env.PGSSLMODE || '').toLowerCase() === 'require';
  return {
    host: process.env.PGHOST || 'localhost',
    port: Number(process.env.PGPORT || 5432),
    database: process.env.PGDATABASE || 'storedb',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || 'postgres',
    ssl: isRequire ? { rejectUnauthorized: false } : false,
  };
}

export const pool = new Pool({
  ...buildPoolConfig(),
  max: 20, // Maximum number of clients
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return an error after 2 seconds
});

// Add error handling
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  } finally {
    client.release();
  }
}


