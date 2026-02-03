import { useEffect, useState } from "react";
import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const stored = JSON.parse(localStorage.getItem("user"));
  const userId = stored?.user?._id;
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/orders/${userId}`)
      .then(res => {
        if (!res.ok) throw new Error("Không lấy được đơn hàng");
        return res.json();
      })
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <p>Đang tải đơn hàng...</p>;
  if (orders.length === 0) return <p>Chưa có đơn hàng</p>;

  return (
    <div className="orders-page">
      <h1>📦 Đơn hàng của tôi</h1>

      {orders.map(order => (
        <div className="order-card" key={order._id}>
          {/* HEADER */}
          <div className="order-header">
            <span>Mã đơn: {order._id}</span>
            <span className={`status ${order.status}`}>
              {order.status}
            </span>
          </div>

          {/* THÔNG TIN KHÁCH HÀNG */}
          <div className="order-customer">
            <p>
              <strong>Họ tên:</strong>{" "}
              {stored.user.phone || "Không có"}
            </p>
            <p>
              <strong>SĐT:</strong>{" "}
              {stored.user.fullName|| "Không có"}
            </p>
            <p>
              <strong>Địa chỉ:</strong>{" "}
              {stored.user.address || "Không có"}
            </p>
          </div>

          {/* DANH SÁCH SẢN PHẨM */}
          {order.items.map(item => (
            <div className="order-item" key={item.productId}>
              <img src={item.image} alt={item.name} />
              <div>
                <h4>{item.name}</h4>
                <p>
                  {item.price.toLocaleString()} đ × {item.quantity}
                </p>
              </div>
            </div>
          ))}

          {/* FOOTER */}
          <div className="order-footer">
            <strong>
              Tổng tiền: {order.totalAmount.toLocaleString()} đ
            </strong>
            <p>Thanh toán: {order.paymentMethod}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Orders;
