const express = require("express");
const {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeIntent,
  stripeWebhook,
  refundPayment,
} = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/create-order", protect, createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);

router.post("/stripe/create-intent", protect, createStripeIntent);
// NOTE: Stripe webhook needs the raw request body - it's mounted with express.raw()
// directly in server.js BEFORE the global express.json() middleware.
router.post("/stripe/webhook", stripeWebhook);

router.post("/:paymentId/refund", protect, admin, refundPayment);

module.exports = router;
