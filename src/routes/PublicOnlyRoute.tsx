import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PublicOnlyRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export const PublicOnlyRoute: React.FC<PublicOnlyRouteProps> = ({
  redirectPath = "/",
  children,
}) => {
  const token = localStorage.getItem("accessToken");

  // Nếu đã có token -> chuyển hướng sang trang chỉ định (mặc định là "/")
  if (token) {
    return <Navigate to={redirectPath} replace />;
  }

  // Nếu chưa đăng nhập -> cho phép render các trang con bên trong
  return children ? <>{children}</> : <Outlet />;
};
