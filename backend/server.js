const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

dotenv.config();

const connectDB = require("./config/database");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Route modules
const authRoutes = require("./routes/authRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const destinationRoutes = require("./routes/destinationRoutes");
const packageRoutes = require("./routes/packageRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const couponRoutes = require("./routes/couponRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes");

connectDB();

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://travel-gilt-five.vercel.app/",
    credentials: true,
  })
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(cookieParser());

// Stripe webhook needs the RAW body for signature verification, so it's mounted
// before express.json() strips/parses the body.
app.use("/api/payment/stripe/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => res.status(200).json({ success: true, message: "API is running" }));

app.use("/api/auth", authRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || travel-i8wm.onrender.com ;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

module.exports = app;
