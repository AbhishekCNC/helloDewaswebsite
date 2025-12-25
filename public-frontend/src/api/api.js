export const API_BASE_URL = "https://hello-dewas-web.onrender.com";
export const API_URL = `${API_BASE_URL}/api`;

export const getLatestNews = async () => {
  const res = await fetch(`${API_URL}/news/latest`);
  return res.json();
};

export const getLatestEvents = async () => {
  const res = await fetch(`${API_URL}/events/latest`);
  return res.json();
};

export const getNewsById = async (id) => {
  const res = await fetch(`${API_URL}/news/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch news details");
  }
  return res.json();
};

export const incrementNewsView = async (id) => {
  const res = await fetch(`${API_URL}/news/${id}/view`, {
    method: "PUT",
  });
  return res.json();
};

// ✅ Get ALL news (sorted by latest first – backend handles sorting)
export async function getAllNews() {
  const res = await fetch(`${API_URL}/news`);

  if (!res.ok) {
    throw new Error("Failed to fetch all news");
  }

  const data = await res.json();
  return data;
}

// ✅ Use this everywhere to display images from DB
export function buildImageUrl(path) {
  if (!path) return "";

  // if already full URL (in case you ever store http links)
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // normalize backslashes from Windows paths in Mongo
  const normalized = path.replace(/\\/g, "/"); // "uploads/newspaper/..." or "uploads/news/..."
  // handle paths that may or may not start with /
  const safePath = normalized.startsWith("/") ? normalized : "/" + normalized;
  return `${API_BASE_URL}${safePath}`;           // -> http://127.0.0.1:5000/uploads/...
}

// --- NEWSPAPERS / NEWS PDF ---

export async function getAllNewspapers() {
  const res = await fetch(`${API_BASE_URL}/api/newspapers`);
  if (!res.ok) throw new Error("Failed to fetch newspapers");
  return res.json();
}

/**
 * 4 latest newspaper PDFs for home page
 */
export async function getLatestNewspapers(limit = 4) {
  const all = await getAllNewspapers();

  // Normalize thumbnail field so component can rely on it
  const normalized = (all || []).map((p) => {
    return {
      ...p,
      thumbnail: p.thumbnail || p.thumbnail_image || p.cover_image || "",
    };
  });

  // Sort newest -> oldest by date
  const sorted = [...normalized].sort((a, b) => {
    const da = new Date(a.date || a.edition_date || a.published_at || a.createdAt || 0);
    const db = new Date(b.date || b.edition_date || b.published_at || b.createdAt || 0);
    return db - da;
  });

  return sorted.slice(0, limit);
}

// For single-issue view by id
export async function getNewspaperById(id) {
  const res = await fetch(`${API_BASE_URL}/api/newspapers/${id}`);
  if (!res.ok) throw new Error("Failed to fetch newspaper");
  return res.json();
}

// --- EVENTS ---

export async function getAllEvents() {
  const res = await fetch(`${API_BASE_URL}/api/events`);
  if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();

  // Normalize shapes:
  // - prefer thumbnail_image / main_image
  // - make sure short_description always exists
  return (data || []).map((ev) => ({
    ...ev,
    thumbnail_image:
      ev.thumbnail_image || ev.thumbnail || ev.banner || ev.main_image || "",
    main_image: ev.main_image || ev.banner || ev.thumbnail_image || "",
    short_description:
      ev.short_description || ev.short_desc || ev.description || "",
  }));
}

export async function getEventById(id) {
  const res = await fetch(`${API_BASE_URL}/api/events/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  const ev = await res.json();

  return {
    ...ev,
    thumbnail_image:
      ev.thumbnail_image || ev.thumbnail || ev.banner || ev.main_image || "",
    main_image: ev.main_image || ev.banner || ev.thumbnail_image || "",
    short_description:
      ev.short_description || ev.short_desc || ev.description || "",
  };
}

// ✅ Get all active banners
export async function getActiveBanners() {
  const res = await fetch(`${API_BASE_URL}/api/banners`);
  if (!res.ok) throw new Error("Failed to fetch banners");
  const data = await res.json();
  // keep only banners where display !== false
  return (data || []).filter((b) => b.display !== false);
}

// src/api/api.js

export async function getAllBanners() {
  const res = await fetch(`${API_BASE_URL}/api/banners`);
  if (!res.ok) throw new Error("Failed to fetch banners");
  return res.json();
}
