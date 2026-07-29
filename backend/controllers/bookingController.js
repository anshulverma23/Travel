const asyncHandler = require("express-async-handler");
const PDFDocument = require("pdfkit");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const Package = require("../models/Package");
const Coupon = require("../models/Coupon");
const { sendEmail, emailTemplates } = require("../utils/sendEmail");

const TAX_RATE = 0.05; // 5% GST-style tax, adjust to taste

const nightsBetween = (checkIn, checkOut) =>
  Math.max(1, Math.round((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)));

// @desc    Create a new booking (hotel or package) - status stays "pending" until payment is verified
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { bookingType, hotelId, roomId, checkIn, checkOut, numberOfRooms = 1, packageId, travelDate, guests, couponCode, specialRequests } = req.body;

  let basePrice = 0;
  const bookingData = {
    user: req.user._id,
    bookingType,
    guests: guests || { adults: 1, children: 0 },
    specialRequests,
  };

  if (bookingType === "hotel") {
    const room = await Room.findById(roomId);
    if (!room) {
      res.status(404);
      throw new Error("Room not found");
    }
    const nights = nightsBetween(checkIn, checkOut);
    basePrice = room.price * nights * Number(numberOfRooms);

    Object.assign(bookingData, {
      hotel: hotelId,
      room: roomId,
      checkIn,
      checkOut,
      numberOfRooms,
    });
  } else if (bookingType === "package") {
    const pkg = await Package.findById(packageId);
    if (!pkg) {
      res.status(404);
      throw new Error("Package not found");
    }
    const totalGuests = (guests?.adults || 1) + (guests?.children || 0);
    basePrice = pkg.price * totalGuests;

    Object.assign(bookingData, { package: packageId, travelDate });
  } else {
    res.status(400);
    throw new Error("bookingType must be 'hotel' or 'package'");
  }

  let discount = 0;
  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      res.status(400);
      throw new Error("Invalid coupon code");
    }
    const result = coupon.calculateDiscount(basePrice, bookingType);
    if (!result.valid) {
      res.status(400);
      throw new Error(result.message);
    }
    discount = result.discount;
  }

  const taxableAmount = basePrice - discount;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const totalAmount = taxableAmount + tax;

  bookingData.coupon = coupon?._id;
  bookingData.pricing = { basePrice, discount, tax, totalAmount };

  const booking = await Booking.create(bookingData);

  res.status(201).json({ success: true, booking });
});

// @desc    Get the logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("hotel", "name images location")
    .populate("room", "roomType price")
    .populate("package", "name gallery")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: bookings.length, bookings });
});

// @desc    Get a single booking by id (owner or admin only)
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("hotel")
    .populate("room")
    .populate("package")
    .populate("user", "name email phone")
    .populate("coupon", "code discountType discountValue");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this booking");
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to cancel this booking");
  }
  if (booking.bookingStatus === "cancelled") {
    res.status(400);
    throw new Error("Booking is already cancelled");
  }

  booking.bookingStatus = "cancelled";
  await booking.save();

  res.status(200).json({ success: true, message: "Booking cancelled", booking });
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings?status=&page=&limit=
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;
  const query = {};
  if (status) query.bookingStatus = status;

  const skip = (Number(page) - 1) * Number(limit);
  const bookings = await Booking.find(query)
    .populate("user", "name email")
    .populate("hotel", "name")
    .populate("package", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Booking.countDocuments(query);

  res.status(200).json({ success: true, count: bookings.length, total, bookings });
});

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { bookingStatus } = req.body;
  const booking = await Booking.findById(req.params.id).populate("user", "name email");
  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }

  booking.bookingStatus = bookingStatus;
  await booking.save();

  if (bookingStatus === "confirmed") {
    await sendEmail({
      to: booking.user.email,
      subject: `Booking Confirmed - ${booking.invoiceNumber}`,
      html: emailTemplates.bookingConfirmation(booking.user.name, booking),
    });
  }

  res.status(200).json({ success: true, booking });
});

// @desc    Generate a PDF invoice for a booking
// @route   GET /api/bookings/:id/invoice
// @access  Private
const generateInvoice = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate("user", "name email")
    .populate("hotel", "name location")
    .populate("package", "name");

  if (!booking) {
    res.status(404);
    throw new Error("Booking not found");
  }
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to view this invoice");
  }

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${booking.invoiceNumber}.pdf`);

  const doc = new PDFDocument({ margin: 50 });
  doc.pipe(res);

  doc.fontSize(20).text("India Travel - Invoice", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice #: ${booking.invoiceNumber}`);
  doc.text(`Date: ${new Date(booking.createdAt).toDateString()}`);
  doc.text(`Customer: ${booking.user.name} (${booking.user.email})`);
  doc.moveDown();

  if (booking.bookingType === "hotel") {
    doc.text(`Hotel: ${booking.hotel?.name || "N/A"}`);
    doc.text(`Check-in: ${new Date(booking.checkIn).toDateString()}`);
    doc.text(`Check-out: ${new Date(booking.checkOut).toDateString()}`);
    doc.text(`Rooms: ${booking.numberOfRooms}`);
  } else {
    doc.text(`Package: ${booking.package?.name || "N/A"}`);
    doc.text(`Travel Date: ${booking.travelDate ? new Date(booking.travelDate).toDateString() : "N/A"}`);
  }

  doc.moveDown();
  doc.text(`Base Price: ₹${booking.pricing.basePrice}`);
  doc.text(`Discount: -₹${booking.pricing.discount}`);
  doc.text(`Tax: ₹${booking.pricing.tax}`);
  doc.fontSize(14).text(`Total Amount: ₹${booking.pricing.totalAmount}`, { underline: true });
  doc.moveDown();
  doc.fontSize(10).text(`Payment Status: ${booking.paymentStatus.toUpperCase()}`);
  doc.text(`Booking Status: ${booking.bookingStatus.toUpperCase()}`);

  doc.end();
});

// @desc    Apply (or replace) a coupon on a pending booking, recalculating pricing
// @route   PUT /api/bookings/:id/apply-coupon
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { couponCode } = req.body;
  const booking = await Booking.findById(req.params.id);

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
    throw new Error("Cannot change the coupon on a booking that's already paid");
  }

  const basePrice = booking.pricing.basePrice;
  let discount = 0;
  let coupon = null;

  if (couponCode) {
    coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (!coupon) {
      res.status(400);
      throw new Error("Invalid coupon code");
    }
    const result = coupon.calculateDiscount(basePrice, booking.bookingType);
    if (!result.valid) {
      res.status(400);
      throw new Error(result.message);
    }
    discount = result.discount;
  }

  const taxableAmount = basePrice - discount;
  const tax = Math.round(taxableAmount * TAX_RATE);
  const totalAmount = taxableAmount + tax;

  booking.coupon = coupon?._id || undefined;
  booking.pricing = { basePrice, discount, tax, totalAmount };
  await booking.save();

  res.status(200).json({ success: true, booking });
});

module.exports = {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  generateInvoice,
  applyCoupon,
};
