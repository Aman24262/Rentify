/**
 * Seed Script — Rentify
 * Run with: npm run seed
 *
 * Creates:
 *  - 1 Admin user
 *  - 1 Demo user
 *  - 12 realistic rental products
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB for seeding...");

    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    console.log("🗑️  Cleared existing data");

    // ─── Create Admin User ───────────────────────────────────────────────────
    const admin = await User.create({
      name: "Rentify Admin",
      email: "admin@rentify.com",
      password: "admin123",
      role: "admin",
      avatar: "https://ui-avatars.com/api/?background=6366f1&color=fff&name=Admin&bold=true",
      phone: "+91 9876543210",
      location: "Mumbai, India",
    });

    // ─── Create Demo User ────────────────────────────────────────────────────
    const demoUser = await User.create({
      name: "Demo User",
      email: "user@rentify.com",
      password: "user123",
      role: "user",
      avatar: "https://ui-avatars.com/api/?background=8b5cf6&color=fff&name=Demo+User&bold=true",
      phone: "+91 9123456789",
      location: "Bangalore, India",
    });

    console.log("👤 Admin and Demo User created");

    // ─── Create Products ─────────────────────────────────────────────────────
    const products = [
      {
        title: "Bosch Professional Drill Machine",
        description:
          "High-quality Bosch corded drill machine perfect for home renovation, woodworking, and construction tasks. Comes with a full drill bit set.",
        image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&q=80",
        category: "Tools",
        pricePerDay: 150,
        availability: true,
        location: "Koramangala, Bangalore",
        condition: "Like New",
        owner: admin._id,
      },
      {
        title: "Sony A7 III Mirrorless Camera",
        description:
          "Full-frame mirrorless camera with 24.2MP sensor. Ideal for professional photography, events, and travel. Includes 2 batteries and 64GB SD card.",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
        category: "Cameras",
        pricePerDay: 800,
        availability: true,
        location: "Indiranagar, Bangalore",
        condition: "Like New",
        owner: admin._id,
      },
      {
        title: "DJI Mini 3 Pro Drone",
        description:
          "Compact and powerful drone with 4K/60fps video, obstacle sensing, and 34-min battery life. Great for aerial photography and videography.",
        image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
        category: "Electronics",
        pricePerDay: 1200,
        availability: true,
        location: "Whitefield, Bangalore",
        condition: "Like New",
        owner: admin._id,
      },
      {
        title: "4-Person Camping Tent",
        description:
          "Waterproof dome tent for 4 people. Easy 10-minute setup, UV-resistant coating, and spacious interior. Perfect for weekend camping trips.",
        image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
        category: "Camping Gear",
        pricePerDay: 300,
        availability: true,
        location: "HSR Layout, Bangalore",
        condition: "Good",
        owner: admin._id,
      },
      {
        title: "GoPro Hero 11 Action Camera",
        description:
          "Waterproof action camera with 5.3K video, HyperSmooth stabilization. Includes chest harness, helmet mount, and 3 batteries.",
        image: "https://images.unsplash.com/photo-1601618307786-a9e1ce2e2d44?w=800&q=80",
        category: "Cameras",
        pricePerDay: 450,
        availability: true,
        location: "BTM Layout, Bangalore",
        condition: "Good",
        owner: admin._id,
      },
      {
        title: "JBL Xtreme 3 Bluetooth Speaker",
        description:
          "Powerful portable speaker with 15-hour battery life, IP67 waterproofing, and PartyBoost feature. Ideal for outdoor events and parties.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
        category: "Electronics",
        pricePerDay: 200,
        availability: true,
        location: "Jayanagar, Bangalore",
        condition: "Like New",
        owner: admin._id,
      },
      {
        title: "Camping Sleeping Bag (Arctic Grade)",
        description:
          "Rated for -10°C temperatures. Lightweight, compressible mummy-style sleeping bag. Great for Himalayas or high-altitude treks.",
        image: "https://images.unsplash.com/photo-1534187886935-1e1236e856c3?w=800&q=80",
        category: "Camping Gear",
        pricePerDay: 120,
        availability: true,
        location: "Malleshwaram, Bangalore",
        condition: "Good",
        owner: admin._id,
      },
      {
        title: "MacBook Pro 14\" (M3, 2024)",
        description:
          "Apple MacBook Pro with M3 chip, 16GB RAM, 512GB SSD. Perfect for presentations, video editing, freelancing, and developer use.",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
        category: "Electronics",
        pricePerDay: 1500,
        availability: true,
        location: "Electronic City, Bangalore",
        condition: "Like New",
        owner: admin._id,
      },
      {
        title: "The Alchemist – Paulo Coelho",
        description:
          "Classic bestselling novel. A shepherd's journey of self-discovery. Bestseller in 80+ countries. Great for weekend reading.",
        image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        category: "Books",
        pricePerDay: 15,
        availability: true,
        location: "Rajajinagar, Bangalore",
        condition: "Good",
        owner: admin._id,
      },
      {
        title: "Circular Saw – Dewalt 7.25\"",
        description:
          "Professional-grade circular saw with 15A motor and 5,200 RPM for fast, accurate cuts. Includes blade and carry case.",
        image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=800&q=80",
        category: "Tools",
        pricePerDay: 180,
        availability: true,
        location: "Yeshwanthpur, Bangalore",
        condition: "Good",
        owner: admin._id,
      },
      {
        title: "Mountain Bike – Trek Marlin 7",
        description:
          "Hardtail mountain bike with 29\" wheels and Shimano 8-speed gearing. Great for trail rides, commuting, or weekend adventures.",
        image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&q=80",
        category: "Sports",
        pricePerDay: 350,
        availability: true,
        location: "Sadashivanagar, Bangalore",
        condition: "Good",
        owner: admin._id,
      },
      {
        title: "Nikon D850 DSLR Camera Kit",
        description:
          "45.7MP full-frame DSLR with 4K video. Includes 24-70mm f/2.8 lens, battery grip, filters, and padded camera bag.",
        image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
        category: "Cameras",
        pricePerDay: 900,
        availability: true,
        location: "Ulsoor, Bangalore",
        condition: "Like New",
        owner: admin._id,
      },
    ];

    await Product.insertMany(products);
    console.log(`📦 ${products.length} products seeded`);

    console.log("\n✅ Seeding complete!");
    console.log("─────────────────────────────────────");
    console.log("  Admin Email   : admin@rentify.com");
    console.log("  Admin Password: admin123");
    console.log("  Demo Email    : user@rentify.com");
    console.log("  Demo Password : user123");
    console.log("─────────────────────────────────────");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error.message);
    process.exit(1);
  }
};

seedData();
