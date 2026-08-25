import React from 'react';
import { useApp } from '../../context/AppContext';
import { Footer } from '../common/Footer';
import { GAME_PACKAGES } from '../../data/mockData';
import { GamePackage } from '../../types';
import {
  Gamepad2,
  Zap,
  ShieldCheck,
  Headphones,
  PlusCircle,
  ClipboardList,
  ShoppingCart,
  Sparkles,
  Flame,
  ChevronLeft,
} from 'lucide-react';

import heroBannerImg from '../../assets/images/games_hero_banner_1785659970112.jpg';
import pubgCharImg from '../../assets/images/pubg_character_1785659989106.jpg';
import freefireCharImg from '../../assets/images/freefire_character_1785660006674.jpg';
import efootballCharImg from '../../assets/images/efootball_character_1785660021863.jpg';

import {
  PubgUcGraphic,
  FreeFireDiamondGraphic,
  EfootballCoinGraphic,
} from './CurrencyIcons';

export const GameTopUpPage: React.FC = () => {
  const {
    gameFilter,
    setGameFilter,
    openGameModal,
    openDepositModal,
    setActiveTab,
    user,
    formatPrice,
  } = useApp();

  const pubgPackages = GAME_PACKAGES.filter(p => p.game === 'pubg');
  const freeFirePackages = GAME_PACKAGES.filter(p => p.game === 'freefire');
  const eFootballPackages = GAME_PACKAGES.filter(p => p.game === 'efootball');

  // Array of 16 ember particles for random particle positioning & timing
  const emberParticles = [
    { left: '10%', delay: '0s', duration: '4s' },
    { left: '22%', delay: '1.2s', duration: '5s' },
    { left: '35%', delay: '0.5s', duration: '3.8s' },
    { left: '48%', delay: '2s', duration: '4.2s' },
    { left: '60%', delay: '0.8s', duration: '4.7s' },
    { left: '72%', delay: '1.5s', duration: '3.5s' },
    { left: '85%', delay: '0.3s', duration: '5.2s' },
    { left: '92%', delay: '2.5s', duration: '4s' },
    { left: '15%', delay: '2.8s', duration: '4.4s' },
    { left: '28%', delay: '3.1s', duration: '3.9s' },
    { left: '42%', delay: '1.7s', duration: '5.1s' },
    { left: '55%', delay: '2.2s', duration: '4.3s' },
    { left: '68%', delay: '3.5s', duration: '3.7s' },
    { left: '78%', delay: '0.9s', duration: '4.8s' },
    { left: '88%', delay: '1.8s', duration: '4.1s' },
    { left: '5%', delay: '1.1s', duration: '5s' },
  ];

  return (
    <div className="space-y-6 pb-20 text-right w-full max-w-full overflow-x-hidden">
      {/* Living Cinematic Hero Banner matching Screenshot */}
      <div className="relative bg-[#0d0d0d] border border-[#262626] rounded-3xl p-6 sm:p-8 overflow-hidden shadow-2xl min-h-[300px]">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBannerImg}
            alt="شحن الألعاب"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-35 filter brightness-90 contrast-125 scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d] via-[#0d0d0d]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-[#0d0d0d]/40" />
        </div>

        {/* Ambient Red Glow Pulse (Stage Lighting) */}
        <div className="absolute -bottom-20 right-1/4 w-96 h-96 bg-[#E31E24]/25 blur-[100px] rounded-full pointer-events-none animate-pulse-glow z-0" />

        {/* Light Sweep Shine Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-light-sweep" />

        {/* Floating Ember Spark Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          {emberParticles.map((pt, idx) => (
            <div
              key={idx}
              className="absolute w-1.5 h-1.5 bg-gradient-to-t from-amber-500 to-[#E31E24] rounded-full blur-[0.5px] animate-ember"
              style={{
                left: pt.left,
                bottom: '-10px',
                animationDelay: pt.delay,
                animationDuration: pt.duration,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Text Content with Entrance Animation */}
          <div className="space-y-3 text-right max-w-xl animate-slide-up">
            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-wide drop-shadow-md">
              شحن الألعاب
            </h1>

            <div className="space-y-1 text-xs sm:text-sm font-medium">
              <p className="text-gray-100 font-bold">شحن سريع وآمن لجميع الألعاب</p>
              <p className="text-gray-400">بأفضل الأسعار وأسرع تنفيذ</p>
            </div>

            {/* Trust Badges Row */}
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold pt-2">
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E31E24]/15 text-[#E31E24] border border-[#E31E24]/40 shadow-sm backdrop-blur-sm">
                ⚡ تسليم فوري
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/40 shadow-sm backdrop-blur-sm">
                🛡️ أمان 100%
              </span>
              <span className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/40 shadow-sm backdrop-blur-sm">
                🎧 دعم 24/7
              </span>
            </div>
          </div>

          {/* 3 Interactive Character Posters (PUBG, Free Fire, eFootball) */}
          <div className="flex items-center justify-center -space-x-3 sm:-space-x-5 space-x-reverse pt-2 lg:pt-0 z-10">
            {/* PUBG Mobile Character Poster */}
            <div
              onClick={() => setGameFilter('pubg')}
              className={`relative w-28 sm:w-32 lg:w-36 h-40 sm:h-48 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 transform ${
                gameFilter === 'pubg'
                  ? 'border-[#E31E24] scale-110 z-30 opacity-100 shadow-[0_0_25px_rgba(227,30,36,0.7)] animate-bob-1'
                  : 'border-[#333] scale-95 z-10 opacity-60 grayscale-[25%] hover:opacity-90 hover:scale-100'
              }`}
            >
              <img
                src={pubgCharImg}
                alt="PUBG Mobile"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-2 inset-x-0 text-center p-1 z-10 flex flex-col items-center">
                <PubgUcGraphic amount={60} size={32} className="mb-1" />
                <span className="font-black text-xs text-white block uppercase tracking-wider drop-shadow-md">
                  PUBG
                </span>
                <span className="text-[9px] text-[#E31E24] font-bold block">MOBILE</span>
              </div>
            </div>

            {/* Free Fire Character Poster */}
            <div
              onClick={() => setGameFilter('freefire')}
              className={`relative w-28 sm:w-32 lg:w-36 h-44 sm:h-52 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 transform ${
                gameFilter === 'freefire'
                  ? 'border-purple-500 scale-110 z-30 opacity-100 shadow-[0_0_25px_rgba(168,85,247,0.7)] animate-bob-2'
                  : 'border-[#333] scale-95 z-10 opacity-60 grayscale-[25%] hover:opacity-90 hover:scale-100'
              }`}
            >
              <img
                src={freefireCharImg}
                alt="Free Fire"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-2 inset-x-0 text-center p-1 z-10 flex flex-col items-center">
                <FreeFireDiamondGraphic amount={100} size={32} className="mb-1" />
                <span className="font-black text-xs text-white block uppercase tracking-wider drop-shadow-md">
                  FREE FIRE
                </span>
                <span className="text-[9px] text-purple-400 font-bold block">MAX</span>
              </div>
            </div>

            {/* eFootball Character Poster */}
            <div
              onClick={() => setGameFilter('efootball')}
              className={`relative w-28 sm:w-32 lg:w-36 h-40 sm:h-48 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-500 transform ${
                gameFilter === 'efootball'
                  ? 'border-blue-500 scale-110 z-30 opacity-100 shadow-[0_0_25px_rgba(59,130,246,0.7)] animate-bob-3'
                  : 'border-[#333] scale-95 z-10 opacity-60 grayscale-[25%] hover:opacity-90 hover:scale-100'
              }`}
            >
              <img
                src={efootballCharImg}
                alt="eFootball 2024"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              <div className="absolute bottom-2 inset-x-0 text-center p-1 z-10 flex flex-col items-center">
                <EfootballCoinGraphic amount={260} size={32} className="mb-1" />
                <span className="font-black text-xs text-white block uppercase tracking-wider drop-shadow-md">
                  eFOOTBALL
                </span>
                <span className="text-[9px] text-yellow-400 font-bold block">2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Selector Tabs */}
      <div className="grid grid-cols-3 gap-2 bg-[#141414] border border-[#262626] p-2 rounded-2xl shadow-xl">
        <button
          onClick={() => setGameFilter('pubg')}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            gameFilter === 'pubg'
              ? 'bg-[#E31E24] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <PubgUcGraphic amount={60} size={22} />
          <span>PUBG MOBILE</span>
        </button>

        <button
          onClick={() => setGameFilter('freefire')}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            gameFilter === 'freefire'
              ? 'bg-[#E31E24] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <FreeFireDiamondGraphic amount={100} size={22} />
          <span>FREE FIRE</span>
        </button>

        <button
          onClick={() => setGameFilter('efootball')}
          className={`py-3 px-4 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
            gameFilter === 'efootball'
              ? 'bg-[#E31E24] text-white shadow-lg red-glow'
              : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
          }`}
        >
          <EfootballCoinGraphic amount={260} size={22} />
          <span>eFOOTBALL 2024</span>
        </button>
      </div>

      {/* Account Balance & Order History Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Balance Card */}
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-2xl flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#E31E24]/10 text-[#E31E24]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-400 font-bold block">رصيد حسابك الحالي</span>
              <span className="text-base font-black text-[#E31E24]">
                {formatPrice(user.balanceUSD)}
              </span>
            </div>
          </div>
          <button
            onClick={openDepositModal}
            className="p-2 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs flex items-center gap-1 shadow-md red-glow"
          >
            <PlusCircle className="w-4 h-4" />
          </button>
        </div>

        {/* Safe Badge */}
        <div className="p-4 bg-[#141414] border border-[#262626] rounded-2xl flex items-center gap-3 shadow-xl">
          <div className="p-2.5 rounded-xl bg-green-500/10 text-green-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-white">شحن آمن 100%</h5>
            <p className="text-[10px] text-gray-400">جميع عمليات الشحن آمنة ومضمونة بحسابك</p>
          </div>
        </div>

        {/* Order History CTA Button */}
        <button
          onClick={() => setActiveTab('orders')}
          className="p-4 bg-[#141414] border border-[#262626] hover:border-[#E31E24] rounded-2xl flex items-center justify-between shadow-xl transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 group-hover:bg-[#E31E24] group-hover:text-white transition-colors">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="font-bold text-xs text-white">سجل الطلبات</span>
          </div>
          <ChevronLeft className="w-4 h-4 text-gray-500 group-hover:text-white" />
        </button>
      </div>

      {/* Package Grids */}

      {/* PUBG Mobile UC Section */}
      {(gameFilter === 'pubg' || gameFilter === 'pubg') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#E31E24]" />
              شحن شدات ببجي موبايل (PUBG Mobile UC)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {pubgPackages.map(pkg => (
              <div
                key={pkg.id}
                className="relative bg-[#141414] border border-[#262626] hover-red-glow rounded-2xl p-4 text-center space-y-3 flex flex-col justify-between shadow-xl group"
              >
                {pkg.discountBadge && (
                  <span className="absolute top-2 right-2 bg-[#E31E24] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                    {pkg.discountBadge}
                  </span>
                )}

                <div className="space-y-2 pt-2">
                  <span className="font-black text-lg text-white block">
                    {pkg.amount} {pkg.unit}
                  </span>

                  {/* UC Icon vector graphic */}
                  <PubgUcGraphic amount={pkg.amount} size={52} className="mx-auto my-1" />

                  <span className="text-sm font-black text-[#E31E24] block font-sans">
                    {formatPrice(pkg.priceUSD)}
                  </span>
                </div>

                <button
                  onClick={() => openGameModal(pkg)}
                  className="w-full py-2 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs shadow-md red-glow transition-all flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  شحن الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Free Fire Diamonds Section */}
      {(gameFilter === 'freefire' || gameFilter === 'freefire') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-sky-400" />
              شحن جواهر فري فاير (Free Fire Diamonds)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {freeFirePackages.map(pkg => (
              <div
                key={pkg.id}
                className="relative bg-[#141414] border border-[#262626] hover-red-glow rounded-2xl p-4 text-center space-y-3 flex flex-col justify-between shadow-xl group"
              >
                {pkg.discountBadge && (
                  <span className="absolute top-2 right-2 bg-[#E31E24] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                    {pkg.discountBadge}
                  </span>
                )}

                <div className="space-y-2 pt-2">
                  <span className="font-black text-lg text-white block">{pkg.amount}</span>

                  {/* Diamond Icon vector graphic */}
                  <FreeFireDiamondGraphic amount={pkg.amount} size={52} className="mx-auto my-1" />

                  <span className="text-sm font-black text-[#E31E24] block font-sans">
                    {formatPrice(pkg.priceUSD)}
                  </span>
                </div>

                <button
                  onClick={() => openGameModal(pkg)}
                  className="w-full py-2 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs shadow-md red-glow transition-all flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  شحن الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* eFootball Coins Section */}
      {(gameFilter === 'efootball' || gameFilter === 'efootball') && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              شحن كوينز بيس (eFootball 2024 Coins)
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {eFootballPackages.map(pkg => (
              <div
                key={pkg.id}
                className="relative bg-[#141414] border border-[#262626] hover-red-glow rounded-2xl p-4 text-center space-y-3 flex flex-col justify-between shadow-xl group"
              >
                {pkg.discountBadge && (
                  <span className="absolute top-2 right-2 bg-[#E31E24] text-white text-[10px] font-black px-2 py-0.5 rounded-md shadow-md">
                    {pkg.discountBadge}
                  </span>
                )}

                <div className="space-y-2 pt-2">
                  <span className="font-black text-lg text-white block">{pkg.amount}</span>

                  {/* Coin Icon vector graphic */}
                  <EfootballCoinGraphic amount={pkg.amount} size={52} className="mx-auto my-1" />

                  <span className="text-sm font-black text-[#E31E24] block font-sans">
                    {formatPrice(pkg.priceUSD)}
                  </span>
                </div>

                <button
                  onClick={() => openGameModal(pkg)}
                  className="w-full py-2 rounded-xl bg-[#E31E24] hover:bg-[#c11319] text-white font-bold text-xs shadow-md red-glow transition-all flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  شحن الآن
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Trust Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#262626]">
        <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-2xl text-center space-y-1">
          <span className="text-xs font-bold text-white block">أفضل الأسعار</span>
          <span className="text-[10px] text-gray-400">تقدم أقل الأسعار بالمملكة</span>
        </div>

        <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-2xl text-center space-y-1">
          <span className="text-xs font-bold text-white block">تسليم فوري</span>
          <span className="text-[10px] text-gray-400">يتم الشحن خلال دقائق</span>
        </div>

        <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-2xl text-center space-y-1">
          <span className="text-xs font-bold text-white block">دعم فني 24/7</span>
          <span className="text-[10px] text-gray-400">فريق دعم جاهز لخدمتك</span>
        </div>

        <div className="p-3.5 bg-[#141414] border border-[#262626] rounded-2xl text-center space-y-1">
          <span className="text-xs font-bold text-white block">أمان وخصوصية</span>
          <span className="text-[10px] text-gray-400">حماية كاملة للبيانات</span>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
