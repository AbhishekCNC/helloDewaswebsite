// src/sections/MoreNewsSection.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllNews, getAllBanners, buildImageUrl } from "../api/api";
import "./MoreNewsSection.css";

function BannerSlider({ banners }) {
  const [index, setIndex] = useState(0);

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

  useEffect(() => {
    if (!banners || banners.length === 0) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(id);
  }, [banners]);

  if (!banners || banners.length === 0) return null;

  const current = banners[index];
  const imgPath =
    (isMobile &&
      (current.mobile_image || current.desktop_image || current.image)) ||
    current.desktop_image ||
    current.image;

  const next = () => setIndex((prev) => (prev + 1) % banners.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="mn-banner-slider">
      <button className="mn-banner-arrow mn-banner-arrow-left" onClick={prev}>
        ‹
      </button>

      <div className="mn-banner-window">
        {imgPath && (
          <img
            src={buildImageUrl(imgPath)}
            alt={current.title || "banner"}
            className="mn-banner-img"
          />
        )}
      </div>

      <button className="mn-banner-arrow mn-banner-arrow-right" onClick={next}>
        ›
      </button>

      <div className="mn-banner-dots">
        {banners.map((b, i) => (
          <span
            key={b._id || i}
            className={
              "mn-banner-dot" + (i === index ? " mn-banner-dot-active" : "")
            }
            onClick={() => setIndex(i)}
          />
        ))}
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
        <h2 className="mn-heading">More News</h2>
        <p>No news available.</p>
      </section>
    );
  }

  const featured = news[0];          // big center card
  const leftSmall = news.slice(1, 3);
  const rightSmall = news.slice(3, 5);
  const rest = news.slice(5);        // medium grid cards
  const small = news.slice(1);

  return (
    <section className="more-news-section container my-5">
      <h2 className="mn-heading">More News</h2>

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

      {/* BELOW: medium cards grid + banner slider row in between */}
      <div className="mn-grid-wrapper">
        {rest.map((item, idx) => (
          <React.Fragment key={item._id}>
            {/* insert banner row AFTER the first row of 4 cards */}
            {idx === 4 && banners && banners.length > 0 && (
              <div className="mn-banner-row">
                <BannerSlider banners={banners.slice(0, 3)} />
              </div>
            )}

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
          </React.Fragment>
        ))}
      </div>

      {/* for mobile view */}
       <div className="mna-grid-wrapper">
        {small.map((item, idx) => (
          <React.Fragment key={item._id}>
            {/* insert banner row AFTER the first row of 4 cards */}
            {idx === 4 && banners && banners.length > 0 && (
              <div className="mna-banner-row">
                <BannerSlider banners={banners.slice(0, 3)} />
              </div>
            )}

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
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
