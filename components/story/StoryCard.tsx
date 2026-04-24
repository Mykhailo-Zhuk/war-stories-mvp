// 🎨 Story Card
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Story } from "@/lib/types";

type Props = {
  story: Story;
  isFavorite?: boolean;
  onToggleFavorite?: (storyId: string) => void;
};

export default function StoryCard({ story, isFavorite, onToggleFavorite }: Props) {
  const excerpt = story.content.slice(0, 120) + (story.content.length > 120 ? "..." : "");
  const authorName = (story as any).author?.name || "Невідомий";
  const date = new Date(story.created_at).toLocaleDateString("uk-UA");

  return (
    <div className="rounded-[8px] border border-[#2a2a2a] bg-[#1e1e1e] p-4 hover:bg-[#222] transition-colors">
      <Link href={`/stories/${story.id}`} className="block">
        <div className="flex items-start justify-between">
          <h3 className="text-[14px] font-medium text-white leading-snug">
            {story.title}
          </h3>
          {onToggleFavorite && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite(story.id);
              }}
              className="ml-2 shrink-0"
            >
              <Heart
                className={`w-4 h-4 ${isFavorite ? "text-[#E5484D] fill-[#E5484D]" : "text-[#666]"}`}
              />
            </button>
          )}
        </div>
        <p className="text-[12px] text-[#888] mt-2 leading-relaxed">{excerpt}</p>
        {story.image_url && (
          <img
            src={story.image_url}
            alt=""
            className="w-full h-[120px] object-cover rounded-[6px] mt-2"
          />
        )}
      </Link>
      <div className="flex items-center gap-2 mt-3">
        {story.tags?.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[11px] text-[#888] bg-[#222] px-2 py-0.5 rounded-[4px]"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[11px] text-[#666]">{authorName}</span>
        <span className="text-[11px] text-[#666]">{date}</span>
      </div>
    </div>
  );
}
