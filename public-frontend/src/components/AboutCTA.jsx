import "./AboutCTA.css";
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

        <button className="about-cta-btn">
          Get Started
        </button>
      </div>
    </section>
  );
};

export default AboutCTA;
