import "./ServiceWhoAreWe.css";
import leftImg from "../assets/Service-img-2.png";
import rightImg from "../assets/Service-img-1.png";

const WhoAreWe = () => {
  return (
    <section className="who-section">

      {/* HEADER */}
      <div className="who-header">
        <h2>Who Are We?</h2>
        <p>We are H.D Media – Craftsmen in Advertising, Marketing & Digital Services!</p>
      </div>

      {/* CONTENT */}
      <div className="who-content">

        {/* LEFT IMAGE */}
        <div className="who-left">
          <img src={leftImg} alt="Who We Are" />
        </div>

        {/* RIGHT CONTENT */}
        <div className="who-right">
          <h3>About Us:</h3>

          <p>
            Established in the year 2020, we are provider of one stop expertise
            solutions for every digital advertising and marketing needs of your
            business. Our specialized creative team will provide you with ideas
            coupled with our market insights and research and experience,
            eventually resulting in tailored services which are flexible and
            customisable enough to have your vision your way, which are not just
            visually great but will target your brand and products to the right
            niche of customers through digital medium.
          </p>

          <div className="who-right-image">
            <img src={rightImg} alt="City View" />
          </div>
        </div>

      </div>
    </section>
  );
};

export default WhoAreWe;
