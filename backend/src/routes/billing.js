import express from 'express';
import { query } from '../db/pool.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Get all bills with dealer and payment information
router.get('/', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        b.*,
        d.dealer_name,
        d.dealer_email,
        d.dealer_mobile,
        d.dealer_address,
        COALESCE(SUM(bp.amount), 0) as paid_amount,
        (b.total_amount - COALESCE(SUM(bp.amount), 0)) as balance_amount
      FROM bills b
      LEFT JOIN dealers d ON b.dealer_id = d.dealer_id
      LEFT JOIN bill_payments bp ON b.bill_id = bp.bill_id
      GROUP BY b.bill_id, d.dealer_name, d.dealer_email, d.dealer_mobile, d.dealer_address
      ORDER BY b.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bills:', error);
    res.status(500).json({ error: 'Failed to fetch bills' });
  }
});

// Get bill by ID with items and dealer details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get bill details
    const billResult = await query(`
      SELECT 
        b.*,
        d.dealer_name,
        d.dealer_email,
        d.dealer_mobile,
        d.dealer_address
      FROM bills b
      LEFT JOIN dealers d ON b.dealer_id = d.dealer_id
      WHERE b.bill_id = $1
    `, [id]);
    
    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    // Get bill items
    const itemsResult = await query(`
      SELECT * FROM bill_items WHERE bill_id = $1
    `, [id]);
    
    // Get payment history
    const paymentsResult = await query(`
      SELECT * FROM bill_payments WHERE bill_id = $1 ORDER BY payment_date DESC
    `, [id]);
    
    const bill = billResult.rows[0];
    bill.items = itemsResult.rows;
    bill.payments = paymentsResult.rows;
    
    res.json(bill);
  } catch (error) {
    console.error('Error fetching bill:', error);
    res.status(500).json({ error: 'Failed to fetch bill' });
  }
});

// Create new bill
router.post('/', async (req, res) => {
  try {
    const {
      dealer_id,
      dealer_name,
      dealer_email,
      dealer_mobile,
      dealer_address,
      bill_date,
      due_date,
      cgst_rate,
      sgst_rate,
      notes,
      items
    } = req.body;
    
    // Generate bill number
    const billNumberResult = await query('SELECT generate_bill_number() as bill_number');
    const billNumber = billNumberResult.rows[0].bill_number;
    
    // Calculate due date if not provided
    const calculatedDueDate = due_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Create bill
    const billResult = await query(`
      INSERT INTO bills (
        bill_number, dealer_id, dealer_name, dealer_email, dealer_mobile, dealer_address,
        bill_date, due_date, cgst_rate, sgst_rate, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `, [
      billNumber, dealer_id, dealer_name, dealer_email, dealer_mobile, dealer_address,
      bill_date || new Date(), calculatedDueDate, cgst_rate || 9.0, sgst_rate || 9.0, notes
    ]);
    
    const bill = billResult.rows[0];
    
    // Add bill items
    if (items && items.length > 0) {
      for (const item of items) {
        await query(`
          INSERT INTO bill_items (
            bill_id, product_id, product_name, product_code, quantity, unit_price, total_price, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          bill.bill_id, item.product_id, item.product_name, item.product_code,
          item.quantity, item.unit_price, item.total_price, item.description
        ]);
      }
    }
    
    // Get complete bill with items
    const completeBill = await query(`
      SELECT 
        b.*,
        d.dealer_name,
        d.dealer_email,
        d.dealer_mobile,
        d.dealer_address
      FROM bills b
      LEFT JOIN dealers d ON b.dealer_id = d.dealer_id
      WHERE b.bill_id = $1
    `, [bill.bill_id]);
    
    // Send email if configured
    if (dealer_email) {
      await sendBillEmail(completeBill.rows[0], items);
    }
    
    res.status(201).json(completeBill.rows[0]);
  } catch (error) {
    console.error('Error creating bill:', error);
    res.status(500).json({ error: 'Failed to create bill' });
  }
});

// Update bill
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      dealer_name,
      dealer_email,
      dealer_mobile,
      dealer_address,
      bill_date,
      due_date,
      cgst_rate,
      sgst_rate,
      notes,
      items
    } = req.body;
    
    // Update bill
    await query(`
      UPDATE bills SET
        dealer_name = $1,
        dealer_email = $2,
        dealer_mobile = $3,
        dealer_address = $4,
        bill_date = $5,
        due_date = $6,
        cgst_rate = $7,
        sgst_rate = $8,
        notes = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE bill_id = $10
    `, [
      dealer_name, dealer_email, dealer_mobile, dealer_address,
      bill_date, due_date, cgst_rate, sgst_rate, notes, id
    ]);
    
    // Update items if provided
    if (items) {
      // Delete existing items
      await query('DELETE FROM bill_items WHERE bill_id = $1', [id]);
      
      // Add new items
      for (const item of items) {
        await query(`
          INSERT INTO bill_items (
            bill_id, product_id, product_name, product_code, quantity, unit_price, total_price, description
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [
          id, item.product_id, item.product_name, item.product_code,
          item.quantity, item.unit_price, item.total_price, item.description
        ]);
      }
    }
    
    // Get updated bill
    const result = await query(`
      SELECT 
        b.*,
        d.dealer_name,
        d.dealer_email,
        d.dealer_mobile,
        d.dealer_address
      FROM bills b
      LEFT JOIN dealers d ON b.dealer_id = d.dealer_id
      WHERE b.bill_id = $1
    `, [id]);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating bill:', error);
    res.status(500).json({ error: 'Failed to update bill' });
  }
});

// Delete bill
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if bill has payments
    const paymentsResult = await query('SELECT COUNT(*) FROM bill_payments WHERE bill_id = $1', [id]);
    if (parseInt(paymentsResult.rows[0].count) > 0) {
      return res.status(400).json({ error: 'Cannot delete bill with payments. Please delete payments first.' });
    }
    
    // Delete bill (items will be deleted automatically due to CASCADE)
    await query('DELETE FROM bills WHERE bill_id = $1', [id]);
    
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    console.error('Error deleting bill:', error);
    res.status(500).json({ error: 'Failed to delete bill' });
  }
});

// Add payment to bill
router.post('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, payment_date, payment_method, reference_number, notes } = req.body;
    
    // Add payment
    const result = await query(`
      INSERT INTO bill_payments (
        bill_id, amount, payment_date, payment_method, reference_number, notes
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [id, amount, payment_date || new Date(), payment_method, reference_number, notes]);
    
    // Update bill payment status
    await updateBillPaymentStatus(id);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ error: 'Failed to add payment' });
  }
});

// Get bill payments
router.get('/:id/payments', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await query(`
      SELECT * FROM bill_payments 
      WHERE bill_id = $1 
      ORDER BY payment_date DESC
    `, [id]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// Delete payment
router.delete('/:id/payments/:paymentId', async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    
    await query('DELETE FROM bill_payments WHERE payment_id = $1 AND bill_id = $2', [paymentId, id]);
    
    // Update bill payment status
    await updateBillPaymentStatus(id);
    
    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Failed to delete payment' });
  }
});

// Get bill templates
router.get('/templates/all', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bill_templates WHERE is_active = true');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// Get bill settings
router.get('/settings/all', async (req, res) => {
  try {
    const result = await query('SELECT * FROM bill_settings');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update bill settings
router.put('/settings/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    await query(`
      UPDATE bill_settings 
      SET setting_value = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE setting_key = $2
    `, [value, key]);
    
    res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    console.error('Error updating setting:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

// Generate bill PDF (placeholder for now)
router.get('/:id/pdf', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get bill data
    const billResult = await query(`
      SELECT 
        b.*,
        d.dealer_name,
        d.dealer_email,
        d.dealer_mobile,
        d.dealer_address
      FROM bills b
      LEFT JOIN dealers d ON b.dealer_id = d.dealer_id
      WHERE b.bill_id = $1
    `, [id]);
    
    if (billResult.rows.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    // Get bill items
    const itemsResult = await query(`
      SELECT * FROM bill_items WHERE bill_id = $1
    `, [id]);
    
    const bill = billResult.rows[0];
    bill.items = itemsResult.rows;
    
    // For now, return bill data for PDF generation on frontend
    res.json(bill);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});

// Helper function to update bill payment status
async function updateBillPaymentStatus(billId) {
  try {
    const billResult = await query('SELECT total_amount FROM bills WHERE bill_id = $1', [billId]);
    const totalAmount = billResult.rows[0].total_amount;
    
    const paymentsResult = await query('SELECT COALESCE(SUM(amount), 0) as paid_amount FROM bill_payments WHERE bill_id = $1', [billId]);
    const paidAmount = parseFloat(paymentsResult.rows[0].paid_amount);
    
    let paymentStatus = 'pending';
    if (paidAmount >= totalAmount) {
      paymentStatus = 'paid';
    } else if (paidAmount > 0) {
      paymentStatus = 'partial';
    }
    
    await query('UPDATE bills SET payment_status = $1 WHERE bill_id = $1', [paymentStatus, billId]);
  } catch (error) {
    console.error('Error updating payment status:', error);
  }
}

// Helper function to send bill email
async function sendBillEmail(bill, items) {
  try {
    // Configure email transporter (you'll need to set up your email service)
    const transporter = nodemailer.createTransporter({
      // Configure your email service here
      // Example for Gmail:
      // service: 'gmail',
      // auth: {
      //   user: process.env.EMAIL_USER,
      //   pass: process.env.EMAIL_PASS
      // }
    });
    
    // Create email content
    const emailContent = `
      <h2>New Bill Generated</h2>
      <p><strong>Bill Number:</strong> ${bill.bill_number}</p>
      <p><strong>Date:</strong> ${bill.bill_date}</p>
      <p><strong>Due Date:</strong> ${bill.due_date}</p>
      <p><strong>Total Amount:</strong> ₹${bill.total_amount}</p>
      
      <h3>Items:</h3>
      <ul>
        ${items.map(item => `
          <li>${item.product_name} - Qty: ${item.quantity} - Price: ₹${item.unit_price} - Total: ₹${item.total_price}</li>
        `).join('')}
      </ul>
      
      <p>Please review the attached bill and process payment accordingly.</p>
    `;
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'noreply@vinayaklakshmi.com',
      to: bill.dealer_email,
      subject: `New Bill Generated - ${bill.bill_number}`,
      html: emailContent
    });
    
    console.log(`Bill email sent to ${bill.dealer_email}`);
  } catch (error) {
    console.error('Error sending bill email:', error);
  }
}

export default router;
