const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin.js");

const createAdmin = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    console.log("Loading MONGO_URI from:", process.cwd() + "/.env");
    console.log("MONGO_URI present?", !!MONGO_URI);

    if (!MONGO_URI) throw new Error("Missing MONGO_URI");

    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const email = "admin@example.com";
    const password = "password123";

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log("⚠️ Admin already exists with this email.");
      console.log("Email:", email);
      console.log("Password:", password);
      mongoose.disconnect();
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await Admin.create({ name: "Main Admin", email, password: hashed });

    console.log("✅ Admin created successfully:");
    console.log("Email:", email);
    console.log("Password:", password);
    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    mongoose.disconnect();
  }
};

createAdmin();
