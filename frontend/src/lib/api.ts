// Typed API client for MUJMart backend
// All API calls go through here for centralized auth header handling

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('mujmart_token');
}

function getHeaders(contentType: string | null = 'application/json'): Record<string, string> {
  const headers: Record<string, string> = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const isFormData = typeof FormData !== 'undefined' && options?.body instanceof FormData;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...getHeaders(isFormData ? null : 'application/json'),
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ────────────────────────────────────────────
// Auth API
// ────────────────────────────────────────────
export const authApi = {
  register: (data: { name: string; email: string; password: string }) =>
    apiFetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  login: (data: { email: string; password: string }) =>
    apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  me: () =>
    apiFetch<{ user: User }>('/api/auth/me'),

  updateProfile: (data: { upiId?: string; phone?: string }) =>
    apiFetch<{ user: User }>('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  googleLogin: (data: { email: string; name: string }) =>
    apiFetch<{ token: string; user: User }>('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// ────────────────────────────────────────────
// Listings API
// ────────────────────────────────────────────
export interface ListingFilters {
  q?: string;
  type?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'recent' | 'price-low' | 'price-high';
  page?: number;
  limit?: number;
  seller?: string;
}

export const listingsApi = {
  list: (filters?: ListingFilters) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
      });
    }
    return apiFetch<{ listings: Listing[]; pagination: Pagination }>(`/api/listings?${params}`);
  },

  get: (id: string) =>
    apiFetch<{ listing: Listing & { platformFee: number } }>(`/api/listings/${id}`),

  create: (data: Partial<Listing>) =>
    apiFetch<{ listing: Listing }>('/api/listings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Listing>) =>
    apiFetch<{ listing: Listing }>(`/api/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<{ message: string }>(`/api/listings/${id}`, {
      method: 'DELETE',
    }),

  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiFetch<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },

  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('image', file); // Multer expects 'image' key still
    return apiFetch<{ url: string; filename: string }>('/api/upload', {
      method: 'POST',
      body: formData,
    });
  },
};

// ────────────────────────────────────────────
// Threads API
// ────────────────────────────────────────────
export const threadsApi = {
  create: (listingId: string) =>
    apiFetch<{ thread: Thread; existing?: boolean }>('/api/threads', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    }),

  list: () =>
    apiFetch<{ threads: Thread[] }>('/api/threads'),

  get: (threadId: string) =>
    apiFetch<{ thread: Thread & { myRole: 'buyer' | 'seller' } }>(`/api/threads/${threadId}`),

  messages: (threadId: string) =>
    apiFetch<{ messages: ChatMessage[] }>(`/api/threads/${threadId}/messages`),

  updateStatus: (threadId: string, status: 'accepted' | 'closed' | 'rejected') =>
    apiFetch<{ thread: Thread }>(`/api/threads/${threadId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

// ────────────────────────────────────────────
// Transactions API
// ────────────────────────────────────────────
export const transactionsApi = {
  checkout: (data: { listingId: string; agreedPrice?: number }) =>
    apiFetch<{ transaction: Transaction }>('/api/transactions/checkout', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  verifyRazorpay: (id: string, data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    apiFetch<{ transaction: Transaction }>(`/api/transactions/${id}/verify-razorpay`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  confirmReceipt: (id: string) =>
    apiFetch<{ transaction: Transaction }>(`/api/transactions/${id}/confirm-receipt`, { method: 'POST' }),

  completePayout: (id: string) =>
    apiFetch<{ transaction: Transaction }>(`/api/transactions/${id}/complete-payout`, { method: 'POST' }),

  list: (role?: 'buyer' | 'seller' | 'all') =>
    apiFetch<{ transactions: Transaction[] }>(`/api/transactions${role ? `?role=${role}` : ''}`),
};

// ────────────────────────────────────────────
// Admin API
// ────────────────────────────────────────────
export const adminApi = {
  stats: () =>
    apiFetch<{ stats: AdminStats }>('/api/admin/stats'),

  users: (params?: { q?: string; role?: string; banned?: boolean; page?: number }) => {
    const p = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) p.set(k, String(v)); });
    return apiFetch<{ users: User[]; pagination: Pagination }>(`/api/admin/users?${p}`);
  },

  banUser: (id: string, ban: boolean) =>
    apiFetch<{ user: User; message: string }>(`/api/admin/users/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify({ ban }),
    }),

  listings: (params?: { status?: string; q?: string; page?: number }) => {
    const p = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) p.set(k, String(v)); });
    return apiFetch<{ listings: Listing[]; pagination: Pagination }>(`/api/admin/listings?${p}`);
  },

  updateListing: (id: string, status: string) =>
    apiFetch<{ listing: Listing }>(`/api/admin/listings/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  disputes: (params?: { status?: string; page?: number }) => {
    const p = new URLSearchParams();
    if (params) Object.entries(params).forEach(([k, v]) => { if (v !== undefined) p.set(k, String(v)); });
    return apiFetch<{ disputes: Dispute[]; pagination: Pagination }>(`/api/admin/disputes?${p}`);
  },

  updateDispute: (id: string, status: 'resolved' | 'dismissed') =>
    apiFetch<{ dispute: Dispute }>(`/api/admin/disputes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  transactions: (page?: number) =>
    apiFetch<{ transactions: Transaction[]; pagination: Pagination; totals: MarginTotals }>(
      `/api/admin/transactions${page ? `?page=${page}` : ''}`
    ),
};

// ────────────────────────────────────────────
// Requests API
// ────────────────────────────────────────────
export const requestsApi = {
  create: (listingId: string) =>
    apiFetch<{ id: string }>('/api/requests', {
      method: 'POST',
      body: JSON.stringify({ listingId }),
    }),
  incoming: () =>
    apiFetch<ProjectRequest[]>('/api/requests/incoming'),
  updateStatus: (id: string, status: 'accepted' | 'rejected') =>
    apiFetch<ProjectRequest>(`/api/requests/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// ────────────────────────────────────────────
// Notifications API
// ────────────────────────────────────────────
export const notificationsApi = {
  list: () =>
    apiFetch<Notification[]>('/api/notifications'),
  markRead: (id: string) =>
    apiFetch<Notification>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    }),
};

// ────────────────────────────────────────────
// Shared Types
// ────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  alias: string;
  upiId?: string;
  phone?: string;
  role: 'student' | 'admin';
  repScore: number;
  dealCount: number;
  isBanned?: boolean;
  createdAt?: string;
  _count?: { listings: number; buyerTxns: number };
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  type: 'sell' | 'resale' | 'rent' | 'free' | 'query';
  category: string;
  condition: 'New' | 'Good' | 'Fair' | 'Damaged';
  images: string[];
  attachments?: string[];
  deadline?: string;
  status: string;
  expiresAt: string;
  createdAt: string;
  sellerId: string;
  seller: Pick<User, 'id' | 'alias' | 'repScore' | 'dealCount'>;
}

export interface Thread {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  status: 'open' | 'accepted' | 'closed' | 'rejected';
  createdAt: string;
  listing?: Partial<Listing>;
  buyer?: Partial<User>;
  seller?: Partial<User>;
  messages?: ChatMessage[];
  myRole?: 'buyer' | 'seller';
}

export interface ChatMessage {
  id: string;
  content: string;
  isFiltered: boolean;
  createdAt: string;
  role: 'buyer' | 'seller';
  isMe: boolean;
  senderAlias?: string;
}

export interface Transaction {
  id: string;
  listingId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  platformMargin: number;
  sellerAmount?: number;
  status: 'pending_payment' | 'verifying_payment' | 'escrow' | 'ready_for_payout' | 'completed' | 'refunded';
  utrNumber?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  listing?: Partial<Listing>;
  buyer?: Partial<User>;
  seller?: Partial<User>;
  myRole?: 'buyer' | 'seller';
}

export interface Dispute {
  id: string;
  threadId: string;
  reporterId: string;
  reason: string;
  status: string;
  createdAt: string;
  reporter?: Partial<User>;
  thread?: Thread;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages?: number;
}

export interface AdminStats {
  totalUsers: number;
  totalListings: number;
  activeListings: number;
  totalTransactions: number;
  openDisputes: number;
  totalRevenue: number;
  todayDeals: number;
}

export interface MarginTotals {
  totalRevenue: number;
  totalMargins: number;
  avgDealSize: number;
}

export interface ProjectRequest {
  id: string;
  listingId: string;
  requesterId: string;
  ownerId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  listing?: Partial<Listing>;
  requester?: Partial<User>;
}

export interface Notification {
  id: string;
  type: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  userId: string;
  relatedId?: string;
}

// Helper: save token
export function saveAuthToken(token: string): void {
  localStorage.setItem('mujmart_token', token);
}

// Helper: clear token
export function clearAuthToken(): void {
  localStorage.removeItem('mujmart_token');
  localStorage.removeItem('mujmart_user');
}

// Helper: get socket URL
export function getSocketUrl(): string {
  return BASE_URL;
}
