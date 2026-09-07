import React, { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  getNewsById,
  getLatestNews,
  getAllNews,
  getAllBanners,
  buildImageUrl,
} from "../api/api";
import InitialPageLoader from "../components/InitialPageLoader";
import "./NewsDetail.css";

function SidebarAd({ banners }) {
  const [index, setIndex] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!banners || banners.length === 0 || hasError) return null;

  const current = banners[index % banners.length];
  if (!current) return null;

  // Prioritize actual mobile banner field
  const mobileImg =
    current.mobile_image ||
    current.mobile ||
    current.image ||
    current.desktop_image ||
    current.desktop;

  if (!mobileImg) return null;

  const handleAdClick = () => {
    const url = current.link || current.url || current.redirect_url;
    if (url) {
      if (url.startsWith("http://") || url.startsWith("https://")) {
        window.open(url, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = url;
      }
    }
  };

  const hasMultiple = banners.length > 1;

  return (
    <div className="sidebar-ad-card">
      <div className="sidebar-ad-label">Advertisement</div>
      <div
        className="sidebar-ad-creative"
        onClick={handleAdClick}
        style={{
          cursor:
            current.link || current.url || current.redirect_url
              ? "pointer"
              : "default",
        }}
      >
        <img
          src={buildImageUrl(mobileImg)}
          alt={current.title || "Advertisement"}
          className="sidebar-ad-img"
          loading="lazy"
          onError={() => setHasError(true)}
        />
        {hasMultiple && (
          <div className="sidebar-ad-dots">
            {banners.map((b, i) => (
              <span
                key={b._id || `sidebar-ad-dot-${i}`}
                className={
                  "sidebar-ad-dot" +
                  (i === index % banners.length ? " active" : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex(i);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [latestNewsList, setLatestNewsList] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [sidebarError, setSidebarError] = useState(null);

  // Scroll to top smoothly when article changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  const loadArticle = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const article = await getNewsById(id);
      setNews(article);
    } catch (err) {
      console.error("Failed to load news article:", err);
      setError("Unable to load article.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  const loadSidebarData = useCallback(async () => {
    try {
      setSidebarLoading(true);
      setSidebarError(null);
      const [allNewsRes, bannerRes] = await Promise.allSettled([
        getAllNews(),
        getAllBanners(),
      ]);

      if (allNewsRes.status === "fulfilled" && Array.isArray(allNewsRes.value)) {
        // Sort newest first by date
        const sorted = [...allNewsRes.value].sort((a, b) => {
          const da = new Date(a.published_at || a.createdAt || 0).getTime();
          const db = new Date(b.published_at || b.createdAt || 0).getTime();
          return db - da;
        });
        setLatestNewsList(sorted);
      } else {
        setLatestNewsList([]);
      }

      if (bannerRes.status === "fulfilled" && Array.isArray(bannerRes.value)) {
        const active = bannerRes.value.filter(
          (b) => b && b.display !== false && b.status !== "inactive"
        );
        setBanners(active);
      }
    } catch (err) {
      console.error("Failed to load sidebar content:", err);
      setSidebarError("Unable to load latest news.");
    } finally {
      setSidebarLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticle();
  }, [loadArticle]);

  useEffect(() => {
    loadSidebarData();
  }, [loadSidebarData]);

  // Up to 5 latest unique news records excluding the article currently being viewed
  const seenIds = new Set();
  const filteredLatestNews = [];
  for (const item of latestNewsList) {
    if (!item || !item._id) continue;
    if (String(item._id) === String(id)) continue;
    if (seenIds.has(String(item._id))) continue;
    seenIds.add(String(item._id));
    filteredLatestNews.push(item);
    if (filteredLatestNews.length === 5) break;
  }

  return (
    <>
      {(loading || (error && !news)) && (
        <InitialPageLoader
          error={error}
          onRetry={loadArticle}
        />
      )}
      <Navbar />

      {news && (
        <section className="news-detail-wrapper">
          <div className="news-detail-container">
            {/* LEFT CONTENT */}
            <div className="news-main">
              <Link to="/" className="news-back">← Back</Link>

              <h1 className="news-title">{news.title}</h1>

              <div className="news-meta">
                <span>Author: Priya Mehta</span>
                <span>{new Date(news.published_at || news.createdAt).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                })}</span>
                {news.categories && <span>{news.categories}</span>}
              </div>

              <div className="news-share">
                <span>Share To</span>
                <div className="share-icons">
                  <i className="bi bi-whatsapp" />
                  <i className="bi bi-twitter" />
                  <i className="bi bi-facebook" />
                  <i className="bi bi-instagram" />
                </div>
              </div>

              {news.main_image && (
                <img
                  src={buildImageUrl(news.main_image)}
                  alt={news.title}
                  className="news-hero-image"
                />
              )}

              <div className="news-content">
                <h3>Dewas, India —</h3>
                {(news.description || "").split("\n").map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="news-tags">
                #HelloDewas #GreenDewas #CityStories
              </div>

              <button className="load-more-btn">Load More</button>
            </div>

            {/* RIGHT SIDEBAR */}
            <aside className="news-sidebar">
              <div className="sidebar-latest-panel">
                <div className="sidebar-panel-header">
                  <div className="sidebar-title-group">
                    <h3 className="sidebar-panel-title">Latest News</h3>
                    <div className="sidebar-title-accent" />
                  </div>
                  <Link to="/latest-news" className="sidebar-view-all">
                    View All
                  </Link>
                </div>

                <div className="sidebar-latest-list">
                  {sidebarLoading ? (
                    <div className="sidebar-loading-placeholder">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="sidebar-skeleton-row">
                          <div className="sidebar-skeleton-thumb" />
                          <div className="sidebar-skeleton-text">
                            <div className="sidebar-skeleton-line short" />
                            <div className="sidebar-skeleton-line" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : sidebarError ? (
                    <div className="sidebar-error-box">
                      <p>{sidebarError}</p>
                      <button
                        type="button"
                        className="sidebar-retry-btn"
                        onClick={loadSidebarData}
                      >
                        Retry
                      </button>
                    </div>
                  ) : filteredLatestNews.length === 0 ? (
                    <p className="sidebar-empty-text">No additional news available.</p>
                  ) : (
                    filteredLatestNews.map((item) => {
                      const thumbUrl =
                        item.thumbnail_image ||
                        item.thumbnail ||
                        item.main_image ||
                        "";
                      const dateStr = item.published_at || item.createdAt;

                      return (
                        <Link
                          key={item._id}
                          to={`/news/${item._id}`}
                          className="sidebar-news-row"
                        >
                          <div className="sidebar-news-thumb-wrapper">
                            {thumbUrl ? (
                              <img
                                src={buildImageUrl(thumbUrl)}
                                alt={item.title || "News"}
                                className="sidebar-news-thumb"
                                loading="lazy"
                              />
                            ) : (
                              <div className="sidebar-news-thumb-placeholder">
                                News
                              </div>
                            )}
                          </div>

                          <div className="sidebar-news-content">
                            {(dateStr || item.categories) && (
                              <div className="sidebar-news-meta">
                                {dateStr && (
                                  <span className="sidebar-news-date">
                                    {new Date(dateStr).toLocaleDateString("en-IN", {
                                      day: "2-digit",
                                      month: "short",
                                      year: "numeric",
                                    })}
                                  </span>
                                )}
                                {item.categories && (
                                  <span className="sidebar-news-cat">
                                    {item.categories}
                                  </span>
                                )}
                              </div>
                            )}
                            <h4 className="sidebar-news-headline">{item.title}</h4>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Mobile Format Advertisement Card */}
              {banners.length > 0 && <SidebarAd banners={banners} />}
            </aside>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}


