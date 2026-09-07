import React, { useEffect } from "react";
import logo from "../assets/hello-dewas-logo.png";
import "./InitialPageLoader.css";

export default function InitialPageLoader({ error = null, onRetry = null }) {
  // Lock body scroll temporarily while loading overlay is mounted
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div
      className="initial-loader-overlay"
      role="status"
      aria-live="polite"
      aria-busy={!error}
    >
      <div className="initial-loader-content">
        {/* Subtle translucent frosted panel showcasing the white logo */}
        <div className="initial-loader-panel">
          <img
            src={logo}
            alt="Hello Dewas"
            className="initial-loader-logo"
          />
        </div>

        {error ? (
          <div className="initial-loader-error">
            <p className="initial-loader-error-text">
              {typeof error === "string" ? error : "Unable to load latest updates."}
            </p>
            {onRetry && (
              <button
                type="button"
                className="initial-loader-retry-btn"
                onClick={onRetry}
              >
                Retry
              </button>
            )}
          </div>
        ) : (
          <div className="initial-loader-status">
            <div className="initial-loader-spinner" aria-hidden="true" />
            <p className="initial-loader-title">Loading latest updates…</p>
            <p className="initial-loader-subtitle">Your city, your news.</p>
            <span className="visually-hidden">Loading latest updates…</span>
          </div>
        )}
      </div>
    </div>
  );
}


