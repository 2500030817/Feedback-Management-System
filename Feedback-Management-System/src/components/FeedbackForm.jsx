
import React, { useState } from "react";

export default function FeedbackForm({ user, onSubmitFeedback }) {
  const [form, setForm] = useState({
    customerName: user.name,
    email: user.email,
    productName: "",
    feedbackType: "",
    category: "",
    source: "Direct Customer",
    rating: "",
    feedback: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const result = await onSubmitFeedback({
      ...form,
      rating: Number(form.rating)
    });

    if (result) {
      setForm({
        customerName: user.name,
        email: user.email,
        productName: "",
        feedbackType: "",
        category: "",
        source: "Direct Customer",
        rating: "",
        feedback: ""
      });
    }

    setLoading(false);
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Customer Name</label>
        <input name="customerName" value={form.customerName} onChange={handleChange} required />
      </div>

      <div className="field">
        <label>Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>

      <div className="field">
        <label>Product / Service Name</label>
        <input name="productName" value={form.productName} onChange={handleChange} placeholder="Enter product or service" required />
      </div>

      <div className="field">
        <label>Feedback Type</label>
        <select name="feedbackType" value={form.feedbackType} onChange={handleChange} required>
          <option value="">Select Type</option>
          <option>Product</option>
          <option>Service</option>
        </select>
      </div>

      <div className="field">
        <label>Category</label>
        <select name="category" value={form.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          <option>Electronics</option>
          <option>Home Appliances</option>
          <option>Fashion</option>
          <option>Makeup</option>
          <option>Toys</option>
          <option>Jewellery</option>
          <option>Service</option>
        </select>
      </div>

      <div className="field">
        <label>Feedback Source</label>
        <select name="source" value={form.source} onChange={handleChange}>
          <option>Direct Customer</option>
          <option>Amazon</option>
          <option>Flipkart</option>
          <option>Service Center</option>
        </select>
      </div>

      <div className="field">
        <label>Rating</label>
        <select name="rating" value={form.rating} onChange={handleChange} required>
          <option value="">Select Rating</option>
          <option value="1">1 - Very Bad</option>
          <option value="2">2 - Bad</option>
          <option value="3">3 - Average</option>
          <option value="4">4 - Good</option>
          <option value="5">5 - Excellent</option>
        </select>
      </div>

      <div className="field wide">
        <label>Feedback / Review</label>
        <textarea name="feedback" value={form.feedback} onChange={handleChange} placeholder="Enter your feedback" required />
      </div>

      <div className="wide">
        <button className="primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </div>
    </form>
  );
}
