import "../styles/home.css";
import menuData from "../data/menuData";

function Home({ cart, setCart, setCurrentPage }) {
  const addToCart = (item) => {
    const existing = cart.find((i) => i.name === item.name);

    if (existing) {
      setCart(
        cart.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  return (
    <div className="home-container">
      {/* 🔥 HERO SECTION */}
      <div className="hero-section">
        <div className="hero-overlay">
          <h1 className="hero-title">Arabian Cafe</h1>
          <p className="hero-subtitle">
            Experience The Golden Taste of Royal Arabia
          </p>
          <button className="hero-btn" onClick={() => setCurrentPage("menu")}>
            Explore Menu
          </button>
        </div>
      </div>
      {/* 🔥 Royal Specials Section */}
      <div className="specials-section">
        <h2 className="section-title">Royal Specials</h2>

        <div className="specials-grid">
          <div className="special-card">
            <h3>Chicken Grill Burger</h3>
            <p>Juicy grilled chicken with Arabian spices</p>
            <span>₹129</span>
          </div>

          <div className="special-card">
            <h3>Chicken Lollipop</h3>
            <p>Spicy crispy royal wings</p>
            <span>₹120</span>
          </div>

          <div className="special-card">
            <h3>BBQ Pizza</h3>
            <p>Smoky Arabian style pizza</p>
            <span>₹200</span>
          </div>
        </div>
      </div>

      {/* 🏰 About Arabian Section */}
      <div className="about-section">
        <div className="about-content">
          <h2>About Arabian Cafe</h2>

          <p>
            Arabian Cafe – The Golden Crisp is more than just a restaurant.
            Located beside Madhur Courier, Sikandar Bazar, Ashta, we serve the
            authentic taste of royal Arabia with a modern twist.
          </p>

          <p>
            From juicy burgers to crispy wings and flavorful pizzas, every dish
            is crafted with passion and premium ingredients.
          </p>

          <div className="about-highlight">
            Experience the golden taste. Experience royalty.
          </div>
        </div>
      </div>

      {/* 🍽 Royal Menu Categories */}
      <div className="menu-section">
        <h2 className="menu-title">Our Royal Menu</h2>

        <div className="menu-grid">
          <div className="menu-card">
            <h3>Burgers</h3>
            <p>Juicy, grilled & packed with flavor</p>
          </div>

          <div className="menu-card">
            <h3>Pizza</h3>
            <p>Cheesy delights with Arabian twist</p>
          </div>

          <div className="menu-card">
            <h3>Wings & Tenders</h3>
            <p>Crispy, spicy & perfectly cooked</p>
          </div>

          <div className="menu-card">
            <h3>Chinese</h3>
            <p>Noodles, fried rice & more</p>
          </div>

          <div className="menu-card">
            <h3>Fries & Snacks</h3>
            <p>Perfect companions to your meal</p>
          </div>

          <div className="menu-card">
            <h3>Beverages</h3>
            <p>Refreshing drinks & mocktails</p>
          </div>
        </div>
      </div>
      {/* WHY CHOOSE US */}
      <section className="why-section">
        <h2 className="section-heading">Why Choose Arabian Cafe?</h2>

        <div className="why-grid">
          <div className="why-card">
            <h3>Premium Ingredients</h3>
            <p>
              We use fresh, high-quality ingredients for authentic royal taste.
            </p>
          </div>

          <div className="why-card">
            <h3>Fast Service</h3>
            <p>
              Quick preparation and fast delivery with guaranteed freshness.
            </p>
          </div>

          <div className="why-card">
            <h3>Hygienic Kitchen</h3>
            <p>
              Prepared in clean and safe environment with top hygiene standards.
            </p>
          </div>

          <div className="why-card">
            <h3>Royal Experience</h3>
            <p>Not just food — we serve a premium dining experience.</p>
          </div>

          <div className="why-card">
            <h3>Authentic Arabian Taste</h3>
            <p>
              Traditional Arabian spices blended with modern cooking techniques.
            </p>
          </div>

          <div className="why-card">
            <h3>Affordable Luxury</h3>
            <p>Premium quality food experience at pocket-friendly prices.</p>
          </div>
        </div>
      </section>
      {/* CUSTOMER REVIEWS */}
      <section className="reviews-section">
        <h2 className="section-heading">What Our Customers Say</h2>

        <div className="reviews-grid">
          <div className="review-card">
            <p>
              “Best burger in town! The Arabian spices give a completely unique
              taste.”
            </p>
            <h4>– Sadique Nomani.</h4>
            <span>⭐⭐⭐⭐⭐</span>
          </div>

          <div className="review-card">
            <p>
              “Fast delivery and amazing quality. Chicken Lollipop is my
              favorite!”
            </p>
            <h4>– Salem Abdullah.</h4>
            <span>⭐⭐⭐⭐⭐</span>
          </div>

          <div className="review-card">
            <p>“Feels premium yet affordable. Highly recommended!”</p>
            <h4>– Ibrahin K.</h4>
            <span>⭐⭐⭐⭐⭐</span>
          </div>
        </div>
      </section>
      {/* LOCATION & CONTACT */}
      <section className="contact-section">
        <h2 className="section-heading">Visit Arabian Cafe</h2>

        <div className="contact-content">
          <div className="contact-info">
            <h3>📍 Address</h3>
            <p>Beside Madhur Courier, Sikandar Bazar, Ashta</p>

            <h3>📞 Phone</h3>
            <p>7000751243</p>

            <h3>🕒 Opening Hours</h3>
            <p>Everyday: 6 PM – 11 PM</p>
          </div>

          <div className="map-placeholder">
            <iframe
              src="https://www.google.com/maps?q=Arabian+Cafe+Sikandar+Bazar+Ashta&output=embed"
              width="100%"
              height="320"
              style={{ border: 0, borderRadius: "12px" }}
              allowFullScreen=""
              loading="lazy"
              title="Arabian Cafe Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h3>Arabian Cafe</h3>
            <p>The Golden Crisp Experience</p>
          </div>

          <div>
            <h4>Quick Links</h4>

            <p
              onClick={() => {
                setCurrentPage("home");
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                });
              }}
            >
              Home
            </p>

            <p onClick={() => setCurrentPage("menu")}>Menu</p>
            <p onClick={() => setCurrentPage("cart")}>Cart</p>
            <p onClick={() => setCurrentPage("myorders")}>My Orders</p>
          </div>

          <div>
            <h4>Contact</h4>
            <p>7000751243</p>
            <p>Sikandar Bazar, Ashta</p>
          </div>
        </div>

        <div className="footer-bottom">
          © {new Date().getFullYear()} Arabian Cafe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
