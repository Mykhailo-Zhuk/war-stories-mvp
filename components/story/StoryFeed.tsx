// 🎨 Story Feed
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import StoryCard from "@/components/story/StoryCard";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import type { Story } from "@/lib/types";

export default function StoryFeed() {
  const { user } = useAuth();
  const supabase = createClient();
  const [stories, setStories] = useState<(Story & { author?: { name: string } })[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStories();
    if (user) loadFavorites();
  }, [user]);

  async function loadStories() {
    const { data } = await supabase
      .from("stories")
      .select("*, author:user_id(name)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setStories(data);
    setLoading(false);
  }

  async function loadFavorites() {
    const { data } = await supabase
      .from("favorites")
      .select("story_id")
      .eq("user_id", user!.id);
    if (data) setFavorites(data.map((f) => f.story_id));
  }

  const toggleFavorite = async (storyId: string) => {
    if (!user) return;
    if (favorites.includes(storyId)) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("story_id", storyId);
      setFavorites((prev) => prev.filter((id) => id !== storyId));
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, story_id: storyId });
      setFavorites((prev) => [...prev, storyId]);
    }
  };

  const filtered = stories.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[18px] font-semibold text-white">
          Стрічка історій
        </h2>
        <Link
          href="/stories/new"
          className="rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-3 py-1.5 flex items-center gap-1.5 hover:opacity-90"
        >
          <Plus className="w-3.5 h-3.5" />
          Нова історія
        </Link>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb]"
          placeholder="Пошук історій..."
        />
      </div>

      {loading ? (
        <div className="text-[13px] text-[#888] text-center py-8">Завантаження...</div>
      ) : filtered.length === 0 ? (
        <div className="text-[13px] text-[#888] text-center py-8">
          {search ? "Нічого не знайдено" : "Ще немає історій. Будьте першим!"}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              isFavorite={favorites.includes(story.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
