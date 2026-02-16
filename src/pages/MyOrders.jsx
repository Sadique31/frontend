import { useEffect, useState } from "react";
import "../styles/myorders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchMyOrders();

    // 🔥 AUTO REFRESH EVERY 10 SEC
    const interval = setInterval(() => {
      fetchMyOrders();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://arabian-cafe-backend.onrender.com/api/orders/myorders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching my orders:", error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>My Orders</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              background: "#1a1a1a",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "8px",
            }}
          >
            <p>Total: ₹{order.totalAmount}</p>

            <p>
              Status:
              <span
                className={`status-badge ${order.status
                  .toLowerCase()
                  .replace(/ /g, "-")}`}
              >
                {order.status}
              </span>
            </p>

            {/* 🔥 ADDED PROGRESS TRACKER (ONLY THIS PART ADDED) */}
            <div className="progress-container">
              {["Pending", "Preparing", "Out for Delivery", "Delivered"].map(
                (step, index) => {
                  const currentIndex = [
                    "Pending",
                    "Preparing",
                    "Out for Delivery",
                    "Delivered",
                  ].indexOf(order.status);

                  return (
                    <div
                      key={index}
                      className={`progress-step ${
                        index <= currentIndex ? "active-step" : ""
                      }`}
                    >
                      {step}
                    </div>
                  );
                },
              )}
            </div>
            {/* 🔥 END ADDITION */}

            <p>
              Time:{" "}
              {new Date(order.createdAt).toLocaleString("en-IN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyOrders;
