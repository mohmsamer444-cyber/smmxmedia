import React, { useState } from 'react';
import { SocialPost } from '../../types';
import {
  CheckCircle,
  Play,
  MapPin,
  Tag,
  DollarSign,
  Send,
} from 'lucide-react';

interface PostCardProps {
  post: SocialPost;
}

const TELEGRAM_ORDER_LINK = 'https://t.me/fx_sa2';

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleOrderOnTelegram = () => {
    window.open(TELEGRAM_ORDER_LINK, '_blank', 'noopener,noreferrer');
  };

  // Helper to format hashtags
  const renderFormattedContent = (content: string) => {
    const parts = content.split(/(\s+)/);
    return parts.map((part, i) => {
      if (part.startsWith('#')) {
        return (
          <span key={i} className="text-[#E8123D] font-bold dir-ltr inline-block">
            {part}{' '}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="bg-[#141414] border border-[#262626] hover-red-glow rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl text-right">
      {/* Marketplace Badge Row (if post has gameTag or priceTag) */}
      {(post.gameTag || post.priceTag || post.isAccountSale) && (
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-[#0A0A0A] border border-[#262626]">
          <div className="flex items-center gap-2 flex-wrap">
            {post.gameTag && (
              <span className="px-2.5 py-1 rounded-lg bg-[#E8123D]/20 border border-[#E8123D]/40 text-[#E8123D] font-black text-xs flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {post.gameTag}
              </span>
            )}
            {post.priceTag && (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold text-xs flex items-center gap-1 font-sans">
                <DollarSign className="w-3.5 h-3.5" />
                {post.priceTag}
              </span>
            )}
            {post.isAccountSale && (
              <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                حساب للبيع 🎮
              </span>
            )}
          </div>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-right">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#E8123D] shrink-0"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-white">
              <span>{post.author.name}</span>
              {post.author.verified && (
                <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/20 shrink-0" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 font-sans">
              <span>@{post.author.username}</span>
              <span>•</span>
              <span>{post.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Telegram order icon — always visible next to the post */}
        <button
          onClick={handleOrderOnTelegram}
          title="اطلب عبر تليجرام"
          className="p-2.5 rounded-xl bg-[#0088cc]/15 border border-[#0088cc]/40 text-[#2AABEE] hover:bg-[#0088cc]/25 transition-colors shrink-0"
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Post Text Body */}
      <p className="text-xs sm:text-sm text-gray-200 leading-relaxed font-normal whitespace-pre-line">
        {renderFormattedContent(post.content)}
      </p>

      {/* Location Badge */}
      {post.location && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[11px] text-gray-400">
          <MapPin className="w-3.5 h-3.5 text-[#E8123D]" />
          <span>{post.location}</span>
        </div>
      )}

      {/* Image Gallery */}
      {post.images && post.images.length > 0 && (
        <div
          className={`grid gap-2 rounded-xl overflow-hidden ${
            post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {post.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt="وسائط المنشور"
              className="w-full h-48 sm:h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      )}

      {/* Video Player */}
      {post.video && (
        <div className="relative rounded-xl overflow-hidden group border border-[#262626] bg-black">
          {isPlayingVideo || post.video.url.startsWith('blob:') ? (
            <video
              src={post.video.url}
              controls
              autoPlay={isPlayingVideo}
              className="w-full max-h-96 rounded-xl object-contain bg-black"
            />
          ) : (
            <>
              <img
                src={
                  post.video.thumbnail ||
                  'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80'
                }
                alt="فيديو"
                className="w-full h-56 object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                <button
                  onClick={() => setIsPlayingVideo(true)}
                  className="w-14 h-14 rounded-full bg-[#E8123D] text-white flex items-center justify-center shadow-2xl red-glow hover:scale-110 transition-transform"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
              </div>
              <span className="absolute bottom-3 left-3 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-md font-sans">
                {post.video.duration}
              </span>
            </>
          )}
        </div>
      )}

      {/* Order CTA */}
      <button
        onClick={handleOrderOnTelegram}
        className="w-full py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
      >
        <Send className="w-4 h-4" />
        <span>اطلب الآن عبر تليجرام — خد اسكرين شوت للمنشور وابعته</span>
      </button>
    </div>
  );
};
