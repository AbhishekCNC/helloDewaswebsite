import React, { useState, useEffect, useRef, useMemo } from "react";
import "./HeroSection.css";
import { Link } from "react-router-dom";
import logo from "../assets/hello-dewas-logo.png";

export default function HeroSection({ latestNews, latestEvents }) {
  // 'news' or 'events'
  const [activeType, setActiveType] = useState("news");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const touchStartX = useRef(null);

  // decide which list is active
  const activeList = useMemo(() => {
    return activeType === "news" ? latestNews || [] : latestEvents || [];
  }, [activeType, latestNews, latestEvents]);

  const activeItem =
    activeList && activeList.length > 0 ? activeList[currentIndex] : null;

  // auto-slide every 3.5 seconds
  useEffect(() => {
    if (!activeList || activeList.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 < activeList.length ? prev + 1 : 0));
    }, 3500);

    return () => clearInterval(interval);
  }, [activeList]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (Math.abs(diff) > 40 && activeList.length > 1) {
      if (diff > 0) {
        // Swipe left -> Next slide
        setCurrentIndex((prev) => (prev + 1 < activeList.length ? prev + 1 : 0));
      } else {
        // Swipe right -> Prev slide
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeList.length - 1));
      }
    }
    touchStartX.current = null;
  };

  return (
    <div className="hero-wrapper">
      <div className="hero-overlay">
        {/* Top Navbar */}
        <header className="hero-navbar container d-flex align-items-center justify-content-between">
          {/* Left: Logo */}
          <div className="hero-logo">
            <img
              src={logo}
              alt="hello! Dewas"
              className="hero-logo-img"
            />
          </div>

          {/* Center: Nav links (desktop only) */}
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
            <button className="hero-search-btn d-none d-lg-flex align-items-center justify-content-center" aria-label="Search">
              <i className="bi bi-search"></i>
            </button>
            <button className="hero-contact">Contact With Us</button>

            {/* Mobile burger icon */}
            <button 
              className="hero-burger d-lg-none"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Navigation"
            >
              ☰
            </button>
          </div>
        </header>

        {/* Mobile Navigation Menu */}
        <nav className={`hero-nav-mobile d-lg-none ${isMenuOpen ? "active" : ""}`}>
          <a href="/" className="hero-nav-link" onClick={() => setIsMenuOpen(false)}>
            Home
          </a>
          <a href="/about" className="hero-nav-link" onClick={() => setIsMenuOpen(false)}>
            About Dewas
          </a>
          <a href="/latest-news" className="hero-nav-link" onClick={() => setIsMenuOpen(false)}>
            Latest News
          </a>
          <a href="/explore" className="hero-nav-link" onClick={() => setIsMenuOpen(false)}>
            Explore
          </a>
          <a href="/events" className="hero-nav-link" onClick={() => setIsMenuOpen(false)}>
            Events
          </a>
          <a href="/stories" className="hero-nav-link" onClick={() => setIsMenuOpen(false)}>
            Stories
          </a>
          <a href="/services" className="hero-nav-link" onClick={() => setIsMenuOpen(false)}>
            Our Services
          </a>
        </nav>

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
                <Link to="/about" className="hero-primary-btn">
                  About Dewas
                </Link>
                <Link to="/latest-news" className="hero-secondary-btn">
                  Latest News
                </Link>
              </div>
            </div>

            {/* Right side slider card */}
            <div className="col-lg-4 offset-lg-1 hero-right-card-wrapper">
              <div 
                className="hero-slider-card"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                {/* 1. Header: 2-line Title + Toggle Tabs */}
                <div className="hero-slider-header d-flex justify-content-between align-items-start">
                  <span className="hero-slider-title">
                    {activeType === "news" ? (
                      <>
                        Latest<br />News
                      </>
                    ) : (
                      <>
                        Latest<br />Events
                      </>
                    )}
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
                      type="button"
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
                      type="button"
                    >
                      Events
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="hero-slider-body fade-item" key={`${activeType}-${currentIndex}`}>
                  {activeItem ? (
                    <>
                      {/* 2. Headline area (max 3 lines reserved) */}
                      <p className="hero-slider-label">
                        {activeItem.title || ""}
                      </p>

                      {/* 3. Description area (max 3 lines reserved) */}
                      <p className="hero-slider-text">
                        {activeItem.short_description || activeItem.description || " "}
                      </p>

                      {/* 4. Read More link */}
                      <Link
                        to={
                          activeType === "news"
                            ? `/news/${activeItem._id}`
                            : `/events`
                        }
                        className="hero-read-btn"
                      >
                        Read More →
                      </Link>

                      {/* 5. Footer containing Date & Dots at original spacing */}
                      <div className="hero-slider-footer">
                        <p className="hero-slider-date">
                          {activeItem.published_at || activeItem.createdAt || activeItem.date || activeItem.event_date
                            ? `📅 ${new Date(
                                activeItem.published_at || activeItem.createdAt || activeItem.date || activeItem.event_date
                              ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}`
                            : "📅 —"}
                        </p>

                        {/* Inner dots */}
                        <div className="hero-inner-dots" aria-label="Slide indicators">
                          {activeList && activeList.length > 0 ? (
                            activeList.map((item, idx) => (
                              <span
                                key={item._id || idx}
                                className={`dot ${
                                  idx === currentIndex ? "active" : ""
                                }`}
                                onClick={() => setCurrentIndex(idx)}
                                role="button"
                                tabIndex={0}
                                aria-label={`Go to slide ${idx + 1}`}
                              ></span>
                            ))
                          ) : (
                            <span className="dot active"></span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="hero-slider-empty-wrap">
                      <p className="hero-slider-label">
                        {activeType === "news"
                          ? "No news available"
                          : "No events available"}
                      </p>
                      <p className="hero-slider-text">
                        Please check back soon for latest {activeType}.
                      </p>
                      <div className="hero-slider-footer">
                        <p className="hero-slider-date">📅 —</p>
                        <div className="hero-inner-dots">
                          <span className="dot active"></span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Outer slider indicator */}
                <div className="hero-outer-dots">
                  <span
                    className={`outer-dot ${
                      activeType === "news" ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveType("news");
                      setCurrentIndex(0);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Switch to Latest News"
                  ></span>
                  <span
                    className={`outer-dot ${
                      activeType === "events" ? "active" : ""
                    }`}
                    onClick={() => {
                      setActiveType("events");
                      setCurrentIndex(0);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label="Switch to Latest Events"
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


