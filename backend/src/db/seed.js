import bcrypt from 'bcryptjs';
import { pool } from './pool.js';

async function seed() {
  const adminPasswordPlain = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = await bcrypt.hash(adminPasswordPlain, 10);
  await pool.query(
    `INSERT INTO login (username, password)
     VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password = EXCLUDED.password`,
    ['admin', hash]
  );

  console.log('Seed finished. Admin user: admin /', adminPasswordPlain);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });


