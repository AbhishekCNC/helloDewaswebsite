import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/hello-dewas-logo.png";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className=" desktop-nav">
        <div className="nav-left">
          <a href="/">
            <img src={logo} alt="Hello Dewas" />
          </a>
        </div>

        <ul className="nav-center">
          <li><a href="/">Home</a></li>

          <li>
            <a href="/about">About Dewas </a>
          </li>

          <li>
            <a href="/latest-news">Latest News </a>
          </li>

          <li>
            <a href="/explore">Explore </a>
          </li>

          <li>
            <a href="/events">Events </a>
          </li>

          <li>
            <a href="/stories">Stories </a>
          </li>

          <li>
            <a href="/services">Our Services</a>
          </li>
        </ul>

        <div className="nav-right">
          <a href="/search">
            <i className="bi bi-search"></i>
          </a>

          <a href="/contact">
            <button>Contact With Us</button>
          </a>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav className="mobile-nav">
        <div className="mobile-left">
          <i
            className="bi bi-list"
            onClick={() => setMenuOpen(true)}
          ></i>
        </div>

        <div className="mobile-center">
          <a href="/">
            <img src={logo} alt="Hello Dewas" />
          </a>
        </div>

        <div className="mobile-right">
          <a href="/search">
            <i className="bi bi-search"></i>
          </a>
          <a href="/profile">
            <i className="bi bi-person"></i>
          </a>
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} ban>
        <div className="mobile-menu-header">
          <i
            className="bi bi-x-lg"
            onClick={() => setMenuOpen(false)}
          ></i>
        </div>

        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/about">About Dewas</a></li>
          <li><a href="/news">Latest News</a></li>
          <li><a href="/explore">Explore</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/stories">Stories</a></li>
          <li><a href="/services">Our Services</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
    </>
  );
};

export default Navbar;
