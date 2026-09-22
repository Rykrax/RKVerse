import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { RegisterForm } from "../components/RegisterForm";

export const RegisterPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] pt-[57px]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        <RegisterForm />
      </main>
    </div>
  );
};

export default RegisterPage;
