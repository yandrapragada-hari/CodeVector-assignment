import { PackageX, RotateCcw, SearchX } from "lucide-react";

const EmptyState = ({ category, onReset }) => {
  const isFiltered = category && category !== "All";

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "1.5rem" }}>

      {/* Icon box */}
      <div style={{
        width: "6rem", height: "6rem", borderRadius: "1.5rem",
        background: "#f8fafc", border: "2px solid #e2e8f0",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
      }}>
        {isFiltered
          ? <SearchX size={40} color="#c7d2fe" strokeWidth={1.5} />
          : <PackageX size={40} color="#c7d2fe" strokeWidth={1.5} />
        }
      </div>

      {/* Text */}
      <div style={{ textAlign: "center", maxWidth: "22rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>
          No products found
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>
          {isFiltered
            ? <>No products in the <span style={{ color: "#6366f1", fontWeight: 600 }}>{category}</span> category. Try a different filter.</>
            : "The database appears empty. Run the seed script to populate 200,000 products."}
        </p>
      </div>

      {/* Reset button */}
      {isFiltered && (
        <button id="empty-state-reset-btn" onClick={onReset} className="btn-ghost">
          <RotateCcw size={14} />
          Show all categories
        </button>
      )}
    </div>
  );
};

export default EmptyState;
