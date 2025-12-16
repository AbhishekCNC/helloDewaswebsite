import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config.js";
import "./EventManagement.css";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // images
  const [mainImage, setMainImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewMain, setPreviewMain] = useState(null);
  const [previewThumb, setPreviewThumb] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const normalizeImagePath = (p) => {
    if (!p) return null;
    return p.replace(/\\/g, "/"); // windows -> web
  };

  const fetchEvents = async () => {
    try {
      console.log("📡 Fetching events from:", `${API_BASE_URL}/api/events`);
      const res = await axios.get(`${API_BASE_URL}/api/events`);
      console.log("✅ Events fetched successfully:", res.data);

      // normalize old + new style events
      const normalized = (res.data || []).map((ev) => {
        const banner = ev.banner || ev.main_image || ev.thumbnail_image || "";
        return {
          ...ev,
          description:
            ev.description || ev.short_desc || ev.short_description || "",
          short_description: ev.short_description || "",
          main_image: normalizeImagePath(ev.main_image || banner),
          thumbnail_image: normalizeImagePath(
            ev.thumbnail_image || ev.main_image || banner
          ),
        };
      });

      setEvents(normalized);
    } catch (error) {
      console.error(
        "❌ Error fetching events:",
        error.response?.data || error.message
      );
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
    try {
      if (!mainImage) {
        alert("❌ Please upload a main event image!");
        return;
      }

      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      form.append("main_image", mainImage);
      if (thumbnail) form.append("thumbnail_image", thumbnail);

      console.log("📤 Creating event at:", `${API_BASE_URL}/api/events`);
      const res = await axios.post(`${API_BASE_URL}/api/events`, form);
      console.log("✅ Event created:", res.data);

      alert("✅ Event added successfully!");
      setFormVisible(false);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(
        "❌ Error adding event:",
        error.response?.data || error.message
      );
      alert(
        "❌ Error adding event: " +
          (error.response?.data?.message || error.message)
      );
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
    setPreviewThumb(
      event.thumbnail_image || event.main_image || event.banner || null
    );
    setMainImage(null);
    setThumbnail(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      if (mainImage) form.append("main_image", mainImage);
      if (thumbnail) form.append("thumbnail_image", thumbnail);

      console.log("📤 Updating event:", selectedEvent._id);
      const res = await axios.put(
        `${API_BASE_URL}/api/events/${selectedEvent._id}`,
        form
      );
      console.log("✅ Event updated:", res.data);

      alert("✅ Event updated successfully!");
      setEditMode(false);
      setSelectedEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error(
        "❌ Error updating event:",
        error.response?.data || error.message
      );
      alert(
        "❌ Error updating event: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        console.log("🗑️ Deleting event:", id);
        await axios.delete(`${API_BASE_URL}/api/events/${id}`);
        console.log("✅ Event deleted");
        fetchEvents();
      } catch (error) {
        console.error(
          "❌ Error deleting event:",
          error.response?.data || error.message
        );
        alert(
          "❌ Error deleting event: " +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const buildPreviewSrc = (value) => {
    if (!value) return null;
    // blob: or http(s) -> use as is
    if (value.startsWith("blob:") || value.startsWith("http")) return value;
    const clean = value.startsWith("/") ? value.slice(1) : value;
    return `${API_BASE_URL}/${clean}`;
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h4 className="fw-bold text-white">🎉 Event Management</h4>
        <button
          className="btn btn-light fw-semibold"
          onClick={() => {
            setFormVisible(!formVisible);
            if (!formVisible) {
              // opening fresh form
              setEditMode(false);
              setSelectedEvent(null);
              resetForm();
            }
          }}
        >
          {formVisible ? "Close Form" : "➕ Add Event"}
        </button>
      </div>

      {/* CREATE FORM */}
      {formVisible && !editMode && (
        <form
          onSubmit={handleSubmit}
          className="card shadow-sm p-4 mt-3 form-section"
        >
          <h5 className="fw-bold mb-3 text-primary">📅 Create Event</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Title</label>
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
              <label className="form-label fw-semibold">Date</label>
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
              <label className="form-label fw-semibold">Time</label>
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
              <label className="form-label fw-semibold">Venue</label>
              <input
                type="text"
                name="venue"
                className="form-control"
                value={formData.venue}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Event Link (optional)
              </label>
              <input
                type="url"
                name="link"
                className="form-control"
                value={formData.link}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Countdown (optional)
              </label>
              <input
                type="number"
                name="countdown"
                className="form-control"
                value={formData.countdown}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">
                Short Description
              </label>
              <textarea
                name="short_description"
                className="form-control"
                rows="3"
                value={formData.short_description}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className="col-md-6">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* Images */}
            <div className="col-md-6 text-center">
              <label className="form-label fw-semibold">Main Image *</label>
              {previewMain ? (
                <img
                  src={buildPreviewSrc(previewMain)}
                  alt="Main Preview"
                  className="img-preview"
                />
              ) : (
                <p className="text-muted small">No main image uploaded</p>
              )}
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={(e) => handleImage(e, "main")}
                required
              />
            </div>

            <div className="col-md-6 text-center">
              <label className="form-label fw-semibold">
                Thumbnail Image (optional)
              </label>
              {previewThumb ? (
                <img
                  src={buildPreviewSrc(previewThumb)}
                  alt="Thumb Preview"
                  className="img-preview"
                />
              ) : (
                <p className="text-muted small">No thumbnail uploaded</p>
              )}
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={(e) => handleImage(e, "thumb")}
              />
            </div>

            <div className="col-12 mt-3 text-end">
              <button className="btn btn-primary px-4">Submit</button>
            </div>
          </div>
        </form>
      )}

      {/* Event Table */}
      <div className="card shadow-sm p-3 mt-4">
        <h5 className="fw-bold mb-3">📋 Past Events</h5>
        <div className="table-responsive">
          <table className="table align-middle table-hover text-center">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr key={event._id}>
                  <td>{index + 1}</td>
                  <td title={event.description}>{event.title}</td>
                  <td>
                    {event.date
                      ? new Date(event.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>{event.location || event.venue || "-"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(event._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {events.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-muted">
                    No events found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h5 className="fw-bold mb-3 text-primary">✏️ Edit Event</h5>
            <form onSubmit={handleUpdate}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label fw-semibold">Title</label>
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
                  <label className="form-label fw-semibold">Date</label>
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
                  <label className="form-label fw-semibold">Time</label>
                  <input
                    type="text"
                    name="time"
                    className="form-control"
                    value={formData.time}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Venue</label>
                  <input
                    type="text"
                    name="venue"
                    className="form-control"
                    value={formData.venue}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Location</label>
                  <input
                    type="text"
                    name="location"
                    className="form-control"
                    value={formData.location}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Event Link</label>
                  <input
                    type="url"
                    name="link"
                    className="form-control"
                    value={formData.link}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Countdown (optional)
                  </label>
                  <input
                    type="number"
                    name="countdown"
                    className="form-control"
                    value={formData.countdown}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">
                    Short Description
                  </label>
                  <textarea
                    name="short_description"
                    className="form-control"
                    rows="3"
                    value={formData.short_description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold">Description</label>
                  <textarea
                    name="description"
                    className="form-control"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Images */}
                <div className="col-md-6 text-center">
                  <label className="form-label fw-semibold">Main Image</label>
                  {previewMain ? (
                    <img
                      src={buildPreviewSrc(previewMain)}
                      alt="Main Preview"
                      className="img-preview"
                    />
                  ) : (
                    <p className="text-muted small">No main image</p>
                  )}
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*"
                    onChange={(e) => handleImage(e, "main")}
                  />
                </div>

                <div className="col-md-6 text-center">
                  <label className="form-label fw-semibold">
                    Thumbnail Image
                  </label>
                  {previewThumb ? (
                    <img
                      src={buildPreviewSrc(previewThumb)}
                      alt="Thumb Preview"
                      className="img-preview"
                    />
                  ) : (
                    <p className="text-muted small">No thumbnail</p>
                  )}
                  <input
                    type="file"
                    className="form-control mt-2"
                    accept="image/*"
                    onChange={(e) => handleImage(e, "thumb")}
                  />
                </div>

                <div className="col-12 text-end mt-3">
                  <button
                    type="button"
                    className="btn btn-secondary me-2"
                    onClick={() => {
                      setEditMode(false);
                      setSelectedEvent(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
