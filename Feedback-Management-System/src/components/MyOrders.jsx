import React from "react";

export default function MyOrders({ orders = [], bookings = [] }) {
  return (
    <section className="panel">
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        orders.map((order) => (
          <div className="cart-item" key={order.id}>
            <div>
              <h3>Order #{order.id.slice(0, 8)}</h3>
              <p>Total: ₹{order.total}</p>
              <p>Status: {order.status}</p>
              <p>
                Products: {order.items?.map((item) => item.name).join(", ")}
              </p>
            </div>
          </div>
        ))
      )}

      <h2>My Service Bookings</h2>

      {bookings.length === 0 ? (
        <p>No service bookings yet.</p>
      ) : (
        bookings.map((booking) => (
          <div className="cart-item" key={booking.id}>
            <div>
              <h3>{booking.name}</h3>
              <p>Booking Date: {booking.bookingDate}</p>
              <p>Price: ₹{booking.price}</p>
              <p>Status: {booking.status}</p>
            </div>
          </div>
        ))
      )}
    </section>
  );
}
