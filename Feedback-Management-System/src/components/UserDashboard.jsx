
import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";

export default function UserDashboard({ user, onLogout, onSubmitFeedback }) {
  const [message, setMessage] = useState("");

  async function submitFeedback(data) {
    setMessage("");

    const result = await onSubmitFeedback(data);

    if (result) {
      setMessage("Feedback submitted successfully!");
    } else {
      setMessage("Failed to submit feedback. Please try again.");
    }
  }

  return (
    <>
      <header className="header">
        <h1>Centralized Feedback Management System</h1>
        <p>Welcome, {user.name}</p>
        <button className="logout" onClick={onLogout}>Logout</button>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Module 1 - Feedback Collection and Submission</h2>
          <p className="hint">
            Share your experience about a product or service.
          </p>

          <FeedbackForm
            user={user}
            onSubmitFeedback={submitFeedback}
          />

          {message && <p className="success">{message}</p>}
        </section>
      </main>
    </>
  );
}
