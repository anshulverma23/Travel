const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  googleAuth,
  forgotPassword,
  resetPassword,
  verifyEmail,
  changePassword,
  getMe,
  logoutUser,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Slow down brute-force attempts on login/forgot-password
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: "Too many attempts, please try again later" },
});

router.post("/register", registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/google", googleAuth);
router.post("/forgot-password", authLimiter, forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/verify-email/:token", verifyEmail);
router.put("/change-password", protect, changePassword);
router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

module.exports = router;
