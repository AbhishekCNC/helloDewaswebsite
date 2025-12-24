import React from "react";

// Minimal placeholder for NewsDetails when a dedicated banner component isn't available.
// Keeps layout intact but remains invisible so it won't affect the page appearance.
export default function DiscoverBanner() {
  return <div className="discover-banner-placeholder" style={{ display: "none" }} />;
}
