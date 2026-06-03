import "./AboutCTA.css";
import { Link } from "react-router-dom";
import bgImage from "../assets/hero-desktop.png";

const AboutCTA = () => {
  return (
    <section
      className="about-cta"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="about-cta-overlay"></div>

      <div className="about-cta-content">
        <p className="about-cta-subtitle">
          Boost Visibility With Hello Dewas
        </p>

        <h2 className="about-cta-title">
          We Make Your Brand Easy to Find
          <br />
          — and Hard to Ignore
        </h2>

        <Link className="about-cta-btn" to="/services">
          Get Started
        </Link>
      </div>
    </section>
  );
};

export default AboutCTA;
