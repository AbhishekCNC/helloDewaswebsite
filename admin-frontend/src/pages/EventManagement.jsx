import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_BASE_URL from "../config.js";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Clock,
} from "lucide-react";
import "./EventManagement.css";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form & Edit Modal State
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [deleteConfirmEvent, setDeleteConfirmEvent] = useState(null);

  // Loading States for Async Actions
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Notification Banner
  const [feedback, setFeedback] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    short_description: "",
    description: "",
    link: "",
    countdown: 0,
  });

  // Images
  const [mainImage, setMainImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewMain, setPreviewMain] = useState(null);
  const [previewThumb, setPreviewThumb] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const normalizeImagePath = (p) => {
    if (!p) return null;
    return p.replace(/\\/g, "/");
  };

  const buildPreviewSrc = (value) => {
    if (!value) return null;
    if (value.startsWith("blob:") || value.startsWith("http")) return value;
    const clean = value.startsWith("/") ? value.slice(1) : value;
    return `${API_BASE_URL}/${clean}`;
  };

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      const normalized = (res.data || []).map((ev) => {
        const banner = ev.banner || ev.main_image || ev.thumbnail_image || "";
        return {
          ...ev,
          description: ev.description || ev.short_desc || ev.short_description || "",
          short_description: ev.short_description || "",
          main_image: normalizeImagePath(ev.main_image || banner),
          thumbnail_image: normalizeImagePath(ev.thumbnail_image || ev.main_image || banner),
        };
      });
      setEvents(normalized);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(err.response?.data?.message || err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "main") {
      setMainImage(file);
      setPreviewMain(URL.createObjectURL(file));
    }
    if (type === "thumb") {
      setThumbnail(file);
      setPreviewThumb(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      date: "",
      time: "",
      venue: "",
      location: "",
      short_description: "",
      description: "",
      link: "",
      countdown: 0,
    });
    setMainImage(null);
    setThumbnail(null);
    setPreviewMain(null);
    setPreviewThumb(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage) {
      showToast("danger", "Please upload a main event image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      form.append("main_image", mainImage);
      if (thumbnail) form.append("thumbnail_image", thumbnail);

      await axios.post(`${API_BASE_URL}/api/events`, form);
      showToast("success", "Event created successfully!");
      setFormVisible(false);
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error("Error adding event:", err);
      showToast("danger", "Error adding event: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setEditMode(true);

    setFormData({
      title: event.title || "",
      date: event.date ? event.date.split("T")[0] : "",
      time: event.time || "",
      venue: event.venue || "",
      location: event.location || "",
      description: event.description || "",
      short_description: event.short_description || "",
      link: event.link || "",
      countdown: event.countdown ?? 0,
    });

    setPreviewMain(event.main_image || event.banner || null);
    setPreviewThumb(event.thumbnail_image || event.main_image || event.banner || null);
    setMainImage(null);
    setThumbnail(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedEvent) return;

    setIsUpdating(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      if (mainImage) form.append("main_image", mainImage);
      if (thumbnail) form.append("thumbnail_image", thumbnail);

      await axios.put(`${API_BASE_URL}/api/events/${selectedEvent._id}`, form);
      showToast("success", "Event updated successfully!");
      setEditMode(false);
      setSelectedEvent(null);
      resetForm();
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      showToast("danger", "Error updating event: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteHandler = async () => {
    if (!deleteConfirmEvent) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/events/${deleteConfirmEvent._id}`);
      showToast("success", "Event deleted successfully.");
      setDeleteConfirmEvent(null);
      fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      showToast("danger", "Error deleting event: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // Consistent Date Formatter without timezone shifts (DD MMM YYYY)
  const formatEventDate = (dateString) => {
    if (!dateString) return "—";
    try {
      const datePart = dateString.includes("T") ? dateString.split("T")[0] : dateString;
      const parts = datePart.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });
        }
      }
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // Filter events client-side by title, location, or venue
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const query = searchQuery.toLowerCase();
    return events.filter((ev) => {
      const titleMatch = ev.title?.toLowerCase().includes(query);
      const locMatch = ev.location?.toLowerCase().includes(query);
      const venueMatch = ev.venue?.toLowerCase().includes(query);
      return titleMatch || locMatch || venueMatch;
    });
  }, [events, searchQuery]);

  return (
    <div className="events-management-page">
      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`alert alert-${feedback.type} alert-dismissible fade show d-flex align-items-center gap-2 shadow-sm rounded-3`}
          role="alert"
        >
          {feedback.type === "success" ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
          <span>{feedback.message}</span>
          <button
            type="button"
            className="btn-close"
            onClick={() => setFeedback(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Page Header */}
      <div className="events-page-header">
        <div>
          <h1 className="events-header-title">Event Management</h1>
          <p className="events-header-subtitle">Create and manage your event listings.</p>
        </div>

        <button
          type="button"
          className="btn-add-event"
          onClick={() => {
            if (formVisible) resetForm();
            setFormVisible(!formVisible);
          }}
        >
          {formVisible ? (
            <>
              <X size={18} />
              <span>Close Form</span>
            </>
          ) : (
            <>
              <Plus size={18} />
              <span>+ Add Event</span>
            </>
          )}
        </button>
      </div>

      {/* Create Event Form Section */}
      {formVisible && !editMode && (
        <div className="card border shadow-sm rounded-3 p-4 bg-white mb-3">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h2 className="h6 fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <Calendar size={18} />
              <span>Create New Event</span>
            </h2>
            <button
              type="button"
              className="btn btn-sm btn-light rounded-circle"
              onClick={() => {
                resetForm();
                setFormVisible(false);
              }}
            >
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Event title..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold fs-7 text-dark">Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <label className="form-label fw-semibold fs-7 text-dark">Time</label>
                <input
                  type="text"
                  name="time"
                  placeholder="e.g. 10:00 AM"
                  className="form-control"
                  value={formData.time}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Venue</label>
                <input
                  type="text"
                  name="venue"
                  placeholder="e.g. Dewas Town Hall"
                  className="form-control"
                  value={formData.venue}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Main Street, Dewas"
                  className="form-control"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Event Link (Optional)</label>
                <input
                  type="url"
                  name="link"
                  placeholder="https://example.com/event"
                  className="form-control"
                  value={formData.link}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Countdown Days (Optional)</label>
                <input
                  type="number"
                  name="countdown"
                  className="form-control"
                  value={formData.countdown}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold fs-7 text-dark">Short Description</label>
                <textarea
                  name="short_description"
                  className="form-control"
                  rows="2"
                  placeholder="Brief preview description..."
                  value={formData.short_description}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold fs-7 text-dark">Full Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Full event details..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Main Image */}
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Main Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleImage(e, "main")}
                  required
                />
                {previewMain && (
                  <div className="mt-2 text-center border rounded p-2 bg-light">
                    <img
                      src={buildPreviewSrc(previewMain)}
                      alt="Main Preview"
                      className="event-img-preview"
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Image */}
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Thumbnail Image (Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleImage(e, "thumb")}
                />
                {previewThumb && (
                  <div className="mt-2 text-center border rounded p-2 bg-light">
                    <img
                      src={buildPreviewSrc(previewThumb)}
                      alt="Thumbnail Preview"
                      className="event-img-preview"
                    />
                  </div>
                )}
              </div>

              <div className="col-12 text-end pt-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary me-2 px-3"
                  onClick={() => {
                    resetForm();
                    setFormVisible(false);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={isSubmitting}
                  style={{ backgroundColor: "var(--admin-primary)" }}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Creating...
                    </>
                  ) : (
                    "Publish Event"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Listing Container */}
      <div className="events-listing-container">
        {/* Toolbar with Search */}
        <div className="events-toolbar">
          <div className="events-search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="events-search-input"
              placeholder="Search by event title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="text-muted fs-7" style={{ whiteSpace: "nowrap" }}>
            Showing <strong>{filteredEvents.length}</strong> of <strong>{events.length}</strong> events
          </div>
        </div>

        {/* State: Loading */}
        {loading && (
          <div className="state-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="state-description">Fetching events from server...</p>
          </div>
        )}

        {/* State: Network / API Error */}
        {!loading && error && (
          <div className="state-container">
            <div className="state-icon-wrapper" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="state-title">Failed to load events</h3>
            <p className="state-description">{error}</p>
            <button type="button" className="btn btn-outline-primary btn-sm mt-2 gap-2" onClick={fetchEvents}>
              <RefreshCw size={14} />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* State: Search / Filter No Results */}
        {!loading && !error && events.length > 0 && filteredEvents.length === 0 && (
          <div className="state-container">
            <div className="state-icon-wrapper">
              <Search size={24} />
            </div>
            <h3 className="state-title">No matching events</h3>
            <p className="state-description">No events match "{searchQuery}".</p>
            <button
              type="button"
              className="btn btn-light border btn-sm mt-1"
              onClick={() => setSearchQuery("")}
            >
              Reset Search
            </button>
          </div>
        )}

        {/* State: Empty Dataset */}
        {!loading && !error && events.length === 0 && (
          <div className="state-container">
            <div className="state-icon-wrapper">
              <Calendar size={24} />
            </div>
            <h3 className="state-title">No events yet</h3>
            <p className="state-description">Click "+ Add Event" above to create your first event.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-2"
              onClick={() => setFormVisible(true)}
              style={{ backgroundColor: "var(--admin-primary)" }}
            >
              + Add Event
            </button>
          </div>
        )}

        {/* Desktop Table View (>= 768px) */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="d-none d-md-block events-table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th style={{ width: "48px", textAlign: "center" }}>#</th>
                  <th>Event Title</th>
                  <th style={{ width: "160px" }}>Date</th>
                  <th style={{ width: "220px" }}>Location</th>
                  <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => {
                  const locationDisplay = event.location || event.venue || "—";
                  const dateFormatted = formatEventDate(event.date);
                  return (
                    <tr key={event._id || index}>
                      <td style={{ textAlign: "center", color: "var(--admin-text-muted)", fontSize: "13px" }}>
                        {index + 1}
                      </td>
                      <td className="event-title-cell">
                        <div>{event.title}</div>
                        {event.link && (
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-decoration-none d-inline-flex align-items-center gap-1 text-muted"
                            style={{ fontSize: "12px", marginTop: "2px" }}
                          >
                            <span>Link</span>
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </td>
                      <td className="event-date-cell">
                        <div className="d-flex align-items-center gap-2">
                          <Calendar size={14} className="text-muted" />
                          <span>{dateFormatted}</span>
                        </div>
                        {event.time && (
                          <div className="d-flex align-items-center gap-1 text-muted" style={{ fontSize: "12px", marginTop: "2px" }}>
                            <Clock size={12} />
                            <span>{event.time}</span>
                          </div>
                        )}
                      </td>
                      <td className="event-location-cell">
                        <div className="d-flex align-items-start gap-1">
                          <MapPin size={14} className="text-muted mt-1 flex-shrink-0" />
                          <span>{locationDisplay}</span>
                        </div>
                      </td>
                      <td>
                        <div className="event-action-group justify-content-end">
                          <button
                            type="button"
                            className="btn-event-edit"
                            onClick={() => handleEdit(event)}
                            aria-label={`Edit ${event.title}`}
                          >
                            <Pencil size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-event-delete"
                            onClick={() => setDeleteConfirmEvent(event)}
                            aria-label={`Delete ${event.title}`}
                          >
                            <Trash2 size={14} />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Stacked Card View (< 768px) */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="d-md-none mobile-events-grid">
            {filteredEvents.map((event, index) => {
              const locationDisplay = event.location || event.venue || "—";
              const dateFormatted = formatEventDate(event.date);
              return (
                <div key={event._id || index} className="mobile-event-card">
                  <div className="mobile-event-header">
                    <span className="badge bg-light text-dark border">#{index + 1}</span>
                    <h3 className="mobile-event-title flex-grow-1">{event.title}</h3>
                  </div>

                  <div className="mobile-event-details">
                    <div className="mobile-event-meta-item">
                      <Calendar size={15} className="text-muted" />
                      <span>{dateFormatted}</span>
                      {event.time && <span className="text-muted ms-1">({event.time})</span>}
                    </div>

                    <div className="mobile-event-meta-item">
                      <MapPin size={15} className="text-muted flex-shrink-0" />
                      <span>{locationDisplay}</span>
                    </div>
                  </div>

                  <div className="mobile-event-actions">
                    <button
                      type="button"
                      className="btn-event-edit"
                      onClick={() => handleEdit(event)}
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn-event-delete"
                      onClick={() => setDeleteConfirmEvent(event)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Event Modal Dialog */}
      {editMode && selectedEvent && (
        <div className="admin-modal-overlay" tabIndex={-1}>
          <div className="admin-modal-dialog" role="dialog" aria-modal="true">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title d-flex align-items-center gap-2">
                <Pencil size={18} className="text-primary" />
                <span>Edit Event</span>
              </h2>
              <button
                type="button"
                className="btn btn-sm btn-light rounded-circle border p-1"
                onClick={() => {
                  setEditMode(false);
                  setSelectedEvent(null);
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="d-flex flex-column flex-grow-1">
              <div className="admin-modal-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Title *</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold fs-7">Date *</label>
                    <input
                      type="date"
                      name="date"
                      className="form-control"
                      value={formData.date}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label fw-semibold fs-7">Time</label>
                    <input
                      type="text"
                      name="time"
                      className="form-control"
                      value={formData.time}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Venue</label>
                    <input
                      type="text"
                      name="venue"
                      className="form-control"
                      value={formData.venue}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Event Link</label>
                    <input
                      type="url"
                      name="link"
                      className="form-control"
                      value={formData.link}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Countdown</label>
                    <input
                      type="number"
                      name="countdown"
                      className="form-control"
                      value={formData.countdown}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold fs-7">Short Description</label>
                    <textarea
                      name="short_description"
                      className="form-control"
                      rows="2"
                      value={formData.short_description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold fs-7">Full Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Main Image */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Main Image</label>
                    {previewMain ? (
                      <div className="border rounded p-2 text-center bg-light mb-2">
                        <img
                          src={buildPreviewSrc(previewMain)}
                          alt="Main Preview"
                          className="event-img-preview"
                        />
                      </div>
                    ) : (
                      <p className="text-muted small">No main image</p>
                    )}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleImage(e, "main")}
                    />
                  </div>

                  {/* Thumbnail Image */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Thumbnail Image</label>
                    {previewThumb ? (
                      <div className="border rounded p-2 text-center bg-light mb-2">
                        <img
                          src={buildPreviewSrc(previewThumb)}
                          alt="Thumbnail Preview"
                          className="event-img-preview"
                        />
                      </div>
                    ) : (
                      <p className="text-muted small">No thumbnail</p>
                    )}
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => handleImage(e, "thumb")}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary px-3"
                  onClick={() => {
                    setEditMode(false);
                    setSelectedEvent(null);
                    resetForm();
                  }}
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={isUpdating}
                  style={{ backgroundColor: "var(--admin-primary)" }}
                >
                  {isUpdating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deleteConfirmEvent && (
        <div className="admin-modal-overlay" tabIndex={-1}>
          <div className="admin-modal-dialog admin-modal-dialog-sm" role="dialog" aria-modal="true">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title text-danger d-flex align-items-center gap-2">
                <AlertTriangle size={20} />
                <span>Confirm Deletion</span>
              </h2>
              <button
                type="button"
                className="btn btn-sm btn-light rounded-circle border p-1"
                onClick={() => setDeleteConfirmEvent(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="mb-2 text-dark">
                Are you sure you want to delete this event?
              </p>
              <div
                className="p-3 bg-light rounded-2 border text-muted fs-7 lh-sm"
                style={{ wordBreak: "break-word" }}
              >
                <div><strong>Title:</strong> {deleteConfirmEvent.title}</div>
                <div className="mt-1"><strong>Date:</strong> {formatEventDate(deleteConfirmEvent.date)}</div>
              </div>
              <p className="text-muted small mt-2 mb-0">This action cannot be undone.</p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => setDeleteConfirmEvent(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger px-4 fw-semibold"
                onClick={confirmDeleteHandler}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Deleting...
                  </>
                ) : (
                  "Delete Event"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
