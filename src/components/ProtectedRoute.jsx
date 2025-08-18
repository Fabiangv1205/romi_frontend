import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ roles }) {
  const { isAuth, user } = useAuth();
  if (!isAuth) return <Navigate to="/auth" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
