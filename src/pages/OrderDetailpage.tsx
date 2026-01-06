import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../api/api";

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

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/orders/${id}/`);
      setOrder(data);
    } catch {
      setError("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const markAsDelivered = async () => {
    if (!order) return;
    setSubmitting(true);
    setError(null);

    try {
      await apiFetch(`/orders/${id}/receive/`, { method: "POST" });
      const updated = await apiFetch(`/orders/${id}/`);
      setOrder(updated);
    } catch (err: any) {
      setError(err.message || "Error marking as delivered");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading order...</p>;
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
