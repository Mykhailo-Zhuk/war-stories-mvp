// 🎨 Dashboard
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { LogOut, FileText, Clock, Heart } from "lucide-react";
import Link from "next/link";
import type { Story } from "@/lib/types";

type Tab = "my" | "drafts" | "favorites";

export default function Dashboard() {
  const { user, profile, signOut, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [tab, setTab] = useState<Tab>("my");
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [favStories, setFavStories] = useState<Story[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [user, loading]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, tab]);

  const loadData = async () => {
    setLoadingData(true);
    const { data: allStories } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    if (allStories) setMyStories(allStories);

    if (tab === "favorites") {
      const { data: favs } = await supabase
        .from("favorites")
        .select("story:story_id(*)")
        .eq("user_id", user!.id);
      if (favs) setFavStories(favs.map((f: any) => f.story).filter(Boolean));
    }
    setLoadingData(false);
  };

  const deleteStory = async (id: string) => {
    await supabase.from("stories").delete().eq("id", id);
    setMyStories((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return null;

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "my", label: "Мої історії", icon: <FileText className="w-3.5 h-3.5" /> },
    { key: "drafts", label: "Чернетки", icon: <Clock className="w-3.5 h-3.5" /> },
    { key: "favorites", label: "Вибране", icon: <Heart className="w-3.5 h-3.5" /> },
  ];

  const currentList = tab === "favorites" ? favStories : tab === "drafts" ? myStories.filter((s) => s.status === "draft") : myStories;

  return (
    <div className="max-w-[700px] mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-bold text-white">Кабінет</h1>
          <p className="text-[12px] text-[#888] mt-1">{profile?.name || user?.email}</p>
        </div>
        <button
          onClick={signOut}
          className="rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] px-3 py-1.5 flex items-center gap-1.5 text-[#888] hover:text-white"
        >
          <LogOut className="w-3.5 h-3.5" /> Вийти
        </button>
      </div>

      <div className="flex gap-1 mb-6 bg-[#1e1e1e] rounded-[6px] p-1">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 text-[12px] py-2 rounded-[4px] transition-colors ${
              tab === t.key
                ? "bg-[#1f6feb] text-white"
                : "text-[#888] hover:text-white"
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {loadingData ? (
        <div className="text-[13px] text-[#888] text-center py-8">Завантаження...</div>
      ) : currentList.length === 0 ? (
        <div className="text-[13px] text-[#888] text-center py-8">
          {tab === "favorites"
            ? "Немає вибраних історій"
            : tab === "drafts"
            ? "Немає чернеток"
            : "Ви ще не створили жодної історії"}
        </div>
      ) : (
        <div className="space-y-2">
          {currentList.map((story) => (
            <div
              key={story.id}
              className="rounded-[8px] border border-[#2a2a2a] bg-[#1e1e1e] p-4 flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <Link href={`/stories/${story.id}`} className="block">
                  <h3 className="text-[13px] text-white font-medium truncate">{story.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-[3px] ${
                      story.status === "published"
                        ? "bg-[#4CAF50]/20 text-[#4CAF50]"
                        : "bg-[#F5A623]/20 text-[#F5A623]"
                    }`}>
                      {story.status === "published" ? "Опубліковано" : "Чернетка"}
                    </span>
                    <span className="text-[11px] text-[#666]">
                      {new Date(story.created_at).toLocaleDateString("uk-UA")}
                    </span>
                  </div>
                </Link>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Link
                  href={`/stories/${story.id}/edit`}
                  className="text-[12px] text-[#888] hover:text-white"
                >
                  Правка
                </Link>
                <button
                  onClick={() => deleteStory(story.id)}
                  className="text-[12px] text-[#E5484D] hover:text-white"
                >
                  Видалити
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
