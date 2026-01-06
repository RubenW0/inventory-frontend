import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../../api/api";
import "./CreateOrderModal.css";

interface Product {
  id: number;
  name: string;
  advised_price: number;
}

interface Supplier {
  id: number;
  name: string;
}

interface OrderItem {
  product_id: number;
  quantity: number;
}

export default function CreateOrderModal() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [productData, supplierData] = await Promise.all([
          apiFetch("/products/"),
          apiFetch("/suppliers/")
        ]);
        setProducts(productData);
        setSuppliers(supplierData);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const addProduct = (productId: number) => {
    if (items.find(i => i.product_id === productId)) return;
    setItems([...items, { product_id: productId, quantity: 1 }]);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(items.map(i => (i.product_id === productId ? { ...i, quantity } : i)));
  };

  const removeProduct = (productId: number) => {
    setItems(items.filter(i => i.product_id !== productId));
  };

  const submitOrder = async () => {
    if (!supplierId || items.length === 0) return;
    await apiFetch("/orders/create/", {
      method: "POST",
      body: JSON.stringify({
        supplier_id: supplierId,
        items
      })
    });
    navigate("/orders");
  };

  const getProduct = (id: number) => products.find(p => p.id === id);

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>Create Order</h1>
        <button onClick={() => navigate("/orders")}>Back</button>
      </div>

      <div className="order-card">
        <section>
          <label>Supplier</label>
          <select onChange={e => setSupplierId(Number(e.target.value))}>
            <option value="">Select supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </section>

        <section>
          <h3>Available Products</h3>
          <div className="product-table">
            {products.map(p => (
              <div key={p.id} className="product-row">
                <div>
                  <strong>{p.name}</strong>
                  <div className="price">€{p.advised_price.toFixed(2)}</div>
                </div>
                <button onClick={() => addProduct(p.id)}>Add</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3>Selected Items</h3>
          {items.length === 0 && <p className="empty">No products selected</p>}

          {items.map(item => {
            const product = getProduct(item.product_id);
            if (!product) return null;
            const total = product.advised_price * item.quantity;

            return (
              <div key={item.product_id} className="order-item">
                <div className="order-item-info">
                  <strong>{product.name}</strong>
                  <div>
                    €{product.advised_price.toFixed(2)} × {item.quantity} =
                    <strong> €{total.toFixed(2)}</strong>
                  </div>
                </div>

                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item.product_id, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateQuantity(item.product_id, Number(e.target.value))}
                  />
                  <button onClick={() => updateQuantity(item.product_id, item.quantity + 1)}>+</button>
                </div>

                <button className="danger" onClick={() => removeProduct(item.product_id)}>
                  ✕
                </button>
              </div>
            );
          })}
        </section>

        <div className="actions">
          <button onClick={submitOrder} disabled={!supplierId || items.length === 0}>
            Create Order
          </button>
        </div>
      </div>
    </div>
  );
}
