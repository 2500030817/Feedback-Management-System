
import React, { useState } from "react";
import FeedbackForm from "./FeedbackForm";
import Shop from "./Shop";
import Cart from "./Cart";
import Services from "./Services";
import MyOrders from "./MyOrders";

export default function UserDashboard({
  user,
  onLogout,
  onSubmitFeedback,
  onPlaceOrder,
  onBookService,
  orders,
  bookings
}) {
  const [activeTab, setActiveTab] = useState("shop");
  const [cart, setCart] = useState([]);
  const [message, setMessage] = useState("");

  function addToCart(product) {
    setCart((previousCart) => {
      const existing = previousCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return previousCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...previousCart, { ...product, quantity: 1 }];
    });

    setMessage("Product added to cart!");
  }

  function removeFromCart(productId) {
    setCart((previousCart) =>
      previousCart.filter((item) => item.id !== productId)
    );
  }

  async function checkout() {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const result = await onPlaceOrder(cart, total);

    if (result) {
      setCart([]);
      setMessage("Order placed successfully!");
    } else {
      setMessage("Order failed. Please try again.");
    }
  }

  async function submitFeedback(data) {
    setMessage("");

    const result = await onSubmitFeedback(data);

    setMessage(
      result
        ? "Feedback submitted successfully!"
        : "Feedback submission failed."
    );
  }

  const tabs = [
    { id: "shop", label: "Shop Products" },
    { id: "cart", label: "Cart (" + cart.length + ")" },
    { id: "services", label: "Book Services" },
    { id: "orders", label: "My Orders" },
    { id: "feedback", label: "Feedback" }
  ];

  return (
    <>
      <header className="header">
        <h1>Centralized E-Commerce & Service Platform</h1>
        <p>Welcome, {user.name}</p>
        <button className="logout" onClick={onLogout}>
          Logout
        </button>
      </header>

      <nav className="user-navigation">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active-tab" : ""}
            onClick={() => {
              setActiveTab(tab.id);
              setMessage("");
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <main className="container">
        {message && <p className="success">{message}</p>}

        {activeTab === "shop" && (
          <Shop onAddToCart={addToCart} />
        )}

        {activeTab === "cart" && (
          <Cart
            cart={cart}
            onRemove={removeFromCart}
            onCheckout={checkout}
          />
        )}

        {activeTab === "services" && (
          <Services onBookService={onBookService} />
        )}

        {activeTab === "orders" && (
          <MyOrders orders={orders} bookings={bookings} />
        )}

        {activeTab === "feedback" && (
          <section className="panel">
            <h2>Share Your Feedback</h2>
            <FeedbackForm
              user={user}
              onSubmitFeedback={submitFeedback}
            />
          </section>
        )}
      </main>
    </>
  );
}
