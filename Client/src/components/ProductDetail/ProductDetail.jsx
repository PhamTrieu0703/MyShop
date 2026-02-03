import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDetail.css";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setMainImage(data.image);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (!product) return <p>Không tìm thấy sản phẩm</p>;

  const outOfStock = product.stock === 0;

  /* ===== ADD TO CART (DÙNG CHUNG) ===== */
  const addToCart = async () => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const userId = stored?.user?._id;

    if (!userId) {
      alert("Vui lòng đăng nhập");
      return false;
    }

    if (!selectedSize) {
      alert("Vui lòng chọn kích thước");
      return false;
    }

    if (outOfStock) {
      alert("Sản phẩm đã hết hàng");
      return false;
    }

    try {
      const res = await fetch(`http://localhost:8000/carts/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
          quantity: 1,
          size: selectedSize
        })
      });

      if (!res.ok) throw new Error();

      return true;
    } catch {
      alert("Thêm vào giỏ hàng thất bại");
      return false;
    }
  };

  /* ===== THÊM VÀO GIỎ ===== */
  const handleAddToCart = async () => {
    const success = await addToCart();
    if (success) alert("Đã thêm vào giỏ hàng");
  };

  /* ===== MUA NGAY ===== */
  const handleBuyNow = async () => {
    const stored = JSON.parse(localStorage.getItem("user"));
    const userId = stored?.user?._id;

    const success = await addToCart();
    if (success) {
      navigate(`/cart/${userId}`);
    }
  };

  return (
    <div className="product-page">

      {/* LEFT – THUMBNAILS */}
      <div className="thumbs">
        {[product.image, ...(product.imageAfter || [])].map((img, i) => (
          <img
            key={i}
            src={img}
            alt=""
            className={mainImage === img ? "active" : ""}
            onClick={() => setMainImage(img)}
          />
        ))}
      </div>

      {/* CENTER – IMAGE */}
      <div className="image-view">
        <img src={mainImage} alt={product.name} />
      </div>

      {/* RIGHT – INFO */}
      <div className="info">
        <h1>{product.name}</h1>
        <p className="sku">Style Code: {product.code || "N/A"}</p>

        <p className="price">{product.price.toLocaleString()}₫</p>

        {/* SIZES */}
        {Array.isArray(product.sizes) && product.sizes.length > 0 && (
          <>
            <p>Chọn kích thước</p>
            <div className="sizes">
              {product.sizes.map(size => (
                <button
                  key={size}
                  className={selectedSize === size ? "active" : ""}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </>
        )}

        {/* ACTIONS */}
        <div className="actions">
          <button
            onClick={handleAddToCart}
            disabled={outOfStock}
          >
            THÊM VÀO GIỎ
          </button>

          <button
            className="buy-now"
            onClick={handleBuyNow}
            disabled={outOfStock}
          >
            MUA NGAY
          </button>
        </div>

        <p className="stock">
          {outOfStock ? "Hết hàng" : `Còn ${product.stock} sản phẩm`}
        </p>
      </div>

    </div>
  );
}

export default ProductDetail;
