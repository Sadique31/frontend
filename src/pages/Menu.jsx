import { useState, useEffect } from "react";
import "../styles/menu.css";

function Menu({ addToCart }) {

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [menuData, setMenuData] = useState([]); // ✅ ADDED (DB data)

  // ✅ ADDED (Fetch from backend)
  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const response = await fetch("https://arabian-cafe-backend.onrender.com/api/products");
      const data = await response.json();
      setMenuData(data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  // ✅ SAME LOGIC (just adjusted for DB structure)
  const categories = ["All", ...new Set(menuData.map(cat => cat.category))];

  const filteredData =
    selectedCategory === "All"
      ? menuData
      : menuData.filter(cat => cat.category === selectedCategory);

  return (
    <div className="menu-page">

      <h1 className="menu-title">Our Royal Menu</h1>

      {/* CATEGORY FILTER */}
      <div className="category-buttons">
        {categories.map((cat, index) => (
          <button
            key={index}
            className={selectedCategory === cat ? "active" : ""}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU ITEMS */}
      <div className="menu-grid">
        {filteredData.map((item, i) => (
          <div key={i} className="menu-card">

            <h3>{item.name}</h3>
            <p className="price">₹{item.price}</p>

            {item.inStock ? (
              <button
                className="add-btn"
                onClick={() => addToCart(item)}
              >
                Add to Cart
              </button>
            ) : (
              <button
                className="add-btn"
                disabled
              >
                Out of Stock
              </button>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}

export default Menu;
