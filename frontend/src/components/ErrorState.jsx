import { AlertTriangle, RefreshCw, WifiOff, ServerCrash } from "lucide-react";

const ErrorState = ({ message, onRetry }) => {
  const isNetwork = message?.toLowerCase().includes("network")
    || message?.toLowerCase().includes("timeout")
    || message?.toLowerCase().includes("econnrefused");

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1rem", gap: "1.5rem" }}>

      {/* Icon box */}
      <div style={{
        width: "6rem", height: "6rem", borderRadius: "1.5rem",
        background: "#fff5f5", border: "2px solid #fecaca",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 16px rgba(239,68,68,0.1)",
      }}>
        {isNetwork
          ? <WifiOff size={40} color="#fca5a5" strokeWidth={1.5} />
          : <ServerCrash size={40} color="#fca5a5" strokeWidth={1.5} />
        }
      </div>

      {/* Text */}
      <div style={{ textAlign: "center", maxWidth: "26rem" }}>
        <h3 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0f172a", margin: "0 0 0.5rem" }}>
          {isNetwork ? "Connection Error" : "Something went wrong"}
        </h3>
        <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.65, margin: 0 }}>
          {message || "An unexpected error occurred. Please try again."}
        </p>
        {isNetwork && (
          <div style={{ marginTop: "0.875rem", padding: "0.75rem 1rem", background: "#fffbeb",
            border: "1px solid #fde68a", borderRadius: "0.625rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <AlertTriangle size={14} color="#d97706" />
            <span style={{ fontSize: "0.78rem", color: "#92400e", fontWeight: 500 }}>
              Make sure the backend server is running on port 5000
            </span>
          </div>
        )}
      </div>

      {/* Retry */}
      <button id="error-retry-btn" onClick={onRetry} className="btn-primary">
        <RefreshCw size={15} />
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
