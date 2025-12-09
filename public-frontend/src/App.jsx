import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import NewsDetails from "./pages/NewsDetails";
import NewspaperDetail from "./pages/NewspaperDetail";
import EventDetails from "./pages/EventDetails";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Later we will add: /news/:id, /category/:name, etc. */}
      <Route path="/news/:id" element={<NewsDetails />} />
      <Route path="/newspapers/:id" element={<NewspaperDetail />} />
      <Route path="/events/:id" element={<EventDetails />} />
    
    </Routes>
  );
}
