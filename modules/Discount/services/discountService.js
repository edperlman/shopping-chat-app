/******************************************************************************
 * modules/Discount/services/discountService.js
 *
 * Provides discount usage logic, checking max_usage, etc.
 ******************************************************************************/
const { sequelize } = require('../../../src/models');
const { DataTypes } = require('sequelize');
const defineDiscount = require('../models/discount');

const Discount = defineDiscount(sequelize, DataTypes);

/**
 * useDiscount(discountId):
 * - find discount
 * - if end_time < now => status=expired => throw
 * - if status != active => throw
 * - if max_usage != null && usage_count >= max_usage => throw
 * - usage_count++
 */
exports.useDiscount = async (discountId) => {
  const discount = await Discount.findByPk(discountId);
  if (!discount) {
    const err = new Error(`Discount with ID ${discountId} not found.`);
    err.statusCode = 404;
    throw err;
  }

  // Check if end_time < now => expired
  if (discount.end_time && discount.end_time < new Date()) {
    discount.status = 'expired';
    await discount.save();
    const err = new Error(`Discount ${discountId} is expired.`);
    err.statusCode = 400;
    throw err;
  }

  // Must be active
  if (discount.status !== 'active') {
    const err = new Error(`Discount ${discountId} is not active (status=${discount.status}).`);
    err.statusCode = 400;
    throw err;
  }

  // If max_usage is set => usage_count must be < max_usage
  if (discount.max_usage !== null && discount.usage_count >= discount.max_usage) {
    const err = new Error(`Discount has reached max usage.`);
    err.statusCode = 400;
    throw err;
  }

  // usage_count++
  discount.usage_count += 1;
  await discount.save();

  return discount;
};
