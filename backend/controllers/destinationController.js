const asyncHandler = require("express-async-handler");
const axios = require("axios");
const Destination = require("../models/Destination");
const Hotel = require("../models/Hotel");
const Package = require("../models/Package");
const { deleteImage } = require("../config/cloudinary");

// @desc    Get all destinations (search + pagination)
// @route   GET /api/destinations?search=&state=&tag=&page=&limit=
// @access  Public
const getDestinations = asyncHandler(async (req, res) => {
  const { search, state, tag, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };
  if (state) query.state = new RegExp(state, "i");
  if (tag) query.tags = tag;
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const destinations = await Destination.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
  const total = await Destination.countDocuments(query);

  res.status(200).json({
    success: true,
    count: destinations.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    destinations,
  });
});

// @desc    Get a single destination with nearby hotels + packages + live weather
// @route   GET /api/destinations/:id
// @access  Public
const getDestinationById = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const [hotels, packages] = await Promise.all([
    Hotel.find({ destination: destination._id, isActive: true }).limit(6),
    Package.find({ destination: destination._id, isActive: true }).limit(6),
  ]);

  res.status(200).json({ success: true, destination, hotels, packages });
});

// @desc    Get live weather for a destination (OpenWeatherMap)
// @route   GET /api/destinations/:id/weather
// @access  Public
const getDestinationWeather = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  if (!process.env.OPENWEATHER_API_KEY) {
    return res.status(200).json({
      success: false,
      message: "Weather API key not configured on the server",
    });
  }

  try {
    const { data } = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
      params: {
        q: `${destination.city},IN`,
        appid: process.env.OPENWEATHER_API_KEY,
        units: "metric",
      },
    });

    res.status(200).json({
      success: true,
      weather: {
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        condition: data.weather[0]?.description,
        icon: data.weather[0]?.icon,
        humidity: data.main.humidity,
      },
    });
  } catch (error) {
    res.status(200).json({ success: false, message: "Could not fetch live weather right now" });
  }
});

// @desc    Create a destination
// @route   POST /api/destinations
// @access  Private/Admin
const createDestination = asyncHandler(async (req, res) => {
  const gallery = (req.files || []).map((f) => ({ url: f.path, public_id: f.filename }));

  const destination = await Destination.create({
    ...req.body,
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    gallery,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, destination });
});

// @desc    Update a destination
// @route   PUT /api/destinations/:id
// @access  Private/Admin
const updateDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  const updates = { ...req.body };
  if (updates.tags && typeof updates.tags === "string") updates.tags = JSON.parse(updates.tags);
  if (req.files?.length) {
    updates.gallery = [...destination.gallery, ...req.files.map((f) => ({ url: f.path, public_id: f.filename }))];
  }

  Object.assign(destination, updates);
  await destination.save();

  res.status(200).json({ success: true, destination });
});

// @desc    Delete a destination
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
const deleteDestination = asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);
  if (!destination) {
    res.status(404);
    throw new Error("Destination not found");
  }

  await Promise.all(destination.gallery.map((img) => deleteImage(img.public_id)));
  await destination.deleteOne();

  res.status(200).json({ success: true, message: "Destination deleted successfully" });
});

module.exports = {
  getDestinations,
  getDestinationById,
  getDestinationWeather,
  createDestination,
  updateDestination,
  deleteDestination,
};
