import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config.js";
import "./NewspaperManagement.css";

export default function NewspaperManagement() {
  const [papers, setPapers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
  });
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewThumb, setPreviewThumb] = useState(null);

  useEffect(() => {
    fetchPapers();
  }, []);

  // Helper to build a safe absolute URL for API-served files
  const buildUrl = (p) => {
    if (!p) return "";
    if (p.startsWith("http")) return p;
    // p may start with /uploads/... or without leading slash
    if (p.startsWith("/")) return `${API_BASE_URL}${p}`;
    return `${API_BASE_URL}/${p}`;
  };

  const fetchPapers = async () => {
    try {
      console.log("📡 Fetching newspapers from:", `${API_BASE_URL}/api/newspapers`);
      const res = await axios.get(`${API_BASE_URL}/api/newspapers`);
      console.log("✅ Newspapers fetched successfully:", res.data);
      setPapers(res.data);
    } catch (error) {
      console.error("❌ Error fetching newspapers:", error.response?.data || error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    const uploaded = e.target.files[0];
    setFile(uploaded);
    if (uploaded?.type.includes("image")) {
      setPreviewFile(URL.createObjectURL(uploaded));
    } else {
      setPreviewFile(null);
    }
  };

  const handleThumbnail = (e) => {
    const uploaded = e.target.files[0];
    setThumbnail(uploaded);
    if (uploaded) {
      setPreviewThumb(URL.createObjectURL(uploaded));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!file || !thumbnail) {
        alert("❌ Please upload both file and thumbnail!");
        return;
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("date", formData.date);
      form.append("file", file);
      form.append("thumbnail", thumbnail);

      console.log("📤 Uploading newspaper to:", `${API_BASE_URL}/api/newspapers`);
      const res = await axios.post(`${API_BASE_URL}/api/newspapers`, form);
      console.log("✅ Newspaper uploaded successfully:", res.data);

      alert("✅ Newspaper added successfully!");
      setFormVisible(false);
      resetForm();
      fetchPapers();
    } catch (error) {
      console.error("❌ Error adding newspaper:", error.response?.data || error.message);
      alert("❌ Error adding newspaper: " + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (paper) => {
    setSelectedPaper(paper);
    setEditMode(true);
    setFormData({ title: paper.title, date: paper.date.split("T")[0] });
    setPreviewFile(paper.file);
    setPreviewThumb(paper.thumbnail);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("date", formData.date);
      if (file) form.append("file", file);
      if (thumbnail) form.append("thumbnail", thumbnail);

      console.log("📤 Updating newspaper:", selectedPaper._id);
      const res = await axios.put(`${API_BASE_URL}/api/newspapers/${selectedPaper._id}`, form);
      console.log("✅ Newspaper updated successfully:", res.data);

      alert("✅ Newspaper updated successfully!");
      setEditMode(false);
      resetForm();
      fetchPapers();
    } catch (error) {
      console.error("❌ Error updating newspaper:", error.response?.data || error.message);
      alert("❌ Error updating newspaper: " + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this newspaper?")) {
      try {
        console.log("🗑️ Deleting newspaper:", id);
        await axios.delete(`${API_BASE_URL}/api/newspapers/${id}`);
        console.log("✅ Newspaper deleted successfully");
        fetchPapers();
      } catch (error) {
        console.error("❌ Error deleting newspaper:", error.response?.data || error.message);
        alert("❌ Error deleting newspaper: " + (error.response?.data?.message || error.message));
      }
    }
  };

  const resetForm = () => {
    setFormData({ title: "", date: "" });
    setFile(null);
    setThumbnail(null);
    setPreviewFile(null);
    setPreviewThumb(null);
    setSelectedPaper(null);
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h4 className="fw-bold text-white">📰 Newspaper Management</h4>
        <button
          className="btn btn-light fw-semibold"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? "Close Form" : "➕ Upload Newspaper"}
        </button>
      </div>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="card shadow-sm p-4 mt-3 form-section"
        >
          <h5 className="fw-bold mb-3 text-primary">🗞️ Add Newspaper</h5>
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

            <div className="col-md-6 text-center">
              <label className="form-label fw-semibold">Upload File (PDF / Image) *</label>
              {previewFile ? (
                <img src={buildUrl(previewFile)} alt="Preview" className="img-preview" />
              ) : (
                <p className="text-muted small">No preview</p>
              )}
              <input
                type="file"
                className="form-control mt-2"
                onChange={handleFile}
                required
              />
            </div>

            <div className="col-md-6 text-center">
              <label className="form-label fw-semibold">Thumbnail Image *</label>
              {previewThumb ? (
                <img src={buildUrl(previewThumb)} alt="Thumbnail" className="img-preview" />
              ) : (
                <p className="text-muted small">No thumbnail</p>
              )}
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={handleThumbnail}
                required
              />
            </div>

            <div className="col-12 mt-3 text-end">
              <button className="btn btn-primary px-4">Submit</button>
            </div>
          </div>
        </form>
      )}

      {/* Newspaper Table */}
      <div className="card shadow-sm p-3 mt-4">
        <h5 className="fw-bold mb-3">📋 Uploaded Newspapers</h5>
        <div className="table-responsive">
          <table className="table align-middle table-hover text-center">
            <thead className="table-primary">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Date</th>
                <th>Thumbnail</th>
                <th>File</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {papers.map((paper, index) => (
                <tr key={paper._id}>
                  <td>{index + 1}</td>
                  <td>{paper.title}</td>
                  <td>{new Date(paper.date).toLocaleDateString()}</td>
                  <td>
                    {paper.thumbnail ? (
                      <img src={buildUrl(paper.thumbnail)} alt="Thumbnail" className="thumb-small" />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <a href={buildUrl(paper.file)} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">
                      View / Download
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(paper)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(paper._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {papers.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No newspapers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
