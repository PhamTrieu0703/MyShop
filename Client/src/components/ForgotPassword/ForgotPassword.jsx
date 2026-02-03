import { useState } from "react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async () => {
    const res = await fetch("http://localhost:8000/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });

    const data = await res.json();
    setMsg(data.message);
  };

  return (
    <div>
      <h2>Quên mật khẩu</h2>
      <input
        placeholder="Nhập email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={submit}>Gửi mã</button>
      <p>{msg}</p>
    </div>
  );
}

export default ForgotPassword;
