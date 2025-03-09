/**
 * modules/Payment/controllers/paymentController.js
 *
 * Payment aggregator logic: monthly invoices, auto-charges, commission payouts, etc.
 */

const { Commission, Invoice, Order, Retailer } = require('../../../src/models');
const paymentService = require('../services/paymentService');

//-----------------------------------------
// (1) Create Invoice (manual / stub)
//-----------------------------------------
async function createInvoice(req, res) {
  try {
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
    const { invoiceId } = req.params;
    const { paymentMethod, transactionId } = req.body;

    const result = await paymentService.markInvoicePaid(invoiceId, { paymentMethod, transactionId });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error paying invoice:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

//---------------------------------------------------------
// (4) Generate Invoices for a date range (monthly aggregator)
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
// (5) Create a Commission Manually (Test usage)
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
// (6) Get user’s or influencer’s commission (Test usage)
//-----------------------------------------------------------
async function getCommissionStatus(req, res) {
  try {
    // Identify user from JWT (req.user.id)
    const userId = req.user.id;

    const [allCommissions, unpaidCommissions] = await Promise.all([
      Commission.sum('amount', { where: { user_id: userId } }),
      Commission.sum('amount', { where: { user_id: userId, status: 'unpaid' } })
    ]);

    const totalEarned = parseFloat(allCommissions || 0);
    const unpaidAmount = parseFloat(unpaidCommissions || 0);

    return res.status(200).json({
      message: 'Commission status',
      data: {
        totalEarned,
        unpaidAmount,
        currency: 'USD'
      }
    });
  } catch (error) {
    console.error('Error fetching commission status:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

/**
 * PATCH /payments/commissions/:commissionId/pay
 * 
 * Only the retailer that owns the "order" (commission.order.retailer.user_id) or an admin
 * can mark the commission as paid. Also, we do not allow double-paying a "paid" commission.
 */
async function payCommission(req, res) {
  try {
    const { commissionId } = req.params;
    const { paymentMethod, transactionId } = req.body;

    // Eager-load the associated order and its retailer
    const commission = await Commission.findOne({
      where: { id: commissionId },
      include: [
        {
          model: Order,
          as: 'order',
          include: [
            {
              model: Retailer,
              as: 'retailer'
            }
          ]
        }
      ]
    });

    if (!commission) {
      return res.status(404).json({ message: 'Commission not found' });
    }

    // Must have an associated order
    if (!commission.order) {
      return res.status(400).json({ message: 'Commission has no associated order' });
    }

    // Must have a retailer row in that order
    if (!commission.order.retailer) {
      return res.status(400).json({ message: 'Order has no associated retailer record' });
    }

    // Check if commission is already paid
    if (commission.status === 'paid') {
      // or you can choose 400 or 409. We do 409 for "Conflict"
      return res.status(409).json({ message: 'Commission is already paid' });
    }

    // If user isn't admin, check the retailer’s user_id
    if (req.user.role !== 'admin') {
      // Must match the retailer’s user_id
      if (commission.order.retailer.user_id !== req.user.id) {
        return res
          .status(403)
          .json({ message: 'Not authorized to pay this commission' });
      }
    }

    // Mark as paid
    commission.status = 'paid';
    await commission.save();

    return res.status(200).json({
      message: 'Commission paid successfully',
      commissionId: commission.id.toString(),
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
