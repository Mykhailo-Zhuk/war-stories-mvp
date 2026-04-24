// 🎨 Header
"use client";

import { useState } from "react";
import { ScrollText, User, Menu, X, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-[#2a2a2a]">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#E5484D] flex items-center justify-center">
            <ScrollText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-[16px] font-semibold text-white leading-tight">
              War Stories
            </h1>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-4 text-[13px] text-[#888]">
          <Link href="/" className="hover:text-white transition-colors">Стрічка</Link>
          <Link href="/stories/new" className="hover:text-white transition-colors">Написати</Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <User className="w-3.5 h-3.5" /> Кабінет
          </Link>
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Вийти
            </button>
          ) : (
            <Link
              href="/auth"
              className="rounded-[6px] bg-[#1f6feb] text-white px-3 py-1.5 hover:opacity-90 text-[12px]"
            >
              Увійти
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-[#888]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#2a2a2a] px-4 py-3 space-y-3">
          <Link href="/" className="block text-[13px] text-[#888] hover:text-white" onClick={() => setMenuOpen(false)}>Стрічка</Link>
          <Link href="/stories/new" className="block text-[13px] text-[#888] hover:text-white" onClick={() => setMenuOpen(false)}>Написати історію</Link>
          <Link href="/dashboard" className="block text-[13px] text-[#888] hover:text-white" onClick={() => setMenuOpen(false)}>Кабінет</Link>
          {user ? (
            <button
              onClick={() => { signOut(); setMenuOpen(false); }}
              className="block text-[13px] text-[#E5484D] hover:text-white"
            >
              Вийти
            </button>
          ) : (
            <Link
              href="/auth"
              className="block rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-4 py-2 text-center"
              onClick={() => setMenuOpen(false)}
            >
              Увійти
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
