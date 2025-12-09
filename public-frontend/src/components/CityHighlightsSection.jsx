import React, { useState } from "react";
import "./CityHighlightsSection.css";
import MLA from "../assets/rajmata-photo.png";
import Collector from "../assets/collector-photo.png";
import Sansad from "../assets/sansad-photo.png";
import Mayor from "../assets/Mayor-photo.png";
import Commissioner from "../assets/member-photo.png";


const HIGHLIGHTS = [
  {
    id: 1,
    title: "Gayatri Raje Puar",
    subtitle: "Member of Madhya Pradesh Legislative Assembly from Dewas.",
    details:
      "Phone: NA",
    image: MLA, // ⬅️ replace with your exact path
  },
  {
    id: 2,
    title: "Rishav Gupta",
    subtitle: "Distirict Collector & Distirct Magistrate of Dewas City.",
    details:
      "Phone: +917272-252111",
    image: Collector, // ⬅️ replace with your exact path
  },
  {
    id: 3,
    title: "Mahendra Solanki",
    subtitle: "Member of Parliament from Dewas Lok Sabha Constituency.",
    details:
      "Phone: NA",
    image: Sansad, // ⬅️ replace with your exact path
  },
  {
    id: 4,
    title: "Geeta Durgesh Agrawal",
    subtitle: "Mayor of Dewas Municipal Corporation.",
    details:
      "Phone: NA",
    image: Mayor, // ⬅️ replace with your exact path
  },
  {
    id: 5,
    title: "Rajneesh Kasera",
    subtitle: "Commissioner of Dewas Municipal Corporation.",
    details:
      "Phone: +917272-220333",
    image: Commissioner, // ⬅️ replace with your exact path
  },
];

export default function CityHighlightsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const total = HIGHLIGHTS.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
  };

  return (
    <section className="city-highlights-section">
      <div className="container">
        {/* Heading */}
        <div className="d-flex align-items-center justify-content-center mb-5">
          <div>
            <h2 className="ch-title mb-2">Meet the Council</h2>
            {/* small underline */}
            
            <p className="ch-underline">The city council have the real super powers as
administraion to lead country.</p>
          </div>

          {/* Desktop arrows (hidden on mobile) */}
          <div className="ch-arrows d-none d-md-flex">
            <button className="ch-arrow-btn" onClick={handlePrev}>
              <i className="bi bi-chevron-left" />
            </button>
            <button className="ch-arrow-btn ms-2" onClick={handleNext}>
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </div>

        {/* Slider wrapper */}
        <div className="ch-slider-wrapper">
          <div
            className="ch-slider-track"
            style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          >
            {HIGHLIGHTS.map((item) => (
              <div className="ch-slide" key={item.id}>
                <div className="ch-card">
                  <div className="ch-image-wrapper">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="ch-card-body">
                    <h5 className="ch-card-title">{item.title}</h5>
                    <p className="ch-card-subtitle">{item.subtitle}</p>
                    <p className="ch-card-Twitter"><a href=""><i class="bi bi-twitter-x"></i></a></p>
                    <p className="ch-card-details">
                      {item.details.split("\n").map((line, idx) => (
                        <span key={idx}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile arrows (overlay on sides) */}
          <button className="ch-arrow-mobile ch-arrow-mobile-left d-md-none" onClick={handlePrev}>
            <i className="bi bi-chevron-left" />
          </button>
          <button className="ch-arrow-mobile ch-arrow-mobile-right d-md-none" onClick={handleNext}>
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      </div>
    </section>
  );
}
