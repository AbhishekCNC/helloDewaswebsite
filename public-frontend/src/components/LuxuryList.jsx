import "./Nature.css";
import img1 from "../assets/Luxury-img-1.png";
import img2 from "../assets/Luxury-img-2.png";
import img3 from "../assets/Luxury-img-3.png";
import img4 from "../assets/Luxury-img-4.png";

const LuxuryList = () => {
  return (
    <section className="nature-list">

      {/* ITEM 1 */}
      <div className="nature-item right">
        <div className="nature-text">
          <span className="nature-index">01</span>
          <h3>Anand Bhawan Palace</h3>
          <p>
            The Skyline silver colour lake situated in the heart of Dewas
makes it the calming core for residents and the tourists of the
city. The aquatic richness of the place can also be seen at dawn
and dusk as the causes a division of various different birds to
swans into the air makes it a memorable place.
          </p>
          <a href="#">Explore More</a>
        </div>

        <div className="nature-image">
          <img src={img1} alt="Meetha Talab" />
        </div>
      </div>

      {/* ITEM 2 */}
      <div className="nature-item left">
    

        <div className="nature-text">
          <span className="nature-index">02</span>
          <h3>Dewas Sr. Rajwada</h3>
          <p>
            The lake 16 km from Dewas, near Jamgod, is believed to be made
by King Nal and Queen Damayanti in ancient times. It is said that
the couple while wandering in the jungles, came across the city
called Bhanurasa. Seeing the design of the city and the
Bhanvarnath temple they were thrilled and decided to stay.
          </p>
          <a href="#">Explore More</a>
        </div>
          <div className="nature-image">
          <img src={img2} alt="Rajani Talab" />
        </div>
      </div>

      {/* ITEM 3 */}
      <div className="nature-item right">
        <div className="nature-text">
          <span className="nature-index">03</span>
          <h3>Shri Rajshree Sahu
Chatrapati Memorial
Wrestling Arena</h3>
          <p>
            Nestled amidst the scenic hills of Dewas, Kedar Kho is a
natural waterfall that becomes a sight to behold, especially
during the monsoon season. The rhythmic sound of falling
water, the cool breeze, and the lush greenery surrounding
the place make it a perfect spot for nature lovers and
photography enthusiasts. Visitors often enjoy peaceful
walks and picnics here, away from the city's rush.
          </p>
          <a href="#">Explore More</a>
        </div>

        <div className="nature-image">
          <img src={img3} alt="Kedar Kho" />
        </div>
      </div>

      {/* ITEM 4 */}
      <div className="nature-item left">

        <div className="nature-text">
          <span className="nature-index">04</span>
          <h3>H.H Sayaji Rao Gayakwad Dwar</h3>
          <p>
            he lake 16 km from Dewas, near Jamgod, is be levedto be ade
by King Nal and Queen Damayanti in ancient times. It is said that
the couple while wandering in the jungles, came across the city
called Bhanurasa. Seeing the design of the city and the
Bhanvarnath temple they were thrilled and decided to stay.
          </p>
          <a href="#">Explore More</a>
        </div>
        <div className="nature-image">
          <img src={img4} alt="Rajani Talab" />
        </div>
      </div>

    </section>
  );
};

export default LuxuryList;
