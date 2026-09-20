import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserFromToken } from "@/utils/jwt";

export const AdminRoute: React.FC = () => {
  const user = getUserFromToken();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const rawRoles = user.roles || user.role || [];
  const userRoles = Array.isArray(rawRoles)
    ? rawRoles.map((r) => String(r).toUpperCase())
    : [String(rawRoles).toUpperCase()];

  const isAdmin = userRoles.some(
    (role) =>
      role === "ROLE_ADMIN" ||
      role === "ADMIN" ||
      role === "ROLE_TRANSLATOR" ||
      role === "TRANSLATOR",
  );

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
