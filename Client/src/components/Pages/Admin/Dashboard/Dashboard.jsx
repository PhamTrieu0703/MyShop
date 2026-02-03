import { useEffect, useState } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js"
import { Bar } from "react-chartjs-2"
import "./Dashboard.css"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

function Dashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState("day") // day | month | year


   const user = JSON.parse(localStorage.getItem('user'))
  const role = user?.user?.role

  if (role !== 'admin') {
    return <h2 style={{ padding: 20 }}>⛔ Bạn không có quyền admin</h2>
  }
  
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:8000/orders")
      const data = await res.json()
      setOrders(data)
    } catch (error) {
      console.error("Fetch dashboard error:", error)
    } finally {
      setLoading(false)
    }
  }

  /* ================= SUMMARY ================= */
  const totalOrders = orders.length

  const totalRevenue = orders.reduce(
    (sum, order) =>
      order.status === "completed"
        ? sum + (order.totalAmount || 0)
        : sum,
    0
  )

  const completedOrders = orders.filter(o => o.status === "completed").length
  const pendingOrders = orders.filter(o => o.status === "pending").length
  const cancelledOrders = orders.filter(o => o.status === "cancelled").length

  const latestOrders = orders.slice(0, 5)

  /* ================= CHART DATA ================= */
  const revenueMap = {}

  orders.forEach(order => {
    if (order.status !== "completed") return

    const date = new Date(order.createdAt)
    let key = ""

    if (chartType === "day") {
      key = date.toLocaleDateString("vi-VN")
    }

    if (chartType === "month") {
      key = `${date.getMonth() + 1}/${date.getFullYear()}`
    }

    if (chartType === "year") {
      key = date.getFullYear()
    }

    revenueMap[key] = (revenueMap[key] || 0) + order.totalAmount
  })

  const chartData = {
    labels: Object.keys(revenueMap),
    datasets: [
      {
        label: "Doanh thu (₫)",
        data: Object.values(revenueMap),
      }
    ]
  }

  if (loading) return <p>Đang tải dashboard...</p>

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>

      {/* SUMMARY */}
      <div className="dashboard-cards">
        <div className="card revenue">
          <h3>Tổng doanh thu</h3>
          <p>{totalRevenue.toLocaleString("vi-VN")}₫</p>
        </div>

        <div className="card orders">
          <h3>Tổng đơn hàng</h3>
          <p>{totalOrders}</p>
        </div>

        <div className="card completed">
          <h3>Hoàn thành</h3>
          <p>{completedOrders}</p>
        </div>

        <div className="card pending">
          <h3>Chờ xử lý</h3>
          <p>{pendingOrders}</p>
        </div>

        <div className="card cancelled">
          <h3>Đã huỷ</h3>
          <p>{cancelledOrders}</p>
        </div>
      </div>

      {/* ===== CHART ===== */}
      <div className="chart-section">
        <h2>📈 Biểu đồ doanh thu</h2>

        <div className="chart-filter">
          <button onClick={() => setChartType("day")}>Theo ngày</button>
          <button onClick={() => setChartType("month")}>Theo tháng</button>
          <button onClick={() => setChartType("year")}>Theo năm</button>
        </div>

        <Bar data={chartData} />
      </div>

      {/* ===== LATEST ORDERS ===== */}
      <h2>🧾 Đơn hàng mới nhất</h2>

      <table>
        <thead>
          <tr>
            <th>Khách hàng</th>
            <th>Tổng tiền</th>
            <th>Thanh toán</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
          </tr>
        </thead>
        <tbody>
          {latestOrders.map(order => (
            <tr key={order._id}>
              <td>{order.userId?.fullName || order.userId?.username}</td>
              <td>{(order.totalAmount ?? 0).toLocaleString("vi-VN")}₫</td>
              <td>{order.paymentMethod}</td>
              <td>
                <span className={`status ${order.status}`}>
                  {order.status}
                </span>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString("vi-VN")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Dashboard
