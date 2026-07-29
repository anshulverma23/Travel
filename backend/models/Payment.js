const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    gateway: { type: String, enum: ["razorpay", "stripe"], required: true },

    // Razorpay fields
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },

    // Stripe fields
    stripePaymentIntentId: { type: String },
    stripeClientSecret: { type: String },

    amount: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    status: {
      type: String,
      enum: ["created", "paid", "failed", "refunded"],
      default: "created",
    },
    refundId: { type: String },
    refundAmount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);
