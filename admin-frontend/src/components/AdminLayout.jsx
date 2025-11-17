import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div>
      {/* Header */}
      <Header toggleSidebar={toggleSidebar} />

      {/* Body (Sidebar + Main Content) */}
      <div className="d-flex">
        {/* Sidebar */}
        <div
          className={`bg-white border-end shadow-sm position-fixed position-md-static ${
            showSidebar ? "d-block" : "d-none"
          }`}
          style={{ width: "220px", minHeight: "100vh", zIndex: 1000 }}
        >
          <Sidebar />
        </div>

        {/* Main content area */}
        <main
          className="flex-grow-1 p-4 bg-light"
          style={{
            marginLeft: showSidebar ? "220px" : "0",
            minHeight: "100vh",
            transition: "margin 0.3s ease",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
