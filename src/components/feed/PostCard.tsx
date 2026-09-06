import React, { useState } from 'react';
import { SocialPost, PostComment } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  CheckCircle,
  Play,
  MapPin,
  Tag,
  DollarSign,
  Send,
  Heart,
  ThumbsUp,
  MessageCircle,
  Share2,
  Trash2,
} from 'lucide-react';
import { VerifiedBadge } from '../common/VerifiedBadge';

interface PostCardProps {
  post: SocialPost;
}

const TELEGRAM_ORDER_LINK = 'https://t.me/fx_sa2';

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { togglePostLike, addPostComment, loadPostComments, sharePost, votePollOption, user } = useApp();
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleToggleComments = () => {
    const next = !showComments;
    setShowComments(next);
    if (next) loadPostComments(post.id);
  };

  const handleSendComment = () => {
    if (!commentText.trim()) return;
    addPostComment(post.id, commentText.trim());
    setCommentText('');
  };

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
              {post.author.verified && <VerifiedBadge size={16} />}
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

      {/* Image Gallery — full image, no cropping (matches video behavior) */}
      {post.images && post.images.length > 0 && (
        <div
          className={`grid gap-2 rounded-xl overflow-hidden ${
            post.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'
          }`}
        >
          {post.images.map((img, idx) =>
            post.images!.length === 1 ? (
              <img
                key={idx}
                src={img}
                alt="وسائط المنشور"
                className="w-full h-auto max-h-[600px] object-contain bg-black rounded-lg"
              />
            ) : (
              <div key={idx} className="bg-black rounded-lg overflow-hidden flex items-center justify-center h-48 sm:h-64">
                <img src={img} alt="وسائط المنشور" className="w-full h-full object-contain" />
              </div>
            )
          )}
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

      {/* Audio / Song Player */}
      {post.audioUrl && (
        <div className="rounded-xl overflow-hidden border border-[#262626] bg-[#0A0A0A] p-3">
          <audio src={post.audioUrl} controls className="w-full h-9" />
        </div>
      )}

      {/* Poll / Survey */}
      {post.poll && (
        <div className="rounded-xl border border-[#262626] bg-[#0A0A0A] p-3.5 space-y-2.5">
          <p className="text-xs font-bold text-white">{post.poll.question}</p>
          <div className="space-y-2">
            {post.poll.options.map(opt => {
              const hasVoted = !!post.poll!.userVotedId;
              const percent =
                post.poll!.totalVotes > 0 ? Math.round((opt.votes / post.poll!.totalVotes) * 100) : 0;
              const isMyVote = post.poll!.userVotedId === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={hasVoted}
                  onClick={() => votePollOption(post.id, opt.id)}
                  className={`relative w-full text-right rounded-lg border overflow-hidden transition-colors ${
                    isMyVote ? 'border-[#E8123D]' : 'border-[#262626]'
                  } ${hasVoted ? 'cursor-default' : 'hover:border-[#E8123D]/60 cursor-pointer'}`}
                >
                  {hasVoted && (
                    <div
                      className={`absolute inset-y-0 right-0 ${isMyVote ? 'bg-[#E8123D]/25' : 'bg-white/10'}`}
                      style={{ width: `${percent}%` }}
                    />
                  )}
                  <div className="relative flex items-center justify-between px-3 py-2">
                    <span className="text-[11px] font-bold text-white">{opt.text}</span>
                    {hasVoted && (
                      <span className="text-[10px] font-sans font-bold text-gray-300">{percent}%</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-gray-500 font-sans">
            {post.poll.totalVotes} صوت
          </p>
        </div>
      )}

      {/* Engagement Bar — Like / Comment / Share */}
      <div className="flex items-center justify-between border-t border-b border-[#262626] py-2">
        <button
          onClick={() => togglePostLike(post.id)}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
            post.isLiked ? 'text-[#E8123D]' : 'text-gray-400 hover:text-[#E8123D]'
          }`}
        >
          <Heart className={`w-4.5 h-4.5 ${post.isLiked ? 'fill-[#E8123D]' : ''}`} />
          <span className="font-sans">{post.likesCount}</span>
        </button>

        <button
          onClick={() => togglePostLike(post.id, 'thumb')}
          className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
            post.isThumbed ? 'text-[#2AABEE]' : 'text-gray-400 hover:text-[#2AABEE]'
          }`}
        >
          <ThumbsUp className={`w-4.5 h-4.5 ${post.isThumbed ? 'fill-[#2AABEE]' : ''}`} />
          <span className="font-sans">{post.thumbsCount}</span>
        </button>

        <button
          onClick={handleToggleComments}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
        >
          <MessageCircle className="w-4.5 h-4.5" />
          <span className="font-sans">{post.commentsCount}</span>
        </button>

        <button
          onClick={() => sharePost(post.id)}
          className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-white transition-colors"
        >
          <Share2 className="w-4.5 h-4.5" />
          <span className="font-sans">{post.sharesCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="space-y-3">
          {post.comments.length === 0 && (
            <p className="text-[11px] text-gray-500 text-center py-2">لسه مفيش تعليقات، كن أول من يعلق</p>
          )}
          {post.comments.map((c, idx) => (
            <CommentItem
              key={c.id}
              comment={c}
              postId={post.id}
              currentUserId={user.id}
              index={idx}
            />
          ))}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              placeholder="اكتب تعليق..."
              className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-full py-2 px-4 text-xs outline-none focus:border-[#E8123D] transition-colors"
            />
            <button
              onClick={handleSendComment}
              className="p-2 rounded-full bg-[#E8123D] text-white hover:bg-[#B10E31] hover:scale-105 active:scale-95 transition-all shrink-0 red-glow"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Order CTA */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleOrderOnTelegram}
          className="flex-1 py-3 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          <Send className="w-4 h-4" />
          <span>عبر تليجرام</span>
        </button>
      </div>
    </div>
  );
};

interface CommentItemProps {
  comment: PostComment;
  postId: string;
  currentUserId: string;
  index: number;
  depth?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment: c, postId, currentUserId, index, depth = 0 }) => {
  const { toggleCommentLike, deleteComment, addPostComment } = useApp();
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    addPostComment(postId, replyText.trim(), c.id);
    setReplyText('');
    setShowReplyBox(false);
  };

  return (
    <div
      className="flex items-start gap-2 animate-slide-up"
      style={{ animationDelay: depth === 0 ? `${Math.min(index, 6) * 40}ms` : '0ms', animationFillMode: 'backwards' }}
    >
      <img src={c.author.avatar} alt={c.author.name} className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-[#E8123D]/30" />
      <div className="flex-1 min-w-0">
        <div className="bg-gradient-to-br from-[#161616] to-[#0A0A0A] border border-[#262626] rounded-2xl rounded-tr-sm px-3.5 py-2.5 hover-red-glow">
          <div className="flex items-center gap-1">
            <span className="text-[11px] font-bold text-white">{c.author.name}</span>
            {c.author.verified && <VerifiedBadge size={11} />}
          </div>
          <p className="text-xs text-gray-200 mt-0.5 leading-relaxed">{c.content}</p>
        </div>
        <div className="flex items-center gap-3 mt-1 px-2">
          <button
            onClick={() => toggleCommentLike(postId, c.id)}
            className={`flex items-center gap-1 text-[10px] font-bold transition-colors ${
              c.isLiked ? 'text-[#E8123D]' : 'text-gray-500 hover:text-[#E8123D]'
            }`}
          >
            <Heart className={`w-3 h-3 ${c.isLiked ? 'fill-[#E8123D]' : ''}`} />
            <span>إعجاب{c.likesCount > 0 ? ` · ${c.likesCount}` : ''}</span>
          </button>
          {depth === 0 && (
            <button
              onClick={() => setShowReplyBox(v => !v)}
              className="text-[10px] font-bold text-gray-500 hover:text-[#2AABEE] transition-colors"
            >
              رد
            </button>
          )}
          {c.authorId === currentUserId && (
            <button
              onClick={() => deleteComment(postId, c.id)}
              className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>حذف</span>
            </button>
          )}
        </div>

        {showReplyBox && (
          <div className="flex items-center gap-2 mt-2 animate-slide-up">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder={`الرد على ${c.author.name}...`}
              autoFocus
              className="flex-1 bg-[#0A0A0A] border border-[#262626] rounded-full py-1.5 px-3 text-[11px] outline-none focus:border-[#2AABEE] transition-colors"
            />
            <button
              onClick={handleSendReply}
              className="p-1.5 rounded-full bg-[#0088cc] text-white hover:bg-[#0077b3] hover:scale-105 active:scale-95 transition-all shrink-0"
            >
              <Send className="w-3 h-3" />
            </button>
          </div>
        )}

        {!!c.replies?.length && (
          <div className="mt-2 space-y-2 border-r-2 border-[#262626] pr-3">
            {c.replies.map((r, ridx) => (
              <CommentItem
                key={r.id}
                comment={r}
                postId={postId}
                currentUserId={currentUserId}
                index={ridx}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
