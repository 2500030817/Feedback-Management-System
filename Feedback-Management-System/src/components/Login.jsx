
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Login.css";

export default function Login({
  onLogin,
  onAdminLogin,
  onShowSignup,
  message
}) {
  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      if (role === "admin") {
        await onAdminLogin(result.user);
      } else {
        onLogin({
          name: result.user.displayName || email.trim(),
          email: result.user.email,
          role: "user"
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-page">
      <nav className="top-navbar">
        <div className="brand">
          <div className="brand-icon">F</div>
          <span>Feedback<span className="brand-highlight">Hub</span></span>
        </div>

        <div className="nav-label">CUSTOMER FEEDBACK PLATFORM</div>
      </nav>

      <main className="main-layout">

        <section className="hero-section">
          <div className="hero-tag">
            ✦ YOUR VOICE MATTERS
          </div>

          <h1>
            Every Feedback
            <br />
            Makes Us <span>Better.</span>
          </h1>

          <p className="hero-description">
            Share your thoughts, express your experience
            and help us create better products and services.
            Your opinion makes a difference!
          </p>

          <div className="hero-features">
            <div className="feature-item">
              <div className="feature-icon">✉</div>
              <div>
                <h4>Share Your Thoughts</h4>
                <p>Submit feedback easily</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">✓</div>
              <div>
                <h4>Quick & Simple</h4>
                <p>Easy feedback management</p>
              </div>
            </div>

            <div className="feature-item">
              <div className="feature-icon">★</div>
              <div>
                <h4>Make An Impact</h4>
                <p>Your voice helps us improve</p>
              </div>
            </div>
          </div>

          <div className="hero-bottom">
            <span>✦</span> Better experiences start with your feedback.
          </div>
        </section>

        <section className="login-section">
          <div className="login-card">

            <div className="login-card-icon">✦</div>

            <h2>Welcome Back!</h2>
            <p className="login-subtitle">
              Login to continue to your account
            </p>

            <div className="role-tabs">
              <button
                type="button"
                className={role === "user" ? "active-tab" : ""}
                onClick={() => {
                  setRole("user");
                  setError("");
                }}
              >
                User Login
              </button>

              <button
                type="button"
                className={role === "admin" ? "active-tab" : ""}
                onClick={() => {
                  setRole("admin");
                  setError("");
                }}
              >
                Admin Login
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>Email Address</label>
              <div className="input-box">
                <span>✉</span>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <label>Password</label>
              <div className="input-box">
                <span>🔒</span>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? "Please wait..." :
                  role === "admin" ? "Login as Admin →" : "Login to Account →"}
              </button>
            </form>

            {error && <p className="login-error">{error}</p>}
            {message && <p className="login-message">{message}</p>}

            {role === "user" && (
              <p className="signup-text">
                Don't have an account?
                <button type="button" onClick={onShowSignup}>
                  Sign Up
                </button>
              </p>
            )}

            <div className="secure-text">
              🔒 Your information is safe and secure
            </div>
          </div>
        </section>

      </main>

      <footer className="home-footer">
        © 2026 FeedbackHub. All rights reserved.
      </footer>
    </div>
  );
}
