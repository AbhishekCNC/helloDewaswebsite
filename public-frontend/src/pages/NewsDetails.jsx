import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getNewsById, incrementNewsView } from "../api/api";
import { getAllNews, buildImageUrl } from "../api/api";
import { set } from "mongoose";



export default function NewsDetails() {
  
  const { id } = useParams();
  const [news, setNews] = useState(null);

 useEffect(() => {
  const fetchNews = async () => {
    try {
      const data = await getNewsById(id);
       const data4 = await getAllNews();
      setNews(data);
      setSideNews(data4);

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
    <div className="row">
      <div className="col-8 ms-5">
        <div className="container py-4">
      <h1 className="fw-bold fs-2">{news.title}</h1>

      <p className="text-muted">
        📅 {new Date(news.published_at).toLocaleDateString("en-IN")}
        {/* &nbsp;&nbsp; 👁 {news.view_count} */}
      </p>
<img
  src={news ? buildImageUrl(news.main_image || news.thumbnail_image) : ""}
  alt={news?.title || "News image"}
  className="news-detail-main-img"
/>


      <p className="fs-5">{news.description}</p>
    </div>
      </div>
      
        <div className="col-lg-5">
                  <div className="up-list-wrapper">
                    {sideNews.map((item) => (
                      <div
                        key={item._id}
                        className="up-list-item"
                        onClick={() => openNews(item._id)}
                      >
                        <div className="up-list-thumb">
                          <img
                            src={buildImageUrl(
                              (item && (item.thumbnail_image || item.thumbnail || item.main_image)) || ""
                            )}
                            alt={item.title}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                        <div className="up-list-text">
                          <div className="up-list-date">
                            {new Date(item.published_at).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <h4 className="up-list-title">{item.title}</h4>
                          <p className="up-list-desc">{item.short_description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
    </div>
    
  );
}
