import React from "react";
import { useLocation } from "react-router-dom";
import { Menu, LogOut, Newspaper } from "lucide-react";

export default function Header({ toggleSidebar }) {
  const location = useLocation();

  const getPageTitle = (path) => {
    switch (path) {
      case "/dashboard":
        return "Dashboard";
      case "/news":
        return "News Management";
      case "/events":
        return "Events Management";
      case "/banners":
        return "Banners Management";
      case "/newspapers":
        return "Newspapers Management";
      default:
        return "Admin Portal";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header
      className="bg-white border-bottom px-3 px-md-4 d-flex align-items-center justify-content-between position-sticky top-0"
      style={{
        height: "64px",
        borderColor: "var(--admin-border)",
        zIndex: 1020,
        boxShadow: "var(--admin-shadow-sm)",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {/* Hamburger Toggle Button for mobile/tablet */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          className="btn btn-light btn-sm d-lg-none d-flex align-items-center justify-content-center p-2 rounded-2 border"
          onClick={toggleSidebar}
          style={{
            borderColor: "var(--admin-border)",
            backgroundColor: "#FFFFFF",
            minWidth: "40px",
            minHeight: "40px",
          }}
        >
          <Menu size={20} style={{ color: "var(--admin-text-main)" }} />
        </button>

        <div className="d-flex align-items-center gap-2">
          <Newspaper size={20} className="d-lg-none text-primary" style={{ color: "var(--admin-primary)" }} />
          <h1 className="h6 mb-0 fw-semibold" style={{ color: "var(--admin-text-main)", fontSize: "16px" }}>
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      <div className="d-flex align-items-center gap-2">
        <button
          type="button"
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 px-3 rounded-2"
          onClick={handleLogout}
          style={{
            height: "36px",
            fontSize: "13px",
            fontWeight: "500",
            borderColor: "#FCA5A5",
            color: "#DC2626",
            backgroundColor: "#FEF2F2",
          }}
        >
          <LogOut size={16} />
          <span className="d-none d-sm-inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
