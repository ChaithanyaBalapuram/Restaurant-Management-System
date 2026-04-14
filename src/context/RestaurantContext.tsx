import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Dish, Order, OrderItem, UserRole } from '@/types/restaurant';
import { mockUsers, mockDishes, mockOrders, generateOrderId } from '@/data/mockData';

interface RestaurantContextType {
  currentUser: User | null;
  login: (role: UserRole, section?: string) => void;
  logout: () => void;
  dishes: Dish[];
  orders: Order[];
  toggleDishAvailability: (dishId: string) => void;
  placeOrder: (tableNumber: number, items: Omit<OrderItem, 'id' | 'status'>[], waiterId: string, waiterName: string) => void;
  cancelOrder: (orderId: string) => void;
  cancelOrderItem: (orderId: string, itemId: string) => void;
  updateItemStatus: (orderId: string, itemId: string, status: OrderItem['status']) => void;
  completeOrder: (orderId: string, paymentMethod: 'cash' | 'card' | 'online') => void;
  addComplaint: (orderId: string, complaint: string) => void;
  addCompliment: (orderId: string, compliment: string) => void;
}

const RestaurantContext = createContext<RestaurantContextType | null>(null);

export const useRestaurant = () => {
  const ctx = useContext(RestaurantContext);
  if (!ctx) throw new Error('useRestaurant must be used within RestaurantProvider');
  return ctx;
};

export const RestaurantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dishes, setDishes] = useState<Dish[]>(mockDishes);
  const [orders, setOrders] = useState<Order[]>(mockOrders);

  const login = useCallback((role: UserRole, section?: string) => {
    const user = mockUsers.find(u => u.role === role && (!section || u.section === section));
    if (user) setCurrentUser(user);
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const toggleDishAvailability = useCallback((dishId: string) => {
    setDishes(prev => prev.map(d => d.id === dishId ? { ...d, available: !d.available } : d));
  }, []);

  const placeOrder = useCallback((tableNumber: number, items: Omit<OrderItem, 'id' | 'status'>[], waiterId: string, waiterName: string) => {
    const order: Order = {
      id: generateOrderId(),
      tableNumber,
      items: items.map((item, i) => ({ ...item, id: `oi-${Date.now()}-${i}`, status: 'pending' as const })),
      waiterId,
      waiterName,
      status: 'active',
      totalAmount: items.reduce((sum, item) => {
        const dish = mockDishes.find(d => d.id === item.dishId);
        return sum + (dish?.price || 0) * item.quantity;
      }, 0),
      createdAt: new Date(),
    };
    setOrders(prev => [order, ...prev]);
  }, []);

  const cancelOrder = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'cancelled', items: o.items.map(i => ({ ...i, status: 'cancelled' as const })) } : o));
  }, []);

  const cancelOrderItem = useCallback((orderId: string, itemId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const items = o.items.map(i => i.id === itemId ? { ...i, status: 'cancelled' as const } : i);
      return { ...o, items };
    }));
  }, []);

  const updateItemStatus = useCallback((orderId: string, itemId: string, status: OrderItem['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      return { ...o, items: o.items.map(i => i.id === itemId ? { ...i, status } : i) };
    }));
  }, []);

  const completeOrder = useCallback((orderId: string, paymentMethod: 'cash' | 'card' | 'online') => {
    setOrders(prev => prev.map(o => o.id === orderId ? {
      ...o, status: 'completed', paymentMethod, completedAt: new Date(),
      items: o.items.map(i => i.status !== 'cancelled' ? { ...i, status: 'served' as const } : i),
    } : o));
  }, []);

  const addComplaint = useCallback((orderId: string, complaint: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, complaint } : o));
  }, []);

  const addCompliment = useCallback((orderId: string, compliment: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, compliment } : o));
  }, []);

  return (
    <RestaurantContext.Provider value={{
      currentUser, login, logout, dishes, orders,
      toggleDishAvailability, placeOrder, cancelOrder, cancelOrderItem,
      updateItemStatus, completeOrder, addComplaint, addCompliment,
    }}>
      {children}
    </RestaurantContext.Provider>
  );
};
