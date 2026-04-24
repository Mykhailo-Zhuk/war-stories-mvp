// 🎨 Edit Story
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { useAuth } from "@/components/auth/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryForm from "@/components/story/StoryForm";
import { useParams, useRouter } from "next/navigation";
import type { Story } from "@/lib/types";

export default function EditStoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const supabase = createClient();
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || authLoading) return;
    loadStory();
  }, [id, authLoading]);

  async function loadStory() {
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

    if (!user || data.user_id !== user.id) {
      router.push("/auth");
      return;
    }

    setStory(data);
    setLoading(false);
  }

  if (loading || authLoading) {
    return <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <div className="text-[13px] text-[#888]">Завантаження...</div>
    </div>;
  }

  if (error || !story) {
    return <div className="min-h-screen bg-[#111] flex items-center justify-center">
      <div className="text-[13px] text-[#E5484D]">{error || "Історія не знайдена"}</div>
    </div>;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <StoryForm story={story} onDone={() => router.push("/dashboard")} />
      </main>
      <Footer />
    </div>
  );
}
