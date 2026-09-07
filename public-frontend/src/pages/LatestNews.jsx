import React, { useState, useEffect, useCallback } from "react";
import LatestNewsContent from "../components/LatestNewsContent";
import Footer from "../components/Footer";  
import Navbar from "../components/Navbar";
import InitialPageLoader from "../components/InitialPageLoader";
import { getAllNews } from "../api/api";

const Latest = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setInitialLoading(true);
      setError(null);
      await getAllNews();
      setInitialLoading(false);
    } catch (err) {
      console.error("Latest news load error:", err);
      setError("Unable to load latest news. Please check your connection.");
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData, reloadKey]);

  const handleRetry = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <>
      {(initialLoading || error) && (
        <InitialPageLoader
          error={error}
          onRetry={handleRetry}
        />
      )}
      <Navbar />
      <LatestNewsContent key={reloadKey} />
      <Footer />
    </>
  );
};

export default Latest;
