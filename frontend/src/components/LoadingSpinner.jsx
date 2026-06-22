import { Loader2, Database } from "lucide-react";

const LoadingSpinner = ({ message = "Loading products..." }) => (
  <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "1.5rem" }}>

    {/* Spinner */}
    <div style={{ position: "relative", width: "4.5rem", height: "4.5rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* Outer static ring */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid #e0e7ff" }} />
      {/* Spinning ring */}
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "3px solid transparent",
        borderTopColor: "#6366f1", borderRightColor: "#818cf8",
        animation: "spin 0.9s linear infinite" }} />
      {/* Center icon */}
      <div style={{ width: "2rem", height: "2rem", borderRadius: "50%", background: "#eef2ff",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Database size={14} color="#6366f1" />
      </div>
    </div>

    {/* Text */}
    <div style={{ textAlign: "center" }}>
      <p style={{ fontWeight: 600, color: "#1e293b", marginBottom: "0.25rem" }}>{message}</p>
      <p style={{ fontSize: "0.875rem", color: "#94a3b8" }}>Fetching from MongoDB Atlas...</p>
    </div>

    {/* Skeleton grid */}
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem", width: "100%", maxWidth: "80rem", padding: "0 1rem" }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div className="skeleton" style={{ width: "2.75rem", height: "2.75rem", borderRadius: "0.875rem" }} />
            <div className="skeleton" style={{ width: "5.5rem", height: "1.3rem", borderRadius: "9999px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="skeleton" style={{ width: "100%", height: "0.9rem" }} />
            <div className="skeleton" style={{ width: "70%", height: "0.9rem" }} />
            <div className="skeleton" style={{ width: "35%", height: "0.75rem", marginTop: "0.15rem" }} />
          </div>
          <div className="section-divider" />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="skeleton" style={{ width: "5.5rem", height: "1.25rem" }} />
            <div className="skeleton" style={{ width: "4rem", height: "0.9rem" }} />
          </div>
        </div>
      ))}
    </div>

    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default LoadingSpinner;
