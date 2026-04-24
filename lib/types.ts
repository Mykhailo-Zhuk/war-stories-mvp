// 🎨 Types
export type Story = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  location: string | null;
  image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
  author?: { name: string; avatar_url: string | null };
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
  created_at: string;
};
