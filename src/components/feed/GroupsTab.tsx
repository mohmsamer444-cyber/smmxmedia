import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, Lock, Unlock, Plus, MessageSquare } from 'lucide-react';

export const GroupsTab: React.FC = () => {
  const { groups, showToast } = useApp();

  return (
    <div className="space-y-4 text-right">
      <div className="flex items-center justify-between bg-[#141414] border border-[#262626] p-4 rounded-2xl">
        <div>
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#E8123D]" />
            المجموعات والمنتدى العربي
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            انضم للمجموعات البرمجية ومجتمعات الألعاب لتبادل الخبرات والتحديثات.
          </p>
        </div>
        <button
          onClick={() => showToast('تم إرسال طلب إنشاء مجموعة جديدة للإدارة', 'info')}
          className="px-3.5 py-2 rounded-xl bg-[#E8123D] hover:bg-[#b10e31] text-white font-bold text-xs flex items-center gap-1.5 shadow-lg red-glow"
        >
          <Plus className="w-4 h-4" />
          إنشاء مجموعة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {groups.map(group => (
          <div
            key={group.id}
            className="bg-[#141414] border border-[#262626] hover-red-glow rounded-2xl p-4 space-y-3 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <img
                src={group.avatar}
                alt={group.name}
                className="w-12 h-12 rounded-2xl object-cover border-2 border-[#E8123D] shrink-0"
              />
              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white truncate">{group.name}</h4>
                  <span className="px-2 py-0.5 rounded-md bg-[#1f1f1f] border border-[#262626] text-[10px] text-gray-300 font-bold flex items-center gap-1">
                    {group.type === 'خاص' ? <Lock className="w-3 h-3 text-amber-400" /> : <Unlock className="w-3 h-3 text-green-400" />}
                    {group.type}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{group.description}</p>
              </div>
            </div>

            <div className="pt-3 border-t border-[#262626] flex items-center justify-between text-xs">
              <span className="text-gray-400 font-sans">{group.membersCount.toLocaleString()} أعضاء نشطين</span>
              <button
                onClick={() => showToast(`تم تقديم طلب الانضمام إلى ${group.name}`, 'success')}
                className="px-3 py-1.5 rounded-xl bg-[#1f1f1f] hover:bg-[#E8123D] hover:text-white text-gray-200 font-bold transition-all flex items-center gap-1"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                دخول المجموعة
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
