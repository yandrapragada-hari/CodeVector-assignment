/**
 * Product API Service
 * Handles all HTTP communication with the backend API using Axios
 */

import axios from "axios";

// ── Axios Instance ─────────────────────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 15000, // 15 second timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Request Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Could add auth tokens here in the future
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Normalize error message for UI consumption
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";

    const normalizedError = new Error(message);
    normalizedError.status = error.response?.status;
    normalizedError.errors = error.response?.data?.errors;

    return Promise.reject(normalizedError);
  }
);

// ── API Methods ────────────────────────────────────────────────────────────

/**
 * Fetch paginated products with optional filters
 *
 * @param {object} params
 * @param {number} params.limit           - Products per page (default 20)
 * @param {string} [params.category]      - Category filter
 * @param {string} [params.cursorCreatedAt] - Cursor: ISO date of last product
 * @param {string} [params.cursorId]      - Cursor: ObjectId of last product
 *
 * @returns {Promise<{ products: Array, nextCursor: object|null, count: number }>}
 */
export const fetchProducts = async (params = {}) => {
  const queryParams = {};

  if (params.limit)           queryParams.limit = params.limit;
  if (params.category && params.category !== "All") {
    queryParams.category = params.category;
  }
  if (params.cursorCreatedAt) queryParams.cursorCreatedAt = params.cursorCreatedAt;
  if (params.cursorId)        queryParams.cursorId = params.cursorId;

  return apiClient.get("/products", { params: queryParams });
};

/**
 * Fetch all available product categories
 * @returns {Promise<{ categories: string[] }>}
 */
export const fetchCategories = async () => {
  return apiClient.get("/products/categories");
};

/**
 * Fetch product collection statistics
 * @returns {Promise<{ totalProducts: number, byCategory: Array }>}
 */
export const fetchStats = async () => {
  return apiClient.get("/products/stats");
};
