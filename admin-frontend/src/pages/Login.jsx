import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

export default function Login() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const nextStep = () => {
    if (!email) return setError("Please enter your email.");
    setError("");
    setStep(2);
  };

  const handleLogin = async () => {
    if (!password) return setError("Please enter your password.");
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      setSuccess(true);
      localStorage.setItem("token", res.data.token);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="d-flex justify-content-center align-items-center"
  style={{
    height: "100vh",
    width: "100vw",
    background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  }}
>

      <div
  className="card shadow-lg p-4 text-center animate__animated animate__fadeIn"
  style={{
    width: "90%",
    maxWidth: "420px",
    borderRadius: "15px",
    border: "none",
    background: "#fff",
  }}
>
        {!success ? (
          <>
            <h4 className="text-primary mb-4 fw-bold">📰 Admin Login</h4>

            {step === 1 ? (
              <div className="animate__animated animate__fadeIn">
                <label className="form-label fw-semibold">Email address</label>
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {error && <div className="text-danger small mb-2">{error}</div>}
                <button className="btn btn-primary w-100" onClick={nextStep}>
                  Next →
                </button>
              </div>
            ) : (
              <div className="animate__animated animate__fadeIn">
                <label className="form-label fw-semibold">Password</label>
                <input
                  type="password"
                  className="form-control mb-3"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {error && <div className="text-danger small mb-2">{error}</div>}
                <button
                  className="btn btn-success w-100 mb-2"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="animate__animated animate__fadeInUp">
            <h4 className="text-success mb-2">✅ Welcome Back!</h4>
            <p className="text-muted">Redirecting to your dashboard...</p>
          </div>
        )}
      </div>
    </div>
  );
}
