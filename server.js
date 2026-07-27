require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const aiRoutes = require("./routes/ai");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// Database Connection

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection failed");
    console.error(error);
    process.exit(1);
  });

// API Routes

app.use("/api/auth", authRoutes);
app.use("/api", aiRoutes);

// Health Check

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running.",
  });
});

// 404 Handler

app.use((req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(404).json({
      success: false,
      message: "API route not found.",
    });
  }

  res.sendFile(require("path").join(__dirname, "public", "index.html"));
});

// Global Error Handler

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// Start Server

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
