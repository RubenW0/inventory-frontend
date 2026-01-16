import { useState, useContext } from "react";
import { loginUser, fetchMe } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await loginUser(form);

      localStorage.setItem("access", result.access);
      localStorage.setItem("refresh", result.refresh);

      const me = await fetchMe();
      console.log("ME RESPONSE:", me);

      const userData = {
        id: me.id,
        username: me.username,
        role: me.role
      };

      login(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      navigate("/products");

    } catch (err: any) {
      alert("Login failed: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Login</h2>

        <label>Username</label>
        <input
          className="auth-input"
          name="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>Password</label>
        <input
          className="auth-input"
          name="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="auth-btn" type="submit">Login</button>
      </form>
    </div>
  );
}
