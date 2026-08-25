import React, { useState, useEffect } from 'react';
import {
  FaTiktok,
  FaInstagram,
  FaYoutube,
  FaFacebookF,
  FaTelegramPlane,
  FaSnapchatGhost,
  FaTwitter,
} from 'react-icons/fa';
import { User, Heart, Play, Eye, ThumbsUp, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Particle {
  id: string;
  type: 'user' | 'heart' | 'play' | 'eye' | 'like' | 'send';
  color: string;
  xOffset: number;
  yTarget: number;
  scale: number;
}

interface PlatformConfig {
  id: string;
  name: string;
  icon: React.ElementType;
  containerClass: string;
  positionClass: string;
  bobClass: string;
  glowColor: string;
  burstInterval: number; // ms
  counterText: string;
  particleTypes: ('user' | 'heart' | 'play' | 'eye' | 'like' | 'send')[];
  particleColors: string[];
}

const PLATFORMS: PlatformConfig[] = [
  {
    id: 'tiktok',
    name: 'تيك توك',
    icon: FaTiktok,
    containerClass: 'bg-black border-2 border-[#E31E24] text-white red-glow',
    positionClass: 'top-2 left-2 sm:left-6 w-11 h-11 sm:w-13 sm:h-13',
    bobClass: 'animate-bob-1',
    glowColor: 'rgba(227,30,36,0.8)',
    burstInterval: 2800,
    counterText: '+1.8K',
    particleTypes: ['user', 'heart'],
    particleColors: ['text-red-500', 'text-pink-400', 'text-[#E31E24]', 'text-cyan-400'],
  },
  {
    id: 'youtube',
    name: 'يوتيوب',
    icon: FaYoutube,
    containerClass: 'bg-red-600 border-2 border-red-400 text-white shadow-[0_10px_20px_rgba(227,30,36,0.5)]',
    positionClass: 'top-0 right-6 sm:right-10 w-12 h-12 sm:w-14 sm:h-14',
    bobClass: 'animate-bob-2',
    glowColor: 'rgba(239,68,68,0.8)',
    burstInterval: 3400,
    counterText: '+12.4K',
    particleTypes: ['play', 'eye', 'user'],
    particleColors: ['text-red-400', 'text-white', 'text-red-300'],
  },
  {
    id: 'instagram',
    name: 'انستجرام',
    icon: FaInstagram,
    containerClass: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 border-2 border-pink-300 text-white shadow-[0_10px_20px_rgba(236,72,153,0.5)]',
    positionClass: 'top-14 -left-1 sm:left-0 w-12 h-12 sm:w-14 sm:h-14',
    bobClass: 'animate-bob-3',
    glowColor: 'rgba(236,72,153,0.8)',
    burstInterval: 2400,
    counterText: '+3.2K',
    particleTypes: ['heart', 'user'],
    particleColors: ['text-pink-400', 'text-rose-300', 'text-amber-300', 'text-pink-200'],
  },
  {
    id: 'facebook',
    name: 'فيسبوك',
    icon: FaFacebookF,
    containerClass: 'bg-blue-600 border-2 border-blue-400 text-white shadow-[0_10px_20px_rgba(37,99,235,0.5)]',
    positionClass: 'top-16 right-12 sm:right-16 w-13 h-13 sm:w-15 sm:h-15',
    bobClass: 'animate-bob-1',
    glowColor: 'rgba(59,130,246,0.8)',
    burstInterval: 3800,
    counterText: '+850',
    particleTypes: ['user', 'like'],
    particleColors: ['text-blue-400', 'text-sky-300', 'text-blue-200'],
  },
  {
    id: 'telegram',
    name: 'تيليجرام',
    icon: FaTelegramPlane,
    containerClass: 'bg-sky-500 border-2 border-sky-300 text-white shadow-[0_10px_20px_rgba(14,165,233,0.5)]',
    positionClass: 'top-10 -right-2 sm:-right-1 w-11 h-11 sm:w-13 sm:h-13',
    bobClass: 'animate-bob-2',
    glowColor: 'rgba(56,189,248,0.8)',
    burstInterval: 3100,
    counterText: '+480',
    particleTypes: ['send', 'user'],
    particleColors: ['text-sky-300', 'text-white', 'text-sky-200'],
  },
  {
    id: 'twitter',
    name: 'تويتر X',
    icon: FaTwitter,
    containerClass: 'bg-black border-2 border-gray-600 text-white shadow-xl',
    positionClass: 'bottom-6 left-10 sm:left-12 w-11 h-11 sm:w-12 sm:h-12',
    bobClass: 'animate-bob-3',
    glowColor: 'rgba(156,163,175,0.8)',
    burstInterval: 4200,
    counterText: '+1.1K',
    particleTypes: ['user'],
    particleColors: ['text-gray-300', 'text-white', 'text-gray-400'],
  },
  {
    id: 'snapchat',
    name: 'سناب شات',
    icon: FaSnapchatGhost,
    containerClass: 'bg-yellow-400 border-2 border-amber-200 text-black shadow-[0_10px_20px_rgba(250,204,21,0.5)]',
    positionClass: 'bottom-4 right-4 sm:right-6 w-12 h-12 sm:w-14 sm:h-14',
    bobClass: 'animate-bob-1',
    glowColor: 'rgba(250,204,21,0.8)',
    burstInterval: 2600,
    counterText: '+4.8K',
    particleTypes: ['user', 'heart'],
    particleColors: ['text-yellow-300', 'text-amber-400', 'text-white'],
  },
];

const SinglePlatformIcon: React.FC<{ platform: PlatformConfig }> = ({ platform }) => {
  const IconComponent = platform.icon;
  const [particles, setParticles] = useState<Particle[]>([]);
  const [isPulsing, setIsPulsing] = useState(false);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Initial random delay offset so bursts don't all fire at once
    const initialOffset = Math.random() * 1500;

    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const triggerBurst = () => {
      // 1. Activation Pulse
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 500);

      // 2. Show floating counter badge occasionally
      if (Math.random() > 0.3) {
        setShowBadge(true);
        setTimeout(() => setShowBadge(false), 1800);
      }

      // 3. Generate 3-4 particles
      const count = 3 + Math.floor(Math.random() * 2);
      const newParticles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        const type = platform.particleTypes[Math.floor(Math.random() * platform.particleTypes.length)];
        const color = platform.particleColors[Math.floor(Math.random() * platform.particleColors.length)];
        const xOffset = (Math.random() - 0.5) * 44; // horizontal spread
        const yTarget = -45 - Math.random() * 35; // upward drift
        const scale = 0.7 + Math.random() * 0.5;

        newParticles.push({
          id: `${platform.id}-${Date.now()}-${i}`,
          type,
          color,
          xOffset,
          yTarget,
          scale,
        });
      }

      setParticles(newParticles);

      // Clean particles after animation completes
      setTimeout(() => setParticles([]), 2000);
    };

    timeoutId = setTimeout(() => {
      triggerBurst();
      intervalId = setInterval(triggerBurst, platform.burstInterval);
    }, initialOffset);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [platform]);

  const renderParticleIcon = (type: Particle['type']) => {
    switch (type) {
      case 'heart':
        return <Heart className="w-3.5 h-3.5 fill-current" />;
      case 'play':
        return <Play className="w-3 h-3 fill-current" />;
      case 'eye':
        return <Eye className="w-3.5 h-3.5" />;
      case 'like':
        return <ThumbsUp className="w-3.5 h-3.5 fill-current" />;
      case 'send':
        return <Send className="w-3 h-3 fill-current" />;
      case 'user':
      default:
        return <User className="w-3.5 h-3.5 fill-current" />;
    }
  };

  return (
    <div className={`absolute ${platform.positionClass} ${platform.bobClass} pointer-events-auto`}>
      {/* Floating Counter Badge Overlay */}
      <AnimatePresence>
        {showBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, y: 0 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.1, 1, 0.85], y: -28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 z-30 pointer-events-none px-2 py-0.5 rounded-full bg-black/90 border border-[#E31E24]/60 text-[#E31E24] font-black text-[10px] tracking-wider font-mono shadow-[0_0_12px_rgba(227,30,36,0.6)] whitespace-nowrap"
          >
            {platform.counterText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Burst Particles */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        {particles.map(p => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.3, x: 0, y: 0 }}
            animate={{
              opacity: [0, 1, 0.9, 0],
              scale: [0.3, p.scale, p.scale * 0.8, 0.2],
              x: p.xOffset,
              y: p.yTarget,
            }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className={`absolute ${p.color} drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]`}
          >
            {renderParticleIcon(p.type)}
          </motion.div>
        ))}
      </div>

      {/* Main Icon Tile with Heartbeat Pulse */}
      <motion.div
        animate={{
          scale: isPulsing ? 1.09 : 1,
          boxShadow: isPulsing
            ? `0 0 25px ${platform.glowColor}, 0 0 45px ${platform.glowColor}`
            : undefined,
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`w-full h-full rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 ${platform.containerClass}`}
        title={platform.name}
      >
        <IconComponent className="text-xl sm:text-2xl" />
      </motion.div>
    </div>
  );
};

export const PlatformIconCluster: React.FC = () => {
  return (
    <div className="relative w-64 h-52 sm:w-72 sm:h-56 shrink-0 flex items-center justify-center select-none">
      {/* Red Pedestal Ring Base with Glow Pulse */}
      <div className="absolute bottom-2 w-48 h-12 rounded-full border-2 border-[#E31E24]/60 bg-[#E31E24]/10 blur-[1px] shadow-[0_0_20px_rgba(227,30,36,0.6)] transform rotate-x-60 animate-pulse-glow" />

      {/* Render 7 Platform Icons with Particle Emanation */}
      {PLATFORMS.map(platform => (
        <SinglePlatformIcon key={platform.id} platform={platform} />
      ))}
    </div>
  );
};
