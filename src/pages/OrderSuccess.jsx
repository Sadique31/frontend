import "../styles/orderSuccess.css";

function OrderSuccess() {
  return (
    <div className="success-container">
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Your delicious food is being prepared.</p>
      <button onClick={() => window.location.reload()}>
        Go Back to Home
      </button>
    </div>
  );
}

export default OrderSuccess;
