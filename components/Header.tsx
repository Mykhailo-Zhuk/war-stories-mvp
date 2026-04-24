import { ScrollText } from "lucide-react";

export default function Header() {
  return (
    <header className="border-b border-[#2a2a2a]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[6px] bg-[#E5484D] flex items-center justify-center">
            <ScrollText className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-[16px] font-semibold text-white leading-tight">
              War Stories
            </h1>
            <p className="text-[12px] text-[#888]">
              Історії про війну
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-[13px] text-[#888]">
          <a href="#" className="hover:text-white transition-colors">Стрічка</a>
          <a href="#" className="hover:text-white transition-colors">Додати</a>
        </nav>
      </div>
    </header>
  );
}
