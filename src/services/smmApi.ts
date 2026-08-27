import { SMMService, SMMOrder, OrderStatus } from '../types';
import { INITIAL_SERVICES, INITIAL_ORDERS } from '../data/mockData';

/**
 * SMM Reseller API Service
 * Implements standard SMM reseller panel API protocol (JAP / SMMCoster standard).
 * Uses VITE_SMM_API_URL and VITE_SMM_API_KEY if configured in .env.
 * Automatically falls back to high-fidelity mock provider if env vars are empty or unreachable.
 */

const API_URL = import.meta.env.VITE_SMM_API_URL || '';
const API_KEY = import.meta.env.VITE_SMM_API_KEY || '';

// Internal in-memory fallback state for mock mode
let mockOrders: SMMOrder[] = [...INITIAL_ORDERS];
let mockBalanceUSD = 125.50;

export async function fetchSMMResponse(params: Record<string, string | number>) {
  try {
    // 1. First try server endpoint /api/smm (which keeps API key secret)
    const serverRes = await fetch('/api/smm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (serverRes.ok) {
      const data = await serverRes.json();
      if (data && !data.error) {
        return data;
      }
    }
  } catch (_e) {
    // Server proxy not active or offline
  }

  // 2. Direct client fallback if VITE_SMM_API_URL and VITE_SMM_API_KEY are configured
  if (API_URL && !API_URL.includes('example-smm-provider')) {
    const bodyParams = new URLSearchParams();
    bodyParams.append('key', API_KEY);
    Object.keys(params).forEach(k => bodyParams.append(k, String(params[k])));

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: bodyParams.toString(),
    });

    if (response.ok) {
      return await response.json();
    }
  }

  // Return null to trigger realistic fallback handler
  return null;
}

/**
 * Fetch list of all services from the provider (action=services)
 */
export async function fetchServices(): Promise<SMMService[]> {
  try {
    const data = await fetchSMMResponse({ action: 'services' });
    if (data && Array.isArray(data)) {
      return data.map((item: any) => ({
        id: Number(item.service || item.id),
        name: item.name,
        category: item.category,
        rate: Number(item.rate),
        min: Number(item.min),
        max: Number(item.max),
        type: item.type || 'Default',
        platform: derivePlatformFromName(item.name, item.category),
      }));
    }
  } catch (error) {
    console.warn('SMM API fetch error, using local fallback services:', error);
  }
  
  // Return realistic mock services list
  return INITIAL_SERVICES;
}

/**
 * Place a new order (action=add)
 */
export async function createSMMOrder(
  serviceId: number,
  link: string,
  quantity: number,
  serviceName: string,
  platform: string,
  priceUSD: number
): Promise<{ orderId: number; status: OrderStatus }> {
  try {
    const data = await fetchSMMResponse({
      action: 'add',
      service: serviceId,
      link,
      quantity,
    });

    if (data && data.order) {
      const newOrder: SMMOrder = {
        id: Number(data.order),
        serviceId,
        serviceName,
        platform,
        link,
        quantity,
        priceUSD,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }),
        refillable: true,
        cancelable: true,
        type: 'smm',
      };
      mockOrders.unshift(newOrder);
      mockBalanceUSD = Math.max(0, mockBalanceUSD - priceUSD);
      return { orderId: Number(data.order), status: 'Pending' };
    }
  } catch (error) {
    console.warn('API place order failed, creating local order:', error);
  }

  // Mock order creation fallback
  const generatedId = Math.floor(100000 + Math.random() * 900000);
  const newOrder: SMMOrder = {
    id: generatedId,
    serviceId,
    serviceName,
    platform,
    link,
    quantity,
    priceUSD,
    status: 'In progress',
    date: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    refillable: true,
    cancelable: true,
    type: 'smm',
  };
  mockOrders.unshift(newOrder);
  mockBalanceUSD = Math.max(0, mockBalanceUSD - priceUSD);
  return { orderId: generatedId, status: 'In progress' };
}

/**
 * Check order status (action=status)
 */
export async function checkOrderStatus(orderId: number): Promise<{ status: OrderStatus; remains?: number }> {
  try {
    const data = await fetchSMMResponse({
      action: 'status',
      order: orderId,
    });
    if (data && data.status) {
      return { status: normalizeStatus(data.status), remains: data.remains };
    }
  } catch (error) {
    console.warn('Check order status failed:', error);
  }

  const existing = mockOrders.find(o => o.id === orderId);
  return { status: existing ? existing.status : 'Completed' };
}

/**
 * Check user balance (action=balance)
 */
export async function fetchUserBalance(): Promise<number> {
  try {
    const data = await fetchSMMResponse({ action: 'balance' });
    if (data && data.balance !== undefined) {
      return Number(data.balance);
    }
  } catch (error) {
    console.warn('Fetch balance failed, using mock balance:', error);
  }

  return mockBalanceUSD;
}

/**
 * Request refill for order (action=refill)
 */
export async function requestRefill(orderId: number): Promise<boolean> {
  try {
    const data = await fetchSMMResponse({ action: 'refill', order: orderId });
    if (data && (data.refill || data.status)) return true;
  } catch (error) {
    console.warn('Refill request fallback:', error);
  }
  return true;
}

/**
 * Cancel order (action=cancel)
 */
export async function cancelSMMOrder(orderId: number): Promise<boolean> {
  try {
    const data = await fetchSMMResponse({ action: 'cancel', order: orderId });
    if (data && data.status) return true;
  } catch (error) {
    console.warn('Cancel order fallback:', error);
  }

  const order = mockOrders.find(o => o.id === orderId);
  if (order && order.status !== 'Completed') {
    order.status = 'Canceled';
    return true;
  }
  return false;
}

// Helper function to map service name or category to platform slug
export function derivePlatformFromName(name: string, category: string): string {
  const text = (name + ' ' + category).toLowerCase();
  if (text.includes('tiktok') || text.includes('تيك توك')) return 'tiktok';
  if (text.includes('instagram') || text.includes('إنستغرام') || text.includes('انستقرام')) return 'instagram';
  if (text.includes('youtube') || text.includes('يوتيوب')) return 'youtube';
  if (text.includes('facebook') || text.includes('فيسبوك') || text.includes('فيس')) return 'facebook';
  if (text.includes('telegram') || text.includes('تيليجرام') || text.includes('تلجرام')) return 'telegram';
  if (text.includes('twitter') || text.includes('x ') || text.includes('تويتر')) return 'twitter';
  if (text.includes('snapchat') || text.includes('سناب')) return 'snapchat';
  if (text.includes('linkedin') || text.includes('لينكد')) return 'linkedin';
  if (text.includes('spotify') || text.includes('سبوتيفاي')) return 'spotify';
  if (text.includes('twitch') || text.includes('تويتش')) return 'twitch';
  if (text.includes('pubg') || text.includes('free fire') || text.includes('efootball') || text.includes('ألعاب')) return 'games';
  return 'other';
}

function normalizeStatus(raw: string): OrderStatus {
  const lower = raw.toLowerCase();
  if (lower.includes('progress') || lower.includes('processing')) return 'In progress';
  if (lower.includes('complete')) return 'Completed';
  if (lower.includes('partial')) return 'Partial';
  if (lower.includes('cancel')) return 'Canceled';
  return 'Pending';
}
