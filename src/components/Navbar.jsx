import { useState, useEffect } from "react";
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

  // ✅ Body scroll band karo jab menu khula ho
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo" onClick={() => handleNavigation("home")}>
          Arabian Cafe
          <span>The Golden Crisp</span>
        </div>

        {/* ✅ Hamburger icon — ☰ se × banta hai */}
        <div
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* ✅ Nav links */}
        <ul className={`nav-links ${menuOpen ? "active" : ""}`}>

          {/* ✅ Close button — sirf mobile pe dikhega */}
          <li className="close-btn" onClick={() => setMenuOpen(false)}>✕</li>

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

      {/* ✅ Overlay — menu ke peeche dark background */}
      {menuOpen && (
        <div
          className="nav-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  );
}

export default Navbar;