// 🎨 Edit Story
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryForm from "@/components/story/StoryForm";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Story } from "@/lib/types";

export default function EditStoryPage() {
  const params = useParams();
  const id = params?.id as string;
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || authLoading) return;
    loadStory();
  }, [id, user?.id, authLoading]);

  async function loadStory() {
    if (!user) {
      setError("Увійдіть, щоб редагувати");
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .single();

    if (err || !data) {
      setError("Історія не знайдена");
      setLoading(false);
      return;
    }

    if (data.user_id !== user.id) {
      setError("Немає доступу до цієї історії");
      setLoading(false);
      return;
    }

    setStory(data);
    setLoading(false);
  }

  if (authLoading || loading) {
    return (
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-[13px] text-[#888]">Завантаження...</div>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    );
  }

  if (error) {
    return (
      <AuthProvider>
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
          <Header />
          <main className="flex-1 flex items-center justify-center flex-col gap-4">
            <div className="text-[13px] text-[#E5484D]">{error}</div>
            <Link href="/dashboard" className="rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-4 py-2">
              До кабінету
            </Link>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    );
  }

  if (!story) return null;

  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <StoryForm story={story} />
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}
