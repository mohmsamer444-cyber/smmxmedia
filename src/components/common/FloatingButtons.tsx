import React from 'react';
import { Send } from 'lucide-react';

export const FloatingButtons: React.FC = () => {
  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col gap-3 pointer-events-auto">
      {/* Telegram Floating Button - Gold Halo, Dark Background, Amber Paper-plane Icon */}
      <a
        href="https://t.me/fx_sa2"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر تيليجرام"
        className="w-12 h-12 rounded-full bg-[#121212] border border-[#333333] text-[#FFB432] flex items-center justify-center animate-gold-pulse hover:scale-110 active:scale-95 transition-all duration-300"
        title="انضم لقناة التيليجرام الرسمية"
      >
        <Send className="w-5 h-5 -translate-x-0.5 translate-y-0.5 stroke-[2.2]" />
      </a>
    </div>
  );
};
