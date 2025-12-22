import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNews, buildImageUrl } from "../api/api";
import "./UpcomingNewsSection.css";

// Create a small set of candidate URLs to try when an image fails to load.
function makeCandidates(path) {
  if (!path) return [];
  const normalized = path.replace(/\\/g, "/");
  const base = buildImageUrl(normalized);
  const candidates = [base];
  try {
    // try swapping localhost <-> 127.0.0.1 in case of host resolution issues
    if (base.includes("localhost")) candidates.push(base.replace("localhost", "127.0.0.1"));
    if (base.includes("127.0.0.1")) candidates.push(base.replace("127.0.0.1", "localhost"));
  } catch (e) {}
  return candidates.filter(Boolean);
}

export default function UpcomingNewsSection() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getAllNews();
        console.log("[UpcomingNewsSection] fetched news:", data);
        setNews(data || []);
        setError(null);
      } catch (err) {
        console.error("Error loading all news:", err);
        setError("Unable to load news.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // helper: truncate a text by words and append ellipsis if truncated
  const truncateWords = (text, limit) => {
    if (!text) return "";
    const words = String(text).split(/\s+/).filter(Boolean);
    if (words.length <= limit) return words.join(" ");
    return words.slice(0, limit).join(" ") + "...";
  };

  if (loading) {
    return (
      <section className="upcoming-news-section container my-5">
        <p>Loading news...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="upcoming-news-section container my-5">
        <p className="text-danger">{error}</p>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return (
      <section className="upcoming-news-section container my-5">
        <p>No news found.</p>
      </section>
    );
  }

  // 🧠 Split data
  const mainNews = news[0] || null;               // big card left
  const sideNews = news.slice(1, 5);      // 4 small items in middle
  const extraNews = news.slice(5, 8);     // 3 cards below (older)

  const openNews = (id) => {
    navigate(`/news/${id}`);
  };

  return (
    <section className="upcoming-news-section container ">
      {/* Title row */}
      <div className="d-flex align-items-center mb-4">
        <h2 className="fw-bold mb-0">Upcoming Events</h2>
        <div className="flex-grow-1 ms-3 section-underline" />
      </div>

      <div className="row g-4">
        {/* LEFT: BIG CARD */}
        <div className="col-lg-5">
          <div
            className="up-main-card"
            onClick={() => mainNews && openNews(mainNews._id)}
            style={{
              cursor: "pointer",
              backgroundImage: `url(${buildImageUrl((mainNews && (mainNews.main_image || mainNews.thumbnail_image)) || "")})`,
            }}
          >
            {/* <div className="up-main-overlay">
              <div className="up-main-date">
                {new Date(mainNews.published_at).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </div>
              <h3 className="up-main-title">{mainNews.title}</h3>
              <p className="up-main-readmore">Read More</p>
            </div> */}
          </div>
        </div>

        {/* CENTER: 4 SMALL NEWS ITEMS */}
        <div className="col-lg-4">
          <div className="up-list-wrapper">
            {sideNews.map((item) => (
              <div
                key={item._id}
                className="up-list-item"
                onClick={() => openNews(item._id)}
              >
                <div className="up-list-thumb">
                  <img
                    src={buildImageUrl(
                      (item && (item.thumbnail_image || item.thumbnail || item.main_image)) || ""
                    )}
                    alt={item.title}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </div>
                <div className="up-list-text">
                  <div className="up-list-date">
                    {new Date(item.published_at).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <h4 className="up-list-title">{item.title}</h4>
                  <p className="up-list-desc">{truncateWords(item.short_description, 25)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: STATIC INFO BOXES (PLACEHOLDER FOR NOW) */}
        <div className="col-lg-3 ">
          {/* <div className="up-static-box mb-3">
            <p className="mb-1 small text-muted">Region covered by district</p>
            <button className="btn btn-dark w-100">7,020 sq km</button>
          </div> */}
          <div className="up-static-box mb-3">
            <p className="mb-1 small text-muted">
              Total people living in the district
            </p>
            <button className="btn btn-dark w-100">15.63 lac</button>
          </div>
          <div className="up-static-box mb-3">
            <p className="mb-1 small text-muted">Region covered by city</p>
            <button className="btn btn-dark w-100">50 sq</button>
          </div>
          <div className="up-static-box mb-4">
            <p className="mb-1 small text-muted">
              Total people living in the city
            </p>
            <button className="btn btn-dark w-100">2.9 lac</button>
          </div>
          <div className="up-static-banner">
          </div>
        </div>
      </div>

      {/* BELOW: 3 MORE CARDS (OLDER NEWS) */}
      <div className="row g-4 mt-4">
        {extraNews.map((item) => (
          <div key={item._id} className="col-lg-4">
            <div
              className="up-extra-card"
              onClick={() => openNews(item._id)}
              style={{ cursor: "pointer" }}
            >
              <div className="up-extra-image-wrapper">
                <img
                  src={buildImageUrl((item && (item.main_image || item.thumbnail_image)) || "")}
                  alt={item.title}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
              <div className="up-extra-body">
                <div className="up-extra-date">
                  {new Date(item.published_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <h4 className="up-extra-title">{item.title}</h4>
                <p className="up-extra-desc">{item.short_description}</p>
                <button className="btn btn-link p-0">Read More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
