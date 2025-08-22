import { pool } from './src/db/pool.js';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    console.log('🔌 Testing database connection...');
    console.log('📡 Connecting to:', process.env.PGHOST || 'localhost');
    
    const client = await pool.connect();
    console.log('✅ Database connection successful!');
    
    const result = await client.query('SELECT NOW() as current_time');
    console.log('🕐 Database time:', result.rows[0].current_time);
    
    client.release();
    console.log('🔒 Connection released');
    
    await pool.end();
    console.log('🎉 Test completed successfully!');
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error('Error:', error.message);
    console.error('\n🔧 Troubleshooting tips:');
    console.error('1. Check if PGHOST has the correct IP address');
    console.error('2. Verify PostgreSQL is running on the remote server');
    console.error('3. Ensure firewall allows port 5432');
    console.error('4. Check username/password in .env file');
    console.error('5. Verify pg_hba.conf allows remote connections');
  }
}

testConnection();
