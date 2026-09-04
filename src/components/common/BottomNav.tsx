import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  Layers,
  Plus,
  MessageSquare,
  Gamepad2,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    feedSubTab,
    setFeedSubTab,
    openQuickActionModal,
    conversations,
  } = useApp();

  // Total unread messages count for badge
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0) || 12;

  // Active status indicators
  const isHomeActive = activeTab === 'feed' && feedSubTab !== 'chats';
  const isServicesActive = activeTab === 'services';
  const isMessagesActive = activeTab === 'feed' && feedSubTab === 'chats';
  const isGamesActive = activeTab === 'games';

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full max-w-full z-40 bg-[#0A0A0A]/95 backdrop-blur-lg border-t border-[#1a1a1a] pb-safe">
      <div className="max-w-md mx-auto px-1 h-16 flex items-center justify-between relative">
        {/* Slot 1: الرئيسية */}
        <button
          onClick={() => {
            setActiveTab('feed');
            setFeedSubTab('posts');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
            isHomeActive
              ? 'text-[#E8123D] font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isHomeActive && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#E8123D] rounded-full red-glow" />
          )}
          <Home className={`w-5 h-5 mb-0.5 ${isHomeActive ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] sm:text-[11px]">الرئيسية</span>
        </button>

        {/* Slot 2: الخدمات */}
        <button
          onClick={() => setActiveTab('services')}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
            isServicesActive
              ? 'text-[#E8123D] font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isServicesActive && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#E8123D] rounded-full red-glow" />
          )}
          <Layers className={`w-5 h-5 mb-0.5 ${isServicesActive ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] sm:text-[11px]">الخدمات</span>
        </button>

        {/* Slot 3: Center Floating Red "+" */}
        <div className="relative -top-5 flex items-center justify-center z-10 px-1">
          <button
            onClick={openQuickActionModal}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#B10E31] to-[#E8123D] text-white flex items-center justify-center shadow-lg red-glow active:scale-95 hover:scale-105 transition-all border-4 border-[#0A0A0A]"
            title="إضافة منشور / طلب جديد"
          >
            <Plus className="w-7 h-7 stroke-[3]" />
          </button>
        </div>

        {/* Slot 4: الرسائل (with unread badge) */}
        <button
          onClick={() => {
            setActiveTab('feed');
            setFeedSubTab('chats');
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
            isMessagesActive
              ? 'text-[#E8123D] font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isMessagesActive && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#E8123D] rounded-full red-glow" />
          )}
          <div className="relative">
            <MessageSquare className={`w-5 h-5 mb-0.5 ${isMessagesActive ? 'stroke-[2.5]' : ''}`} />
            {unreadMessagesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#E8123D] text-white text-[9px] font-black px-1.5 py-0.2 rounded-full min-w-4 text-center border border-[#0A0A0A]">
                {unreadMessagesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-[11px]">الرسائل</span>
        </button>

        {/* Slot 5: الألعاب */}
        <button
          onClick={() => setActiveTab('games')}
          className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
            isGamesActive
              ? 'text-[#E8123D] font-bold'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          {isGamesActive && (
            <span className="absolute top-0 w-8 h-0.5 bg-[#E8123D] rounded-full red-glow" />
          )}
          <Gamepad2 className={`w-5 h-5 mb-0.5 ${isGamesActive ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] sm:text-[11px]">الألعاب</span>
        </button>
      </div>
    </nav>
  );
};
