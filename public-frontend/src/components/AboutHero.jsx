import "./About.css";

const AboutHero = () => {
  return (
    <section className="about-hero">
      {/* Background Text */}
      <h1 className="about-hero-bg">About Us</h1>

      {/* Foreground Content */}
      <div className="about-hero-content">
        <p className="about-hero-welcome">
          Welcome to Hello Dewas
        </p>

        <h2 className="about-hero-title">
          We Are Building a Connected Digital City
        </h2>

        <p className="about-hero-desc">
          At Hello Dewas, We’re Passionate About Creating A Platform That
          Connects The People, Culture, And Businesses Of Dewas.
          <br />
          From Local News And Events To Inspiring Stories And Innovations —
          We Bring Together Everything That Makes Our City Unique.
          <br />
          Our Goal Is To Empower The Community With Transparent, Engaging,
          And Trustworthy Information —
          <br />
          Right From The Heart Of Dewas.
        </p>

        <p className="about-hero-footer">
          We are offering the following information’s about us
          <br />
          that what we actually.
        </p>
      </div>
    </section>
  );
};

export default AboutHero;
