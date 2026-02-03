import { useEffect, useState } from "react";
import "./LeftSidebar.css";

function LeftSidebar({ onSearch, onSelectCategory }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  /* ===== FETCH CATEGORIES ===== */
  useEffect(() => {
    fetch("http://localhost:8000/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch categories error:", err);
        setLoading(false);
      });
  }, []);

  /* ===== DEBOUNCE SEARCH ===== */
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(keyword);
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword]);

  return (
    <aside className="left-sidebar">
      {/* SEARCH */}
      <div className="sidebar-box">
        <h4>Tìm kiếm</h4>
        <input
          type="text"
          placeholder="Nhập tên sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      {/* CATEGORIES */}
      <div className="sidebar-box">
        <h4>Danh mục</h4>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <ul>
            <li
              className={activeCategory === null ? "active" : ""}
              onClick={() => {
                setActiveCategory(null);
                onSelectCategory?.(null);
              }}
            >
              Tất cả
            </li>

            {categories.map((c) => (
              <li
                key={c._id}
                className={activeCategory === c._id ? "active" : ""}
                onClick={() => {
                  setActiveCategory(c._id);
                  onSelectCategory?.(c._id);
                }}
              >
                {c.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}

export default LeftSidebar;
