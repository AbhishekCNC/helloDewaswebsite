import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Image as ImageIcon,
  FileText,
} from "lucide-react";

export default function Sidebar({ onItemClick }) {
  const navItems = [
    { to: "/dashboard", label: "Home", icon: LayoutDashboard },
    { to: "/news", label: "News", icon: Newspaper },
    { to: "/events", label: "Events", icon: Calendar },
    { to: "/banners", label: "Banners", icon: ImageIcon },
    { to: "/newspapers", label: "Newspapers", icon: FileText },
  ];

  return (
    <aside className="d-flex flex-column h-100 bg-white border-end" style={{ borderColor: "var(--admin-border)" }}>
      {/* Brand Header */}
      <div
        className="px-4 py-3 d-flex align-items-center gap-2 border-bottom"
        style={{ borderColor: "var(--admin-border)", height: "64px" }}
      >
        <div
          className="d-flex align-items-center justify-content-center rounded-3 bg-primary text-white"
          style={{ width: "32px", height: "32px", backgroundColor: "var(--admin-primary)" }}
        >
          <Newspaper size={18} strokeWidth={2.2} />
        </div>
        <div>
          <span className="fw-bold fs-6 text-dark d-block lh-1" style={{ color: "var(--admin-text-main)" }}>
            News Admin
          </span>
          <small className="text-muted" style={{ fontSize: "11px", color: "var(--admin-text-muted)" }}>
            Editorial Workspace
          </small>
        </div>
      </div>

      {/* Navigation Section */}
      <div className="p-3 flex-grow-1 overflow-y-auto">
        <div
          className="text-uppercase fw-semibold mb-2 px-2"
          style={{
            fontSize: "11px",
            letterSpacing: "0.05em",
            color: "var(--admin-text-muted)",
          }}
        >
          Navigation
        </div>

        <nav className="nav flex-column gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end
                onClick={onItemClick}
                className={({ isActive }) =>
                  `d-flex align-items-center gap-3 px-3 py-2 rounded-3 text-decoration-none transition-all ${
                    isActive ? "active-nav-item" : "inactive-nav-item"
                  }`
                }
                style={({ isActive }) => ({
                  height: "42px",
                  fontSize: "14px",
                  fontWeight: isActive ? "600" : "500",
                  backgroundColor: isActive ? "var(--admin-primary-light)" : "transparent",
                  color: isActive ? "var(--admin-primary)" : "var(--admin-text-main)",
                  border: isActive ? "1px solid var(--admin-primary-border)" : "1px solid transparent",
                })}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      style={{
                        color: isActive ? "var(--admin-primary)" : "var(--admin-text-muted)",
                        flexShrink: 0,
                      }}
                    />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer / Meta info */}
      <div
        className="p-3 border-top mt-auto"
        style={{ borderColor: "var(--admin-border)", fontSize: "12px", color: "var(--admin-text-muted)" }}
      >
        <div className="d-flex align-items-center justify-content-between">
          <span>Version 1.0</span>
          <span className="badge rounded-pill bg-light text-secondary border">Online</span>
        </div>
      </div>
    </aside>
  );
}
