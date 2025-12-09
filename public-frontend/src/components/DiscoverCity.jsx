import React from "react";
import "./DiscoverCity.css";

const tiles = [
  {
    key: "sightseeing",
    icon: "bi bi-image",
    title: "Sightseeing",
    subtitle: "Explore historical & cultural spots",
  },
  {
    key: "health-fitness",
    icon: "bi bi-heart-pulse",
    title: "Health & Fitness",
    subtitle: "Wellness, gyms & clinics",
  },
  {
    key: "education-skills",
    icon: "bi bi-mortarboard",
    title: "Education & Skills",
    subtitle: "Schools, colleges & learning centers",
  },
  {
    key: "health-sports",
    icon: "bi bi-person-swimming",
    title: "Health & Sports",
    subtitle: "Playgrounds, stadiums & activities",
  },
  {
    key: "jobs-training",
    icon: "bi bi-search",
    title: "Jobs & Training",
    subtitle: "Career & skill development",
  },
  {
    key: "shopping",
    icon: "bi bi-bag",
    title: "Shopping at Dewas",
    subtitle: "Markets & local stores",
  },
  {
    key: "roads-transport",
    icon: "bi bi-bus-front",
    title: "Roads & Transportation",
    subtitle: "Travel & connectivity",
  },
  {
    key: "business",
    icon: "bi bi-buildings",
    title: "Business & Industries",
    subtitle: "Industrial growth & opportunities",
  },
];

export default function DiscoverCity() {
  return (
    <section className="discover-section">
      {/* background circles */}
      <div className="discover-blob discover-blob-left"></div>
      <div className="discover-blob discover-blob-right"></div>

      <div className="container position-relative">
        {/* Heading */}
        <div className="discover-header d-flex align-items-center mb-4 mb-md-5">
          <h2 className="discover-title mb-0">Discover the City</h2>
          <div className="discover-line ms-3 ms-md-4"></div>
        </div>

        {/* Cards grid */}
        <div className="discover-grid">
          {tiles.map((item) => (
            <div className="discover-card" key={item.key}>
              <div className="discover-icon">
                <i className={item.icon}></i>
              </div>
              <h3 className="discover-card-title">{item.title}</h3>
              <p className="discover-card-text">{item.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

