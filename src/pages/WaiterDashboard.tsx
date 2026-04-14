import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRestaurant } from '@/context/RestaurantContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, X, Eye, ShoppingCart, MessageSquare, AlertCircle, Check, Clock } from 'lucide-react';
import { Dish, OrderItem } from '@/types/restaurant';

const WaiterDashboard = () => {
  const { currentUser, dishes, orders, placeOrder, cancelOrder, cancelOrderItem, addComplaint, addCompliment } = useRestaurant();
  const [view, setView] = useState<'menu' | 'orders' | 'newOrder'>('orders');
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [tableNumber, setTableNumber] = useState('');
  const [cart, setCart] = useState<{ dish: Dish; quantity: number; requirements: string }[]>([]);
  const [feedbackOrderId, setFeedbackOrderId] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'complaint' | 'compliment'>('compliment');
  const [feedbackText, setFeedbackText] = useState('');

  const myOrders = orders.filter(o => o.waiterId === currentUser?.id && o.status === 'active');
  const availableDishes = dishes.filter(d => d.available);

  const addToCart = (dish: Dish) => {
    const existing = cart.find(c => c.dish.id === dish.id);
    if (existing) {
      setCart(cart.map(c => c.dish.id === dish.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { dish, quantity: 1, requirements: '' }]);
    }
  };

  const removeFromCart = (dishId: string) => {
    setCart(cart.filter(c => c.dish.id !== dishId));
  };

  const handlePlaceOrder = () => {
    if (!tableNumber || cart.length === 0 || !currentUser) return;
    const items: Omit<OrderItem, 'id' | 'status'>[] = cart.map(c => ({
      dishId: c.dish.id,
      dishName: c.dish.name,
      quantity: c.quantity,
      specialRequirements: c.requirements,
      section: c.dish.section,
    }));
    placeOrder(parseInt(tableNumber), items, currentUser.id, currentUser.name);
    setCart([]);
    setTableNumber('');
    setView('orders');
  };

  const submitFeedback = () => {
    if (!feedbackOrderId || !feedbackText) return;
    if (feedbackType === 'complaint') addComplaint(feedbackOrderId, feedbackText);
    else addCompliment(feedbackOrderId, feedbackText);
    setFeedbackOrderId(null);
    setFeedbackText('');
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-muted-foreground" />;
      case 'preparing': return <Clock className="w-4 h-4 text-warning" />;
      case 'ready': return <Check className="w-4 h-4 text-success" />;
      case 'served': return <Check className="w-4 h-4 text-primary" />;
      case 'cancelled': return <X className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  return (
    <DashboardLayout title="Waiter Dashboard">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(['orders', 'menu', 'newOrder'] as const).map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
              view === v ? 'gradient-bg text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            }`}
          >
            {v === 'newOrder' ? '+ New Order' : v === 'orders' ? 'My Orders' : 'Menu'}
          </button>
        ))}
      </div>

      {/* Active Orders */}
      {view === 'orders' && (
        <div className="grid gap-4 md:grid-cols-2">
          {myOrders.length === 0 && (
            <div className="col-span-2 glass-card p-12 text-center text-muted-foreground">No active orders</div>
          )}
          {myOrders.map(order => (
            <motion.div key={order.id} layout className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <span className="text-xs text-muted-foreground">{order.id}</span>
                  <h3 className="text-lg font-heading font-bold text-foreground">Table {order.tableNumber}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setFeedbackOrderId(order.id); setFeedbackType('compliment'); }} className="p-2 rounded-lg bg-success/10 text-success hover:bg-success/20">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setFeedbackOrderId(order.id); setFeedbackType('complaint'); }} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20">
                    <AlertCircle className="w-4 h-4" />
                  </button>
                  <button onClick={() => cancelOrder(order.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50">
                    <div className="flex items-center gap-2">
                      {statusIcon(item.status)}
                      <span className="text-sm text-foreground">{item.dishName} × {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        item.status === 'pending' ? 'bg-muted text-muted-foreground' :
                        item.status === 'preparing' ? 'status-preparing' :
                        item.status === 'ready' ? 'status-available' :
                        item.status === 'served' ? 'status-served' : 'status-unavailable'
                      }`}>{item.status}</span>
                      {item.status === 'pending' && (
                        <button onClick={() => cancelOrderItem(order.id, item.id)} className="text-destructive hover:text-destructive/80">
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                <span className="text-muted-foreground">Total</span>
                <span className="font-semibold text-primary">₹{order.totalAmount}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Menu View */}
      {view === 'menu' && (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {dishes.map(dish => (
            <motion.div
              key={dish.id}
              layout
              className={`glass-card p-4 ${!dish.available ? 'opacity-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{dish.name}</h3>
                  <p className="text-xs text-muted-foreground">{dish.category} · {dish.section.replace('_', ' ')}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">₹{dish.price}</span>
                  <button onClick={() => setSelectedDish(selectedDish?.id === dish.id ? null : dish)}>
                    <Eye className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>
              </div>
              <span className={`inline-block mt-2 text-xs px-2 py-0.5 rounded-full ${dish.available ? 'status-available' : 'status-unavailable'}`}>
                {dish.available ? 'Available' : 'Unavailable'}
              </span>
              <AnimatePresence>
                {selectedDish?.id === dish.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-3 pt-3 border-t border-border">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">INGREDIENTS</p>
                      <div className="space-y-1">
                        {dish.ingredients.map((ing, i) => (
                          <div key={i} className="flex justify-between text-xs text-foreground">
                            <span>{ing.name}</span>
                            <span className="text-muted-foreground">{ing.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      )}

      {/* New Order */}
      {view === 'newOrder' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-card p-4">
              <label className="text-sm font-medium text-muted-foreground">Table Number</label>
              <input
                type="number"
                value={tableNumber}
                onChange={e => setTableNumber(e.target.value)}
                placeholder="Enter table number"
                className="mt-1 w-full bg-secondary rounded-lg px-4 py-2.5 text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <h3 className="text-lg font-heading font-semibold text-foreground">Available Dishes</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {availableDishes.map(dish => (
                <button
                  key={dish.id}
                  onClick={() => addToCart(dish)}
                  className="glass-card p-4 text-left hover:glow-border transition-all cursor-pointer group"
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-heading font-semibold text-foreground">{dish.name}</h4>
                      <p className="text-xs text-muted-foreground">{dish.category}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-bold">₹{dish.price}</span>
                      <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart */}
          <div className="glass-card p-5 h-fit sticky top-24">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-primary" /> Cart
            </h3>
            {cart.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Add dishes to get started</p>
            ) : (
              <div className="space-y-3">
                {cart.map(item => (
                  <div key={item.dish.id} className="bg-secondary/50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-foreground">{item.dish.name}</span>
                      <button onClick={() => removeFromCart(item.dish.id)} className="text-destructive"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <button onClick={() => setCart(cart.map(c => c.dish.id === item.dish.id ? { ...c, quantity: Math.max(1, c.quantity - 1) } : c))} className="w-7 h-7 rounded bg-muted text-foreground flex items-center justify-center">-</button>
                      <span className="text-sm font-bold text-foreground">{item.quantity}</span>
                      <button onClick={() => setCart(cart.map(c => c.dish.id === item.dish.id ? { ...c, quantity: c.quantity + 1 } : c))} className="w-7 h-7 rounded bg-muted text-foreground flex items-center justify-center">+</button>
                      <span className="ml-auto text-sm text-primary font-semibold">₹{item.dish.price * item.quantity}</span>
                    </div>
                    <input
                      placeholder="Special requirements..."
                      value={item.requirements}
                      onChange={e => setCart(cart.map(c => c.dish.id === item.dish.id ? { ...c, requirements: e.target.value } : c))}
                      className="w-full bg-muted rounded px-3 py-1.5 text-xs text-foreground outline-none"
                    />
                  </div>
                ))}
                <div className="pt-3 border-t border-border flex justify-between font-semibold">
                  <span className="text-foreground">Total</span>
                  <span className="text-primary">₹{cart.reduce((s, c) => s + c.dish.price * c.quantity, 0)}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={!tableNumber || cart.length === 0}
                  className="w-full gradient-bg text-primary-foreground py-3 rounded-lg font-semibold disabled:opacity-50 transition-opacity"
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      <AnimatePresence>
        {feedbackOrderId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="glass-card p-6 w-full max-w-md">
              <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                {feedbackType === 'complaint' ? '⚠️ Add Complaint' : '⭐ Add Compliment'}
              </h3>
              <textarea
                value={feedbackText}
                onChange={e => setFeedbackText(e.target.value)}
                placeholder={`Enter ${feedbackType}...`}
                className="w-full bg-secondary rounded-lg px-4 py-3 text-foreground outline-none focus:ring-2 focus:ring-primary min-h-[100px] resize-none"
              />
              <div className="flex gap-2 mt-4">
                <button onClick={() => setFeedbackOrderId(null)} className="flex-1 bg-secondary text-secondary-foreground py-2.5 rounded-lg">Cancel</button>
                <button onClick={submitFeedback} className="flex-1 gradient-bg text-primary-foreground py-2.5 rounded-lg font-semibold">Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default WaiterDashboard;
