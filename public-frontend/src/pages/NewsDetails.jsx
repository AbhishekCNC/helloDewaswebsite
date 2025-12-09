import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsById, incrementNewsView } from "../api/api";
import { buildImageUrl } from "../api/api";



export default function NewsDetails() {
  const { id } = useParams();
  const [news, setNews] = useState(null);

 useEffect(() => {
  const fetchNews = async () => {
    try {
      const data = await getNewsById(id);
      setNews(data);

      // 👉 Update view count
      await incrementNewsView(id);
    } catch (err) {
      console.error("❌ Failed to load news:", err);
      setError("Unable to load this news article.");
    } finally {
      setLoading(false);
    }
  };

  fetchNews();
}, [id]);


  if (!news) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container py-4">
      <h1 className="fw-bold">{news.title}</h1>

      <p className="text-muted">
        📅 {new Date(news.published_at).toLocaleDateString("en-IN")}
        &nbsp;&nbsp; 👁 {news.view_count}
      </p>
<img
  src={news ? buildImageUrl(news.main_image || news.thumbnail_image) : ""}
  alt={news?.title || "News image"}
  className="news-detail-main-img"
/>


      <p className="fs-5">{news.description}</p>
    </div>
  );
}
