
import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
} from "chart.js";

import { Bar, Pie, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Title
);

export default function Analysis({ feedbacks = [] }) {
  const [selected, setSelected] = useState("All");

  const products = [
    ...new Set(feedbacks.map((x) => x.productName).filter(Boolean))
  ];

  const data =
    selected === "All"
      ? feedbacks
      : feedbacks.filter((x) => x.productName === selected);

  const total = data.length;

  const average = total
    ? (
        data.reduce((sum, x) => sum + Number(x.rating || 0), 0) / total
      ).toFixed(2)
    : "0";

  const positive = data.filter((x) => Number(x.rating) >= 4).length;
  const negative = data.filter((x) => Number(x.rating) <= 2).length;

  const ratingCounts = [5, 4, 3, 2, 1].map(
    (n) => data.filter((x) => Number(x.rating) === n).length
  );

  const sourceNames = [
    "Amazon",
    "Flipkart",
    "Direct Customer",
    "Service Center"
  ];

  const sourceCounts = sourceNames.map(
    (name) => data.filter((x) => x.source === name).length
  );

  const typeCounts = [
    data.filter((x) => x.feedbackType === "Product").length,
    data.filter((x) => x.feedbackType === "Service").length
  ];

  const ratingChart = {
    labels: ["5 Star", "4 Star", "3 Star", "2 Star", "1 Star"],
    datasets: [
      {
        label: "Feedback Count",
        data: ratingCounts,
        backgroundColor: [
          "#16a34a",
          "#65a30d",
          "#eab308",
          "#f97316",
          "#dc2626"
        ]
      }
    ]
  };

  const sourceChart = {
    labels: sourceNames,
    datasets: [
      {
        label: "Feedback Count",
        data: sourceCounts,
        backgroundColor: "#3b82f6"
      }
    ]
  };

  const typeChart = {
    labels: ["Products", "Services"],
    datasets: [
      {
        data: typeCounts,
        backgroundColor: ["#2563eb", "#f59e0b"]
      }
    ]
  };

  const satisfactionChart = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          positive,
          data.filter((x) => Number(x.rating) === 3).length,
          negative
        ],
        backgroundColor: ["#16a34a", "#eab308", "#dc2626"]
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom"
      }
    }
  };

  return (
    <section className="panel">
      <h2>Module 3 - Feedback Analysis and Insights</h2>

      <div className="field">
        <label>Select Product / Service</label>
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
        >
          <option value="All">All Products / Services</option>
          {products.map((name) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>

      <div className="analysis-grid">
        <div className="analysis-box">
          <h3>Basic Analysis</h3>
          <p>Total Feedback: <b>{total}</b></p>
          <p>Average Rating: <b>{average}</b></p>
          <p>Positive Feedback: <b>{positive}</b></p>
          <p>Negative Feedback: <b>{negative}</b></p>
          <p>Customer Satisfaction: <b>{total ? Math.round((positive / total) * 100) : 0}%</b></p>
        </div>

        <div className="analysis-box">
          <h3>Rating Distribution</h3>
          <div style={{ height: "280px" }}>
            <Bar data={ratingChart} options={chartOptions} />
          </div>
        </div>

        <div className="analysis-box">
          <h3>Source-wise Feedback</h3>
          <div style={{ height: "280px" }}>
            <Bar data={sourceChart} options={chartOptions} />
          </div>
        </div>

        <div className="analysis-box">
          <h3>Product vs Service</h3>
          <div style={{ height: "280px" }}>
            <Pie data={typeChart} options={chartOptions} />
          </div>
        </div>

        <div className="analysis-box">
          <h3>Customer Satisfaction</h3>
          <div style={{ height: "280px" }}>
            <Pie data={satisfactionChart} options={chartOptions} />
          </div>
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
