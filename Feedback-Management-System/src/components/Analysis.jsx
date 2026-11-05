import React, { useState } from "react";

export default function Analysis({ feedbacks }) {
  const [selected, setSelected] = useState("All");

  const products = [...new Set(feedbacks.map((x) => x.productName).filter(Boolean))];
  const data = selected === "All"
    ? feedbacks
    : feedbacks.filter((x) => x.productName === selected);

  const total = data.length;
  const average = total
    ? (data.reduce((sum, x) => sum + Number(x.rating || 0), 0) / total).toFixed(2)
    : "0";
  const positive = data.filter((x) => Number(x.rating) >= 4).length;
  const negative = data.filter((x) => Number(x.rating) <= 2).length;
  const count = (test) => data.filter(test).length;

  return (
    <section className="panel">
      <h2>Module 3 - Feedback Analysis and Insights</h2>

      <div className="field">
        <label>Select Product / Service</label>
        <select value={selected} onChange={(e) => setSelected(e.target.value)}>
          <option value="All">All Products / Services</option>
          {products.map((name) => <option key={name}>{name}</option>)}
        </select>
      </div>

      <div className="analysis-grid">
        <div className="analysis-box">
          <h3>Basic Analysis</h3>
          <p>Total Feedback: <b>{total}</b></p>
          <p>Average Rating: <b>{average}</b></p>
          <p>Positive Feedback: <b>{positive}</b></p>
          <p>Negative Feedback: <b>{negative}</b></p>
        </div>

        <div className="analysis-box">
          <h3>Rating Analysis</h3>
          {[5, 4, 3, 2, 1].map((n) => (
            <p key={n}>{n} Star: <b>{count((x) => Number(x.rating) === n)}</b></p>
          ))}
        </div>

        <div className="analysis-box">
          <h3>Source-wise Analysis</h3>
          {["Amazon", "Flipkart", "Direct Customer", "Service Center"].map((name) => (
            <p key={name}>{name}: <b>{count((x) => x.source === name)}</b></p>
          ))}
        </div>

        <div className="analysis-box">
          <h3>Product vs Service</h3>
          <p>Product Feedback: <b>{count((x) => x.feedbackType === "Product")}</b></p>
          <p>Service Feedback: <b>{count((x) => x.feedbackType === "Service")}</b></p>
          <p>Customer Satisfaction: <b>{total ? Math.round((positive / total) * 100) : 0}%</b></p>
        </div>

        <div className="analysis-box">
          <h3>Improvement Areas</h3>
          <p>
            {!total
              ? "No feedback available."
              : negative
                ? `${negative} negative feedback(s) found. Review them to identify improvement areas.`
                : "No major negative feedback found. Continue monitoring customer feedback."}
          </p>
        </div>
      </div>
    </section>
  );
}