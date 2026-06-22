import { LayoutGrid, Filter, RadioTower, Loader2 } from "lucide-react";

const StatsBar = ({ totalLoaded, selectedCategory, loading }) => (
  <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.75rem 1.5rem" }}>

    {/* Total products */}
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem",
        background: "#eef2ff", border: "1px solid #c7d2fe",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <LayoutGrid size={13} color="#6366f1" />
      </div>
      <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
        <span style={{ color: "#0f172a", fontWeight: 700 }}>{totalLoaded.toLocaleString()}</span>
        {" "}products shown
      </span>
    </div>

    {/* Separator */}
    <div style={{ width: "1px", height: "1.125rem", background: "#e2e8f0" }} />

    {/* Category */}
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ width: "1.75rem", height: "1.75rem", borderRadius: "0.5rem",
        background: "#faf5ff", border: "1px solid #e9d5ff",
        display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Filter size={13} color="#9333ea" />
      </div>
      <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
        Category:{" "}
        <span style={{ color: "#0f172a", fontWeight: 600 }}>{selectedCategory}</span>
      </span>
    </div>

    {/* Separator */}
    <div style={{ width: "1px", height: "1.125rem", background: "#e2e8f0" }} />

    {/* Live indicator */}
    <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
      {loading
        ? <Loader2 size={13} color="#6366f1" style={{ animation: "spin 0.9s linear infinite" }} />
        : <RadioTower size={13} color="#16a34a" />
      }
      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: loading ? "#6366f1" : "#16a34a" }}>
        {loading ? "Fetching..." : "Live data"}
      </span>
    </div>

    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default StatsBar;
