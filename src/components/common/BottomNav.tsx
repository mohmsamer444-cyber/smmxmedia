import React from 'react';
import { useApp } from '../../context/AppContext';
import { motion } from 'motion/react';
import {
  Home,
  Layers,
  Plus,
  Send,
  Gamepad2,
} from 'lucide-react';

const TELEGRAM_ORDER_LINK = 'https://t.me/fx_sa2';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openQuickActionModal } = useApp();

  // Active status indicators
  const isHomeActive = activeTab === 'feed';
  const isServicesActive = activeTab === 'services';
  const isGamesActive = activeTab === 'games';

  const openTelegram = () => {
    window.open(TELEGRAM_ORDER_LINK, '_blank', 'noopener,noreferrer');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-full z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#1a1a1a] pb-safe">
      <div className="max-w-md mx-auto px-1 h-16 flex items-center justify-between relative">
        {/* Slot 1: الرئيسية */}
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
            isHomeActive
              ? 'text-[#0088CC] font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isHomeActive && (
            <motion.span layoutId="nav-indicator" className="absolute top-0 w-8 h-0.5 bg-[#0088CC] rounded-full red-glow" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
          )}
          <motion.div whileTap={{ scale: 0.85 }}>
            <Home className={`w-5 h-5 mb-0.5 ${isHomeActive ? 'stroke-[2.5]' : ''}`} />
          </motion.div>
          <span className="text-[10px] sm:text-[11px]">الرئيسية</span>
        </button>

        {/* Slot 2: الخدمات */}
        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
            isServicesActive
              ? 'text-[#0088CC] font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isServicesActive && (
            <motion.span layoutId="nav-indicator" className="absolute top-0 w-8 h-0.5 bg-[#0088CC] rounded-full red-glow" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
          )}
          <motion.div whileTap={{ scale: 0.85 }}>
            <Layers className={`w-5 h-5 mb-0.5 ${isServicesActive ? 'stroke-[2.5]' : ''}`} />
          </motion.div>
          <span className="text-[10px] sm:text-[11px]">الخدمات</span>
        </button>

        {/* Slot 3: Center Floating Red "+" */}
        <div className="relative -top-5 flex items-center justify-center z-10 px-1">
          <motion.button
            whileTap={{ scale: 0.9, rotate: 90 }}
            onClick={openQuickActionModal}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#006699] to-[#0088CC] text-white flex items-center justify-center shadow-lg red-glow hover:scale-105 transition-transform border-4 border-[#0A0A0A]"
            title="طلب جديد"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </motion.button>
        </div>

        {/* Slot 4: تليجرام (direct order link) */}
        <button
          onClick={openTelegram}
          className="flex flex-col items-center justify-center flex-1 h-full relative text-[#2AABEE] hover:text-[#54c0f7] transition-colors"
        >
          <motion.div whileTap={{ scale: 0.85 }}>
            <Send className="w-5 h-5 mb-0.5" />
          </motion.div>
          <span className="text-[10px] sm:text-[11px]">تليجرام</span>
        </button>

        {/* Slot 5: الألعاب */}
        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
            isGamesActive
              ? 'text-[#0088CC] font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isGamesActive && (
            <motion.span layoutId="nav-indicator" className="absolute top-0 w-8 h-0.5 bg-[#0088CC] rounded-full red-glow" transition={{ type: 'spring', stiffness: 500, damping: 35 }} />
          )}
          <motion.div whileTap={{ scale: 0.85 }}>
            <Gamepad2 className={`w-5 h-5 mb-0.5 ${isGamesActive ? 'stroke-[2.5]' : ''}`} />
          </motion.div>
          <span className="text-[10px] sm:text-[11px]">الألعاب</span>
        </button>
      </div>
    </nav>
  );
};
