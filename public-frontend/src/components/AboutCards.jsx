import "./Aboutcard.css";
import history from "../assets/heritage.png";
import agriculture from "../assets/heritage.png";
import personality from "../assets/heritage.png";

const AboutCards = () => {
  return (
    <section className="about-cards-section">
      <div className="about-cards-wrapper">
        
        <div className="about-card">
          <div className="about-card-image">
            <img src={history} alt="History" />
          </div>
          <h3>History</h3>
        </div>

        <div className="about-card about-card-center">
          <div className="about-card-image">
            <img src={agriculture} alt="Agriculture" />
          </div>
          <h3>Agriculture</h3>
        </div>

        <div className="about-card">
          <div className="about-card-image">
            <img src={personality} alt="Famous Personality" />
          </div>
          <h3>Famous Personality</h3>
        </div>

      </div>
    </section>
    
  );
};

export default AboutCards;
