/**
 * Middleware: Admin-only access
 * Must be used AFTER the protect middleware
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied: Admins only");
  }
};

module.exports = { adminOnly };
