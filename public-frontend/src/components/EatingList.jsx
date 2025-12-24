import "./Nature.css";
import img1 from "../assets/Eating-img-1.png";
import img2 from "../assets/Eating-img-2.png";
import img3 from "../assets/Eating-img-3.png";
import img4 from "../assets/Eating-img-4.png";

const EatingList = () => {
  return (
    <section className="nature-list">

      {/* ITEM 1 */}
      <div className="nature-item right">
        <div className="nature-text">
          <span className="nature-index">01</span>
          <h3>BR Resort & club</h3>
          <p>
            A perfect getaway from city's chaos .
Cozy yet lavish.
Safe , subtle and perfect for your vacay scenes .
Contact : 8819920202 / 9343871771
For full details click on the image .
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
          <h3>FaMaa's Kitchen</h3>
          <p>
           Pure veg restaurant with cafe .
We are good at Chinese , Indian , Italian and
Continental food .
Fresh and good ambeience .
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
          <h3>Nandan Kanan by M Square
Hotels & Resorts</h3>
          <p>
            A beautiful and soothing place, where you can enjoy the
most precious moments of your life with family and
friends.
Contact us on - 9770021622
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
          <h3>Rajanal Talab</h3>
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

export default EatingList;
