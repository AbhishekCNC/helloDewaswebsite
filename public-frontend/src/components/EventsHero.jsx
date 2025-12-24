import "./EventsHero.css";
import bgImage from "../assets/bg.png";

const EventsHero = () => {
  return (
    <section
      className="events-hero"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="events-overlay"></div>

      {/* BACKGROUND TEXT */}
      <h1 className="events-bg-text">Events</h1>

      {/* FOREGROUND CONTENT */}
      <div className="events-content">
        <h2>Events &amp; Happenings in Dewas</h2>

        <p>
          Stay updated with the latest events, exhibitions, and community
          gatherings happening across Dewas. From cultural festivals to
          business conferences and social initiatives — we bring you all the
          buzz, highlights, and moments that make our city vibrant and
          connected.
        </p>
      </div>
    </section>
  );
};

export default EventsHero;
