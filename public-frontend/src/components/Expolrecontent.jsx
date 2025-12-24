import React from "react";
import "./Explore.css";
import { Link } from "react-router-dom";
import heritage from "../assets/heritage.png";
import nautre from "../assets/nature.png";
import spiritual from "../assets/spiritual.png";
import luxury from "../assets/luxury.png";
import shopping from "../assets/shopping.png";
import eating from "../assets/eating.png";



/*
  Usage:
  - Put this file at src/pages/Explore.jsx
  - Put Explore.css next to it at src/pages/Explore.css
  - Add images into src/assets/explore/ with the exact file names below (or adjust paths)
  - Each card uses <Link to="/explore/<slug>"> — replace with real routes when ready
*/

const CARDS = [
  { id: "heritage", title: "Heritage", img: heritage, to: "/heritage" },
  { id: "nature", title: "Nature", img: nautre, to: "/nature" },
  { id: "spiritual", title: "Spiritual", img: spiritual, to: "/spiritual" },
  { id: "luxury", title: "Luxury", img: luxury, to: "/luxury" },
  { id: "shopping", title: "Shopping", img: shopping, to: "/shopping" },
  { id: "eating", title: "Eating Out", img: eating, to: "/eating-out" },
];

export default function Explore() {
  return (
    <main className="explore-page">
      <div className="container explore-inner">
        <header className="explore-header text-center">
          <h1 className="explore-hero">Explore Dewas</h1>
          <p className="explore-sub">
            Welcome To Hello Dewas
          </p>
          <p className="explore-sub-second">
            We are offering the following information's
about us that what we actually.
          </p>
          <p className="explore-sub-third">
            At Hello Dewas, We're Passionate About Creating A Platform That Connects The People, Culture, And Businesses Of Dewas.
From Local News And Events To Inspiring Stories And Innovations — We Bring Together Everything That Makes Our City Unique.
Our Goal Is To Empower The Community With Transparent, Engaging, And Trustworthy Information —
Right From The Heart Of Dewas.
          </p>
        </header>

        <section className="explore-grid" aria-label="Explore categories">
          {CARDS.map((c) => (
            <Link key={c.id} to={c.to} className="explore-card" aria-label={`Explore ${c.title}`}>
              <div className="explore-card-image-wrapper">
                {/* Use loading="lazy" for faster page loads */}
                <img
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  width="497"
                  height="457"
                  className="explore-card-image"
                />
              </div>
              <div className="explore-card-title">{c.title}</div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
