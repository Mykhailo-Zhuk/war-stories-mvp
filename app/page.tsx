// 🎨 Home — Story Feed
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/components/auth/AuthProvider";
import StoryFeed from "@/components/story/StoryFeed";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
      <AuthProvider>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-[28px] font-bold text-white leading-tight">
              War Stories
            </h1>
            <p className="text-[13px] text-[#888] mt-2 max-w-[600px]">
              Платформа для створення та перегляду історій про війну.
              Діліться спогадами, читайте досвід побратимів.
            </p>
          </div>
          <StoryFeed />
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}
