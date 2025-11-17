import React, { useState, useEffect } from "react";
import axios from "axios";
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

  const fetchPapers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/newspapers");
      setPapers(res.data);
    } catch (error) {
      console.error("Error fetching newspapers:", error);
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
      const form = new FormData();
      form.append("title", formData.title);
      form.append("date", formData.date);
      if (file) form.append("file", file);
      if (thumbnail) form.append("thumbnail", thumbnail);

      await axios.post("http://localhost:5000/api/newspapers", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Newspaper added successfully!");
      setFormVisible(false);
      resetForm();
      fetchPapers();
    } catch (error) {
      console.error("Error adding newspaper:", error);
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

      await axios.put(`http://localhost:5000/api/newspapers/${selectedPaper._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Newspaper updated successfully!");
      setEditMode(false);
      resetForm();
      fetchPapers();
    } catch (error) {
      console.error("Error updating newspaper:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this newspaper?")) {
      try {
        await axios.delete(`http://localhost:5000/api/newspapers/${id}`);
        fetchPapers();
      } catch (error) {
        console.error("Error deleting newspaper:", error);
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
              <label className="form-label fw-semibold">Upload File (PDF / Image)</label>
              {previewFile ? (
                <img
                  src={
                    previewFile.startsWith("http")
                      ? `http://localhost:5000/${previewFile}`
                      : previewFile
                  }
                  alt="Preview"
                  className="img-preview"
                />
              ) : (
                <p className="text-muted small">No preview</p>
              )}
              <input type="file" className="form-control mt-2" onChange={handleFile} />
            </div>

            <div className="col-md-6 text-center">
              <label className="form-label fw-semibold">Thumbnail Image</label>
              {previewThumb ? (
                <img
                  src={
                    previewThumb.startsWith("http")
                      ? `http://localhost:5000/${previewThumb}`
                      : previewThumb
                  }
                  alt="Thumbnail"
                  className="img-preview"
                />
              ) : (
                <p className="text-muted small">No thumbnail</p>
              )}
              <input type="file" className="form-control mt-2" onChange={handleThumbnail} />
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
                      <img
                        src={`http://localhost:5000/${paper.thumbnail}`}
                        alt="Thumbnail"
                        className="thumb-small"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <a
                      href={`http://localhost:5000/${paper.file}`}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-outline-success"
                    >
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
