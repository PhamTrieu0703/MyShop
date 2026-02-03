import { useEffect, useState } from 'react'
import './ManageUser.css'

function ManageUser() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [editId, setEditId] = useState(null)
  const [editData, setEditData] = useState({
    fullName: '',
    email: '',
    username: '',
    role: ''
  })

  const user = JSON.parse(localStorage.getItem('user'))
  const role = user?.user?.role

  if (role !== 'admin') {
    return <h2 style={{ padding: 20 }}>⛔ Bạn không có quyền admin</h2>
  }

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8000/users')
      if (!res.ok) throw new Error('Không lấy được user')
      const data = await res.json()
      setUsers(data)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // DELETE USER
  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xoá user này không?')) return

    try {
      const res = await fetch(`http://localhost:8000/users/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Xoá thất bại')

      setUsers(users.filter(u => u._id !== id))
      alert('✅ Xoá thành công')
    } catch (err) {
      alert('❌ ' + err.message)
    }
  }

  // CLICK EDIT
  const handleEdit = (u) => {
    setEditId(u._id)
    setEditData({
      fullName: u.fullName || '',
      email: u.email || '',
      username: u.username || '',
      role: u.role || ''
    })
  }

  // CHANGE INPUT
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  // SAVE EDIT
  const handleSave = async (id) => {
    try {
      const res = await fetch(`http://localhost:8000/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      })

      if (!res.ok) throw new Error('Cập nhật thất bại')

      setUsers(users.map(u =>
        u._id === id ? { ...u, ...editData } : u
      ))

      setEditId(null)
      alert('✅ Cập nhật thành công')
    } catch (err) {
      alert('❌ ' + err.message)
    }
  }

  if (loading) return <p className="loading">Đang tải...</p>
  if (error) return <p className="error">{error}</p>

  return (
    <div className="admin-container">
      <h1>👤 Quản lý người dùng</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u, i) => (
            <tr key={u._id}>
              <td>{i + 1}</td>

              <td>
                {editId === u._id
                  ? <input name="fullName" value={editData.fullName} onChange={handleChange} />
                  : u.fullName}
              </td>

              <td>
                {editId === u._id
                  ? <input name="email" value={editData.email} onChange={handleChange} />
                  : u.email}
              </td>

              <td>
                {editId === u._id
                  ? <input name="username" value={editData.username} onChange={handleChange} />
                  : u.username}
              </td>

              <td>
                {editId === u._id ? (
                  <select name="role" value={editData.role} onChange={handleChange}>
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                ) : (
                  <span className={`role ${u.role}`}>{u.role}</span>
                )}
              </td>

              <td>
                {editId === u._id ? (
                  <>
                    <button className="btn save" onClick={() => handleSave(u._id)}>Lưu</button>
                    <button className="btn cancel" onClick={() => setEditId(null)}>Hủy</button>
                  </>
                ) : (
                  <>
                    <button className="btn edit" onClick={() => handleEdit(u)}>Sửa</button>
                    <button className="btn delete" onClick={() => handleDelete(u._id)}>Xóa</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ManageUser
