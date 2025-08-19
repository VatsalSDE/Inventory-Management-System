import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { query } from '../db/pool.js';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const { rows } = await query('SELECT * FROM products ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const { product_code, product_name, category, no_burners, type_burner, price, quantity, image_url } = req.body;
    const sql = `INSERT INTO products (product_code, product_name, category, no_burners, type_burner, price, quantity, image_url)
                 VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
                 RETURNING *`;
    const params = [product_code, product_name, category, no_burners, type_burner, price, quantity ?? 0, image_url];
    const { rows } = await query(sql, params);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Failed to create product' });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { product_code, product_name, category, no_burners, type_burner, price, quantity, image_url } = req.body;
    const sql = `UPDATE products SET product_code=$1, product_name=$2, category=$3, no_burners=$4, type_burner=$5, price=$6, quantity=$7, image_url=$8 WHERE product_id=$9 RETURNING *`;
    const params = [product_code, product_name, category, no_burners, type_burner, price, quantity, image_url, id];
    const { rows } = await query(sql, params);
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Failed to update product' });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    await query('DELETE FROM products WHERE product_id=$1', [id]);
    res.status(204).send();
  } catch (e) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

export default router;


