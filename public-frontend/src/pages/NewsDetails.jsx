import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getNewsById, getLatestNews, buildImageUrl } from "../api/api";
import "./NewsDetail.css";

export default function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const n = await getNewsById(id);
        const latest = await getLatestNews(10);
        setNews(n);
        setRelated(latest.filter((i) => i._id !== id));
      } catch (err) {
        console.error("Failed to load news", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="news-loading">Loading...</div>
      </>
    );
  }

  if (!news) {
    return (
      <>
        <Navbar />
        <div className="news-loading">News not found</div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="news-detail-wrapper">
        <div className="news-detail-container">
          {/* LEFT CONTENT */}
          <div className="news-main">
            <Link to="/" className="news-back">← Back</Link>

            <h1 className="news-title">{news.title}</h1>

            <div className="news-meta">
              <span>Author: Priya Mehta</span>
              <span>{new Date(news.createdAt).toLocaleDateString()}</span>
              <span>{news.categories}</span>
            </div>

            <div className="news-share">
              <span>Share To</span>
              <div className="share-icons">
                <i className="bi bi-whatsapp" />
                <i className="bi bi-twitter" />
                <i className="bi bi-facebook" />
                <i className="bi bi-instagram" />
              </div>
            </div>

            {news.main_image && (
              <img
                src={buildImageUrl(news.main_image)}
                alt={news.title}
                className="news-hero-image"
              />
            )}

            <div className="news-content">
              <h3>Dewas, India —</h3>
              {(news.description || "").split("\n").map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="news-tags">
              #HelloDewas #GreenDewas #CityStories
            </div>

            <button className="load-more-btn">Load More</button>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="news-sidebar">
            <h3>Related Blogs</h3>
            {related.map((item) => (
              <Link
                key={item._id}
                to={`/news/${item._id}`}
                className="related-card"
              >
                <img src={buildImageUrl(item.thumbnail || item.main_image)} alt={item.title} />
                <div>
                  <h4>{item.title}</h4>
                  <p>Local residents turned an empty plot into a green garden.</p>
                </div>
              </Link>
            ))}
          </aside>
        </div>
      </section>

      {/* REUSABLE BOTTOM COMPONENT */}
    

      <Footer />
    </>
  );
}
