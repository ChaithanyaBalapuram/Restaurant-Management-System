import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRestaurant } from '@/context/RestaurantContext';
import DashboardLayout from '@/components/DashboardLayout';
import { sectionLabels } from '@/data/mockData';
import { Eye, Check, Clock, ChefHat, ToggleLeft, ToggleRight } from 'lucide-react';

const ChefDashboard = () => {
  const { orders, dishes, toggleDishAvailability, updateItemStatus } = useRestaurant();
  const [view, setView] = useState<'orders' | 'dishes'>('orders');
  const [selectedTable, setSelectedTable] = useState<number | null>(null);

  const activeOrders = orders.filter(o => o.status === 'active');
  const tables = [...new Set(activeOrders.map(o => o.tableNumber))].sort();

  const filteredOrders = selectedTable
    ? activeOrders.filter(o => o.tableNumber === selectedTable)
    : activeOrders;

  return (
    <DashboardLayout title="Chef Dashboard">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setView('orders')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${view === 'orders' ? 'gradient-bg text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
          Orders
        </button>
        <button onClick={() => setView('dishes')} className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${view === 'dishes' ? 'gradient-bg text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
          Manage Dishes
        </button>
      </div>

      {view === 'orders' && (
        <>
          <div className="flex gap-2 mb-4 flex-wrap">
            <button onClick={() => setSelectedTable(null)} className={`px-3 py-1.5 rounded-lg text-sm ${!selectedTable ? 'gradient-bg text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
              All Tables
            </button>
            {tables.map(t => (
              <button key={t} onClick={() => setSelectedTable(t)} className={`px-3 py-1.5 rounded-lg text-sm ${selectedTable === t ? 'gradient-bg text-primary-foreground' : 'bg-secondary text-secondary-foreground'}`}>
                Table {t}
              </button>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredOrders.map(order => (
              <motion.div key={order.id} layout className="glass-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-muted-foreground">{order.id} · {order.waiterName}</span>
                    <h3 className="text-lg font-heading font-bold text-foreground">Table {order.tableNumber}</h3>
                  </div>
                  <span className="text-xs text-muted-foreground">{Math.floor((Date.now() - order.createdAt.getTime()) / 60000)}m ago</span>
                </div>
                {order.items.filter(i => i.status !== 'cancelled').map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50 mb-2">
                    <div>
                      <span className="text-sm font-medium text-foreground">{item.dishName} × {item.quantity}</span>
                      {item.specialRequirements && <p className="text-xs text-warning mt-0.5">⚠️ {item.specialRequirements}</p>}
                      <p className="text-xs text-muted-foreground">{sectionLabels[item.section]}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === 'pending' && (
                        <button onClick={() => updateItemStatus(order.id, item.id, 'preparing')} className="px-3 py-1 rounded-lg bg-warning/20 text-warning text-xs font-medium hover:bg-warning/30">
                          Start
                        </button>
                      )}
                      {item.status === 'preparing' && (
                        <button onClick={() => updateItemStatus(order.id, item.id, 'ready')} className="px-3 py-1 rounded-lg bg-success/20 text-success text-xs font-medium hover:bg-success/30">
                          Ready
                        </button>
                      )}
                      {item.status === 'ready' && <span className="text-xs status-available px-2 py-0.5 rounded-full">Ready ✓</span>}
                      {item.status === 'served' && <span className="text-xs status-served px-2 py-0.5 rounded-full">Served</span>}
                    </div>
                  </div>
                ))}
                {order.compliment && <p className="text-xs text-success mt-2 bg-success/10 p-2 rounded-lg">⭐ {order.compliment}</p>}
                {order.complaint && <p className="text-xs text-destructive mt-2 bg-destructive/10 p-2 rounded-lg">⚠️ {order.complaint}</p>}
              </motion.div>
            ))}
          </div>
        </>
      )}

      {view === 'dishes' && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map(dish => (
            <div key={dish.id} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-semibold text-foreground">{dish.name}</h4>
                  <p className="text-xs text-muted-foreground">{sectionLabels[dish.section]} · ₹{dish.price}</p>
                </div>
                <button onClick={() => toggleDishAvailability(dish.id)} className={`p-2 rounded-lg transition-colors ${dish.available ? 'text-success' : 'text-destructive'}`}>
                  {dish.available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${dish.available ? 'status-available' : 'status-unavailable'}`}>
                {dish.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default ChefDashboard;
