// src/sections/MoreNewsSection.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNews, getAllBanners, buildImageUrl } from "../api/api";
import "./MoreNewsSection.css";

const INLINE_AD_INTERVAL = 8;
const MAX_INLINE_ADS = 3;

function BannerSlider({ banners, startOffset = 0, slotIndex = 0 }) {
  const [index, setIndex] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef(null);

  // simple mobile detection
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

  // Pause carousel autoplay if outside viewport
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

  // Rotate starting banner deterministically by slot index
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
    <div className="mn-banner-wrapper" ref={containerRef}>
      <div className="mn-ad-label">Advertisement</div>
      <div
        className="mn-banner-slider"
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
            className="mn-banner-arrow mn-banner-arrow-left"
            onClick={prev}
            aria-label="Previous advertisement"
          >
            ‹
          </button>
        )}

        <div className="mn-banner-window">
          <img
            src={buildImageUrl(imgPath)}
            alt={current.title || "Advertisement Banner"}
            className="mn-banner-img"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        </div>

        {hasMultiple && (
          <button
            type="button"
            className="mn-banner-arrow mn-banner-arrow-right"
            onClick={next}
            aria-label="Next advertisement"
          >
            ›
          </button>
        )}

        {hasMultiple && (
          <div className="mn-banner-dots">
            {banners.map((b, i) => (
              <span
                key={b._id || `dot-${slotIndex}-${i}`}
                className={
                  "mn-banner-dot" +
                  (i === currentBannerIndex ? " mn-banner-dot-active" : "")
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

export default function MoreNewsSection() {
  const [news, setNews] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const newsData = await getAllNews();
        const sortedNews = (newsData || []).slice().sort((a, b) => {
          const da = new Date(a.published_at || a.createdAt || 0).getTime();
          const db = new Date(b.published_at || b.createdAt || 0).getTime();
          return db - da; // latest first
        });

        const bannerData = (await getAllBanners()) || [];

        setNews(sortedNews);
        setBanners(bannerData);
      } catch (err) {
        console.error("MoreNewsSection load error:", err);
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
      <section className="more-news-section container my-5">
        <p>Loading more news...</p>
      </section>
    );
  }

  if (!news || news.length === 0) {
    return (
      <section className="more-news-section container my-5">
        <div className="d-flex align-items-center mb-4">
          <h2 className="mn-heading">More News</h2>
          <div className="flex-grow-1 ms-3 mn-heading-underline" />
        </div>
        <p>No news available.</p>
      </section>
    );
  }

  const activeBanners = (banners || []).filter(
    (b) => b && b.display !== false && b.status !== "inactive"
  );

  const featured = news[0];          // big center card
  const leftSmall = news.slice(1, 3);
  const rightSmall = news.slice(3, 5);
  const rest = news.slice(5);        // medium grid cards (desktop)
  const small = news.slice(1);       // grid cards (mobile/tablet)

  return (
    <section className="more-news-section container my-5">
      <div className="d-flex align-items-center mb-4">
        <h2 className="mn-heading">More News</h2>
        <div className="flex-grow-1 ms-3 mn-heading-underline" />
      </div>

      {/* TOP ROW: left small list, big featured, right small list */}
      <div className="mn-top-row">
        <div className="mn-side-column">
          {leftSmall.map((item) => (
            <div
              key={item._id}
              className="mn-side-card"
              onClick={() => openNews(item._id)}
            >
              <div className="mn-side-thumb-wrapper">
                {item.main_image || item.thumbnail || item.main_image ? (
                  <img
                    src={buildImageUrl(
                      item.main_image || item.thumbnail || item.main_image
                    )}
                    alt={item.title}
                  />
                ) : null}
              </div>
              <div className="mn-side-meta">
                <div className="mn-date">
                  {new Date(
                    item.published_at || item.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="mn-title-small">{item.title}</div>
                <div className="mn-desc-small">
                  {(item.short_description || item.description || "")
                    .slice(0, 90)
                    .trim()}
                  {(item.short_description || item.description || "").length >
                    90 && "…"}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div
          className="mn-main-column"
          onClick={() => openNews(featured._id)}
        >
          <div className="mn-main-card">
            <div className="mn-main-image-wrapper">
              {featured.main_image || featured.thumbnail_image ? (
                <img
                  src={buildImageUrl(
                    featured.main_image || featured.thumbnail_image
                  )}
                  alt={featured.title}
                />
              ) : null}
            </div>
            <div className="mn-main-body">
              <div className="mn-main-meta">
                <span className="mn-main-category">
                  Latest News
                </span>
                <span className="mn-main-date">
                  {new Date(
                    featured.published_at || featured.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="mn-main-title">{featured.title}</h3>
              <p className="mn-main-desc">
                {(featured.short_description || featured.description || "")
                  .slice(0, 210)
                  .trim()}
                {(featured.short_description || featured.description || "")
                  .length > 210 && "…"}
              </p>
            </div>
          </div>
        </div>

        <div className="mn-side-column">
          {rightSmall.map((item) => (
            <div
              key={item._id}
              className="mn-side-card"
              onClick={() => openNews(item._id)}
            >
              <div className="mn-side-thumb-wrapper">
                {item.main_image || item.thumbnail || item.main_image ? (
                  <img
                    src={buildImageUrl(
                      item.main_image || item.thumbnail || item.main_image
                    )}
                    alt={item.title}
                  />
                ) : null}
              </div>
              <div className="mn-side-meta">
                <div className="mn-date">
                  {new Date(
                    item.published_at || item.createdAt
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
                <div className="mn-title-small">{item.title}</div>
                <div className="mn-desc-small">
                  {(item.short_description || item.description || "")
                    .slice(0, 90)
                    .trim()}
                  {(item.short_description || item.description || "").length >
                    90 && "…"}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BELOW: Desktop 4-column grid with inline advertisements every 8 cards */}
      <div className="mn-grid-wrapper">
        {rest.map((item, idx) => {
          const isInterval = (idx + 1) % INLINE_AD_INTERVAL === 0;
          const hasMoreNews = idx + 1 < rest.length;
          const slotIndex = Math.floor((idx + 1) / INLINE_AD_INTERVAL) - 1;
          const isWithinMax = slotIndex < MAX_INLINE_ADS;
          const shouldShowAd =
            isInterval && hasMoreNews && isWithinMax && activeBanners.length > 0;

          return (
            <React.Fragment key={item._id || `rest-${idx}`}>
              <div
                className="mn-grid-card"
                onClick={() => openNews(item._id)}
              >
                <div className="mn-grid-image-wrapper">
                  {item.main_image || item.thumbnail_image ? (
                    <img
                      src={buildImageUrl(
                        item.main_image || item.thumbnail_image
                      )}
                      alt={item.title}
                    />
                  ) : null}
                </div>
                <div className="mn-grid-body">
                  <div className="mn-date">
                    {new Date(
                      item.published_at || item.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <h4 className="mn-grid-title">{item.title}</h4>
                  <p className="mn-grid-desc">
                    {(item.short_description || item.description || "")
                      .slice(0, 120)
                      .trim()}
                    {(item.short_description || item.description || "").length >
                      120 && "…"}
                  </p>
                </div>
              </div>

              {shouldShowAd && (
                <div
                  className="mn-banner-row"
                  key={`inline-ad-slot-${slotIndex}`}
                >
                  <BannerSlider
                    banners={activeBanners}
                    slotIndex={slotIndex}
                    startOffset={slotIndex % activeBanners.length}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile/Tablet responsive grid with inline advertisements */}
      <div className="mna-grid-wrapper">
        {small.map((item, idx) => {
          const isInterval = (idx + 1) % INLINE_AD_INTERVAL === 0;
          const hasMoreNews = idx + 1 < small.length;
          const slotIndex = Math.floor((idx + 1) / INLINE_AD_INTERVAL) - 1;
          const isWithinMax = slotIndex < MAX_INLINE_ADS;
          const shouldShowAd =
            isInterval && hasMoreNews && isWithinMax && activeBanners.length > 0;

          return (
            <React.Fragment key={item._id || `small-${idx}`}>
              <div
                className="mna-grid-card"
                onClick={() => openNews(item._id)}
              >
                <div className="mna-grid-image-wrapper">
                  {item.main_image || item.thumbnail_image ? (
                    <img
                      src={buildImageUrl(
                        item.main_image || item.thumbnail_image
                      )}
                      alt={item.title}
                    />
                  ) : null}
                </div>
                <div className="mna-grid-body">
                  <div className="mna-date">
                    {new Date(
                      item.published_at || item.createdAt
                    ).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </div>
                  <h4 className="mna-grid-title">{item.title}</h4>
                  <p className="mna-grid-desc">
                    {(item.short_description || item.description || "")
                      .slice(0, 120)
                      .trim()}
                    {(item.short_description || item.description || "").length >
                      120 && "…"}
                  </p>
                </div>
              </div>

              {shouldShowAd && (
                <div
                  className="mna-banner-row"
                  key={`mna-ad-slot-${slotIndex}`}
                >
                  <BannerSlider
                    banners={activeBanners}
                    slotIndex={slotIndex}
                    startOffset={slotIndex % activeBanners.length}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </section>
  );
}

