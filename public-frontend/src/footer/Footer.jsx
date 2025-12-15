import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        {/* Left Section */}
        <div className="footer-col footer-about">
          <div className="footer-logo">
            <span className="logo-main">hello!</span>
            <span className="logo-sub">DEWAS</span>
          </div>

          <h5>City News & Updates</h5>
          <p className="footer-text">
            The latest news, articles, and blogs, sent straight to your inbox every month.
          </p>

          <div className="footer-subscribe">
            <input type="email" placeholder="Your Mail" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/about">About Dewas</Link></li>
            <li><Link to="/explore">Sight Seeing</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/stories">Stories</Link></li>
          </ul>
        </div>

        {/* Our Services */}
        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <li>City Guide</li>
            <li>Business Listing</li>
            <li>Digital Marketing</li>
            <li>Event Promotion</li>
            <li>Emergency Helpline</li>
            <li>Transportation</li>
            <li>Business & Industries</li>
            <li>Town Gallery</li>
            <li>Blogs & Articles</li>
          </ul>
        </div>

        {/* Get In Touch */}
        <div className="footer-col">
          <h4>Get In Touch</h4>

          <p>
            <i className="bi bi-clock"></i>
            <strong> Opening Hours:</strong> Mon – Fri: 10:00 am – 6:00 pm
          </p>

          <p>
            <i className="bi bi-telephone"></i>
            <strong> Phone:</strong> 7000152525, 89627 48593
          </p>

          <p>
            <i className="bi bi-envelope"></i>
            <strong> Email:</strong> info@hellodewas.com
          </p>

          <h5 className="social-title">Social Links</h5>
          <div className="footer-social">
            <a href="#"><i className="bi bi-whatsapp"></i></a>
            <a href="#"><i className="bi bi-pinterest"></i></a>
            <a href="#"><i className="bi bi-twitter"></i></a>
            <a href="#"><i className="bi bi-youtube"></i></a>
            <a href="#"><i className="bi bi-instagram"></i></a>
            <a href="#"><i className="bi bi-facebook"></i></a>
          </div>
        </div>

      </div>
    </footer>
  );
}
