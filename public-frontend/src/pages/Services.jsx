import ServicesHero from "../components/ServicesHero";
import ServicesGrid from "../components/ServicesGrid";
import CityFeaturedSection from "../components/CityFeaturedSection";
import ServiceWhoAreWe from "../components/ServiceWhoAreWe";
import ServiceTestimonial from "../components/ServiceTestimonials";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Services = () => {
  return (
    <>    <Navbar />
      <ServicesHero />
      <ServicesGrid />
      <CityFeaturedSection />
      <ServiceWhoAreWe />
      <ServiceTestimonial />
      <Footer />
    </>
  );
};

export default Services;
