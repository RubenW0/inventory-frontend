import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderCreatePage from "./pages/OrderCreatePage";
import OrderDetailPage from "./pages/OrderDetailpage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedHomeRoute from "./components/ProtectedHomeRoute";
import AdminUsersPage from "./pages/AdminUsersPage";


function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Routes>

          <Route path="/" element={<ProtectedHomeRoute />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/create" element={<OrderCreatePage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          <Route path="/admin/users" element={<AdminUsersPage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
