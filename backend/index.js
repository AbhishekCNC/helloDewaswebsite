const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Middleware
app.use(express.json());
app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173","http://localhost:5175", "http://127.0.0.1:5175","http://localhost:5174", "http://127.0.0.1:5174", "https://famous-tartufo-0a348a.netlify.app","https://cool-cannoli-d46bca.netlify.app", "https://melodic-baklava-238223.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
})); 
app.use("/uploads", express.static("uploads"));

// ✅ Routes
const authRoutes = require("./routes/auth");
const newsRoutes = require("./routes/news");
const eventsRoutes = require("./routes/events");
const newspapersRoutes = require("./routes/newspapers");
const bannersRoutes = require("./routes/banners");

app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventsRoutes);
app.use("/api/newspapers", newspapersRoutes);
app.use("/api/banners", bannersRoutes);

// ✅ Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
