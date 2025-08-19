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

export const pool = new Pool(buildPoolConfig());

export async function query(sql, params = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql, params);
    return result;
  } finally {
    client.release();
  }
}


