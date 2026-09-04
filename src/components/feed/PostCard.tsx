import React, { useState } from 'react';
import { SocialPost } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  CheckCircle,
  Play,
  Send,
  MapPin,
  BarChart2,
  Check,
  MessageSquare,
  Tag,
  DollarSign,
  Reply,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PostCardProps {
  post: SocialPost;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const {
    togglePostLike,
    addPostComment,
    togglePostBookmark,
    votePollOption,
    openUserProfileModal,
    openLightbox,
    showToast,
    startDirectChatWithUser,
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addPostComment(post.id, commentInput);
    setCommentInput('');
  };

  const handleReplySubmit = (e: React.FormEvent, commentId: string) => {
    e.preventDefault();
    if (!replyInput.trim()) return;
    addPostComment(post.id, `@رد: ${replyInput}`);
    setReplyInput('');
    setReplyingToId(null);
    showToast('تم إضافة الرد بنجاح!', 'success');
  };

  const handleContactNow = () => {
    const context = `بخصوص منشورك (${post.gameTag || 'عرض'}: ${post.content.slice(0, 50)}...)`;
    startDirectChatWithUser(post.author, context);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'منشور من عالم الشرق الأوسط',
        text: post.content,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('تم نسخ رابط المنشور إلى الحافظة!', 'info');
    }
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

          <button
            onClick={handleContactNow}
            className="px-3 py-1.5 rounded-xl bg-[#E8123D] hover:bg-[#b10e31] text-white font-bold text-xs flex items-center gap-1.5 shadow-md red-glow transition-all shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>تواصل الآن</span>
          </button>
        </div>
      )}

      {/* Header Row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => openUserProfileModal(post.author)}
          className="flex items-center gap-3 text-right focus:outline-none group"
        >
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#E8123D] group-hover:scale-105 transition-transform"
          />
          <div>
            <div className="flex items-center gap-1.5 font-bold text-sm text-white group-hover:text-[#E8123D] transition-colors">
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
        </button>

        {/* Options dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1f1f1f] transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>

          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute left-0 mt-1 w-36 bg-[#1f1f1f] border border-[#262626] rounded-xl shadow-2xl z-20 py-1 text-xs text-gray-300"
              >
                <button
                  onClick={() => {
                    togglePostBookmark(post.id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-right hover:bg-[#262626] flex items-center gap-2"
                >
                  <Bookmark className="w-3.5 h-3.5 text-[#E8123D]" />
                  {post.isBookmarked ? 'إزالة من الحفظ' : 'حفظ المنشور'}
                </button>
                <button
                  onClick={() => {
                    showToast('تم الإبلاغ عن المنشور للإدارة', 'info');
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-right hover:bg-[#262626] text-red-400 flex items-center gap-2"
                >
                  إبلاغ عن محتوى
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
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
              onClick={() => openLightbox(img)}
              className="w-full h-48 sm:h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity rounded-lg"
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

      {/* Poll Component */}
      {post.poll && (
        <div className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-2.5">
          <div className="text-xs font-bold text-white flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-[#E8123D]" />
            {post.poll.question}
          </div>

          <div className="space-y-2">
            {post.poll.options.map(option => {
              const pct = post.poll?.totalVotes
                ? Math.round((option.votes / post.poll.totalVotes) * 100)
                : 0;
              const isSelected = post.poll?.userVotedId === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => votePollOption(post.id, option.id)}
                  disabled={!!post.poll?.userVotedId}
                  className={`w-full relative p-2.5 rounded-lg border text-right overflow-hidden transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#E8123D] bg-[#E8123D]/10'
                      : 'border-[#262626] bg-[#141414] hover:border-gray-500'
                  }`}
                >
                  {/* Progress fill */}
                  <div
                    className="absolute top-0 bottom-0 right-0 bg-[#E8123D]/20 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />

                  <span className="text-xs font-semibold text-white z-10 flex items-center gap-1.5">
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#E8123D]" />}
                    {option.text}
                  </span>
                  <span className="text-xs font-bold text-gray-400 z-10 font-sans">{pct}%</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] text-gray-500 text-left font-sans">
            إجمالي الأصوات: {post.poll.totalVotes}
          </div>
        </div>
      )}

      {/* Engagement Stats Bar */}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-2 border-t border-[#262626]/60">
        <div className="flex items-center gap-1">
          <span className="flex -space-x-1 space-x-reverse">
            <span className="w-4 h-4 rounded-full bg-[#E8123D] text-[10px] flex items-center justify-center text-white">
              ❤️
            </span>
            <span className="w-4 h-4 rounded-full bg-blue-500 text-[10px] flex items-center justify-center text-white">
              👍
            </span>
          </span>
          <span className="font-sans mr-1">{post.likesCount}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>{post.commentsCount} تعليق</span>
          <span>•</span>
          <span>{post.sharesCount} مشاركة</span>
        </div>
      </div>

      {/* Actions Row */}
      <div className="grid grid-cols-4 gap-1 pt-2 border-t border-[#262626] text-xs font-bold text-gray-400">
        {/* Like Button with Micro-bounce */}
        <motion.button
          whileTap={{ scale: 1.25 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          onClick={() => togglePostLike(post.id)}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            post.isLiked ? 'text-[#E8123D] bg-[#E8123D]/10' : 'hover:bg-[#1a1a1a] hover:text-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
          <span>أعجبني</span>
        </motion.button>

        {/* Comment toggle */}
        <button
          onClick={() => setShowComments(!showComments)}
          className="py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          <span>تعليق</span>
        </button>

        {/* Share */}
        <button
          onClick={handleShare}
          className="py-2 rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          <Share2 className="w-4 h-4" />
          <span>مشاركة</span>
        </button>

        {/* Bookmark */}
        <button
          onClick={() => togglePostBookmark(post.id)}
          className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            post.isBookmarked ? 'text-[#E8123D]' : 'hover:bg-[#1a1a1a] hover:text-white'
          }`}
        >
          <Bookmark className={`w-4 h-4 ${post.isBookmarked ? 'fill-current' : ''}`} />
          <span>حفظ</span>
        </button>
      </div>

      {/* Comments Drawer / Thread Inline */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="pt-3 border-t border-[#262626] space-y-3"
          >
            {/* Input Comment */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                value={commentInput}
                onChange={e => setCommentInput(e.target.value)}
                placeholder="اكتب تعليقك هنا..."
                className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D]"
              />
              <button
                type="submit"
                className="p-2 bg-[#E8123D] hover:bg-[#b10e31] text-white rounded-xl font-bold text-xs shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Existing Comments List with Nested Replies support */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {post.comments.map(comment => (
                <div key={comment.id} className="p-2.5 rounded-xl bg-[#0A0A0A] border border-[#262626] text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-1">
                      {comment.author.name}
                      {comment.author.verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                    </span>
                    <span className="text-[10px] text-gray-500 font-sans">{comment.timestamp}</span>
                  </div>

                  <p className="text-gray-300 leading-relaxed">{comment.content}</p>

                  <div className="flex items-center gap-3 pt-1 border-t border-[#1f1f1f]">
                    <button
                      onClick={() => setReplyingToId(replyingToId === comment.id ? null : comment.id)}
                      className="text-[10px] font-bold text-gray-400 hover:text-[#E8123D] flex items-center gap-1 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      <span>رد</span>
                    </button>
                  </div>

                  {/* Inline Reply Form */}
                  {replyingToId === comment.id && (
                    <form onSubmit={e => handleReplySubmit(e, comment.id)} className="flex gap-1.5 pt-2">
                      <input
                        type="text"
                        value={replyInput}
                        onChange={e => setReplyInput(e.target.value)}
                        placeholder={`رد على ${comment.author.name}...`}
                        className="flex-1 bg-[#141414] border border-[#262626] rounded-lg px-2.5 py-1 text-[11px] text-white focus:outline-none focus:border-[#E8123D]"
                      />
                      <button
                        type="submit"
                        className="px-2.5 py-1 bg-[#E8123D] text-white rounded-lg text-[10px] font-bold"
                      >
                        إرسال
                      </button>
                    </form>
                  )}

                  {/* Nested replies if present */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="mr-4 pr-2 border-r-2 border-[#E8123D]/40 space-y-2 pt-1">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="p-2 rounded-lg bg-[#141414] border border-[#262626] text-[11px]">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-bold text-gray-200 flex items-center gap-1">
                              {reply.author.name}
                              {reply.author.verified && <CheckCircle className="w-3 h-3 text-blue-500" />}
                            </span>
                            <span className="text-[9px] text-gray-500 font-sans">{reply.timestamp}</span>
                          </div>
                          <p className="text-gray-400">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
