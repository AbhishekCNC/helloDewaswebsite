import React, { useState, useEffect } from "react";
import LatestNewsContent from "../components/LatestNewsContent";
import Footer from "../components/Footer";  
import Navbar from "../components/Navbar";
import InitialPageLoader from "../components/InitialPageLoader";
import { getAllNews } from "../api/api";

const Latest = () => {
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function fetchData() {
      try {
        await getAllNews();
        if (!ignore) {
          setError(null);
          setInitialLoading(false);
        }
      } catch {
        if (!ignore) {
          setError("Unable to load latest news. Please check your connection.");
        }
      }
    }

    fetchData();

    return () => {
      ignore = true;
    };
  }, [reloadKey]);

  const handleRetry = () => {
    setInitialLoading(true);
    setError(null);
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
