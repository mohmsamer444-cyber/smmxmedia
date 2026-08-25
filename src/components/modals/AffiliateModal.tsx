import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Handshake, Copy, Check, Users, DollarSign, Share2, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AffiliateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AffiliateModal: React.FC<AffiliateModalProps> = ({ isOpen, onClose }) => {
  const { user, showToast, formatPrice } = useApp();
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const referralLink = `https://alsharq-world.com/ref/${user.username || 'user123'}`;
  const totalCommissionUSD = 45.00;
  const referredCount = 12;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    showToast('تم نسخ رابط الإحالة الخاص بك بنجاح', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Handshake className="w-4 h-4 text-[#E31E24]" />
              شركاء التسويق بالعمولة (Affiliate Program)
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5 text-right">
            {/* Banner info */}
            <div className="p-4 bg-gradient-to-r from-[#E31E24]/20 via-[#1a1a1a] to-[#0A0A0A] border border-[#E31E24]/30 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 font-black text-white text-sm">
                <Award className="w-5 h-5 text-[#E31E24]" />
                احصل على 5% عمولة فورية عن كل عملية شحن!
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                شارك رابط الترويج الخاص بك مع أصدقائك أو عملائك واحصل على عمولة دائمة تُضاف لرصيدك أوتوماتيكياً فور قيامهم بإيداع أي مبالغ.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-center">
                <span className="text-[10px] text-gray-400 block mb-1">عدد المسجلين عبر رابطك</span>
                <span className="text-lg font-black text-white flex items-center justify-center gap-1">
                  <Users className="w-4 h-4 text-[#E31E24]" />
                  {referredCount} مستخدم
                </span>
              </div>
              <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-center">
                <span className="text-[10px] text-gray-400 block mb-1">أرباح العمولات المكتسبة</span>
                <span className="text-lg font-black text-green-400 flex items-center justify-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {formatPrice(totalCommissionUSD)}
                </span>
              </div>
            </div>

            {/* Referral Link Box */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white block flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#E31E24]" />
                رابط الإحالة الخاص بك للترويج
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={referralLink}
                  className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white dir-ltr text-left font-sans focus:outline-none"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'تم النسخ' : 'نسخ الرابط'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
