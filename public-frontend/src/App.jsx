import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewsDetails from "./pages/NewsDetails";
import NewspaperDetail from "./pages/NewspaperDetail";
import EventDetails from "./pages/EventDetails";
import Explore from "./pages/Explore";

import About from "./pages/About";  
import Services from "./pages/Services";
import Nature from "./pages/Nature";
import Heritage from "./pages/Heritage";
import Spiritual from "./pages/Spiritual";
import Luxury from "./pages/Luxry";
import Eating from "./pages/Eating";
import Latest from "./pages/LatestNews";
import Events from "./pages/Events";
import Stories from "./pages/Stories";
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Later we will add: /news/:id, /category/:name, etc. */}
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/newspapers/:id" element={<NewspaperDetail />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/explore" element={<Explore />} />
      {/* <Route path="/nature" element={<NaturePage />} /> */}
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/nature" element={<Nature />} />
      <Route path="/heritage" element={<Heritage />} />
      <Route path="/spiritual" element={<Spiritual />} />
      <Route path="/luxury" element={<Luxury />} />
      <Route path="/eating-out" element={<Eating />} />
      <Route path="/latest-news" element={<Latest />} />
      <Route path="/events" element={<Events />} />
      <Route path="/stories" element={<Stories />} />

    
    </Routes>
  );
}
