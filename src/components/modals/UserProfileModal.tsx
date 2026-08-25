import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, UserPlus, UserCheck, MessageSquare, ShieldCheck, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const UserProfileModal: React.FC = () => {
  const {
    user,
    selectedUserProfile,
    closeUserProfileModal,
    openAvatarModal,
    setActiveTab,
    setFeedSubTab,
    setActiveChatId,
    showToast,
  } = useApp();

  const [isFollowing, setIsFollowing] = useState(false);

  if (!selectedUserProfile) return null;

  const handleSendDM = () => {
    closeUserProfileModal();
    setActiveTab('feed');
    setFeedSubTab('chats');
    setActiveChatId('chat-1');
    showToast(`تم فتح المحادثة مع ${selectedUserProfile.name}`, 'info');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col text-right"
        >
          {/* Top Banner */}
          <div className="h-24 bg-gradient-to-r from-[#C11319] to-[#E31E24] relative p-3 flex justify-end">
            <button
              onClick={closeUserProfileModal}
              className="p-1 rounded-full bg-black/40 text-white hover:bg-black/60 backdrop-blur-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Content */}
          <div className="px-5 pb-5 pt-0 relative -mt-12 space-y-3">
            <div className="flex items-end justify-between">
              <div
                onClick={() => {
                  if (selectedUserProfile.id === user.id) {
                    closeUserProfileModal();
                    openAvatarModal();
                  }
                }}
                className={`relative group ${selectedUserProfile.id === user.id ? 'cursor-pointer' : ''}`}
              >
                <img
                  src={selectedUserProfile.avatar}
                  alt={selectedUserProfile.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#141414] shadow-xl"
                />
                {selectedUserProfile.id === user.id && (
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-6 h-6 text-[#E31E24]" />
                  </div>
                )}
              </div>

              {selectedUserProfile.id === user.id ? (
                <button
                  onClick={() => {
                    closeUserProfileModal();
                    openAvatarModal();
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white text-xs font-bold flex items-center gap-1.5 red-glow transition-all"
                >
                  <Camera className="w-4 h-4" />
                  <span>تغيير الصورة</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsFollowing(!isFollowing);
                    showToast(
                      isFollowing
                        ? `تم إلغاء متابعة ${selectedUserProfile.name}`
                        : `أصبحت الآن تتابع ${selectedUserProfile.name}`,
                      'info'
                    );
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                    isFollowing
                      ? 'bg-[#1f1f1f] border border-[#262626] text-gray-300'
                      : 'bg-[#E31E24] hover:bg-[#c11319] text-white red-glow'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="w-4 h-4 text-green-400" />
                      مُتابَع
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      متابعة
                    </>
                  )}
                </button>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-base text-white">
                <span>{selectedUserProfile.name}</span>
                {selectedUserProfile.verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/20 shrink-0" />
                )}
              </div>
              <div className="text-xs text-gray-400 dir-ltr text-right">
                @{selectedUserProfile.username}
              </div>
            </div>

            {selectedUserProfile.bio && (
              <p className="text-xs text-gray-300 leading-relaxed bg-[#0A0A0A] p-2.5 rounded-xl border border-[#262626]">
                {selectedUserProfile.bio}
              </p>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2 text-center p-2.5 bg-[#0A0A0A] border border-[#262626] rounded-xl text-xs">
              <div>
                <span className="font-black text-white text-sm block">
                  {(selectedUserProfile.followers + (isFollowing ? 1 : 0)).toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400">متابِع</span>
              </div>
              <div>
                <span className="font-black text-white text-sm block">
                  {selectedUserProfile.following.toLocaleString()}
                </span>
                <span className="text-[10px] text-gray-400">يتابع</span>
              </div>
            </div>

            {/* Direct Message CTA */}
            <button
              onClick={handleSendDM}
              className="w-full py-2.5 rounded-xl bg-[#1f1f1f] hover:bg-[#262626] border border-[#262626] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-[#E31E24]" />
              إرسال رسالة خاصة
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
