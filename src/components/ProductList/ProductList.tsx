import { useEffect, useState } from "react";
import "./ProductList.css";
import AddProductModal from "./ProductModals/AddProductModal";
import EditProductModal from "./ProductModals/EditProductModal";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Fetch alle producten
  const fetchProducts = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/products/")
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAddProduct = (newProduct: { name: string; price: number; stock: number }) => {
    fetch("http://127.0.0.1:8000/products/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProduct),
    })
      .then((res) => res.json())
      .then(() => fetchProducts())
      .catch((err) => console.error("Error adding product:", err));
  };

  // Edit product
  const handleEditProduct = (updatedProduct: Product) => {
    fetch(`http://127.0.0.1:8000/products/${updatedProduct.id}/update/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedProduct),
    })
      .then((res) => res.json())
      .then(() => fetchProducts())
      .catch((err) => console.error("Error editing product:", err));
  };

  // Delete product
  const handleDeleteProduct = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`http://127.0.0.1:8000/products/${id}/delete/`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then(() => fetchProducts())
        .catch((err) => console.error("Error deleting product:", err));
    }
  };

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="product-page">
      <div className="header">
        <h1>Products</h1>
        <button className="add-btn" onClick={() => setShowAddModal(true)}>
          Add Product
        </button>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Price</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.stock}</td>
              <td>${p.price}</td>
              <td>
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddProduct}
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
