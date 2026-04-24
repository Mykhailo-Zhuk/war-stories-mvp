// 🎨 Footer
import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] mt-12">
      <div className="container mx-auto px-4 py-6 flex items-center justify-between">
        <p className="text-[12px] text-[#666]">
          War Stories MVP &copy; {new Date().getFullYear()}
        </p>
        <div className="flex items-center gap-4 text-[12px] text-[#888]">
          <a href="#" className="hover:text-white transition-colors">GitHub</a>
          <a href="#" className="hover:text-white transition-colors">Про проект</a>
          <Globe className="w-3.5 h-3.5 text-[#666]" />
        </div>
      </div>
    </footer>
  );
}
