// 🎨 Create/Edit Story Form
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";
import { Save, Send, ImagePlus, X } from "lucide-react";
import type { Story } from "@/lib/types";
import Link from "next/link";

type Props = {
  story?: Story;
  onDone?: () => void;
};

const supabase = createClient();

export default function StoryForm({ story, onDone }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState(story?.title ?? "");
  const [content, setContent] = useState(story?.content ?? "");
  const [location, setLocation] = useState(story?.location ?? "");
  const [tagsInput, setTagsInput] = useState(story?.tags?.join(", ") ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(story?.image_url ?? null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const saveStory = async (status: "draft" | "published") => {
    if (!title.trim() || !content.trim()) {
      setError("Назва та текст обов'язкові");
      return;
    }
    setSaving(true);
    setError("");

    let imageUrl = story?.image_url ?? null;
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const filePath = `${user!.id}/${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("story-photos")
        .upload(filePath, imageFile);

      if (uploadError) {
        setError(uploadError.message);
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage
        .from("story-photos")
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const payload = {
      title: title.trim(),
      content: content.trim(),
      location: location.trim() || null,
      image_url: imageUrl,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      status,
    };

    if (story) {
      const { error: updateError } = await supabase
        .from("stories")
        .update(payload)
        .eq("id", story.id);
      if (updateError) {
        setError(updateError.message);
        setSaving(false);
        return;
      }
    } else {
      const { error: insertError } = await supabase
        .from("stories")
        .insert({ ...payload, user_id: user!.id });
      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    if (onDone) onDone();
    router.refresh();
    router.push("/dashboard");
  };

  if (authLoading) return null;

  if (!user) {
    return (
      <div className="rounded-[8px] border border-[#2a2a2a] bg-[#1e1e1e] p-6 max-w-[700px] mx-auto text-center">
        <p className="text-[13px] text-[#888] mb-4">Увійдіть, щоб створити історію</p>
        <Link href="/auth" className="rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-4 py-2 hover:opacity-90">
          Увійти
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-[#2a2a2a] bg-[#1e1e1e] p-6 max-w-[700px] mx-auto">
      <h2 className="text-[18px] font-semibold text-white mb-6">
        {story ? "Редагувати історію" : "Нова історія"}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-[13px] text-[#888]">Назва *</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb]"
            placeholder="Назва історії"
          />
        </div>

        <div>
          <label className="text-[13px] text-[#888]">Текст *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            className="w-full mt-1 px-3 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb] resize-y"
            placeholder="Напишіть вашу історію..."
          />
        </div>

        <div>
          <label className="text-[13px] text-[#888]">Місце</label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb]"
            placeholder="Де це сталося?"
          />
        </div>

        <div>
          <label className="text-[13px] text-[#888]">Теги (через кому)</label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[13px] text-white outline-none focus:border-[#1f6feb]"
            placeholder="війна, Бахмут, піхота"
          />
        </div>

        <div>
          <label className="text-[13px] text-[#888]">Фото</label>
          <div className="mt-1 relative">
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-[200px] object-cover rounded-[6px]"
                />
                <button
                  type="button"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-[#111]/80 text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center p-6 border-2 border-dashed border-[#2a2a2a] rounded-[6px] cursor-pointer hover:border-[#1f6feb]">
                <ImagePlus className="w-6 h-6 text-[#888]" />
                <span className="ml-2 text-[13px] text-[#888]">Додати фото</span>
                <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
              </label>
            )}
          </div>
        </div>

        {error && <p className="text-[12px] text-[#E5484D]">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            onClick={() => saveStory("draft")}
            disabled={saving}
            className="rounded-[6px] bg-[#222] border border-[#2a2a2a] text-[#888] text-[13px] px-4 py-2 flex items-center gap-2 hover:bg-[#2a2a2a] disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {saving ? "Збереження..." : "Чернетка"}
          </button>
          <button
            onClick={() => saveStory("published")}
            disabled={saving}
            className="rounded-[6px] bg-[#1f6feb] text-white text-[13px] px-4 py-2 flex items-center gap-2 hover:opacity-90 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            {saving ? "Публікація..." : "Опублікувати"}
          </button>
        </div>
      </div>
    </div>
  );
}
