import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";

// import Navbar from "./components/Navbar";
// import Dashboard from "./pages/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
// import MapPage from "./pages/MapPage";

function App() {
  return (
    <Router>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/products" element={<ProductsPage/>} />
          <Route path="/orders" element={<OrdersPage/>} />
          {/* <Route path="/map" element={<MapPage />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
