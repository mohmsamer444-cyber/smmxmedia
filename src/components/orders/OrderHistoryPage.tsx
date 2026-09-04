import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Footer } from '../common/Footer';
import {
  ClipboardList,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Copy,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const OrderHistoryPage: React.FC = () => {
  const { orders, formatPrice, showToast, openOrderModal, services } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed' | 'canceled'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = orders.filter(order => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'in_progress' && (order.status === 'In progress' || order.status === 'Pending')) ||
      (statusFilter === 'completed' && order.status === 'Completed') ||
      (statusFilter === 'canceled' && order.status === 'Canceled');

    const matchesSearch =
      String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.link.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/30">
            <CheckCircle2 className="w-3 h-3" />
            مكتمل
          </span>
        );
      case 'In progress':
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Clock className="w-3 h-3 animate-spin" />
            قيد التنفيذ
          </span>
        );
      case 'Pending':
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <Clock className="w-3 h-3" />
            قيد الانتظار
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30">
            <XCircle className="w-3 h-3" />
            ملغي / مسترجع
          </span>
        );
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`تم نسخ ${label} إلى الحافظة!`, 'info');
  };

  return (
    <div className="space-y-6 pb-20 text-right w-full max-w-full overflow-x-hidden">
      {/* Header Banner */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#E8123D]" />
            سجل طلباتك ومتابعتها
          </h1>
          <p className="text-xs text-gray-400">
            تابع جميع طلبات السوشيال ميديا وشحن الألعاب في مكان واحد مع التحديث الآلي المباشر.
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-[#0A0A0A] border border-[#262626] flex items-center gap-2 text-xs">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span className="text-gray-300 font-bold">إجمالي الطلبات:</span>
          <span className="font-black text-[#E8123D] font-sans">{orders.length}</span>
        </div>
      </div>

      {/* Filter Tabs & Search Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#141414] p-3 border border-[#262626] rounded-2xl">
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 bg-[#0A0A0A] p-1 rounded-xl border border-[#262626] w-full sm:w-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-[#E8123D] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            الكل ({orders.length})
          </button>

          <button
            onClick={() => setStatusFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'in_progress'
                ? 'bg-[#E8123D] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            قيد التنفيذ ({orders.filter(o => o.status === 'In progress' || o.status === 'Pending').length})
          </button>

          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-[#E8123D] text-white shadow-md'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            المكتملة ({orders.filter(o => o.status === 'Completed').length})
          </button>
        </div>

        {/* Search Field */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الطلب أو الخدمة..."
            className="w-full bg-[#0A0A0A] border border-[#262626] rounded-xl pl-3 pr-8 py-2 text-xs text-white focus:outline-none focus:border-[#E8123D]"
          />
          <Search className="w-3.5 h-3.5 text-gray-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl overflow-hidden shadow-2xl">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <ClipboardList className="w-10 h-10 text-gray-500 mx-auto" />
            <p className="text-xs text-gray-400">لا توجد طلبات مسجلة مطابقة لتصفيتك.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-[#1a1a1a] text-gray-400 font-bold border-b border-[#262626]">
                <tr>
                  <th className="p-3.5">رقم الطلب</th>
                  <th className="p-3.5">الخدمة / الحزمة</th>
                  <th className="p-3.5">الرابط / المعرف</th>
                  <th className="p-3.5">الكمية</th>
                  <th className="p-3.5">التكلفة</th>
                  <th className="p-3.5">التاريخ</th>
                  <th className="p-3.5">الحالة</th>
                  <th className="p-3.5 text-center">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-[#1a1a1a]/60 transition-colors">
                    {/* Order ID */}
                    <td className="p-3.5 font-bold text-white font-sans dir-ltr text-right">
                      <button
                        onClick={() => copyToClipboard(String(order.id), 'رقم الطلب')}
                        className="inline-flex items-center gap-1 hover:text-[#E8123D]"
                      >
                        #{order.id}
                        <Copy className="w-3 h-3 text-gray-500" />
                      </button>
                    </td>

                    {/* Service Name */}
                    <td className="p-3.5 font-bold text-gray-200 max-w-xs truncate">
                      {order.serviceName}
                    </td>

                    {/* Link or Player ID */}
                    <td className="p-3.5 text-gray-400 font-sans max-w-xs truncate dir-ltr text-right">
                      <a
                        href={order.link}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-[#E8123D] inline-flex items-center gap-1"
                      >
                        {order.link}
                        <ExternalLink className="w-3 h-3 text-gray-500" />
                      </a>
                    </td>

                    {/* Quantity */}
                    <td className="p-3.5 font-bold text-gray-300 font-sans">
                      {order.quantity.toLocaleString()}
                    </td>

                    {/* Cost */}
                    <td className="p-3.5 font-black text-[#E8123D] font-sans">
                      {formatPrice(order.priceUSD)}
                    </td>

                    {/* Date */}
                    <td className="p-3.5 text-gray-400 font-sans">{order.date}</td>

                    {/* Status */}
                    <td className="p-3.5">{getStatusBadge(order.status)}</td>

                    {/* Actions */}
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => {
                          const matchingService = services.find(s => s.id === order.serviceId);
                          if (matchingService) {
                            openOrderModal(matchingService);
                          } else {
                            showToast(`تم تجهيز إعادة الطلب للخدمة #${order.serviceId}`, 'info');
                          }
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#262626] hover:bg-[#E8123D] text-gray-300 hover:text-white font-bold text-[11px] transition-all inline-flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        إعادة الطلب
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
