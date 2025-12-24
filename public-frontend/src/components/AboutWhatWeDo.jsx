import "./AboutWhatWeDo.css";
import leftImage from "../assets/about-img.png";
import rightImage from "../assets/about-img-2.png";

const AboutWhatWeDo = () => {
  return (
    <section className="whatwedo-section">
      <div className="whatwedo-container">

        {/* LEFT SIDE */}
        <div className="whatwedo-left">
          <h2 className="whatwedo-title">What We Do</h2>

          <div className="whatwedo-image-wrapper">
            <img src={leftImage} alt="What We Do" />

            <div className="whatwedo-overlay">
              <p>
                Hello Dewas brings together creativity,
                strategy, and design to craft stories that
                stand out.
              </p>
              <p>
                We’ve worked with growing brands and local
                businesses, helping them shine on digital
                platforms with modern marketing and
                timeless ideas.
              </p>
              <p>
                From Dewas to the world — we create visuals
                and campaigns that connect people and
                build trust.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="whatwedo-right">
          <h3 className="whatwedo-right-title">
            100% Result-Driven Strategy
          </h3>

          <p className="whatwedo-right-desc">
            Every idea backed by data, design, and dedication.
          </p>

          <div className="whatwedo-right-image">
            <img src={rightImage} alt="Strategy" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutWhatWeDo;
