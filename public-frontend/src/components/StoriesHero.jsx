import "./StoriesHero.css";
import bgImage from "../assets/bg.png";

const StoriesHero = () => {
  return (
    <section
      className="stories-hero"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="stories-overlay"></div>


      {/* FOREGROUND CONTENT */}
      <div className="stories-content">
        <h2>Voice &amp; Vision Of Dewas</h2>

        <p>
         WE are offering the stories that capture the essence of Dewas — its people, culture, heritage, and aspirations. Through heartfelt narratives, interviews, and features, we aim to showcase the diverse voices that shape our city's identity.        </p>
      </div>
    </section>
  );
};

export default StoriesHero;
