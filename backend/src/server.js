/**
 * Express Server Entry Point
 * Configures and starts the CodeVector Product API server
 */

// Load environment variables FIRST before any other imports
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { errorHandler, notFound } = require("./middleware/errorHandler");

// ── Initialize Express App ───────────────────────────────────────────────────
const app = express();
const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB Atlas ────────────────────────────────────────────────
connectDB();

// ── Core Middleware ─────────────────────────────────────────────────────────

/**
 * CORS Configuration
 * In development: allows requests from the Vite dev server (localhost:5173)
 * In production: replace CLIENT_URL with your deployed frontend URL
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., curl, Postman, mobile apps)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:5173",
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // In production, block unknown origins
      if (process.env.NODE_ENV === "production") {
        callback(new Error(`CORS blocked: ${origin}`));
      } else {
        // In development, allow all origins for convenience
        callback(null, true);
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Parse JSON request bodies (up to 10MB)
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CodeVector Product API is running 🚀",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      categories: "/api/products/categories",
      stats: "/api/products/stats",
    },
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
  });
});

// ── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/products", productRoutes);

// ── 404 Handler (must come AFTER all routes) ─────────────────────────────────
app.use(notFound);

// ── Global Error Handler (must be LAST middleware, 4 params) ─────────────────
app.use(errorHandler);

// ── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 CodeVector API Server`);
  console.log(`   Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Port:        ${PORT}`);
  console.log(`   URL:         http://localhost:${PORT}`);
  console.log(`   Products:    http://localhost:${PORT}/api/products\n`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

module.exports = app;
