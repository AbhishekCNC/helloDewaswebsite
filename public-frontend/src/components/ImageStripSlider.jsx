import React, { useEffect, useState } from "react";
import "./ImageStripSlider.css";
import strip1Desktop from "../assets/strip1-desktop.png";
import strip1Mobile from "../assets/strip1-mobile.png";
import strip2Desktop from "../assets/strip2-desktop.png";
import strip3Desktop from "../assets/strip3-desktop.png";


const slides = [
  {
    id: 1,
    desktop: strip1Desktop,
    mobile: strip1Mobile,
  },
  {
    id: 2,
    desktop: strip2Desktop,
    mobile: strip1Mobile,
  },
  {
    id: 3,
    desktop: strip3Desktop,
    mobile: strip1Mobile,
  },
];

export default function ImageStripSlider() {
  const [index, setIndex] = useState(0);

  // Auto-slide every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  const current = slides[index];

  return (
    <section className="strip-slider-section">
      <div className="container p-0">
        <div className="strip-slider-wrapper">
          <picture>
            {/* mobile image */}
            <source
              media="(max-width: 768px)"
              srcSet={current.mobile}
            />
            {/* desktop image */}
            <img
              src={current.desktop}
              alt=""
              className="strip-slider-image"
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
