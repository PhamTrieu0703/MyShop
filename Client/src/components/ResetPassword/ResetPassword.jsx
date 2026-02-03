import { useState } from "react";


function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
    password: ""
  });

  const submit = async () => {
    const res = await fetch("http://localhost:8000/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        otp: form.otp,
        newPassword: form.password
      })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div>
      <h2>Đặt lại mật khẩu</h2>
      <input placeholder="Email"
        onChange={(e)=>setForm({...form,email:e.target.value})} />
      <input placeholder="OTP"
        onChange={(e)=>setForm({...form,otp:e.target.value})} />
      <input type="password" placeholder="Mật khẩu mới"
        onChange={(e)=>setForm({...form,password:e.target.value})} />

      <button onClick={submit}>Đổi mật khẩu</button>
    </div>
  );
}

export default ResetPassword;
