import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import { MainLayout } from "@/components/layout/MainLayout";
import { PublicOnlyRoute } from "./PublicOnlyRoute";
import { AdminRoute } from "./AdminRoute";
import AdminComicPage from "@/pages/admin/AdminComicPage";
import ComicDetailPage from "@/pages/comic/ComicDetailPage";
import ChapterDetailPage from "@/pages/comic/ChapterDetailPage";

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
