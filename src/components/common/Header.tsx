import React, { useState, useRef, useEffect } from 'react';
import { useApp, CURRENCIES } from '../../context/AppContext';
import { CurrencyCode } from '../../types';
import {
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  User,
  Wallet,
  Settings,
  LogOut,
  CheckCircle,
  PlusCircle,
  Code,
  ShieldAlert,
  Send,
  MessageCircle,
  DollarSign,
  Camera,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenDrawer: () => void;
}

const BRAND_NAME = 'عالم الشرق الأوسط';

const HeaderLogo: React.FC<{
  activeTab: string;
  setActiveTab: (tab: any) => void;
  getTagline: () => string;
}> = ({ setActiveTab, getTagline }) => {
  const [shouldAnimate] = useState(() => {
    const animated = sessionStorage.getItem('mew_logo_shown_v1');
    if (!animated) {
      sessionStorage.setItem('mew_logo_shown_v1', 'true');
      return true;
    }
    return false;
  });

  const [isRevealed, setIsRevealed] = useState(() => !shouldAnimate);

  useEffect(() => {
    if (!shouldAnimate) return;
    const timeout = setTimeout(() => setIsRevealed(true), 150);
    return () => clearTimeout(timeout);
  }, [shouldAnimate]);

  return (
    <button
      onClick={() => setActiveTab('feed')}
      className="flex flex-col items-start focus:outline-none text-right group py-1"
    >
      <div className="flex items-center gap-2 font-sans">
        {/* SVG Emblem — globe with a rising star, in brand red/gold */}
        <svg width="28" height="28" viewBox="0 0 40 40" className="overflow-visible flex-shrink-0">
          <defs>
            <linearGradient id="mewGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF4D4D" />
              <stop offset="55%" stopColor="#E8123D" />
              <stop offset="100%" stopColor="#FFB432" />
            </linearGradient>
            <filter id="mewGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="1.6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="20" cy="20" r="15" fill="none" stroke="url(#mewGrad)" strokeWidth="2.4" filter="url(#mewGlow)" />
          <path
            d="M20 5 C15 11 15 29 20 35"
            fill="none"
            stroke="url(#mewGrad)"
            strokeWidth="1.6"
            opacity="0.85"
          />
          <path d="M5 20 H35" stroke="url(#mewGrad)" strokeWidth="1.6" opacity="0.85" />
          <path
            d="M20 13 L22 18 L27.5 18 L23 21.3 L24.7 26.8 L20 23.4 L15.3 26.8 L17 21.3 L12.5 18 L18 18 Z"
            fill="url(#mewGrad)"
            filter="url(#mewGlow)"
          />
        </svg>

        {/* Wordmark */}
        <motion.div
          initial={shouldAnimate ? { opacity: 0, y: -4 } : { opacity: 1, y: 0 }}
          animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="text-base sm:text-xl font-black tracking-wide font-sans leading-none min-h-[28px] flex items-center"
        >
          <span className="text-white">عالم </span>
          <span className="text-[#E8123D] mr-1">الشرق الأوسط</span>
        </motion.div>
      </div>

      <motion.span
        initial={shouldAnimate ? { opacity: 0, y: 4 } : { opacity: 1, y: 0 }}
        animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
        transition={{ duration: 0.35, ease: 'easeOut', delay: shouldAnimate ? 0.15 : 0 }}
        className="text-[9px] sm:text-[10px] font-bold text-[#E8123D] tracking-widest mt-0.5 font-sans"
      >
        {getTagline()}
      </motion.span>
    </button>
  );
};

export const Header: React.FC<HeaderProps> = ({ onOpenDrawer }) => {
  const {
    openDrawer,
    isDarkMode,
    toggleTheme,
    currency,
    setCurrency,
    formatPrice,
    user,
    activeTab,
    setActiveTab,
    notifications,
    unreadNotifCount,
    markNotificationsRead,
    openDepositModal,
    openApiSettingsModal,
    openAvatarModal,
    showToast,
  } = useApp();
  const { signOut } = useAuth();

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Tagline based on active section
  const getTagline = () => {
    switch (activeTab) {
      case 'feed':
        return 'شارك وتواصل';
      case 'services':
        return 'خدمات السوشيال ميديا';
      case 'games':
        return 'شحن الألعاب والخدمات';
      case 'orders':
        return 'سجل الطلبات';
      default:
        return 'خدمات السوشيال ميديا';
    }
  };

  return (
    <header className="sticky top-0 left-0 right-0 w-full max-w-full z-40 bg-[#0A0A0A]/90 dark:bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#1f1f1f] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo (Top-Left area visually) */}
        <div className="flex items-center gap-3">
          <HeaderLogo activeTab={activeTab} setActiveTab={setActiveTab} getTagline={getTagline} />
        </div>

        {/* Right Header Actions - Minimal Monochrome Top Utility Row */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
          {/* WhatsApp Direct Icon Link */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="واتساب"
            className="p-1.5 hover:text-white transition-colors"
            title="واتساب"
          >
            <MessageCircle className="w-4 h-4 stroke-[1.8]" />
          </a>

          {/* Dark / Light Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 hover:text-white transition-colors"
            title="تغيير الثيم"
          >
            {isDarkMode ? <Moon className="w-4 h-4 stroke-[1.8]" /> : <Sun className="w-4 h-4 stroke-[1.8]" />}
          </button>

          {/* Currency Selector */}
          <div className="relative" ref={currencyRef}>
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded hover:text-white transition-colors text-xs font-semibold text-gray-300"
              title="تغيير العملة"
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            <AnimatePresence>
              {isCurrencyOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-32 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl overflow-hidden z-50 py-1"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-right hover:bg-[#1a1a1a] transition-colors ${
                        currency === code ? 'text-[#E8123D] font-bold bg-[#E8123D]/10' : 'text-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{CURRENCIES[code].flag}</span>
                        <span>{code}</span>
                      </span>
                      <span className="text-gray-400 font-sans">{CURRENCIES[code].symbol}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => {
                setIsNotifOpen(!isNotifOpen);
                if (!isNotifOpen && unreadNotifCount > 0) {
                  markNotificationsRead();
                }
              }}
              className="relative p-1.5 hover:text-white transition-colors"
              title="الإشعارات"
            >
              <Bell className="w-4 h-4 stroke-[1.8]" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#E8123D] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-80 sm:w-88 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl z-50 overflow-hidden"
                >
                  <div className="p-3 border-b border-[#262626] flex items-center justify-between bg-[#1a1a1a]">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-[#E8123D]" />
                      الإشعارات
                    </span>
                    <button
                      onClick={markNotificationsRead}
                      className="text-[11px] text-[#E8123D] hover:underline"
                    >
                      تحديد الكل ككمقروء
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#262626]/50">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-500">لا توجد إشعارات جديدة</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          className={`p-3 text-right hover:bg-[#1f1f1f] transition-colors ${
                            !n.read ? 'bg-[#E8123D]/5' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                            <span className="flex items-center gap-1 text-[#E8123D]">
                              {!n.read && <span className="w-1.5 h-1.5 bg-[#E8123D] rounded-full inline-block" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] font-normal text-gray-500">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed">{n.description}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 p-1 rounded-full border border-transparent hover:border-[#E8123D]/50 transition-all"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border border-[#E8123D]/60"
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute left-0 mt-2 w-64 bg-[#141414] border border-[#262626] rounded-xl shadow-2xl z-50 p-3 space-y-3"
                >
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-[#1a1a1a] relative group">
                    <div className="relative cursor-pointer shrink-0" onClick={() => { setIsProfileOpen(false); openAvatarModal(); }}>
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E8123D]"
                      />
                      <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="w-4 h-4 text-[#E8123D]" />
                      </div>
                    </div>
                    <div className="overflow-hidden flex-1">
                      <div className="text-xs font-bold text-white flex items-center gap-1 truncate">
                        {user.name}
                        {user.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500/20 shrink-0" />}
                      </div>
                      <div className="text-[11px] text-gray-400 dir-ltr text-right truncate">
                        @{user.username}
                      </div>
                    </div>
                  </div>

                  {/* Balance Widget */}
                  <div className="p-2.5 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400">رصيدك الحالي</div>
                      <div className="text-sm font-extrabold text-[#E8123D]">
                        {formatPrice(user.balanceUSD)}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        openDepositModal();
                      }}
                      className="p-1.5 rounded-lg bg-[#E8123D] text-white hover:bg-[#b10e31] transition-colors flex items-center gap-1 text-xs font-bold"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      إيداع
                    </button>
                  </div>

                  <div className="divide-y divide-[#262626] text-xs">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        openAvatarModal();
                      }}
                      className="w-full flex items-center gap-2 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Camera className="w-4 h-4 text-[#E8123D]" />
                      تغيير الصورة الشخصية
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        setActiveTab('orders');
                      }}
                      className="w-full flex items-center gap-2 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Wallet className="w-4 h-4 text-[#E8123D]" />
                      سجل الطلبات
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        openApiSettingsModal();
                      }}
                      className="w-full flex items-center gap-2 py-2 text-gray-300 hover:text-white transition-colors"
                    >
                      <Code className="w-4 h-4 text-[#E8123D]" />
                      إعدادات API للبانل
                    </button>

                    <button
                      onClick={async () => {
                        setIsProfileOpen(false);
                        await signOut();
                        showToast('تم تسجيل الخروج بنجاح', 'info');
                      }}
                      className="w-full flex items-center gap-2 py-2 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      تسجيل الخروج
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hamburger Drawer Icon */}
          <button
            onClick={() => {
              if (onOpenDrawer) onOpenDrawer();
              openDrawer();
            }}
            aria-label="القائمة الرئيسية - إعدادات الحساب والبانل"
            title="القائمة الرئيسية"
            className="p-2.5 rounded-xl bg-[#141414] border border-[#262626] text-gray-200 hover:text-white hover:border-[#E8123D] active:scale-95 transition-all cursor-pointer relative z-10"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
