// 🎨 Story Detail Page
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryView from "@/components/story/StoryView";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Story } from "@/lib/types";

export default function StoryPage() {
  const params = useParams();
  const id = params?.id as string;
  const supabase = createClient();
  const [story, setStory] = useState<Story | null>(null);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    loadStory();
  }, [id]);

  async function loadStory() {
    const { data, error: err } = await supabase
      .from("stories")
      .select("*, author:user_id(name)")
      .eq("id", id)
      .single();

    if (err || !data) {
      setError("Історія не знайдена");
      setLoading(false);
      return;
    }

    setStory(data);
    setAuthorName((data as any).author?.name || "Невідомий");
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-[13px] text-[#888]">Завантаження...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
        <Header />
        <main className="flex-1 flex items-center justify-center flex-col gap-4">
          <div className="text-[13px] text-[#E5484D]">{error || "Історія не знайдена"}</div>
          <Link href="/" className="rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-4 py-2">
            До стрічки
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
      <AuthProvider>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <StoryView story={story} authorName={authorName} />
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}
