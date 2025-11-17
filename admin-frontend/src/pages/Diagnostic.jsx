import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../config";

export default function Diagnostic() {
  const [status, setStatus] = useState("Loading...");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const url = `${API_BASE_URL}/api/news`;
        console.log("📡 Fetching from:", url);
        setStatus(`Connecting to ${url}...`);
        
        const res = await axios.get(url, {
          timeout: 5000,
          headers: { "Content-Type": "application/json" }
        });
        
        setStatus(`✅ SUCCESS! Backend returned ${res.data.length} items`);
        setData(res.data);
        console.log("✅ Data received:", res.data);
      } catch (err) {
        setStatus("❌ ERROR connecting to backend!");
        setError(`${err.message} | Code: ${err.code} | Status: ${err.response?.status}`);
        console.error("Full error object:", err);
        if (err.response) {
          console.error("Response data:", err.response.data);
        }
      }
    };
    checkBackend();
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>🔍 Diagnostic Page</h1>
      <p><strong>API URL:</strong> {`${API_BASE_URL}/api/news`}</p>
      <p><strong>Status:</strong> {status}</p>
      {error && <p style={{ color: "red" }}><strong>Error Message:</strong> {error}</p>}
      {data && (
        <div>
          <h2>✅ Data Received ({data.length} items)</h2>
          {data.map((item, idx) => (
            <div key={idx} style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}>
              <strong>{item.title}</strong><br />
              Category: {item.categories || "N/A"}<br />
              Views: {item.view_count}
            </div>
          ))}
        </div>
      )}
      <hr />
      <p>
        <a href="/news" style={{ fontSize: "18px", color: "blue" }}>Go to News Page →</a>
      </p>
    </div>
  );
}
