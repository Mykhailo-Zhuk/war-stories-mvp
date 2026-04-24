// 🎨 Story Full View
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { Heart, BookOpen, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Story } from "@/lib/types";

type Props = {
  story: Story;
  authorName: string;
};

export default function StoryView({ story, authorName }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [isFavorite, setIsFavorite] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const isOwner = user?.id === story.user_id;
  const date = new Date(story.created_at).toLocaleDateString("uk-UA", {
    year: "numeric", month: "long", day: "numeric",
  });

  useEffect(() => {
    if (!user) return;
    supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("story_id", story.id)
      .single()
      .then(({ data }) => setIsFavorite(!!data));
  }, [user, story.id]);

  const toggleFavorite = async () => {
    if (!user) return;
    if (isFavorite) {
      await supabase.from("favorites").delete().eq("user_id", user.id).eq("story_id", story.id);
      setIsFavorite(false);
    } else {
      await supabase.from("favorites").insert({ user_id: user.id, story_id: story.id });
      setIsFavorite(true);
    }
  };

  const deleteStory = async () => {
    if (!isOwner) return;
    await supabase.from("stories").delete().eq("id", story.id);
    router.push("/");
    router.refresh();
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <Link
        href="/"
        className="text-[12px] text-[#888] hover:text-white mb-4 inline-block"
      >
        &larr; До стрічки
      </Link>

      {story.image_url && (
        <img
          src={story.image_url}
          alt={story.title}
          className="w-full max-h-[400px] object-cover rounded-[8px] mb-6"
        />
      )}

      <h1 className="text-[24px] font-bold text-white mb-4">{story.title}</h1>

      <div className="flex items-center gap-4 text-[12px] text-[#666] mb-6">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" /> {authorName}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" /> {date}
        </span>
        {story.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" /> {story.location}
          </span>
        )}
      </div>

      <div className="text-[14px] text-[#c9c9c9] leading-relaxed whitespace-pre-wrap mb-6">
        {story.content}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {story.tags?.map((tag) => (
          <span
            key={tag}
            className="text-[12px] text-[#888] bg-[#222] px-3 py-1 rounded-[6px]"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 border-t border-[#2a2a2a] pt-4">
        <button
          onClick={toggleFavorite}
          className="rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] px-3 py-1.5 flex items-center gap-1.5 hover:bg-[#2a2a2a]"
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? "text-[#E5484D] fill-[#E5484D]" : "text-[#888]"}`} />
          {isFavorite ? "У вибраному" : "У вибране"}
        </button>
        {isOwner && (
          <>
            <Link
              href={`/stories/${story.id}/edit`}
              className="rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] px-3 py-1.5 flex items-center gap-1.5 hover:bg-[#2a2a2a]"
            >
              <Edit className="w-3.5 h-3.5" /> Редагувати
            </Link>
            <button
              onClick={() => setShowDelete(true)}
              className="rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] px-3 py-1.5 flex items-center gap-1.5 hover:bg-[#E5484D]/20"
            >
              <Trash2 className="w-3.5 h-3.5 text-[#E5484D]" /> Видалити
            </button>
          </>
        )}
      </div>

      {showDelete && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="rounded-[8px] border border-[#2a2a2a] bg-[#1e1e1e] p-6 max-w-[400px] mx-4">
            <h3 className="text-[16px] font-semibold text-white mb-2">Видалити історію?</h3>
            <p className="text-[13px] text-[#888] mb-4">Цю дію не можна скасувати.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDelete(false)}
                className="rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[#888] text-[13px] px-4 py-1.5"
              >
                Скасувати
              </button>
              <button
                onClick={deleteStory}
                className="rounded-[6px] bg-[#E5484D] text-white text-[13px] px-4 py-1.5"
              >
                Видалити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
