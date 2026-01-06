import { useState, useEffect } from "react";
import "./ProductModal.css";
import type { Product, ProductType } from "../Types";
import { ProductTypeDisplay, ProductUnit } from "../Types";

interface EditProductModalProps {
  product: Product;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export default function EditProductModal({ product, onClose, onSave }: EditProductModalProps) {
  const [name, setName] = useState(product.name);
  const [type, setType] = useState<ProductType>(product.type);
  const [stockQuantity, setStockQuantity] = useState(String(product.stock_quantity));
  const [minStock, setMinStock] = useState(String(product.min_stock));
  const [advisedPrice, setAdvisedPrice] = useState(String(product.advised_price));
  const [totalValue, setTotalValue] = useState(String(product.total_value));
  const [location, setLocation] = useState(product.location);
  const [status, setStatus] = useState(product.status);

  useEffect(() => {
    setName(product.name);
    setType(product.type);
    setStockQuantity(String(product.stock_quantity));
    setMinStock(String(product.min_stock));
    setAdvisedPrice(String(product.advised_price));
    setTotalValue(String(product.total_value));
    setLocation(product.location);
    setStatus(product.status);
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: product.id,
      name,
      type,
      stock_quantity: parseInt(stockQuantity),
      min_stock: parseInt(minStock),
      advised_price: parseFloat(advisedPrice),
      total_value: parseFloat(totalValue),
      location,
      status
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
            Total Value
            <input
              type="number"
              step="0.01"
              value={totalValue}
              onChange={e => setTotalValue(e.target.value)}
              required
            />
          </label>

          <label>
            Location
            <input value={location} onChange={e => setLocation(e.target.value)} required />
          </label>

          <label>
            Status
            <input value={status} onChange={e => setStatus(e.target.value)} required />
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
