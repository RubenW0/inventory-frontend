import { NavLink } from "react-router-dom";
import { isLoggedIn, logout, getUsername, getRole } from "../../auth";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const [username, setUsername] = useState(getUsername());
  const [role, setRole] = useState(getRole());

  useEffect(() => {
    const interval = setInterval(() => {
      setLoggedIn(isLoggedIn());
      setUsername(getUsername());
      setRole(getRole());
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="navbar-container">
      <nav className="navbar">

        <NavLink to="/" className="nav-item">Dashboard</NavLink>
        <NavLink to="/products" className="nav-item">Products</NavLink>
        <NavLink to="/orders" className="nav-item">Orders</NavLink>
        <NavLink to="/map" className="nav-item">Map</NavLink>

        <div className="nav-right">
          {!loggedIn && (
            <>
              <NavLink to="/login" className="nav-item">Login</NavLink>
              <NavLink to="/register" className="nav-item">Register</NavLink>
            </>
          )}

          {loggedIn && (
            <>
              <span className="nav-username">Hi, {username}</span>
              <span className="nav-role">Role: {role}</span>
              <button className="nav-logout" onClick={logout}>Logout</button>
            </>
          )}
        </div>

      </nav>
    </div>
  );
}
