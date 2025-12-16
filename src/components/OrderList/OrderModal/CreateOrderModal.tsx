import { useEffect, useState } from "react";
import "./CreateOrderModal.css";

interface Product {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

export default function CreateOrderModal({
  onClose,
  onCreated
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [items, setItems] = useState<{ product_id: number; quantity: number }[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/products/")
      .then(res => res.json())
      .then(setProducts);

    fetch("http://127.0.0.1:8000/suppliers/")
      .then(res => res.json())
      .then(setSuppliers);
  }, []);

  const addProduct = (productId: number) => {
    if (items.find(i => i.product_id === productId)) return;

    setItems([...items, { product_id: productId, quantity: 1 }]);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(items.map(i =>
      i.product_id === productId ? { ...i, quantity } : i
    ));
  };

  const submitOrder = async () => {
    if (!supplierId || items.length === 0) return;

    await fetch("http://127.0.0.1:8000/orders/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        supplier_id: supplierId,
        items
      })
    });

    onCreated();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h2>Nieuwe order</h2>

        <label>Leverancier</label>
        <select onChange={e => setSupplierId(Number(e.target.value))}>
          <option value="">Kies leverancier</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        <h3>Producten</h3>
        <div className="product-list">
          {products.map(p => (
            <button key={p.id} onClick={() => addProduct(p.id)}>
              + {p.name}
            </button>
          ))}
        </div>

        <h3>Geselecteerd</h3>
        {items.map(item => (
          <div key={item.product_id} className="order-item">
            <span>
              {products.find(p => p.id === item.product_id)?.name}
            </span>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={e =>
                updateQuantity(item.product_id, Number(e.target.value))
              }
            />
          </div>
        ))}

        <div className="modal-actions">
          <button onClick={submitOrder}>Order plaatsen</button>
          <button onClick={onClose} className="secondary">Annuleren</button>
        </div>
      </div>
    </div>
  );
}
