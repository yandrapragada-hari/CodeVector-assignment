/**
 * Product Model
 * Defines the MongoDB schema and indexes for the Product collection
 *
 * Indexes explained:
 * 1. { createdAt: -1, _id: -1 } — For general cursor-based pagination (newest first)
 * 2. { category: 1, createdAt: -1, _id: -1 } — For category-filtered cursor pagination
 *
 * Why compound indexes?
 * - createdAt alone is not unique (two products can share the same timestamp)
 * - Adding _id as a tiebreaker makes the sort key globally unique
 * - This guarantees stable cursor pagination with no duplicates or missed records
 */

const mongoose = require("mongoose");

// Valid product categories as defined in assignment spec
const CATEGORIES = [
  "Electronics",
  "Books",
  "Fashion",
  "Sports",
  "Home",
  "Beauty",
  "Grocery",
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [200, "Product name cannot exceed 200 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: CATEGORIES,
        message: `Category must be one of: ${CATEGORIES.join(", ")}`,
      },
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      // Store as cents-level precision
      set: (v) => Math.round(v * 100) / 100,
    },
  },
  {
    // Mongoose automatically manages createdAt and updatedAt
    timestamps: true,
    // Optimize JSON output
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─────────────────────────────────────────────
// Compound Indexes for Cursor-Based Pagination
// ─────────────────────────────────────────────

/**
 * Index 1: General pagination (no category filter)
 * Sorted by newest first, with _id as unique tiebreaker
 */
productSchema.index({ createdAt: -1, _id: -1 });

/**
 * Index 2: Category-filtered pagination
 * MongoDB uses this index when a category filter is applied
 * Prefix: category — allows equality match before sorting
 */
productSchema.index({ category: 1, createdAt: -1, _id: -1 });

// Export categories for use in seed script and validator
productSchema.statics.CATEGORIES = CATEGORIES;

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
