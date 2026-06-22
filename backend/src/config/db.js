/**
 * Database Configuration
 * Handles MongoDB Atlas connection using Mongoose
 */

const mongoose = require("mongoose");

/**
 * Connect to MongoDB Atlas
 * Uses the MONGODB_URI from environment variables
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // These options ensure a stable, production-ready connection
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000,         // Close sockets after 45s of inactivity
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Exit process with failure — cannot run without DB
    process.exit(1);
  }
};

module.exports = connectDB;
