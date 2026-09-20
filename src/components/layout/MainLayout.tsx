import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

export const MainLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <Navbar />

      {/* Thêm pt-[65px] để toàn bộ các page tự động nằm dưới Navbar, không bị che mất */}
      <main className="flex-1 pt-[65px] pb-12">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
