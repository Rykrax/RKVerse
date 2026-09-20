import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  Search,
  Bookmark,
  ChevronDown,
  User as UserIcon,
  LogOut,
  PlusCircle,
} from "lucide-react";
import { Button } from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { getUserFromToken, type UserProfile } from "@/utils/jwt";
import authApi from "@/api/auth";

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lấy thông tin user khi component mount
  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
  }, []);

  // Đóng dropdown khi click ra ngoài vùng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.warn("Backend logout error, proceeding client cleanup", error);
    } finally {
      localStorage.removeItem("accessToken");
      setUser(null);
      setIsDropdownOpen(false);
      navigate("/login");
    }
  };

  // Trích xuất và kiểm tra role từ token (hỗ trợ cả dạng string và array)
  const rawRoles = user?.roles || user?.role || [];
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

  const username = user?.username || "user";
  const avatarLetter = username.charAt(0).toUpperCase();

  return (
    <header className="fixed top-0 left-0 z-50 w-full bg-white border-b border-slate-100 px-6 lg:px-12 py-3 flex items-center justify-between">
      {/* Brand Logo */}
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-10 h-10 rounded-xl border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
          <BookOpen className="w-5 h-5 stroke-[2.2]" />
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-black tracking-tight text-slate-800 leading-none">
            RK<span className="text-indigo-600">Verse</span>
          </span>
          <span className="text-[11px] font-medium text-slate-400 tracking-wide mt-1">
            Thế Giới Truyện Tranh
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-lg mx-8 hidden sm:block">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm tên truyện, tác giả..."
            className="w-full pl-11 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-full text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition-all"
          />
        </div>
      </div>

      {/* Right Side Navigation */}
      {user ? (
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Nút Tủ Sách */}
          <button
            type="button"
            onClick={() => navigate("/bookmark")}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-slate-500" />
            <span>Tủ Sách</span>
          </button>

          {/* Nút Quản Lý Đăng Truyện (Chỉ hiển thị cho Admin / Translator) */}
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate("/admin/comics")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-emerald-200 bg-emerald-50/50 hover:bg-emerald-50 text-emerald-700 text-xs font-semibold transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Quản Lý Đăng Truyện</span>
            </button>
          )}

          {/* User Profile Pill & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100">
                {avatarLetter}
              </div>
              <span className="text-xs font-semibold text-slate-700 max-w-[90px] truncate">
                {username}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-56 bg-white rounded-2xl shadow-[0_12px_36px_rgba(0,0,0,0.08)] border border-slate-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-100">
                {/* Header Info */}
                <div className="px-2 py-1.5">
                  <div className="text-sm font-bold text-slate-800 leading-tight">
                    {username}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    @{username}
                  </div>

                  {/* Badge Chức Vụ */}
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60 tracking-wider">
                      ★ QUẢN TRỊ VIÊN
                    </span>
                  ) : (
                    <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100 tracking-wider">
                      ĐỘC GIẢ
                    </span>
                  )}
                </div>

                <div className="h-px bg-slate-100 my-2" />

                {/* Nav Links */}
                <div className="space-y-0.5 text-xs text-slate-600">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/bookmark");
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 font-medium text-left transition-colors"
                  >
                    <Bookmark className="w-4 h-4 text-slate-400" />
                    <span>Tủ sách cá nhân</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate("/profile");
                    }}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-slate-50 font-medium text-left transition-colors"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" />
                    <span>Thông tin cá nhân</span>
                  </button>

                  {/* Mục Quản lý đăng truyện trong dropdown */}
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        navigate("/admin/comics");
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-emerald-50 text-emerald-700 font-medium text-left transition-colors"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-600" />
                      <span>Quản lý đăng truyện</span>
                    </button>
                  )}

                  <div className="h-px bg-slate-100 my-1" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-50 text-red-500 font-medium text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Guest Buttons */
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            className="px-3.5 py-1.5 text-xs font-semibold"
            onClick={() => navigate("/login")}
          >
            Đăng Nhập
          </Button>
          <Button
            variant="primary"
            className="px-4 py-1.5 text-xs font-semibold rounded-full"
            onClick={() => navigate("/register")}
          >
            Đăng Ký
          </Button>
        </div>
      )}
    </header>
  );
};
