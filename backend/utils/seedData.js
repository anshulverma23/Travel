// Populates a fresh database with an admin account + a handful of destinations,
// hotels, rooms, packages and a sample coupon, so the site isn't empty on first run.
// Run with: npm run seed
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("../config/database");
const User = require("../models/User");
const Destination = require("../models/Destination");
const Hotel = require("../models/Hotel");
const Room = require("../models/Room");
const Package = require("../models/Package");
const Coupon = require("../models/Coupon");

const seed = async () => {
  await connectDB();

  console.log("Clearing existing seed-able collections...");
  await Promise.all([
    Destination.deleteMany(),
    Hotel.deleteMany(),
    Room.deleteMany(),
    Package.deleteMany(),
    Coupon.deleteMany(),
  ]);

  console.log("Creating admin user...");
  let admin = await User.findOne({ email: "admin@indiatravel.com" });
  if (!admin) {
    admin = await User.create({
      name: "Admin",
      email: "admin@indiatravel.com",
      password: "Admin@123", // change this immediately after first login
      role: "admin",
      isEmailVerified: true,
    });
  }

  console.log("Creating destinations...");
  const destinationsData = [
    {
      name: "Jaipur - The Pink City",
      country: "India",
      state: "Rajasthan",
      city: "Jaipur",
      description:
        "Jaipur dazzles with pink sandstone forts, opulent palaces and vibrant bazaars steeped in Rajput history.",
      bestTimeToVisit: "October to March",
      tags: ["Heritage", "Culture"],
      coordinates: { lat: 26.9124, lng: 75.7873 },
      createdBy: admin._id,
    },
    {
      name: "Kerala Backwaters",
      country: "India",
      state: "Kerala",
      city: "Alleppey",
      description:
        "Cruise through tranquil palm-lined backwaters on a traditional houseboat and explore spice-scented villages.",
      bestTimeToVisit: "September to March",
      tags: ["Nature", "Relaxation"],
      coordinates: { lat: 9.4981, lng: 76.3388 },
      createdBy: admin._id,
    },
    {
      name: "Goa Beaches",
      country: "India",
      state: "Goa",
      city: "Panaji",
      description: "Golden beaches, Portuguese heritage, and a legendary nightlife along the Arabian Sea coast.",
      bestTimeToVisit: "November to February",
      tags: ["Beach", "Nightlife"],
      coordinates: { lat: 15.4909, lng: 73.8278 },
      createdBy: admin._id,
    },
    {
      name: "Manali - Himalayan Retreat",
      country: "India",
      state: "Himachal Pradesh",
      city: "Manali",
      description: "Snow-capped peaks, pine forests and adventure sports in the lap of the Himalayas.",
      bestTimeToVisit: "March to June, December to February",
      tags: ["Adventure", "Hill Station"],
      coordinates: { lat: 32.2432, lng: 77.1892 },
      createdBy: admin._id,
    },
  ];
  const destinations = await Destination.insertMany(destinationsData);
  const [jaipur, kerala, goa, manali] = destinations;

  console.log("Creating hotels + rooms...");
  const hotelsData = [
    {
      name: "Rambagh Heritage Palace",
      description: "A restored royal palace offering regal suites, courtyard dining and a spa fit for maharajas.",
      location: { address: "Bhawani Singh Rd", city: "Jaipur", state: "Rajasthan", country: "India" },
      amenities: ["WiFi", "Pool", "Spa", "Parking", "Breakfast"],
      hotelType: "Heritage",
      destination: jaipur._id,
      createdBy: admin._id,
      rooms: [
        { roomType: "Deluxe", price: 6500, capacity: 2, totalRooms: 10 },
        { roomType: "Suite", price: 12000, capacity: 3, totalRooms: 5 },
      ],
    },
    {
      name: "Backwater Bliss Resort",
      description: "Waterfront cottages with private decks overlooking the Alleppey backwaters.",
      location: { address: "Punnamada Rd", city: "Alleppey", state: "Kerala", country: "India" },
      amenities: ["WiFi", "Ayurveda Spa", "Restaurant", "Houseboat Tours"],
      hotelType: "Resort",
      destination: kerala._id,
      createdBy: admin._id,
      rooms: [{ roomType: "Double", price: 4500, capacity: 2, totalRooms: 12 }],
    },
    {
      name: "Sunset Sands Beach Resort",
      description: "Beachfront rooms just steps from the sand, with a lively pool bar and water sports desk.",
      location: { address: "Calangute Beach Rd", city: "Panaji", state: "Goa", country: "India" },
      amenities: ["WiFi", "Pool", "Beach Access", "Bar"],
      hotelType: "Resort",
      destination: goa._id,
      createdBy: admin._id,
      rooms: [{ roomType: "Double", price: 3800, capacity: 2, totalRooms: 20 }],
    },
    {
      name: "Snowline Mountain Lodge",
      description: "Cozy wooden lodge rooms with valley views, a bonfire deck, and easy access to Solang Valley.",
      location: { address: "Old Manali Rd", city: "Manali", state: "Himachal Pradesh", country: "India" },
      amenities: ["WiFi", "Bonfire", "Mountain View", "Parking"],
      hotelType: "Standard",
      destination: manali._id,
      createdBy: admin._id,
      rooms: [{ roomType: "Twin", price: 2800, capacity: 2, totalRooms: 15 }],
    },
  ];

  for (const { rooms, ...hotelFields } of hotelsData) {
    const hotel = await Hotel.create(hotelFields);
    await Room.insertMany(rooms.map((r) => ({ ...r, hotel: hotel._id })));
  }

  console.log("Creating tour packages...");
  await Package.insertMany([
    {
      name: "Golden Triangle Classic",
      description: "Delhi, Agra & Jaipur - the perfect introduction to India's rich heritage and the Taj Mahal.",
      destination: jaipur._id,
      duration: { days: 6, nights: 5 },
      price: 25999,
      itinerary: [
        { day: 1, title: "Arrive in Delhi", description: "City tour of Old & New Delhi." },
        { day: 2, title: "Delhi to Agra", description: "Visit the Taj Mahal at sunrise." },
        { day: 3, title: "Agra to Jaipur", description: "En route stop at Fatehpur Sikri." },
      ],
      included: ["Hotel stay", "Breakfast", "AC transport", "Guide"],
      excluded: ["Flights", "Personal expenses"],
      packageType: "Cultural",
      maxGroupSize: 15,
      createdBy: admin._id,
    },
    {
      name: "Kerala Backwater Bliss",
      description: "Cruise through serene backwaters, explore spice plantations, and unwind with Ayurveda.",
      destination: kerala._id,
      duration: { days: 5, nights: 4 },
      price: 32999,
      itinerary: [
        { day: 1, title: "Arrive in Kochi", description: "Explore Fort Kochi." },
        { day: 2, title: "Kochi to Alleppey", description: "Board your houseboat." },
      ],
      included: ["Houseboat stay", "All meals", "Ayurvedic massage"],
      excluded: ["Flights", "Tips"],
      packageType: "Family",
      maxGroupSize: 10,
      createdBy: admin._id,
    },
    {
      name: "Himalayan Adventure",
      description: "Trek through breathtaking mountain passes and experience Himachali culture.",
      destination: manali._id,
      duration: { days: 7, nights: 6 },
      price: 28999,
      itinerary: [{ day: 1, title: "Arrive in Manali", description: "Acclimatization & local sightseeing." }],
      included: ["Camping gear", "Trekking guide", "All meals during trek"],
      excluded: ["Personal trekking gear", "Insurance"],
      packageType: "Adventure",
      maxGroupSize: 12,
      createdBy: admin._id,
    },
  ]);

  console.log("Creating a sample coupon...");
  await Coupon.create({
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    minPurchaseAmount: 1000,
    maxDiscountAmount: 2000,
    applicableOn: "all",
    expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    usageLimit: 500,
    createdBy: admin._id,
  });

  console.log("Seed complete! Admin login -> admin@indiatravel.com / Admin@123");
  await mongoose.connection.close();
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
