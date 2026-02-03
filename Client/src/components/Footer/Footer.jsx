import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        <div className="footer-column">
          <h3>HaiAStore</h3>
          <p>
            Nền tảng mua sắm trực tuyến uy tín, 
            mang đến sản phẩm chất lượng và dịch vụ tốt nhất.
          </p>
        </div>

        <div className="footer-column">
          <h4>Danh mục</h4>
          <ul>
            <li><a href="#">#</a></li>
            <li><a href="#">#</a></li>
            <li><a href="#">#</a></li>
            <li><a href="#">Khuyến mãi</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Hỗ trợ khách hàng</h4>
          <ul>
            <li><a href="#">Chính sách bảo hành</a></li>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Thanh toán</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Liên hệ</h4>
          <p>Email: support@gmail.com</p>
          <p>Hotline: 090 000 000</p>
          <p>Địa chỉ: TP. Hồ Chí Minh</p>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 MyShop. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
