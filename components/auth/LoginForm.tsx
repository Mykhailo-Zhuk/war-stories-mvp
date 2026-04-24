// 🎨 Login Form
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

export default function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
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
          placeholder="••••••••"
          required
        />
      </div>
      {error && <p className="text-[12px] text-[#E5484D]">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-4 py-2 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50"
      >
        <LogIn className="w-3.5 h-3.5" />
        {loading ? "Вхід..." : "Увійти"}
      </button>
      <p className="text-[12px] text-[#666] text-center">
        Немає акаунту?{" "}
        <button type="button" onClick={onSwitch} className="text-[#1f6feb] hover:underline">
          Зареєструватися
        </button>
      </p>
    </form>
  );
}
