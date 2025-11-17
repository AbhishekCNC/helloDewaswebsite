import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EventManagement.css";

export default function EventManagement() {
  const [events, setEvents] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    link: "",
  });
  const [banner, setBanner] = useState(null);
  const [previewBanner, setPreviewBanner] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/events");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBanner(file);
    setPreviewBanner(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      if (banner) form.append("banner", banner);

      await axios.post("http://localhost:5000/api/events", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Event added successfully!");
      setFormVisible(false);
      setFormData({
        title: "",
        date: "",
        location: "",
        description: "",
        link: "",
      });
      setBanner(null);
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setEditMode(true);
    setFormData({
      title: event.title,
      date: event.date.split("T")[0],
      location: event.location,
      description: event.description,
      link: event.link,
    });
    setPreviewBanner(event.banner || null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      if (banner) form.append("banner", banner);

      await axios.put(`http://localhost:5000/api/events/${selectedEvent._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Event updated successfully!");
      setEditMode(false);
      setSelectedEvent(null);
      setBanner(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/api/events/${id}`);
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h4 className="fw-bold text-white">🎉 Event Management</h4>
        <button
          className="btn btn-light fw-semibold"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? "Close Form" : "➕ Add Event"}
        </button>
      </div>

      {formVisible && (
        <form onSubmit={handleSubmit} className="card shadow-sm p-4 mt-3 form-section">
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
            <div className="col-md-6">
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
            <div className="col-md-6">
              <label className="form-label fw-semibold">Location</label>
              <input
                type="text"
                name="location"
                className="form-control"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Event Link (optional)</label>
              <input
                type="url"
                name="link"
                className="form-control"
                value={formData.link}
                onChange={handleChange}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="col-md-12 text-center">
              <label className="form-label fw-semibold">Event Banner</label>
              {previewBanner ? (
                <img src={previewBanner} alt="Preview" className="img-preview" />
              ) : (
                <p className="text-muted small">No banner uploaded</p>
              )}
              <input type="file" className="form-control mt-2" onChange={handleImage} />
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
                  <td>{event.title}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.location}</td>
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
                <div className="col-md-6">
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
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Location</label>
                    <input
                      type="text"
                      name="location"
                      className="form-control"
                      value={formData.location}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>
                  <div className="col-md-12 text-center">
                    <label className="form-label fw-semibold">Banner</label>
                    {previewBanner ? (
                      <img src={previewBanner} alt="Preview" className="img-preview" />
                    ) : (
                      <p className="text-muted small">No banner</p>
                    )}
                    <input
                      type="file"
                      className="form-control mt-2"
                      onChange={handleImage}
                    />
                  </div>
                  <div className="col-12 text-end mt-3">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => setEditMode(false)}
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
