import React from "react";

export default function Header({ toggleSidebar }) {
  return (
    <nav className="navbar navbar-light bg-light border-bottom px-3 shadow-sm d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        {/* Sidebar toggle button (only visible on small screens) */}
        <button
          className="btn btn-outline-secondary btn-sm me-2 d-md-none"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <span className="navbar-brand mb-0 h4 text-primary">📰 News Admin Panel</span>
      </div>

      <div>
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
