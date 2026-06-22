/**
 * Product Controller
 * Handles all business logic for product-related API endpoints
 *
 * Cursor Pagination Strategy:
 * ────────────────────────────
 * Instead of skip(n).limit(k), we use a WHERE clause based on the last seen document.
 * Sort order: createdAt DESC, _id DESC (newest first, _id as tiebreaker)
 *
 * For first page:  find({}).sort({createdAt:-1, _id:-1}).limit(limit)
 * For next pages:  find({ $or: [
 *                    { createdAt: { $lt: cursorDate } },
 *                    { createdAt: cursorDate, _id: { $lt: cursorId } }
 *                  ]}).sort({createdAt:-1, _id:-1}).limit(limit)
 *
 * This approach:
 *   ✅ Uses MongoDB compound index → O(log n) lookup
 *   ✅ No full collection scan
 *   ✅ Stable results despite concurrent inserts/updates
 *   ✅ Scales to millions of records without degradation
 */

const Product = require("../models/Product");
const { buildCursorFilter, buildNextCursor } = require("../utils/cursorHelper");

/**
 * GET /api/products
 * Fetch paginated products with optional category filter
 *
 * Query Parameters (pre-validated by middleware):
 *   - limit         {number}  Records per page (default: 20, max: 100)
 *   - category      {string}  Category filter (optional)
 *   - cursorCreatedAt {string} ISO date of last seen product (pagination cursor)
 *   - cursorId      {string}  ObjectId of last seen product (pagination cursor)
 *
 * Response:
 *   {
 *     success: true,
 *     products: [...],
 *     nextCursor: { createdAt: "ISO string", id: "ObjectId string" } | null,
 *     count: number,       // products in this page
 *     totalLoaded: number  // cumulative (sent from frontend, echoed back)
 *   }
 */
const getProducts = async (req, res, next) => {
  try {
    const { limit, category, cursorCreatedAt, cursorId } = req.validatedQuery;

    // ── Build the query filter ──────────────────────────────────────────────
    const filter = {};

    // Apply category filter if provided
    if (category) {
      filter.category = category;
    }

    // Apply cursor filter for pagination (empty on first page)
    const cursorFilter = buildCursorFilter(cursorCreatedAt, cursorId);
    if (Object.keys(cursorFilter).length > 0) {
      // Merge cursor filter with existing filters
      Object.assign(filter, cursorFilter);
    }

    // ── Execute query ───────────────────────────────────────────────────────
    // lean() returns plain JS objects (faster than Mongoose documents)
    // Only select fields needed by the frontend (reduces data transfer)
    const products = await Product.find(filter)
      .select("name category price createdAt updatedAt _id")
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit)
      .lean();

    // ── Build next cursor ───────────────────────────────────────────────────
    const nextCursor = buildNextCursor(products, limit);

    // ── Send response ───────────────────────────────────────────────────────
    res.status(200).json({
      success: true,
      products,
      nextCursor,
      count: products.length,
    });
  } catch (error) {
    // Pass to global error handler
    next(error);
  }
};

/**
 * GET /api/products/categories
 * Returns the list of valid categories (for frontend dropdown)
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = Product.schema.path("category").enumValues;
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/products/stats
 * Returns high-level stats about the product collection
 * (Used for debugging / monitoring)
 */
const getStats = async (req, res, next) => {
  try {
    const totalCount = await Product.estimatedDocumentCount();
    const categoryCounts = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      totalProducts: totalCount,
      byCategory: categoryCounts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProducts, getCategories, getStats };
