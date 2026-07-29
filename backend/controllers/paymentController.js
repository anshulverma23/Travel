const crypto = require("crypto");
const asyncHandler = require("express-async-handler");
const Razorpay = require("razorpay");
const Stripe = require("stripe");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");

// Both SDKs are instantiated lazily (on first actual use) instead of at module load.
// Razorpay in particular throws synchronously in its constructor if the key is missing,
// which would otherwise crash the whole server at boot before .env is fully configured.
let razorpayInstance = null;
const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    const err = new Error("Razorpay is not configured - set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env");
    err.statusCode = 503;
    throw err;
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpayInstance;
};

let stripeInstance = null;
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    const err = new Error("Stripe is not configured - set STRIPE_SECRET_KEY in .env");
    err.statusCode = 503;
    throw err;
  }
  if (!stripeInstance) stripeInstance = Stripe(process.env.STRIPE_SECRET_KEY);
  return stripeInstance;
};

// @desc    Create a Razorpay order for a booking
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized for this booking");
  }
  if (booking.paymentStatus === "paid") {
    res.status(400);
    throw new Error("Booking is already paid for");
  }

  const order = await getRazorpay().orders.create({
    amount: booking.pricing.totalAmount * 100, // paise
    currency: "INR",
    receipt: booking.invoiceNumber,
  });

  const payment = await Payment.create({
    booking: booking._id,
    user: req.user._id,
    gateway: "razorpay",
    razorpayOrderId: order.id,
    amount: booking.pricing.totalAmount,
    currency: "INR",
    status: "created",
  });

  booking.payment = payment._id;
  await booking.save();

  res.status(201).json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// @desc    Verify a Razorpay payment signature after checkout completes on the client
// @route   POST /api/payment/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error("Payment verification failed - signature mismatch");
  }

  const payment = await Payment.findOneAndUpdate(
    { razorpayOrderId: razorpay_order_id },
    {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "paid",
    },
    { new: true }
  );

  const booking = await Booking.findByIdAndUpdate(
    bookingId,
    { paymentStatus: "paid", bookingStatus: "confirmed" },
    { new: true }
  ).populate("user", "name email");

  if (booking) {
    await sendEmail({
      to: booking.user.email,
      subject: `Booking Confirmed - ${booking.invoiceNumber}`,
      html: emailTemplates.bookingConfirmation(booking.user.name, booking),
    });
  }

  res.status(200).json({ success: true, message: "Payment verified successfully", booking, payment });
});

// @desc    Create a Stripe PaymentIntent for a booking (alternative gateway)
// @route   POST /api/payment/stripe/create-intent
// @access  Private
const createStripeIntent = asyncHandler(async (req, res) => {
  const { bookingId } = req.body;
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized for this booking");
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: booking.pricing.totalAmount * 100, // smallest currency unit
    currency: "inr",
    metadata: { bookingId: booking._id.toString(), invoiceNumber: booking.invoiceNumber },
  });

  const payment = await Payment.create({
    booking: booking._id,
    user: req.user._id,
    gateway: "stripe",
    stripePaymentIntentId: paymentIntent.id,
    stripeClientSecret: paymentIntent.client_secret,
    amount: booking.pricing.totalAmount,
    currency: "INR",
    status: "created",
  });

  booking.payment = payment._id;
  await booking.save();

  res.status(201).json({ success: true, clientSecret: paymentIntent.client_secret });
});

// @desc    Stripe webhook - confirms payment success server-side
// @route   POST /api/payment/stripe/webhook
// @access  Public (verified via Stripe signature)
const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = getStripe().webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    res.status(400);
    throw new Error(`Webhook signature verification failed: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const payment = await Payment.findOneAndUpdate(
      { stripePaymentIntentId: intent.id },
      { status: "paid" },
      { new: true }
    );
    if (payment) {
      await Booking.findByIdAndUpdate(payment.booking, {
        paymentStatus: "paid",
        bookingStatus: "confirmed",
      });
    }
  }

  res.status(200).json({ received: true });
});

// @desc    Refund a payment (admin)
// @route   POST /api/payment/:paymentId/refund
// @access  Private/Admin
const refundPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.paymentId);
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }
  if (payment.status !== "paid") {
    res.status(400);
    throw new Error("Only paid payments can be refunded");
  }

  if (payment.gateway === "razorpay") {
    const refund = await getRazorpay().payments.refund(payment.razorpayPaymentId, {
      amount: (req.body.amount || payment.amount) * 100,
    });
    payment.refundId = refund.id;
  } else {
    const refund = await getStripe().refunds.create({ payment_intent: payment.stripePaymentIntentId });
    payment.refundId = refund.id;
  }

  payment.status = "refunded";
  payment.refundAmount = req.body.amount || payment.amount;
  await payment.save();

  await Booking.findByIdAndUpdate(payment.booking, { paymentStatus: "refunded", bookingStatus: "cancelled" });

  res.status(200).json({ success: true, message: "Refund processed successfully", payment });
});

module.exports = {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createStripeIntent,
  stripeWebhook,
  refundPayment,
};
