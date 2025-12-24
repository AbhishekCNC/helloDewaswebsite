import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNews, buildImageUrl } from "../api/api"; // you already have these
import "./EventsSection.css"; // will just reuse Events styles

export default function CityNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // limit description to 25 words and append "..." when truncated
  const clampWords = (text, max = 25) => {
    if (!text) return "";
    const words = String(text).split(/\s+/).filter(Boolean);
    return words.length > max ? words.slice(0, max).join(" ") + "..." : text;
  };

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllNews(4);
        console.log("[CityNewsSection] Fetched all news:", data);

        // 🔍 filter by categories field (case-insensitive, also matches phrases like "Dewas City")
        const dewasNews = (data || []).filter((item) => {
          const cats = (item.categories || "").toLowerCase();
          const match = cats === "dewas" || cats.includes("dewas");
          console.log(`[CityNewsSection] Checking "${item.title}" category="${item.categories}" → ${match}`);
          return match;
        });

        console.log("[CityNewsSection] Filtered dewas news count:", dewasNews.length);

        // 🕒 sort latest first by published_at (fallback to createdAt if needed)
        const sorted = [...dewasNews].sort((a, b) => {
          const da = new Date(a.published_at || a.createdAt || 0);
          const db = new Date(b.published_at || b.createdAt || 0);
          return db - da;
        });

        // Limit to 4 cards
        setNews(sorted.slice(0, 4));
      } catch (err) {
        console.error("Error loading city news:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openNews = (id) => {
    navigate(`/news/${id}`);
  };

  if (loading) {
    return (
      <section className="events-section container my-5">
        {/* same outer class so layout matches Events exactly */}
        <p>Loading city news...</p>
      </section>
    );
  }

  if (!news.length) {
    return (
      <section className="events-section container my-5">
        <div className="d-flex flex-column mb-4">
          <h2 className="events-title">City News</h2>
          <div className="events-title-underline" />
        </div>
        <p>No city news found.</p>
      </section>
    );
  }

  return (
    <section className="events-section container my-5">
      {/* Heading – SAME layout as EventsSection */}
      <div className="d-flex flex-column mb-4">
        <h2 className="events-title">City News</h2>
        <div className="events-title-underline" />
      </div>

      {/* Cards – SAME markup/classes as EventsSection */}
      <div className="row g-4">
        {news.map((item) => (
          <div key={item._id} className="col-12 col-md-6 col-xl-3">
            <div className="event-card">
              {/* Thumbnail image */}
              <div className="event-card-img-wrapper">
                <img
                  src={buildImageUrl(
                    item.thumbnail_image || item.main_image || ""
                  )}
                  alt={item.title}
                  className="event-card-img"
                  onClick={() => openNews(item._id)}
                />
              </div>

              <div className="event-card-body">
                {/* Date row */}
                <div className="event-date-row">
                  <span className="event-date-icon">
                    <i className="bi bi-calendar3" />
                  </span>
                  <span className="event-date-text">
                    {item.published_at
                      ? new Date(item.published_at).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }
                        )
                      : "—"}
                  </span>
                </div>

                {/* Title */}
                <h5 className="event-card-title">{item.title}</h5>

                {/* Short description – clamped to 25 words */}
                <p className="event-card-desc">
                  {clampWords(item.short_description || item.description || "")}
                </p>

                {/* View button */}
                <button
                  className="event-view-link"
                  type="button"
                  onClick={() => openNews(item._id)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}