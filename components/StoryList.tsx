import { Plus, History } from "lucide-react";

const STORIES = [
  {
    id: 1,
    title: "Битва за Бахмут",
    author: "Ветеран",
    excerpt: "Спогади про оборону міста...",
    date: "22.04.2026",
    tags: ["Бахмут", "Піхота"],
  },
  {
    id: 2,
    title: "Робота артилерії",
    author: "Артилерист",
    excerpt: "Як ми працювали на гарматах...",
    date: "21.04.2026",
    tags: ["Артилерія", "Донеччина"],
  },
  {
    id: 3,
    title: "Евакуація поранених",
    author: "Медик",
    excerpt: "Історія порятунку побратимів під обстрілами...",
    date: "20.04.2026",
    tags: ["Медицина", "Евакуація"],
  },
];

export default function StoryList() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#1f6feb]" />
          <h2 className="text-[18px] font-semibold text-white">
            Стрічка історій
          </h2>
        </div>
        <button className="rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-3 py-1.5 flex items-center gap-1.5 hover:opacity-90 transition-opacity">
          <Plus className="w-3.5 h-3.5" />
          Додати
        </button>
      </div>
      <div className="space-y-3">
        {STORIES.map((story) => (
          <div
            key={story.id}
            className="rounded-[8px] border border-[#2a2a2a] bg-[#1e1e1e] p-4 hover:bg-[#222] transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-[13px] font-medium text-white">
                {story.title}
              </h3>
              <span className="text-[11px] text-[#666]">{story.date}</span>
            </div>
            <p className="text-[12px] text-[#888] mt-1.5">{story.excerpt}</p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-[#888] bg-[#222] px-2 py-0.5 rounded-[4px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <span className="text-[11px] text-[#666]">{story.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
