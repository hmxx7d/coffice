
export enum RoomType {
  SINGLE_CLOSED = 'غرفة فردية مغلقة',
  SEMI_CLOSED = 'مكتب شبه مغلق',
  CLASSROOM = 'قاعة دروس خصوصية',
  MEETING_ROOM_QUAD = 'غرفة اجتماعات رباعية',
  SINGLE_ROOM = 'غرفة فردية'
}

export enum RoomStatus {
  AVAILABLE = 'متاحة',
  OCCUPIED = 'محجوزة',
  MAINTENANCE = 'تحت الصيانة'
}

export interface Room {
  id: string;
  name: string;
  type: RoomType;
  hourlyPrice: number;
  capacity: number;
  status: RoomStatus;
}

export enum SubscriptionType {
  SINGLE_4H = 'فردية مغلقة - 4 ساعات',
  SINGLE_8H = 'فردية مغلقة - 8 ساعات',
  SEMI_4H = 'مكتب شبه مغلق - 4 ساعات',
  SEMI_8H = 'مكتب شبه مغلق - 8 ساعات'
}

export interface Client {
  id: string;
  name: string;
  phone: string;
  balance: number;
  totalUsageHours: number;
  subscriptionId?: string;
}

export interface Subscription {
  id: string;
  clientId: string;
  type: SubscriptionType;
  dailyHourLimit: number;
  startDate: string;
  endDate: string;
  status: 'نشط' | 'مجمد' | 'منتهي';
  dailyUsage: Record<string, number>; // date string -> hours
}

export interface Booking {
  id: string;
  clientId: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'مؤكد' | 'ملغي' | 'مكتمل';
}

// --- Inventory & POS Integration ---

export interface RawMaterial {
  id: string;
  name: string;
  unit: 'جرام' | 'ملل' | 'قطعة' | 'كجم' | 'لتر';
  currentStock: number;
  minStock: number;
  supplier: string;
  costPerUnit: number;
}

export interface RecipeItem {
  materialId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image?: string;
  description?: string;
  supplier: string;
  minStockAlert: number;
  currentStock: number; // for ready-made products
  recipe: RecipeItem[]; // for cafe drinks
}

export interface CafeOrder {
  id: string;
  clientId: string;
  items: { name: string; price: number; quantity: number }[];
  totalPrice: number;
  date: string;
}
