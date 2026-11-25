import React from "react";

export default function Cart({ cart, onRemove, onCheckout }) {
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <section className="panel">
      <h2>Shopping Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty. Add some products from the Shop.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <div>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price * item.quantity}</p>
              </div>

              <button onClick={() => onRemove(item.id)}>
                Remove
              </button>
            </div>
          ))}

          <h3>Total: ₹{total.toLocaleString("en-IN")}</h3>

          <button onClick={onCheckout}>
            Place Order
          </button>
          <p className="hint">
            Demo checkout only. No real payment will be collected.
          </p>
        </>
      )}
    </section>
  );
}