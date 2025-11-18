import { useState } from "react";
import "./ProductModal.css";
import type { ProductType } from "../Types";
import { ProductTypeDisplay, ProductUnit } from "../Types"; 

interface AddProductModalProps {
  onClose: () => void;
  onSave: (product: {
    name: string;
    type: ProductType;
    stock_quantity: number;
    min_stock: number;
    advised_price: number;
    total_value: number;
    location: string;
    status: string;
  }) => void;
}

export default function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<ProductType>("PavingStones");
  const [stockQuantity, setStockQuantity] = useState("");
  const [minStock, setMinStock] = useState("");
  const [advisedPrice, setAdvisedPrice] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSave({
      name,
      type,
      stock_quantity: parseInt(stockQuantity),
      min_stock: parseInt(minStock),
      advised_price: parseFloat(advisedPrice),
      total_value: parseFloat(totalValue),
      location,
      status,
    });

    onClose();
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
            Total Value
            <input
              type="number"
              step="0.01"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              required
            />
          </label>

          <label>
            Location
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
          </label>

          <label>
            Status
            <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} required />
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
