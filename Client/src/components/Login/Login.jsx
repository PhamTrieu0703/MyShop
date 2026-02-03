import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import "./Login.css"

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth() // ⭐ QUAN TRỌNG

  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!username || !password) {
      setError("Vui lòng nhập đầy đủ thông tin")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.message || "Đăng nhập thất bại")
        return
      }

      //  CẬP NHẬT CONTEXT (KHÔNG CHỈ localStorage)
      login(data.user)

      //  Header đổi NGAY lập tức
      localStorage.setItem('user', JSON.stringify(data))
      navigate("/home")
    } catch (err) {
      console.error(err)
      setError("Không kết nối được server")
    } finally {
      setLoading(false)
    }
  }
  

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Admin Login</h2>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tên đăng nhập</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <p>
            Chưa có tài khoản?{" "}
            <a href="http://localhost:5173/register">Đăng ký</a>
          </p>

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
