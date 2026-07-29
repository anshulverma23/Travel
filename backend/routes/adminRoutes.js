const express = require("express");
const { getDashboardStats, getRevenueReport, getBookingReport } = require("../controllers/adminController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");

const router = express.Router();

router.use(protect, admin); // every route below requires an admin

router.get("/dashboard", getDashboardStats);
router.get("/reports/revenue", getRevenueReport);
router.get("/reports/bookings", getBookingReport);

module.exports = router;
