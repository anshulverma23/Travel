const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "flat"], required: true },
    discountValue: { type: Number, required: true },
    minPurchaseAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number }, // caps % discounts
    applicableOn: { type: String, enum: ["all", "hotel", "package"], default: "all" },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 100 },
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Validates a coupon against a purchase amount + booking type; returns { valid, discount, message }
couponSchema.methods.calculateDiscount = function (amount, bookingType) {
  if (!this.isActive) return { valid: false, message: "Coupon is not active" };
  if (new Date() > this.expiryDate) return { valid: false, message: "Coupon has expired" };
  if (this.usedCount >= this.usageLimit) return { valid: false, message: "Coupon usage limit reached" };
  if (this.applicableOn !== "all" && this.applicableOn !== bookingType) {
    return { valid: false, message: `Coupon is not applicable on ${bookingType} bookings` };
  }
  if (amount < this.minPurchaseAmount) {
    return { valid: false, message: `Minimum purchase of ₹${this.minPurchaseAmount} required` };
  }

  let discount =
    this.discountType === "percentage" ? (amount * this.discountValue) / 100 : this.discountValue;

  if (this.maxDiscountAmount) discount = Math.min(discount, this.maxDiscountAmount);
  discount = Math.min(discount, amount); // never discount more than the total

  return { valid: true, discount: Math.round(discount) };
};

module.exports = mongoose.model("Coupon", couponSchema);
