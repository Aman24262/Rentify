const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

/**
 * @desc    Get all users (Admin)
 * @route   GET /api/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.json(users);
});

/**
 * @desc    Get single user by ID (Admin)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

/**
 * @desc    Delete a user (Admin)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Prevent deleting admin accounts
  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot delete admin accounts");
  }

  await user.deleteOne();
  res.json({ message: "User deleted successfully" });
});

/**
 * @desc    Get dashboard stats (Admin)
 * @route   GET /api/users/stats
 * @access  Private/Admin
 */
const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalRenters = await User.countDocuments({ role: "user" });
  const totalAdmins = await User.countDocuments({ role: "admin" });
  const totalProducts = await Product.countDocuments();
  const totalOrders = await Order.countDocuments();
  const availableProducts = await Product.countDocuments({ availability: true });
  const pendingOrders = await Order.countDocuments({ status: "Pending" });
  const approvedOrders = await Order.countDocuments({ status: "Approved" });
  const activeRentals = await Order.countDocuments({ status: { $in: ["Pending", "Approved"] } });
  const totalRevenueResult = await Order.aggregate([
    { $match: { status: { $in: ["Approved", "Returned"] } } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const newUsersLast7Days = await User.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

  const recentUsers = await User.find()
    .select("name email role createdAt")
    .sort({ createdAt: -1 })
    .limit(5);
  const recentOrders = await Order.find()
    .select("rentalDays totalPrice status createdAt")
    .populate("user", "name email")
    .populate("product", "title")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    totalUsers,
    totalRenters,
    totalAdmins,
    totalProducts,
    totalOrders,
    availableProducts,
    pendingOrders,
    approvedOrders,
    activeRentals,
    totalRevenue: totalRevenueResult[0]?.total || 0,
    newUsersLast7Days,
    recentUsers,
    recentOrders,
  });
});

module.exports = { getAllUsers, getUserById, deleteUser, getDashboardStats };
