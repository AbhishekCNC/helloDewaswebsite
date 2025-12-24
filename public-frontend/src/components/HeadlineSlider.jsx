import "./HeadlineSlider.css";
import logo from "../assets/hello-dewas-logo.png";

const HeadlineSlider = () => {
  return (
    <section className="headline-slider">
      <div className="headline-track">
        
        {/* SLIDE 1 */}
        <div className="headline-item">
          <img src={logo} alt="Hello Dewas" />
          <h2>Designed With Excellence By Hello Dewas</h2>
          <img src={logo} alt="Hello Dewas" />
          <h2 className="outline">Social Media Marketing</h2>
        </div>

        {/* SLIDE 2 (DUPLICATE for smooth loop) */}
        <div className="headline-item">
          <img src={logo} alt="Hello Dewas" />
          <h2>Designed With Excellence By Hello Dewas</h2>
          <img src={logo} alt="Hello Dewas" />
          <h2 className="outline">Social Media Marketing</h2>
        </div>

      </div>
    </section>
  );
};

export default HeadlineSlider;
