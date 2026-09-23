import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/features/home/pages/HomePage";
import { MainLayout } from "@/components/layout/MainLayout";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { AdminRoute } from "./AdminRoute";
// import { ProtectedRoute } from
import ComicDetailPage from "@/features/comic/pages/ComicDetailPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ChapterDetailPage from "@/features/chapter/pages/ChapterDetailPage";
import AdminComicPage from "@/features/admin/pages/AdminComicPage";
import ProfilePage from "@/features/user/pages/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* 1. Public Routes (Ai cũng xem được) */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/comic/:id" element={<ComicDetailPage />} />
        <Route
          path="/comic/:comicId/chapters/:chapterSlug"
          element={<ChapterDetailPage />}
        />

        {/* 2. Protected Routes (Bắt buộc phải đăng nhập) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* 3. Admin / Translator Routes (Yêu cầu quyền hạn cao) */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/comics" element={<AdminComicPage />} />
        </Route>
      </Route>

      {/* 4. Guest Only Routes (Đã đăng nhập thì đá về "/") */}
      <Route element={<PublicOnlyRoute redirectPath="/" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 5. Fallback 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center text-slate-500 font-medium">
            404 - Trang không tồn tại
          </div>
        }
      />
    </Routes>
  );
};
