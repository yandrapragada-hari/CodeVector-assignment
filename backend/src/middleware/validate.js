/**
 * Query Validation Middleware
 * Validates and sanitizes query parameters for the products endpoint
 */

const mongoose = require("mongoose");
const Product = require("../models/Product");

/**
 * Validates query parameters for GET /api/products
 * Attaches sanitized params to req.validatedQuery
 */
const validateProductQuery = (req, res, next) => {
  const errors = [];
  const { limit, category, cursorCreatedAt, cursorId } = req.query;

  // ── Validate limit ──────────────────────────────────────────────────────────
  let parsedLimit = 20; // default
  if (limit !== undefined) {
    parsedLimit = parseInt(limit, 10);
    if (isNaN(parsedLimit) || parsedLimit < 1) {
      errors.push("limit must be a positive integer");
    } else if (parsedLimit > 100) {
      // Cap at 100 to prevent abuse
      parsedLimit = 100;
    }
  }

  // ── Validate category ───────────────────────────────────────────────────────
  let parsedCategory = null;
  if (category !== undefined && category !== "" && category !== "All") {
    if (!Product.schema.path("category").enumValues.includes(category)) {
      errors.push(
        `category must be one of: ${Product.schema.path("category").enumValues.join(", ")}`
      );
    } else {
      parsedCategory = category;
    }
  }

  // ── Validate cursor pair ────────────────────────────────────────────────────
  // Both cursorCreatedAt and cursorId must be provided together
  let parsedCursorCreatedAt = null;
  let parsedCursorId = null;

  if (cursorCreatedAt || cursorId) {
    if (!cursorCreatedAt || !cursorId) {
      errors.push("cursorCreatedAt and cursorId must both be provided together");
    } else {
      // Validate cursorCreatedAt is a valid date
      const dateCheck = new Date(cursorCreatedAt);
      if (isNaN(dateCheck.getTime())) {
        errors.push("cursorCreatedAt must be a valid ISO date string");
      } else {
        parsedCursorCreatedAt = cursorCreatedAt;
      }

      // Validate cursorId is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(cursorId)) {
        errors.push("cursorId must be a valid MongoDB ObjectId");
      } else {
        parsedCursorId = cursorId;
      }
    }
  }

  // ── Return errors if any ────────────────────────────────────────────────────
  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Attach sanitized query to request
  req.validatedQuery = {
    limit: parsedLimit,
    category: parsedCategory,
    cursorCreatedAt: parsedCursorCreatedAt,
    cursorId: parsedCursorId,
  };

  next();
};

module.exports = { validateProductQuery };
