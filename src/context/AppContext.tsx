import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  CurrencyCode,
  CurrencyConfig,
  MainTab,
  FeedSubTab,
  SMMService,
  SMMOrder,
  UserProfile,
  SocialPost,
  ChatConversation,
  ChatMessage,
  GroupItem,
  NotificationItem,
  GamePackage,
  OrderStatus,
} from '../types';
import {
  CURRENT_USER,
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_POSTS,
  INITIAL_CONVERSATIONS,
  INITIAL_GROUPS,
  INITIAL_NOTIFICATIONS,
  GAME_PACKAGES,
} from '../data/mockData';
import { fetchServices, createSMMOrder, cancelSMMOrder, requestRefill, checkOrderStatus } from '../services/smmApi';
import { supabase } from '../lib/supabaseClient';
import { playSuccessSound, playErrorSound, playMessageSound } from '../lib/sounds';
import { useAuth } from './AuthContext';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: { code: 'USD', symbol: '$', rate: 1.0, flag: '🇺🇸' },
  EUR: { code: 'EUR', symbol: '€', rate: 0.92, flag: '🇪🇺' },
  SAR: { code: 'SAR', symbol: 'ر.س', rate: 3.75, flag: '🇸🇦' },
  AED: { code: 'AED', symbol: 'د.إ', rate: 3.67, flag: '🇦🇪' },
};

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  // Theme & Settings
  isDarkMode: boolean;
  toggleTheme: () => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (amountUSD: number) => string;

  // View Navigation
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  feedSubTab: FeedSubTab;
  setFeedSubTab: (tab: FeedSubTab) => void;
  gameFilter: 'pubg' | 'freefire' | 'efootball' | 'tiktok' | 'ai';
  setGameFilter: (game: 'pubg' | 'freefire' | 'efootball' | 'tiktok' | 'ai') => void;

  // User & Balance
  user: UserProfile;
  depositFunds: (amountUSD: number) => void;
  refreshBalance: () => Promise<void>;
  updateUserAvatar: (newAvatarUrl: string) => void;
  removeUserAvatar: () => void;
  isAvatarModalOpen: boolean;
  openAvatarModal: () => void;
  closeAvatarModal: () => void;

  // Services & Orders
  services: SMMService[];
  isLoadingServices: boolean;
  reloadServices: () => Promise<void>;
  selectedPlatformFilter: string;
  setSelectedPlatformFilter: (platform: string) => void;
  orders: SMMOrder[];
  placeOrder: (service: SMMService, link: string, quantity: number) => Promise<boolean>;
  placeGameOrder: (pkg: GamePackage, playerUID: string) => Promise<boolean>;
  handleCancelOrder: (orderId: number) => Promise<void>;
  handleRefillOrder: (orderId: number) => Promise<void>;

  // Social Feed
  posts: SocialPost[];
  createPost: (postData: Partial<SocialPost>) => void;
  togglePostLike: (postId: string) => void;
  addPostComment: (postId: string, text: string) => void;
  loadPostComments: (postId: string) => void;
  sharePost: (postId: string) => void;
  togglePostBookmark: (postId: string) => void;
  votePollOption: (postId: string, optionId: string) => void;

  // Chats & Groups
  conversations: ChatConversation[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendChatMessage: (chatId: string, text: string) => void;
  startDirectChatWithUser: (targetUser: UserProfile, initialContext?: string) => void;
  groups: GroupItem[];

  // Notifications
  notifications: NotificationItem[];
  unreadNotifCount: number;
  markNotificationsRead: () => void;
  addNotification: (title: string, description: string, type: 'order' | 'deposit' | 'social' | 'system') => void;

  // Modals
  isCreatePostOpen: boolean;
  initialPostType: string;
  openCreatePost: (type?: string) => void;
  closeCreatePost: () => void;

  isOrderModalOpen: boolean;
  selectedServiceForOrder: SMMService | null;
  openOrderModal: (service: SMMService) => void;
  closeOrderModal: () => void;

  isGameModalOpen: boolean;
  selectedGamePackage: GamePackage | null;
  gamePackages: GamePackage[];
  openGameModal: (pkg: GamePackage) => void;
  closeGameModal: () => void;

  isDepositModalOpen: boolean;
  openDepositModal: () => void;
  closeDepositModal: () => void;

  isQuickActionModalOpen: boolean;
  openQuickActionModal: () => void;
  closeQuickActionModal: () => void;

  selectedUserProfile: UserProfile | null;
  openUserProfileModal: (user: UserProfile) => void;
  closeUserProfileModal: () => void;

  isApiSettingsOpen: boolean;
  openApiSettingsModal: () => void;
  closeApiSettingsModal: () => void;

  isResellerModalOpen: boolean;
  openResellerModal: () => void;
  closeResellerModal: () => void;

  isAffiliateModalOpen: boolean;
  openAffiliateModal: () => void;
  closeAffiliateModal: () => void;

  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;

  lightboxImage: string | null;
  openLightbox: (url: string) => void;
  closeLightbox: () => void;

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  // Navigation state
  const [activeTab, setActiveTab] = useState<MainTab>('feed');
  const [feedSubTab, setFeedSubTab] = useState<FeedSubTab>('posts');
  const [gameFilter, setGameFilter] = useState<'pubg' | 'freefire' | 'efootball' | 'tiktok' | 'ai'>('pubg');

  // User state
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const { session } = useAuth();

  // Sync real balance + name + id from the Supabase "profiles" table
  const refreshBalance = async () => {
    if (!session?.user?.id) return;
    const fetchProfile = () =>
      supabase
        .from('profiles')
        .select('id, full_name, balance')
        .eq('id', session.user.id)
        .maybeSingle();

    let { data, error } = await fetchProfile();

    // Profile row may not exist yet right after signup (trigger race) — retry once shortly after.
    if (!error && !data) {
      await new Promise(resolve => setTimeout(resolve, 800));
      ({ data, error } = await fetchProfile());
    }

    if (!error && data) {
      setUser(prev => ({
        ...prev,
        id: data.id,
        name: data.full_name || prev.name,
        balanceUSD: typeof data.balance === 'number' ? data.balance : 0,
      }));
    } else {
      // No profile row found at all — treat as a brand-new account with 0 balance
      // instead of showing whatever balance was left over from a previous session.
      setUser(prev => ({
        ...prev,
        id: session.user.id,
        balanceUSD: 0,
      }));
    }
  };

  useEffect(() => {
    refreshBalance();
  }, [session?.user?.id]);

  // Services & Orders state
  const [services, setServices] = useState<SMMService[]>(INITIAL_SERVICES);
  const [isLoadingServices, setIsLoadingServices] = useState<boolean>(false);
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [orders, setOrders] = useState<SMMOrder[]>(INITIAL_ORDERS);

  // Game top-up / AI subscription packages — start from the static defaults,
  // then overridden with live prices from Supabase if the admin has customized them.
  const [gamePackages, setGamePackages] = useState<GamePackage[]>(GAME_PACKAGES);

  const loadGamePackages = async () => {
    const { data, error } = await supabase
      .from('game_packages')
      .select('id, game, amount, unit, price_usd, label')
      .order('game', { ascending: true });
    if (!error && data && data.length > 0) {
      setGamePackages(
        data.map((row: any) => ({
          id: row.id,
          game: row.game,
          amount: Number(row.amount),
          unit: row.unit,
          priceUSD: Number(row.price_usd),
          label: row.label || undefined,
        }))
      );
    }
  };

  useEffect(() => {
    loadGamePackages();
  }, []);

  // Social Feed state — starts empty and is filled with real posts from Supabase
  const [posts, setPosts] = useState<SocialPost[]>([]);

  const mapDbPostToSocialPost = (row: any, likedSet: Set<string>): SocialPost => ({
    id: row.id,
    author: {
      id: row.user_id,
      name: row.profiles?.full_name || 'مستخدم',
      username: row.profiles?.full_name ? row.profiles.full_name.replace(/\s+/g, '_') : 'user',
      avatar: DEFAULT_AVATAR,
      verified: false,
      bio: '',
      followers: 0,
      following: 0,
      balanceUSD: 0,
      ordersCount: 0,
    },
    timestamp: new Date(row.created_at).toLocaleString('ar-EG'),
    content: row.content || '',
    hashtags: row.hashtags || [],
    gameTag: row.game_tag || undefined,
    priceTag: row.price_tag || undefined,
    images: row.image_url ? [row.image_url] : undefined,
    video: row.video_url ? { url: row.video_url, duration: '' } : undefined,
    location: row.location || undefined,
    likesCount: row.post_likes?.[0]?.count || 0,
    isLiked: likedSet.has(row.id),
    commentsCount: row.post_comments?.[0]?.count || 0,
    comments: [],
    sharesCount: row.shares_count || 0,
    isBookmarked: false,
    category: 'all',
  });

  const loadPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select(
        'id, user_id, content, hashtags, game_tag, price_tag, location, image_url, video_url, shares_count, created_at, profiles(full_name), post_likes(count), post_comments(count)'
      )
      .order('created_at', { ascending: false })
      .limit(100);

    let likedSet = new Set<string>();
    if (session?.user?.id) {
      const { data: likedRows } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', session.user.id);
      likedSet = new Set((likedRows || []).map((r: any) => r.post_id));
    }

    if (!error && data) {
      setPosts(data.map((row: any) => mapDbPostToSocialPost(row, likedSet)));
    }
  };

  // Chats & Groups state — real per-account message history from Supabase,
  // merged onto the demo contact list for names/avatars.
  const [conversations, setConversations] = useState<ChatConversation[]>(
    INITIAL_CONVERSATIONS.map(c => ({ ...c, messages: [], lastMessage: '', unreadCount: 0 }))
  );
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [groups] = useState<GroupItem[]>(INITIAL_GROUPS);

  const loadChatMessages = async () => {
    if (!session?.user?.id) return;
    const { data, error } = await supabase
      .from('chat_messages')
      .select('id, contact_key, text, is_mine, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: true });

    if (error || !data) return;

    const byContact: Record<string, ChatMessage[]> = {};
    data.forEach((row: any) => {
      const msg: ChatMessage = {
        id: row.id,
        senderId: row.is_mine ? user.id : row.contact_key,
        text: row.text,
        timestamp: new Date(row.created_at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isMine: !!row.is_mine,
      };
      if (!byContact[row.contact_key]) byContact[row.contact_key] = [];
      byContact[row.contact_key].push(msg);
    });

    setConversations(prev =>
      prev.map(c => {
        const msgs = byContact[c.id];
        if (!msgs || msgs.length === 0) return c;
        const last = msgs[msgs.length - 1];
        return { ...c, messages: msgs, lastMessage: last.text, timestamp: last.timestamp };
      })
    );
  };

  useEffect(() => {
    loadPosts();
    loadChatMessages();
  }, [session?.user?.id]);

  // Notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState<boolean>(false);
  const [initialPostType, setInitialPostType] = useState<string>('text');

  const [isOrderModalOpen, setIsOrderModalOpen] = useState<boolean>(false);
  const [selectedServiceForOrder, setSelectedServiceForOrder] = useState<SMMService | null>(null);

  const [isGameModalOpen, setIsGameModalOpen] = useState<boolean>(false);
  const [selectedGamePackage, setSelectedGamePackage] = useState<GamePackage | null>(null);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState<boolean>(false);
  const [isQuickActionModalOpen, setIsQuickActionModalOpen] = useState<boolean>(false);

  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [isApiSettingsOpen, setIsApiSettingsOpen] = useState<boolean>(false);
  const [isResellerModalOpen, setIsResellerModalOpen] = useState<boolean>(false);
  const [isAffiliateModalOpen, setIsAffiliateModalOpen] = useState<boolean>(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=250&q=80';

  const openAvatarModal = () => setIsAvatarModalOpen(true);
  const closeAvatarModal = () => setIsAvatarModalOpen(false);

  const updateUserAvatar = (newAvatarUrl: string) => {
    setUser(prev => ({ ...prev, avatar: newAvatarUrl }));
    setPosts(prev =>
      prev.map(p =>
        p.author.id === user.id ? { ...p, author: { ...p.author, avatar: newAvatarUrl } } : p
      )
    );
    showToast('تم تحديث الصورة الشخصية بنجاح! ✨', 'success');
  };

  const removeUserAvatar = () => {
    setUser(prev => ({ ...prev, avatar: DEFAULT_AVATAR }));
    setPosts(prev =>
      prev.map(p =>
        p.author.id === user.id ? { ...p, author: { ...p.author, avatar: DEFAULT_AVATAR } } : p
      )
    );
    showToast('تمت إزالة الصورة الشخصية والعودة للصورة الافتراضية', 'info');
  };

  // Toast state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    if (type === 'success') playSuccessSound();
    else if (type === 'error') playErrorSound();
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const formatPrice = (amountUSD: number): string => {
    const conf = CURRENCIES[currency];
    const converted = amountUSD * conf.rate;
    if (currency === 'USD' || currency === 'EUR') {
      return `${conf.symbol}${converted.toFixed(2)}`;
    }
    return `${converted.toFixed(2)} ${conf.symbol}`;
  };

  const depositFunds = (amountUSD: number) => {
    setUser(prev => ({
      ...prev,
      balanceUSD: prev.balanceUSD + amountUSD,
    }));
    addNotification('تم شحن الرصيد بنجاح! 💳', `تمت إضافة ${formatPrice(amountUSD)} إلى حسابك.`, 'deposit');
    showToast(`تم إيداع ${formatPrice(amountUSD)} في حسابك بنجاح!`, 'success');
  };

  const loadServicesList = async () => {
    setIsLoadingServices(true);
    try {
      const fetched = await fetchServices();
      setServices(fetched);
    } catch {
      showToast('تعذر الاتصال بالخادم، حاول مرة أخرى', 'error');
    } finally {
      setIsLoadingServices(false);
    }
  };

  useEffect(() => {
    loadServicesList();
  }, []);

  const placeOrder = async (service: SMMService, link: string, quantity: number): Promise<boolean> => {
    const priceUSD = (quantity / 1000) * service.rate;
    if (user.balanceUSD < priceUSD) {
      showToast('رصيدك الحالي غير كافٍ. يرجى إيداع رصيد أولاً.', 'error');
      openDepositModal();
      return false;
    }

    try {
      const res = await createSMMOrder(
        service.id,
        link,
        quantity,
        service.name,
        service.platform,
        priceUSD
      );

      const newOrderObj: SMMOrder = {
        id: res.orderId,
        serviceId: service.id,
        serviceName: service.name,
        platform: service.platform,
        link,
        quantity,
        priceUSD,
        status: res.status,
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        refillable: true,
        cancelable: true,
        type: 'smm',
      };

      setOrders(prev => [newOrderObj, ...prev]);
      setUser(prev => ({
        ...prev,
        balanceUSD: Math.max(0, prev.balanceUSD - priceUSD),
        ordersCount: prev.ordersCount + 1,
      }));

      addNotification(
        'تم تقديم طلب جديد 🚀',
        `طلب #${res.orderId} - ${service.name} (${quantity})`,
        'order'
      );

      showToast(`تم تنفيذ الطلب بنجاح! رقم الطلب #${res.orderId}`, 'success');
      return true;
    } catch (err) {
      showToast('تعذر تنفيذ الطلب، يرجى إعادة المحاولة', 'error');
      return false;
    }
  };

  const placeGameOrder = async (pkg: GamePackage, playerUID: string): Promise<boolean> => {
    if (user.balanceUSD < pkg.priceUSD) {
      showToast('رصيدك الحالي غير كافٍ لشحن هذه الحزمة.', 'error');
      openDepositModal();
      return false;
    }

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const gameNameText = pkg.game === 'pubg' ? 'شحن شدات ببجي' : pkg.game === 'freefire' ? 'شحن جواهر فري فاير' : 'شحن كوينز إيفوتبول';

    const newOrderObj: SMMOrder = {
      id: orderId,
      serviceId: 900 + Math.floor(Math.random() * 99),
      serviceName: `${gameNameText} ${pkg.amount} ${pkg.unit} - [UID: ${playerUID}]`,
      platform: pkg.game,
      link: `Player ID: ${playerUID}`,
      quantity: pkg.amount,
      priceUSD: pkg.priceUSD,
      status: 'In progress',
      date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      refillable: false,
      cancelable: false,
      type: 'game',
    };

    setOrders(prev => [newOrderObj, ...prev]);
    setUser(prev => ({
      ...prev,
      balanceUSD: Math.max(0, prev.balanceUSD - pkg.priceUSD),
      ordersCount: prev.ordersCount + 1,
    }));

    addNotification(
      'تم شحن الحساب بنجاح 🎮',
      `تم إرسال ${pkg.amount} ${pkg.unit} إلى الآيدي ${playerUID}`,
      'order'
    );

    showToast(`تم إرسال طلب الشحن بنجاح! رقم الطلب #${orderId}`, 'success');
    return true;
  };

  const handleCancelOrder = async (orderId: number) => {
    const success = await cancelSMMOrder(orderId);
    if (success) {
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: 'Canceled' as OrderStatus } : o))
      );
      showToast(`تم إلغاء الطلب #${orderId} وإعادة الرصيد`, 'info');
    } else {
      showToast('لا يمكن إلغاء هذا الطلب حالياً', 'error');
    }
  };

  const handleRefillOrder = async (orderId: number) => {
    const success = await requestRefill(orderId);
    if (success) {
      showToast(`تم إرسال طلب إعادة التعبئة (Refill) للطلب #${orderId}`, 'success');
    } else {
      showToast('تعذر إرسال طلب التعبئة', 'error');
    }
  };

  const createPost = async (postData: Partial<SocialPost>) => {
    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      author: user,
      timestamp: 'الآن',
      content: postData.content || '',
      hashtags: postData.hashtags || ['عالم_الشرق_الأوسط'],
      images: postData.images,
      video: postData.video,
      poll: postData.poll,
      location: postData.location,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      comments: [],
      sharesCount: 0,
      isBookmarked: false,
      category: 'all',
    };

    // Optimistic UI update
    setPosts(prev => [newPost, ...prev]);

    if (session?.user?.id) {
      const { error } = await supabase.from('posts').insert({
        user_id: session.user.id,
        content: postData.content || '',
        hashtags: postData.hashtags || ['عالم_الشرق_الأوسط'],
        game_tag: postData.gameTag || null,
        price_tag: postData.priceTag || null,
        location: postData.location || null,
        image_url: postData.images && postData.images.length > 0 ? postData.images[0] : null,
      });
      if (error) {
        showToast('تم النشر محليًا فقط، تعذر حفظه في قاعدة البيانات: ' + error.message, 'error');
        return;
      }
      loadPosts();
    }

    showToast('تم نشر منشورك بنجاح!', 'success');
  };

  const togglePostLike = async (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target || !session?.user?.id) return;
    const wasLiked = target.isLiked;

    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newLiked = !p.isLiked;
          return {
            ...p,
            isLiked: newLiked,
            likesCount: newLiked ? p.likesCount + 1 : p.likesCount - 1,
          };
        }
        return p;
      })
    );

    if (wasLiked) {
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', session.user.id);
      if (error) loadPosts(); // revert on failure
    } else {
      const { error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: session.user.id });
      if (error) loadPosts(); // revert on failure
    }
  };

  const addPostComment = async (postId: string, text: string) => {
    if (!text.trim() || !session?.user?.id) return;
    const newComment = {
      id: 'c-' + Date.now(),
      author: {
        name: user.name,
        avatar: user.avatar,
        verified: user.verified,
      },
      content: text,
      timestamp: 'الآن',
    };

    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );

    const { error } = await supabase.from('post_comments').insert({
      post_id: postId,
      user_id: session.user.id,
      content: text.trim(),
    });

    if (error) {
      showToast('تعذر حفظ التعليق، حاول تاني', 'error');
      loadPosts();
      return;
    }

    showToast('تمت إضافة تعليقك', 'success');
  };

  const loadPostComments = async (postId: string) => {
    const { data, error } = await supabase
      .from('post_comments')
      .select('id, content, created_at, profiles(full_name)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      const comments = data.map((row: any) => ({
        id: row.id,
        author: {
          name: row.profiles?.full_name || 'مستخدم',
          avatar: DEFAULT_AVATAR,
          verified: false,
        },
        content: row.content,
        timestamp: new Date(row.created_at).toLocaleString('ar-EG'),
      }));
      setPosts(prev => prev.map(p => (p.id === postId ? { ...p, comments } : p)));
    }
  };

  const sharePost = async (postId: string) => {
    const target = posts.find(p => p.id === postId);
    if (!target) return;

    // Optimistic UI update
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, sharesCount: p.sharesCount + 1 } : p))
    );

    await supabase
      .from('posts')
      .update({ shares_count: target.sharesCount + 1 })
      .eq('id', postId);

    // Best-effort native share / clipboard copy
    const shareUrl = `${window.location.origin}/#post-${postId}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'عالم الشرق الأوسط', text: target.content, url: shareUrl });
      } catch {
        /* user cancelled — ignore */
      }
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('تم نسخ رابط المنشور', 'success');
      } catch {
        showToast('تمت مشاركة المنشور', 'success');
      }
    } else {
      showToast('تمت مشاركة المنشور', 'success');
    }
  };

  const togglePostBookmark = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const newMarked = !p.isBookmarked;
          showToast(newMarked ? 'تم حفظ المنشور في المفضلة' : 'تم إزالة المنشور من المفضلة', 'info');
          return { ...p, isBookmarked: newMarked };
        }
        return p;
      })
    );
  };

  const votePollOption = (postId: string, optionId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId && p.poll && !p.poll.userVotedId) {
          const updatedOptions = p.poll.options.map(opt =>
            opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
          );
          return {
            ...p,
            poll: {
              ...p.poll,
              options: updatedOptions,
              totalVotes: p.poll.totalVotes + 1,
              userVotedId: optionId,
            },
          };
        }
        return p;
      })
    );
  };

  const saveChatMessageToDb = async (contactKey: string, text: string, isMine: boolean) => {
    if (!session?.user?.id) return;
    await supabase.from('chat_messages').insert({
      user_id: session.user.id,
      contact_key: contactKey,
      text,
      is_mine: isMine,
    });
  };

  const sendChatMessage = (chatId: string, text: string) => {
    if (!text.trim()) return;
    setConversations(prev =>
      prev.map(conv => {
        if (conv.id === chatId) {
          const newMsg = {
            id: 'm-' + Date.now(),
            senderId: user.id,
            text,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            isMine: true,
          };
          return {
            ...conv,
            lastMessage: text,
            timestamp: 'الآن',
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      })
    );
    saveChatMessageToDb(chatId, text, true);
  };

  const startDirectChatWithUser = (targetUser: UserProfile, initialContext?: string) => {
    // Find existing conversation with targetUser or create new
    let existingConv = conversations.find(c => c.user.id === targetUser.id || c.user.username === targetUser.username);
    let convId = existingConv ? existingConv.id : 'chat-' + Date.now();

    if (!existingConv) {
      const greeting = `أهلاً بك! أنا أستقبل الرسائل بخصوص الحسابات والخدمات.`;
      const newConv: ChatConversation = {
        id: convId,
        user: targetUser,
        lastMessage: initialContext || 'مرحباً، أود الاستفسار حول إعلانك',
        timestamp: 'الآن',
        unreadCount: 0,
        messages: [
          {
            id: 'msg-init-' + Date.now(),
            senderId: targetUser.id,
            text: greeting,
            timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
            isMine: false,
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
      saveChatMessageToDb(convId, greeting, false);
      playMessageSound();
    }

    if (initialContext) {
      const contextMsg = {
        id: 'msg-ctx-' + Date.now(),
        senderId: user.id,
        text: initialContext,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        isMine: true,
      };

      setConversations(prev =>
        prev.map(c => {
          if (c.id === convId || c.user.id === targetUser.id) {
            return {
              ...c,
              lastMessage: initialContext,
              timestamp: 'الآن',
              messages: [...c.messages, contextMsg],
            };
          }
          return c;
        })
      );
      saveChatMessageToDb(convId, initialContext, true);
    }

    setActiveChatId(convId);
    setActiveTab('feed');
    setFeedSubTab('chats');
    showToast(`تم فتح المحادثة الخاصة مع ${targetUser.name}`, 'info');
  };

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addNotification = (
    title: string,
    description: string,
    type: 'order' | 'deposit' | 'social' | 'system'
  ) => {
    const newN: NotificationItem = {
      id: 'notif-' + Date.now(),
      title,
      description,
      timestamp: 'الآن',
      type,
      read: false,
    };
    setNotifications(prev => [newN, ...prev]);
  };

  // Modal open helpers
  const openCreatePost = (type: string = 'text') => {
    setInitialPostType(type);
    setIsCreatePostOpen(true);
  };
  const closeCreatePost = () => setIsCreatePostOpen(false);

  const openOrderModal = (service: SMMService) => {
    setSelectedServiceForOrder(service);
    setIsOrderModalOpen(true);
  };
  const closeOrderModal = () => {
    setSelectedServiceForOrder(null);
    setIsOrderModalOpen(false);
  };

  const openGameModal = (pkg: GamePackage) => {
    setSelectedGamePackage(pkg);
    setIsGameModalOpen(true);
  };
  const closeGameModal = () => {
    setSelectedGamePackage(null);
    setIsGameModalOpen(false);
  };

  const openDepositModal = () => setIsDepositModalOpen(true);
  const closeDepositModal = () => setIsDepositModalOpen(false);

  const openQuickActionModal = () => setIsQuickActionModalOpen(true);
  const closeQuickActionModal = () => setIsQuickActionModalOpen(false);

  const openUserProfileModal = (u: UserProfile) => setSelectedUserProfile(u);
  const closeUserProfileModal = () => setSelectedUserProfile(null);

  const openApiSettingsModal = () => setIsApiSettingsOpen(true);
  const closeApiSettingsModal = () => setIsApiSettingsOpen(false);

  const openResellerModal = () => setIsResellerModalOpen(true);
  const closeResellerModal = () => setIsResellerModalOpen(false);

  const openAffiliateModal = () => setIsAffiliateModalOpen(true);
  const closeAffiliateModal = () => setIsAffiliateModalOpen(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);
  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);

  const openLightbox = (url: string) => setLightboxImage(url);
  const closeLightbox = () => setLightboxImage(null);

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        currency,
        setCurrency,
        formatPrice,

        activeTab,
        setActiveTab,
        feedSubTab,
        setFeedSubTab,
        gameFilter,
        setGameFilter,

        user,
        depositFunds,
        refreshBalance,
        updateUserAvatar,
        removeUserAvatar,
        isAvatarModalOpen,
        openAvatarModal,
        closeAvatarModal,

        services,
        isLoadingServices,
        reloadServices: loadServicesList,
        selectedPlatformFilter,
        setSelectedPlatformFilter,
        orders,
        placeOrder,
        placeGameOrder,
        handleCancelOrder,
        handleRefillOrder,

        posts,
        createPost,
        togglePostLike,
        addPostComment,
        loadPostComments,
        sharePost,
        togglePostBookmark,
        votePollOption,

        conversations,
        activeChatId,
        setActiveChatId,
        sendChatMessage,
        startDirectChatWithUser,
        groups,

        notifications,
        unreadNotifCount,
        markNotificationsRead,
        addNotification,

        isCreatePostOpen,
        initialPostType,
        openCreatePost,
        closeCreatePost,

        isOrderModalOpen,
        selectedServiceForOrder,
        openOrderModal,
        closeOrderModal,

        isGameModalOpen,
        selectedGamePackage,
        gamePackages,
        openGameModal,
        closeGameModal,

        isDepositModalOpen,
        openDepositModal,
        closeDepositModal,

        isQuickActionModalOpen,
        openQuickActionModal,
        closeQuickActionModal,

        selectedUserProfile,
        openUserProfileModal,
        closeUserProfileModal,

        isApiSettingsOpen,
        openApiSettingsModal,
        closeApiSettingsModal,

        isResellerModalOpen,
        openResellerModal,
        closeResellerModal,

        isAffiliateModalOpen,
        openAffiliateModal,
        closeAffiliateModal,

        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,

        lightboxImage,
        openLightbox,
        closeLightbox,

        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
