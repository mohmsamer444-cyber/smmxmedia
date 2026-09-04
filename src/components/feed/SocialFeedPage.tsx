import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PostCard } from './PostCard';
import { FileText, Search, Send, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

const TELEGRAM_ORDER_LINK = 'https://t.me/fx_sa2';

export const SocialFeedPage: React.FC = () => {
  const { posts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.hashtags.some(h => h.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-5 pb-20 text-right w-full max-w-full overflow-x-hidden">
      <div className="max-w-2xl mx-auto space-y-5">
        {/* Telegram Ordering Banner */}
        <div className="bg-[#141414] border-2 border-[#0088cc]/60 rounded-2xl p-4 shadow-2xl flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#0088cc]/15 text-[#2AABEE] shrink-0">
            <Send className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-extrabold text-sm text-white mb-1">كل الطلبات تتم عبر تليجرام</h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              تصفح العروض تحت، وخد اسكرين شوت للمنشور اللي عايزه، وابعته لينا مباشرة على تليجرام لإتمام الطلب.
            </p>
          </div>
          <a
            href={TELEGRAM_ORDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs shrink-0 transition-colors"
          >
            تواصل الآن
          </a>
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
                حفاظاً على حقوقك وأمان حسابك، يُرجى عدم تحويل أي مبالغ مالية لأي شخص يدعي أنه ممثل للموقع خارج منصتنا الرسمية.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full bg-[#141414] p-3 border border-[#262626] rounded-2xl">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث في العروض والوسوم..."
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D]"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute right-6 top-1/2 -translate-y-1/2" />
        </div>

        {/* Posts List (Admin catalog only) */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center bg-[#141414] border border-[#262626] rounded-2xl space-y-2">
              <FileText className="w-8 h-8 text-gray-500 mx-auto" />
              <p className="text-xs text-gray-400">لا توجد عروض مطابقة للبحث حالياً.</p>
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
    </div>
  );
};
