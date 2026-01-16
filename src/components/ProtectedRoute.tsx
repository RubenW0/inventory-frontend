import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import type { ReactElement } from "react";

interface Props {
  element: ReactElement;
  roles?: string[];
}

export default function ProtectedRoute({ element, roles }: Props) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return element;
}
