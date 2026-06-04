import React, { useEffect, useState, useRef } from "react";
import "./ImageStripSlider.css";
import { getActiveBanners, buildImageUrl } from "../api/api.js";

export default function ImageStripSlider() {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const intervalRef = useRef(null);

  // fetch up to 5 active banners from backend
  useEffect(() => {
    let mounted = true;
    getActiveBanners()
      .then((data) => {
        if (!mounted) return;
        // sort by createdAt desc if available, then take first 5
        const sorted = (data || []).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        setBanners(sorted.slice(0, 5));
      })
      .catch((err) => {
        console.error("Failed to load banners for ImageStripSlider:", err);
      });

    return () => {
      mounted = false;
    };
  }, []);

  // Auto-slide every 3 seconds (only when we have banners)
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (!banners || banners.length === 0) return;

    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [banners]);

  const current = banners.length > 0 ? banners[index] : null;

  // Helper to resolve image URL (handles Cloudinary absolute urls or local uploads)
  const imgFor = (banner, type) => {
    if (!banner) return "";
    const val = type === "mobile" ? banner.mobile_image || banner.mobile || banner.desktop_image : banner.desktop_image || banner.desktop || banner.mobile_image;
    return buildImageUrl(val || "");
  };

  return (
    <section className="strip-slider-section">
      <div className="container p-0">
        <div className="strip-slider-wrapper">
          {current ? (
            <picture>
              <source media="(max-width: 768px)" srcSet={imgFor(current, "mobile")} />
              <img src={imgFor(current, "desktop")} alt={current.categories || "banner"} className="strip-slider-image" />
            </picture>
          ) : (
            // fallback static markup while loading
            <div className="strip-slider-placeholder" />
          )}
        </div>
      </div>
    </section>
  );
}
