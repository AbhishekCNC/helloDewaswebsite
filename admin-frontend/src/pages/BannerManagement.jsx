import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import API_BASE_URL from "../config.js";
import {
  Upload,
  Plus,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  ExternalLink,
  Monitor,
  Smartphone,
  Image as ImageIcon,
} from "lucide-react";
import "./BannerManagement.css";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ categories: "", display: true });
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);
  const [previewDesktop, setPreviewDesktop] = useState(null);
  const [previewMobile, setPreviewMobile] = useState(null);

  // Operation Pending Loading States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Modals
  const [deleteConfirmBanner, setDeleteConfirmBanner] = useState(null);
  const [lightboxData, setLightboxData] = useState(null); // { url, title, variant }

  // Active variant state per banner ID: { [bannerId]: 'desktop' | 'mobile' }
  const [activeVariants, setActiveVariants] = useState({});

  // Toast Feedback Banner
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  // Handle ESC key for modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (lightboxData) setLightboxData(null);
        if (deleteConfirmBanner) setDeleteConfirmBanner(null);
      }
    };
    if (lightboxData || deleteConfirmBanner) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxData, deleteConfirmBanner]);

  const showToast = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const getFullImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith("blob:") || path.startsWith("http")) return path;
    const clean = path.startsWith("/") ? path.slice(1) : path;
    return `${API_BASE_URL}/${clean}`;
  };

  const fetchBanners = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/banners`);
      setBanners(res.data || []);
    } catch (err) {
      console.error("Error fetching banners:", err);
      setError(err.response?.data?.message || err.message || "Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleDesktopImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setDesktopImage(file);
      setPreviewDesktop(URL.createObjectURL(file));
    }
  };

  const handleMobileImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMobileImage(file);
      setPreviewMobile(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({ categories: "", display: true });
    setDesktopImage(null);
    setMobileImage(null);
    setPreviewDesktop(null);
    setPreviewMobile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desktopImage || !mobileImage) {
      showToast("danger", "Both Desktop and Mobile banner images are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append("desktop_image", desktopImage);
      form.append("mobile_image", mobileImage);
      form.append("categories", formData.categories);
      form.append("display", formData.display);

      await axios.post(`${API_BASE_URL}/api/banners`, form);
      showToast("success", "Banner uploaded successfully!");
      setFormVisible(false);
      resetForm();
      fetchBanners();
    } catch (err) {
      console.error("Error uploading banner:", err);
      showToast("danger", "Error uploading banner: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDeleteHandler = async () => {
    if (!deleteConfirmBanner) return;
    setIsDeleting(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/banners/${deleteConfirmBanner._id}`);
      showToast("success", "Banner deleted successfully.");
      setDeleteConfirmBanner(null);
      fetchBanners();
    } catch (err) {
      console.error("Error deleting banner:", err);
      showToast("danger", "Error deleting banner: " + (err.response?.data?.message || err.message));
    } finally {
      setIsDeleting(false);
    }
  };

  const setVariant = (bannerId, variant) => {
    setActiveVariants((prev) => ({
      ...prev,
      [bannerId]: variant,
    }));
  };

  return (
    <div className="banner-management-page">
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

      {/* Page Header */}
      <div className="banner-page-header">
        <div>
          <h1 className="banner-header-title">Banner Management</h1>
          <p className="banner-header-subtitle">Upload and manage your website banners.</p>
        </div>

        <button
          type="button"
          className="btn-upload-banner"
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
              <span>Upload Banner</span>
            </>
          )}
        </button>
      </div>

      {/* Upload Banner Collapsible Form */}
      {formVisible && (
        <div className="card border shadow-sm rounded-3 p-4 bg-white mb-3">
          <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
            <h2 className="h6 fw-bold mb-0 text-primary d-flex align-items-center gap-2">
              <Upload size={18} />
              <span>Upload New Website Banner</span>
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
                <label className="form-label fw-semibold fs-7 text-dark">Category / Section</label>
                <input
                  type="text"
                  name="categories"
                  className="form-control"
                  placeholder="e.g. Home, Sports, Election, Offers"
                  value={formData.categories}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6 d-flex align-items-center">
                <div className="form-check form-switch mt-3 mt-md-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="displaySwitch"
                    name="display"
                    checked={formData.display}
                    onChange={handleChange}
                  />
                  <label className="form-check-label fw-semibold fs-7 text-dark ms-2" htmlFor="displaySwitch">
                    Display Banner on Live Website
                  </label>
                </div>
              </div>

              {/* Desktop Banner Image Upload */}
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark d-flex align-items-center gap-1">
                  <Monitor size={15} className="text-muted" />
                  <span>Desktop Banner Image *</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleDesktopImage}
                  required
                />
                <div className="text-muted fs-8 mt-1">Recommended for wide screens (e.g. 1920x450 or 1200x300)</div>
                {previewDesktop && (
                  <div className="mt-2 text-center border rounded p-2 bg-light">
                    <img
                      src={previewDesktop}
                      alt="Desktop Preview"
                      style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain" }}
                    />
                  </div>
                )}
              </div>

              {/* Mobile Banner Image Upload */}
              <div className="col-md-6">
                <label className="form-label fw-semibold fs-7 text-dark d-flex align-items-center gap-1">
                  <Smartphone size={15} className="text-muted" />
                  <span>Mobile Banner Image *</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleMobileImage}
                  required
                />
                <div className="text-muted fs-8 mt-1">Recommended for phone screens (e.g. 600x300 or 750x400)</div>
                {previewMobile && (
                  <div className="mt-2 text-center border rounded p-2 bg-light">
                    <img
                      src={previewMobile}
                      alt="Mobile Preview"
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
                      Uploading...
                    </>
                  ) : (
                    "Upload Banner"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Main Content Area */}
      <div className="banners-grid-container">
        {/* Loading State */}
        {loading && (
          <div className="state-container bg-white border rounded-3">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="state-description">Loading banners from server...</p>
          </div>
        )}

        {/* Network / API Error State */}
        {!loading && error && (
          <div className="state-container bg-white border rounded-3">
            <div className="state-icon-wrapper" style={{ backgroundColor: "#FEF2F2", color: "#DC2626" }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="state-title">Failed to load banners</h3>
            <p className="state-description">{error}</p>
            <button type="button" className="btn btn-outline-primary btn-sm mt-2 gap-2" onClick={fetchBanners}>
              <RefreshCw size={14} />
              <span>Retry Request</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && banners.length === 0 && (
          <div className="state-container bg-white border rounded-3">
            <div className="state-icon-wrapper">
              <ImageIcon size={24} />
            </div>
            <h3 className="state-title">No banners uploaded yet</h3>
            <p className="state-description">Upload your first website banner to display in rotating sliders or promotions.</p>
            <button
              type="button"
              className="btn btn-primary btn-sm mt-2"
              onClick={() => setFormVisible(true)}
              style={{ backgroundColor: "var(--admin-primary)" }}
            >
              + Upload Banner
            </button>
          </div>
        )}

        {/* Banners Responsive Grid */}
        {!loading && !error && banners.length > 0 && (
          <div className="banners-grid">
            {banners.map((b) => {
              const currentVariant = activeVariants[b._id] || "desktop";
              const currentImagePath =
                currentVariant === "mobile" ? b.mobile_image : b.desktop_image;
              const fullImageUrl = getFullImageUrl(currentImagePath);
              const title = b.categories || "Banner";

              return (
                <div key={b._id} className="banner-card">
                  {/* Variant Selector Tabs */}
                  <div className="banner-variant-tabs">
                    <button
                      type="button"
                      className={`banner-variant-tab ${currentVariant === "desktop" ? "active" : ""}`}
                      onClick={() => setVariant(b._id, "desktop")}
                      title="Show Desktop format preview"
                    >
                      <Monitor size={13} />
                      <span>Desktop</span>
                    </button>
                    <button
                      type="button"
                      className={`banner-variant-tab ${currentVariant === "mobile" ? "active" : ""}`}
                      onClick={() => setVariant(b._id, "mobile")}
                      title="Show Mobile format preview"
                    >
                      <Smartphone size={13} />
                      <span>Mobile</span>
                    </button>
                  </div>

                  {/* Image Preview Box (Aspect-ratio preserved, object-fit contain) */}
                  <div
                    className="banner-preview-box"
                    onClick={() =>
                      setLightboxData({
                        url: fullImageUrl,
                        title,
                        variant: currentVariant === "desktop" ? "Desktop Variant" : "Mobile Variant",
                      })
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        setLightboxData({
                          url: fullImageUrl,
                          title,
                          variant: currentVariant === "desktop" ? "Desktop Variant" : "Mobile Variant",
                        });
                      }
                    }}
                    aria-label={`View full preview of ${title} (${currentVariant})`}
                  >
                    {fullImageUrl ? (
                      <img
                        src={fullImageUrl}
                        alt={`${title} - ${currentVariant} variant`}
                        className="banner-preview-img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-muted fs-7 p-3 text-center">
                        <ImageIcon size={28} className="text-secondary mb-1" />
                        <div>No image uploaded for this variant</div>
                      </div>
                    )}
                    <div className="banner-preview-overlay">
                      <Eye size={16} />
                      <span>Click to enlarge</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="banner-card-body">
                    <div className="d-flex align-items-center justify-content-between gap-2">
                      <h3 className="banner-category-title">{title}</h3>
                      <span
                        className={`banner-status-badge ${
                          b.display !== false ? "active" : "hidden"
                        }`}
                      >
                        {b.display !== false ? "Active" : "Hidden"}
                      </span>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="banner-card-footer">
                    <button
                      type="button"
                      className="btn-banner-preview"
                      onClick={() =>
                        setLightboxData({
                          url: fullImageUrl,
                          title,
                          variant: currentVariant === "desktop" ? "Desktop Variant" : "Mobile Variant",
                        })
                      }
                    >
                      <Eye size={14} />
                      <span>Preview</span>
                    </button>
                    <button
                      type="button"
                      className="btn-banner-delete"
                      onClick={() => setDeleteConfirmBanner(b)}
                    >
                      <Trash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Accessible Full Image Lightbox Viewer Modal */}
      {lightboxData && (
        <div className="lightbox-overlay" tabIndex={-1}>
          <div className="lightbox-dialog" role="dialog" aria-modal="true">
            <div className="lightbox-header">
              <div>
                <h2 className="h6 fw-bold mb-0 text-dark">{lightboxData.title}</h2>
                <small className="text-muted">{lightboxData.variant}</small>
              </div>
              <div className="d-flex align-items-center gap-2">
                {lightboxData.url && (
                  <a
                    href={lightboxData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                  >
                    <span>Open Original</span>
                    <ExternalLink size={13} />
                  </a>
                )}
                <button
                  type="button"
                  className="btn btn-sm btn-light rounded-circle border p-1"
                  onClick={() => setLightboxData(null)}
                  aria-label="Close image viewer"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="lightbox-body">
              {lightboxData.url ? (
                <img
                  src={lightboxData.url}
                  alt={lightboxData.title}
                  className="lightbox-img"
                />
              ) : (
                <p className="text-white">Image not available</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal Dialog */}
      {deleteConfirmBanner && (
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
                onClick={() => setDeleteConfirmBanner(null)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="admin-modal-body">
              <p className="mb-2 text-dark">
                Are you sure you want to delete this website banner?
              </p>
              <div
                className="p-3 bg-light rounded-2 border text-muted fs-7 lh-sm"
                style={{ wordBreak: "break-word" }}
              >
                <div><strong>Category/Name:</strong> {deleteConfirmBanner.categories || "Unnamed Banner"}</div>
              </div>
              <p className="text-muted small mt-2 mb-0">This banner will be removed from desktop and mobile views immediately.</p>
            </div>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => setDeleteConfirmBanner(null)}
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
                  "Delete Banner"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
