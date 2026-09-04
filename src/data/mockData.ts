import { SMMService, SMMOrder, UserProfile, SocialPost, ChatConversation, GroupItem, NotificationItem, GamePackage, PlatformStats } from '../types';

export const CURRENT_USER: UserProfile = {
  id: 'user_me',
  name: 'أحمد السامرائي',
  username: 'ahmed_smm',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  verified: true,
  bio: 'خبير تسويق رقمي وصانع محتوى ألعاب | وكيل معتمد لدى عالم الشرق الأوسط',
  followers: 14200,
  following: 380,
  balanceUSD: 125.50,
  ordersCount: 28,
  isOnline: true,
};

export const PLATFORM_STATS: PlatformStats = {
  totalMembers: 148500,
  activeMembers: 32410,
  todayPosts: 1280,
  activeGroups: 450,
  todayChats: 8930,
};

export const INITIAL_SERVICES: SMMService[] = [
  // TikTok
  {
    id: 101,
    name: 'متابعين تيك توك حسابات حقيقية عربية (سرعة فائقة)',
    category: 'متابعين تيك توك',
    rate: 1.20,
    min: 100,
    max: 100000,
    platform: 'tiktok',
    isPopular: true,
    description: 'متابعين حقيقيين ومتفاعلين مع ضمان عدم النقص لمدة 30 يوم.'
  },
  {
    id: 102,
    name: 'لايكات تيك توك فورية (حسابات موثقة)',
    category: 'لايكات تيك توك',
    rate: 0.45,
    min: 100,
    max: 500000,
    platform: 'tiktok',
    isPopular: true,
    description: 'تسليم فوري فور إرسال الرابط بدون الحاجة لكلمة المرور.'
  },
  {
    id: 103,
    name: 'مشاهدات تيك توك فائقة السرعة (اكسبلور مضمون)',
    category: 'مشاهدات تيك توك',
    rate: 0.02,
    min: 1000,
    max: 10000000,
    platform: 'tiktok',
    isPopular: true,
    description: 'تساعد مقطعك على الصعود لقائمة الاكسبلور.'
  },
  {
    id: 104,
    name: 'مشاركات وإعادة نشر تيك توك (Share & Repost)',
    category: 'مشاركات تيك توك',
    rate: 0.30,
    min: 50,
    max: 50000,
    platform: 'tiktok',
  },

  // Instagram
  {
    id: 201,
    name: 'متابعين إنستغرام VIP خليجي / عربي متفاعل',
    category: 'متابعين إنستغرام',
    rate: 2.10,
    min: 100,
    max: 50000,
    platform: 'instagram',
    isPopular: true,
    description: 'متابعين عرب حقيقيين مع تفاعل حقيقي وضمان تعويض تلقائي.'
  },
  {
    id: 202,
    name: 'لايكات إنستغرام فورية حقيقية',
    category: 'لايكات إنستغرام',
    rate: 0.25,
    min: 50,
    max: 200000,
    platform: 'instagram',
  },
  {
    id: 203,
    name: 'مشاهدات ريلز ستوري إنستغرام عالية الجودة',
    category: 'مشاهدات إنستغرام',
    rate: 0.05,
    min: 500,
    max: 5000000,
    platform: 'instagram',
  },
  {
    id: 204,
    name: 'تعليقات مخصصة إنستغرام حسابات عربية',
    category: 'تعليقات إنستغرام',
    rate: 3.50,
    min: 10,
    max: 2000,
    platform: 'instagram',
  },

  // YouTube
  {
    id: 301,
    name: 'مشتركين يوتيوب حقيقيين (ضمان عدم النقص مدى الحياة)',
    category: 'خدمات يوتيوب',
    rate: 12.00,
    min: 100,
    max: 20000,
    platform: 'youtube',
    isPopular: true,
    description: 'مشتركين معتمدين لا يضرون بالقناة ومناسبين للتفعيل.'
  },
  {
    id: 302,
    name: 'ساعات مشاهدة يوتيوب لشرط تحقيق الربح (4000 ساعة)',
    category: 'خدمات يوتيوب',
    rate: 35.00,
    min: 1000,
    max: 4000,
    platform: 'youtube',
    description: 'مشاهدات عالية الاحتباس لتفعيل الربح بنجاح 100%.'
  },
  {
    id: 303,
    name: 'لايكات وفيديوهات قصيرة يوتيوب Shorts',
    category: 'خدمات يوتيوب',
    rate: 1.50,
    min: 100,
    max: 50000,
    platform: 'youtube',
  },

  // Facebook
  {
    id: 401,
    name: 'اعجابات ومتابعين صفحات فيسبوك العامة',
    category: 'خدمات فيسبوك',
    rate: 2.80,
    min: 200,
    max: 100000,
    platform: 'facebook',
  },
  {
    id: 402,
    name: 'لايكات وتفاعلات منشورات فيسبوك (Love, Wow, Haha)',
    category: 'خدمات فيسبوك',
    rate: 0.60,
    min: 100,
    max: 50000,
    platform: 'facebook',
  },

  // Telegram
  {
    id: 501,
    name: 'أعضاء قنوات ومجموعات تيليجرام حقيقيين',
    category: 'قنوات تيليجرام',
    rate: 1.10,
    min: 100,
    max: 200000,
    platform: 'telegram',
    isPopular: true,
  },
  {
    id: 502,
    name: 'مشاهدات منشورات تيليجرام (آخر 10 منشورات)',
    category: 'قنوات تيليجرام',
    rate: 0.10,
    min: 1000,
    max: 1000000,
    platform: 'telegram',
  },

  // Twitter / X
  {
    id: 601,
    name: 'متابعين منصة X (تويتر) حسابات موثقة بخطوة التفعيل',
    category: 'خدمات تويتر X',
    rate: 4.50,
    min: 100,
    max: 50000,
    platform: 'twitter',
  },
  {
    id: 602,
    name: 'إعادة تغريد Retweet + لايكات منشورات X',
    category: 'خدمات تويتر X',
    rate: 1.80,
    min: 50,
    max: 20000,
    platform: 'twitter',
  },

  // Snapchat
  {
    id: 701,
    name: 'متابعين سناب شات حقيقيين عرب',
    category: 'خدمات سناب شات',
    rate: 6.00,
    min: 100,
    max: 25000,
    platform: 'snapchat',
  },
  {
    id: 702,
    name: 'مشاهدات منصة اضواء سناب شات Spotlight',
    category: 'خدمات سناب شات',
    rate: 0.80,
    min: 1000,
    max: 500000,
    platform: 'snapchat',
  },

  // Special/Other Services
  {
    id: 801,
    name: 'شراء أرقام افتراضية وتفعيل الواتساب والتليجرام',
    category: 'شراء أرقام',
    rate: 0.90,
    min: 1,
    max: 10,
    platform: 'other',
  },
  {
    id: 802,
    name: 'شحن عملات تيك توك بأرخص سعر في السوق',
    category: 'شحن عملات',
    rate: 8.50,
    min: 100,
    max: 50000,
    platform: 'tiktok',
  },
  {
    id: 803,
    name: 'مشاهدات البث المباشر (TikTok Live Stream Views)',
    category: 'مشاهدات بث مباشر',
    rate: 2.20,
    min: 100,
    max: 10000,
    platform: 'tiktok',
  }
];

export const INITIAL_ORDERS: SMMOrder[] = [
  {
    id: 948210,
    serviceId: 101,
    serviceName: 'متابعين تيك توك حسابات حقيقية عربية (سرعة فائقة)',
    platform: 'tiktok',
    link: 'https://tiktok.com/@ahmed_smm',
    quantity: 5000,
    priceUSD: 6.00,
    status: 'Completed',
    date: '2026-08-01 14:30',
    refillable: true,
    cancelable: false,
    type: 'smm'
  },
  {
    id: 948211,
    serviceId: 201,
    serviceName: 'متابعين إنستغرام VIP خليجي / عربي متفاعل',
    platform: 'instagram',
    link: 'https://instagram.com/brand_store',
    quantity: 2000,
    priceUSD: 4.20,
    status: 'In progress',
    date: '2026-08-01 18:15',
    refillable: true,
    cancelable: true,
    type: 'smm'
  },
  {
    id: 948212,
    serviceId: 901,
    serviceName: 'شحن شدات ببجي موبايل 660 UC',
    platform: 'pubg',
    link: 'ID: 5129481023',
    quantity: 660,
    priceUSD: 9.99,
    status: 'Completed',
    date: '2026-08-01 22:00',
    refillable: false,
    cancelable: false,
    type: 'game'
  },
  {
    id: 948213,
    serviceId: 501,
    serviceName: 'أعضاء قنوات ومجموعات تيليجرام حقيقيين',
    platform: 'telegram',
    link: 'https://t.me/alsharq_world_official',
    quantity: 3000,
    priceUSD: 3.30,
    status: 'Pending',
    date: '2026-08-02 00:10',
    refillable: true,
    cancelable: true,
    type: 'smm'
  }
];

export const GAME_PACKAGES: GamePackage[] = [
  // PUBG Mobile UC (10% off wholesale pricing)
  { id: 'pubg-2', game: 'pubg', amount: 325, unit: 'UC', priceUSD: 3.82 },
  { id: 'pubg-3', game: 'pubg', amount: 660, unit: 'UC', priceUSD: 7.64 },
  { id: 'pubg-4', game: 'pubg', amount: 1800, unit: 'UC', priceUSD: 19.12 },
  { id: 'pubg-5', game: 'pubg', amount: 3850, unit: 'UC', priceUSD: 34.42 },
  { id: 'pubg-6', game: 'pubg', amount: 8100, unit: 'UC', priceUSD: 76.49 },

  // Free Fire Diamonds (10% off wholesale pricing)
  { id: 'ff-1', game: 'freefire', amount: 100, unit: 'جواهر', priceUSD: 0.76 },
  { id: 'ff-2', game: 'freefire', amount: 310, unit: 'جواهر', priceUSD: 2.29 },
  { id: 'ff-3', game: 'freefire', amount: 520, unit: 'جواهر', priceUSD: 3.82 },
  { id: 'ff-4', game: 'freefire', amount: 1060, unit: 'جواهر', priceUSD: 7.64 },
  { id: 'ff-5', game: 'freefire', amount: 2180, unit: 'جواهر', priceUSD: 15.29 },
  { id: 'ff-6', game: 'freefire', amount: 5600, unit: 'جواهر', priceUSD: 38.24 },

  // eFootball Coins (10% off wholesale pricing)
  { id: 'ef-1', game: 'efootball', amount: 260, unit: 'كوينز', priceUSD: 1.52 },
  { id: 'ef-2', game: 'efootball', amount: 550, unit: 'كوينز', priceUSD: 3.05 },
  { id: 'ef-3', game: 'efootball', amount: 1040, unit: 'كوينز', priceUSD: 5.35 },
  { id: 'ef-4', game: 'efootball', amount: 2130, unit: 'كوينز', priceUSD: 10.70 },
  { id: 'ef-5', game: 'efootball', amount: 3250, unit: 'كوينز', priceUSD: 15.29 },
  { id: 'ef-6', game: 'efootball', amount: 5600, unit: 'كوينز', priceUSD: 26.77 },

  // TikTok Coins — أسعار رسمية (يناير 2026) مع خصم 15%
  { id: 'tiktok-1', game: 'tiktok', amount: 65, unit: 'كوينز', priceUSD: 0.84 },
  { id: 'tiktok-2', game: 'tiktok', amount: 330, unit: 'كوينز', priceUSD: 4.24 },
  { id: 'tiktok-3', game: 'tiktok', amount: 660, unit: 'كوينز', priceUSD: 8.49 },
  { id: 'tiktok-4', game: 'tiktok', amount: 1321, unit: 'كوينز', priceUSD: 16.99 },
  { id: 'tiktok-5', game: 'tiktok', amount: 3303, unit: 'كوينز', priceUSD: 42.49 },
  { id: 'tiktok-6', game: 'tiktok', amount: 6607, unit: 'كوينز', priceUSD: 84.99 },

  // اشتراكات AI
  { id: 'ai-1', game: 'ai', amount: 1, unit: 'شهر', priceUSD: 16.99, label: 'ChatGPT Plus' },
  { id: 'ai-2', game: 'ai', amount: 1, unit: 'شهر', priceUSD: 15.29, label: 'Claude Pro' },
  { id: 'ai-3', game: 'ai', amount: 1, unit: 'شهر', priceUSD: 8.49, label: 'Midjourney (Standard)' },
  { id: 'ai-4', game: 'ai', amount: 1, unit: 'شهر', priceUSD: 16.99, label: 'Gemini Advanced' },
  { id: 'ai-5', game: 'ai', amount: 1, unit: 'شهر', priceUSD: 11.04, label: 'Perplexity Pro' },
  { id: 'ai-6', game: 'ai', amount: 1, unit: 'شهر', priceUSD: 25.49, label: 'ChatGPT Plus + Claude Pro (باقة مزدوجة)' },
];

export const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'post-sale-1',
    author: {
      id: 'user_1',
      name: 'محمد العتيبي',
      username: 'alotaibi_gamer',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
      verified: true,
      bio: 'تاجر حسابات وألعاب إلكترونية موثق | وكيل عالم الشرق الأوسط',
      followers: 8200,
      following: 120,
      balanceUSD: 50.00,
      ordersCount: 12,
      isOnline: true,
    },
    timestamp: 'منذ 10 دقائق',
    content: '🔥 للبيع: حساب ببجي كونكر موسم سابق فخم جداً!\n• المستوى: 74\n• M416 الثلجي مكس + بدلة X-Suit الفرعونية\n• عدد الـ UC المتبقية: 1,800 UC\n• الربط: تويتر + بريد إلكتروني نظيف\nالتعامل عبر وسيط الموقع لضمان الحقوق! اضغط على "تواصل الآن" للتفاوض.',
    hashtags: ['حساب_ببجي_للبيع', 'PUBGMobile', 'وساطة_عالم_الشرق_الأوسط'],
    gameTag: 'PUBG Mobile',
    priceTag: '$180 (قابل للتفاوض)',
    isAccountSale: true,
    images: [
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80'
    ],
    likesCount: 240,
    isLiked: true,
    commentsCount: 3,
    comments: [
      {
        id: 'c-1',
        author: {
          name: 'خالد الناصر',
          avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
          verified: false
        },
        content: 'الحساب تسليمه فوري مع الوسيط؟',
        timestamp: 'منذ 8 دقائق',
        replies: [
          {
            id: 'c-1-r1',
            author: {
              name: 'محمد العتيبي',
              avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=250&q=80',
              verified: true
            },
            content: 'نعم يا غالي التسليم فوري أول ما الوسيط يثبت القيمة بالرصيد 👍',
            timestamp: 'منذ 5 دقائق'
          }
        ]
      },
      {
        id: 'c-2',
        author: {
          name: 'سارة الشمري',
          avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=250&q=80',
          verified: true
        },
        content: 'بالتوفيق يا بطل، حساب مشاء الله تبارك الله بطل 🔥',
        timestamp: 'منذ 3 دقائق'
      }
    ],
    sharesCount: 19,
    isBookmarked: false,
    category: 'all',
  },
  {
    id: 'post-sale-2',
    author: {
      id: 'user_4',
      name: 'كابتن ياسين',
      username: 'yassine_ff',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      verified: true,
      bio: 'مطور وجيمر | بائع ألعاب موثوق',
      followers: 12400,
      following: 80,
      balanceUSD: 210.00,
      ordersCount: 45,
      isOnline: true,
    },
    timestamp: 'منذ ساعة',
    content: '💎 للبيع: حساب فري فاير نادر مع سكنات الفاير باسات القديمة من الموسم 3!\n• يحتوي على 2,180 جوهر جاهزة بالشحن\n• الحساب متصل برابط فيسبوك مخصص للبيع\nتواصل معي عبر الزر المباشر للتفاهم.',
    hashtags: ['فري_فاير', 'حسابات_فري_فاير', 'FreeFire'],
    gameTag: 'Free Fire',
    priceTag: '$95.00',
    isAccountSale: true,
    images: [
      'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80'
    ],
    likesCount: 112,
    isLiked: false,
    commentsCount: 2,
    comments: [
      {
        id: 'c-3',
        author: {
          name: 'عمار الجبوري',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=250&q=80',
          verified: false
        },
        content: 'تستقبل البدل بحساب إيفوتبول قير مكس؟',
        timestamp: 'منذ 30 دقيقة'
      }
    ],
    sharesCount: 8,
    isBookmarked: true,
    category: 'all',
  },
  {
    id: 'post-2',
    author: {
      id: 'user_2',
      name: 'فريق الدعم الفني',
      username: 'smm_support',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=250&q=80',
      verified: true,
      bio: 'الحساب الرسمي لمنصة عالم الشرق الأوسط للدعم والخدمات',
      followers: 45000,
      following: 10,
      balanceUSD: 9999,
      ordersCount: 999,
      isOnline: true,
    },
    timestamp: 'منذ ساعتين',
    content: '📢 تنبيه مهم لجميع مستخدمينا الكرام:\nجميع عمليات الشحن وتحويل الرصيد تتم حصريًا عن طريق وكيل الموقع الرسمي المتواجد بالموقع. لا تقم بتحويل أي مبالغ خارج المنصة لضمان أمان حسابك 100%.',
    hashtags: ['تنبيه', 'حماية', 'عالم_الشرق_الأوسط'],
    likesCount: 542,
    isLiked: false,
    commentsCount: 45,
    comments: [],
    sharesCount: 88,
    isBookmarked: true,
    category: 'all',
  },
  {
    id: 'post-3',
    author: {
      id: 'user_3',
      name: 'عمر القحطاني',
      username: 'omar_digital',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      verified: false,
      bio: 'مسوق الكتروني وصانع محتوى تيك توك',
      followers: 3100,
      following: 200,
      balanceUSD: 85.20,
      ordersCount: 19,
      isOnline: false,
    },
    timestamp: 'منذ 4 ساعات',
    content: 'استطلاع رأي لجميع صناع المحتوى: ما هي المنصة الأهم بالنسبة لك في زيادة التفاعل هذا الشهر؟ 🚀',
    hashtags: ['تسويق', 'تيك_توك', 'إنستغرام'],
    poll: {
      question: 'أفضل منصة للتفاعل حالياً:',
      options: [
        { id: 'opt-1', text: 'تيك توك (TikTok)', votes: 142 },
        { id: 'opt-2', text: 'إنستغرام ريلز (Reels)', votes: 89 },
        { id: 'opt-3', text: 'يوتيوب شورتس (Shorts)', votes: 56 },
        { id: 'opt-4', text: 'منصة X (تويتر)', votes: 31 },
      ],
      totalVotes: 318,
      userVotedId: 'opt-1'
    },
    likesCount: 96,
    isLiked: false,
    commentsCount: 18,
    comments: [],
    sharesCount: 6,
    isBookmarked: false,
    category: 'following',
  }
];

export const INITIAL_CONVERSATIONS: ChatConversation[] = [
  {
    id: 'chat-1',
    user: {
      id: 'user_agent_1',
      name: 'الوكيل المعتمد - أبو فهد',
      username: 'agent_abufahd',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
      verified: true,
      bio: 'وكيل المبيعات المباشر والوسيط المالي للموقع',
      followers: 19000,
      following: 5,
      balanceUSD: 1000,
      ordersCount: 140,
      isOnline: true,
    },
    lastMessage: 'تم إيداع مبلغ $50 في حسابك بنجاح. شكراً لتعاملك معنا!',
    timestamp: '10:45 ص',
    unreadCount: 1,
    messages: [
      { id: 'm-1', senderId: 'user_me', text: 'مرحباً أبو فهد، أريد إيداع $50 عن طريق زين كاش.', timestamp: '10:40 ص', isMine: true },
      { id: 'm-2', senderId: 'user_agent_1', text: 'أهلاً بك أستاذ أحمد. تفضل أرسل الحوالة على الرقم 07800000000 وسوف أضيف الرصيد فوراً.', timestamp: '10:42 ص', isMine: false },
      { id: 'm-3', senderId: 'user_me', text: 'تم الإرسال وأرفقت إشعار التحويل.', timestamp: '10:44 ص', isMine: true },
      { id: 'm-4', senderId: 'user_agent_1', text: 'تم إيداع مبلغ $50 في حسابك بنجاح. شكراً لتعاملك معنا!', timestamp: '10:45 ص', isMine: false },
    ]
  },
  {
    id: 'chat-2',
    user: {
      id: 'user_support',
      name: 'دعم خدمات السوشيال ميديا',
      username: 'support_smm',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80',
      verified: true,
      bio: 'فريق الدعم الفني لمتابعة الطلبات وتعديلها',
      followers: 12000,
      following: 0,
      balanceUSD: 0,
      ordersCount: 0,
      isOnline: true,
    },
    lastMessage: 'طلب المتابعين رقم #948210 اكتمل بنجاح، يمكنك التحقق الآن.',
    timestamp: 'أمس',
    unreadCount: 0,
    messages: [
      { id: 'm-10', senderId: 'user_support', text: 'طلب المتابعين رقم #948210 اكتمل بنجاح، يمكنك التحقق الآن.', timestamp: 'أمس', isMine: false },
    ]
  }
];

export const INITIAL_GROUPS: GroupItem[] = [
  {
    id: 'group-1',
    name: 'مجتمع لاعبي PUBG Mobile الخليج 🎮',
    avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=250&q=80',
    membersCount: 4820,
    type: 'عام',
    unreadBadge: 5,
    description: 'مجموعة رسمية لتنسيق السكوادات والبطولات الأسبوعية وشحن الـ UC.'
  },
  {
    id: 'group-2',
    name: 'تجار ومسوقي خدمات السوشيال ميديا 🚀',
    avatar: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=250&q=80',
    membersCount: 8900,
    type: 'خاص',
    unreadBadge: 12,
    description: 'نقاشات أصحاب البانلات والعروض الخاصة بأسعار الجملة.'
  },
  {
    id: 'group-3',
    name: 'صناع محتوى تيك توك وإكسبلور 📱',
    avatar: 'https://images.unsplash.com/photo-1611605697805-88a543778812?auto=format&fit=crop&w=250&q=80',
    membersCount: 3200,
    type: 'عام',
    unreadBadge: 0,
    description: 'تبادل الخبرات وأفكار المقاطع الفيروسية واستراتيجيات الانتشار.'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'تم إكتمال الطلب بنجاح! 🎉',
    description: 'طلب متابعين تيك توك رقم #948210 أكتمل بنجاح (5,000 متابع).',
    timestamp: 'منذ 10 دقائق',
    type: 'order',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'تأكيد إيداع رصيد 💳',
    description: 'تمت إضافة $50.00 إلى رصيد حسابك عن طريق زين كاش.',
    timestamp: 'منذ ساعة',
    type: 'deposit',
    read: false,
  },
  {
    id: 'notif-3',
    title: 'تفاعل جديد على منشورك ❤️',
    description: 'قام محمد العتيبي بوضع إعجاب على منشورك الاخير.',
    timestamp: 'منذ 3 ساعات',
    type: 'social',
    read: true,
  },
  {
    id: 'notif-4',
    title: 'خصومات حصرية على شدات ببجي 🔥',
    description: 'تم تخفيض أسعار حزم الـ UC بنسبة تصل إلى 25% لفترة محدودة.',
    timestamp: 'منذ يوم',
    type: 'system',
    read: true,
  }
];
