import "./AboutLatestStats.css";
import newsImg from "../assets/about-img-3.png";

const LatestStats = () => {
  return (
    <section className="latest-section">
      <div className="latest-wrapper">

        {/* LEFT BIG CARD */}
        <div className="latest-main-card">
          <img src={newsImg} alt="Latest News" />

          <div className="latest-main-overlay">
            {/* <h2>
              HELLO<br />
              DEWAS
            </h2>
            <p>LATEST NEWS & UPDATES</p>
            <button>READ NOW</button> */}
          </div>
        </div>

        {/* RIGHT STATS */}
        <div className="latest-stats">
          <div className="stat-card">
            <h3>50+</h3>
            <p>Team Members</p>
          </div>

          <div className="stat-card">
            <h3>1M+</h3>
            <p>Monthly Visitors Impact</p>
          </div>

          <div className="stat-card highlight">
            <h3>300+</h3>
            <p>Local Features</p>
          </div>

          <div className="stat-card">
            <h3>50 – 100% Local</h3>
            <p>Community Support</p>
          </div>

          <div className="stat-card">
            <h3>2019</h3>
            <p>Founded</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default LatestStats;
