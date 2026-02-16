import { useEffect, useState } from "react";
import "../styles/admin.css";

function Admin({ setCurrentPage }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===============================
  // 🔥 SHOP STATUS STATE (ADDED)
  // ===============================
  const [shopOpen, setShopOpen] = useState(true);

  // 🔐 Admin Guard + Fetch Orders
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
    } catch (error) {
      setCurrentPage("login");
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://arabian-cafe-backend.onrender.com/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setOrders([]);
        setLoading(false);
        return;
      }

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
      const response = await fetch("https://arabian-cafe-backend.onrender.com/api/shop/status");
      const data = await response.json();
      setShopOpen(data.isOpen);
    } catch (error) {
      console.error("Error fetching shop status:", error);
    }
  };

  const toggleShopStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("https://arabian-cafe-backend.onrender.com/api/shop/status", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isOpen: !shopOpen }),
      });

      const data = await response.json();
      setShopOpen(data.isOpen);
    } catch (error) {
      console.error("Error updating shop status:", error);
    }
  };
  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`https://arabian-cafe-backend.onrender.com/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      // 🔥 NEW: WhatsApp Auto Message when Out for Delivery
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

          // 👉 Replace with Delivery Boy Number (with country code)
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

        {/* 🔥 HISTORY BUTTON (ONLY THIS ADDED) */}
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
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>

      {/* 🔥 COMPACT SHOP CONTROL BAR */}
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
                    {new Date(order.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </span>
                </div>

                <div className="order-main">
                  <h3>{order.customerName}</h3>
                  <p>📞 {order.phone}</p>
                  <p>📍 {order.address}</p>
                  {/* 🔥 DELIVERY INFO (SAFE ADDITION) */}
                  {order.distance !== undefined && (
                    <div className="delivery-info">
                      <p>📏 Distance: {order.distance.toFixed(2)} km</p>
                      <p>🚚 Delivery Charge: ₹{order.deliveryCharge || 0}</p>
                    </div>
                  )}
                </div>

                <div className="order-payment">
                  <span className="order-total">₹{order.totalAmount}</span>
                  <span className="payment-status">
                    {order.paymentStatus || "Pending"}
                  </span>
                </div>

                <div className="order-status-section">
                  <label>Status:</label>
                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Pending">🟡 Pending</option>
                    <option value="Preparing">🔵 Preparing</option>
                    <option value="Out for Delivery">
                      🟣 Out for Delivery
                    </option>
                    <option value="Delivered">🟢 Delivered</option>
                  </select>
                </div>

                <div className="order-items">
                  <strong>Items:</strong>
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
    </div>
  );
}

export default Admin;
