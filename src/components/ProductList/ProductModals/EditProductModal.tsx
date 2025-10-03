import { useState } from "react";
import "./ProductModal.css"; 



interface EditProductModalProps {
  product: { id: number; name: string; price: number; stock: number };
  onClose: () => void;
  onSave: (product: { id: number; name: string; price: number; stock: number }) => void;
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product.id,
      name,
      price: parseFloat(price),
      stock: parseInt(stock),
    });
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Edit Product</h2>
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
