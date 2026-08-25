import React from 'react';
import { useApp } from '../../context/AppContext';
import { MessageSquare, Users, Circle, Plus, ChevronLeft, ShieldAlert } from 'lucide-react';

export const RightSidebar: React.FC = () => {
  const {
    conversations,
    groups,
    setFeedSubTab,
    setActiveChatId,
    openUserProfileModal,
    showToast,
  } = useApp();

  const onlineFriends = [
    {
      id: 'f-1',
      name: 'عبدالله السعيد',
      username: 'abdullah_s',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      verified: true,
      bio: 'صانع محتوى وفني شبكات',
      followers: 1200,
      following: 300,
      balanceUSD: 20,
      ordersCount: 5,
      isOnline: true,
    },
    {
      id: 'f-2',
      name: 'ريم العلي',
      username: 'reem_tech',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
      verified: false,
      bio: 'مهتمة بالتسويق الرقمي والتجارة الإلكترونية',
      followers: 3400,
      following: 150,
      balanceUSD: 10,
      ordersCount: 2,
      isOnline: true,
    },
    {
      id: 'f-3',
      name: 'خالد المطيري',
      username: 'khaled_pubg',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      verified: true,
      bio: 'لاعب ببجي وبطولات',
      followers: 9800,
      following: 210,
      balanceUSD: 100,
      ordersCount: 45,
      isOnline: true,
    },
  ];

  return (
    <aside className="space-y-4 text-right">
      {/* Panel 1: المحادثات المباشرة */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <h3 className="font-bold text-xs text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#E31E24]" />
            المحادثات الأخيرة
          </h3>
          <button
            onClick={() => setFeedSubTab('chats')}
            className="text-[11px] text-[#E31E24] hover:underline font-bold"
          >
            عرض الكل
          </button>
        </div>

        <div className="space-y-2">
          {conversations.map(chat => (
            <button
              key={chat.id}
              onClick={() => {
                setActiveChatId(chat.id);
                setFeedSubTab('chats');
              }}
              className="w-full p-2 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24]/50 transition-all flex items-center justify-between text-right group"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="relative shrink-0">
                  <img
                    src={chat.user.avatar}
                    alt={chat.user.name}
                    className="w-9 h-9 rounded-full object-cover border border-[#E31E24]"
                  />
                  {chat.user.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-[#0A0A0A]" />
                  )}
                </div>
                <div className="overflow-hidden">
                  <div className="font-bold text-xs text-white group-hover:text-[#E31E24] truncate">
                    {chat.user.name}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{chat.lastMessage}</div>
                </div>
              </div>

              {chat.unreadCount > 0 && (
                <span className="px-1.5 py-0.5 bg-[#E31E24] text-white text-[10px] font-bold rounded-full shrink-0">
                  {chat.unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Panel 2: الجروبات النشطة */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 space-y-3 shadow-xl">
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <h3 className="font-bold text-xs text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-[#E31E24]" />
            الجروبات النشطة
          </h3>
          <button
            onClick={() => showToast('افتتح طلب إنشاء مجموعة جديدة لدى الإدارة', 'info')}
            className="p-1 rounded-lg bg-[#E31E24]/10 text-[#E31E24] hover:bg-[#E31E24] hover:text-white transition-colors"
            title="إنشاء مجموعة جديدة"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          {groups.map(group => (
            <div
              key={group.id}
              onClick={() => setFeedSubTab('groups')}
              className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24]/50 cursor-pointer transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <img
                  src={group.avatar}
                  alt={group.name}
                  className="w-9 h-9 rounded-full object-cover border border-gray-700 shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="font-bold text-xs text-white truncate">{group.name}</div>
                  <div className="text-[10px] text-gray-400 font-sans">
                    {group.membersCount.toLocaleString()} عضو • {group.type}
                  </div>
                </div>
              </div>

              {group.unreadBadge > 0 && (
                <span className="px-1.5 py-0.5 bg-[#E31E24]/20 text-[#E31E24] text-[10px] font-bold rounded-md shrink-0">
                  +{group.unreadBadge}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Panel 3: الأصدقاء المتصلين */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 space-y-3 shadow-xl">
        <h3 className="font-bold text-xs text-white flex items-center gap-2 pb-2 border-b border-[#262626]">
          <Circle className="w-3 h-3 text-green-500 fill-green-500 animate-pulse" />
          الأصدقاء المتصلين الآن
        </h3>

        <div className="space-y-2">
          {onlineFriends.map(friend => (
            <button
              key={friend.id}
              onClick={() => openUserProfileModal(friend)}
              className="w-full p-2 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24]/50 transition-all flex items-center justify-between text-right"
            >
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={friend.avatar}
                    alt={friend.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-[#0A0A0A]" />
                </div>
                <span className="text-xs font-bold text-white">{friend.name}</span>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-500" />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
