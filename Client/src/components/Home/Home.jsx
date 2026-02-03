import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  const [products, setProducts] = useState([]);

  /* ===== USER ===== */
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.user?._id;

  /* ===== CONTEXT FROM SIDEBAR / HEADER ===== */
  const { search = "", categoryId = null } = useOutletContext();

  /* ===== FETCH PRODUCTS ===== */
  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Fetch products error:", err));
  }, []);

  /* ===== ADD TO CART ===== */
  const addToCart = async (product) => {
    if (!userId) {
      alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/carts/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
          quantity: 1,
        }),
      });

      if (!res.ok) throw new Error("Add cart failed");

      alert("Đã thêm vào giỏ hàng");
    } catch (error) {
      console.error(error);
      alert("Thêm vào giỏ hàng thất bại");
    }
  };

  /* ===== FILTER PRODUCTS (FIX CHUẨN) ===== */
  const filteredProducts = products.filter((p) => {
    /* SEARCH */
    const matchSearch = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    /* CATEGORY
       - p.categoryId có thể là string hoặc object (_id)
    */
    const matchCategory = categoryId
      ? p.categoryId === categoryId ||
        p.categoryId?._id === categoryId
      : true;

    return matchSearch && matchCategory;
  });

  return (
    <div className="home">
      <h1>🔥 Sản phẩm bán chạy</h1>

      {filteredProducts.length === 0 ? (
        <p>Không có sản phẩm phù hợp</p>
      ) : (
        <div className="product-list">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <Link to={`/products/${product._id}`}className="product-link">
                <img src={product.image} />
                <h3>{product.name}</h3>
              </Link>
              <p>{product.price.toLocaleString()} đ</p>
              {product.totalSold && (
                <small>Đã bán: {product.totalSold}</small>
              )}

              <button onClick={() => addToCart(product)}>
                Thêm vào giỏ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
