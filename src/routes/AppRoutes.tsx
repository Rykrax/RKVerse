import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/features/home/pages/HomePage";
import { MainLayout } from "@/components/layout/MainLayout";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { AdminRoute } from "./AdminRoute";
// import AdminComicPage from "@/pages/admin/AdminComicPage";
// import ChapterDetailPage from "@/pages/comic/ChapterDetailPage";
import ComicDetailPage from "@/features/comic/pages/ComicDetailPage";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import ChapterDetailPage from "@/features/chapter/pages/ChapterDetailPage";
import AdminComicPage from "@/features/admin/pages/AdminComicPage";

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />

        <Route path="/comic/:id" element={<ComicDetailPage />} />
        <Route
          path="/comic/:comicId/chapters/:chapterSlug"
          element={<ChapterDetailPage />}
        />

        <Route element={<AdminRoute />}>
          <Route path="/admin/comics" element={<AdminComicPage />} />
        </Route>
      </Route>

      <Route element={<PublicOnlyRoute redirectPath="/" />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

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
