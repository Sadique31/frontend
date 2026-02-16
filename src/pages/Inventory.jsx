import { useEffect, useState } from "react";
import "../styles/inventory.css";

function Inventory({ setCurrentPage }) {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ FIXED: Only ONE useEffect
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCurrentPage("login");
      return;
    }

    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));

      if (decoded.role !== "admin") {
        setCurrentPage("home");
        return;
      }

      fetchProducts(); // existing function
    } catch (error) {
      setCurrentPage("login");
    }
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("https://arabian-cafe-backend.onrender.com/api/products");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const toggleStock = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`https://arabian-cafe-backend.onrender.com/api/products/${id}/stock`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inStock: newStatus }),
      });

      fetchProducts();
    } catch (error) {
      console.error("Error updating stock:", error);
    }
  };

  // 🔎 Filter Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category)),
  ];

  return (
    <div className="inventory-container">
      <h2 className="inventory-title">Inventory Management</h2>

      {/* 🔥 TOP CONTROL BAR */}
      <div className="inventory-controls">
        <input
          type="text"
          placeholder="Search product..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* TABLE */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredProducts.map((product) => (
            <tr key={product._id}>
             <td data-label="Product">{product.name}</td>
<td data-label="Category">{product.category}</td>
<td data-label="Price">₹{product.price}</td>
<td data-label="Status">
                <span
                  className={
                    product.inStock ? "status-yes" : "status-no"
                  }
                >
                  {product.inStock
                    ? "In Stock"
                    : "Out of Stock"}
                </span>
              </td>

              <td data-label="Action">
                <button
                  className={
                    product.inStock
                      ? "stock-btn out-stock"
                      : "stock-btn in-stock"
                  }
                  onClick={() =>
                    toggleStock(product._id, !product.inStock)
                  }
                >
                  {product.inStock
                    ? "Mark Out"
                    : "Mark In"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
