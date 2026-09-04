import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ShoppingBag, Link as LinkIcon, Hash, DollarSign, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const OrderModal: React.FC = () => {
  const {
    isOrderModalOpen,
    closeOrderModal,
    selectedServiceForOrder,
    placeOrder,
    formatPrice,
    user,
    openDepositModal,
  } = useApp();

  const [link, setLink] = useState('');
  const [quantity, setQuantity] = useState<number>(1000);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedServiceForOrder) {
      setQuantity(selectedServiceForOrder.min || 1000);
      setLink('');
    }
  }, [selectedServiceForOrder]);

  if (!isOrderModalOpen || !selectedServiceForOrder) return null;

  const minQty = selectedServiceForOrder.min || 100;
  const maxQty = selectedServiceForOrder.max || 100000;
  const priceUSD = (quantity / 1000) * selectedServiceForOrder.rate;
  const isBalanceSufficient = user.balanceUSD >= priceUSD;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link.trim()) return;
    if (quantity < minQty || quantity > maxQty) return;

    setIsSubmitting(true);
    const success = await placeOrder(selectedServiceForOrder, link, quantity);
    setIsSubmitting(false);

    if (success) {
      closeOrderModal();
    }
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
          {/* Modal Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#E8123D]" />
              طلب خدمة جديد
            </h3>
            <button
              onClick={closeOrderModal}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Service Box Summary */}
            <div className="p-3.5 bg-[#0A0A0A] border border-[#262626] rounded-xl space-y-1">
              <div className="text-[11px] text-[#E8123D] font-bold">
                الخدمة المختارة (ID: {selectedServiceForOrder.id})
              </div>
              <h4 className="text-xs font-bold text-white leading-relaxed">
                {selectedServiceForOrder.name}
              </h4>
              <p className="text-[11px] text-gray-400 mt-1">
                السعر لكل 1000: <span className="text-[#E8123D] font-bold">{formatPrice(selectedServiceForOrder.rate)}</span> | الحد الأقل: {selectedServiceForOrder.min} - الأقصى: {selectedServiceForOrder.max.toLocaleString()}
              </p>
            </div>

            {/* Target Link Input */}
            <div>
              <label className="text-xs font-bold text-white block mb-1.5 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5 text-[#E8123D]" />
                رابط الحساب / المنشور المستهدف
              </label>
              <input
                type="text"
                required
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://tiktok.com/@username أو https://instagram.com/p/..."
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E8123D] dir-ltr text-left"
              />
            </div>

            {/* Quantity Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-[#E8123D]" />
                  الكمية المطلوبة
                </label>
                <span className="text-[10px] text-gray-400">
                  الحد الأدنى {minQty} - الأقصى {maxQty.toLocaleString()}
                </span>
              </div>
              <input
                type="number"
                required
                min={minQty}
                max={maxQty}
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#E8123D] font-sans"
              />
            </div>

            {/* Live Price Calculation Banner */}
            <div className="p-3.5 bg-[#1a1a1a] border border-[#262626] rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gray-400 block">إجمالي التكلفة الحسابية</span>
                <span className="text-xs text-gray-500">
                  ({quantity.toLocaleString()} × {formatPrice(selectedServiceForOrder.rate)} / 1000)
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-[#E8123D] block">
                  {formatPrice(priceUSD)}
                </span>
                <span className="text-[10px] text-gray-400">
                  رصيدك الحالي: {formatPrice(user.balanceUSD)}
                </span>
              </div>
            </div>

            {/* Insufficient balance warning */}
            {!isBalanceSufficient && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between text-xs text-red-400">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>رصيدك غير كافٍ لتنفيذ هذا الطلب.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    closeOrderModal();
                    openDepositModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#E8123D] text-white font-bold text-[11px] shrink-0"
                >
                  إيداع رصيد
                </button>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting || !isBalanceSufficient}
              className={`w-full py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                isBalanceSufficient && !isSubmitting
                  ? 'bg-[#E8123D] hover:bg-[#b10e31] red-glow'
                  : 'bg-gray-700 cursor-not-allowed opacity-60'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              {isSubmitting ? 'جاري إرسال الطلب...' : 'تأكيد وإرسال الطلب الآن'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
