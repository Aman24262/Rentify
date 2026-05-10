const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

async function resetAdminPassword() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@rentify.com";
    const plainPassword = "admin123";

    let admin = await User.findOne({ email });
    if (!admin) {
      admin = await User.create({
        name: "Rentify Admin",
        email,
        password: plainPassword,
        role: "admin",
        avatar: "https://ui-avatars.com/api/?background=6366f1&color=fff&name=Admin&bold=true",
      });
      console.log("Created admin user with default credentials.");
    } else {
      admin.password = plainPassword;
      admin.role = "admin";
      await admin.save();
      console.log("Reset admin password and ensured admin role.");
    }

    console.log("Admin Email   : admin@rentify.com");
    console.log("Admin Password: admin123");
    process.exit(0);
  } catch (error) {
    console.error("Failed to reset admin credentials:", error.message);
    process.exit(1);
  }
}

resetAdminPassword();
