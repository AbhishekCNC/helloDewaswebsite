
import AboutHero from "../components/AboutHero";
import AboutCards from "../components/AboutCards";
import Aboutpara from "../components/Aboutpara";
import AboutWhatWeDo from "../components/AboutWhatWeDo";
import AboutCTA from "../components/AboutCTA";
import AboutLatestStats from "../components/AboutLatestStats";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
const About = () => {
  return (
    <>              
      <Navbar />    
      <AboutHero />
      <AboutCards />
      <Aboutpara />
      <AboutWhatWeDo />
      <AboutCTA />
      <AboutLatestStats />
      <Footer />
    </>
  );
};

export default About;
