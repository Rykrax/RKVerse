import { useNavigate } from "react-router-dom";
import { User, Mail, Shield, KeyRound, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProfileHeader } from "../../components/ProfileHeader";
import { ProfileHeroCard } from "../../components/ProfileHeroCard";
import { ProfileDetailItem } from "../../components/ProfileDetailItem";
import { getRoleLabel } from "@/utils/common";
import userApi from "../../api";

export default function ProfilePage() {
  const navigate = useNavigate();
  // Lấy dữ liệu và các hàm trực tiếp từ AuthContext (đang nằm sẵn trên RAM)
  const { user, updateUser, logout } = useAuth();

  const handleBack = () => {
    navigate(-1);
  };

  const handleEditDisplayName = async (newName: string) => {
    try {
      await userApi.changeDisplayName({ displayName: newName });
      updateUser({ displayName: newName });
    } catch (err: any) {
      const errorData = err.response?.data;
      const fieldError = errorData?.data?.displayName;
      const errorMessage =
        fieldError ||
        errorData?.message ||
        err.message ||
        "Đã xảy ra lỗi khi cập nhật!";

      alert(errorMessage);
      throw err;
    }
  };

  const handleLogout = async () => {
    const isConfirmed = window.confirm(
      "Bạn có chắc chắn muốn đăng xuất không?",
    );
    if (!isConfirmed) return;

    await logout();
    navigate("/");
  };

  // Nếu chưa có dữ liệu user (hoặc chưa đăng nhập)
  if (!user) {
    return null;
  }

  const currentRole =
    (user as any)?.roles?.[0] || (user as any)?.role || "USER";

  return (
    <div className="min-h-screen bg-slate-50/60 py-8 px-4 flex justify-center items-start font-sans antialiased text-slate-800">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-100 flex flex-col gap-5">
        {/* Header */}
        <ProfileHeader onBack={handleBack} />

        {/* Hero Card */}
        <ProfileHeroCard
          displayName={user.displayName || user.username}
          username={user.username}
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
              value={user.displayName || user.username}
              isEditable={true}
              onEdit={handleEditDisplayName}
            />

            <ProfileDetailItem
              icon={User}
              label="Tên Đăng Nhập"
              value={`@${user.username}`}
            />

            <ProfileDetailItem
              icon={Mail}
              label="Email"
              value={user.email || "Chưa cập nhật"}
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
      </div>
    </div>
  );
}
