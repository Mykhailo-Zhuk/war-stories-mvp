// 🎨 Dashboard Page
"use client";

import { AuthProvider } from "@/components/auth/AuthProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#111" }}>
      <AuthProvider>
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Dashboard />
        </main>
        <Footer />
      </AuthProvider>
    </div>
  );
}
