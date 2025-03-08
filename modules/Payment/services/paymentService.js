/****************************************************************************
 * modules/Payment/services/paymentService.js
 ****************************************************************************/
const { Op } = require('sequelize');
const { Invoice, Order, Retailer, Commission } = require('../../../src/models');

exports.generateInvoices = async (startDate, endDate) => {
  try {
    // Track how many invoices we create
    let invoiceCount = 0;

    // 1) Find all retailers
    const retailers = await Retailer.findAll();

    // 2) For each retailer, find orders in the date range
    for (const r of retailers) {
      const orders = await Order.findAll({
        where: {
          retailer_id: r.id,
          created_at: {
            [Op.gte]: startDate,
            [Op.lte]: endDate
          }
        }
      });

      if (!orders.length) {
        // No orders => skip
        continue;
      }

      // Example aggregator fee: sum 5% of final_price
      let totalAmount = 0;
      for (const ord of orders) {
        const aggregatorFee = parseFloat(ord.final_price) * 0.05;
        totalAmount += aggregatorFee;
      }

      // Only create invoice if totalAmount > 0
      if (totalAmount > 0) {
        await Invoice.create({
          retailer_id: r.id,
          amount: totalAmount,
          status: 'UNPAID',
          period_start: startDate,
          period_end: endDate
        });
        invoiceCount++;
      }
    }

    // Return object includes how many invoices were created
    return { 
      success: true, 
      message: 'Invoices generated successfully', 
      invoicesCreated: invoiceCount 
    };
  } catch (error) {
    console.error('Error generating invoices for range:', error);
    throw error;
  }
};

/**
 * Mark an invoice as paid
 */
exports.markInvoicePaid = async (invoiceId, { paymentMethod, transactionId }) => {
  try {
    const invoice = await Invoice.findByPk(invoiceId);
    if (!invoice) {
      throw new Error(`Invoice ID ${invoiceId} not found`);
    }

    invoice.status = 'PAID';
    await invoice.save();

    // If you want to handle commissions or other logic, do so here
    return {
      message: `Invoice ${invoiceId} paid successfully`,
      invoiceId: invoiceId,
      status: 'PAID',
      paymentMethod,
      transactionId
    };
  } catch (error) {
    console.error('Error marking invoice as paid:', error);
    throw error;
  }
};
