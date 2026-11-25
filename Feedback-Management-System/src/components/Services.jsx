import React, { useState } from "react";
import services from "../data/services";

export default function Services({ onBookService }) {
  const [selectedDate, setSelectedDate] = useState({});
  const [message, setMessage] = useState("");

  async function handleBooking(service) {
    if (!selectedDate[service.id]) {
      setMessage("Please select a booking date.");
      return;
    }

    const result = await onBookService({
      ...service,
      bookingDate: selectedDate[service.id]
    });

    setMessage(
      result
        ? "Service booked successfully!"
        : "Booking failed. Please try again."
    );
  }

  return (
    <section className="panel">
      <h2>Book a Service</h2>
      <p className="hint">Choose a service and select your preferred date.</p>

      <div className="product-grid">
        {services.map((service) => (
          <div className="product-card" key={service.id}>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <h3>₹{service.price}</h3>

            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate[service.id] || ""}
              onChange={(e) =>
                setSelectedDate({
                  ...selectedDate,
                  [service.id]: e.target.value
                })
              }
            />

            <button onClick={() => handleBooking(service)}>
              Book Service
            </button>
          </div>
        ))}
      </div>

      {message && <p className="success">{message}</p>}
    </section>
  );
}