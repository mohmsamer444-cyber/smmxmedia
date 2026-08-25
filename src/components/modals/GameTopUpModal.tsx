import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Gamepad2, ShieldCheck, AlertCircle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  PubgUcGraphic,
  FreeFireDiamondGraphic,
  EfootballCoinGraphic,
} from '../games/CurrencyIcons';

export const GameTopUpModal: React.FC = () => {
  const {
    isGameModalOpen,
    closeGameModal,
    selectedGamePackage,
    placeGameOrder,
    formatPrice,
    user,
    openDepositModal,
  } = useApp();

  const [playerUID, setPlayerUID] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isGameModalOpen || !selectedGamePackage) return null;

  const isBalanceSufficient = user.balanceUSD >= selectedGamePackage.priceUSD;

  const gameTitle =
    selectedGamePackage.game === 'pubg'
      ? 'شحن شدات ببجي موبايل (PUBG Mobile UC)'
      : selectedGamePackage.game === 'freefire'
      ? 'شحن جواهر فري فاير (Free Fire Diamonds)'
      : 'شحن كوينز بيس إيفوتبول (eFootball Coins)';

  const uidLabel =
    selectedGamePackage.game === 'pubg'
      ? 'معرف اللاعب الرقمي (Player ID / UID)'
      : selectedGamePackage.game === 'freefire'
      ? 'معرف الحساب (Player ID)'
      : 'معرف الحساب / البريد الإلكتروني للعبة';

  const uidPlaceholder =
    selectedGamePackage.game === 'pubg'
      ? 'مثال: 5129481023'
      : selectedGamePackage.game === 'freefire'
      ? 'مثال: 2840192841'
      : 'مثال: 10492810';

  const renderCurrencyGraphic = () => {
    if (selectedGamePackage.game === 'pubg') {
      return <PubgUcGraphic amount={selectedGamePackage.amount} size={40} />;
    } else if (selectedGamePackage.game === 'freefire') {
      return <FreeFireDiamondGraphic amount={selectedGamePackage.amount} size={40} />;
    } else {
      return <EfootballCoinGraphic amount={selectedGamePackage.amount} size={40} />;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerUID.trim()) return;

    setIsSubmitting(true);
    const success = await placeGameOrder(selectedGamePackage, playerUID);
    setIsSubmitting(false);

    if (success) {
      setPlayerUID('');
      closeGameModal();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-[#E31E24]" />
              {gameTitle}
            </h3>
            <button
              onClick={closeGameModal}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Package Summary */}
            <div className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {renderCurrencyGraphic()}
                <div>
                  <span className="text-[10px] text-[#E31E24] font-bold block uppercase tracking-wider">
                    الحزمة المختارة
                  </span>
                  <span className="text-base font-black text-white">
                    {selectedGamePackage.amount} {selectedGamePackage.unit}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block">السعر الإجمالي</span>
                <span className="text-lg font-black text-[#E31E24]">
                  {formatPrice(selectedGamePackage.priceUSD)}
                </span>
              </div>
            </div>

            {/* Player ID input */}
            <div>
              <label className="text-xs font-bold text-white block mb-1.5">{uidLabel}</label>
              <input
                type="text"
                required
                value={playerUID}
                onChange={e => setPlayerUID(e.target.value)}
                placeholder={uidPlaceholder}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E31E24] font-sans text-left dir-ltr"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                تأكد من كتابة الـ ID الخاص بحسابك بدقة. يتم الشحن آلياً وفورياً خلال دقائق.
              </p>
            </div>

            {/* Insufficient balance check */}
            {!isBalanceSufficient && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between text-xs text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>رصيدك الحالي لا يكفي للشحن.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeGameModal();
                    openDepositModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#E31E24] text-white font-bold text-[11px]"
                >
                  إيداع رصيد
                </button>
              </div>
            )}

            {/* Action button */}
            <button
              type="submit"
              disabled={isSubmitting || !isBalanceSufficient}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isBalanceSufficient && !isSubmitting
                  ? 'bg-[#E31E24] hover:bg-[#c11319] red-glow'
                  : 'bg-gray-700 cursor-not-allowed opacity-60'
              }`}
            >
              <Zap className="w-4 h-4" />
              {isSubmitting ? 'جاري إرسال الشحنة...' : 'تأكيد وشحن الحساب فوراً'}
            </button>

            <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              شحن آمن ومضمون 100% مع ضمان استرجاع الرصيد في حال الخطأ.
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
