import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";
import logo from "../assets/hello-dewas-logo.png";

export default function HeroSection({ latestNews, latestEvents }) {
  // 'news' or 'events'
  const [activeType, setActiveType] = useState("news");
  const [currentIndex, setCurrentIndex] = useState(0);

  // decide which list is active
  const activeList =
    activeType === "news" ? latestNews || [] : latestEvents || [];

  const activeItem =
    activeList && activeList.length > 0 ? activeList[currentIndex] : null;

  // helper: truncate text by words and append ellipsis when truncated
  const truncateWords = (text, limit) => {
    if (!text) return "";
    const words = String(text).split(/\s+/).filter(Boolean);
    if (words.length <= limit) return words.join(" ");
    return words.slice(0, limit).join(" ") + "...";
  };

  // auto-slide every 2 seconds
  useEffect(() => {
    if (!activeList || activeList.length === 0) return;

    // reset to first item when list or type changes
    setCurrentIndex(0);

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 < activeList.length ? prev + 1 : 0));
    }, 2000); // 2 seconds

    return () => clearInterval(interval);
  }, [activeType, latestNews, latestEvents]);

  return (
    <div className="hero-wrapper">
      <div className="hero-overlay">
        {/* Top Navbar */}
        <header className="hero-navbar container d-flex align-items-center justify-content-between">
          {/* Left: Logo (you will replace with real image) */}
          <div className="hero-logo">
            {/* TEMP text, you will replace with <img /> */}
            <img
              src={logo}
              alt="hello! Dewas"
              className="hero-logo-img"
            />
          </div>

          {/* Center: Nav links (desktop only for now) */}
          <nav className="hero-nav d-none d-lg-flex gap-4">
            <a href="/" className="hero-nav-link">
              Home
            </a>
            <a href="/about" className="hero-nav-link">
              About Dewas
            </a>
            <a href="/latest-news" className="hero-nav-link">
              Latest News
            </a>
            <a href="/explore" className="hero-nav-link">
              Explore
            </a>
            <a href="/events" className="hero-nav-link">
              Events
            </a>
            <a href="/stories" className="hero-nav-link">
              Stories
            </a>
            <a href="/services" className="hero-nav-link">
              Our Services
            </a>
          </nav>

          {/* Right: Search + Contact button */}
          <div className="hero-right d-flex align-items-center gap-3">
            <button className="hero-search-btn d-none d-lg-flex align-items-center justify-content-center">
              <i className="bi bi-search"></i>
            </button>
            <button className="hero-contact">Contact With Us</button>

            {/* Mobile burger icon (only visible on small screens) */}
            <button className="hero-burger d-lg-none">☰</button>
          </div>
        </header>

        {/* Main Hero Content */}
        <div className="container hero-main">
          <div className="row align-items-center">
            {/* Left side text */}
            <div className="col-lg-7 hero-left">
              <p className="hero-welcome">Welcome to</p>
              <h1 className="hero-title">hello! DEWAS</h1>
              <p className="hero-subtitle">
                Arching you towards the unexplored aspects of the city
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <button className="hero-primary-btn">About Dewas</button>
                <button className="hero-secondary-btn">Latest News</button>
              </div>
            </div>

            {/* Right side slider card placeholder */}
            <div className="col-lg-4 offset-lg-1 hero-right-card-wrapper">
              <div className="hero-slider-card">
                <div className="hero-slider-header d-flex justify-content-between align-items-center">
                  <span className="hero-slider-title">
                    {activeType === "news" ? "Latest News" : "Latest Events"}
                  </span>

                  <div className="hero-slider-toggle">
                    <button
                      className={`toggle-btn ${
                        activeType === "news" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveType("news");
                        setCurrentIndex(0);
                      }}
                    >
                      News
                    </button>

                    <button
                      className={`toggle-btn ${
                        activeType === "events" ? "active" : ""
                      }`}
                      onClick={() => {
                        setActiveType("events");
                        setCurrentIndex(0);
                      }}
                    >
                      Events
                    </button>
                  </div>
                </div>

                <div className="hero-slider-body fade-item">
                  {activeItem ? (
                    <>
                      <p className="hero-slider-label">{truncateWords(activeItem.title, 13)}</p>
                      <p className="hero-slider-text">
                        {truncateWords(activeItem.short_description, 23)}
                        <Link
                          to={`/news/${activeItem._id}`}
                          className="hero-read-btn"
                        >
                         <br/> <br />Read More →
                        </Link>
                      </p>
                      <p className="hero-slider-date">
                        {activeItem.published_at
                          ? `📅 ${new Date(
                              activeItem.published_at
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}`
                          : "📅 —"}
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="hero-slider-label">
                        {activeType === "news"
                          ? "No news available"
                          : "No events available"}
                      </p>
                      <p className="hero-slider-text">
                        Please add some {activeType} from the admin panel.
                      </p>
                    </>
                  )}
                </div>

                {/* Inner dots (for inner carousel later) */}
                <div className="hero-inner-dots">
                  {activeList && activeList.length > 0 ? (
                    activeList.map((item, idx) => (
                      <span
                        key={idx}
                        className={`dot ${
                          idx === currentIndex ? "active" : ""
                        }`}
                        onClick={() => setCurrentIndex(idx)}
                      ></span>
                    ))
                  ) : (
                    <>
                      <span className="dot active"></span>
                    </>
                  )}
                </div>

                {/* Outer slider indicator (for switching between Latest News / Latest Event later) */}
                <div className="hero-outer-dots">
                  <span
                    className={`outer-dot ${
                      activeType === "news" ? "active" : ""
                    }`}
                    onClick={() => setActiveType("news")}
                  ></span>
                  <span
                    className={`outer-dot ${
                      activeType === "events" ? "active" : ""
                    }`}
                    onClick={() => setActiveType("events")}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
