import { Package, Zap, Database } from "lucide-react";

const Navbar = ({ totalLoaded }) => (
  <header style={{
    position: "sticky", top: 0, zIndex: 50,
    background: "rgba(255,255,255,0.92)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    borderBottom: "1px solid #e2e8f0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  }}>
    <div style={{ maxWidth: "80rem", margin: "0 auto", padding: "0 1.5rem" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "4rem" }}>

        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            width: "2.25rem", height: "2.25rem", borderRadius: "0.75rem",
            background: "linear-gradient(135deg, #6366f1, #7c3aed)",
            boxShadow: "0 2px 10px rgba(99,102,241,0.35)" }}>
            <Package size={18} color="white" />
            <span className="glow-dot" style={{ position: "absolute", top: "-3px", right: "-3px" }} />
          </div>
          <div style={{ lineHeight: 1.2 }}>
            <span className="text-gradient" style={{ display: "block", fontSize: "1rem", fontWeight: 800, letterSpacing: "-0.02em" }}>
              CodeVector
            </span>
            <span style={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
              Product Dashboard
            </span>
          </div>
        </div>

        {/* Centre pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.375rem 0.875rem", borderRadius: "9999px",
          background: "#eef2ff", border: "1px solid #c7d2fe",
        }}>
          <Zap size={12} color="#6366f1" />
          <span style={{ fontSize: "0.72rem", color: "#4f46e5", fontWeight: 600 }}>
            Cursor Pagination · 200K Products
          </span>
        </div>

        {/* Stats badge */}
        <div style={{
          display: "flex", alignItems: "center", gap: "0.5rem",
          padding: "0.375rem 0.875rem", borderRadius: "9999px",
          background: "#f8fafc", border: "1.5px solid #e2e8f0",
        }}>
          <Database size={13} color="#6366f1" />
          <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
            <span style={{ color: "#4f46e5", fontWeight: 700 }}>{totalLoaded.toLocaleString()}</span>
            <span style={{ marginLeft: "0.25rem" }}>loaded</span>
          </span>
        </div>
      </div>
    </div>
  </header>
);

export default Navbar;
