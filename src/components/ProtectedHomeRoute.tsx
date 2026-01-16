import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedHomeRoute() {
  const { user } = useContext(AuthContext);

  // Niet ingelogd → naar login
  if (!user) return <Navigate to="/login" />;

  // Wel ingelogd → naar products
  return <Navigate to="/products" />;
}
