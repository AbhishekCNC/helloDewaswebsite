import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, buildImageUrl } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const ev = await getEventById(id);
        setEvent(ev);
        setError(null);
      } catch (err) {
        console.error("Error loading event:", err);
        setError("Unable to load event details.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="text-center mt-5">Loading event...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!event) return <p className="text-center mt-5">Event not found.</p>;

  const imgSrc = buildImageUrl(event.main_image || event.banner || event.thumbnail_image || "");

  return (
    <>
      <Navbar />

      <div className="container event-detail-page my-4">
        <button className="event-detail-back" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {imgSrc && (
          <div className="event-detail-hero">
            <img src={imgSrc} alt={event.title} />
          </div>
        )}

        <h1 className="event-detail-title">{event.title}</h1>

        <div className="event-detail-meta">
          <div>
            <i className="bi bi-calendar3" /> &nbsp;
            {event.date ? new Date(event.date).toLocaleDateString("en-IN") : "—"}
          </div>
          {event.location && (
            <div>
              <i className="bi bi-geo-alt" /> &nbsp; {event.location}
            </div>
          )}
          {event.venue && (
            <div>
              <i className="bi bi-building" /> &nbsp; {event.venue}
            </div>
          )}
        </div>

        {event.short_description && (
          <div className="event-detail-short">{event.short_description}</div>
        )}

        <div className="event-detail-body">
          {event.description ? (
            event.description.split("\n").map((p, idx) => <p key={idx}>{p}</p>)
          ) : (
            <p>No additional details provided.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
} 
