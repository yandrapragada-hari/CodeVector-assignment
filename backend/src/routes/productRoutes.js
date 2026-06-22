/**
 * Product Routes
 * Defines all API routes for the products resource
 *
 * Base path: /api/products (mounted in server.js)
 */

const express = require("express");
const router = express.Router();

const {
  getProducts,
  getCategories,
  getStats,
} = require("../controllers/productController");

const { validateProductQuery } = require("../middleware/validate");

// ── Routes ──────────────────────────────────────────────────────────────────

/**
 * GET /api/products
 * Fetch paginated products with optional category filter and cursor pagination
 *
 * Query params: limit, category, cursorCreatedAt, cursorId
 */
router.get("/", validateProductQuery, getProducts);

/**
 * GET /api/products/categories
 * Returns all valid product categories
 */
router.get("/categories", getCategories);

/**
 * GET /api/products/stats
 * Returns product count stats (total + per category)
 */
router.get("/stats", getStats);

module.exports = router;
