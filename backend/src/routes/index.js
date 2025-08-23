import { Router } from 'express';
import authRoutes from './auth.js';
import productsRoutes from './products.js';
import dealersRoutes from './dealers.js';
import ordersRoutes from './orders.js';
import paymentsRoutes from './payments.js';
import billingRoutes from './billing.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/dealers', dealersRoutes);
router.use('/orders', ordersRoutes);
router.use('/payments', paymentsRoutes);
router.use('/billing', billingRoutes);

export default router;


