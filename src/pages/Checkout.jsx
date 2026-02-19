import { useState, useEffect } from "react";
import "../styles/checkout.css";

function Checkout({ cart, setCurrentPage, setCart }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // ✅ Shop Status
  const [isShopOpen, setIsShopOpen] = useState(true);

  // ==============================
  // 🔥 DELIVERY SYSTEM STATES (ADDED)
  // ==============================
  const [userLat, setUserLat] = useState(null);
  const [userLng, setUserLng] = useState(null);
  const [distance, setDistance] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [isDeliverable, setIsDeliverable] = useState(true);

  // ==============================
  // 🔥 RESTAURANT LOCATION (EDITABLE)
  // ==============================
  const REST_LAT = 23.017087685247965;
  const REST_LNG = 76.72170948571139;

  // ==============================
  // 🔥 CART TOTAL CALCULATION (UPDATED)
  // ==============================
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = cartTotal + deliveryCharge;

  useEffect(() => {
    fetchShopStatus();
  }, []);

  const fetchShopStatus = async () => {
    try {
      const response = await fetch("https://arabian-cafe-backend.onrender.com/api/shop/status");
      const data = await response.json();
      setIsShopOpen(data.isOpen);
    } catch (error) {
      console.error("Error fetching shop status:", error);
      setIsShopOpen(true);
    }
  };

  // ==============================
  // 🔥 DISTANCE CALCULATOR
  // ==============================
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // KM
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // ==============================
  // 🔥 GET CURRENT LOCATION
  // ==============================
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setUserLat(lat);
        setUserLng(lng);

        const dist = calculateDistance(REST_LAT, REST_LNG, lat, lng);
        setDistance(dist);

        // ==========================================
        // 🔥 DELIVERY RULES (EDIT HERE IF CLIENT CHANGES)
        /*
           0 - 4km  → FREE
           4 - 6km  → ₹10
           6+ km    → REJECT
        */
        // ==========================================

        if (dist <= 1) {
          setDeliveryCharge(0);
          setIsDeliverable(true);
        } else if (dist > 1 && dist <= 3) {
          setDeliveryCharge(10);
          setIsDeliverable(true);
          } else if (dist > 3 && dist <= 5) {
          setDeliveryCharge(15);
          setIsDeliverable(true);
        } else {
          setDeliveryCharge(0);
          setIsDeliverable(false);
        }

        // Auto fill Google Maps link into address
        setAddress(
          `https://www.google.com/maps?q=${lat},${lng}`
        );
      },
      () => {
        alert("Location permission denied");
      }
    );
  };

const handlePayment = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) { alert("Please login first"); return; }

    if (!name || !phone || !address) {
      alert("Please fill all details and select location");
      return;
    }

    // ✅ Step 1: Key fetch karo backend se
    const configRes = await fetch("https://arabian-cafe-backend.onrender.com/api/payment/config", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { key } = await configRes.json();

    // ✅ Step 2: Items bhejo, amount nahi
    const paymentResponse = await fetch(
      "https://arabian-cafe-backend.onrender.com/api/payment/create-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ 
          items: cart.map(item => ({ _id: item._id, quantity: item.quantity })),
          deliveryCharge: deliveryCharge 
        }),
      }
    );

    const paymentData = await paymentResponse.json();
    if (!paymentResponse.ok) throw new Error(paymentData.message || "Payment creation failed");

    const options = {
      key: key,  // ✅ Backend se aaya
      amount: paymentData.amount,
      currency: paymentData.currency,
      name: "Arabian Cafe",
      description: "Food Order Payment",
      order_id: paymentData.id,

      handler: async function (response) {
        const verifyResponse = await fetch(
          "https://arabian-cafe-backend.onrender.com/api/payment/verify-payment",
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderDetails: {
                items: cart,
                totalAmount: paymentData.amount / 100, // Backend verified amount
                customerName: name,
                phone: phone,
                address: address,
                customerLocation: userLat ? { lat: userLat, lng: userLng } : null,
                distance: distance,
                deliveryCharge: deliveryCharge,
                userId: JSON.parse(atob(token.split(".")[1])).id,
                paymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                paymentStatus: "Paid",
              },
            }),
          }
        );

        if (!verifyResponse.ok) { alert("Payment verification failed"); return; }
        setCart([]);
        setCurrentPage("success");
      },
      theme: { color: "#D4AF37" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (error) {
    console.error("Payment Error:", error);
    alert(error.message || "Payment failed");
  }
};
  return (
    <div className="checkout-container">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-content">
        <div className="address-section">
          <h3>Delivery Address</h3>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Current Location will auto fill"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            type="button"
            onClick={getCurrentLocation}
            className="pay-btn"
            style={{ marginTop: "10px" }}
          >
            Use Current Location
          </button>

          {distance > 0 && (
            <p>Distance: {distance.toFixed(2)} km</p>
          )}
        </div>

        <div className="summary-section">
          <h3>Order Summary</h3>

          {cart.map((item, index) => (
            <div key={index} className="summary-item">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          {deliveryCharge > 0 && (
            <p>Delivery Charge: ₹{deliveryCharge}</p>
          )}

          {!isDeliverable && (
            <p style={{ color: "red" }}>
              Delivery not available beyond 6km
            </p>
          )}

          <h4>Total: ₹{total}</h4>

          {!isShopOpen && (
            <p style={{ color: "red", marginBottom: "10px" }}>
              Shop is currently closed.
            </p>
          )}

          <button
            className="pay-btn"
            onClick={handlePayment}
            disabled={!isShopOpen || !isDeliverable}
            style={
              !isShopOpen || !isDeliverable
                ? { opacity: 0.6, cursor: "not-allowed" }
                : {}
            }
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
