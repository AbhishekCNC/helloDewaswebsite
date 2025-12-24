import React, { useState } from "react";
import "./CityFeaturedSection.css";
import BRimage from "../assets/br-logo.png";
import Nirlip from "../assets/nirlip-logo.png";
import CIA from "../assets/cia-logo.png";
import birla from "../assets/birla-logo.png";

const featuredPlaces = [
  {
    id: 1,
    name: "BR Resort & Club",
    description:
      "Best place outside city traffic for recreation, family fun and celebration.",
    details:
      "Address: Indore – Bhopal Highway, Amriya Village, near Sonkatch, Dist. Dewas 455118 (M.P.)\nTimings: Open 24 Hours\nContact No.: 8819920202 / 9343877171",
    // TODO: replace with your real image path
    logo: BRimage,
  },
  {
    id: 2,
    name: "Nirlip",
    description: "A New Age Arena!! One Spot For Sports & Fitness.",
    details:
      "Address: Nirlip Sports & Fitness Hub, Opposite District Jail Rajoda Road Dewas (M.P.)\nTimings: 11:00 AM to 8:00 PM\nContact No.: 7489833415",
    logo: Nirlip,
  },
  {
    id: 3,
    name: "Central India Academy",
    description: "CBSE school in Dewas.",
    details:
      "Address: Bhopal – Indore Rd, Dewas, Madhya Pradesh 455001\nTimings: 08:00 AM to 04:00 PM\nContact No.: 07272-407914",
    logo: CIA,
  },
  {
    id: 4,
    name: "Birla Open Minds International School, Dewas",
    description: "Nurturing India’s Tomorrow.",
    details:
      "Address: Maharani Lakshmibai Library, in front of Sadguru Honda, A.B. Road, Bhopal Chouraha, Dewas\nTimings: 10:00 AM to 04:00 PM\nContact No.: 6262390003",
    logo: birla,
  },
];

export default function CityFeaturedSection() {
  const [activeIndex, setActiveIndex] = useState(0); // for mobile slider

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? featuredPlaces.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setActiveIndex((prev) =>
      prev === featuredPlaces.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <section className="city-featured-section">
      <div className="container">
        {/* Heading */}
        <div className="d-flex align-items-center mb-4">
          <h2 className="city-featured-title mb-0">Dewas City Featured</h2>
          <div className="city-featured-underline ms-3" />
        </div>

        <div className="city-mobile-arrows d-md-none">
          <button
            type="button"
            className="city-arrow-btn"
            onClick={prevSlide}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            type="button"
            className="city-arrow-btn"
            onClick={nextSlide}
            aria-label="Next"
          >
            ›
          </button>
        </div>


        {/* Cards */}
        <div className="row g-4 city-featured-row">
          {featuredPlaces.map((place, index) => (
            <div
              key={place.id}
              className={`col-12 col-md-6 col-lg-3 city-featured-card-wrapper ${
                index === activeIndex ? "active-mobile" : ""
              }`}
            >
              <div className="city-featured-card">
                <div className="city-featured-logo-wrap">
                  <img
                    src={place.logo}
                    alt={place.name}
                    className="city-featured-logo"
                    onError={(e) => {
                      e.target.style.display = "none";
                    }}
                  />
                </div>
                <h5 className="city-featured-name">{place.name}</h5>
                <p className="city-featured-desc">{place.description}</p>
                <p className="city-featured-details">
                  {place.details.split("\n").map((line, i) => (
                    <span key={i}>
                      {line}
                      <br />
                    </span>
                  ))}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile slider arrows */}
        <div className="city-mobile-arrows d-md-none">
          <button
            type="button"
            className="city-arrow-btn"
            onClick={prevSlide}
            aria-label="Previous"
          >
            
          </button>
          <button
            type="button"
            className="city-arrow-btn"
            onClick={nextSlide}
            aria-label="Next"
          >
            
          </button>
        </div>

        {/* Join hello! Dewas block */}
        <div className="city-join-section text-center mt-5">
          <h2 className="city-join-title">Join hello! Dewas</h2>
          <p className="city-join-text">
            Just a small effort to show the world what a gem ‘Dewas’ is.
            Bringing soul, sight &amp; soil of our city in one place. From
            anything to everything about Dewas and for the people of Dewas. Get
            your daily dose of city buzz!! only on hello! DEWAS.
          </p>

          <div className="city-join-socials d-flex justify-content-center gap-3 mt-4">
            <button className="city-social-btn">
              <i className="bi bi-whatsapp" />
            </button>
            <button className="city-social-btn">
              <i className="bi bi-instagram" />
            </button>
            <button className="city-social-btn">
              <i className="bi bi-twitter-x" />
            </button>
            <button className="city-social-btn">
              <i className="bi bi-youtube" />
            </button>
            <button className="city-social-btn">
              <i className="bi bi-facebook" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
