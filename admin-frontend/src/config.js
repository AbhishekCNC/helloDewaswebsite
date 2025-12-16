// Prefer explicit Vite env var during development, otherwise use localhost in dev or the production host
const DEFAULT_PROD = "https://hello-dewas-web.onrender.com";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://127.0.0.1:5000'
    : DEFAULT_PROD);

export default API_BASE_URL;
