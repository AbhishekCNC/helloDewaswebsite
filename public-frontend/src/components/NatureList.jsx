import "./Nature.css";
import img1 from "../assets/nature.png";
import img2 from "../assets/nature-bg.png";
import img3 from "../assets/nature.png";
import img4 from "../assets/nature.png";

const NatureList = () => {
  return (
    <section className="nature-list">

      {/* ITEM 1 */}
      <div className="nature-item right">
        <div className="nature-text">
          <span className="nature-index">01</span>
          <h3>Meetha Talab</h3>
          <p>
            Meetha Talab is a tranquil lake known for its peaceful surroundings
            and scenic reflections. It’s a perfect spot for evening walks and
            quiet moments close to nature.
          </p>
          <a href="#">Read More</a>
        </div>

        <div className="nature-image">
          <img src={img1} alt="Meetha Talab" />
        </div>
      </div>

      {/* ITEM 2 */}
      <div className="nature-item left">
    

        <div className="nature-text">
          <span className="nature-index">02</span>
          <h3>Rajani Talab</h3>
          <p>
            Rajani Talab offers lush green views and a refreshing environment.
            Surrounded by hills, it’s ideal for nature lovers and photographers.
          </p>
          <a href="#">Read More</a>
        </div>
          <div className="nature-image">
          <img src={img2} alt="Rajani Talab" />
        </div>
      </div>

      {/* ITEM 3 */}
      <div className="nature-item right">
        <div className="nature-text">
          <span className="nature-index">03</span>
          <h3>Kedar Kho</h3>
          <p>
            Kedar Kho is a hidden green valley filled with dense vegetation and
            scenic beauty. During monsoon, it becomes a paradise of greenery.
          </p>
          <a href="#">Read More</a>
        </div>

        <div className="nature-image">
          <img src={img3} alt="Kedar Kho" />
        </div>
      </div>

      {/* ITEM 4 */}
      <div className="nature-item left">

        <div className="nature-text">
          <span className="nature-index">04</span>
          <h3>Rajani Talab</h3>
          <p>
            Another view of Rajani Talab highlighting the water reflections and
            surrounding greenery that makes it one of Dewas’s calmest spots.
          </p>
          <a href="#">Read More</a>
        </div>
        <div className="nature-image">
          <img src={img4} alt="Rajani Talab" />
        </div>
      </div>

    </section>
  );
};

export default NatureList;
