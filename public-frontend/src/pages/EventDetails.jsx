import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getEventById, buildImageUrl } from "../api/api";
import "./EventDetails.css";

export default function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (err) {
        console.error("Error loading event:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="container my-5">
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container my-5">
        <p>Event not found.</p>
      </div>
    );
  }

  const eventDate = event.date
    ? new Date(event.date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Date TBA";

  return (
    <div className="container my-5 event-detail-page">
      <Link to="/" className="event-detail-back">
        ← Back to home
      </Link>

      <div className="event-detail-hero">
        {event.main_image || event.thumbnail_image ? (
          <img
            src={buildImageUrl(event.main_image || event.thumbnail_image)}
            alt={event.title}
          />
        ) : null}
      </div>

      <div className="event-detail-content">
        <h1 className="event-detail-title">{event.title}</h1>

        <div className="event-detail-meta">
          <span>
            <i className="bi bi-calendar3" /> {eventDate}
          </span>
          {event.location && (
            <span>
              <i className="bi bi-geo-alt" /> {event.location}
            </span>
          )}
        </div>

        {event.short_description && (
          <p className="event-detail-short">{event.short_description}</p>
        )}

        {event.description && (
          <div className="event-detail-body">
            {event.description.split("\n").map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        )}

        {event.link && event.link !== "undefined" && (
          <a
            href={event.link}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary mt-3"
          >
            Event Link
          </a>
        )}
      </div>
    </div>
  );
}
