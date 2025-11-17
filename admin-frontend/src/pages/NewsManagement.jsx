import API_BASE_URL from "../config.js";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NewsManagement.css";

export default function NewsManagement() {
  const [newsList, setNewsList] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    description: "",
    links: "",
    categories: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [previewMain, setPreviewMain] = useState(null);
  const [previewThumb, setPreviewThumb] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
     try {
    console.log("📡 Fetching news from:", `${API_BASE_URL}/api/news`);
    const res = await axios.get(`${API_BASE_URL}/api/news`);
    console.log("✅ News fetched successfully:", res.data);
    setNewsList(res.data);
  } catch (error) {
    console.error("❌ Error fetching news:", error.message);
  }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImage = (e, type) => {
    const file = e.target.files[0];
    if (type === "main") {
      setMainImage(file);
      setPreviewMain(URL.createObjectURL(file));
    }
    if (type === "thumb") {
      setThumbnail(file);
      setPreviewThumb(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      if (mainImage) form.append("main_image", mainImage);
      if (thumbnail) form.append("thumbnail", thumbnail);

      await axios.post(`${API_BASE_URL}/api/news`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ News posted successfully!");
      setFormData({
        title: "",
        short_description: "",
        description: "",
        links: "",
        categories: "",
      });
      setMainImage(null);
      setThumbnail(null);
      setFormVisible(false);
      fetchNews();
    } catch (error) {
      console.error("Error posting news:", error);
    }
  };

  const handleEdit = (news) => {
    setSelectedNews(news);
    setEditMode(true);
    setFormData({
      title: news.title,
      short_description: news.short_description,
      description: news.description,
      links: news.links,
      categories: news.categories,
    });
    setPreviewMain(news.main_image || null);
    setPreviewThumb(news.thumbnail || null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
  if (mainImage) form.append("main_image", mainImage);
  if (thumbnail) form.append("thumbnail", thumbnail);

      await axios.put(`${API_BASE_URL}/api/news/${selectedNews._id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ News updated successfully!");
      setEditMode(false);
      setSelectedNews(null);
      setMainImage(null);
      setThumbnail(null);
      fetchNews();
    } catch (error) {
      console.error("Error updating news:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this news?")) {
      try {
        await axios.delete(`${API_BASE_URL}/api/news/${id}`);
        fetchNews();
      } catch (error) {
        console.error("Error deleting news:", error);
      }
    }
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h4 className="fw-bold text-white">🗞️ News Management</h4>
        <button
          className="btn btn-light fw-semibold"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? "Close Form" : "➕ Post News"}
        </button>
      </div>

      {/* ✅ Create News Form */}
      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="card shadow-sm p-4 mt-3 form-section"
        >
          <h5 className="fw-bold mb-3 text-primary">📰 Create News</h5>
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
                    <label className="form-label fw-semibold">Category</label>
                    <input
                      type="text"
                      name="categories"
                      className="form-control"
                      value={formData.categories}
                      onChange={handleChange}
                      required
                    />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Short Description</label>
              <input
                type="text"
                name="short_description"
                className="form-control"
                value={formData.short_description}
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
            <div className="col-md-6">
              <label className="form-label fw-semibold">Main Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleImage(e, "main")}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Thumbnail Image</label>
              <input
                type="file"
                className="form-control"
                onChange={(e) => handleImage(e, "thumb")}
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">External Link (optional)</label>
              <input
                type="url"
                name="links"
                className="form-control"
                value={formData.links}
                onChange={handleChange}
              />
            </div>
            <div className="col-12 mt-3 text-end">
              <button className="btn btn-primary px-4">Submit</button>
            </div>
          </div>
        </form>
      )}

      {/* 🧾 Past News Table */}
      <div className="card shadow-sm p-3 mt-4">
        <h5 className="fw-bold mb-3">📋 Past News</h5>
        <div className="table-responsive">
          <table className="table align-middle table-hover">
            <thead className="table-primary text-center">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Category</th>
                <th>Views</th>
                <th>Published At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {newsList.map((news, index) => (
                <tr key={news._id}>
                  <td>{index + 1}</td>
                  <td>{news.title}</td>
                  <td>{news.categories}</td>
                  <td>{news.view_count}</td>
                  <td>{new Date(news.published_at).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(news)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(news._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {newsList.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No news found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✏️ Edit Modal */}
      {editMode && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h5 className="fw-bold mb-3 text-primary">✏️ Edit News</h5>
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
                  <label className="form-label fw-semibold">Category</label>
                  <input
                    type="text"
                    name="categories"
                    className="form-control"
                    value={formData.categories}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label fw-semibold">Short Description</label>
                  <input
                    type="text"
                    name="short_description"
                    className="form-control"
                    value={formData.short_description}
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

                {/* 🖼️ Image Previews */}
                <div className="col-md-6 text-center">
                  <label className="form-label fw-semibold">Main Image</label>
                  {previewMain ? (
                    <img
                      src={previewMain}
                      alt="Main Preview"
                      className="img-preview"
                    />
                  ) : (
                    <p className="text-muted small">No image uploaded</p>
                  )}
                  <input
                    type="file"
                    className="form-control mt-2"
                    onChange={(e) => handleImage(e, "main")}
                  />
                </div>

                <div className="col-md-6 text-center">
                  <label className="form-label fw-semibold">Thumbnail Image</label>
                  {previewThumb ? (
                    <img
                      src={previewThumb}
                      alt="Thumbnail Preview"
                      className="img-preview"
                    />
                  ) : (
                    <p className="text-muted small">No image uploaded</p>
                  )}
                  <input
                    type="file"
                    className="form-control mt-2"
                    onChange={(e) => handleImage(e, "thumb")}
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
