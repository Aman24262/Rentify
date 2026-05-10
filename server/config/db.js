const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
  if (!mongoUri) {
    console.error("❌ MongoDB Connection Error: Missing MONGO_URI (or MONGO_URL) in server/.env");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
