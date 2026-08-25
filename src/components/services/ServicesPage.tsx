import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ServiceCard } from './ServiceCard';
import { Footer } from '../common/Footer';
import { PlatformIconCluster } from './PlatformIconCluster';
import {
  Search,
  Zap,
  ShieldCheck,
  Headphones,
  DollarSign,
  Users,
  Heart,
  Eye,
  Share2,
  PhoneCall,
  Coins,
  PlaySquare,
  MessageSquare,
  Radio,
  Bookmark,
  Send,
  Video,
  ArrowLeft,
  Sparkles,
  Grid,
} from 'lucide-react';
import {
  FaTiktok,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaTelegramPlane,
  FaSnapchatGhost,
  FaLinkedinIn,
  FaSpotify,
  FaTwitch,
  FaTwitter,
} from 'react-icons/fa';

export const ServicesPage: React.FC = () => {
  const {
    services,
    isLoadingServices,
    selectedPlatformFilter,
    setSelectedPlatformFilter,
    setActiveTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);

  // Platform definitions with real brand icons
  const platforms = [
    { id: 'tiktok', name: 'تيك توك', icon: FaTiktok, color: 'from-black to-gray-900', textColor: 'text-white', activeBg: 'bg-black' },
    { id: 'instagram', name: 'انستجرام', icon: FaInstagram, color: 'from-amber-500 via-rose-500 to-purple-600', textColor: 'text-pink-400', activeBg: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600' },
    { id: 'youtube', name: 'يوتيوب', icon: FaYoutube, color: 'from-red-600 to-red-700', textColor: 'text-red-500', activeBg: 'bg-red-600' },
    { id: 'facebook', name: 'فيسبوك', icon: FaFacebookF, color: 'from-blue-600 to-blue-700', textColor: 'text-blue-500', activeBg: 'bg-blue-600' },
    { id: 'telegram', name: 'تلجرام', icon: FaTelegramPlane, color: 'from-sky-500 to-blue-600', textColor: 'text-sky-400', activeBg: 'bg-sky-500' },
    { id: 'twitter', name: 'تويتر X', icon: FaTwitter, color: 'from-black to-gray-900', textColor: 'text-gray-200', activeBg: 'bg-black' },
    { id: 'snapchat', name: 'سناب شات', icon: FaSnapchatGhost, color: 'from-yellow-400 to-amber-500', textColor: 'text-yellow-400', activeBg: 'bg-yellow-400 text-black' },
    { id: 'all', name: 'المزيد', icon: Grid, color: 'from-gray-800 to-gray-900', textColor: 'text-gray-400', activeBg: 'bg-gray-800' },
  ];

  // Additional platforms for bottom list
  const extraPlatforms = [
    ...platforms.filter(p => p.id !== 'all'),
    { id: 'linkedin', name: 'لينكدان', icon: FaLinkedinIn, color: 'from-blue-700 to-blue-800', textColor: 'text-blue-400' },
    { id: 'spotify', name: 'سبوتيفاي', icon: FaSpotify, color: 'from-green-500 to-emerald-600', textColor: 'text-green-400' },
    { id: 'twitch', name: 'تويتش', icon: FaTwitch, color: 'from-purple-600 to-indigo-700', textColor: 'text-purple-400' },
  ];

  // 4 Featured Categories (خدمات مميزة)
  const featuredCategories = [
    {
      id: 'followers',
      title: 'متابعين',
      desc: 'متابعين حقيقيين ونشطين جودة عالية - ضمان عدم النقص',
      icon: Users,
      keyword: 'متابعين',
    },
    {
      id: 'likes',
      title: 'لايكات',
      desc: 'لايكات حقيقية لزيادة التفاعل جودة عالية - وصول سريع',
      icon: Heart,
      keyword: 'لايكات',
    },
    {
      id: 'views',
      title: 'مشاهدات',
      desc: 'مشاهدات حقيقية للفيديوهات زيادة المشاهدات بسرعة',
      icon: Eye,
      keyword: 'مشاهدات',
    },
    {
      id: 'shares',
      title: 'مشاركات',
      desc: 'مشاركات حقيقية لمنشوراتك زيادة انتشار المحتوى',
      icon: Share2,
      keyword: 'مشاركات',
    },
  ];

  // 8 Other Categories (خدمات أخرى)
  const otherCategories = [
    {
      id: 'numbers',
      title: 'شراء أرقام',
      desc: 'أرقام افتراضية لتفعيل جميع التطبيقات',
      icon: PhoneCall,
      keyword: 'أرقام',
    },
    {
      id: 'tiktok_coins',
      title: 'شحن عملات',
      desc: 'شحن عملات تيك توك بأفضل الأسعار',
      icon: Coins,
      keyword: 'عملات',
      isGameLink: true,
    },
    {
      id: 'stories',
      title: 'مشاهدات ستوري',
      desc: 'زيادة مشاهدات الستوري لحساباتك',
      icon: PlaySquare,
      keyword: 'ستوري',
    },
    {
      id: 'comments',
      title: 'تعليقات',
      desc: 'تعليقات حقيقية متنوعة وجودة عالية',
      icon: MessageSquare,
      keyword: 'تعليقات',
    },
    {
      id: 'live',
      title: 'مشاهدات بث مباشر',
      desc: 'زيادة مشاهدات البث المباشر لجميع المنصات',
      icon: Radio,
      keyword: 'بث',
    },
    {
      id: 'save_share',
      title: 'حفظ ومشاركة',
      desc: 'زيادة الحفظ والمشاركة للمحتوى',
      icon: Bookmark,
      keyword: 'حفظ',
    },
    {
      id: 'telegram_channels',
      title: 'قنوات تيليجرام',
      desc: 'أعضاء حقيقيين لقنوات تيليجرام',
      icon: Send,
      keyword: 'تيليجرام',
    },
    {
      id: 'youtube_services',
      title: 'خدمات يوتيوب',
      desc: 'مشتركين - لايكات - مشاهدات تعليقات - ساعات مشاهدة',
      icon: Video,
      keyword: 'يوتيوب',
    },
  ];

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesPlatform =
      selectedPlatformFilter === 'all' || service.platform === selectedPlatformFilter;
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategoryName =
      !selectedCategoryName || service.category.includes(selectedCategoryName);

    return matchesPlatform && matchesSearch && matchesCategoryName;
  });

  return (
    <div className="space-y-6 pb-20 text-right w-full max-w-full overflow-x-hidden">
      {/* Hero Banner matching Screenshot Pixel-for-Pixel */}
      <div className="relative bg-[#111111] border border-[#262626] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl min-h-[260px]">
        {/* Glow Radial Stage */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-80 h-80 bg-[#E31E24]/20 blur-[90px] rounded-full pointer-events-none animate-pulse-glow" />

        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Text Content */}
          <div className="space-y-3 text-right max-w-xl animate-slide-up">
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              خدمات السوشيال ميديا
            </h1>

            <div className="space-y-1 text-xs sm:text-sm font-medium text-gray-300">
              <p className="font-bold text-white">أفضل الخدمات بأسرع وقت وأعلى جودة</p>
              <p className="text-gray-400 text-xs">
                تزويد متابعين - لايكات - مشاهدات - شراء أرقام - شحن عملات - خدمات متكاملة لكل المنصات
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedPlatformFilter('all');
                setSelectedCategoryName(null);
              }}
              className="mt-2 px-6 py-2.5 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs shadow-lg red-glow transition-all inline-flex items-center gap-2"
            >
              <span>عرض جميع الخدمات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>

          {/* 3D Floating Platform Icon Cluster with Cinematic Growth Motion */}
          <PlatformIconCluster />
        </div>
      </div>

      {/* Search Input matching Screenshot */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="ابحث عن خدمة..."
          className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31E24] rounded-2xl pl-4 pr-11 py-3 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none shadow-xl transition-all"
        />
        <Search className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" />
      </div>

      {/* Platform Quick-Filter Row matching Screenshot (Circular Brand Icons) */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
        {platforms.map(p => {
          const IconComp = p.icon;
          const isActive = selectedPlatformFilter === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedPlatformFilter(p.id);
                setSelectedCategoryName(null);
              }}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div
                className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all duration-300 border-2 ${
                  isActive
                    ? 'border-[#E31E24] bg-[#1a1a1a] text-white shadow-[0_0_15px_rgba(227,30,36,0.6)] scale-105'
                    : 'border-[#262626] bg-[#141414] text-gray-400 hover:border-gray-500 hover:text-white'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-base ${
                    isActive ? p.activeBg : 'bg-[#1f1f1f] ' + p.textColor
                  }`}
                >
                  <IconComp />
                </div>
              </div>
              <span
                className={`text-[10px] sm:text-[11px] font-bold ${
                  isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                }`}
              >
                {p.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Trust Strip matching Screenshot */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#141414] border border-[#262626] rounded-2xl flex items-center gap-2.5">
          <div className="p-2 bg-[#E31E24]/10 text-[#E31E24] rounded-xl shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">أسعار تنافسية</h5>
            <p className="text-[10px] text-gray-400">أفضل الأسعار في السوق</p>
          </div>
        </div>

        <div className="p-3 bg-[#141414] border border-[#262626] rounded-2xl flex items-center gap-2.5">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">دعم 24/7</h5>
            <p className="text-[10px] text-gray-400">فريق دعم محترف</p>
          </div>
        </div>

        <div className="p-3 bg-[#141414] border border-[#262626] rounded-2xl flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">تسليم فوري</h5>
            <p className="text-[10px] text-gray-400">تبدأ خلال ثوانٍ</p>
          </div>
        </div>

        <div className="p-3 bg-[#141414] border border-[#262626] rounded-2xl flex items-center gap-2.5">
          <div className="p-2 bg-green-500/10 text-green-400 rounded-xl shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">جودة عالية</h5>
            <p className="text-[10px] text-gray-400">خدمات مضمونة 100%</p>
          </div>
        </div>
      </div>

      {/* Section 1: خدمات مميزة matching Screenshot */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E31E24]" />
          <span>خدمات مميزة</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {featuredCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-[#141414] border border-[#262626] hover:border-[#E31E24]/60 rounded-2xl p-4 text-center space-y-3 flex flex-col justify-between shadow-xl transition-all"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full border border-[#E31E24] text-[#E31E24] flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-extrabold text-sm text-white">{cat.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed">{cat.desc}</p>
                </div>

                <button
                  onClick={() => setSelectedCategoryName(cat.keyword)}
                  className="w-full py-2 rounded-xl bg-[#0A0A0A] hover:bg-[#E31E24] border border-[#262626] hover:border-[#E31E24] text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1.5"
                >
                  <span>عرض الخدمات</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: خدمات أخرى matching Screenshot */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E31E24]" />
          <span>خدمات أخرى</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {otherCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-[#141414] border border-[#262626] hover:border-[#E31E24]/60 rounded-2xl p-4 text-center space-y-3 flex flex-col justify-between shadow-xl transition-all"
              >
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-full border border-[#E31E24] text-[#E31E24] flex items-center justify-center mx-auto">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs sm:text-sm text-white">{cat.title}</h4>
                  <p className="text-[10px] sm:text-[11px] text-gray-400 leading-relaxed">{cat.desc}</p>
                </div>

                <button
                  onClick={() => {
                    if (cat.isGameLink) {
                      setActiveTab('games');
                    } else {
                      setSelectedCategoryName(cat.keyword);
                    }
                  }}
                  className="w-full py-1.5 rounded-xl bg-[#0A0A0A] hover:bg-[#E31E24] border border-[#262626] text-[11px] font-bold text-gray-300 hover:text-white transition-all flex items-center justify-center gap-1"
                >
                  <span>عرض الخدمات</span>
                  <ArrowLeft className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services List View */}
      <div className="space-y-4 pt-4 border-t border-[#262626]">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-white flex items-center gap-2">
            <span>قائمة الخدمات المتاحة</span>
            <span className="text-xs font-bold text-[#E31E24] font-sans">
              ({filteredServices.length})
            </span>
          </h3>

          {selectedCategoryName && (
            <button
              onClick={() => setSelectedCategoryName(null)}
              className="text-xs text-[#E31E24] hover:underline font-bold"
            >
              إلغاء تصفية الفئة ({selectedCategoryName})
            </button>
          )}
        </div>

        {isLoadingServices ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div
                key={i}
                className="p-5 bg-[#141414] border border-[#262626] rounded-2xl animate-pulse space-y-3"
              >
                <div className="h-4 bg-[#262626] rounded w-3/4" />
                <div className="h-3 bg-[#262626] rounded w-1/2" />
                <div className="h-8 bg-[#262626] rounded mt-4" />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center bg-[#141414] border border-[#262626] rounded-2xl space-y-2">
            <Search className="w-8 h-8 text-gray-500 mx-auto" />
            <p className="text-xs text-gray-400">لا توجد خدمات مطابقة للتصفية الحالية.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>

      {/* Footer Platforms Grid matching Screenshot */}
      <div className="p-6 bg-[#141414] border border-[#262626] rounded-3xl space-y-4 text-center">
        <h4 className="font-extrabold text-sm text-white flex items-center justify-center gap-1.5">
          <Grid className="w-4 h-4 text-[#E31E24]" />
          <span>جميع منصات السوشيال ميديا</span>
        </h4>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {extraPlatforms.map(p => {
            const IconComp = p.icon;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedPlatformFilter(p.id)}
                className="px-3.5 py-2 rounded-xl bg-[#0A0A0A] border border-[#262626] hover:border-[#E31E24] text-xs font-bold text-gray-300 flex items-center gap-2 transition-all hover:scale-105"
              >
                <span className={p.textColor}>
                  <IconComp />
                </span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            setSelectedPlatformFilter('all');
            setSelectedCategoryName(null);
          }}
          className="w-full py-3 rounded-2xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs shadow-lg red-glow transition-all flex items-center justify-center gap-2 mt-4"
        >
          <span>عرض جميع الخدمات</span>
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
};
