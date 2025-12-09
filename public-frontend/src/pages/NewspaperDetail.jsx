import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getNewspaperById,
  getAllNewspapers,
  buildImageUrl,
} from "../api/api";
import "./NewspaperDetail.css";

export default function NewspaperDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [paper, setPaper] = useState(null);
  const [allPapers, setAllPapers] = useState([]);
  const [searchDate, setSearchDate] = useState(""); // yyyy-mm-dd

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [current, list] = await Promise.all([
          getNewspaperById(id),
          getAllNewspapers(),
        ]);
        setPaper(current);
        setAllPapers(list || []);
        setError(null);
      } catch (err) {
        console.error("Error loading newspaper detail:", err);
        setError("Unable to load this newspaper.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  const handleOpen = (paperId) => {
    if (paperId === id) return;
    navigate(`/newspapers/${paperId}`);
  };

  const filtered = allPapers.filter((p) => {
    if (!searchDate) return true;
    const d = (p.edition_date || p.published_at || p.createdAt || "").slice(
      0,
      10
    );
    return d === searchDate;
  });

  const pdfPath = paper && (paper.file || paper.pdf_file || paper.pdf || paper.file_path);

  return (
    <div className="npd-page container my-4 my-md-5">
      {loading && <p>Loading PDF...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && paper && (
        <>
          <div className="npd-header mb-3">
            <button
              className="btn btn-outline-secondary btn-sm me-2"
              onClick={() => navigate(-1)}
            >
              ← Back
            </button>
            <h3 className="mb-0 flex-grow-1">
              {paper.title || "Newspaper Edition"}
            </h3>
          </div>

          <div className="row g-4">
            {/* LEFT: PDF viewer */}
            <div className="col-lg-8">
              {pdfPath ? (
                <div className="npd-iframe-wrapper">
                  <iframe
                    title={paper.title}
                    src={buildImageUrl(pdfPath)}
                    className="npd-iframe"
                  />
                </div>
              ) : (
                <p>No PDF file found for this edition.</p>
              )}
            </div>

            {/* RIGHT: date search + list */}
            <div className="col-lg-4">
              <div className="npd-sidebar card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title mb-3">Find previous editions</h5>

                  <label className="form-label small fw-semibold">
                    Search by date
                  </label>
                  <input
                    type="date"
                    className="form-control form-control-sm mb-3"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                  />

                  <div className="npd-list">
                    {filtered.length === 0 && (
                      <p className="small text-muted mb-0">
                        No editions match this date.
                      </p>
                    )}

                    {filtered.map((p) => {
                      const d = new Date(
                        p.edition_date || p.published_at || p.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });

                      return (
                        <button
                          key={p._id}
                          type="button"
                          className={`npd-list-item ${
                            p._id === id ? "active" : ""
                          }`}
                          onClick={() => handleOpen(p._id)}
                        >
                          <div className="npd-list-date">{d}</div>
                          <div className="npd-list-title">
                            {p.title || "Newspaper Edition"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
