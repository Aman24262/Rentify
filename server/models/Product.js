const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/800x600?text=No+Image",
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Tools",
        "Electronics",
        "Camping Gear",
        "Books",
        "Cameras",
        "Sports",
        "Vehicles",
        "Others",
      ],
    },
    pricePerDay: {
      type: Number,
      required: [true, "Price per day is required"],
      min: [1, "Price must be at least ₹1"],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: String,
      default: "Local Area",
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair"],
      default: "Good",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
