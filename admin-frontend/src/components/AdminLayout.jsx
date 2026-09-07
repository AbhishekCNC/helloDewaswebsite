import React, { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./sidebar";
import { X } from "lucide-react";

export default function AdminLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => setIsMobileOpen((prev) => !prev);
  const closeMobileSidebar = () => setIsMobileOpen(false);

  // Handle ESC key press & body scroll locking for drawer
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isMobileOpen) {
        closeMobileSidebar();
      }
    };

    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isMobileOpen]);

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: "var(--admin-bg)" }}>
      {/* Header Bar */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Main Container Layout */}
      <div className="d-flex flex-grow-1 position-relative">
        {/* Persistent Desktop Sidebar (>= 1024px) */}
        <div
          className="d-none d-lg-block flex-shrink-0"
          style={{
            width: "240px",
            minHeight: "calc(100vh - 64px)",
            position: "sticky",
            top: "64px",
            height: "calc(100vh - 64px)",
          }}
        >
          <Sidebar />
        </div>

        {/* Mobile / Tablet Slide-over Drawer (< 1024px) */}
        {isMobileOpen && (
          <>
            {/* Backdrop Overlay */}
            <div
              className="position-fixed top-0 start-0 w-100 h-100 transition-fade"
              onClick={closeMobileSidebar}
              aria-hidden="true"
              style={{
                backgroundColor: "rgba(15, 23, 42, 0.4)",
                backdropFilter: "blur(2px)",
                zIndex: 1040,
              }}
            />

            {/* Offcanvas Drawer Content */}
            <div
              className="position-fixed top-0 start-0 h-100 bg-white shadow-lg d-flex flex-column"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation drawer"
              style={{
                width: "280px",
                maxWidth: "85vw",
                zIndex: 1050,
                transition: "transform 0.3s ease-in-out",
              }}
            >
              {/* Drawer Close Button Header */}
              <div
                className="d-flex align-items-center justify-content-between px-3 border-bottom"
                style={{ height: "64px", borderColor: "var(--admin-border)" }}
              >
                <span className="fw-bold text-dark fs-6">Navigation</span>
                <button
                  type="button"
                  aria-label="Close navigation drawer"
                  className="btn btn-sm btn-light rounded-circle p-2 border"
                  onClick={closeMobileSidebar}
                  style={{ minWidth: "36px", minHeight: "36px" }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-grow-1 overflow-y-auto">
                <Sidebar onItemClick={closeMobileSidebar} />
              </div>
            </div>
          </>
        )}

        {/* Main Content Workspace */}
        <main
          className="flex-grow-1 p-3 p-md-4"
          style={{
            maxWidth: "100%",
            minWidth: 0,
            backgroundColor: "var(--admin-bg)",
          }}
        >
          <div className="container-fluid p-0" style={{ maxWidth: "1280px" }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
