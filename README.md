# Rentify (MERN)

Hyper-local rental marketplace where users can rent nearby products and admins can manage users, products, and orders.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express + MongoDB + Mongoose
- Auth: JWT + bcryptjs
- Images: Cloudinary + multer

## Project Structure

- `client` - frontend app
- `server` - backend API

## Prerequisites

- Node.js 18+
- MongoDB running locally (or Atlas URI)
- Cloudinary credentials (optional but recommended)

## Environment Variables

### `server/.env`

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/rentify
JWT_SECRET=rentify_secret_2024
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

## Setup

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

## Run

```bash
# Terminal 1 (backend)
cd server
npm run seed    # optional: seed admin + sample products
npm start

# Terminal 2 (frontend)
cd client
npm run dev
```

## Test Checklist

1. Register a new user and confirm redirect/login state.
2. Browse products and use search/category filter.
3. Open a product and place a rental order.
4. Login as admin:
   - Email: `admin@rentify.com`
   - Password: `admin123`
5. In admin panel, verify:
   - dashboard stats load
   - product create/edit/delete works (file upload or image URL)
   - order status updates work
   - user delete works for non-admin users

## Notes

- If Cloudinary is missing, product image URL fallback still works.
- For Atlas, replace `MONGO_URI` with your cluster connection string.
