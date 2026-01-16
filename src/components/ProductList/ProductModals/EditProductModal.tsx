import { useState, useEffect } from "react";
import "./ProductModal.css";
import type { Product, ProductType } from "../Types";
import { ProductTypeDisplay, ProductUnit } from "../Types";
import { apiFetch } from "../../../api/api";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (updated: Product) => void; 
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [type, setType] = useState<ProductType>(product.type);
  const [stockQuantity, setStockQuantity] = useState(String(product.stock_quantity));
  const [minStock, setMinStock] = useState(String(product.min_stock));
  const [advisedPrice, setAdvisedPrice] = useState(String(product.advised_price));
  const [location, setLocation] = useState(product.location);

  useEffect(() => {
    setName(product.name);
    setType(product.type);
    setStockQuantity(String(product.stock_quantity));
    setMinStock(String(product.min_stock));
    setAdvisedPrice(String(product.advised_price));
    setLocation(product.location);
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiFetch(`/products/${product.id}/update/`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          type,
          stock_quantity: Number(stockQuantity),
          min_stock: Number(minStock),
          advised_price: Number(advisedPrice),
          location,
        }),
      });

      onSave({
        id: product.id,
        name,
        type,
        stock_quantity: Number(stockQuantity),
        min_stock: Number(minStock),
        advised_price: Number(advisedPrice),
        total_value: product.total_value,
        location,
        status: product.status,
      });

      onClose();
    } catch (err) {
      console.error("Failed to update product:", err);
      alert("Failed to update product. Check console for details.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Product</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Name
            <input value={name} onChange={e => setName(e.target.value)} required />
          </label>

          <label>
            Type
            <select value={type} onChange={e => setType(e.target.value as ProductType)} required>
              {Object.keys(ProductTypeDisplay).map(key => (
                <option key={key} value={key}>
                  {ProductTypeDisplay[key as ProductType]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Stock Quantity
            <input
              type="number"
              value={stockQuantity}
              onChange={e => setStockQuantity(e.target.value)}
              required
            />
            <span>{ProductUnit[type]}</span>
          </label>

          <label>
            Min Stock
            <input
              type="number"
              value={minStock}
              onChange={e => setMinStock(e.target.value)}
              required
            />
            <span>{ProductUnit[type]}</span>
          </label>

          <label>
            Advised Price
            <input
              type="number"
              step="0.01"
              value={advisedPrice}
              onChange={e => setAdvisedPrice(e.target.value)}
              required
            />
            <span>€/ {ProductUnit[type]}</span>
          </label>

          <label>
            Location
            <input value={location} onChange={e => setLocation(e.target.value)} required />
          </label>

          <div className="modal-actions">
            <button type="submit" className="save-btn">Save</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
