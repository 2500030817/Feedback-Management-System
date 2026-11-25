
import React, { useState } from "react";
import products from "../data/products";

export default function Shop({ onAddToCart }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="shop-container">
      <div className="shop-hero">
        <div>
          <span className="shop-tag">WELCOME TO OUR STORE</span>
          <h1>Discover Products You Love</h1>
          <p>
            Explore quality products across electronics, fashion,
            home appliances and more.
          </p>
        </div>
        <div className="shop-hero-icon">🛍️</div>
      </div>

      <div className="shop-heading">
        <div>
          <h2>Explore Our Products</h2>
          <p>Find something perfect for you.</p>
        </div>
        <span className="shop-count">
          {filteredProducts.length} Products
        </span>
      </div>

      <div className="shop-toolbar">
        <input
          type="text"
          placeholder="🔍 Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <div className="shop-category-list">
        {categories.map((item) => (
          <button
            key={item}
            className={
              category === item
                ? "shop-category active"
                : "shop-category"
            }
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="shop-product-grid">
        {filteredProducts.map((product) => (
          <div className="shop-product-card" key={product.id}>
            <div className="shop-image-box">
              <img src={product.image} alt={product.name} />
              <span className="shop-product-category">
                {product.category}
              </span>
            </div>

            <div className="shop-product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>

              <div className="shop-product-bottom">
                <strong>
                  ₹{product.price.toLocaleString("en-IN")}
                </strong>
                <button onClick={() => onAddToCart(product)}>
                  + Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="shop-empty">
          <span>🔎</span>
          <h3>No products found</h3>
          <p>Try another product name or category.</p>
        </div>
      )}
    </section>
  );
}
