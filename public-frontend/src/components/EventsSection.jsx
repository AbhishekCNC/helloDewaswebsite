import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllEvents, buildImageUrl } from "../api/api";
import "./EventsSection.css";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getAllEvents();

        // sort by date DESC (latest first)
        const sorted = [...data].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setEvents(sorted);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openEvent = (id) => {
    navigate(`/events/${id}`);
  };

  if (loading) {
    return (
      <section className="events-section container my-5">
        <p>Loading events...</p>
      </section>
    );
  }

  if (!events.length) {
    return (
      <section className="events-section container my-5">
        <div className="d-flex align-items-center mb-4 ">
          <h2 className="events-title">Events &amp; Happenings</h2>
        <div className="flex-grow-1 ms-3 events-title-underline" />
        <p className="mt-3">No events found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="events-section container my-5">
      {/* Section heading */}
      <div className="d-flex flex-column mb-4">
        <h2 className="events-title">Events &amp; Happenings</h2>
        <div className="events-title-underline" />
      </div>

      {/* Events grid */}
      <div className="row g-4">
        {events.map((ev) => (
          <div key={ev._id} className="col-12 col-md-6 col-xl-3">
            <div className="event-card">
              {/* Thumbnail image */}
              <div className="event-card-img-wrapper">
                <img
                  src={buildImageUrl(ev.thumbnail_image || ev.main_image)}
                  alt={ev.title}
                  className="event-card-img"
                  onClick={() => openEvent(ev._id)}
                />
              </div>

              <div className="event-card-body">
                {/* Date row */}
                <div className="event-date-row">
                  <span className="event-date-icon">
                    <i className="bi bi-calendar3" />
                  </span>
                  <span className="event-date-text">
                    {ev.date
                      ? new Date(ev.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })
                      : "Date TBA"}
                  </span>
                </div>

                {/* Title */}
                <h5 className="event-card-title">{ev.title}</h5>

                {/* Short description (clamped) */}
                <p className="event-card-desc">
                  {ev.short_description || "Event details coming soon."}
                </p>

                {/* View button */}
                <button
                  className="event-view-link"
                  type="button"
                  onClick={() => openEvent(ev._id)}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
