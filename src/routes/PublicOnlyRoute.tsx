import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface PublicOnlyRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  redirectPath = "/",
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Đang trong quá trình khôi phục phiên (F5/kiểm tra token) -> chờ, không render vội
  if (isLoading) {
    return null; // hoặc có thể trả về một LoadingSpinner nhẹ
  }

  // Nếu đã đăng nhập -> đá về trang chỉ định (mặc định là "/")
  if (isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Nếu chưa đăng nhập -> cho phép vào các trang công khai (Login, Register...)
  return children ? <>{children}</> : <Outlet />;
};
