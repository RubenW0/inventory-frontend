import { useEffect, useState, useContext } from "react";
import { apiFetch } from "../../api/api";
import "./ProductList.css";

import AddProductModal from "./ProductModals/AddProductModal";
import EditProductModal from "./ProductModals/EditProductModal";
import type { ProductType } from "./Types";
import { ProductUnit } from "./Types";
import { AuthContext } from "../../context/AuthContext";

interface Product {
  id: number;
  name: string;
  type: ProductType;
  stock_quantity: number;
  min_stock: number;
  advised_price: number;
  total_value: number;
  location: string;
  status: string;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const { user } = useContext(AuthContext);
  const canManageProducts = user?.role === "admin" || user?.role === "staff";


  const normalizeType = (type: string): ProductType => {
    switch (type.toLowerCase()) {
      case "boulders":
        return "Boulders";
      case "pavingstones":
      case "stone & pavings":
        return "PavingStones";
      case "tiles":
        return "Tiles";
      case "gravelandchippings":
      case "gravel & chippings":
        return "GravelAndChippings";
      default:
        return "PavingStones";
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/products/");

      const normalized: Product[] = data.map((p: any) => ({
        ...p,
        type: normalizeType(p.type),
      }));

      setProducts(normalized);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEditProduct = async (updated: Product) => {
    try {
      await apiFetch(`/products/${updated.id}/update/`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      fetchProducts();
    } catch (err) {
      console.error("Error editing product:", err);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await apiFetch(`/products/${id}/delete/`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };


  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.type.toLowerCase().includes(search.toLowerCase()) ||
      p.location.toLowerCase().includes(search.toLowerCase())
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "stock_quantity") return a.stock_quantity - b.stock_quantity;
    if (sortBy === "advised_price") return a.advised_price - b.advised_price;
    return 0;
  });

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="product-page">
      <div className="header">
        <h1>Products</h1>

        {canManageProducts && (
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            Add Product
          </button>
        )}
      </div>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, type, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="sort-select"
        >
          <option value="name">Sort by Name</option>
          <option value="stock_quantity">Sort by Stock</option>
          <option value="advised_price">Sort by Price</option>
        </select>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Stock</th>
            <th>Min Stock</th>
            <th>Advised Price</th>
            <th>Total Value</th>
            <th>Location</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedProducts.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.type}</td>
              <td>
                {p.stock_quantity} {ProductUnit[p.type] || ""}
              </td>
              <td>{p.min_stock}</td>
              <td>
                €{p.advised_price} / {ProductUnit[p.type] || ""}
              </td>
              <td>€{p.total_value}</td>
              <td>{p.location}</td>
              <td>{p.status}</td>

              <td>
                {/* 🔐 Alleen admin/staff mogen edit/delete */}
                {canManageProducts && (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setSelectedProduct(p);
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(p.id)}
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSave={() => fetchProducts()}
        />
      )}

      {showEditModal && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditProduct}
        />
      )}
    </div>
  );
}
