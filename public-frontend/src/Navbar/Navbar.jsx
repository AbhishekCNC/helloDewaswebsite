import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/hello-dewas.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="navbar-wrapper">
      <nav className="navbar-container">
        {/* MOBILE LEFT */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

        {/* LOGO */}
        <div className="nav-logo">
          <img src={logo} alt="Hello Dewas" />
        </div>

        {/* DESKTOP MENU */}
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li>About Dewas <span>▼</span></li>
          <li>Latest News <span>▼</span></li>
          <li>Explore <span>▼</span></li>
          <li>Events <span>▼</span></li>
          <li>Stories <span>▼</span></li>
          <li>Our Services <span>▼</span></li>
        </ul>

        {/* RIGHT ACTIONS */}
        <div className="nav-actions">
          <i className="bi bi-search" />
          <button className="nav-contact-btn">Contact With Us</button>
          <i className="bi bi-person mobile-only" />
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/">Home</Link>
          <Link to="/about">About Dewas</Link>
          <Link to="/news">Latest News</Link>
          <Link to="/explore">Explore</Link>
          <Link to="/events">Events</Link>
          <Link to="/stories">Stories</Link>
          <Link to="/services">Our Services</Link>
        </div>
      )}
    </header>
  );
}
