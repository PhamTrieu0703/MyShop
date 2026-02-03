import { useEffect, useState } from "react"
import "./ManageOrders.css"

function ManageOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)



   const user = JSON.parse(localStorage.getItem('user'))
  const role = user?.user?.role

  if (role !== 'admin') {
    return <h2 style={{ padding: 20 }}>⛔ Bạn không có quyền admin</h2>
  }
  // =========================
  // GET ALL ORDERS
  // =========================
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/orders")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Fetch orders error:", error)
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
    try {
      await fetch(`http://localhost:8000/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      })

      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, status } : order
        )
      )
    } catch (error) {
      console.error("Update status error:", error)
    }
  }

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder = async (id) => {
    const confirmDelete = window.confirm("Bạn có chắc muốn xóa đơn hàng này?")
    if (!confirmDelete) return

    try {
      await fetch(`http://localhost:8000/orders/${id}`, {
        method: "DELETE"
      })

      setOrders(prev => prev.filter(order => order._id !== id))
    } catch (error) {
      console.error("Delete order error:", error)
    }
  }

  if (loading) return <p>Đang tải đơn hàng...</p>

  return (
    <div className="manage-orders">
      <h1>Quản lý đơn hàng</h1>

      <table>
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              {/* USER */}
              <td>
                <strong>{order.userId?.fullName || order.userId?.username}</strong>
                <br />
                <small>{order.userId?.email}</small>
              </td>

              {/* ITEMS */}
              <td>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p>{item.name}</p>
                      <small>
                        {item.price?.toLocaleString("vi-VN")}₫ × {item.quantity}
                      </small>
                    </div>
                  </div>
                ))}
              </td>

              {/* TOTAL */}
              <td>
                {(order.totalAmount ?? 0).toLocaleString("vi-VN")}₫
              </td>

              {/* PAYMENT */}
              <td>{order.paymentMethod}</td>

              {/* STATUS */}
              <td>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order._id, e.target.value)
                  }
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="completed">Hoàn thành</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </td>

              {/* DATE */}
              <td>
                {new Date(order.createdAt).toLocaleDateString("vi-VN")}
              </td>

              {/* ACTION */}
              <td>
                <button
                  className="btn-delete"
                  onClick={() => deleteOrder(order._id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageOrders
