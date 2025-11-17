import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="d-flex flex-column bg-white" style={{ minHeight: "100vh" }}>
      {/* Sidebar header */}
      <div className="p-3 border-bottom fw-bold text-primary">
        Dashboard
      </div>

      {/* Sidebar links */}
      <nav className="nav flex-column p-2">
        {[
          { to: "/dashboard", label: "🏠 Home" },
          { to: "/news", label: "📰 News" },
          { to: "/events", label: "🎉 Events" },
          { to: "/banners", label: "🖼️ Banners" },
          { to: "/newspapers", label: "🗞️ Newspapers" },
        ].map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              "nav-link rounded-2 px-3 py-2 mb-1 " +
              (isActive ? "bg-primary text-white fw-semibold" : "text-dark")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
