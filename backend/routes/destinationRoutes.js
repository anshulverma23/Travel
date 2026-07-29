const express = require("express");
const {
  getDestinations,
  getDestinationById,
  getDestinationWeather,
  createDestination,
  updateDestination,
  deleteDestination,
} = require("../controllers/destinationController");
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/adminMiddleware");
const { makeUploader } = require("../config/cloudinary");

const router = express.Router();
const uploadGallery = makeUploader("destinations");

router.get("/", getDestinations);
router.post("/", protect, admin, uploadGallery.array("gallery", 10), createDestination);

router.get("/:id", getDestinationById);
router.put("/:id", protect, admin, uploadGallery.array("gallery", 10), updateDestination);
router.delete("/:id", protect, admin, deleteDestination);

router.get("/:id/weather", getDestinationWeather);

module.exports = router;
