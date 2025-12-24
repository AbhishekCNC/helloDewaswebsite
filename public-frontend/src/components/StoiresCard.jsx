import "./StoriesCard.css"; 
import history from "../assets/heritage.png";
import agriculture from "../assets/heritage.png";
import personality from "../assets/heritage.png";

const AboutCards = () => {
  return (
    <section className="stories-cards-section">
      <div className="stories-cards-wrapper">
        
        <div className="stories-card">
          <div className="stories-card-image">
            <img src={history} alt="History" />
          </div>
          <h3>History</h3>
        </div>

        <div className="stories-card stories-card-center">
          <div className="stories-card-image">
            <img src={agriculture} alt="Agriculture" />
          </div>
          <h3>Agriculture</h3>
        </div>

        <div className="stories-card">
          <div className="stories-card-image">
            <img src={personality} alt="Famous Personality" />
          </div>
          <h3>Famous Personality</h3>
        </div>

      </div>
    </section>
    
  );
};

export default AboutCards;