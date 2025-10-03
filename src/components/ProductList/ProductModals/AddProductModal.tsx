import { useState } from "react";
import "./ProductModal.css";

interface AddProductModalProps {
  onClose: () => void;
  onSave: (product: { name: string; price: number; stock: number }) => void;
}

export default function AddProductModal({ onClose, onSave }: AddProductModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, price: parseFloat(price), stock: parseInt(stock) });
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
            Price
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required />
          </label>
          <label>
            Stock
            <input type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
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
