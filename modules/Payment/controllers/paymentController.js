/**
 * modules/Payment/controllers/paymentController.js
 *
 * Payment aggregator logic: monthly invoices, auto-charges, commission pay-outs, etc.
 */

const { Commission, Invoice } = require('../../../src/models');
const paymentService = require('../services/paymentService');

//-----------------------------------------
// (1) Create Invoice (manual / stub)
//-----------------------------------------
async function createInvoice(req, res) {
  try {
    // Possibly implement logic to create an invoice from request
    return res.status(201).json({ message: 'Invoice created successfully (stub)' });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

//----------------------
// (2) Get All Invoices
//----------------------
async function getInvoices(req, res) {
  try {
    // For now, a stub returning empty. Or you can implement Invoice.findAll()
    return res.status(200).json({ message: 'Fetched all invoices (stub)', data: [] });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

//-----------------------------------------
// (3) Pay an Invoice by ID
//-----------------------------------------
async function payInvoice(req, res) {
  try {
    // 1) Extract invoiceId from URL, plus payment details from body
    const { invoiceId } = req.params;
    const { paymentMethod, transactionId } = req.body;

    // 2) Call the service function to do actual logic
    const result = await paymentService.markInvoicePaid(invoiceId, { paymentMethod, transactionId });

    // 3) Return the full JSON object that the service returns
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error paying invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

//---------------------------------------------------------
// (4) Generate Invoices for a date range
//---------------------------------------------------------
async function generateInvoicesForRange(req, res) {
  try {
    const { startDate, endDate } = req.body;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }
    const result = await paymentService.generateInvoices(startDate, endDate);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error generating invoices for range:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

//-----------------------------------------------
// (5) Create Commission Manually
//-----------------------------------------------
async function createCommission(req, res) {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ message: 'Missing userId or amount' });
    }

    const newCommission = await Commission.create({
      user_id: userId,
      amount,
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

//-----------------------------------------------------------
// (6) Get user’s or influencer’s commission
//-----------------------------------------------------------
async function getCommissionStatus(req, res) {
  try {
    // Identify user from JWT (req.user.id)
    const userId = req.user.id;

    const [allCommissions, unpaidCommissions] = await Promise.all([
      Commission.sum('amount', { where: { user_id: userId } }),
      Commission.sum('amount', { where: { user_id: userId, status: 'unpaid' } })
    ]);

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

//-----------------------------------------------
// (7) Pay a Specific Commission
//-----------------------------------------------
async function payCommission(req, res) {
  try {
    const { commissionId } = req.params;
    const { paymentMethod, transactionId } = req.body;

    const commission = await Commission.findByPk(commissionId);
    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

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
  generateInvoicesForRange,
  createCommission,
  getCommissionStatus,
  payCommission
};
