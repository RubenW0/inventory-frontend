import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
// import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";

import OrderCreatePage from "./pages/OrderCreatePage";
import OrderDetailPage from "./pages/OrderDetailpage";
// import MapPage from "./pages/MapPage";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";




function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/products" element={<ProductsPage/>} />
          <Route path="/orders" element={<OrdersPage/>} />
          
          <Route path="/orders/create" element={<OrderCreatePage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />

          {/* <Route path="/map" element={<MapPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
