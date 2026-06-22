import { ShoppingBag, Calendar, Tag, Hash } from "lucide-react";
import { CATEGORY_CONFIG } from "./CategoryFilter";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(price);

const formatDate = (dateStr) =>
  new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(new Date(dateStr));

// Lucide icon components per category
import {
  Cpu, BookOpen, Shirt, Trophy, Home, Sparkles, ShoppingCart,
} from "lucide-react";

const CATEGORY_ICONS = {
  Electronics: Cpu,
  Books:       BookOpen,
  Fashion:     Shirt,
  Sports:      Trophy,
  Home:        Home,
  Beauty:      Sparkles,
  Grocery:     ShoppingCart,
};

const ProductCard = ({ product, index = 0 }) => {
  const cfg = CATEGORY_CONFIG[product.category] || CATEGORY_CONFIG.All;
  const delay = Math.min(index % 20, 8) * 0.04;
  const IconComponent = CATEGORY_ICONS[product.category] || ShoppingBag;

  return (
    <article
      className="card-hover animate-slide-up"
      style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem", animationDelay: `${delay}s` }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "0.75rem" }}>
        {/* Icon box */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          width: "2.75rem", height: "2.75rem", borderRadius: "0.875rem", flexShrink: 0,
          background: cfg.bg, border: `1.5px solid ${cfg.border}`,
          transition: "transform 0.2s ease",
        }}>
          <IconComponent size={20} color={cfg.dot} strokeWidth={2} />
        </div>

        {/* Category badge */}
        <span className="category-badge" style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
          <Tag size={9} />
          {product.category}
        </span>
      </div>

      {/* Product name */}
      <div style={{ flex: 1 }}>
        <h3 style={{
          fontSize: "0.875rem", fontWeight: 600, color: "#0f172a", lineHeight: 1.45, margin: 0,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.3rem" }}>
          <Hash size={10} color="#cbd5e1" />
          <span style={{ fontSize: "0.68rem", color: "#cbd5e1", fontFamily: "monospace", letterSpacing: "0.05em" }}>
            {product._id?.slice(-8).toUpperCase()}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider" />

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Price */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem" }}>
          <div style={{ width: "1.5rem", height: "1.5rem", borderRadius: "0.375rem", background: "#eef2ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ShoppingBag size={11} color="#6366f1" />
          </div>
          <span className="text-gradient" style={{ fontSize: "1rem", fontWeight: 700 }}>
            {formatPrice(product.price)}
          </span>
        </div>

        {/* Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#94a3b8" }}>
          <Calendar size={11} />
          <span style={{ fontSize: "0.7rem", fontWeight: 500 }}>{formatDate(product.createdAt)}</span>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
