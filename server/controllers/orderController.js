const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { createMailer, getAdminEmail, getFromAddress } = require("../utils/mailer");

const sendOrderNotificationEmail = async (order, user, product) => {
  const transporter = createMailer();
  const adminEmail = getAdminEmail();
  const fromEmail = getFromAddress();

  const mailOptions = {
    from: fromEmail,
    to: adminEmail,
    subject: `New Rentify Order: ${product.title}`,
    html: `
      <h2>New Rental Order Received</h2>
      <p><strong>Customer:</strong> ${user.name} (${user.email})</p>
      <p><strong>Product:</strong> ${product.title}</p>
      <p><strong>Category:</strong> ${product.category || "N/A"}</p>
      <p><strong>Price per day:</strong> $${product.pricePerDay.toFixed(2)}</p>
      <p><strong>Rental days:</strong> ${order.rentalDays}</p>
      <p><strong>Total price:</strong> $${order.totalPrice.toFixed(2)}</p>
      <p><strong>Delivery name:</strong> ${order.deliveryName}</p>
      <p><strong>Delivery address:</strong> ${order.deliveryAddress}</p>
      <p><strong>Contact number:</strong> ${order.contactNumber}</p>
      <p><strong>Payment method:</strong> ${order.paymentMethod}</p>
      <p><strong>Message:</strong> ${order.message ? order.message.replace(/\n/g, "<br>") : "No message provided"}</p>
      <hr>
      <p><small>This notification was sent automatically by Rentify.</small></p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

/**
 * @desc    Create a new rental order
 * @route   POST /api/orders
 * @access  Private
 */
const createOrder = asyncHandler(async (req, res) => {
  const { productId, rentalDays, message, deliveryName, deliveryAddress, contactNumber, paymentMethod } = req.body;

  if (!productId || !rentalDays || !deliveryName || !deliveryAddress || !contactNumber) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Find the product
  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Check availability
  if (!product.availability) {
    res.status(400);
    throw new Error("This product is currently not available for rent");
  }

  // Calculate total price
  const totalPrice = product.pricePerDay * Number(rentalDays);

  // Create order
  const order = await Order.create({
    user: req.user._id,
    product: productId,
    rentalDays: Number(rentalDays),
    totalPrice,
    message: message || "",
    deliveryName,
    deliveryAddress,
    contactNumber,
    paymentMethod: paymentMethod || "Cash on Delivery",
    status: "Pending",
  });

  // Mark product as unavailable
  product.availability = false;
  await product.save();

  // Populate for response
  const populated = await order.populate([
    { path: "user", select: "name email avatar" },
    { path: "product", select: "title image pricePerDay category" },
  ]);

  // Send the notification email in the background so the UI gets the success response immediately.
  sendOrderNotificationEmail(order, req.user, product).catch((emailError) => {
    console.error("Order notification email failed:", emailError);
  });

  res.status(201).json(populated);
});

/**
 * @desc    Get orders for the logged-in user
 * @route   GET /api/orders/my
 * @access  Private
 */
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("product", "title image pricePerDay category location")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/**
 * @desc    Get ALL orders (Admin)
 * @route   GET /api/orders
 * @access  Private/Admin
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email avatar")
    .populate("product", "title image pricePerDay category")
    .sort({ createdAt: -1 });

  res.json(orders);
});

/**
 * @desc    Update order status (Admin)
 * @route   PUT /api/orders/:id
 * @access  Private/Admin
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const previousStatus = order.status;
  order.status = status || order.status;
  await order.save();

  // If order is Returned or Cancelled → make product available again
  if (
    (status === "Returned" || status === "Cancelled") &&
    previousStatus !== "Returned" &&
    previousStatus !== "Cancelled"
  ) {
    await Product.findByIdAndUpdate(order.product, { availability: true });
  }

  const populated = await order.populate([
    { path: "user", select: "name email avatar" },
    { path: "product", select: "title image pricePerDay category" },
  ]);

  res.json(populated);
});

/**
 * @desc    Delete an order (Admin)
 * @route   DELETE /api/orders/:id
 * @access  Private/Admin
 */
const deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  // Free up the product when order deleted
  await Product.findByIdAndUpdate(order.product, { availability: true });
  await order.deleteOne();

  res.json({ message: "Order deleted successfully" });
});

module.exports = {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
