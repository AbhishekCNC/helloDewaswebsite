import "./Services.css";

const ServicesGrid = () => {
  return (
    <section className="services-grid-section">
      <div className="services-grid">

        <div className="service-card">
          <i className="bi bi-megaphone"></i>
          <h3>Social Media Marketing</h3>
          <p>
            From local vibes to global reach — we amplify Dewas with smart
            social media moves. Hello Dewas, where strategy meets storytelling.
          </p>
        </div>

        <div className="service-card">
          <i className="bi bi-search"></i>
          <h3>Search Engine Optimisation</h3>
          <p>
            Helping Dewas-based businesses rank higher and shine brighter online.
            With smart SEO strategies, we make your brand easy to find and hard
            to ignore.
          </p>
        </div>

        <div className="service-card">
          <i className="bi bi-file-earmark-text"></i>
          <h3>Content Writing</h3>
          <p>
            We create meaningful content that connects with your audience and
            builds trust. Hello Dewas — delivering clarity, creativity, and
            communication through words.
          </p>
        </div>

        <div className="service-card">
          <i className="bi bi-display"></i>
          <h3>Web Designing</h3>
          <p>
            We design user-friendly, responsive, and result-driven websites.
            Hello Dewas — where design meets performance.
          </p>
        </div>

        <div className="service-card">
          <i className="bi bi-google"></i>
          <h3>Google AdWords</h3>
          <p>
            We plan, manage, and optimize Google Ad campaigns that deliver real
            results. Hello Dewas — driving growth through data and precision
            targeting.
          </p>
        </div>

        <div className="service-card">
          <i className="bi bi-camera"></i>
          <h3>Product photography / commercials</h3>
          <p>
            High-quality product shoots and commercials that elevate your brand
            image. Hello Dewas — where creativity meets commercial impact.
          </p>
        </div>

      </div>
    </section>
  );
};

export default ServicesGrid;
