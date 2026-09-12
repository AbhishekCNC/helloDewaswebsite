import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEventById, buildImageUrl } from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import InitialPageLoader from "../components/InitialPageLoader";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const ev = await getEventById(id);
      setEvent(ev);
    } catch {
      setError("Unable to load event details.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const imgSrc =
    event && (event.main_image || event.thumbnail_image || event.banner)
      ? buildImageUrl(event.main_image || event.thumbnail_image || event.banner)
      : "";
  const descriptionText = event ? event.description || event.details || event.short_description || "" : "";

  return (
    <>
      {(loading || (error && !event)) && (
        <InitialPageLoader
          error={error}
          onRetry={load}
        />
      )}
      <Navbar />

      {event && (
        <div className="container event-detail-page my-4">
          <button className="event-detail-back" onClick={() => navigate(-1)}>
            ← Back
          </button>

          {imgSrc && (
            <div className="event-detail-hero">
              <img src={imgSrc} alt={event.title || "Event image"} />
            </div>
          )}

        <h1 className="event-detail-title">{event.title || "Event details"}</h1>

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

        {event.link && (
          <div className="event-detail-link mb-3">
            <a href={event.link} target="_blank" rel="noopener noreferrer">
              Visit event website
            </a>
          </div>
        )}

        <div className="event-detail-body">
          {descriptionText ? (
            descriptionText.split("\n").map((p, idx) => <p key={idx}>{p}</p>)
          ) : (
            <p>No additional details provided.</p>
          )}
        </div>
      </div>
      )}

      <Footer />
    </>
  );
} 
