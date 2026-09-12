// src/components/LatestNewsContent.jsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { getAllNews, getAllBanners, buildImageUrl } from "../api/api";
import "./LatestNewsContent.css";

const INLINE_AD_INTERVAL = 8;
const MAX_INLINE_ADS = 3;

function AdBannerSlider({ banners, startOffset = 0, slotIndex = 0 }) {
  const [index, setIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!banners || banners.length <= 1 || !isVisible) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(id);
  }, [banners, isVisible]);

  if (!banners || banners.length === 0 || hasError) return null;

  const currentBannerIndex = (index + startOffset) % banners.length;
  const current = banners[currentBannerIndex];
  if (!current) return null;

  const imgPath =
    (isMobile &&
      (current.mobile_image || current.mobile || current.desktop_image || current.desktop || current.image)) ||
    current.desktop_image ||
    current.desktop ||
    current.image;

  if (!imgPath) return null;

  const hasMultiple = banners.length > 1;

  const next = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerClick = () => {
    const targetUrl = current.link || current.url || current.redirect_url;
    if (targetUrl) {
      if (targetUrl.startsWith("http://") || targetUrl.startsWith("https://")) {
        window.open(targetUrl, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = targetUrl;
      }
    }
  };

  return (
    <div className="ln-ad-wrapper" ref={containerRef}>
      <div className="ln-ad-label">Advertisement</div>
      <div
        className="ln-ad-slider"
        onClick={handleBannerClick}
        style={{
          cursor:
            current.link || current.url || current.redirect_url
              ? "pointer"
              : "default",
        }}
      >
        {hasMultiple && (
          <button
            type="button"
            className="ln-ad-arrow ln-ad-arrow-left"
            onClick={prev}
            aria-label="Previous advertisement"
          >
            ‹
          </button>
        )}

        <div className="ln-ad-window">
          <img
            src={buildImageUrl(imgPath)}
            alt={current.title || "Advertisement"}
            className="ln-ad-img"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        </div>

        {hasMultiple && (
          <button
            type="button"
            className="ln-ad-arrow ln-ad-arrow-right"
            onClick={next}
            aria-label="Next advertisement"
          >
            ›
          </button>
        )}

        {hasMultiple && (
          <div className="ln-ad-dots">
            {banners.map((b, i) => (
              <span
                key={b._id || `ad-dot-${slotIndex}-${i}`}
                className={
                  "ln-ad-dot" +
                  (i === currentBannerIndex ? " ln-ad-dot-active" : "")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  setIndex((i - startOffset + banners.length * 100) % banners.length);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LatestNewsContent() {
  const [news, setNews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [newsData, bannerData] = await Promise.all([
        getAllNews(),
        getAllBanners().catch(() => []),
      ]);

      // Deduplicate news records by stable _id and sort newest-first
      const sorted = (newsData || []).slice().sort((a, b) => {
        const da = new Date(a.published_at || a.createdAt || 0).getTime();
        const db = new Date(b.published_at || b.createdAt || 0).getTime();
        return db - da;
      });

      const seen = new Set();
      const unique = [];
      for (const item of sorted) {
        if (!item || !item._id) continue;
        if (seen.has(String(item._id))) continue;
        seen.add(String(item._id));
        unique.push(item);
      }

      setNews(unique);

      const activeBanners = (bannerData || []).filter(
        (b) => b && b.display !== false && b.status !== "inactive"
      );
      setBanners(activeBanners);
    } catch {
      setError("Unable to load latest news. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="ln-page-container container my-5">
        <div className="ln-skeleton-header" />
        <div className="ln-skeleton-grid">
          <div className="ln-skeleton-card lead" />
          <div className="ln-skeleton-card" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ln-page-container container my-5">
        <div className="ln-error-state">
          <p className="ln-error-text">{error}</p>
          <button type="button" className="ln-retry-btn" onClick={loadData}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return (
      <div className="ln-page-container container my-5">
        <div className="ln-empty-state">
          <h3>No News Available</h3>
          <p>There are no news updates published at the moment. Please check back soon.</p>
          <Link to="/" className="ln-home-link">Back to Home</Link>
        </div>
      </div>
    );
  }

  // Editorial Partitioning
  const leadStory = news[0] || null;
  const secondaryStories = news.slice(1, 3);
  const moreNews = news.slice(3);

  return (
    <div className="ln-page-wrapper">
      <div className="container ln-page-container">
        {/* Breadcrumb & Page Heading */}
        <nav className="ln-breadcrumb" aria-label="Breadcrumb">
          <Link to="/" className="ln-breadcrumb-link">Home</Link>
          <span className="ln-breadcrumb-separator">/</span>
          <span className="ln-breadcrumb-current">Latest News</span>
        </nav>

        <header className="ln-header">
          <div className="ln-header-title-row">
            <h1 className="ln-main-title">Latest News</h1>
            <div className="ln-title-line" />
          </div>
          <p className="ln-subtitle">
            Stay updated with the latest news, announcements, and stories from Dewas and Madhya Pradesh.
          </p>
        </header>

        {/* TOP STORIES SECTION */}
        {leadStory && (
          <section className="ln-top-stories-section" aria-label="Top Stories">
            <div className="ln-top-stories-grid">
              {/* Lead Story (65% width on desktop) */}
              <Link
                to={`/news/${leadStory._id}`}
                className="ln-lead-card"
                aria-label={`Lead Story: ${leadStory.title}`}
              >
                <div className="ln-lead-image-wrapper">
                  {leadStory.main_image || leadStory.thumbnail_image ? (
                    <img
                      src={buildImageUrl(leadStory.main_image || leadStory.thumbnail_image)}
                      alt={leadStory.title}
                      className="ln-lead-img"
                    />
                  ) : (
                    <div className="ln-image-placeholder">Hello Dewas</div>
                  )}
                  {leadStory.categories && (
                    <span className="ln-lead-badge">{leadStory.categories}</span>
                  )}
                </div>

                <div className="ln-lead-body">
                  <div className="ln-meta-row">
                    <span className="ln-meta-category">Top Story</span>
                    <span className="ln-meta-dot">•</span>
                    <span className="ln-meta-date">
                      {new Date(leadStory.published_at || leadStory.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h2 className="ln-lead-title">{leadStory.title}</h2>
                  <p className="ln-lead-desc">
                    {(leadStory.short_description || leadStory.description || "")
                      .slice(0, 220)
                      .trim()}
                    {(leadStory.short_description || leadStory.description || "").length > 220 && "…"}
                  </p>
                  <span className="ln-read-more">Read Full Story →</span>
                </div>
              </Link>

              {/* Secondary Stories (Stacked Column) */}
              {secondaryStories.length > 0 && (
                <div className="ln-secondary-column">
                  {secondaryStories.map((item) => (
                    <Link
                      key={item._id}
                      to={`/news/${item._id}`}
                      className="ln-secondary-card"
                    >
                      <div className="ln-secondary-thumb-wrapper">
                        {item.main_image || item.thumbnail || item.thumbnail_image ? (
                          <img
                            src={buildImageUrl(item.main_image || item.thumbnail || item.thumbnail_image)}
                            alt={item.title}
                            className="ln-secondary-thumb"
                            loading="lazy"
                          />
                        ) : (
                          <div className="ln-image-placeholder small">News</div>
                        )}
                      </div>

                      <div className="ln-secondary-body">
                        <div className="ln-meta-row">
                          <span className="ln-meta-date">
                            {new Date(item.published_at || item.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                          {item.categories && (
                            <>
                              <span className="ln-meta-dot">•</span>
                              <span className="ln-category-pill">{item.categories}</span>
                            </>
                          )}
                        </div>
                        <h3 className="ln-secondary-title">{item.title}</h3>
                        <p className="ln-secondary-desc">
                          {(item.short_description || item.description || "")
                            .slice(0, 110)
                            .trim()}
                          {(item.short_description || item.description || "").length > 110 && "…"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* MORE NEWS GRID SECTION */}
        {moreNews.length > 0 && (
          <section className="ln-more-section" aria-label="More Latest News">
            <div className="ln-section-header">
              <h2 className="ln-section-title">More News</h2>
              <div className="ln-section-line" />
            </div>

            <div className="ln-news-grid">
              {moreNews.map((item, idx) => {
                const isInterval = (idx + 1) % INLINE_AD_INTERVAL === 0;
                const hasMoreRemaining = idx + 1 < moreNews.length;
                const slotIndex = Math.floor((idx + 1) / INLINE_AD_INTERVAL) - 1;
                const isWithinMaxAds = slotIndex < MAX_INLINE_ADS;
                const shouldShowAd =
                  isInterval && hasMoreRemaining && isWithinMaxAds && banners.length > 0;

                return (
                  <React.Fragment key={item._id}>
                    <Link
                      to={`/news/${item._id}`}
                      className="ln-grid-card"
                    >
                      <div className="ln-grid-image-wrapper">
                        {item.main_image || item.thumbnail_image ? (
                          <img
                            src={buildImageUrl(item.main_image || item.thumbnail_image)}
                            alt={item.title}
                            className="ln-grid-img"
                            loading="lazy"
                          />
                        ) : (
                          <div className="ln-image-placeholder small">Hello Dewas</div>
                        )}
                        {item.categories && (
                          <span className="ln-grid-category-badge">{item.categories}</span>
                        )}
                      </div>

                      <div className="ln-grid-body">
                        <div className="ln-meta-row">
                          <span className="ln-meta-date">
                            {new Date(item.published_at || item.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <h3 className="ln-grid-title">{item.title}</h3>
                        <p className="ln-grid-desc">
                          {(item.short_description || item.description || "")
                            .slice(0, 115)
                            .trim()}
                          {(item.short_description || item.description || "").length > 115 && "…"}
                        </p>
                      </div>
                    </Link>

                    {/* Inline Advertisement Banner */}
                    {shouldShowAd && (
                      <div className="ln-ad-row" key={`inline-ad-${slotIndex}`}>
                        <AdBannerSlider
                          banners={banners}
                          slotIndex={slotIndex}
                          startOffset={slotIndex % banners.length}
                        />
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
