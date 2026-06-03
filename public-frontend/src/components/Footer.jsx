import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "../assets/hello-dewas-logo.png";

const Footer = () => {
  return (
    <footer className="footers">

      <div className="footer-top">

        {/* COLUMN 1 */}
        <div className="footer-col">
          <Link to="/">
          <img src={logo} alt="Hello Dewas" className="footer-logo" />
          </Link>

          <h4>City News & Updates</h4>
          <p className="footer-desc">
            The latest news, articles, and blogs, sent
            straight to your inbox every month.
          </p>

          <div className="footer-subscribe">
            <input type="email" placeholder="Your Mail" />
            <button>Subscribe</button>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            <a href="\about"><li>About Dewas</li></a>
            <a href="\explore"><li>Sight Seeing</li></a>
            <a href="\events"><li>Events</li></a>
            <a href="\stories"><li>Stories</li></a>
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className="footer-col">
          <h4>Our Services</h4>
          <ul>
            <a href="\about"><li>City Guide</li></a>
            <a href="\business-listing"><li>Business Listing</li></a>
            <a href="\services"><li>Digital Marketing</li></a>
            <a href="\event-promotion"><li>Event Promotion</li></a>
            <a href="\emergency-helpline"><li>Emergency Helpline</li></a>
            <li>Transportation</li>
            <li>Business & Industries</li>
            <li>Town Gallery</li>
            <li>Blogs & Articles</li>
          </ul>
        </div>

        {/* COLUMN 4 */}
        <div className="footer-col">
          <h4>Get In Touch</h4>

          <p className="footer-contact">
            <i className="bi bi-clock"></i>
            Opening Hours: Mon – Fri: 10:00 am – 6:00 pm
          </p>

          <p className="footer-contact">
            <i className="bi bi-telephone"></i>
            Phone: 7000152525 , 89627 48593
          </p>

          <p className="footer-contact">
            <i className="bi bi-envelope"></i>
            Email: info@hellodewas.com
          </p>

          <h5>Social Links</h5>
          <div className="footer-socials">
            <i className="bi bi-whatsapp"></i>
            <i className="bi bi-pinterest"></i>
            <i className="bi bi-twitter-x"></i>
            <i className="bi bi-youtube"></i>
            <i className="bi bi-instagram"></i>
            <i className="bi bi-facebook"></i>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        Hello Dewas – copyright © 2023. All Rights Reserved
      </div>

    </footer>
  );
};

export default Footer;
