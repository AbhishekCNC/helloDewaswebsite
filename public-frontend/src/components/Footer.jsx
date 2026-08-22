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
            <a href="\"><li>Business Listing</li></a>
            <a href="\services"><li>Digital Marketing</li></a>
            <a href="\"><li>Event Promotion</li></a>
            <a href="\"><li>Emergency Helpline</li></a>
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
            <a href="https://chat.whatsapp.com/CIpNdN0E7FHCoOP1G1Wpm0?mode=ems_copy_t" target="_blank" rel="noreferrer" aria-label="WhatsApp">
              <i className="bi bi-whatsapp"></i>
            </a>
            <a href="https://pin.it/3vbeGal" target="_blank" rel="noreferrer" aria-label="Pinterest">
              <i className="bi bi-pinterest"></i>
            </a>
            <a href="https://twitter.com/hellodewas?s=09" target="_blank" rel="noreferrer" aria-label="X">
              <i className="bi bi-twitter-x"></i>
            </a>
            <a href="https://youtube.com/@hellodewas?si=coNJvENsVTVFoCul" target="_blank" rel="noreferrer" aria-label="YouTube">
              <i className="bi bi-youtube"></i>
            </a>
            <a href="https://www.instagram.com/hellodewas?igsh=MWo1YjF3NnZwdXcwbw==" target="_blank" rel="noreferrer" aria-label="Instagram">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="https://www.facebook.com/share/1CnWBhD16D/" target="_blank" rel="noreferrer" aria-label="Facebook">
              <i className="bi bi-facebook"></i>
            </a>
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
