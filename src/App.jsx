import { useState } from "react";
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
import { useEffect } from "react";
import { useRef } from "react";
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

  // 🔥 ADD THIS FUNCTION
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
      <Navbar cartCount={cart.length} setCurrentPage={setCurrentPage} />

      {currentPage === "home" && (
        <Home cart={cart} setCart={setCart} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === "cart" && (
        <Cart cart={cart} setCart={setCart} setCurrentPage={setCurrentPage} />
      )}

      {currentPage === "checkout" && (
        <Checkout
          cart={cart}
          setCurrentPage={setCurrentPage}
          setCart={setCart}
        />
      )}

      {currentPage === "success" && <OrderSuccess />}

      {currentPage === "admin" && <Admin setCurrentPage={setCurrentPage} />}

      {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}

      {currentPage === "myorders" && <MyOrders />}

      {currentPage === "signup" && <Signup setCurrentPage={setCurrentPage} />}

      {/* 🔥 FIXED MENU */}
      {currentPage === "menu" && <Menu addToCart={addToCart} />}
      {currentPage === "inventory" && (
        <Inventory setCurrentPage={setCurrentPage} />
      )}
      {currentPage === "history" && (
  <OrderHistory setCurrentPage={setCurrentPage} />
)}



    </div>
  );
}

export default App;
