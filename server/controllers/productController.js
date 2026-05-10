const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

const parseBoolean = (value, fallback) => {
  if (value === undefined || value === null || value === "") return fallback;
  if (typeof value === "boolean") return value;
  if (typeof value === "string") return value.toLowerCase() === "true";
  return Boolean(value);
};

const getImageUrlFromUpload = (req) => {
  if (!req.file) return "";
  if (req.file.path && /^https?:\/\//i.test(req.file.path)) {
    return req.file.path; // Cloudinary URL
  }
  if (req.file.filename) {
    return `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`; // Local upload URL
  }
  return "";
};

/**
 * @desc    Get all products (with optional search & category filter)
 * @route   GET /api/products
 * @access  Public
 */
const getProducts = asyncHandler(async (req, res) => {
  const { search, category, available } = req.query;

  // Build dynamic query
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category && category !== "All") {
    query.category = category;
  }

  if (available === "true") {
    query.availability = true;
  }

  const products = await Product.find(query)
    .populate("owner", "name avatar email location")
    .sort({ createdAt: -1 });

  res.json(products);
});

/**
 * @desc    Get single product by ID
 * @route   GET /api/products/:id
 * @access  Public
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate(
    "owner",
    "name avatar email location phone"
  );

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

/**
 * @desc    Create a new product (Admin only)
 * @route   POST /api/products
 * @access  Private/Admin
 */
const createProduct = asyncHandler(async (req, res) => {
  const { title, description, category, pricePerDay, availability, location, condition } =
    req.body;

  if (!title || !description || !category || !pricePerDay) {
    res.status(400);
    throw new Error("Please fill all required fields");
  }

  // Image URL from Cloudinary (via multer middleware) or fallback
  const imageUrl = getImageUrlFromUpload(req) || req.body.image || `https://source.unsplash.com/800x600/?${encodeURIComponent(category)}`;

  const product = await Product.create({
    title,
    description,
    image: imageUrl,
    category,
    pricePerDay: Number(pricePerDay),
    availability: parseBoolean(availability, true),
    location: location || "Local Area",
    condition: condition || "Good",
    owner: req.user._id, // Admin is the owner
  });

  const populated = await product.populate("owner", "name avatar email");
  res.status(201).json(populated);
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Update fields
  product.title = req.body.title || product.title;
  product.description = req.body.description || product.description;
  product.category = req.body.category || product.category;
  product.pricePerDay = req.body.pricePerDay
    ? Number(req.body.pricePerDay)
    : product.pricePerDay;
  product.availability = parseBoolean(req.body.availability, product.availability);
  product.location = req.body.location || product.location;
  product.condition = req.body.condition || product.condition;

  // Update image if new file uploaded
  const uploadedImageUrl = getImageUrlFromUpload(req);
  if (uploadedImageUrl) product.image = uploadedImageUrl;
  if (req.body.image) {
    product.image = req.body.image;
  }

  const updated = await product.save();
  const populated = await updated.populate("owner", "name avatar email");
  res.json(populated);
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  await product.deleteOne();
  res.json({ message: "Product removed successfully" });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
