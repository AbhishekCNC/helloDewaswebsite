import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_BASE_URL from "../config.js";
import {
  Upload,
  Plus,
  Search,
  Calendar,
  FileText,
  ExternalLink,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import "./NewspaperManagement.css";

export default function NewspaperManagement() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search Filter
  const [searchQuery, setSearchQuery] = useState("");

  // Form & Edit Modal State
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [deleteConfirmPaper, setDeleteConfirmPaper] = useState(null);

  // Operation Pending Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Feedback Notification Banner
  const [feedback, setFeedback] = useState(null);

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

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const buildUrl = (p) => {
    if (!p) return "";
    if (p.startsWith("blob:") || p.startsWith("http")) return p;
    const clean = p.startsWith("/") ? p.slice(1) : p;
    return `${API_BASE_URL}/${clean}`;
  };

  const fetchPapers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/newspapers`);
      setPapers(res.data || []);
    } catch (err) {
      console.error("Error fetching newspapers:", err);
      setError(err.response?.data?.message || err.message || "Failed to load newspapers.");
    } finally {
      setLoading(false);
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

  const resetForm = () => {
    setFormData({ title: "", date: "" });
    setFile(null);
    setThumbnail(null);
    setPreviewFile(null);
    setPreviewThumb(null);
    setSelectedPaper(null);
    setEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !thumbnail) {
      showToast("danger", "Please upload both the Newspaper document (PDF/Image) and Thumbnail cover.");
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("date", formData.date);
      form.append("file", file);
      form.append("thumbnail", thumbnail);

      await axios.post(`${API_BASE_URL}/api/newspapers`, form);
      showToast("success", "Newspaper edition uploaded successfully!");
      setFormVisible(false);
      resetForm();
      fetchPapers();
    } catch (err) {
      console.error("Error adding newspaper:", err);
      showToast("danger", "Error uploading newspaper: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (paper) => {
    setSelectedPaper(paper);
    setEditMode(true);
    setFormVisible(true);
    setFormData({
      title: paper.title || "",
      date: paper.date ? paper.date.split("T")[0] : "",
    });
    setPreviewFile(paper.file || null);
    setPreviewThumb(paper.thumbnail || null);
    setFile(null);
    setThumbnail(null);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedPaper) return;

    setIsUpdating(true);
    try {
      const form = new FormData();
      form.append("title", formData.title);
      form.append("date", formData.date);
      if (file) form.append("file", file);
      if (thumbnail) form.append("thumbnail", thumbnail);

      await axios.put(`${API_BASE_URL}/api/newspapers/${selectedPaper._id}`, form);
      showToast("success", "Newspaper edition updated successfully!");
      setEditMode(false);
      setFormVisible(false);
      resetForm();
      fetchPapers();
    } catch (err) {
      console.error("Error updating newspaper:", err);
      showToast("danger", "Error updating newspaper: " + (err.response?.data?.message || err.message));
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteHandler = async () => {
    if (!deleteConfirmPaper) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/newspapers/${deleteConfirmPaper._id}`);
      showToast("success", "Newspaper deleted successfully.");
      setDeleteConfirmPaper(null);
      fetchPapers();
    } catch (err) {
      console.error("Error deleting newspaper:", err);
      showToast("danger", "Error deleting newspaper: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  // Timezone-safe date formatter (DD MMM YYYY)
  const formatNewspaperDate = (dateString) => {
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

  // Filtered newspapers list
  const filteredPapers = useMemo(() => {
    if (!searchQuery.trim()) return papers;
    const q = searchQuery.toLowerCase();
    return papers.filter((p) => {
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchDate = p.date?.includes(q);
      return matchTitle || matchDate;
    });
  }, [papers, searchQuery]);

  return (
    <div className="newspaper-management-page">
      {/* Toast Feedback Notification */}
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

      {/* Page Header (Fixed dark readable text) */}
      <div className="newspaper-page-header">
        <div>
          <h1 className="newspaper-header-title">Newspaper Management</h1>
          <p className="newspaper-header-subtitle">Upload and manage your newspaper editions.</p>
        </div>

        <button
          type="button"
          className="btn-upload-newspaper"
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
              <Upload size={18} />
              <span>Upload Newspaper</span>
            </>
          )}
        </button>
      </div>

      {/* Upload / Edit Form Section */}
      {formVisible && (
        <div className="card border shadow-sm rounded-3 p-4 bg-white mb-3">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h2 className="h6 fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <FileText size={18} />
              <span>{editMode ? "Edit Newspaper Edition" : "Upload New Newspaper Edition"}</span>
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

          <form onSubmit={editMode ? handleUpdate : handleSubmit}>
            <div className="row g-3">
              <div className="col-md-7">
                <label className="form-label fw-semibold fs-7 text-dark">Edition Title *</label>
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="e.g. Daily Edition - Dewas Samachar"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-5">
                <label className="form-label fw-semibold fs-7 text-dark">Publication Date *</label>
                <input
                  type="date"
                  name="date"
                  className="form-control"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Newspaper Document File Upload */}
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">
                  Newspaper Document (PDF / Image) {!editMode ? "*" : "(optional to change)"}
                </label>
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  className="form-control"
                  onChange={handleFile}
                  required={!editMode}
                />
                <div className="text-muted fs-8 mt-1">Accepted: PDF, PNG, JPG, WebP (up to 60MB)</div>
                {previewFile && (
                  <div className="mt-2 text-center border rounded p-2 bg-light">
                    {previewFile.startsWith("data:") || previewFile.startsWith("blob:") || previewFile.match(/\.(jpeg|jpg|png|webp)$/i) ? (
                      <img
                        src={buildUrl(previewFile)}
                        alt="Document Preview"
                        style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <div className="d-flex align-items-center justify-content-center gap-2 p-2 text-primary fw-medium">
                        <FileText size={20} />
                        <span>PDF Document attached</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Front Page / Thumbnail Cover Upload */}
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark">
                  Thumbnail / Front Cover Image {!editMode ? "*" : "(optional to change)"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleThumbnail}
                  required={!editMode}
                />
                <div className="text-muted fs-8 mt-1">Portrait cover image preview</div>
                {previewThumb && (
                  <div className="mt-2 text-center border rounded p-2 bg-light">
                    <img
                      src={buildUrl(previewThumb)}
                      alt="Thumbnail Preview"
                      style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
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
                  disabled={isSubmitting || isUpdating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary px-4 fw-semibold"
                  disabled={isSubmitting || isUpdating}
                  style={{ backgroundColor: "var(--admin-primary)" }}
                >
                  {isSubmitting || isUpdating ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                      {editMode ? "Saving Changes..." : "Uploading Edition..."}
                    </>
                  ) : editMode ? (
                    "Save Changes"
                  ) : (
                    "Publish Edition"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Listing Container */}
      <div className="newspaper-listing-container">
        {/* Toolbar with Search */}
        <div className="newspaper-toolbar">
          <div className="newspaper-search-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="newspaper-search-input"
              placeholder="Search by newspaper title or date..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="text-muted fs-7" style={{ whiteSpace: "nowrap" }}>
            Showing <strong>{filteredPapers.length}</strong> of <strong>{papers.length}</strong> editions
          </div>
        </div>

        {/* State: Loading */}
        {loading && (
          <div className="state-container">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="state-description">Fetching newspapers from server...</p>
          </div>
        )}

        {/* State: Network / API Error */}
        {!loading && error && (
          <div className="state-container">
            <div className="state-icon-wrapper" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="state-title">Failed to load newspapers</h3>
            <p className="state-description">{error}</p>
            <button type="button" className="btn btn-outline-primary btn-sm mt-2 gap-2" onClick={fetchPapers}>
              <RefreshCw size={14} />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* State: Search / Filter No Results */}
        {!loading && !error && papers.length > 0 && filteredPapers.length === 0 && (
          <div className="state-container">
            <div className="state-icon-wrapper">
              <Search size={24} />
            </div>
            <h3 className="state-title">No matching editions</h3>
            <p className="state-description">No newspaper editions match "{searchQuery}".</p>
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
        {!loading && !error && papers.length === 0 && (
          <div className="state-container">
            <div className="state-icon-wrapper">
              <FileText size={24} />
            </div>
            <h3 className="state-title">No newspapers yet</h3>
            <p className="state-description">Click "Upload Newspaper" above to publish your first edition.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-2"
              onClick={() => {
                resetForm();
                setFormVisible(true);
              }}
              style={{ backgroundColor: "var(--admin-primary)" }}
            >
              + Upload Newspaper
            </button>
          </div>
        )}

        {/* Desktop Table View (>= 768px) with Combined Thumbnail + Title */}
        {!loading && !error && filteredPapers.length > 0 && (
          <div className="d-none d-md-block newspaper-table-wrapper">
            <table className="newspaper-table">
              <thead>
                <tr>
                  <th style={{ width: "48px", textAlign: "center" }}>#</th>
                  <th>Newspaper</th>
                  <th style={{ width: "160px" }}>Publication Date</th>
                  <th style={{ width: "160px" }}>Document</th>
                  <th style={{ width: "160px", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPapers.map((paper, index) => {
                  const dateFormatted = formatNewspaperDate(paper.date);
                  const fileUrl = buildUrl(paper.file);
                  const thumbUrl = buildUrl(paper.thumbnail);

                  return (
                    <tr key={paper._id || index}>
                      <td style={{ textAlign: "center", color: "var(--admin-text-muted)", fontSize: "13px" }}>
                        {index + 1}
                      </td>
                      <td>
                        <div className="newspaper-cell-combined">
                          <div className="newspaper-portrait-thumb">
                            {paper.thumbnail ? (
                              <img
                                src={thumbUrl}
                                alt={`Cover of ${paper.title}`}
                                className="newspaper-thumb-img"
                                loading="lazy"
                              />
                            ) : (
                              <FileText size={24} className="text-secondary" />
                            )}
                          </div>
                          <div className="newspaper-title-text">{paper.title}</div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <Calendar size={14} className="text-muted" />
                          <span className="fw-medium text-dark">{dateFormatted}</span>
                        </div>
                      </td>
                      <td>
                        {fileUrl ? (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-view-doc"
                            title="Open full newspaper document"
                          >
                            <FileText size={14} />
                            <span>View PDF</span>
                            <ExternalLink size={12} className="ms-1 text-muted" />
                          </a>
                        ) : (
                          <span className="text-muted fs-8">No document</span>
                        )}
                      </td>
                      <td>
                        <div className="newspaper-action-group justify-content-end">
                          <button
                            type="button"
                            className="btn-event-edit"
                            onClick={() => handleEdit(paper)}
                            aria-label={`Edit ${paper.title}`}
                          >
                            <Pencil size={14} />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-event-delete"
                            onClick={() => setDeleteConfirmPaper(paper)}
                            aria-label={`Delete ${paper.title}`}
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
        {!loading && !error && filteredPapers.length > 0 && (
          <div className="d-md-none mobile-newspaper-grid">
            {filteredPapers.map((paper, index) => {
              const dateFormatted = formatNewspaperDate(paper.date);
              const fileUrl = buildUrl(paper.file);
              const thumbUrl = buildUrl(paper.thumbnail);

              return (
                <div key={paper._id || index} className="mobile-newspaper-card">
                  <div className="mobile-newspaper-top">
                    <div className="mobile-newspaper-thumb">
                      {paper.thumbnail ? (
                        <img
                          src={thumbUrl}
                          alt={`Cover of ${paper.title}`}
                          className="newspaper-thumb-img"
                        />
                      ) : (
                        <FileText size={20} className="text-secondary" />
                      )}
                    </div>
                    <div className="mobile-newspaper-info">
                      <span className="badge bg-light text-dark border align-self-start">#{index + 1}</span>
                      <h3 className="mobile-newspaper-title">{paper.title}</h3>
                      <div className="mobile-newspaper-date">
                        <Calendar size={13} />
                        <span>{dateFormatted}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mobile-newspaper-actions">
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-view-doc"
                      >
                        <FileText size={15} />
                        <span>View PDF</span>
                      </a>
                    )}
                    <button
                      type="button"
                      className="btn-event-edit"
                      onClick={() => handleEdit(paper)}
                    >
                      <Pencil size={15} />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      className="btn-event-delete"
                      onClick={() => setDeleteConfirmPaper(paper)}
                    >
                      <Trash2 size={15} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal Dialog */}
      {deleteConfirmPaper && (
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
                onClick={() => setDeleteConfirmPaper(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="mb-2 text-dark">
                Are you sure you want to delete this newspaper edition?
              </p>
              <div
                className="p-3 bg-light rounded-2 border text-muted fs-7 lh-sm"
                style={{ wordBreak: "break-word" }}
              >
                <div><strong>Title:</strong> {deleteConfirmPaper.title}</div>
                <div className="mt-1"><strong>Date:</strong> {formatNewspaperDate(deleteConfirmPaper.date)}</div>
              </div>
              <p className="text-muted small mt-2 mb-0">This document will be permanently removed from the website.</p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => setDeleteConfirmPaper(null)}
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
                  "Delete Newspaper"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
