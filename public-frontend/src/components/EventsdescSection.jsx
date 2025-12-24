import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllEvents, buildImageUrl } from "../api/api";
import "./EventsdescSection.css";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getAllEvents();
        setEvents(data);
      } catch (err) {
        console.error("Failed to load events", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, []);

  if (loading) {
    return <div className="events-loading">Loading events…</div>;
  }

  return (
    <section className="events-section">
      <div className="events-container">
        {events.map((event) => {
          const dateObj = event.date ? new Date(event.date) : null;

          return (
            <div className="event-row" key={event._id}>
              {/* LEFT DATE */}
              <div className="event-date">
                <span className="event-day">
                  {dateObj ? dateObj.toLocaleDateString("en-IN", { weekday: "short" }) : "—"}
                </span>
                <span className="event-full-date">
                  {dateObj
                    ? dateObj.toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "Date TBA"}
                </span>
              </div>

              {/* EVENT IMAGE */}
              <div className="event-image">
                <img
                  src={buildImageUrl(event.main_image || event.thumbnail_image)}
                  alt={event.title}
                />
              </div>

              {/* EVENT CONTENT */}
              <div className="event-content">
                <h4>{event.title}</h4>
                <p>
                  {event.venue || "Dewas City Park"} •{" "}
                  {event.time || "4PM – 10PM"}
                </p>

                <div className="event-meta">
                  <i className="bi bi-ticket-perforated" />
                  <span>{event.entry || "Free Entry"}</span>
                </div>
              </div>

              {/* CTA */}
              <div className="event-action">
                <Link to={`/events/${event._id}`} className="event-btn">
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
