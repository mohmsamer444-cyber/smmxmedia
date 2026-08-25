import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, PenTool, ShoppingBag, Gamepad2, Wallet, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const QuickActionModal: React.FC = () => {
  const {
    isQuickActionModalOpen,
    closeQuickActionModal,
    openCreatePost,
    setActiveTab,
    openDepositModal,
  } = useApp();

  if (!isQuickActionModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
            <h3 className="font-bold text-sm text-white">إجراء سريع</h3>
            <button
              onClick={closeQuickActionModal}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {/* Action 1: Create Post */}
            <button
              onClick={() => {
                closeQuickActionModal();
                openCreatePost('text');
              }}
              className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24]/60 hover:bg-[#1f1f1f] text-right flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#E31E24]/10 text-[#E31E24] group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
                  <PenTool className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">إنشاء منشور جديد</span>
                  <span className="text-[10px] text-gray-400">شارك نص، صور، أو فيديو في الفيد الاجتماعي</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </button>

            {/* Action 2: SMM Order */}
            <button
              onClick={() => {
                closeQuickActionModal();
                setActiveTab('services');
              }}
              className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24]/60 hover:bg-[#1f1f1f] text-right flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">طلب خدمة سوشيال ميديا</span>
                  <span className="text-[10px] text-gray-400">متابعين، لايكات، مشاهدات تيك توك وإنستغرام</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </button>

            {/* Action 3: Top up Game */}
            <button
              onClick={() => {
                closeQuickActionModal();
                setActiveTab('games');
              }}
              className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24]/60 hover:bg-[#1f1f1f] text-right flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">شحن الألعاب وشدات ببجي</span>
                  <span className="text-[10px] text-gray-400">PUBG UC، جواهر فري فاير، كوينز بيس</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </button>

            {/* Action 4: Deposit */}
            <button
              onClick={() => {
                closeQuickActionModal();
                openDepositModal();
              }}
              className="w-full p-3 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24]/60 hover:bg-[#1f1f1f] text-right flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <Wallet className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-bold text-xs text-white block">إيداع رصيد بالحساب</span>
                  <span className="text-[10px] text-gray-400">شحن الرصيد بجميع وسائل الدفع المتاحة</span>
                </div>
              </div>
              <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
