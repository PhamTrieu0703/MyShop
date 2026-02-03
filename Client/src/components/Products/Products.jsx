import { useEffect, useState } from 'react'
import './Products.css'

function Products() {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)

  const productsPerPage = 8
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.user?._id;
  useEffect(() => {
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data)
        setCurrentPage(1) // reset về trang 1
      })
      .catch(err => console.error(err))
  }, [])

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  )

  const totalPages = Math.ceil(products.length / productsPerPage)

  const addToCart = async (product) => {
    if (!userId) {
      alert('Vui lòng đăng nhập để thêm vào giỏ hàng')
      return
    }

    try {
      const res = await fetch(`http://localhost:8000/carts/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product._id,
          quantity: 1
        })
      })

      if (!res.ok) throw new Error("Add cart failed")

      alert('Đã thêm vào giỏ hàng')
    } catch (error) {
      console.error(error)
      alert('Thêm vào giỏ hàng thất bại')
    }
  }

  /* ================= RENDER ================= */
  return (
    <div className="products">
      <h1>Sản phẩm</h1>

      <div className="products-list">
        {currentProducts.map(product => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} />
            <h3>{product.name}</h3>
            <p>
              Giá: {product.price?.toLocaleString() || 0} VND
            </p>
            <button
              className="btn-add-to-cart"
              onClick={() => addToCart(product)}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        ))}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={currentPage === index + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

export default Products
