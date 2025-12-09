import axios from "axios";
import HeroSection from "../components/HeroSection";
import { getLatestNews, getLatestEvents } from "../api/api";
import { useState, useEffect } from "react";
import DiscoverCity from "../components/DiscoverCity";
import ImageStripSlider from "../components/ImageStripSlider";
import UpcomingNewsSection from "../components/UpcomingNewsSection";
import CityFeaturedSection from "../components/CityFeaturedSection";
import NewspaperPdfSection from "../components/NewspaperPdfSection";
import CityHighlightsSection from "../components/CityHighlightsSection";
import EventsSection from "../components/EventsSection";
import CityNewsSection from "../components/CityNewsSection"; // adjust path
import MoreNewsSection from "../components/MoreNewsSection";






export default function Home() {
const [latestNews, setLatestNews] = useState([]);
const [latestEvents, setLatestEvents] = useState([]);

useEffect(() => {
  async function loadData() {
    const news = await getLatestNews();
    const events = await getLatestEvents();
    setLatestNews(news);
    setLatestEvents(events);
  }
  loadData();
}, []);
console.log("Latest News from API:", latestNews);
  return (
   <>
   <HeroSection latestNews={latestNews} latestEvents={latestEvents}/>
   <DiscoverCity />
   <ImageStripSlider />
   <UpcomingNewsSection />  
   <CityFeaturedSection />  
   <NewspaperPdfSection />
   <CityHighlightsSection />
   <EventsSection />
    <CityNewsSection />
    <MoreNewsSection />
   </>
  );
}
