// 🎨 New Story
"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StoryForm from "@/components/story/StoryForm";

export default function NewStoryPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
      <AuthProvider>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <StoryForm />
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}
