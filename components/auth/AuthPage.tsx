// 🎨 Auth Page
"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { ScrollText } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111] px-4">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-[8px] bg-[#E5484D] flex items-center justify-center mx-auto mb-4">
            <ScrollText className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-[24px] font-bold text-white">War Stories</h1>
          <p className="text-[13px] text-[#888] mt-1">
            {isLogin ? "Увійдіть у свій акаунт" : "Створіть акаунт"}
          </p>
        </div>
        <div className="rounded-[8px] border border-[#2a2a2a] bg-[#1e1e1e] p-6">
          {isLogin ? (
            <LoginForm onSwitch={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitch={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
