// src/pages/NaturePage.jsx
import React from "react";
import "./NaturePage.css";
import Bg from "../assets/bg.png";

const CARDS = [
  {
    id: 1,
    title: "Meetha Talab",
    subtitle: "A peaceful lake in the heart of Dewas",
    img: "/assets/meetha.jpg",
    link: "/explore/meetha-talab",
    number: "01"
  },
  {
    id: 2,
    title: "Rajnai Talab",
    subtitle: "Scenic views and quiet walks",
    img: "/assets/rajnal.jpg",
    link: "/explore/rajnal-talab",
    number: "02"
  },
  {
    id: 3,
    title: "Kedar Kho",
    subtitle: "Lush green valley and hiking trails",
    img: "/assets/kedar.jpg",
    link: "/explore/kedar-kho",
    number: "03"
  },
  {
    id: 4,
    title: "Rajanai Talab (Alt)",
    subtitle: "Another beautiful viewpoint",
    img: "/assets/another.jpg",
    link: "/explore/another",
    number: "04"
  }
];

export default function NaturePage() {
  const bg = Bg;

  return (
    <main className="nd-page">
      {/* HERO / TOP BLOCK */}
       <section
       className="nd-hero-section"
        style={{ backgroundImage: `url(${bg})` }}
        aria-label="Nature hero"
      >
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
    
        {/* <div className="nd-hero-overlay" /> */}

      
            <div className="nd-hero-inner container">
          <div className="nd-hero-left">
            <div className="nd-big-num">01</div>
            <h2 className="nd-hero-title">Meetha Talab</h2>
            <p className="nd-hero-desc">
              The skyline above Meetha Talab is a calm mirror of the sky. The lake and its surrounding greenery create one of Dewas’ most relaxing places to visit.
            </p>
            <a className="nd-hero-cta" href={CARDS[0].link}>Explore Meetha Talab</a>
          </div>

          <div className="nd-hero-right">
            <div className="nd-card-frame">
              <img src={CARDS[0].img} alt={CARDS[0].title} />
            </div>
          </div>
        </div>
        
      </section>

      {/* GRID / LIST OF SECTIONS (Alternating layout) */}
      <section className="nd-list container">
        {CARDS.slice(1).map((c, idx) => {
          const posRight = (idx % 2) === 0; // alternate: first -> right image, next -> left
          return (
            <article key={c.id} className={`nd-item ${posRight ? "image-right" : "image-left"}`}>
              <div className="nd-number">{c.number}</div>

              <div className="nd-thumb-wrap">
                <img src={c.img} alt={c.title} />
              </div>

              <div className="nd-copy">
                <h3 className="nd-title">{c.title}</h3>
                <p className="nd-sub">{c.subtitle}</p>
                <a className="nd-link" href={c.link}>Explore {c.title}</a>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
