import { ChevronDown, Loader2, CheckCircle2, PackageCheck } from "lucide-react";

const LoadMoreButton = ({ onLoadMore, loading, hasMore, totalLoaded }) => {
  if (!hasMore) {
    return (
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "2.5rem 0" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: "0.625rem",
          padding: "0.75rem 1.5rem", borderRadius: "9999px",
          background: "#f0fdf4", border: "1.5px solid #bbf7d0",
        }}>
          <PackageCheck size={16} color="#16a34a" />
          <span style={{ fontSize: "0.875rem", fontWeight: 600, color: "#15803d" }}>
            All products loaded
          </span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
          Showing all{" "}
          <span style={{ color: "#4f46e5", fontWeight: 700 }}>{totalLoaded.toLocaleString()}</span>
          {" "}products
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", padding: "2.5rem 0" }}>
      <button
        id="load-more-btn"
        onClick={onLoadMore}
        disabled={loading}
        className="btn-primary"
        style={{ minWidth: "13rem", justifyContent: "center", padding: "0.75rem 2rem", fontSize: "0.9rem" }}
      >
        {loading ? (
          <>
            <Loader2 size={16} style={{ animation: "spin 0.9s linear infinite" }} />
            Loading more...
          </>
        ) : (
          <>
            <ChevronDown size={16} style={{ animation: "bounce 1.2s ease-in-out infinite" }} />
            Load More Products
          </>
        )}
      </button>

      <p style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
        <span style={{ color: "#4f46e5", fontWeight: 700 }}>{totalLoaded.toLocaleString()}</span>
        {" "}products loaded — click to load more
      </p>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,100%{transform:translateY(-3px)} 50%{transform:translateY(3px)} }
      `}</style>
    </div>
  );
};

export default LoadMoreButton;
