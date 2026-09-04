import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedSubTab } from '../../types';
import { PostCard } from './PostCard';
import { RightSidebar } from './RightSidebar';
import { ChatsTab } from './ChatsTab';
import { GroupsTab } from './GroupsTab';
import { PLATFORM_STATS } from '../../data/mockData';
import {
  ShieldAlert,
  Users,
  UserCheck,
  FileText,
  MessageSquare,
  Search,
  PenTool,
  Image,
  Video,
  FileUp,
  BarChart2,
  MapPin,
  Send,
  User,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SocialFeedPage: React.FC = () => {
  const {
    feedSubTab,
    setFeedSubTab,
    posts,
    openCreatePost,
    user,
    openUserProfileModal,
  } = useApp();

  const [feedCategoryFilter, setFeedCategoryFilter] = useState<'all' | 'following' | 'friends'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter posts
  const filteredPosts = posts.filter(post => {
    const matchesCategory =
      feedCategoryFilter === 'all' || post.category === feedCategoryFilter || feedCategoryFilter === 'all';
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5 pb-20 text-right w-full max-w-full overflow-x-hidden">
      {/* Top Navigation Tab Bar */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-1.5 flex items-center justify-around overflow-x-auto no-scrollbar shadow-lg">
        <button
          onClick={() => setFeedSubTab('posts')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            feedSubTab === 'posts'
              ? 'bg-[#E8123D] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          المنشورات
        </button>

        <button
          onClick={() => setFeedSubTab('chats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            feedSubTab === 'chats'
              ? 'bg-[#E8123D] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          المحادثات
        </button>

        <button
          onClick={() => setFeedSubTab('groups')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            feedSubTab === 'groups'
              ? 'bg-[#E8123D] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          الجروبات
        </button>

        <button
          onClick={() => setFeedSubTab('friends')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            feedSubTab === 'friends'
              ? 'bg-[#E8123D] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          الأصدقاء
        </button>

        <button
          onClick={() => openUserProfileModal(user)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
            feedSubTab === 'profile'
              ? 'bg-[#E8123D] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          ملفي الشخصي
        </button>
      </div>

      {/* Single-Column Focused Feed Layout */}
      {feedSubTab === 'posts' && (
        <div className="max-w-2xl mx-auto space-y-5">
          {/* Create Post Box */}
          <div className="bg-[#141414] border border-[#262626] rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-[#E8123D] shrink-0"
              />
              <button
                onClick={() => openCreatePost('text')}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-4 py-3 text-xs text-right text-gray-400 hover:border-[#E8123D]/60 transition-colors"
              >
                بيع حساب، عرض خدمة، أو شارك منشورك الآن...
              </button>
            </div>

            {/* Action Buttons Row */}
            <div className="pt-2 border-t border-[#262626] flex items-center justify-between gap-1 overflow-x-auto no-scrollbar text-xs font-semibold text-gray-300">
              <button
                onClick={() => openCreatePost('text')}
                className="px-2.5 py-1.5 rounded-lg hover:bg-[#1f1f1f] flex items-center gap-1 hover:text-white transition-colors"
              >
                <PenTool className="w-4 h-4 text-blue-400" />
                <span>نص</span>
              </button>

              <button
                onClick={() => openCreatePost('image')}
                className="px-2.5 py-1.5 rounded-lg hover:bg-[#1f1f1f] flex items-center gap-1 hover:text-white transition-colors"
              >
                <Image className="w-4 h-4 text-emerald-400" />
                <span>صورة</span>
              </button>

              <button
                onClick={() => openCreatePost('video')}
                className="px-2.5 py-1.5 rounded-lg hover:bg-[#1f1f1f] flex items-center gap-1 hover:text-white transition-colors"
              >
                <Video className="w-4 h-4 text-red-400" />
                <span>فيديو</span>
              </button>

              <button
                onClick={() => openCreatePost('poll')}
                className="px-2.5 py-1.5 rounded-lg hover:bg-[#1f1f1f] flex items-center gap-1 hover:text-white transition-colors"
              >
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <span>استطلاع</span>
              </button>

              <button
                onClick={() => openCreatePost('text')}
                className="px-4 py-1.5 rounded-xl bg-[#E8123D] hover:bg-[#b10e31] text-white font-bold text-xs shadow-md red-glow transition-all flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                نشر الآن
              </button>
            </div>
          </div>

          {/* Security Banner Card */}
          <div className="bg-[#141414] border-2 border-[#E8123D]/80 rounded-2xl p-4 shadow-2xl relative overflow-hidden red-glow">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-[#E8123D]/20 text-[#E8123D] shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white mb-1">
                  التعامل يتم عن طريق وسيط (وكيل) الموقع فقط ⚠️
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  حفاظاً على حقوقك وأمان حسابك، يُرجى عدم تحويل أي مبالغ مالية لأي شخص يدعي أنه ممثل للموقع خارج منصتنا الرسمية. المبالغ المشحونة داخل حسابك في عالم الشرق الأوسط هي الضمان الوحيد الآمن.
                </p>
              </div>
            </div>
          </div>

          {/* Feed Filter Tabs + Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141414] p-3 border border-[#262626] rounded-2xl">
            <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#262626] w-full sm:w-auto">
              <button
                onClick={() => setFeedCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial ${
                  feedCategoryFilter === 'all'
                    ? 'bg-[#E8123D] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                الكل
              </button>
              <button
                onClick={() => setFeedCategoryFilter('following')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial ${
                  feedCategoryFilter === 'following'
                    ? 'bg-[#E8123D] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                مُتابَعين
              </button>
              <button
                onClick={() => setFeedCategoryFilter('friends')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex-1 sm:flex-initial ${
                  feedCategoryFilter === 'friends'
                    ? 'bg-[#E8123D] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                الأصدقاء
              </button>
            </div>

            {/* Search Field */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="ابحث في المنشورات والوسوم..."
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl pl-3 pr-8 py-1.5 text-xs text-white focus:outline-none focus:border-[#E8123D]"
              />
              <Search className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center bg-[#141414] border border-[#262626] rounded-2xl space-y-2">
                <FileText className="w-8 h-8 text-gray-500 mx-auto" />
                <p className="text-xs text-gray-400">لا توجد منشورات مطابقة للبحث حالياً.</p>
              </div>
            ) : (
              filteredPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: Math.min(idx * 0.06, 0.4) }}
                >
                  <PostCard post={post} />
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Sub Tab: Chats */}
      {feedSubTab === 'chats' && <ChatsTab />}

      {/* Sub Tab: Groups */}
      {feedSubTab === 'groups' && <GroupsTab />}

      {/* Sub Tab: Friends */}
      {feedSubTab === 'friends' && (
        <div className="bg-[#141414] border border-[#262626] p-6 rounded-2xl text-center space-y-2">
          <UserCheck className="w-10 h-10 text-[#E8123D] mx-auto" />
          <h3 className="font-bold text-sm text-white">قائمة الأصدقاء والمتابعين</h3>
          <p className="text-xs text-gray-400">
            يمكنك التواصل المباشر مع الأصدقاء وتبادل بطاقات الشحن والخدمات.
          </p>
        </div>
      )}
    </div>
  );
};
