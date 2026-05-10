const express = require("express");
const router = express.Router();
const { register, login, getMe, updateProfile } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../config/cloudinary");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes (require login)
router.get("/me", protect, getMe);
router.put("/profile", protect, upload.single("image"), updateProfile);

module.exports = router;
