import StoriesHero from "../components/StoriesHero";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeadlineSlider from "../components/HeadlineSlider";
import StoriesCard from "../components/StoiresCard";

const Stories = () => {
  return (
    <>
      <Navbar />
        <StoriesHero />
        <HeadlineSlider />
        <StoriesCard />
        <Footer />
    </>
  );
};

export default Stories;