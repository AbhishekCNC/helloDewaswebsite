import API_BASE_URL from "../config.js";
import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  RefreshCw,
  Newspaper,
  CheckCircle,
  Upload,
  ExternalLink,
} from "lucide-react";
import "./NewsManagement.css";

export default function NewsManagement() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Form & Edit Modal State
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [deleteConfirmNews, setDeleteConfirmNews] = useState(null);

  // Operation Pending Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Banner
  const [feedback, setFeedback] = useState(null);

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

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/news`);
      setNewsList(res.data);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError(err.response?.data?.message || err.message || "Failed to load news articles.");
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
      short_description: "",
      description: "",
      links: "",
      categories: "",
    });
    setMainImage(null);
    setThumbnail(null);
    setPreviewMain(null);
    setPreviewThumb(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!mainImage || !thumbnail) {
      showToast("danger", "Please select both Main Image and Thumbnail Image.");
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      form.append("main_image", mainImage);
      form.append("thumbnail", thumbnail);

      await axios.post(`${API_BASE_URL}/api/news`, form);
      showToast("success", "News article posted successfully!");
      resetForm();
      setFormVisible(false);
      fetchNews();
    } catch (err) {
      console.error("Error posting news:", err);
      showToast("danger", "Error posting news: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (news) => {
    setSelectedNews(news);
    setFormData({
      title: news.title || "",
      short_description: news.short_description || "",
      description: news.description || "",
      links: news.links || "",
      categories: news.categories || "",
    });
    setPreviewMain(news.main_image || null);
    setPreviewThumb(news.thumbnail || null);
    setMainImage(null);
    setThumbnail(null);
    setEditMode(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedNews) return;

    setIsUpdating(true);
    try {
      const form = new FormData();
      Object.keys(formData).forEach((key) => form.append(key, formData[key]));
      if (mainImage) form.append("main_image", mainImage);
      if (thumbnail) form.append("thumbnail", thumbnail);

      await axios.put(`${API_BASE_URL}/api/news/${selectedNews._id}`, form);
      showToast("success", "News article updated successfully!");
      setEditMode(false);
      setSelectedNews(null);
      resetForm();
      fetchNews();
    } catch (err) {
      console.error("Error updating news:", err);
      showToast("danger", "Error updating news: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteHandler = async () => {
    if (!deleteConfirmNews) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/news/${deleteConfirmNews._id}`);
      showToast("success", "News article deleted successfully.");
      setDeleteConfirmNews(null);
      fetchNews();
    } catch (err) {
      console.error("Error deleting news:", err);
      showToast("danger", "Error deleting news: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // Derive unique categories dynamically from news list
  const uniqueCategories = useMemo(() => {
    const categories = newsList
      .map((item) => item.categories)
      .filter((cat) => cat && cat.trim() !== "");
    return Array.from(new Set(categories));
  }, [newsList]);

  // Derived Client-Side Filtered News List
  const filteredNews = useMemo(() => {
    return newsList.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !selectedCategory || item.categories === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [newsList, searchQuery, selectedCategory]);

  const formatDate = (dateString) => {
    if (!dateString) return { date: "—", time: "" };
    const dateObj = new Date(dateString);
    return {
      date: dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="news-management-page">
      {/* Toast Notification Banner */}
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

      {/* News Page Header */}
      <div className="news-page-header">
        <div>
          <h1 className="news-header-title">News Management</h1>
          <p className="news-header-subtitle">Manage your published news articles.</p>
        </div>

        <button
          type="button"
          className="btn-post-news"
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
              <span>+ Post News</span>
            </>
          )}
        </button>
      </div>

      {/* Post News Creation Section */}
      {formVisible && (
        <div className="card border shadow-sm rounded-3 p-4 bg-white mb-3">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h2 className="h6 fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <Newspaper size={18} />
              <span>Create New Article</span>
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
              <div className="col-md-8">
                <label className="form-label fw-semibold fs-7 text-dark">Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter headline (English or Hindi)..."
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-4">
                <label className="form-label fw-semibold fs-7 text-dark">Category *</label>
                <input
                  type="text"
                  name="categories"
                  className="form-control"
                  placeholder="e.g. Local, Sports, Politics"
                  value={formData.categories}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold fs-7 text-dark">Short Description</label>
                <input
                  type="text"
                  name="short_description"
                  className="form-control"
                  placeholder="Brief summary for list previews..."
                  value={formData.short_description}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold fs-7 text-dark">Detailed Description</label>
                <textarea
                  name="description"
                  className="form-control"
                  rows="4"
                  placeholder="Full article content..."
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
              </div>

              {/* Main Image Dropzone */}
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
                      src={previewMain}
                      alt="Main Preview"
                      style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Image Dropzone */}
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">Thumbnail Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => handleImage(e, "thumb")}
                  required
                />
                {previewThumb && (
                  <div className="mt-2 text-center border rounded p-2 bg-light">
                    <img
                      src={previewThumb}
                      alt="Thumbnail Preview"
                      style={{ maxHeight: "140px", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold fs-7 text-dark">External Reference Link (Optional)</label>
                <input
                  type="url"
                  name="links"
                  className="form-control"
                  placeholder="https://example.com/source"
                  value={formData.links}
                  onChange={handleChange}
                />
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
                      Posting...
                    </>
                  ) : (
                    "Publish News"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Listing Container */}
      <div className="news-listing-container">
        {/* Toolbar with Search and Category Filter */}
        <div className="news-toolbar">
          <div className="search-filter-group">
            <div className="search-input-wrapper">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search headlines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="d-flex align-items-center gap-2">
              <Filter size={16} style={{ color: "var(--admin-text-muted)", flexShrink: 0 }} />
              <select
                className="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-muted fs-7" style={{ whiteSpace: "nowrap" }}>
            Showing <strong>{filteredNews.length}</strong> of <strong>{newsList.length}</strong> articles
          </div>
        </div>

        {/* State: Loading */}
        {loading && (
          <div className="state-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="state-description">Fetching articles list from server...</p>
          </div>
        )}

        {/* State: Network / API Error */}
        {!loading && error && (
          <div className="state-container">
            <div className="state-icon-wrapper" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="state-title">Failed to load articles</h3>
            <p className="state-description">{error}</p>
            <button type="button" className="btn btn-outline-primary btn-sm mt-2 gap-2" onClick={fetchNews}>
              <RefreshCw size={14} />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* State: Search / Filter No Results */}
        {!loading && !error && newsList.length > 0 && filteredNews.length === 0 && (
          <div className="state-container">
            <div className="state-icon-wrapper">
              <Search size={24} />
            </div>
            <h3 className="state-title">No matching articles</h3>
            <p className="state-description">No news articles found matching your search criteria.</p>
            <button
              type="button"
              className="btn btn-light border btn-sm mt-1"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* State: Empty Dataset */}
        {!loading && !error && newsList.length === 0 && (
          <div className="state-container">
            <div className="state-icon-wrapper">
              <Newspaper size={24} />
            </div>
            <h3 className="state-title">No news articles found</h3>
            <p className="state-description">Click "+ Post News" above to publish your first article.</p>
          </div>
        )}

        {/* Desktop Table View (>= 768px) */}
        {!loading && !error && filteredNews.length > 0 && (
          <div className="d-none d-md-block news-table-wrapper">
            <table className="news-table">
              <thead>
                <tr>
                  <th style={{ width: "48px", textAlign: "center" }}>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th style={{ width: "90px" }}>Views</th>
                  <th style={{ width: "150px" }}>Published At</th>
                  <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredNews.map((news, index) => {
                  const { date, time } = formatDate(news.published_at);
                  return (
                    <tr key={news._id || index}>
                      <td style={{ textAlign: "center", color: "var(--admin-text-muted)", fontSize: "13px" }}>
                        {index + 1}
                      </td>
                      <td className="news-headline-cell">
                        <div>{news.title}</div>
                        {news.links && (
                          <a
                            href={news.links}
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
                      <td>
                        <span className="category-badge">{news.categories || "Uncategorized"}</span>
                      </td>
                      <td>
                        <span className="views-badge">
                          <Eye size={14} />
                          <span>{news.view_count ?? 0}</span>
                        </span>
                      </td>
                      <td>
                        <span className="date-primary">{date}</span>
                        {time && <span className="time-secondary">{time}</span>}
                      </td>
                      <td>
                        <div className="action-btn-group justify-content-end">
                          <button
                            type="button"
                            className="btn-action-edit"
                            onClick={() => handleEdit(news)}
                            aria-label={`Edit ${news.title}`}
                          >
                            <Pencil size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action-delete"
                            onClick={() => setDeleteConfirmNews(news)}
                            aria-label={`Delete ${news.title}`}
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
        {!loading && !error && filteredNews.length > 0 && (
          <div className="d-md-none mobile-card-grid">
            {filteredNews.map((news, index) => {
              const { date, time } = formatDate(news.published_at);
              return (
                <div key={news._id || index} className="mobile-news-card">
                  <div className="mobile-card-header">
                    <span className="badge bg-light text-dark border me-2">#{index + 1}</span>
                    <h3 className="mobile-card-headline flex-grow-1">{news.title}</h3>
                  </div>

                  <div className="mobile-card-meta">
                    <span className="category-badge">{news.categories || "Uncategorized"}</span>
                    <span className="views-badge ms-auto">
                      <Eye size={14} />
                      <span>{news.view_count ?? 0} views</span>
                    </span>
                    <div className="w-100 mt-1">
                      <span className="date-primary">{date}</span>
                      {time && <span className="time-secondary">{time}</span>}
                    </div>
                  </div>

                  <div className="mobile-card-actions">
                    <button
                      type="button"
                      className="btn-action-edit"
                      onClick={() => handleEdit(news)}
                    >
                      <Pencil size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn-action-delete"
                      onClick={() => setDeleteConfirmNews(news)}
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

      {/* Edit News Modal Dialog */}
      {editMode && selectedNews && (
        <div className="admin-modal-overlay" tabIndex={-1}>
          <div className="admin-modal-dialog" role="dialog" aria-modal="true">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title d-flex align-items-center gap-2">
                <Pencil size={18} className="text-primary" />
                <span>Edit Article</span>
              </h2>
              <button
                type="button"
                className="btn btn-sm btn-light rounded-circle border p-1"
                onClick={() => {
                  setEditMode(false);
                  setSelectedNews(null);
                }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="d-flex flex-column flex-grow-1">
              <div className="admin-modal-body">
                <div className="row g-3">
                  <div className="col-md-8">
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
                  <div className="col-md-4">
                    <label className="form-label fw-semibold fs-7">Category *</label>
                    <input
                      type="text"
                      name="categories"
                      className="form-control"
                      value={formData.categories}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold fs-7">Short Description</label>
                    <input
                      type="text"
                      name="short_description"
                      className="form-control"
                      value={formData.short_description}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold fs-7">Detailed Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  {/* Main Image Edit */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Main Image</label>
                    {previewMain ? (
                      <div className="border rounded p-2 text-center bg-light mb-2">
                        <img
                          src={previewMain}
                          alt="Main Preview"
                          style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <p className="text-muted small">No image uploaded</p>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => handleImage(e, "main")}
                    />
                  </div>

                  {/* Thumbnail Image Edit */}
                  <div className="col-md-6">
                    <label className="form-label fw-semibold fs-7">Thumbnail Image</label>
                    {previewThumb ? (
                      <div className="border rounded p-2 text-center bg-light mb-2">
                        <img
                          src={previewThumb}
                          alt="Thumbnail Preview"
                          style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
                        />
                      </div>
                    ) : (
                      <p className="text-muted small">No image uploaded</p>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={(e) => handleImage(e, "thumb")}
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label fw-semibold fs-7">External Reference Link</label>
                    <input
                      type="url"
                      name="links"
                      className="form-control"
                      value={formData.links}
                      onChange={handleChange}
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
                    setSelectedNews(null);
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

      {/* Delete Confirmation Dialog */}
      {deleteConfirmNews && (
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
                onClick={() => setDeleteConfirmNews(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="mb-2 text-dark">
                Are you sure you want to delete this news article?
              </p>
              <div
                className="p-3 bg-light rounded-2 border text-muted fs-7 lh-sm"
                style={{ wordBreak: "break-word" }}
              >
                <strong>Title:</strong> {deleteConfirmNews.title}
              </div>
              <p className="text-muted small mt-2 mb-0">This action cannot be undone.</p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => setDeleteConfirmNews(null)}
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
                  "Delete Article"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
