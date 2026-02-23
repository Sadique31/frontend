import { useEffect, useState } from "react";
import "../styles/admin.css";
import { io } from "socket.io-client";

// ✅ CHANGE 1: apiFetch import kiya — ye auto token refresh karta hai
import { apiFetch } from "../utils/api";

function Admin({ setCurrentPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shopOpen, setShopOpen] = useState(true);

  // 🔊 SOUND FUNCTION — koi change nahi
  const playSound = () => {
    const audio = document.getElementById("orderSound");
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  // koi change nahi
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

      fetchOrders();
      fetchShopStatus();

      const socket = io("https://arabian-cafe-backend.onrender.com", {
        transports: ["websocket"],
      });

      socket.on("connect", () => {
        console.log("Socket Connected:", socket.id);
      });

      socket.on("newOrder", () => {
        fetchOrders();
        playSound();
      });

      return () => socket.disconnect();
    } catch (error) {
      setCurrentPage("login");
    }
  }, []);

  const fetchOrders = async () => {
    try {
      // ✅ CHANGE 2: fetch → apiFetch
      // Pehle: const response = await fetch("https://arabian-cafe-backend.onrender.com/api/orders", { headers: { Authorization: `Bearer ${token}` } });
      // Ab: apiFetch automatically token handle karta hai, expire ho toh refresh karta hai
      const response = await apiFetch("/api/orders");

      if (!response) return; // token expire aur refresh bhi fail — auto logout ho gaya
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
      setLoading(false);
    }
  };

  const fetchShopStatus = async () => {
    try {
      // koi change nahi — ye public route hai, token ki zaroorat nahi
      const response = await fetch(
        "https://arabian-cafe-backend.onrender.com/api/shop/status",
      );
      const data = await response.json();
      setShopOpen(data.isOpen);
    } catch (error) {
      console.error("Error fetching shop status:", error);
    }
  };

  const toggleShopStatus = async () => {
    try {
      // ✅ CHANGE 3: fetch → apiFetch
      // Pehle: await fetch("...api/shop/status", { method: "PUT", headers: { Authorization... }, body: ... })
      // Ab: apiFetch automatically token aur Content-Type handle karta hai
      const response = await apiFetch("/api/shop/status", {
        method: "PUT",
        body: JSON.stringify({ isOpen: !shopOpen }),
      });

      if (!response) return; // token expire aur refresh bhi fail — auto logout ho gaya
      const data = await response.json();
      setShopOpen(data.isOpen);
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      // ✅ CHANGE 4: fetch → apiFetch
      // Pehle: await fetch(`...api/orders/${id}`, { method: "PUT", headers: { Authorization... }, body: ... })
      // Ab: apiFetch automatically token aur Content-Type handle karta hai
      await apiFetch(`/api/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      // WhatsApp delivery message — koi change nahi
      if (newStatus === "Out for Delivery") {
        const order = orders.find((o) => o._id === id);

        if (order) {
          const mapLink = order.customerLocation
            ? `https://www.google.com/maps?q=${order.customerLocation.lat},${order.customerLocation.lng}`
            : order.address;

          const message = `
🚚 *New Delivery Order*

🧾 Order ID: #${order._id.slice(-6)}
👤 Customer: ${order.customerName}
📞 Phone: ${order.phone}
💰 Amount: ₹${order.totalAmount}
💳 Payment: ${order.paymentStatus || "Pending"}

📍 Location:
${mapLink}

🛒 Items:
${order.items.map((item) => `• ${item.name} x ${item.quantity}`).join("\n")}
          `;

          const encodedMessage = encodeURIComponent(message);
          const deliveryNumber = "917728885840";

          window.open(
            `https://wa.me/${deliveryNumber}?text=${encodedMessage}`,
            "_blank",
          );
        }
      }

      fetchOrders();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Baaki sab koi change nahi — same as before
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + order.totalAmount,
    0,
  );

  const today = new Date().toDateString();

  const todayRevenue = orders
    .filter((order) => new Date(order.createdAt).toDateString() === today)
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const deliveredCount = orders.filter(
    (order) => order.status === "Delivered",
  ).length;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>

        <button
          className="history-btn"
          onClick={() => setCurrentPage("history")}
        >
          View History
        </button>

        <button
          className="logout-btn"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken"); // ✅ Logout pe refreshToken bhi remove
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      <div className="shop-control-bar">
        <div className="shop-status-info">
          <span className="shop-text">Shop Status:</span>
          <span className={shopOpen ? "status-open" : "status-closed"}>
            {shopOpen ? "OPEN" : "CLOSED"}
          </span>
        </div>

        <button
          className={shopOpen ? "close-btn" : "open-btn"}
          onClick={toggleShopStatus}
        >
          {shopOpen ? "Close Shop" : "Open Shop"}
        </button>
      </div>

      <div className="stats-row">
        <div className="card">
          <h3>Total Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="card">
          <h3>Total Revenue</h3>
          <p>₹{totalRevenue}</p>
        </div>

        <div className="card">
          <h3>Today's Revenue</h3>
          <p>₹{todayRevenue}</p>
        </div>

        <div className="card">
          <h3>Delivered Orders</h3>
          <p>{deliveredCount}</p>
        </div>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.filter(
          (order) => new Date(order.createdAt).toDateString() === today,
        ).length === 0 ? (
        <p>No orders today</p>
      ) : (
        <div className="orders-grid">
          {orders
            .filter(
              (order) => new Date(order.createdAt).toDateString() === today,
            )
            .map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-top">
                  <span className="order-id">#{order._id.slice(-6)}</span>
                  <span className="order-time">
                    {new Date(order.createdAt).toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="order-main">
                  <h3>{order.customerName}</h3>
                  <p>📞 {order.phone}</p>
                  <p>📍 {order.address}</p>
                </div>

                <div className="order-payment">
                  <span className="order-total">₹{order.totalAmount}</span>
                  <span className="payment-status">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                <div className="order-status-section">
                  <select
                    className={`status-select ${
                      order.status === "Preparing"
                        ? "status-preparing"
                        : order.status === "Out for Delivery"
                          ? "status-out"
                          : order.status === "Delivered"
                            ? "status-delivered"
                            : "status-pending"
                    }`}
                    value={order.status || "Pending"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Preparing">Preparing</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div key={index}>
                      • {item.name} × {item.quantity}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* 🔊 Hidden Audio Element */}
      <audio id="orderSound" src="/notification.mp3" preload="auto"></audio>
    </div>
  );
}

export default Admin;
