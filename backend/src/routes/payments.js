import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db/pool.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await query(
      `SELECT p.*, d.firm_name, o.order_code
       FROM payments p
       LEFT JOIN dealers d ON d.dealer_id = p.dealer_id
       LEFT JOIN orders o ON o.order_id = p.order_id
       ORDER BY p.payment_date DESC`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch payments' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { dealer_id, order_id, paid_amount, method, transaction_id, payment_date } = req.body;
    const sql = `INSERT INTO payments (dealer_id, order_id, paid_amount, method, transaction_id, payment_date)
                 VALUES ($1,$2,$3,$4,$5,COALESCE($6, CURRENT_TIMESTAMP)) RETURNING *`;
    const { rows } = await query(sql, [dealer_id, order_id, paid_amount, method, transaction_id, payment_date]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create payment' });
  }
});

export default router;


