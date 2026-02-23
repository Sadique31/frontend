import { useState } from "react";
import "../styles/navbar.css";

function Navbar({ cartCount, setCurrentPage }) {

  const [menuOpen, setMenuOpen] = useState(false);

  const token = localStorage.getItem("token");
  let isAdmin = false;
  let isLoggedIn = false;

  if (token) {
    isLoggedIn = true;
    try {
      const decoded = JSON.parse(atob(token.split(".")[1]));
      if (decoded.role === "admin") {
        isAdmin = true;
      }
    } catch (error) {
      isAdmin = false;
    }
  }

  // ✅ NEW SAFE FUNCTION
  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMenuOpen(false); // 🔥 close hamburger after click
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => handleNavigation("home")}>
        Arabian Cafe
        <span>The Golden Crisp</span>
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>

      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li onClick={() => handleNavigation("home")}>Home</li>
        <li onClick={() => handleNavigation("menu")}>Menu</li>
        <li onClick={() => handleNavigation("cart")}>
          Cart ({cartCount})
        </li>

        {isLoggedIn && (
          <li onClick={() => handleNavigation("myorders")}>
            My Orders
          </li>
        )}

        {isAdmin && (
          <>
            <li onClick={() => handleNavigation("admin")}>
              Admin
            </li>
            <li onClick={() => handleNavigation("inventory")}>
              Inventory
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
