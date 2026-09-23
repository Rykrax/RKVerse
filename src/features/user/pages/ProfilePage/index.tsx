import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, RotateCw, KeyRound, LogOut } from "lucide-react";
import userApi from "../../api";
import authApi from "@/features/auth/api";
import type { ProfileData } from "../../types";
import { ProfileHeader } from "../../components/ProfileHeader";
import { ProfileHeroCard } from "../../components/ProfileHeroCard";
import { ProfileDetailItem } from "../../components/ProfileDetailItem";

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col gap-5">
      <div className="bg-slate-100 rounded-2xl p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-slate-200 shrink-0" />
        <div className="flex flex-col gap-2 w-full">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-3.5 bg-slate-200 rounded w-1/4" />
          <div className="h-5 bg-slate-200 rounded-full w-28 mt-0.5" />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="h-4 bg-slate-200 rounded w-28 mb-1" />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col gap-1.5"
          >
            <div className="h-3.5 bg-slate-200 rounded w-1/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2 ml-5" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getRoleLabel = (role?: string) => {
    switch (role?.toUpperCase()) {
      case "TRANSLATOR":
      case "ROLE_TRANSLATOR":
        return "Dịch giả";
      case "ADMIN":
      case "ROLE_ADMIN":
        return "Quản trị viên";
      case "USER":
      case "ROLE_USER":
        return "Thành viên";
      default:
        return role || "Thành viên";
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getProfile();

      if (!response.data) {
        throw new Error("Lỗi tải dữ liệu");
      }

      const data: ProfileData = response.data || response;
      setProfile(data);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin trang cá nhân");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditDisplayName = async () => {
    if (!profile) return;

    const newName = prompt(
      "Nhập Tên Hiển Thị mới:",
      profile.displayName || profile.username,
    );
    if (!newName || newName.trim() === "" || newName === profile.displayName) {
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch("/api/users/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ displayName: newName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Không thể cập nhật tên hiển thị");
      }

      setProfile((prev) =>
        prev ? { ...prev, displayName: newName.trim() } : null,
      );
    } catch (err: any) {
      alert(err.message || "Đã xảy ra lỗi khi cập nhật!");
    }
  };

  const handleLogout = async () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn đăng xuất không?",
    );
    if (!isConfirmed) return;

    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Backend logout error, proceeding client cleanup", error);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/");
    }
  };

  const currentRole = (profile as any)?.roles?.[0] || profile?.role || "USER";

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 flex justify-center items-start font-sans antialiased text-slate-800">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-5">
        {/* Header */}
        <ProfileHeader onBack={handleBack} />

        {/* Trạng thái 1: Đang tải */}
        {loading && <ProfileSkeleton />}

        {/* Trạng thái 2: Lỗi */}
        {!loading && error && (
          <div className="p-5 text-center bg-red-50 border border-red-200 rounded-xl flex flex-col items-center gap-2.5">
            <p className="text-red-600 font-medium text-xs">{error}</p>
            <button
              onClick={fetchProfile}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition cursor-pointer"
            >
              <RotateCw className="w-3 h-3" /> Thử lại
            </button>
          </div>
        )}

        {/* Trạng thái 3: Hiển thị dữ liệu */}
        {!loading && !error && profile && (
          <>
            {/* Hero Card */}
            <ProfileHeroCard
              displayName={profile.displayName || profile.username}
              username={profile.username}
              roleLabel={getRoleLabel(currentRole)}
            />

            {/* Chi tiết tài khoản */}
            <section className="flex flex-col gap-2.5">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                Chi Tiết Tài Khoản
              </h3>

              <div className="flex flex-col gap-2.5">
                <ProfileDetailItem
                  icon={User}
                  label="Tên Hiển Thị"
                  value={profile.displayName || profile.username}
                  isEditable={true}
                  onEdit={handleEditDisplayName}
                />

                <ProfileDetailItem
                  icon={User}
                  label="Tên Đăng Nhập"
                  value={`${profile.username}`}
                />

                <ProfileDetailItem
                  icon={Mail}
                  label="Email"
                  value={profile.email}
                />

                {/* <ProfileDetailItem
                  icon={Shield}
                  label="Vai Trò Hệ Thống"
                  value={currentRole}
                /> */}
              </div>
            </section>

            {/* Khối các nút hành động phía dưới */}
            <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
              <button
                onClick={() => navigate("/change-password")}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs transition cursor-pointer"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Đổi Mật Khẩu</span>
              </button>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng Xuất</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
