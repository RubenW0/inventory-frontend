import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  supplier: string;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/orders/${id}/`) // let op de trailing slash!
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Failed to load order");
        setLoading(false);
      });
  }, [id]);

  const markAsDelivered = async () => {
    if (!order) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`http://127.0.0.1:8000/orders/${id}/receive/`, { // slash toegevoegd
        method: "POST",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to mark as delivered");
      }

      // refresh order data after marking as delivered
      const updatedOrder = await fetch(`http://127.0.0.1:8000/orders/${id}/`).then(r => r.json());
      setOrder(updatedOrder);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error marking as delivered");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Order laden...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="order-page">
      <h1>Order #{order?.id}</h1>

      <p><strong>Supplier:</strong> {order?.supplier}</p>
      <p><strong>Status:</strong> {order?.status}</p>
      <p><strong>Created:</strong> {order?.created_at}</p>

      <h3>Items</h3>
      <ul>
        {order?.items.map((item, i) => (
          <li key={i}>
            {item.product} × {item.quantity} — €{item.price}
          </li>
        ))}
      </ul>

      {order?.status !== "received" && (
        <button onClick={markAsDelivered} disabled={submitting}>
          {submitting ? "Submitting..." : "Mark as delivered"}
        </button>
      )}
    </div>
  );
}
