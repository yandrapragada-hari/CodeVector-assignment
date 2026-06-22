import Navbar from "../components/Navbar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import LoadMoreButton from "../components/LoadMoreButton";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import StatsBar from "../components/StatsBar";
import useProducts from "../hooks/useProducts";
import { LayoutDashboard, RefreshCw, Layers, TrendingUp, Box } from "lucide-react";

const Dashboard = () => {
  const {
    products, loading, loadingMore, error,
    hasMore, totalLoaded, selectedCategory,
    setCategory, loadMore, refresh,
  } = useProducts();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#f8fafc" }}>

      {/* Navbar */}
      <Navbar totalLoaded={totalLoaded} />

      {/* Hero Header */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 1px 0 #f1f5f9",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle background decoration */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-4rem", right: "-4rem", width: "18rem", height: "18rem",
            background: "radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: "-2rem", left: "-2rem", width: "12rem", height: "12rem",
            background: "radial-gradient(circle, rgba(139,92,246,0.05) 0%, transparent 70%)", borderRadius: "50%" }} />
        </div>

        <div style={{ position: "relative", maxWidth: "80rem", margin: "0 auto", padding: "2rem 1.5rem 1.75rem" }}>

          {/* Top row — title + refresh */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "0.25rem" }}>
            <div>
              {/* Breadcrumb label */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.625rem" }}>
                <div style={{ width: "1.625rem", height: "1.625rem", borderRadius: "0.5rem",
                  background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <LayoutDashboard size={14} color="#6366f1" />
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.09em" }}>
                  Product Catalog
                </span>
              </div>

              {/* Main heading */}
              <h1 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2rem)", fontWeight: 800, color: "#0f172a", margin: "0 0 0.5rem", lineHeight: 1.2 }}>
                Explore{" "}
                <span className="text-gradient">200,000+</span>
                {" "}Products
              </h1>
              <p style={{ fontSize: "0.875rem", color: "#94a3b8", margin: 0, maxWidth: "36rem", lineHeight: 1.6 }}>
                Browse the full catalog with blazing-fast cursor pagination.
                Filter by category and discover products instantly — no page refreshes.
              </p>
            </div>

            {/* Action buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", flexShrink: 0 }}>
              <button id="refresh-btn" onClick={refresh} disabled={loading} className="btn-ghost">
                <RefreshCw size={14} style={{ animation: loading ? "spin 0.9s linear infinite" : "none" }} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats pills row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", margin: "1.25rem 0" }}>
            {[
              { icon: Box,       label: "200K Products",     bg: "#eef2ff", border: "#c7d2fe", color: "#4f46e5" },
              { icon: Layers,    label: "7 Categories",      bg: "#faf5ff", border: "#e9d5ff", color: "#9333ea" },
              { icon: TrendingUp,label: "Cursor Pagination", bg: "#f0fdf4", border: "#bbf7d0", color: "#16a34a" },
            ].map(({ icon: Icon, label, bg, border, color }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.375rem",
                padding: "0.3rem 0.75rem", borderRadius: "9999px", background: bg, border: `1px solid ${border}` }}>
                <Icon size={12} color={color} />
                <span style={{ fontSize: "0.72rem", fontWeight: 600, color }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Category filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setCategory}
            disabled={loading}
          />
        </div>
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, maxWidth: "80rem", width: "100%", margin: "0 auto", padding: "1.5rem" }}>

        {loading && <LoadingSpinner message="Loading products..." />}
        {!loading && error && <ErrorState message={error} onRetry={refresh} />}

        {!loading && !error && (
          <>
            {/* Stats bar */}
            {products.length > 0 && (
              <div style={{ marginBottom: "1.25rem", padding: "0.875rem 1.25rem",
                background: "#ffffff", borderRadius: "0.875rem", border: "1px solid #e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <StatsBar totalLoaded={totalLoaded} selectedCategory={selectedCategory} loading={loadingMore} />
              </div>
            )}

            {products.length === 0
              ? <EmptyState category={selectedCategory} onReset={() => setCategory("All")} />
              : (
                <>
                  {/* Grid */}
                  <div id="product-grid" style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                    gap: "1rem",
                  }}>
                    {products.map((product, index) => (
                      <ProductCard key={product._id} product={product} index={index} />
                    ))}
                  </div>

                  {/* Load More */}
                  <LoadMoreButton onLoadMore={loadMore} loading={loadingMore} hasMore={hasMore} totalLoaded={totalLoaded} />
                </>
              )
            }
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ background: "#ffffff", borderTop: "1px solid #e2e8f0", padding: "1.25rem 0", marginTop: "auto" }}>
        <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem",
          display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "0.5rem" }}>
          <p style={{ fontSize: "0.78rem", color: "#cbd5e1", margin: 0 }}>
            © 2026 <span style={{ color: "#6366f1", fontWeight: 600 }}>CodeVector</span> — MERN Stack Assignment
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", fontSize: "0.78rem", color: "#cbd5e1" }}>
            {["MongoDB Atlas", "Express.js", "React + Vite", "Node.js", "Tailwind CSS"].map((t, i, a) => (
              <span key={t} style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                {t}
                {i < a.length - 1 && <span style={{ color: "#e2e8f0" }}>·</span>}
              </span>
            ))}
          </div>
        </div>
      </footer>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default Dashboard;
