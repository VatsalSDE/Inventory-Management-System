import { pool } from './pool.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrateImages() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Starting image metadata migration...');
    
    // Read the migration SQL
    const migrationPath = path.join(__dirname, 'sql', 'add_image_metadata.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await client.query(migrationSQL);
    
    console.log('✅ Image metadata migration completed successfully!');
    console.log('📋 Added fields: image_public_id, image_format, image_width, image_height, image_size');
    console.log('🔍 Added indexes for better performance');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrateImages()
    .then(() => {
      console.log('🎉 Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

export default migrateImages;
