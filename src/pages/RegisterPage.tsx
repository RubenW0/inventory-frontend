import { useState } from "react";
import { registerUser } from "../api/api";
import "./Auth.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "employee",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(form);
    alert("User registered!");
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Register</h2>

        <label>Username</label>
        <input
          className="auth-input"
          name="username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <label>Email</label>
        <input
          className="auth-input"
          name="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          className="auth-input"
          name="password"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="auth-btn" type="submit">Register</button>
      </form>
    </div>
  );
}
