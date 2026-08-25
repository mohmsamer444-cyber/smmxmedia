import React from 'react';
import { Send } from 'lucide-react';

export const FloatingButtons: React.FC = () => {
  return (
    <div className="fixed bottom-20 left-4 z-40 flex flex-col gap-3 pointer-events-auto">
      {/* WhatsApp Floating Button - Gold Halo, Dark Background, Real WhatsApp Glyph */}
      <a
        href="https://wa.me/966501234567"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="تواصل عبر واتساب"
        className="w-12 h-12 rounded-full bg-[#121212] border border-[#333333] text-[#FFB432] flex items-center justify-center animate-gold-pulse hover:scale-110 active:scale-95 transition-all duration-300"
        title="تواصل مع الوكيل عبر واتساب"
      >
        <svg
          viewBox="0 0 24 24"
          width="22"
          height="22"
          fill="currentColor"
          className="text-[#FFB432]"
        >
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.333 4.993L2 22l5.233-1.337a9.957 9.957 0 0 0 4.77 1.222h.005c5.505 0 9.989-4.478 9.99-9.985A9.97 9.97 0 0 0 12.012 2zm0 18.29h-.004a8.31 8.31 0 0 1-4.237-1.16l-.304-.18-3.149.805.838-3.07-.198-.315a8.3 8.3 0 0 1-1.272-4.382c.001-4.58 3.731-8.308 8.314-8.308a8.28 8.28 0 0 1 5.877 2.434 8.28 8.28 0 0 1 2.43 5.874c-.001 4.581-3.731 8.31-8.312 8.31zm4.558-6.222c-.25-.125-1.477-.729-1.706-.812-.229-.083-.396-.125-.562.125-.167.25-.646.812-.792.979-.146.167-.292.188-.542.062a6.85 6.85 0 0 1-2.014-1.243 7.548 7.548 0 0 1-1.393-1.737c-.146-.25-.016-.385.11-.51.112-.11.25-.292.375-.438.125-.146.167-.25.25-.417.083-.167.042-.312-.021-.438-.062-.125-.562-1.354-.771-1.854-.204-.488-.411-.422-.562-.43-.146-.008-.312-.008-.479-.008s-.438.062-.667.312c-.229.25-.875.854-.875 2.083s.896 2.417 1.021 2.583c.125.167 1.764 2.694 4.274 3.777.597.257 1.063.411 1.426.526.598.19 1.142.163 1.572.099.48-.071 1.477-.604 1.686-1.188.208-.583.208-1.083.146-1.188-.063-.104-.229-.166-.479-.291z" />
        </svg>
      </a>

      {/* Telegram Floating Button - Gold Halo, Dark Background, Amber Paper-plane Icon */}
      <a
        href="https://t.me/alsharq_world_official"
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

