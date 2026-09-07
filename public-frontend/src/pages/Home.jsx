import React, { useState, useEffect, useCallback } from "react";
import HeroSection from "../components/HeroSection";
import {
  getLatestNews,
  getLatestEvents,
  getAllNews,
  getAllEvents,
  getLatestNewspapers,
  getAllBanners
} from "../api/api";
import DiscoverCity from "../components/DiscoverCity";
import ImageStripSlider from "../components/ImageStripSlider";
import UpcomingNewsSection from "../components/UpcomingNewsSection";
import CityFeaturedSection from "../components/CityFeaturedSection";
import NewspaperPdfSection from "../components/NewspaperPdfSection";
import CityHighlightsSection from "../components/CityHighlightsSection";
import EventsSection from "../components/EventsSection";
import CityNewsSection from "../components/CityNewsSection";
import MoreNewsSection from "../components/MoreNewsSection";
import InitialPageLoader from "../components/InitialPageLoader";

export default function Home() {
  const [latestNews, setLatestNews] = useState([]);
  const [latestEvents, setLatestEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await Promise.allSettled([
        getLatestNews(),
        getLatestEvents(),
        getAllNews(),
        getAllEvents(),
        getLatestNewspapers(4),
        getAllBanners()
      ]);

      const [latestNewsRes, latestEventsRes] = results;
      if (latestNewsRes.status === "fulfilled") {
        setLatestNews(latestNewsRes.value || []);
      }
      if (latestEventsRes.status === "fulfilled") {
        setLatestEvents(latestEventsRes.value || []);
      }

      // Check if all primary requests failed (e.g. backend down)
      const allFailed = results.every((r) => r.status === "rejected");
      if (allFailed) {
        setError("Unable to load latest updates. Please check your connection.");
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Home initial data load error:", err);
      setError("Unable to load latest updates.");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      {(isLoading || error) && (
        <InitialPageLoader
          error={error}
          onRetry={loadData}
        />
      )}
      <HeroSection latestNews={latestNews} latestEvents={latestEvents} />
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

