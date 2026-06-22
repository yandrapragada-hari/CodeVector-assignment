import { Tag, ChevronDown } from "lucide-react";

const CATEGORY_CONFIG = {
  All:         { color: "#475569", bg: "#f1f5f9",  border: "#cbd5e1", dot: "#94a3b8",  textLight: "#64748b"  },
  Electronics: { color: "#1d4ed8", bg: "#eff6ff",  border: "#bfdbfe", dot: "#3b82f6",  textLight: "#2563eb"  },
  Books:       { color: "#92400e", bg: "#fffbeb",  border: "#fde68a", dot: "#f59e0b",  textLight: "#d97706"  },
  Fashion:     { color: "#9d174d", bg: "#fdf2f8",  border: "#fbcfe8", dot: "#ec4899",  textLight: "#db2777"  },
  Sports:      { color: "#065f46", bg: "#ecfdf5",  border: "#a7f3d0", dot: "#10b981",  textLight: "#059669"  },
  Home:        { color: "#7c2d12", bg: "#fff7ed",  border: "#fed7aa", dot: "#f97316",  textLight: "#ea580c"  },
  Beauty:      { color: "#581c87", bg: "#faf5ff",  border: "#e9d5ff", dot: "#a855f7",  textLight: "#9333ea"  },
  Grocery:     { color: "#14532d", bg: "#f0fdf4",  border: "#bbf7d0", dot: "#22c55e",  textLight: "#16a34a"  },
};

const ALL_CATEGORIES = ["All","Electronics","Books","Fashion","Sports","Home","Beauty","Grocery"];

const CategoryFilter = ({ selectedCategory, onCategoryChange, disabled }) => {
  const cfg = CATEGORY_CONFIG[selectedCategory] || CATEGORY_CONFIG.All;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
      {/* Label */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
        <Tag size={13} color="#6366f1" />
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>
          Filter by Category
        </span>
      </div>

      {/* Pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {ALL_CATEGORIES.map((cat) => {
          const c = CATEGORY_CONFIG[cat];
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              id={`category-filter-${cat.toLowerCase()}`}
              onClick={() => !disabled && onCategoryChange(cat)}
              disabled={disabled}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.375rem",
                padding: "0.375rem 0.875rem", borderRadius: "9999px",
                fontSize: "0.78rem", fontWeight: 600,
                cursor: disabled ? "not-allowed" : "pointer",
                border: `1.5px solid ${isActive ? c.border : "#e2e8f0"}`,
                background: isActive ? c.bg : "#ffffff",
                color: isActive ? c.color : "#64748b",
                transition: "all 0.18s ease",
                opacity: disabled ? 0.5 : 1,
                boxShadow: isActive ? `0 1px 4px ${c.dot}33` : "none",
              }}
            >
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: isActive ? c.dot : "#cbd5e1", flexShrink: 0 }} />
              {cat}
            </button>
          );
        })}
      </div>

      {/* Mobile dropdown */}
      <div style={{ position: "relative" }}>
        <span style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)",
          width: "8px", height: "8px", borderRadius: "50%", background: cfg.dot, zIndex: 1 }} />
        <select
          id="category-select-mobile"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          disabled={disabled}
          className="input-field"
          style={{ paddingLeft: "2.25rem", paddingRight: "2.5rem", color: cfg.color, fontSize: "0.875rem" }}
        >
          {ALL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <ChevronDown size={14} color="#94a3b8" style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
      </div>
    </div>
  );
};

export { CATEGORY_CONFIG };
export default CategoryFilter;
