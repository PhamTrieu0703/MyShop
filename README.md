# 🛒 HaiAStore – Website Bán Hàng

HaiAStore là một website bán hàng đơn giản, gồm **frontend (ReactJS)** và **backend (NodeJS + Express)**, hỗ trợ các chức năng cơ bản như xem sản phẩm, giỏ hàng, đăng nhập và quản lý dữ liệu.

---

## 📌 Công nghệ sử dụng

### Frontend
- ReactJS
- HTML, CSS
- Fetch API
- React Hooks (`useState`, `useEffect`)
- React Router DOM

### Backend
- NodeJS
- ExpressJS
- MongoDB
- Mongoose

---

## 📂 Cấu trúc thư mục
HaiAStore/
├─ frontend/ # Source code giao diện
├─ backend/ # Source code server
├─ .gitignore
├─ README.md
## ⚙️ Cài đặt & Chạy project

### 1️⃣ Clone project
```bash
git clone https://github.com/your-username/HaiAStore.git
cd HaiAStore
2️⃣ Cài đặt Backend
cd backend
npm install
Tạo file .env:

PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key

Chạy server:
npm start
Backend chạy tại:

http://localhost:8080
Cài đặt Frontend
cd Client
npm install
npm run dev

Frontend chạy tại:
✨ Chức năng chính
Người dùng

Xem danh sách,chi tiết sản phẩm

Thêm sản phẩm vào giỏ hàng

Xem giỏ hàng theo user

Đăng nhập / đăng ký

Admin

Quản lý sản phẩm (CRUD)

Quản lý đơn hàng

Quản lý người dùng

📸 Giao diện (demo)

Đang cập nhật

🚀 Hướng phát triển

Thanh toán online

Phân quyền admin / user

Upload ảnh sản phẩm

Thống kê doanh thu

👤 Tác giả

Phạm Thanh Triều
