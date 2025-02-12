/**
 * modules/Payment/controllers/paymentController.js
 *
 * Payment aggregator logic: monthly invoices, auto-charges, commission pay-outs, etc.
 */
const { Commission } = require('../../../src/models'); 
// If you also have Invoice, Payment, etc., import them as needed.

/**
 * POST /payments/invoices
 * Retailer creates monthly invoice
 */
async function createInvoice(req, res) {
  try {
    // Example usage if you had an Invoice model:
    // const newInvoice = await Invoice.create({ ...req.body });
    // For now, just respond with a success message:
    return res.status(201).json({ message: 'Invoice created successfully' });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * GET /payments/invoices
 * Admin or retailer can view
 */
async function getInvoices(req, res) {
  try {
    // If you had an Invoice model, e.g.:
    // const invoices = await Invoice.findAll();
    return res.status(200).json({ message: 'Fetched all invoices', data: [] });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PATCH /payments/invoices/:invoiceId/pay
 * Pay aggregator invoice
 */
async function payInvoice(req, res) {
  try {
    const { invoiceId } = req.params;
    // If you had an Invoice model, you’d find & update it:
    // const invoice = await Invoice.findByPk(invoiceId);
    // if (!invoice) {
    //   return res.status(404).json({ message: 'Invoice not found' });
    // }
    // invoice.status = 'paid';
    // await invoice.save();

    return res.status(200).json({ message: `Invoice ${invoiceId} paid successfully` });
  } catch (error) {
    console.error('Error paying invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * NEW: POST /payments/commissions
 * Create a new commission record manually (Test Case A).
 */
async function createCommission(req, res) {
  try {
    // e.g. { "userId": 23, "amount": 50.0 }
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ message: 'Missing userId or amount' });
    }

    // Insert into Commissions table
    const newCommission = await Commission.create({
      user_id: userId,
      amount: amount,
      status: 'unpaid'
    });

    return res.status(201).json({
      message: 'Commission record created',
      commission: newCommission
    });
  } catch (error) {
    console.error('Error creating commission:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * GET /payments/commissions
 * Check user’s or influencer’s commission (Test Case B).
 */
async function getCommissionStatus(req, res) {
  try {
    // Identify the user from JWT
    const userId = req.user.id;

    // Sum up total amounts by status
    const [allCommissions, unpaidCommissions] = await Promise.all([
      Commission.sum('amount', { where: { user_id: userId } }),
      Commission.sum('amount', { where: { user_id: userId, status: 'unpaid' } })
    ]);

    // Default to 0 if sum returns null
    const totalEarned = allCommissions || 0;
    const unpaidAmount = unpaidCommissions || 0;

    return res.status(200).json({
      message: 'Commission status',
      data: {
        totalEarned: parseFloat(totalEarned),
        unpaidAmount: parseFloat(unpaidAmount),
        currency: 'USD'
      }
    });
  } catch (error) {
    console.error('Error fetching commission status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * NEW: PATCH /payments/commissions/:commissionId/pay
 * Mark a specific commission as paid (Test Case C).
 */
async function payCommission(req, res) {
  try {
    const { commissionId } = req.params;
    // e.g. { "paymentMethod": "bank_transfer", "transactionId": "TXN12345" }
    const { paymentMethod, transactionId } = req.body;

    // Find the commission
    const commission = await Commission.findByPk(commissionId);
    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    // Mark as paid
    commission.status = 'paid';
    await commission.save();

    return res.status(200).json({
      message: 'Commission paid successfully',
      commissionId: commissionId,
      status: 'paid',
      paymentMethod,
      transactionId
    });
  } catch (error) {
    console.error('Error paying commission:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  createInvoice,
  getInvoices,
  payInvoice,
  getCommissionStatus,
  createCommission,  // ADDED
  payCommission      // ADDED
};
