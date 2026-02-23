
import React from 'react';
import { RoomType, RoomStatus, SubscriptionType } from './types';

export const ROOM_TYPES_PRICING = {
  [RoomType.SEMI_CLOSED]: 1,
  [RoomType.CLASSROOM]: 10,
  [RoomType.MEETING_ROOM_QUAD]: 3,
  [RoomType.SINGLE_ROOM]: 2,
  [RoomType.SINGLE_CLOSED]: 5, // Default for non-subscription
};

export const SUBSCRIPTION_MODELS = [
  { id: SubscriptionType.SINGLE_4H, name: 'فردية مغلقة - 4س', price: 80, limit: 4 },
  { id: SubscriptionType.SINGLE_8H, name: 'فردية مغلقة - 8س', price: 120, limit: 8 },
  { id: SubscriptionType.SEMI_4H, name: 'مكتب شبه مغلق - 4س', price: 35, limit: 4 },
  { id: SubscriptionType.SEMI_8H, name: 'مكتب شبه مغلق - 8س', price: 60, limit: 8 },
];

export const CAFE_MENU = [
  { name: 'اسبريسو', price: 12 },
  { name: 'لاتيه', price: 18 },
  { name: 'كابتشينو', price: 18 },
  { name: 'قهوة سوداء', price: 14 },
  { name: 'شاي', price: 8 },
  { name: 'كرواسون', price: 15 },
  { name: 'ساندوتش دجاج', price: 25 },
];
