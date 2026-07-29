const express = require("express");
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  checkAvailability,
} = require("../controllers/hotelController");
const { getRoomsByHotel, createRoom, updateRoom, deleteRoom } = require("../controllers/roomController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { makeUploader } = require("../config/cloudinary");

const router = express.Router();
const uploadHotelImages = makeUploader("hotels");
const uploadRoomImages = makeUploader("rooms");

router.get("/", getHotels);
router.post("/", protect, admin, uploadHotelImages.array("images", 8), createHotel);

router.get("/:id", getHotelById);
router.put("/:id", protect, admin, uploadHotelImages.array("images", 8), updateHotel);
router.delete("/:id", protect, admin, deleteHotel);

router.get("/:id/availability", checkAvailability);

// Nested room routes: /api/hotels/:hotelId/rooms
router.get("/:hotelId/rooms", getRoomsByHotel);
router.post("/:hotelId/rooms", protect, admin, uploadRoomImages.array("images", 6), createRoom);
router.put("/:hotelId/rooms/:roomId", protect, admin, uploadRoomImages.array("images", 6), updateRoom);
router.delete("/:hotelId/rooms/:roomId", protect, admin, deleteRoom);

module.exports = router;
