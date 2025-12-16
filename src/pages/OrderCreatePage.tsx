import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderCreatePage.css";

interface Product {
  id: number;
  name: string;
}

interface Supplier {
  id: number;
  name: string;
}

export default function OrderCreatePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [supplierId, setSupplierId] = useState<number | null>(null);
  const [items, setItems] = useState<{ product_id: number; quantity: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, suppliersRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/products/"),
          fetch("http://127.0.0.1:8000/suppliers/")
        ]);

        if (!productsRes.ok || !suppliersRes.ok) {
          const text1 = await productsRes.text();
          const text2 = await suppliersRes.text();
          console.error("Products error:", text1);
          console.error("Suppliers error:", text2);
          throw new Error("Could not load products or suppliers");
        }

        const productsData: Product[] = await productsRes.json();
        const suppliersData: Supplier[] = await suppliersRes.json();

        setProducts(productsData);
        setSuppliers(suppliersData);
        setLoading(false);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addProduct = (productId: number) => {
    if (items.find(i => i.product_id === productId)) return;
    setItems([...items, { product_id: productId, quantity: 1 }]);
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setItems(items.map(i => i.product_id === productId ? { ...i, quantity } : i));
  };

  const removeProduct = (productId: number) => {
    setItems(items.filter(i => i.product_id !== productId));
  };

  const submitOrder = async () => {
    if (!supplierId) {
      setError("Please select a supplier");
      return;
    }
    if (items.length === 0) {
      setError("Please select at least one product");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/orders/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier_id: supplierId,
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity }))
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || "Could not create order");
      }

      navigate("/orders");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while creating the order");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="order-page">
      <h1>New Order</h1>

      {error && <p className="error">{error}</p>}

      <label>Supplier</label>
      <select onChange={e => setSupplierId(Number(e.target.value))} value={supplierId ?? ""}>
        <option value="">Select a supplier</option>
        {suppliers.map(s => (
          <option key={s.id} value={s.id}>{s.name}</option>
        ))}
      </select>

      <h3>Products</h3>
      <div className="product-list">
        {products.map(p => (
          <button
            key={p.id}
            onClick={() => addProduct(p.id)}
            disabled={items.some(i => i.product_id === p.id)}
          >
            + {p.name}
          </button>
        ))}
      </div>

      <h3>Selected</h3>
      {items.length === 0 && <p>No products selected</p>}
      {items.map(item => (
        <div key={item.product_id} className="order-item">
          <span>{products.find(p => p.id === item.product_id)?.name}</span>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={e => updateQuantity(item.product_id, Number(e.target.value))}
          />
          <button onClick={() => removeProduct(item.product_id)}>Remove</button>
        </div>
      ))}

      <button onClick={submitOrder} disabled={submitting}>
        {submitting ? "Submitting..." : "Place Order"}
      </button>
    </div>
  );
}
