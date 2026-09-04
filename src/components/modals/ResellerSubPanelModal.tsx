import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, LayoutGrid, Users, DollarSign, Percent, TrendingUp, Plus, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ResellerSubPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResellerSubPanelModal: React.FC<ResellerSubPanelModalProps> = ({ isOpen, onClose }) => {
  const { showToast, formatPrice } = useApp();

  const [profitMargin, setProfitMargin] = useState<number>(15);
  const [subClients, setSubClients] = useState([
    { id: '1', name: 'متجر درع الميديا', email: 'shield@smm.com', orders: 142, spent: 340.50 },
    { id: '2', name: 'بانل الأسطورة', email: 'legend@smm.com', orders: 89, spent: 210.00 },
    { id: '3', name: 'خدمات العراق السريعة', email: 'iq@smm.com', orders: 312, spent: 850.20 },
  ]);

  const [newClientName, setNewClientName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const totalEarnings = subClients.reduce((acc, c) => acc + (c.spent * (profitMargin / 100)), 0);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientName.trim()) return;
    const newC = {
      id: Date.now().toString(),
      name: newClientName.trim(),
      email: `${newClientName.trim().toLowerCase().replace(/\s+/g, '')}@panel.com`,
      orders: 0,
      spent: 0,
    };
    setSubClients([newC, ...subClients]);
    setNewClientName('');
    setIsAdding(false);
    showToast('تمت إضافة العميل الفرعي بنجاح', 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-[#141414] border border-[#262626] w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <LayoutGrid className="w-4 h-4 text-[#E8123D]" />
              اللوحة الفرعية — لوحة إدارة الموزعين (Reseller Dashboard)
            </h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#262626]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-5 overflow-y-auto text-right">
            {/* Overview Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-center">
                <span className="text-[10px] text-gray-400 block mb-1">نسبة هامش الربح</span>
                <span className="text-base font-extrabold text-[#E8123D] flex items-center justify-center gap-0.5">
                  %{profitMargin}
                  <Percent className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-center">
                <span className="text-[10px] text-gray-400 block mb-1">إجمالي أرباحك</span>
                <span className="text-base font-extrabold text-green-400">
                  {formatPrice(totalEarnings)}
                </span>
              </div>
              <div className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl text-center">
                <span className="text-[10px] text-gray-400 block mb-1">العملاء النشطون</span>
                <span className="text-base font-extrabold text-white">
                  {subClients.length}
                </span>
              </div>
            </div>

            {/* Profit Margin Markup Control */}
            <div className="p-4 bg-[#1a1a1a] border border-[#262626] rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#E8123D]" />
                  تحديد هامش الربح التلقائي على الأسعار الأساسية
                </label>
                <span className="text-xs font-bold text-[#E8123D]">{profitMargin}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="50"
                step="1"
                value={profitMargin}
                onChange={e => setProfitMargin(Number(e.target.value))}
                className="w-full accent-[#E8123D] bg-[#0A0A0A] h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] text-gray-400 leading-normal">
                سيتم إضافة هذه النسبة أوتوماتيكياً على تكلفة الخدمات لعملائك الفرعيين وتحويل فارق الربح لرصيدك!
              </p>
            </div>

            {/* Sub Clients List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#E8123D]" />
                  قائمة المواقع والعملاء المربوطين
                </h4>
                <button
                  onClick={() => setIsAdding(!isAdding)}
                  className="px-2.5 py-1 rounded-lg bg-[#E8123D] hover:bg-[#b10e31] text-white text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  إضافة عميل فرعي
                </button>
              </div>

              {isAdding && (
                <form onSubmit={handleAddClient} className="p-3 bg-[#0A0A0A] border border-[#E8123D]/40 rounded-xl space-y-2">
                  <input
                    type="text"
                    value={newClientName}
                    onChange={e => setNewClientName(e.target.value)}
                    placeholder="اسم المتجر أو العميل الفرعي..."
                    className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D]"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#E8123D] text-white font-bold text-xs rounded-lg hover:bg-[#b10e31]"
                  >
                    حفظ العميل
                  </button>
                </form>
              )}

              <div className="space-y-2">
                {subClients.map(client => (
                  <div
                    key={client.id}
                    className="p-3 bg-[#0A0A0A] border border-[#262626] rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{client.name}</div>
                      <div className="text-[10px] text-gray-400 dir-ltr text-right">{client.email}</div>
                    </div>
                    <div className="text-left dir-ltr">
                      <div className="font-extrabold text-green-400">
                        {formatPrice(client.spent * (profitMargin / 100))} <span className="text-[10px] text-gray-400">(ربح)</span>
                      </div>
                      <div className="text-[10px] text-gray-400">{client.orders} طلب نفذها</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
