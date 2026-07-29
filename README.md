# Incredible India Tours - Full Stack Travel Booking Platform

A full-stack MERN-style travel booking platform: hotels, destinations, tour packages, bookings,
payments, reviews, wishlist, coupons, and a complete admin panel.

## Project Structure

```
frontend/   Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + shadcn/ui (Base UI)
backend/    Node.js + Express + MongoDB/Mongoose REST API
```

**A note on tech stack:** the original spec asked for Vite + React Router on the frontend. The
uploaded project was already a polished Next.js site, so per your instruction I extended it as
Next.js instead of rewriting it in Vite - you get the same React-based frontend, plus built-in
routing and better SEO, without throwing away the existing design. The backend is exactly Node.js
+ Express + MongoDB as specified, and it doesn't care which frontend framework talks to it, so a
Vite rewrite later is still possible if you want it.

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env   # fill in your own keys (see below)
npm install
npm run seed            # optional: populates sample destinations/hotels/packages + an admin user
npm run dev              # starts on http://localhost:5000
```

Default seeded admin login: **admin@indiatravel.com / Admin@123** - change this password
immediately after first login.

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=          # optional - maps fall back to a plain link without it
```

```bash
npm run dev               # starts on http://localhost:3000
```

## Required API Keys

Nothing will run without a MongoDB connection string. Everything else degrades gracefully if
left unconfigured (e.g. payments return a clear "not configured" error instead of crashing the
server; maps fall back to a link; weather just doesn't show).

| Service | Used for | Where to get it |
|---|---|---|
| MongoDB Atlas | Database (required) | mongodb.com/atlas |
| Cloudinary | Image uploads (hotels, destinations, packages, reviews, avatars) | cloudinary.com |
| Razorpay | Payments (primary, INR) | razorpay.com |
| Stripe | Payments (alternate gateway) | stripe.com |
| Google OAuth | "Sign in with Google" | console.cloud.google.com |
| SMTP (Gmail etc.) | Verification/reset/booking emails + contact form | e.g. Gmail App Passwords |
| OpenWeatherMap | Live weather on destination pages | openweathermap.org/api |
| Google Maps | Embedded maps on hotel/destination pages | console.cloud.google.com |

## What's fully implemented

- **Auth**: register/login, JWT, Google OAuth, forgot/reset password, email verification, change password
- **Hotels**: search/filter, rooms, real availability calculation, booking
- **Destinations**: search, live weather, nearby hotels & packages, Google Maps
- **Packages**: search/filter, itinerary, included/excluded, booking
- **Bookings**: pricing engine, coupon application at checkout, PDF invoice download, cancellation
- **Payments**: Razorpay (primary) + Stripe, webhook-verified, refunds
- **Reviews**: ratings, comments, image uploads, verified-booking badge
- **Wishlist**, **Coupons**, fully responsive UI
- **Admin panel**: dashboard + revenue/booking reports, manage users/hotels+rooms/destinations/packages/bookings/reviews/coupons

## What's intentionally out of scope

- **Notifications** and **multi-language support** (both listed as "extra features") were not built -
  each is a substantial standalone feature (real-time/polling infra, and i18n routing respectively)
  and didn't fit in this pass. Everything else in the spec is implemented.
- **Blog** is static content (3 sample posts in `frontend/lib/blog-data.ts`) rather than
  database-backed, since the spec didn't include a blog model/admin section.
- A couple of pre-existing TypeScript warnings in the original uploaded files (`tour-booking-card.tsx`,
  `faq.tsx`, `calendar.tsx`) are unrelated to this work and don't block the build
  (`ignoreBuildErrors: true` is already set in `next.config.mjs`).

## Deployment (matches the spec's suggested stack)

- **Frontend** → Vercel (set `NEXT_PUBLIC_API_URL` to your deployed backend URL)
- **Backend** → Render (set all vars from `.env.example`, plus `FRONTEND_URL` to your Vercel URL)
- **Database** → MongoDB Atlas
