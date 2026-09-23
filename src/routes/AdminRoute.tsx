// import React from "react";
// import { Navigate, Outlet } from "react-router-dom";
// import { getUserFromToken } from "@/utils/jwt";

// export const AdminRoute: React.FC = () => {
//   const user = getUserFromToken();

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   const rawRoles = user.roles || user.role || [];
//   const userRoles = Array.isArray(rawRoles)
//     ? rawRoles.map((r) => String(r).toUpperCase())
//     : [String(rawRoles).toUpperCase()];

//   const isAdmin = userRoles.some(
//     (role) =>
//       role === "ROLE_ADMIN" ||
//       role === "ADMIN" ||
//       role === "ROLE_TRANSLATOR" ||
//       role === "TRANSLATOR",
//   );

//   if (!isAdmin) {
//     return <Navigate to="/" replace />;
//   }

//   return <Outlet />;
// };

import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export const AdminRoute: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Đang kiểm tra token / lấy profile lúc F5 thì chờ, tránh đá nhầm về /login
  if (isLoading) {
    return null; // hoặc <LoadingSpinner />
  }

  // Chưa đăng nhập -> chuyển hướng về trang đăng nhập
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Chuẩn hóa role (hỗ trợ cả dạng mảng lẫn chuỗi đơn lẻ)
  const rawRoles = user.roles || (user as any).role || [];
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

  // Đã đăng nhập nhưng không có quyền -> đá về trang chủ
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Đủ quyền -> cho phép truy cập
  return <Outlet />;
};
