import { useState } from "react";
import "./ProductModal.css";
import type { ProductType } from "../Types";
import { ProductTypeDisplay, ProductUnit } from "../Types";
import { apiFetch } from "../../../api/api";

interface AddProductModalProps {
  onClose: () => void;
  onSave: () => void; 
}

export default function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ProductType>("PavingStones");
  const [stockQuantity, setStockQuantity] = useState("");
  const [minStock, setMinStock] = useState("");
  const [advisedPrice, setAdvisedPrice] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await apiFetch("/products/create/", {
        method: "POST",
        body: JSON.stringify({
          name,
          type,
          stock_quantity: Number(stockQuantity),
          min_stock: Number(minStock),
          advised_price: Number(advisedPrice),
          location,
        }),
      });

      setName("");
      setStockQuantity("");
      setMinStock("");
      setAdvisedPrice("");
      setLocation("");

      onSave(); 
      onClose();
    } catch (err) {
      console.error("Failed to add product:", err);
      alert("Failed to add product. Check console for details.");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Add Product</h2>

        <form onSubmit={handleSubmit} className="modal-form">
          <label>
            Name
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
          </label>

          <label>
            Type
            <select value={type} onChange={(e) => setType(e.target.value as ProductType)} required>
              {Object.keys(ProductTypeDisplay).map((key) => (
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
              onChange={(e) => setStockQuantity(e.target.value)}
              required
            />
            <span>{ProductUnit[type]}</span>
          </label>

          <label>
            Min Stock
            <input
              type="number"
              value={minStock}
              onChange={(e) => setMinStock(e.target.value)}
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
              onChange={(e) => setAdvisedPrice(e.target.value)}
              required
            />
            <span>€/ {ProductUnit[type]}</span>
          </label>

          <label>
            Location
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
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
