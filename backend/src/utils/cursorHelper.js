/**
 * Cursor Helper Utilities
 *
 * Cursor-based pagination uses the last seen document's (createdAt, _id)
 * as a pointer (cursor) instead of a numeric offset.
 *
 * Why this prevents duplicates and missing records:
 * ─────────────────────────────────────────────────
 * Skip/Limit Problem:
 *   - If a new product is inserted at position 5 while the user is on page 1,
 *     the product that was at position 20 shifts to position 21.
 *     The user will SKIP it when they request page 2 (positions 21–40).
 *
 * Cursor Solution:
 *   - We remember exactly where we left off: "show me products OLDER than
 *     createdAt=X with _id < Y".
 *   - New inserts above our cursor don't affect results below it.
 *   - The compound (createdAt, _id) key is globally unique, so results
 *     are always stable regardless of concurrent writes.
 */

const mongoose = require("mongoose");

/**
 * Build a MongoDB query filter for cursor-based pagination
 *
 * Logic:
 *   We want products "before" the cursor in our sort order (createdAt DESC, _id DESC).
 *   "Before" means:
 *     - createdAt < cursorCreatedAt   (older), OR
 *     - createdAt === cursorCreatedAt AND _id < cursorId  (same timestamp, lower _id)
 *
 * @param {string} cursorCreatedAt - ISO date string of last seen product
 * @param {string} cursorId        - ObjectId string of last seen product
 * @returns {object} MongoDB $or query object to append to find()
 */
const buildCursorFilter = (cursorCreatedAt, cursorId) => {
  // Validate the cursor values
  if (!cursorCreatedAt || !cursorId) return {};

  const cursorDate = new Date(cursorCreatedAt);
  const cursorObjectId = new mongoose.Types.ObjectId(cursorId);

  return {
    $or: [
      // Products with an older timestamp come first
      { createdAt: { $lt: cursorDate } },
      // Products with same timestamp but lower _id (tiebreaker)
      { createdAt: cursorDate, _id: { $lt: cursorObjectId } },
    ],
  };
};

/**
 * Build the nextCursor object from the last product in the result set
 *
 * @param {Array} products - Array of product documents
 * @returns {object|null} Cursor object { createdAt, id } or null if no more pages
 */
const buildNextCursor = (products, limit) => {
  // If we got fewer results than the limit, there are no more pages
  if (!products || products.length < limit) {
    return null;
  }

  const lastProduct = products[products.length - 1];
  return {
    createdAt: lastProduct.createdAt.toISOString(),
    id: lastProduct._id.toString(),
  };
};

module.exports = { buildCursorFilter, buildNextCursor };
