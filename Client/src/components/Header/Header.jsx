import { Link, useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "../../context/AuthContext"
import "./Header.css"

function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [showMenu, setShowMenu] = useState(false)
  const [keyword, setKeyword] = useState("")
  const menuRef = useRef(null)

  const stored = JSON.parse(localStorage.getItem("user"))

  /* ===== CLOSE USER MENU WHEN CLICK OUTSIDE ===== */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  /* ===== HANDLE SEARCH ===== */
  const handleSearch = (e) => {
    e.preventDefault()

    if (!keyword.trim()) return

    navigate(`/products?search=${encodeURIComponent(keyword)}`)
    setKeyword("")
  }

  return (
    <header className="header">
      <div className="header-container">

        {/* LOGO */}
        <div className="logo">
          <Link to="/home">HaiAStore</Link>
        </div>

        {/* NAV */}
        <nav className="nav">
          <Link to="/home">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/contact">Liên hệ</Link>
        </nav>

        {/* SEARCH */}
        <form className="search-box" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </form>

        {/* ACTIONS */}
        <div className="actions">

          {/* CART */}
          <Link
            to={user ? `/cart/${user._id}` : "/login"}
            className="cart-header"
          >
            🛒
          </Link>

          {/* AUTH */}
          {!user ? (
            <Link to="/login" className="login">
              Đăng nhập
            </Link>
          ) : (
            <div
              className="user-box"
              ref={menuRef}
              onClick={() => setShowMenu(!showMenu)}
            >
              <span className="username">👤 {user.name}</span>

              {showMenu && (
                <div className="user-dropdown">

                  <div
                    onClick={() => {
                      navigate(`/profile/${user._id}`)
                      setShowMenu(false)
                    }}
                  >
                    Quản lý tài khoản
                  </div>

                  <div
                    onClick={() => {
                      navigate(`/orders/${user._id}`)
                      setShowMenu(false)
                    }}
                  >
                    Đơn hàng
                  </div>

                  {stored?.user?.role === "admin" && (
                    <div
                      className="admin-link"
                      onClick={() => {
                        navigate("/admin")
                        setShowMenu(false)
                      }}
                    >
                      Quản lý hệ thống
                    </div>
                  )}

                  <div
                    onClick={() => {
                      logout()
                      navigate("/login")
                      setShowMenu(false)
                    }}
                  >
                    Đăng xuất
                  </div>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  )
}

export default Header
