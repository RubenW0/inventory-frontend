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

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const result = await loginUser(form);

      localStorage.setItem("access", result.access);
      localStorage.setItem("refresh", result.refresh);

      const me = await fetchMe();

      const userData = {
        id: me.id,
        username: me.username,
        role: me.role
      };

      login(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      setSuccess("Login successful! Redirecting...");

      setTimeout(() => navigate("/products"), 600);

    } catch (err: any) {
      if (err?.detail) {
        setError("Incorrect username or password.");
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2 className="auth-title">Login</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="success-banner">{success}</p>}

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
