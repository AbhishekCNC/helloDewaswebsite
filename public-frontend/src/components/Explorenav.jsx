import { useState } from "react";
import "./Explorenav.css";
import logo from "../assets/hello-dewas-logo.png";

const Explorenav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* DESKTOP NAVBAR */}
      <nav className=" destop-nav">
        <div className="nav-left">
          <a href="/">
            <img src={logo} alt="Hello Dewas" />
          </a>
        </div>

        <ul className="nab-center">
          <li><a href="/">Home</a></li>

          <li>
            <a href="/about">About Dewas <span>⌄</span></a>
          </li>

          <li>
            <a href="/latest-news">Latest News <span>⌄</span></a>
          </li>

          <li>
            <a href="/explore">Explore <span>⌄</span></a>
          </li>

          <li>
            <a href="/events">Events <span>⌄</span></a>
          </li>

          <li>
            <a href="/stories">Stories <span>⌄</span></a>
          </li>

          <li>
            <a href="/services">Our Services <span>⌄</span></a>
          </li>
        </ul>

        <div className="nab-right">
          <a href="/search">
            <i className="bi bi-search"></i>
          </a>

          <a href="/contact">
            <button>Contact With Us</button>
          </a>
        </div>
      </nav>

      {/* MOBILE NAVBAR */}
      <nav className="mobile-nab">
        <div className="mobile-lefrt">
          <i
            className="bi bi-list"
            onClick={() => setMenuOpen(true)}
          ></i>
        </div>

        <div className="mobile-center-nab">
          <a href="/">
            <img src={logo} alt="Hello Dewas" />
          </a>
        </div>

        <div className="mobile-right-nab">
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
        <div className="mobile-menu-header-nab">
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

export default Explorenav;
