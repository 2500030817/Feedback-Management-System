import React, { useMemo, useState } from "react";
import Analysis from "./Analysis";

export default function AdminDashboard({ user, feedbacks, onLogout }) {
  const [search, setSearch] = useState("");
  const [source, setSource] = useState("All");
  const [type, setType] = useState("All");
  const [rating, setRating] = useState("All");

  const visibleFeedbacks = useMemo(() => {
    return feedbacks.filter((item) => {
      const word = search.toLowerCase();
      const matchesSearch = [
        item.customerName,
        item.productName,
        item.feedback,
        item.email
      ].some((value) => (value || "").toLowerCase().includes(word));

      return (
        matchesSearch &&
        (source === "All" || item.source === source) &&
        (type === "All" || item.feedbackType === type) &&
        (rating === "All" || Number(item.rating) === Number(rating))
      );
    });
  }, [feedbacks, search, source, type, rating]);

  const total = feedbacks.length;
  const productCount = feedbacks.filter((x) => x.feedbackType === "Product").length;
  const serviceCount = feedbacks.filter((x) => x.feedbackType === "Service").length;
  const average = total
    ? (feedbacks.reduce((sum, x) => sum + Number(x.rating || 0), 0) / total).toFixed(2)
    : "0";

  return (
    <>
      <header className="header">
        <h1>Centralized Feedback Management System</h1>
        <p>Admin Dashboard - Welcome, {user.name}</p>
        <button className="logout" onClick={onLogout}>Logout</button>
      </header>

      <main className="container">
        <section className="panel">
          <h2>Module 2 - Feedback Viewing and Management</h2>

          <div className="cards">
            <div className="card"><h3>Total Feedback</h3><p>{total}</p></div>
            <div className="card"><h3>Product Feedback</h3><p>{productCount}</p></div>
            <div className="card"><h3>Service Feedback</h3><p>{serviceCount}</p></div>
            <div className="card"><h3>Average Rating</h3><p>{average}</p></div>
          </div>

          <div className="filters">
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search feedback..." />
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option>All</option><option>Direct Customer</option><option>Amazon</option><option>Flipkart</option><option>Service Center</option>
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option>All</option><option>Product</option><option>Service</option>
            </select>
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="All">All Ratings</option><option value="5">5 Star</option><option value="4">4 Star</option><option value="3">3 Star</option><option value="2">2 Star</option><option value="1">1 Star</option>
            </select>
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th><th>Product / Service</th><th>Type</th>
                  <th>Source</th><th>Category</th><th>Rating</th><th>Feedback</th><th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleFeedbacks.length ? visibleFeedbacks.map((item) => (
                  <tr key={item.id}>
                    <td>{item.customerName}</td><td>{item.productName}</td>
                    <td>{item.feedbackType}</td><td>{item.source}</td>
                    <td>{item.category}</td><td>{item.rating}</td>
                    <td>{item.feedback}</td><td>{item.status || "New"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan="8" className="center">No feedback found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <Analysis feedbacks={feedbacks} />
      </main>
    </>
  );
}