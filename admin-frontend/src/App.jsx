// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NewsManagement from "./pages/NewsManagement";
import EventManagement from "./pages/EventManagement";
import NewspaperManagement from "./pages/NewspaperManagement";
import Diagnostic from "./pages/Diagnostic";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For testing: if no token, set a test token
    let token = localStorage.getItem("token");
    if (!token) {
      localStorage.setItem("token", "test-token-dev");
      token = "test-token-dev";
    }
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Diagnostic route - public, no auth required */}
        <Route path="/diagnostic" element={<Diagnostic />} />
        
        <Route path="/login" element={<Login />} />

        {/* all protected routes wrapped in AdminLayout */}
        {isLoggedIn && (
          <>
            <Route
              path="/dashboard"
              element={
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              }
            />
            <Route
              path="/news"
              element={
                <AdminLayout>
                  <NewsManagement />
                </AdminLayout>
              }
            />
            <Route
              path="/events"
              element={
                <AdminLayout>
                  <EventManagement />
                </AdminLayout>
              }
            />
            <Route
              path="/newspapers"
              element={
                <AdminLayout>
                  <NewspaperManagement />
                </AdminLayout>
              }
            />
          </>
        )}

        {/* catch-all should be last */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;
