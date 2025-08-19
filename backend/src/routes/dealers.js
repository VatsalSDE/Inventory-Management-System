import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db/pool.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM dealers ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch dealers' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { dealer_code, firm_name, person_name, gstin, mobile_number, email, address } = req.body;
    const sql = `INSERT INTO dealers (dealer_code, firm_name, person_name, gstin, mobile_number, email, address)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                 RETURNING *`;
    const params = [dealer_code, firm_name, person_name, gstin, mobile_number, email, address];
    const { rows } = await query(sql, params);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create dealer' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { dealer_code, firm_name, person_name, gstin, mobile_number, email, address } = req.body;
    const sql = `UPDATE dealers SET dealer_code=$1, firm_name=$2, person_name=$3, gstin=$4, mobile_number=$5, email=$6, address=$7 WHERE dealer_id=$8 RETURNING *`;
    const params = [dealer_code, firm_name, person_name, gstin, mobile_number, email, address, id];
    const { rows } = await query(sql, params);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update dealer' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM dealers WHERE dealer_id=$1', [id]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete dealer' });
  }
});

export default router;


