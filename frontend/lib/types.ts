export interface CloudImage {
  url: string
  public_id: string
}

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  avatar?: CloudImage
  role: "user" | "admin"
  isEmailVerified: boolean
  isActive?: boolean
  createdAt?: string
}

export interface Hotel {
  _id: string
  name: string
  description: string
  images: CloudImage[]
  location: {
    address: string
    city: string
    state?: string
    country: string
    coordinates?: { lat: number; lng: number }
  }
  amenities: string[]
  hotelType: string
  destination?: string | Destination
  rating: number
  numReviews: number
  isActive: boolean
  minPrice?: number | null
  createdAt?: string
}

export interface Room {
  _id: string
  hotel: string
  roomType: string
  price: number
  capacity: number
  totalRooms: number
  amenities: string[]
  images: CloudImage[]
  isAvailable: boolean
}

export interface Destination {
  _id: string
  name: string
  country: string
  state: string
  city: string
  description: string
  gallery: CloudImage[]
  coordinates?: { lat: number; lng: number }
  bestTimeToVisit?: string
  tags: string[]
  isActive: boolean
}

export interface ItineraryDay {
  day: number
  title: string
  description?: string
}

export interface TourPackage {
  _id: string
  name: string
  description: string
  destination: string | Destination
  duration: { days: number; nights: number }
  price: number
  itinerary: ItineraryDay[]
  included: string[]
  excluded: string[]
  gallery: CloudImage[]
  packageType: string
  maxGroupSize: number
  startDates: string[]
  rating: number
  numReviews: number
  isActive: boolean
}

export interface Booking {
  _id: string
  user: string | User
  bookingType: "hotel" | "package"
  hotel?: string | Hotel
  room?: string | Room
  numberOfRooms?: number
  checkIn?: string
  checkOut?: string
  package?: string | TourPackage
  travelDate?: string
  guests: { adults: number; children: number }
  pricing: { basePrice: number; discount: number; tax: number; totalAmount: number }
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  bookingStatus: "pending" | "confirmed" | "cancelled" | "completed"
  invoiceNumber: string
  specialRequests?: string
  createdAt: string
}

export interface Review {
  _id: string
  user: { _id: string; name: string; avatar?: CloudImage } | string
  targetType: "hotel" | "package"
  hotel?: string | { _id: string; name: string }
  package?: string | { _id: string; name: string }
  rating: number
  comment: string
  images: CloudImage[]
  isVerifiedBooking: boolean
  createdAt: string
}

export interface Coupon {
  _id: string
  code: string
  discountType: "percentage" | "flat"
  discountValue: number
  minPurchaseAmount: number
  maxDiscountAmount?: number
  applicableOn: "all" | "hotel" | "package"
  expiryDate: string
  usageLimit: number
  usedCount: number
  isActive: boolean
}

export interface WishlistItem {
  itemType: "Hotel" | "Package"
  item: Hotel | TourPackage
  addedAt: string
}

export interface Wishlist {
  _id: string
  user: string
  items: WishlistItem[]
}

export interface PaginatedResponse<T> {
  success: boolean
  count: number
  total: number
  page: number
  pages: number
  [key: string]: unknown | T[]
}
