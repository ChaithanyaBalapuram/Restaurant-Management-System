import { motion } from 'framer-motion';
import { useRestaurant } from '@/context/RestaurantContext';
import DashboardLayout from '@/components/DashboardLayout';
import { sectionLabels } from '@/data/mockData';
import { ToggleLeft, ToggleRight } from 'lucide-react';

const KitchenDashboard = () => {
  const { currentUser, orders, dishes, toggleDishAvailability, updateItemStatus } = useRestaurant();
  const section = currentUser?.section || '';
  const sectionName = sectionLabels[section] || section;

  const activeOrders = orders.filter(o => o.status === 'active');
  const sectionItems = activeOrders.flatMap(order =>
    order.items
      .filter(item => item.section === section && item.status !== 'cancelled' && item.status !== 'served')
      .map(item => ({ ...item, orderId: order.id, tableNumber: order.tableNumber, waiterName: order.waiterName }))
  );

  const sectionDishes = dishes.filter(d => d.section === section);

  return (
    <DashboardLayout title={`${sectionName} Kitchen`}>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">Incoming Orders</h2>
          {sectionItems.length === 0 ? (
            <div className="glass-card p-12 text-center text-muted-foreground">No pending orders for {sectionName}</div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {sectionItems.map(item => (
                <motion.div key={item.id} layout className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Table {item.tableNumber} · {item.waiterName}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === 'pending' ? 'bg-muted text-muted-foreground' :
                      item.status === 'preparing' ? 'status-preparing' : 'status-available'
                    }`}>{item.status}</span>
                  </div>
                  <h3 className="text-lg font-heading font-semibold text-foreground">{item.dishName} × {item.quantity}</h3>
                  {item.specialRequirements && (
                    <p className="text-sm text-warning mt-1 bg-warning/10 p-2 rounded">⚠️ {item.specialRequirements}</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    {item.status === 'pending' && (
                      <button onClick={() => updateItemStatus(item.orderId, item.id, 'preparing')} className="flex-1 py-2 rounded-lg bg-warning/20 text-warning text-sm font-medium hover:bg-warning/30">
                        Start Cooking
                      </button>
                    )}
                    {item.status === 'preparing' && (
                      <button onClick={() => updateItemStatus(item.orderId, item.id, 'ready')} className="flex-1 py-2 rounded-lg bg-success/20 text-success text-sm font-medium hover:bg-success/30">
                        Mark Ready
                      </button>
                    )}
                    {item.status === 'ready' && (
                      <span className="flex-1 py-2 rounded-lg text-center bg-success/20 text-success text-sm font-medium">✓ Ready for pickup</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-heading font-bold text-foreground mb-4">Dish Availability</h2>
          <div className="space-y-2">
            {sectionDishes.map(dish => (
              <div key={dish.id} className="glass-card p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-foreground">{dish.name}</span>
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${dish.available ? 'status-available' : 'status-unavailable'}`}>
                    {dish.available ? 'Available' : 'Out'}
                  </span>
                </div>
                <button onClick={() => toggleDishAvailability(dish.id)} className={`${dish.available ? 'text-success' : 'text-destructive'}`}>
                  {dish.available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KitchenDashboard;
