import React from 'react';
import { SMMService } from '../../types';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, ShoppingBag, Zap, ShieldCheck } from 'lucide-react';

interface ServiceCardProps {
  service: SMMService;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const { openOrderModal, formatPrice } = useApp();

  return (
    <div className="bg-[#141414] border border-[#262626] hover-red-glow rounded-2xl p-4 flex flex-col justify-between shadow-xl text-right transition-all group">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#E31E24] bg-[#E31E24]/10 border border-[#E31E24]/30 px-2.5 py-0.5 rounded-full">
            ID: #{service.id}
          </span>
          <span className="text-[10px] text-gray-400 font-bold bg-[#1f1f1f] px-2 py-0.5 rounded-md">
            {service.category}
          </span>
        </div>

        <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-[#E31E24] transition-colors leading-relaxed">
          {service.name}
        </h4>

        {service.description && (
          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed">
            {service.description}
          </p>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-[#262626] flex items-center justify-between">
        <div>
          <span className="text-[10px] text-gray-400 block">السعر لكل 1000</span>
          <span className="text-sm font-black text-[#E31E24] font-sans">
            {formatPrice(service.rate)}
          </span>
        </div>

        <button
          onClick={() => openOrderModal(service)}
          className="px-3.5 py-2 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white text-xs font-bold flex items-center gap-1.5 shadow-md red-glow transition-all"
        >
          <span>طلب الخدمة</span>
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
