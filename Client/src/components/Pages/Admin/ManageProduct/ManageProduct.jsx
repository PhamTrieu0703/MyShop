import { useEffect, useState } from "react";
import "./ManageProduct.css";

function ManageProduct() {
  const [products, setProducts] = useState([]);

  const [editingId, setEditingId] = useState(null); // ⭐ trạng thái sửa

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imageAfter, setImageAfter] = useState("");
  const [sizes, setSizes] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.user?.role;

  if (role !== "admin") {
    return <h2 style={{ padding: 20 }}>⛔ Không có quyền admin</h2>;
  }

  /* ===== GET PRODUCTS ===== */
  useEffect(() => {
    fetch("http://localhost:8000/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  /* ===== RESET FORM ===== */
  const resetForm = () => {
    setEditingId(null);
    setName("");
    setPrice("");
    setImage("");
    setImageAfter("");
    setSizes("");
    setStock("");
    setDescription("");
  };

  /* ===== ADD / UPDATE ===== */
  const handleSubmit = async () => {
    if (!name || !price || !image || !stock) {
      alert("Nhập đủ thông tin");
      return;
    }

    const productData = {
      name,
      price: Number(price),
      image,
      description,
      imageAfter: imageAfter
        ? imageAfter.split(",").map(i => i.trim())
        : [],
      sizes: sizes
        ? sizes.split(",").map(s => s.trim())
        : [],
      stock: Number(stock)
    };

    const url = editingId
      ? `http://localhost:8000/products/${editingId}`
      : "http://localhost:8000/products";

    const method = editingId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData)
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Thao tác thất bại");
      return;
    }

    if (editingId) {
      // UPDATE UI
      setProducts(prev =>
        prev.map(p => (p._id === editingId ? data : p))
      );
    } else {
      // ADD UI
      setProducts(prev => [...prev, data]);
    }

    resetForm();
  };

  /* ===== EDIT ===== */
  const editProduct = (p) => {
    setEditingId(p._id);
    setName(p.name);
    setPrice(p.price);
    setImage(p.image);
    setImageAfter(p.imageAfter?.join(", ") || "");
    setSizes(p.sizes?.join(", ") || "");
    setStock(p.stock);
    setDescription(p.description || "");
  };

  /* ===== DELETE ===== */
  const deleteProduct = async (id) => {
    if (!window.confirm("Xóa sản phẩm?")) return;

    await fetch(`http://localhost:8000/products/${id}`, {
      method: "DELETE"
    });

    setProducts(prev => prev.filter(p => p._id !== id));
  };

  return (
    <div className="product-manage">
      <h1>📦 Quản lý sản phẩm</h1>

      {/* FORM */}
      <div className="add-form">
        <input placeholder="Tên sản phẩm" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Giá" type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <input placeholder="Ảnh chính (URL)" value={image} onChange={e => setImage(e.target.value)} />
        <input placeholder="Ảnh phụ (URL1, URL2)" value={imageAfter} onChange={e => setImageAfter(e.target.value)} />
        <input placeholder="Sizes (S, M, L)" value={sizes} onChange={e => setSizes(e.target.value)} />
        <input placeholder="Số lượng kho" type="number" value={stock} onChange={e => setStock(e.target.value)} />
        <textarea placeholder="Mô tả sản phẩm" value={description} onChange={e => setDescription(e.target.value)} />

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={handleSubmit}>
            {editingId ? "Cập nhật" : "Thêm sản phẩm"}
          </button>

          {editingId && (
            <button className="cancel" onClick={resetForm}>
              Hủy
            </button>
          )}
        </div>
      </div>

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên</th>
            <th>Giá</th>
            <th>Sizes</th>
            <th>Kho</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td><img src={p.image} alt="" /></td>
              <td>{p.name}</td>
              <td>{Number(p.price || 0).toLocaleString()} đ</td>
              <td>{p.sizes?.join(", ")}</td>
              <td>{p.stock}</td>
              <td className="desc">{p.description || "—"}</td>
              <td>
                <button onClick={() => editProduct(p)}>Sửa</button>
                <button className="delete" onClick={() => deleteProduct(p._id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManageProduct;
