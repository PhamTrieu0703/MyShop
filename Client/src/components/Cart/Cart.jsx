import { useEffect, useState } from "react";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?._id;

  /* ================= FETCH CART ================= */

  useEffect(() => {
    if (!userId) {
      setError("Chưa đăng nhập");
      setLoading(false);
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(`http://localhost:8000/carts/${userId}`);
        if (!res.ok) throw new Error("Không lấy được giỏ hàng");
        const data = await res.json();
        setCart(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [userId]);

  /* ================= CART ACTIONS ================= */

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    await fetch(`http://localhost:8000/carts/${userId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity })
    });

    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.productId?._id === productId
          ? { ...item, quantity }
          : item
      )
    }));
  };

  const removeItem = async (productId) => {
    await fetch(`http://localhost:8000/carts/${userId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId })
    });

    setCart(prev => ({
      ...prev,
      items: prev.items.filter(
        item => item.productId?._id !== productId
      )
    }));
  };

  /* ================= CHECKOUT ================= */

  const handleCheckout = async () => {
    if (!cart || cart.items.length === 0) {
      alert("Giỏ hàng trống");
      return;
    }

    // ✅ lọc item lỗi (productId = null)
    const validItems = cart.items.filter(item => item.productId);

    if (validItems.length === 0) {
      alert("Sản phẩm trong giỏ không còn tồn tại");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/orders/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            items: validItems.map(item => ({
              productId: item.productId._id,
              name: item.productId.name,
              price: item.productId.price,
              quantity: item.quantity, // ✅ FIX QUAN TRỌNG
              image: item.productId.image
            })),
            totalAmount: totalPrice,
            paymentMethod
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Đặt hàng thất bại");
        return;
      }

      alert("🎉 Đặt hàng thành công!");
      setCart({ ...cart, items: [] });

    } catch (error) {
      console.error("Checkout error:", error);
      alert("Lỗi khi đặt hàng");
    }
  };

  /* ================= UI ================= */

  if (loading) return <p>Đang tải giỏ hàng...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!cart || cart.items.length === 0) return <p>Giỏ hàng trống</p>;

  const totalPrice = cart.items.reduce(
    (sum, item) =>
      item.productId
        ? sum + item.productId.price * item.quantity
        : sum,
    0
  );

  return (
    <div className="cart-page">
      <h1>🛒 Giỏ hàng</h1>

      <div className="cart-list">
        {cart.items
          .filter(item => item.productId)
          .map(item => {
            const product = item.productId;

            return (
              <div className="cart-item" key={product._id}>
                <img src={product.image} alt={product.name} />

                <div className="cart-info">
                  <h3>{product.name}</h3>
                  <p>{product.price.toLocaleString()} đ</p>
                </div>

                <div className="cart-qty">
                  <button
                    className="cart-qty-btn"
                    onClick={() =>
                      updateQuantity(product._id, item.quantity - 1)
                    }
                  >
                    −
                  </button>

                  <span className="soluong">{item.quantity}</span>

                  <button
                    className="cart-qty-btn"
                    onClick={() =>
                      updateQuantity(product._id, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div className="cart-total">
                  {(product.price * item.quantity).toLocaleString()} đ
                </div>

                <button
                  className="cart-remove"
                  onClick={() => removeItem(product._id)}
                >
                  ✕
                </button>
              </div>
            );
          })}
      </div>

      {/* ===== PAYMENT ===== */}
      <div className="payment-box">
        <h2>Phương thức thanh toán</h2>

        <label>
          <input
            type="radio"
            value="cod"
            checked={paymentMethod === "cod"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Thanh toán khi nhận hàng (COD)
        </label>

        <label>
          <input
            type="radio"
            value="bank"
            checked={paymentMethod === "bank"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Chuyển khoản ngân hàng
        </label>

        <label>
          <input
            type="radio"
            value="momo"
            checked={paymentMethod === "momo"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Ví điện tử (Momo / ZaloPay)
        </label>

        <label>
          <input
            type="radio"
            value="card"
            checked={paymentMethod === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          Thẻ ATM / Visa / MasterCard
        </label>
      </div>

      {/* ===== SUMMARY ===== */}
      <div className="cart-summary">
        <h2>Tổng cộng</h2>
        <p>{totalPrice.toLocaleString()} đ</p>
        <button className="checkout-btn" onClick={handleCheckout}>
          Đặt hàng
        </button>
      </div>
    </div>
  );
}

export default Cart;
