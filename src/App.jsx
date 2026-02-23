import { useState, useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import Signup from "./pages/Signup";
import Menu from "./pages/Menu";
import Inventory from "./pages/Inventory";
import OrderHistory from "./pages/OrderHistory";

function App() {
  const [cart, setCart] = useState([]);
  const [currentPage, setCurrentPage] = useState(
    localStorage.getItem("currentPage") || "home",
  );
  const previousPageRef = useRef(currentPage);

  useEffect(() => {
    if (previousPageRef.current !== currentPage) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      previousPageRef.current = currentPage;
    }
  }, [currentPage]);

  // ✅ UPDATED: localStorage bhi update hoga page change pe
  const handlePageChange = (page) => {
    setCurrentPage(page);
    localStorage.setItem("currentPage", page);
  };

  const addToCart = (item) => {
    const existingItem = cart.find((i) => i.name === item.name);

    if (existingItem) {
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
    <div>
      {/* ✅ UPDATED: handlePageChange pass kiya */}
      <Navbar cartCount={cart.length} setCurrentPage={handlePageChange} />

      {currentPage === "home" && (
        <Home cart={cart} setCart={setCart} setCurrentPage={handlePageChange} />
      )}

      {currentPage === "cart" && (
        <Cart cart={cart} setCart={setCart} setCurrentPage={handlePageChange} />
      )}

      {currentPage === "checkout" && (
        <Checkout
          cart={cart}
          setCurrentPage={handlePageChange}
          setCart={setCart}
        />
      )}

      {currentPage === "success" && <OrderSuccess />}

      {currentPage === "admin" && <Admin setCurrentPage={handlePageChange} />}

      {currentPage === "login" && <Login setCurrentPage={handlePageChange} />}

      {currentPage === "myorders" && <MyOrders />}

      {currentPage === "signup" && <Signup setCurrentPage={handlePageChange} />}

      {currentPage === "menu" && <Menu addToCart={addToCart} />}

      {currentPage === "inventory" && (
        <Inventory setCurrentPage={handlePageChange} />
      )}

      {currentPage === "history" && (
        <OrderHistory setCurrentPage={handlePageChange} />
      )}
    </div>
  );
}

export default App;
