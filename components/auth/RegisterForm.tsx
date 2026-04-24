// 🎨 Register Form
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { UserPlus } from "lucide-react";

export default function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        name,
      });

      if (profileError) {
        setError(profileError.message);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <div>
        <label className="text-[13px] text-[#888]">Ім'я</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb]"
          placeholder="Як вас звати?"
          required
        />
      </div>
      <div>
        <label className="text-[13px] text-[#888]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb]"
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <label className="text-[13px] text-[#888]">Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mt-1 px-3 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb]"
          placeholder="Мінімум 6 символів"
          minLength={6}
          required
        />
      </div>
      {error && <p className="text-[12px] text-[#E5484D]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[6px] bg-[#4CAF50] text-white text-[13px] px-4 py-2 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
      >
        <UserPlus className="w-3.5 h-3.5" />
        {loading ? "Реєстрація..." : "Зареєструватися"}
      </button>
      <p className="text-[12px] text-[#666] text-center">
        Вже є акаунт?{" "}
        <button type="button" onClick={onSwitch} className="text-[#1f6feb] hover:underline">
          Увійти
        </button>
      </p>
    </form>
  );
}
