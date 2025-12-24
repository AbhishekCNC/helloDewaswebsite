import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getLatestNewspapers, buildImageUrl } from "../api/api";
import "./NewspaperPdfSection.css";

export default function NewspaperPdfSection() {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const latest = await getLatestNewspapers(4);
        setPapers(latest || []);
      } catch (err) {
        console.error("Error loading newspapers:", err);
        setError("Unable to load newspaper PDFs.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const openPaper = (id) => {
    navigate(`/newspapers/${id}`);
  };

  return (
    <section className="np-section container ">
      {/* Section heading */}
      <div className="text-center mb-4">
        <h2 className="np-title">Hello Dewas Publication</h2>
        <p className="np-subtitle">
          Bringing you the latest stories, events, and voices that capture the true spirit of our city — Dewas
        </p>
      </div>

      {loading && <p className="text-center">Loading PDFs...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {!loading && !error && papers.length === 0 && (
        <p className="text-center">No newspaper PDFs available.</p>
      )}

      {!loading && !error && papers.length > 0 && (
        <div className="np-grid">
          {papers.map((paper) => {
            const thumb = paper.thumbnail || "";
            const dateStr = new Date(
              paper.date || paper.edition_date || paper.published_at || paper.createdAt
            ).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            });

            return (
              <div
                key={paper._id}
                className="np-card"
                onClick={() => openPaper(paper._id)}
              >
                <div className="np-thumb-wrapper">
                  {thumb ? (
                    <img
                      src={buildImageUrl(thumb)}
                      alt={paper.title}
                      className="np-thumb-img"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="np-thumb-placeholder">PDF</div>
                  )}
                </div>

                <div className="np-card-body">
                  <div className="np-date">{dateStr}</div>
                  <h5 className="np-card-title">
                    {paper.title || "Newspaper Edition"}
                  </h5>
                  <button
                    type="button"
                    className="np-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      openPaper(paper._id);
                    }}
                  >
                    Read News
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}