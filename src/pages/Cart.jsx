import "../styles/cart.css";

function Cart({ cart, setCart, setCurrentPage }) {
  const increaseQty = (index) => {
    const updatedCart = cart.map((item, i) =>
      i === index ? { ...item, quantity: item.quantity + 1 } : item,
    );
    setCart(updatedCart);
  };

  const decreaseQty = (index) => {
    const updatedCart = cart
      .map((item, i) =>
        i === index ? { ...item, quantity: item.quantity - 1 } : item,
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map((item, index) => (
            <div key={index} className="cart-item">
              <span>{item.name}</span>

              <div className="qty-container">
                <button className="qty-btn" onClick={() => decreaseQty(index)}>
                  −
                </button>

                <span className="qty-number">{item.quantity}</span>

                <button className="qty-btn" onClick={() => increaseQty(index)}>
                  +
                </button>
              </div>

              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}

          <h3 className="cart-total">Total: ₹{total}</h3>
          <button
            onClick={() => {
              const token = localStorage.getItem("token");

              if (!token) {
                setCurrentPage("login");
              } else {
                setCurrentPage("checkout");
              }
            }}
          >
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;
