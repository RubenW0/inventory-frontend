import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="navbar-container">
      <nav className="navbar">

        {/* <NavLink to="/" className="nav-item">Dashboard</NavLink> */}
        <NavLink to="/products" className="nav-item">Products</NavLink>
        <NavLink to="/orders" className="nav-item">Orders</NavLink>
        {/* <NavLink to="/map" className="nav-item">Map</NavLink> */}

        <div className="nav-right">
          {!user && (
            <>
              <NavLink to="/login" className="nav-item">Login</NavLink>
              <NavLink to="/register" className="nav-item">Register</NavLink>
            </>
          )}

          {user && (
            <>
              <span className="nav-username">Hi, {user.username}</span>
              <span className="nav-role">Role: {user.role}</span>
              <button className="nav-logout" onClick={logout}>Logout</button>
            </>
          )}
        </div>

      </nav>
    </div>
  );
}
