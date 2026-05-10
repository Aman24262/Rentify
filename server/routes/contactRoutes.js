const express = require("express");
const { sendContactEmail } = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendContactEmail);

module.exports = router;