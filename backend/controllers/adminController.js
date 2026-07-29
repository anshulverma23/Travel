const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Hotel = require("../models/Hotel");
const Destination = require("../models/Destination");
const Package = require("../models/Package");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");
const Review = require("../models/Review");

// @desc    Get high-level counts + revenue for the admin dashboard
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, hotels, destinations, packages, bookings, reviews, revenueAgg] = await Promise.all([
    User.countDocuments(),
    Hotel.countDocuments(),
    Destination.countDocuments(),
    Package.countDocuments(),
    Booking.countDocuments(),
    Review.countDocuments(),
    Payment.aggregate([{ $match: { status: "paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
  ]);

  const recentBookings = await Booking.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .limit(5);

  res.status(200).json({
    success: true,
    stats: {
      totalUsers: users,
      totalHotels: hotels,
      totalDestinations: destinations,
      totalPackages: packages,
      totalBookings: bookings,
      totalReviews: reviews,
      totalRevenue: revenueAgg[0]?.total || 0,
    },
    recentBookings,
  });
});

// @desc    Revenue grouped by month (for charts) - defaults to the last 12 months
// @route   GET /api/admin/reports/revenue
// @access  Private/Admin
const getRevenueReport = asyncHandler(async (req, res) => {
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const revenue = await Payment.aggregate([
    { $match: { status: "paid", createdAt: { $gte: twelveMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);

  res.status(200).json({ success: true, revenue });
});

// @desc    Booking counts grouped by type + status (for admin charts)
// @route   GET /api/admin/reports/bookings
// @access  Private/Admin
const getBookingReport = asyncHandler(async (req, res) => {
  const byStatus = await Booking.aggregate([{ $group: { _id: "$bookingStatus", count: { $sum: 1 } } }]);
  const byType = await Booking.aggregate([{ $group: { _id: "$bookingType", count: { $sum: 1 } } }]);

  res.status(200).json({ success: true, byStatus, byType });
});

module.exports = { getDashboardStats, getRevenueReport, getBookingReport };
