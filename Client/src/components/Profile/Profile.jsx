import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("user"));
    if (!stored) {
      navigate("/login");
      return;
    }

    fetch(`http://localhost:8000/profile/${stored.user._id}`)
      .then(res => {
        if (!res.ok) throw new Error("Không lấy được user");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setForm({
          fullName: data.fullName || "",
          phone: data.phone || "",
          address: data.address || ""
        });
      })
      .catch(() => navigate("/login"));
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `http://localhost:8000/profile/${user._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const data = await res.json();
      setUser(data.user);

      alert("Cập nhật thông tin thành công");
    } catch (err) {
      alert("Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p>Đang tải thông tin...</p>;

  return (
    <div className="profile-container">
      <h1>👤 Thông tin cá nhân</h1>

      <div className="profile-box">
        <p><b>Username:</b> {user.username}</p>

        <div className="form-group">
          <label>Họ tên</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </div>

        <button className="btn-save" onClick={handleUpdate} disabled={loading}>
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>

        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem("user");
            navigate("/login");
          }}
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
}

export default Profile;
