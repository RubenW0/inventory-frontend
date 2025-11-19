import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar-container">
      <nav className="navbar">
        <NavLink to="/" className="nav-item">Dashboard</NavLink>
        <NavLink to="/products" className="nav-item">Products</NavLink>
        <NavLink to="/orders" className="nav-item">Orders</NavLink>
        <NavLink to="/map" className="nav-item">Map</NavLink>
      </nav>
    </div>
  );
}
