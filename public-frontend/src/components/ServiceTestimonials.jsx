import { useEffect, useState } from "react";
import "./ServiceTestimonials.css";
import helo from "../assets/helo-img.png";
import shashikant from "../assets/shashikant-img.png";

const testimonials = [
  {
    name: "Mr. Akash Arora",
    role: "Director, Central India Academy, Dewas",
    image: helo,
    text:
      "Sed ullamcorper morbi tincidunt or massa eget egestas purus. Non nisi est sit amet facilisis magna etiam."
  },
  {
    name: "National Poet Shashikant Yadav",
    role: "National Poet",
    image: shashikant,
    text:
      "Sed ullamcorper morbi tincidunt or massa eget egestas purus. Non nisi est sit amet facilisis magna etiam."
  }
];

const Testimonials = () => {
  const [index, setIndex] = useState(0);

  // AUTO SLIDE EVERY 2 SECONDS
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="testimonial-section">
      <div className="testimonial-overlay"></div>

      <div className="testimonial-content">
        {/* LEFT TITLE */}
        <div className="testimonial-left">
          <span className="testimonial-small">Testimonial</span>
          <h2>Client Testimonials</h2>
        </div>

        {/* SLIDER */}
        <div className="testimonial-slider">
          {[0, 1].map((offset) => {
            const t =
              testimonials[(index + offset) % testimonials.length];

            return (
              <div className="testimonial-card" key={offset}>
                <span className="quote-top">“</span>

                <div className="testimonial-profile">
                  <img src={t.image} alt={t.name} />
                </div>

                <h3>{t.name}</h3>
                <p className="testimonial-role">{t.role}</p>

                <p className="testimonial-text">"{t.text}"</p>

                <span className="quote-bottom">”</span>
              </div>
            );
          })}

          <button className="testimonial-next">
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
