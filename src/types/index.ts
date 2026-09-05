export type CurrencyCode = 'USD' | 'EUR' | 'SAR' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // exchange rate relative to USD (USD = 1)
  flag: string;
}

export type MainTab = 'feed' | 'services' | 'games' | 'orders' | 'profile';

export type FeedSubTab = 'posts' | 'chats' | 'groups' | 'friends' | 'profile';

export type SMMServiceType = 'Default' | 'Custom Comments' | 'Subscriptions' | 'Package';

export interface SMMService {
  id: number;
  name: string;
  category: string;
  rate: number; // rate per 1000 in USD
  min: number;
  max: number;
  type?: string;
  platform: string; // 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'telegram' | 'twitter' | 'snapchat' | 'linkedin' | 'spotify' | 'twitch' | 'other'
  description?: string;
  isPopular?: boolean;
}

export type OrderStatus = 'Pending' | 'In progress' | 'Completed' | 'Partial' | 'Canceled';

export interface SMMOrder {
  id: number;
  serviceId: number;
  serviceName: string;
  platform: string;
  link: string;
  quantity: number;
  priceUSD: number;
  status: OrderStatus;
  date: string;
  refillable?: boolean;
  cancelable?: boolean;
  type?: 'smm' | 'game';
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  verified: boolean;
  bio: string;
  followers: number;
  following: number;
  balanceUSD: number;
  ordersCount: number;
  isOnline?: boolean;
}

export interface PostComment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  replies?: PostComment[];
}

export interface SocialPost {
  id: string;
  author: UserProfile;
  timestamp: string;
  content: string;
  hashtags: string[];
  gameTag?: 'PUBG Mobile' | 'Free Fire' | 'eFootball' | 'TikTok' | 'SMM Panel';
  priceTag?: string; // e.g. '$150' or 'للتفاوض'
  isAccountSale?: boolean;
  images?: string[];
  video?: {
    url: string;
    duration: string;
    durationSeconds?: number;
    thumbnail?: string;
  };
  audioUrl?: string;
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number }[];
    totalVotes: number;
    userVotedId?: string;
  };
  location?: string;
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  comments: PostComment[];
  sharesCount: number;
  isBookmarked: boolean;
  category: 'all' | 'following' | 'friends';
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
}

export interface ChatConversation {
  id: string;
  user: UserProfile;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface GroupItem {
  id: string;
  name: string;
  avatar: string;
  membersCount: number;
  type: 'عام' | 'خاص';
  unreadBadge: number;
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'order' | 'deposit' | 'social' | 'system';
  read: boolean;
}

export interface GamePackage {
  id: string;
  game: 'pubg' | 'freefire' | 'efootball' | 'tiktok' | 'ai';
  amount: number;
  unit: string;
  priceUSD: number;
  discountBadge?: string;
  icon?: string;
  label?: string;
}

export interface PlatformStats {
  totalMembers: number;
  activeMembers: number;
  todayPosts: number;
  activeGroups: number;
  todayChats: number;
}
