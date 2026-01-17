import { useEffect, useState, useContext } from "react";
import { apiFetch } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import "./AdminUsersPage.css";

interface User {
  id: number;
  username: string;
  email: string;
  role: "admin" | "staff" | "employee";
  is_active: boolean;
  date_created: string;
}

export default function AdminUsersPage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  if (user?.role !== "admin") {
    return <p style={{ padding: 20 }}>You do not have permission to view this page.</p>;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await apiFetch("/users/");
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRole = async (id: number, newRole: string) => {
    try {
      await apiFetch(`/users/${id}/update-role/`, {
        method: "PUT",
        body: JSON.stringify({ role: newRole }),
      });

      // Refresh list
      fetchUsers();
    } catch (err) {
      console.error("Failed to update role:", err);
      alert("Failed to update role.");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading users...</p>;

  return (
    <div className="admin-users-page">
      <h1>User Management</h1>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Date Created</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>

              <td>
                <select
                className="role-select"
                value={u.role}
                onChange={(e) => updateRole(u.id, e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="employee">Employee</option>
                </select>
              </td>

              <td>{new Date(u.date_created).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
