export const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://travel-i8wm.onrender.com/api"

const TOKEN_KEY = "india_travel_token"

export function getToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  if (typeof window === "undefined") return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  if (typeof window === "undefined") return
  localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

interface RequestOptions extends RequestInit {
  isFormData?: boolean
}

/**
 * Central fetch wrapper: attaches the JWT (if present), sets JSON headers unless
 * sending FormData, parses the response, and throws ApiError with the backend's
 * message on non-2xx responses so callers can catch a single error type.
 */
export async function apiRequest<T = unknown>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...(options.isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string>),
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  // Invoice downloads return a raw PDF blob, not JSON
  const contentType = res.headers.get("content-type") || ""
  if (!contentType.includes("application/json")) {
    if (!res.ok) throw new ApiError("Request failed", res.status)
    return res as unknown as T
  }

  const data = await res.json()
  if (!res.ok) {
    throw new ApiError(data.message || "Something went wrong", res.status)
  }
  return data as T
}

const qs = (params: Record<string, unknown>) => {
  const clean = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  return clean.length ? `?${new URLSearchParams(clean as [string, string][]).toString()}` : ""
}

// ---------------- Auth ----------------
export const authApi = {
  register: (body: { name: string; email: string; password: string; phone?: string }) =>
    apiRequest<{ token: string; user: import("./types").User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    apiRequest<{ token: string; user: import("./types").User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  google: (idToken: string) =>
    apiRequest<{ token: string; user: import("./types").User }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    }),
  forgotPassword: (email: string) =>
    apiRequest<{ message: string }>("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) }),
  resetPassword: (token: string, password: string) =>
    apiRequest<{ token: string; user: import("./types").User }>(`/auth/reset-password/${token}`, {
      method: "PUT",
      body: JSON.stringify({ password }),
    }),
  verifyEmail: (token: string) => apiRequest<{ message: string }>(`/auth/verify-email/${token}`),
  changePassword: (body: { currentPassword: string; newPassword: string }) =>
    apiRequest<{ message: string }>("/auth/change-password", { method: "PUT", body: JSON.stringify(body) }),
  me: () => apiRequest<{ user: import("./types").User }>("/auth/me"),
  logout: () => apiRequest<{ message: string }>("/auth/logout", { method: "POST" }),
}

// ---------------- Hotels ----------------
export const hotelApi = {
  list: (params: Record<string, unknown> = {}) => apiRequest<import("./types").PaginatedResponse<import("./types").Hotel>>(`/hotels${qs(params)}`),
  get: (id: string) => apiRequest<{ hotel: import("./types").Hotel; rooms: import("./types").Room[] }>(`/hotels/${id}`),
  checkAvailability: (hotelId: string, params: Record<string, unknown>) =>
    apiRequest<{ available: boolean; availableRooms: number }>(`/hotels/${hotelId}/availability${qs(params)}`),
  create: (formData: FormData) => apiRequest("/hotels", { method: "POST", body: formData, isFormData: true }),
  update: (id: string, formData: FormData) => apiRequest(`/hotels/${id}`, { method: "PUT", body: formData, isFormData: true }),
  remove: (id: string) => apiRequest(`/hotels/${id}`, { method: "DELETE" }),
  addRoom: (hotelId: string, formData: FormData) =>
    apiRequest(`/hotels/${hotelId}/rooms`, { method: "POST", body: formData, isFormData: true }),
  updateRoom: (hotelId: string, roomId: string, formData: FormData) =>
    apiRequest(`/hotels/${hotelId}/rooms/${roomId}`, { method: "PUT", body: formData, isFormData: true }),
  deleteRoom: (hotelId: string, roomId: string) => apiRequest(`/hotels/${hotelId}/rooms/${roomId}`, { method: "DELETE" }),
}

// ---------------- Destinations ----------------
export const destinationApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiRequest<import("./types").PaginatedResponse<import("./types").Destination>>(`/destinations${qs(params)}`),
  get: (id: string) =>
    apiRequest<{ destination: import("./types").Destination; hotels: import("./types").Hotel[]; packages: import("./types").TourPackage[] }>(
      `/destinations/${id}`
    ),
  weather: (id: string) =>
    apiRequest<{ success: boolean; weather?: { temp: number; feelsLike: number; condition: string; icon: string; humidity: number }; message?: string }>(
      `/destinations/${id}/weather`
    ),
  create: (formData: FormData) => apiRequest("/destinations", { method: "POST", body: formData, isFormData: true }),
  update: (id: string, formData: FormData) => apiRequest(`/destinations/${id}`, { method: "PUT", body: formData, isFormData: true }),
  remove: (id: string) => apiRequest(`/destinations/${id}`, { method: "DELETE" }),
}

// ---------------- Packages ----------------
export const packageApi = {
  list: (params: Record<string, unknown> = {}) =>
    apiRequest<import("./types").PaginatedResponse<import("./types").TourPackage>>(`/packages${qs(params)}`),
  get: (id: string) => apiRequest<{ package: import("./types").TourPackage }>(`/packages/${id}`),
  create: (formData: FormData) => apiRequest("/packages", { method: "POST", body: formData, isFormData: true }),
  update: (id: string, formData: FormData) => apiRequest(`/packages/${id}`, { method: "PUT", body: formData, isFormData: true }),
  remove: (id: string) => apiRequest(`/packages/${id}`, { method: "DELETE" }),
}

// ---------------- Bookings ----------------
export const bookingApi = {
  create: (body: Record<string, unknown>) =>
    apiRequest<{ booking: import("./types").Booking }>("/bookings", { method: "POST", body: JSON.stringify(body) }),
  my: () => apiRequest<{ bookings: import("./types").Booking[] }>("/bookings/my"),
  get: (id: string) => apiRequest<{ booking: import("./types").Booking }>(`/bookings/${id}`),
  cancel: (id: string) => apiRequest<{ booking: import("./types").Booking }>(`/bookings/${id}/cancel`, { method: "PUT" }),
  applyCoupon: (id: string, couponCode: string) =>
    apiRequest<{ booking: import("./types").Booking }>(`/bookings/${id}/apply-coupon`, {
      method: "PUT",
      body: JSON.stringify({ couponCode }),
    }),
  /** Downloads the PDF invoice via an authenticated fetch (a plain <a href> can't send the Bearer token). */
  downloadInvoice: async (id: string, invoiceNumber: string) => {
    const token = getToken()
    const res = await fetch(`${API_URL}/bookings/${id}/invoice`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
    if (!res.ok) throw new ApiError("Could not download invoice", res.status)
    const blob = await res.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${invoiceNumber}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  },
  adminList: (params: Record<string, unknown> = {}) =>
    apiRequest<import("./types").PaginatedResponse<import("./types").Booking>>(`/bookings${qs(params)}`),
  updateStatus: (id: string, bookingStatus: string) =>
    apiRequest<{ booking: import("./types").Booking }>(`/bookings/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ bookingStatus }),
    }),
}

// ---------------- Payments ----------------
export const paymentApi = {
  createRazorpayOrder: (bookingId: string) =>
    apiRequest<{ orderId: string; amount: number; currency: string; keyId: string }>("/payment/create-order", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    }),
  verifyRazorpay: (body: Record<string, unknown>) =>
    apiRequest<{ booking: import("./types").Booking }>("/payment/verify", { method: "POST", body: JSON.stringify(body) }),
  createStripeIntent: (bookingId: string) =>
    apiRequest<{ clientSecret: string }>("/payment/stripe/create-intent", {
      method: "POST",
      body: JSON.stringify({ bookingId }),
    }),
}

// ---------------- Reviews ----------------
export const reviewApi = {
  hotelReviews: (hotelId: string) => apiRequest<{ reviews: import("./types").Review[] }>(`/reviews/hotel/${hotelId}`),
  packageReviews: (packageId: string) => apiRequest<{ reviews: import("./types").Review[] }>(`/reviews/package/${packageId}`),
  adminList: (params: Record<string, unknown> = {}) =>
    apiRequest<{ reviews: import("./types").Review[]; total: number }>(`/reviews${qs(params)}`),
  create: (formData: FormData) => apiRequest("/reviews", { method: "POST", body: formData, isFormData: true }),
  update: (id: string, formData: FormData) => apiRequest(`/reviews/${id}`, { method: "PUT", body: formData, isFormData: true }),
  remove: (id: string) => apiRequest(`/reviews/${id}`, { method: "DELETE" }),
}

// ---------------- Users ----------------
export const userApi = {
  profile: () => apiRequest<{ user: import("./types").User }>("/users/profile"),
  updateProfile: (formData: FormData) => apiRequest<{ user: import("./types").User }>("/users/profile", { method: "PUT", body: formData, isFormData: true }),
  adminList: (params: Record<string, unknown> = {}) =>
    apiRequest<import("./types").PaginatedResponse<import("./types").User>>(`/users${qs(params)}`),
  update: (id: string, body: Record<string, unknown>) =>
    apiRequest<{ user: import("./types").User }>(`/users/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest(`/users/${id}`, { method: "DELETE" }),
}

// ---------------- Wishlist ----------------
export const wishlistApi = {
  get: () => apiRequest<{ wishlist: import("./types").Wishlist }>("/wishlist"),
  add: (itemType: "Hotel" | "Package", itemId: string) =>
    apiRequest<{ wishlist: import("./types").Wishlist }>("/wishlist", {
      method: "POST",
      body: JSON.stringify({ itemType, itemId }),
    }),
  remove: (itemId: string) => apiRequest<{ wishlist: import("./types").Wishlist }>(`/wishlist/${itemId}`, { method: "DELETE" }),
}

// ---------------- Coupons ----------------
export const couponApi = {
  validate: (code: string, amount: number, bookingType: string) =>
    apiRequest<{ discount: number; coupon: string }>("/coupons/validate", {
      method: "POST",
      body: JSON.stringify({ code, amount, bookingType }),
    }),
  adminList: () => apiRequest<{ coupons: import("./types").Coupon[] }>("/coupons"),
  create: (body: Record<string, unknown>) => apiRequest<{ coupon: import("./types").Coupon }>("/coupons", { method: "POST", body: JSON.stringify(body) }),
  update: (id: string, body: Record<string, unknown>) =>
    apiRequest<{ coupon: import("./types").Coupon }>(`/coupons/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id: string) => apiRequest(`/coupons/${id}`, { method: "DELETE" }),
}

// ---------------- Contact ----------------
export const contactApi = {
  send: (body: { name: string; email: string; subject?: string; message: string }) =>
    apiRequest<{ message: string }>("/contact", { method: "POST", body: JSON.stringify(body) }),
}

// ---------------- Admin ----------------
export const adminApi = {
  dashboard: () =>
    apiRequest<{
      stats: Record<string, number>
      recentBookings: import("./types").Booking[]
    }>("/admin/dashboard"),
  revenueReport: () => apiRequest<{ revenue: { _id: { year: number; month: number }; total: number; count: number }[] }>("/admin/reports/revenue"),
  bookingReport: () =>
    apiRequest<{ byStatus: { _id: string; count: number }[]; byType: { _id: string; count: number }[] }>("/admin/reports/bookings"),
}
