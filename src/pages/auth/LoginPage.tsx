import React from "react";
import { Navbar } from "../../components/layout/Navbar";
import { LoginForm } from "../../features/auth/components/LoginForm";

export const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <LoginForm />
      </main>
    </div>
  );
};

export default LoginPage;
