const asyncHandler = require("express-async-handler");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const { deleteImage } = require("../config/cloudinary");

// @desc    Get all hotels with search + filters + pagination
// @route   GET /api/hotels?city=&country=&minPrice=&maxPrice=&rating=&hotelType=&amenities=&search=&page=&limit=
// @access  Public
const getHotels = asyncHandler(async (req, res) => {
  const { city, country, rating, hotelType, amenities, search, page = 1, limit = 12 } = req.query;

  const query = { isActive: true };
  if (city) query["location.city"] = new RegExp(city, "i");
  if (country) query["location.country"] = new RegExp(country, "i");
  if (hotelType) query.hotelType = hotelType;
  if (rating) query.rating = { $gte: Number(rating) };
  if (amenities) query.amenities = { $all: amenities.split(",") };
  if (search) query.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);

  let hotels = await Hotel.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  // Optional price filtering: join against the cheapest room per hotel
  if (req.query.minPrice || req.query.maxPrice) {
    const hotelIds = hotels.map((h) => h._id);
    const priceMatch = {};
    if (req.query.minPrice) priceMatch.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) priceMatch.$lte = Number(req.query.maxPrice);

    const rooms = await Room.find({ hotel: { $in: hotelIds }, price: priceMatch });
    const hotelIdsWithMatchingRoom = new Set(rooms.map((r) => r.hotel.toString()));
    hotels = hotels.filter((h) => hotelIdsWithMatchingRoom.has(h._id.toString()));
  }

  const total = await Hotel.countDocuments(query);

  // Attach a "starting from" price per hotel (cheapest room) for display in listing cards
  const hotelIdsForPricing = hotels.map((h) => h._id);
  const cheapestRooms = await Room.aggregate([
    { $match: { hotel: { $in: hotelIdsForPricing } } },
    { $group: { _id: "$hotel", minPrice: { $min: "$price" } } },
  ]);
  const priceMap = Object.fromEntries(cheapestRooms.map((r) => [r._id.toString(), r.minPrice]));
  hotels = hotels.map((h) => ({ ...h, minPrice: priceMap[h._id.toString()] ?? null }));

  res.status(200).json({
    success: true,
    count: hotels.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
    hotels,
  });
});

// @desc    Get a single hotel with its rooms
// @route   GET /api/hotels/:id
// @access  Public
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate("destination", "name city state");
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  const rooms = await Room.find({ hotel: hotel._id });

  res.status(200).json({ success: true, hotel, rooms });
});

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
const createHotel = asyncHandler(async (req, res) => {
  const images = (req.files || []).map((f) => ({ url: f.path, public_id: f.filename }));

  const hotel = await Hotel.create({
    ...req.body,
    amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
    location: typeof req.body.location === "string" ? JSON.parse(req.body.location) : req.body.location,
    images,
    createdBy: req.user._id,
  });

  res.status(201).json({ success: true, hotel });
});

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
const updateHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  const updates = { ...req.body };
  if (updates.amenities && typeof updates.amenities === "string") updates.amenities = JSON.parse(updates.amenities);
  if (updates.location && typeof updates.location === "string") updates.location = JSON.parse(updates.location);

  if (req.files?.length) {
    updates.images = [...hotel.images, ...req.files.map((f) => ({ url: f.path, public_id: f.filename }))];
  }

  Object.assign(hotel, updates);
  await hotel.save();

  res.status(200).json({ success: true, hotel });
});

// @desc    Delete a hotel (and its rooms + images)
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
const deleteHotel = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  await Promise.all(hotel.images.map((img) => deleteImage(img.public_id)));
  await Room.deleteMany({ hotel: hotel._id });
  await hotel.deleteOne();

  res.status(200).json({ success: true, message: "Hotel deleted successfully" });
});

// @desc    Check room availability for a date range
// @route   GET /api/hotels/:id/availability?roomId=&checkIn=&checkOut=&rooms=
// @access  Public
const checkAvailability = asyncHandler(async (req, res) => {
  const { roomId, checkIn, checkOut, rooms = 1 } = req.query;

  const room = await Room.findOne({ _id: roomId, hotel: req.params.id });
  if (!room) {
    res.status(404);
    throw new Error("Room not found for this hotel");
  }

  // Sum rooms already booked that overlap with the requested date range
  const overlapping = await Booking.aggregate([
    {
      $match: {
        room: room._id,
        bookingStatus: { $ne: "cancelled" },
        checkIn: { $lt: new Date(checkOut) },
        checkOut: { $gt: new Date(checkIn) },
      },
    },
    { $group: { _id: null, bookedRooms: { $sum: "$numberOfRooms" } } },
  ]);

  const bookedRooms = overlapping[0]?.bookedRooms || 0;
  const availableRooms = room.totalRooms - bookedRooms;

  res.status(200).json({
    success: true,
    available: availableRooms >= Number(rooms),
    availableRooms: Math.max(availableRooms, 0),
  });
});

module.exports = {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  checkAvailability,
};
