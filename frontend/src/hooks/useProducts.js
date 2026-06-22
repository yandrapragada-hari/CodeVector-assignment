/**
 * useProducts — Custom React Hook
 * Manages product fetching, cursor-based pagination, filtering, and state
 *
 * State Machine:
 *   idle → loading → (success | error)
 *   On "Load More": products append, cursor advances
 *   On category change: products reset, cursor resets
 */

import { useState, useCallback, useRef } from "react";
import { fetchProducts } from "../services/productService";

const PAGE_LIMIT = 20;

/**
 * @returns {{
 *   products: Array,
 *   loading: boolean,
 *   loadingMore: boolean,
 *   error: string|null,
 *   hasMore: boolean,
 *   totalLoaded: number,
 *   selectedCategory: string,
 *   setCategory: function,
 *   loadMore: function,
 *   refresh: function,
 * }}
 */
const useProducts = () => {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(false);   // initial page load
  const [loadingMore, setLoadingMore]   = useState(false);   // "load more" click
  const [error, setError]               = useState(null);
  const [hasMore, setHasMore]           = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Cursor ref — stores the nextCursor from the last API response
  // Using ref instead of state to avoid unnecessary re-renders
  const cursorRef = useRef(null);

  /**
   * Core fetch function — used for both initial load and pagination
   * @param {boolean} isNewQuery - true if this is a fresh fetch (category change / refresh)
   * @param {string} category    - category to filter by
   */
  const fetchPage = useCallback(async (isNewQuery, category) => {
    // Set appropriate loading state
    if (isNewQuery) {
      setLoading(true);
      setError(null);
    } else {
      setLoadingMore(true);
    }

    try {
      const params = {
        limit: PAGE_LIMIT,
        category: category !== "All" ? category : undefined,
      };

      // Only include cursor params when paginating (not on fresh fetch)
      if (!isNewQuery && cursorRef.current) {
        params.cursorCreatedAt = cursorRef.current.createdAt;
        params.cursorId        = cursorRef.current.id;
      }

      const response = await fetchProducts(params);

      if (isNewQuery) {
        // Replace products on fresh fetch
        setProducts(response.products);
      } else {
        // Append products on "load more"
        setProducts((prev) => [...prev, ...response.products]);
      }

      // Store cursor for next page
      cursorRef.current = response.nextCursor;

      // If nextCursor is null, there are no more pages
      setHasMore(response.nextCursor !== null);
    } catch (err) {
      setError(err.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  /**
   * Change the active category filter
   * Resets cursor and fetches fresh data
   */
  const setCategory = useCallback(
    (category) => {
      setSelectedCategory(category);
      cursorRef.current = null; // Reset cursor for new query
      setHasMore(true);
      fetchPage(true, category);
    },
    [fetchPage]
  );

  /**
   * Load the next page of products (append to existing list)
   */
  const loadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      fetchPage(false, selectedCategory);
    }
  }, [loadingMore, hasMore, selectedCategory, fetchPage]);

  /**
   * Refresh — re-fetch from the beginning with current category
   */
  const refresh = useCallback(() => {
    cursorRef.current = null;
    setHasMore(true);
    fetchPage(true, selectedCategory);
  }, [selectedCategory, fetchPage]);

  // Initial load on mount
  const initialized = useRef(false);
  if (!initialized.current) {
    initialized.current = true;
    fetchPage(true, "All");
  }

  return {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    totalLoaded: products.length,
    selectedCategory,
    setCategory,
    loadMore,
    refresh,
  };
};

export default useProducts;
