import { useMemo } from 'react';
import { useRestaurant } from '@/context/RestaurantContext';
import DashboardLayout from '@/components/DashboardLayout';
import { CreditCard, Banknote, Smartphone, ShoppingBag, TrendingUp } from 'lucide-react';

const ManagerDashboard = () => {
  const { orders } = useRestaurant();

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => o.createdAt.toDateString() === today);
    const completed = todayOrders.filter(o => o.status === 'completed');
    const cash = completed.filter(o => o.paymentMethod === 'cash').reduce((s, o) => s + o.totalAmount, 0);
    const card = completed.filter(o => o.paymentMethod === 'card').reduce((s, o) => s + o.totalAmount, 0);
    const online = completed.filter(o => o.paymentMethod === 'online').reduce((s, o) => s + o.totalAmount, 0);
    const total = cash + card + online;
    const active = todayOrders.filter(o => o.status === 'active').length;

    // Dish frequency
    const dishCount: Record<string, number> = {};
    todayOrders.forEach(o => o.items.forEach(i => {
      dishCount[i.dishName] = (dishCount[i.dishName] || 0) + i.quantity;
    }));
    const topDishes = Object.entries(dishCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

    return { cash, card, online, total, active, completedCount: completed.length, totalOrders: todayOrders.length, topDishes };
  }, [orders]);

  const cards = [
    { label: 'Total Revenue', value: `₹${stats.total.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-primary' },
    { label: 'Cash Payments', value: `₹${stats.cash.toLocaleString()}`, icon: <Banknote className="w-5 h-5" />, color: 'text-success' },
    { label: 'Card Payments', value: `₹${stats.card.toLocaleString()}`, icon: <CreditCard className="w-5 h-5" />, color: 'text-blue-400' },
    { label: 'Online Payments', value: `₹${stats.online.toLocaleString()}`, icon: <Smartphone className="w-5 h-5" />, color: 'text-purple-400' },
  ];

  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="glass-card p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <span className={c.color}>{c.icon}</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Total Orders Today</span>
              <span className="font-semibold text-foreground">{stats.totalOrders}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-border">
              <span className="text-muted-foreground">Active Orders</span>
              <span className="font-semibold text-warning">{stats.active}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Completed Orders</span>
              <span className="font-semibold text-success">{stats.completedCount}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Top Dishes</h3>
          {stats.topDishes.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet today</p>
          ) : (
            <div className="space-y-2">
              {stats.topDishes.map(([name, count], i) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-xs flex items-center justify-center font-bold">{i + 1}</span>
                  <span className="flex-1 text-sm text-foreground">{name}</span>
                  <span className="text-sm font-semibold text-muted-foreground">{count} ordered</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-2 glass-card p-5">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted-foreground border-b border-border">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Table</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Payment</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 20).map(order => (
                  <tr key={order.id} className="border-b border-border/50">
                    <td className="py-3 text-foreground">{order.id}</td>
                    <td className="py-3 text-foreground">{order.tableNumber}</td>
                    <td className="py-3 text-foreground">{order.items.length}</td>
                    <td className="py-3 text-primary font-semibold">₹{order.totalAmount}</td>
                    <td className="py-3 capitalize text-muted-foreground">{order.paymentMethod || '-'}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        order.status === 'active' ? 'status-preparing' :
                        order.status === 'completed' ? 'status-available' : 'status-unavailable'
                      }`}>{order.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManagerDashboard;
