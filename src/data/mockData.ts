import { Dish, Order, OrderItem, User, DailyRevenue } from '@/types/restaurant';

export const mockUsers: User[] = [
  { id: 'w1', name: 'Ravi Kumar', role: 'waiter' },
  { id: 'w2', name: 'Priya Sharma', role: 'waiter' },
  { id: 'c1', name: 'Chef Arjun', role: 'chef' },
  { id: 'k1', name: 'South Indian Kitchen', role: 'kitchen', section: 'south_indian' },
  { id: 'k2', name: 'North Indian Kitchen', role: 'kitchen', section: 'north_indian' },
  { id: 'k3', name: 'Chinese Kitchen', role: 'kitchen', section: 'chinese' },
  { id: 'k4', name: 'Desserts Station', role: 'kitchen', section: 'desserts' },
  { id: 'm1', name: 'Manager Suresh', role: 'manager' },
  { id: 'o1', name: 'Owner Rajesh', role: 'owner' },
];

export const mockDishes: Dish[] = [
  {
    id: 'd1', name: 'Masala Dosa', category: 'Main Course', section: 'south_indian',
    price: 120, available: true,
    ingredients: [
      { name: 'Rice Batter', quantity: '200g' },
      { name: 'Potato Masala', quantity: '100g' },
      { name: 'Sambar', quantity: '150ml' },
      { name: 'Chutney', quantity: '50g' },
    ]
  },
  {
    id: 'd2', name: 'Idli Vada', category: 'Breakfast', section: 'south_indian',
    price: 90, available: true,
    ingredients: [
      { name: 'Rice Batter', quantity: '150g' },
      { name: 'Urad Dal', quantity: '100g' },
      { name: 'Sambar', quantity: '150ml' },
    ]
  },
  {
    id: 'd3', name: 'Butter Chicken', category: 'Main Course', section: 'north_indian',
    price: 280, available: true,
    ingredients: [
      { name: 'Chicken', quantity: '250g' },
      { name: 'Butter', quantity: '50g' },
      { name: 'Tomato Gravy', quantity: '200ml' },
      { name: 'Cream', quantity: '50ml' },
      { name: 'Spices', quantity: 'As needed' },
    ]
  },
  {
    id: 'd4', name: 'Paneer Tikka', category: 'Starter', section: 'north_indian',
    price: 220, available: true,
    ingredients: [
      { name: 'Paneer', quantity: '200g' },
      { name: 'Yogurt', quantity: '50g' },
      { name: 'Bell Peppers', quantity: '100g' },
      { name: 'Spices', quantity: 'As needed' },
    ]
  },
  {
    id: 'd5', name: 'Hakka Noodles', category: 'Main Course', section: 'chinese',
    price: 180, available: true,
    ingredients: [
      { name: 'Noodles', quantity: '200g' },
      { name: 'Mixed Vegetables', quantity: '150g' },
      { name: 'Soy Sauce', quantity: '20ml' },
      { name: 'Vinegar', quantity: '10ml' },
    ]
  },
  {
    id: 'd6', name: 'Manchurian', category: 'Starter', section: 'chinese',
    price: 160, available: true,
    ingredients: [
      { name: 'Cauliflower', quantity: '200g' },
      { name: 'Corn Flour', quantity: '50g' },
      { name: 'Soy Sauce', quantity: '20ml' },
      { name: 'Garlic', quantity: '10g' },
    ]
  },
  {
    id: 'd7', name: 'Gulab Jamun', category: 'Dessert', section: 'desserts',
    price: 80, available: true,
    ingredients: [
      { name: 'Khoya', quantity: '100g' },
      { name: 'Sugar Syrup', quantity: '200ml' },
      { name: 'Cardamom', quantity: '2pcs' },
    ]
  },
  {
    id: 'd8', name: 'Rasmalai', category: 'Dessert', section: 'desserts',
    price: 100, available: false,
    ingredients: [
      { name: 'Chenna', quantity: '150g' },
      { name: 'Milk', quantity: '300ml' },
      { name: 'Sugar', quantity: '100g' },
      { name: 'Saffron', quantity: '2 strands' },
    ]
  },
  {
    id: 'd9', name: 'Biryani', category: 'Main Course', section: 'north_indian',
    price: 250, available: true,
    ingredients: [
      { name: 'Basmati Rice', quantity: '200g' },
      { name: 'Chicken/Vegetables', quantity: '200g' },
      { name: 'Yogurt', quantity: '50g' },
      { name: 'Saffron', quantity: '2 strands' },
      { name: 'Spices', quantity: 'As needed' },
    ]
  },
  {
    id: 'd10', name: 'Filter Coffee', category: 'Beverage', section: 'south_indian',
    price: 40, available: true,
    ingredients: [
      { name: 'Coffee Powder', quantity: '10g' },
      { name: 'Milk', quantity: '150ml' },
      { name: 'Sugar', quantity: '10g' },
    ]
  },
];

let orderIdCounter = 1000;
export const generateOrderId = () => `ORD-${++orderIdCounter}`;

export const mockOrders: Order[] = [
  {
    id: 'ORD-1001',
    tableNumber: 3,
    items: [
      { id: 'oi1', dishId: 'd1', dishName: 'Masala Dosa', quantity: 2, specialRequirements: 'Extra crispy', status: 'preparing', section: 'south_indian' },
      { id: 'oi2', dishId: 'd10', dishName: 'Filter Coffee', quantity: 2, specialRequirements: '', status: 'ready', section: 'south_indian' },
    ],
    waiterId: 'w1', waiterName: 'Ravi Kumar',
    status: 'active', totalAmount: 320,
    createdAt: new Date(Date.now() - 30 * 60000),
  },
  {
    id: 'ORD-1002',
    tableNumber: 7,
    items: [
      { id: 'oi3', dishId: 'd3', dishName: 'Butter Chicken', quantity: 1, specialRequirements: 'Less spicy', status: 'preparing', section: 'north_indian' },
      { id: 'oi4', dishId: 'd9', dishName: 'Biryani', quantity: 1, specialRequirements: 'No onions', status: 'pending', section: 'north_indian' },
      { id: 'oi5', dishId: 'd7', dishName: 'Gulab Jamun', quantity: 2, specialRequirements: '', status: 'pending', section: 'desserts' },
    ],
    waiterId: 'w2', waiterName: 'Priya Sharma',
    status: 'active', totalAmount: 690,
    createdAt: new Date(Date.now() - 15 * 60000),
  },
  {
    id: 'ORD-1003',
    tableNumber: 1,
    items: [
      { id: 'oi6', dishId: 'd5', dishName: 'Hakka Noodles', quantity: 1, specialRequirements: '', status: 'served', section: 'chinese' },
      { id: 'oi7', dishId: 'd6', dishName: 'Manchurian', quantity: 1, specialRequirements: 'Extra sauce', status: 'served', section: 'chinese' },
    ],
    waiterId: 'w1', waiterName: 'Ravi Kumar',
    status: 'completed', paymentMethod: 'card', totalAmount: 340,
    createdAt: new Date(Date.now() - 90 * 60000),
    completedAt: new Date(Date.now() - 45 * 60000),
    compliment: 'Amazing noodles! Best we have had.',
  },
];

export const mockRevenue: DailyRevenue[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const base = 15000 + Math.random() * 20000;
  const cash = Math.floor(base * 0.35);
  const card = Math.floor(base * 0.4);
  const online = Math.floor(base * 0.25);
  return {
    date: date.toISOString().split('T')[0],
    revenue: Math.floor(base),
    orderCount: 30 + Math.floor(Math.random() * 40),
    cashPayments: cash,
    cardPayments: card,
    onlinePayments: online,
  };
});

export const sectionLabels: Record<string, string> = {
  south_indian: 'South Indian',
  north_indian: 'North Indian',
  chinese: 'Chinese',
  desserts: 'Desserts',
  beverages: 'Beverages',
};
