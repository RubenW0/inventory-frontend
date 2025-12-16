import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./OrderList.css";

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

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = () => {
    setLoading(true);
    fetch("http://127.0.0.1:8000/orders/")
      .then(res => res.json())
      .then((data: Order[]) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading orders:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Orders aan het laden...</p>;

  const formatDate = (date: string) =>
    new Date(date).toLocaleString("nl-NL", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(",", "");

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>Orders</h1>
        <button onClick={() => navigate("/orders/create")}>
          + Nieuwe order
        </button>
      </div>

      <table className="order-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Supplier</th>
            <th>Status</th>
            <th>Created</th>
            <th>Items</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="clickable"
            >
              <td>#{order.id}</td>
              <td>{order.supplier}</td>
              <td className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </td>
              <td>{formatDate(order.created_at)}</td>
              <td>
                <ul>
                  {order.items.map((item, i) => (
                    <li key={i}>
                      {item.product} × {item.quantity} — €{item.price}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
