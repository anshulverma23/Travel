const asyncHandler = require("express-async-handler");
const Room = require("../models/Room");
const Hotel = require("../models/Hotel");
const { deleteImage } = require("../config/cloudinary");

// @desc    Get all rooms for a hotel
// @route   GET /api/hotels/:hotelId/rooms
// @access  Public
const getRoomsByHotel = asyncHandler(async (req, res) => {
  const rooms = await Room.find({ hotel: req.params.hotelId });
  res.status(200).json({ success: true, count: rooms.length, rooms });
});

// @desc    Add a room to a hotel
// @route   POST /api/hotels/:hotelId/rooms
// @access  Private/Admin
const createRoom = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.hotelId);
  if (!hotel) {
    res.status(404);
    throw new Error("Hotel not found");
  }

  const images = (req.files || []).map((f) => ({ url: f.path, public_id: f.filename }));

  const room = await Room.create({
    ...req.body,
    amenities: req.body.amenities ? JSON.parse(req.body.amenities) : [],
    hotel: hotel._id,
    images,
  });

  res.status(201).json({ success: true, room });
});

// @desc    Update a room
// @route   PUT /api/hotels/:hotelId/rooms/:roomId
// @access  Private/Admin
const updateRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ _id: req.params.roomId, hotel: req.params.hotelId });
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  const updates = { ...req.body };
  if (updates.amenities && typeof updates.amenities === "string") updates.amenities = JSON.parse(updates.amenities);

  if (req.files?.length) {
    updates.images = [...room.images, ...req.files.map((f) => ({ url: f.path, public_id: f.filename }))];
  }

  Object.assign(room, updates);
  await room.save();

  res.status(200).json({ success: true, room });
});

// @desc    Delete a room
// @route   DELETE /api/hotels/:hotelId/rooms/:roomId
// @access  Private/Admin
const deleteRoom = asyncHandler(async (req, res) => {
  const room = await Room.findOne({ _id: req.params.roomId, hotel: req.params.hotelId });
  if (!room) {
    res.status(404);
    throw new Error("Room not found");
  }

  await Promise.all(room.images.map((img) => deleteImage(img.public_id)));
  await room.deleteOne();

  res.status(200).json({ success: true, message: "Room deleted successfully" });
});

module.exports = { getRoomsByHotel, createRoom, updateRoom, deleteRoom };
