const express = require("express");
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
  generateInvoice,
  applyCoupon,
} = require("../controllers/bookingController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/", protect, admin, getAllBookings); // admin: all bookings
router.get("/my", protect, getMyBookings); // user: my bookings

router.get("/:id", protect, getBookingById);
router.get("/:id/invoice", protect, generateInvoice);
router.put("/:id/apply-coupon", protect, applyCoupon);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/status", protect, admin, updateBookingStatus);

module.exports = router;
