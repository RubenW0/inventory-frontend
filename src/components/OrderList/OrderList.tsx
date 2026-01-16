import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api/api";
import "./OrderList.css";
import { AuthContext } from "../../context/AuthContext";

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
  const [sortBy, setSortBy] = useState("created_at");

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/orders/");
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="loading">Orders aan het laden...</p>;

  const formatDate = (date: string) =>
    new Date(date)
      .toLocaleString("nl-NL", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
      .replace(",", "");

  const sortedOrders = [...orders].sort((a, b) => {
    if (sortBy === "created_at") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
    if (sortBy === "status") {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  return (
    <div className="order-page">
      <div className="order-header">
        <h1>Orders</h1>

        <div className="order-actions">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="created_at">Sort on date</option>
            <option value="status">Sort on status</option>
          </select>

          {(user?.role === "admin" || user?.role === "staff") && (
            <button className="add-btn" onClick={() => navigate("/orders/create")}>
              + New Order
            </button>
          )}
        </div>
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
          {sortedOrders.map((order) => (
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
