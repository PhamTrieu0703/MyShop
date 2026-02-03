import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login/Login.jsx'
import Home from './components/Home/Home.jsx'
import MainLayout from './layouts/MainLayout.jsx'
import Products from './components/Products/Products.jsx'
import Cart from './components/Cart/Cart.jsx'
import Register from './components/Register/Register.jsx'
import Profile from './components/Profile/Profile.jsx'
import ForgotPassword from './components/ForgotPassword/ForgotPassword.jsx'
import ResetPassword from './components/ResetPassword/ResetPassword.jsx'
import Orders from './components/Order/Orders.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import ManageUser from './components/Pages/Admin/ManageUser/ManageUser.jsx'
import ManageProduct from './components/Pages/Admin/ManageProduct/ManageProduct.jsx'
import ManageOrders from './components/Pages/Admin/ManageOrders/ManageOrders.jsx'
import Dashboard from './components/Pages/Admin/Dashboard/Dashboard.jsx'
import SidebarLayout from './layouts/SidebarLayout.jsx'
import ProductDetail from './components/ProductDetail/ProductDetail.jsx'
function App() {
  return (
    <MainLayout>

      <Routes>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="manage-users" element={<ManageUser />} />
          <Route path="manage-products" element={<ManageProduct />} />
          <Route path="manage-orders" element={<ManageOrders />} />
        </Route>
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/cart/:_id" element={<Cart />} />
        <Route path="/profile/:_id" element={<Profile />} />
        <Route path="/orders/:_id" element={<Orders />} />
        <Route path="/products/:id" element={<ProductDetail />} />

        <Route element={<SidebarLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          <Route path="/products" element={<Products />} />
          {/* <Route path="/category/:id" element={<Home />} /> */}
        </Route>

      </Routes>
    </MainLayout>
  )
}

export default App
