import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // hoặc có thể return <LoadingSpinner />
  }

  // Đã đăng nhập -> cho phép truy cập các route con bên trong (qua <Outlet />)
  // Chưa đăng nhập -> chuyển hướng về trang /login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
