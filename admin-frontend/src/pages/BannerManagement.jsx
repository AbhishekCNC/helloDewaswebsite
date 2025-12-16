import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config.js";
import "./NewsManagement.css";

export default function BannerManagement() {
  const [banners, setBanners] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ categories: "", display: true });

  // two files now
  const [desktopImage, setDesktopImage] = useState(null);
  const [mobileImage, setMobileImage] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/banners`);
      setBanners(res.data);
    } catch (err) {
      console.error("Error fetching banners:", err.response?.data || err.message);
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
    setDesktopImage(e.target.files[0]);
  };

  const handleMobileImage = (e) => {
    setMobileImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!desktopImage || !mobileImage) {
      return alert("Please select both Desktop and Mobile images");
    }

    try {
      const form = new FormData();
      form.append("desktop_image", desktopImage);
      form.append("mobile_image", mobileImage);
      form.append("categories", formData.categories);
      form.append("display", formData.display);

      await axios.post(`${API_BASE_URL}/api/banners`, form);

      // reset form
      setFormVisible(false);
      setDesktopImage(null);
      setMobileImage(null);
      setFormData({ categories: "", display: true });
      fetchBanners();
    } catch (err) {
      console.error("Error uploading banner:", err.response?.data || err.message);
      alert(
        "Error uploading banner: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this banner?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/banners/${id}`);
      fetchBanners();
    } catch (err) {
      console.error("Error deleting banner:", err.response?.data || err.message);
      alert(
        "Error deleting banner: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div className="news-container">
      <div className="news-header">
        <h4 className="fw-bold text-white">📢 Banner Management</h4>
        <button
          className="btn btn-light fw-semibold"
          onClick={() => setFormVisible(!formVisible)}
        >
          {formVisible ? "Close Form" : "➕ Upload Banner"}
        </button>
      </div>

      {formVisible && (
        <form
          onSubmit={handleSubmit}
          className="card shadow-sm p-4 mt-3 form-section"
        >
          <h5 className="fw-bold mb-3 text-primary">Upload Banner</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Categories</label>
              <input
                type="text"
                name="categories"
                className="form-control"
                value={formData.categories}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6 d-flex align-items-center">
              <div>
                <label className="form-label fw-semibold d-block">
                  Display
                </label>
                <input
                  type="checkbox"
                  name="display"
                  checked={formData.display}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Desktop Image */}
            <div className="col-md-12">
              <label className="form-label fw-semibold">
                Desktop Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleDesktopImage}
                required
              />
            </div>

            {/* Mobile Image */}
            <div className="col-md-12">
              <label className="form-label fw-semibold">
                Mobile Banner Image
              </label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleMobileImage}
                required
              />
            </div>

            <div className="col-12 text-end">
              <button className="btn btn-primary px-4">Submit</button>
            </div>
          </div>
        </form>
      )}

      {/* Existing Banners */}
      <div className="card shadow-sm p-3 mt-4">
        <h5 className="fw-bold mb-3">Existing Banners</h5>
        <div className="d-flex flex-wrap gap-3">
          {banners.map((b) => (
            <div key={b._id} style={{ width: 260 }} className="card p-2">
              {/* Desktop preview */}
              {b.desktop_image && (
                <img
                  src={b.desktop_image.startsWith("http") ? b.desktop_image : `${API_BASE_URL}${b.desktop_image}`}
                  alt="Desktop banner"
                  style={{
                    width: "100%",
                    height: 130,
                    objectFit: "cover",
                    marginBottom: 6,
                  }}
                />
              )}

              {/* Mobile preview */}
              {b.mobile_image && (
                <img
                  src={b.mobile_image.startsWith("http") ? b.mobile_image : `${API_BASE_URL}${b.mobile_image}`}
                  alt="Mobile banner"
                  style={{
                    width: "100%",
                    height: 130,
                    objectFit: "cover",
                    border: "1px dashed #ddd",
                  }}
                />
              )}

              <div className="mt-2 d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {b.categories || "—"}
                  {b.display === false ? " (Hidden)" : ""}
                </small>
                <div>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <p className="text-muted mb-0">No banners uploaded yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
