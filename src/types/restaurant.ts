export type UserRole = 'waiter' | 'chef' | 'kitchen' | 'manager' | 'owner';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  section?: string; // for kitchen staff
}

export interface Ingredient {
  name: string;
  quantity: string;
}

export interface Dish {
  id: string;
  name: string;
  category: string;
  section: string; // south_indian, north_indian, chinese, desserts, beverages
  price: number;
  ingredients: Ingredient[];
  available: boolean;
  imageUrl?: string;
}

export interface OrderItem {
  id: string;
  dishId: string;
  dishName: string;
  quantity: number;
  specialRequirements: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  section: string;
}

export interface Order {
  id: string;
  tableNumber: number;
  items: OrderItem[];
  waiterId: string;
  waiterName: string;
  status: 'active' | 'completed' | 'cancelled';
  paymentMethod?: 'cash' | 'card' | 'online';
  totalAmount: number;
  createdAt: Date;
  completedAt?: Date;
  complaint?: string;
  compliment?: string;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
  orderCount: number;
  cashPayments: number;
  cardPayments: number;
  onlinePayments: number;
}

export interface StaffActivity {
  staffId: string;
  staffName: string;
  role: UserRole;
  ordersHandled: number;
  activeTime: string;
}
