
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";

export default function Signup({ onSignup, onShowLogin, message }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(result.user, {
        displayName: name.trim()
      });

      onSignup(name.trim(), email.trim());
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="auth-page">
      <header className="header">
        <h1>Centralized Feedback Management System</h1>
        <p>Create your account to submit feedback</p>
      </header>

      <section className="auth-card">
        <h2>User Signup</h2>

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              minLength="6"
              required
            />
          </div>

          <button className="primary full" type="submit">
            Create Account
          </button>
        </form>

        {(error || message) && (
          <p className="notice">{error || message}</p>
        )}

        <p className="switch">
          Already have an account?{" "}
          <button type="button" onClick={onShowLogin}>
            Login
          </button>
        </p>
      </section>
    </div>
  );
}
