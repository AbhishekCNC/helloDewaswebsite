import EventsHero from "../components/EventsHero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeadlineSlider from "../components/HeadlineSlider";
import EventsdescSection from "../components/EventsdescSection";

const Events = () => {
  return (
    <>
      <Navbar />
      <EventsHero />
        <HeadlineSlider />
        <EventsdescSection />
        <Footer />
    </>
  );
};

export default Events;
