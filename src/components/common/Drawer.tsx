import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import {
  X,
  ExternalLink,
  Layers,
  Briefcase,
  Wallet,
  Code,
  LayoutGrid,
  Handshake,
  Settings,
  Monitor,
  Moon,
  Sun,
  LogOut,
  ChevronLeft,
  Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen: propIsOpen, onClose: propOnClose }) => {
  const {
    isDrawerOpen,
    closeDrawer,
    user,
    formatPrice,
    activeTab,
    setActiveTab,
    isDarkMode,
    toggleTheme,
    openQuickActionModal,
    openDepositModal,
    openApiSettingsModal,
    openResellerModal,
    openAffiliateModal,
    openUserProfileModal,
    openAvatarModal,
    showToast,
  } = useApp();

  const { signOut } = useAuth();

  const isOpen = propIsOpen ?? isDrawerOpen;
  const onClose = propOnClose ?? closeDrawer;

  const [themeOption, setThemeOption] = useState<'system' | 'dark' | 'light'>(
    isDarkMode ? 'dark' : 'light'
  );

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    onClose();
  };

  const handleThemeSelect = (option: 'system' | 'dark' | 'light') => {
    setThemeOption(option);
    if ((option === 'dark' && !isDarkMode) || (option === 'light' && isDarkMode)) {
      toggleTheme();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
          />

          {/* Slide-in Panel (Right for RTL) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 240 }}
            className="absolute inset-y-0 right-0 max-w-sm w-full bg-[#0D0D0D] border-l border-[#262626] shadow-2xl flex flex-col justify-between overflow-y-auto"
            dir="rtl"
          >
          {/* Panel Top Header: Brand Title & Close */}
          <div className="p-4 border-b border-[#262626] flex items-center justify-between bg-[#121212]">
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-white font-sans">
                SMM<span className="text-[#E8123D]">X</span>MEDIA
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#262626] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Panel Header: Large User Avatar + Username + Wallet Balance + Settings Gear */}
          <div className="p-4 border-b border-[#262626] bg-[#141414] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => {
                    onClose();
                    openAvatarModal();
                  }}
                  className="relative group cursor-pointer shrink-0"
                  title="تغيير الصورة الشخصية"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[#E8123D] shadow-md"
                  />
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-[#E8123D]" />
                  </div>
                </div>
                <div className="overflow-hidden">
                  <h4 className="font-bold text-sm text-white truncate">{user.name}</h4>
                  <button
                    onClick={() => {
                      onClose();
                      openAvatarModal();
                    }}
                    className="text-[11px] text-[#E8123D] hover:underline block font-semibold"
                  >
                    تغيير الصورة الشخصية
                  </button>
                </div>
              </div>
              <button
                onClick={() => {
                  onClose();
                  openUserProfileModal(user);
                }}
                className="p-2 rounded-xl bg-[#1a1a1a] border border-[#262626] text-gray-300 hover:text-white hover:border-[#E8123D]/50 transition-all"
                title="إعدادات الحساب"
              >
                <Settings className="w-4 h-4 text-gray-300" />
              </button>
            </div>

            {/* Wallet Balance Displayed Prominently */}
            <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">رصيد محفظتك الحالي</span>
                <span className="text-lg font-black text-[#E8123D] font-sans">
                  {formatPrice(user.balanceUSD)}
                </span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  openDepositModal();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#E8123D] hover:bg-[#b10e31] text-white text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
              >
                <Wallet className="w-3.5 h-3.5" />
                شحن الحساب
              </button>
            </div>
          </div>

          {/* Menu Items List */}
          <div className="p-3 space-y-1.5 flex-1 text-xs sm:text-sm font-medium">
            {/* 1. طلب جديد (New Order) — Red highlighted button at top */}
            <button
              onClick={() => {
                onClose();
                openQuickActionModal();
              }}
              className="w-full py-3 px-3.5 rounded-xl bg-[#E8123D] hover:bg-[#b10e31] text-white font-bold text-xs flex items-center justify-between shadow-lg red-glow transition-all"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4 stroke-[2.2]" />
                طلب جديد (New Order)
              </span>
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* 2. الخدمات (Services) */}
            <button
              onClick={() => navigateTo('services')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'services'
                  ? 'bg-[#E8123D]/10 text-[#E8123D] font-bold border border-[#E8123D]/30'
                  : 'text-gray-300 hover:bg-[#141414] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Layers className="w-4 h-4 text-[#E8123D]" />
                الخدمات (Services)
              </span>
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </button>

            {/* 3. الطلبات (My Orders) */}
            <button
              onClick={() => navigateTo('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#E8123D]/10 text-[#E8123D] font-bold border border-[#E8123D]/30'
                  : 'text-gray-300 hover:bg-[#141414] hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3">
                <Briefcase className="w-4 h-4 text-[#E8123D]" />
                الطلبات (My Orders)
              </span>
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </button>

            {/* 4. إضافة أموال (Add Funds) */}
            <button
              onClick={() => {
                onClose();
                openDepositModal();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-3">
                <Wallet className="w-4 h-4 text-[#E8123D]" />
                إضافة أموال (Add Funds)
              </span>
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </button>

            {/* 5. API */}
            <button
              onClick={() => {
                onClose();
                openApiSettingsModal();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-3">
                <Code className="w-4 h-4 text-[#E8123D]" />
                API واجهة البرمجة
              </span>
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </button>

            {/* 6. اللوحة الفرعية (Sub-panel / Reseller Dashboard) */}
            <button
              onClick={() => {
                onClose();
                openResellerModal();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4 text-[#E8123D]" />
                اللوحة الفرعية (Sub-panel)
              </span>
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </button>

            {/* 7. شركاء التسويق بالعمولة (Affiliate/Referral Partners) */}
            <button
              onClick={() => {
                onClose();
                openAffiliateModal();
              }}
              className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-gray-300 hover:bg-[#141414] hover:text-white transition-colors"
            >
              <span className="flex items-center gap-3">
                <Handshake className="w-4 h-4 text-[#E8123D]" />
                شركاء التسويق بالعمولة (Affiliate)
              </span>
              <ChevronLeft className="w-4 h-4 opacity-50" />
            </button>
          </div>

          {/* Bottom Section: Segmented Control Theme Toggle & Logout */}
          <div className="p-4 border-t border-[#262626] bg-[#141414] space-y-3">
            {/* Theme Toggle Segmented Control Row */}
            <div className="bg-[#0A0A0A] border border-[#262626] rounded-xl p-1 flex items-center justify-between">
              <button
                onClick={() => handleThemeSelect('system')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  themeOption === 'system'
                    ? 'bg-[#1a1a1a] text-white border border-[#333]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>النظام</span>
              </button>
              <button
                onClick={() => handleThemeSelect('dark')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  themeOption === 'dark'
                    ? 'bg-[#1a1a1a] text-white border border-[#333]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Moon className="w-3.5 h-3.5 text-amber-400" />
                <span>مظلم</span>
              </button>
              <button
                onClick={() => handleThemeSelect('light')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all ${
                  themeOption === 'light'
                    ? 'bg-[#1a1a1a] text-white border border-[#333]'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Sun className="w-3.5 h-3.5 text-yellow-400" />
                <span>مضيء</span>
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={async () => {
                onClose();
                await signOut();
                showToast('تم تسجيل الخروج بنجاح', 'info');
              }}
              className="w-full py-2.5 px-4 rounded-xl border border-[#E8123D]/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              تسجيل الخروج (Logout)
            </button>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>
  );
};
