import { useEffect, useState } from "react";
import "../styles/orderHistory.css";

function OrderHistory({ setCurrentPage }) {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://arabian-cafe-backend.onrender.com/api/orders/history",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.customerName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    order._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Order History</h2>

        <button
          className="back-btn"
          onClick={() => setCurrentPage("admin")}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="history-search">
        <input
          type="text"
          placeholder="Search by ID or Customer..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Payment</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{order.customerName}</td>
              <td>₹{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>{order.paymentStatus || "N/A"}</td>
              <td>
                {new Date(order.createdAt).toLocaleString("en-IN", {
                  hour12: true,
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrderHistory;
