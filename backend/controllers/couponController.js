const asyncHandler = require("express-async-handler");
const Coupon = require("../models/Coupon");

// @desc    Validate a coupon against a purchase amount (used at checkout)
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, amount, bookingType } = req.body;

  const coupon = await Coupon.findOne({ code: code?.toUpperCase() });
  if (!coupon) {
    res.status(404);
    throw new Error("Invalid coupon code");
  }

  const result = coupon.calculateDiscount(Number(amount), bookingType);
  if (!result.valid) {
    res.status(400);
    throw new Error(result.message);
  }

  res.status(200).json({ success: true, discount: result.discount, coupon: coupon.code });
});

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, count: coupons.length, coupons });
});

// @desc    Create a coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json({ success: true, coupon });
});

// @desc    Update a coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.status(200).json({ success: true, coupon });
});

// @desc    Delete a coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.status(200).json({ success: true, message: "Coupon deleted successfully" });
});

module.exports = { validateCoupon, getCoupons, createCoupon, updateCoupon, deleteCoupon };
